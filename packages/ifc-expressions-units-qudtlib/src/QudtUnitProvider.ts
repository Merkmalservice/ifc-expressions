import {
  Decimal,
  Prefix,
  Prefixes,
  Qudt,
  QuantityKind,
  QuantityKinds,
  Unit,
  Units,
} from "@qudtlib/allunits";
import type {
  IfcExpressionUnitProvider,
  IfcExpressionValueCatalog,
} from "ifc-expressions-units";

const unitKeysByIfcName = {
  AMPERE: "A",
  BECQUEREL: "BQ",
  CANDELA: "CD",
  COULOMB: "C",
  CUBIC_METRE: "M3",
  DEGREE_CELSIUS: "DEG_C",
  FARAD: "FARAD",
  GRAM: "GM",
  GRAY: "GRAY",
  HENRY: "H",
  HERTZ: "HZ",
  JOULE: "J",
  KELVIN: "K",
  LUMEN: "LM",
  LUX: "LUX",
  METRE: "M",
  MOLE: "MOL",
  NEWTON: "N",
  OHM: "OHM",
  PASCAL: "PA",
  RADIAN: "RAD",
  SECOND: "SEC",
  SIEMENS: "S",
  SIEVERT: "SV",
  SQUARE_METRE: "M2",
  STERADIAN: "SR",
  TESLA: "T",
  VOLT: "V",
  WATT: "W",
  WEBER: "WB",
} as const;

const prefixesByIfcName = {
  ATTO: Prefixes.Atto,
  CENTI: Prefixes.Centi,
  DECA: Prefixes.Deca,
  DECI: Prefixes.Deci,
  EXA: Prefixes.Exa,
  FEMTO: Prefixes.Femto,
  GIGA: Prefixes.Giga,
  HECTO: Prefixes.Hecto,
  KILO: Prefixes.Kilo,
  MEGA: Prefixes.Mega,
  MICRO: Prefixes.Micro,
  MILLI: Prefixes.Milli,
  NANO: Prefixes.Nano,
  PETA: Prefixes.Peta,
  PICO: Prefixes.Pico,
  TERA: Prefixes.Tera,
} as const;

const measureOverrides = {
  ELECTRICCAPACITANCE: QuantityKinds.Capacitance,
  ELECTRICCONDUCTANCE: QuantityKinds.ElectricalConductance,
  ELECTRICRESISTANCE: QuantityKinds.ElectricalResistance,
  ELECTRICVOLTAGE: QuantityKinds.Voltage,
  AREADENSITY: QuantityKinds.MassPerArea,
  INTEGERCOUNTRATE: QuantityKinds.CountRate,
  LINEARMOMENT: QuantityKinds.LinearTorque,
  MOLECULARWEIGHT: QuantityKinds.MolarMass,
  PH: QuantityKinds.Acidity,
  VOLUMETRICFLOWRATE: QuantityKinds.VolumeFlowRate,
} as const;

function normalizeName(name: string): string {
  return name.replace(/[^a-z0-9]/gi, "").toUpperCase();
}

function splitPortableUnitName(name: string):
  | {
      prefix?: Prefix;
      unitName: keyof typeof unitKeysByIfcName;
    }
  | undefined {
  if (name in unitKeysByIfcName) {
    return { unitName: name as keyof typeof unitKeysByIfcName };
  }
  const prefixName = Object.keys(prefixesByIfcName).find((candidate) =>
    name.startsWith(`${candidate}_`)
  ) as keyof typeof prefixesByIfcName | undefined;
  if (!prefixName) {
    return undefined;
  }
  const unitName = name.slice(prefixName.length + 1);
  if (!(unitName in unitKeysByIfcName)) {
    return undefined;
  }
  return {
    prefix: prefixesByIfcName[prefixName],
    unitName: unitName as keyof typeof unitKeysByIfcName,
  };
}

function syntheticScaledUnit(
  portableName: string,
  prefix: Prefix,
  base: Unit
): Unit {
  const unit = new Unit(
    `urn:ifc-expressions:IFC4X3_ADD2:unit:${portableName}`,
    base.quantityKindIris,
    [],
    base.dimensionVectorIri,
    base.conversionMultiplier.mul(prefix.multiplier),
    base.conversionOffset.div(prefix.multiplier),
    prefix.iri,
    base.iri,
    base,
    `${prefix.symbol}${base.symbol ?? base.getIriLocalname()}`,
    [],
    undefined,
    undefined,
    base.unitOfSystemIris,
    0,
    false,
    true
  );
  unit.setPrefix(prefix);
  return unit;
}

class LiteralObjectCatalog<T extends object>
  implements IfcExpressionValueCatalog<T>
{
  readonly name = "QUDT";
  private readonly names: ReadonlyArray<string>;

  constructor(private readonly values: Readonly<Record<string, T>>) {
    this.names = Object.keys(values);
  }

  resolve(name: string): T | undefined {
    return Object.prototype.hasOwnProperty.call(this.values, name)
      ? this.values[name]
      : undefined;
  }

  complete(prefix: string, limit: number) {
    const matches = this.names.filter((name) => name.startsWith(prefix));
    return {
      names: matches.slice(0, limit),
      isIncomplete: matches.length > limit || undefined,
    };
  }
}

export class QudtUnitProvider
  implements IfcExpressionUnitProvider<Unit, QuantityKind>
{
  readonly id = "QUDT";
  readonly unitCatalogs = [new LiteralObjectCatalog<Unit>(Units)] as const;
  readonly measureCatalogs = [
    new LiteralObjectCatalog<QuantityKind>(QuantityKinds),
  ] as const;

  private readonly units = new Map<string, Unit>();
  private readonly measuresByNormalizedName = new Map<string, QuantityKind>(
    Qudt.allQuantityKinds().map((quantityKind) => [
      normalizeName(quantityKind.getIriLocalname()),
      quantityKind,
    ])
  );

  resolveUnit(name: string): Unit | undefined {
    const existing = this.units.get(name);
    if (existing) {
      return existing;
    }
    const parts = splitPortableUnitName(name);
    if (!parts) {
      return undefined;
    }
    const base = Units[unitKeysByIfcName[parts.unitName]];
    if (!parts.prefix) {
      this.units.set(name, base);
      return base;
    }

    let resolved: Unit;
    try {
      resolved = Qudt.scale(parts.prefix, base);
    } catch {
      resolved = syntheticScaledUnit(name, parts.prefix, base);
    }
    this.units.set(name, resolved);
    return resolved;
  }

  resolveMeasure(name: string): QuantityKind | undefined {
    return (
      measureOverrides[name as keyof typeof measureOverrides] ??
      this.measuresByNormalizedName.get(normalizeName(name))
    );
  }

  unitsEqual(left: Unit, right: Unit): boolean {
    return left.equals(right);
  }

  measuresEqual(left: QuantityKind, right: QuantityKind): boolean {
    return left.equals(right);
  }

  convert(value: number, from: Unit, to: Unit): number {
    return Qudt.convert(new Decimal(value), from, to).toNumber();
  }

  isConvertible(from: Unit, to: Unit): boolean {
    return Qudt.isConvertible(from, to);
  }

  isSubKindOf(actual: QuantityKind, broader: QuantityKind): boolean {
    return (
      actual.equals(broader) || Qudt.isBroaderQuantityKind(broader, actual)
    );
  }
}

export const qudtUnitProvider = new QudtUnitProvider();
