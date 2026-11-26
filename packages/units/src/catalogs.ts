/** The normative IFC release from which portable names are generated. */
export const IFC_PORTABLE_CATALOG_SOURCE = {
  schema: "IFC4X3_ADD2",
  release: "IFC 4.3.2.0",
  siUnitNames:
    "https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcSIUnitName.htm",
  siPrefixes:
    "https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcSIPrefix.htm",
  unitMeasures:
    "https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcUnitEnum.htm",
  derivedMeasures:
    "https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/lexical/IfcDerivedUnitEnum.htm",
} as const;

export const IFC_SI_UNIT_NAMES = [
  "AMPERE",
  "BECQUEREL",
  "CANDELA",
  "COULOMB",
  "CUBIC_METRE",
  "DEGREE_CELSIUS",
  "FARAD",
  "GRAM",
  "GRAY",
  "HENRY",
  "HERTZ",
  "JOULE",
  "KELVIN",
  "LUMEN",
  "LUX",
  "METRE",
  "MOLE",
  "NEWTON",
  "OHM",
  "PASCAL",
  "RADIAN",
  "SECOND",
  "SIEMENS",
  "SIEVERT",
  "SQUARE_METRE",
  "STERADIAN",
  "TESLA",
  "VOLT",
  "WATT",
  "WEBER",
] as const;

export const IFC_SI_PREFIXES = [
  "ATTO",
  "CENTI",
  "DECA",
  "DECI",
  "EXA",
  "FEMTO",
  "GIGA",
  "HECTO",
  "KILO",
  "MEGA",
  "MICRO",
  "MILLI",
  "NANO",
  "PETA",
  "PICO",
  "TERA",
] as const;

export type IfcSiUnitName = (typeof IFC_SI_UNIT_NAMES)[number];
export type IfcSiPrefix = (typeof IFC_SI_PREFIXES)[number];
export type IfcPortableUnitName =
  | IfcSiUnitName
  | `${IfcSiPrefix}_${IfcSiUnitName}`;

/**
 * Portable IFC spellings for every unprefixed and prefixed IfcSIUnit allowed
 * by the IFC4X3_ADD2 schema.
 */
export const IFC_PORTABLE_UNIT_NAMES: ReadonlyArray<IfcPortableUnitName> = [
  ...IFC_SI_UNIT_NAMES,
  ...IFC_SI_PREFIXES.flatMap((prefix) =>
    IFC_SI_UNIT_NAMES.map((unit): IfcPortableUnitName => `${prefix}_${unit}`)
  ),
];

/**
 * Portable measure names derived from IfcUnitEnum and IfcDerivedUnitEnum.
 * The trailing UNIT is removed because these constants denote measures, not
 * units. USERDEFINED is deliberately excluded because it has no stable
 * provider-independent identity.
 */
export const IFC_PORTABLE_MEASURE_NAMES = [
  "ABSORBEDDOSE",
  "AMOUNTOFSUBSTANCE",
  "AREA",
  "DOSEEQUIVALENT",
  "ELECTRICCAPACITANCE",
  "ELECTRICCHARGE",
  "ELECTRICCONDUCTANCE",
  "ELECTRICCURRENT",
  "ELECTRICRESISTANCE",
  "ELECTRICVOLTAGE",
  "ENERGY",
  "FORCE",
  "FREQUENCY",
  "ILLUMINANCE",
  "INDUCTANCE",
  "LENGTH",
  "LUMINOUSFLUX",
  "LUMINOUSINTENSITY",
  "MAGNETICFLUXDENSITY",
  "MAGNETICFLUX",
  "MASS",
  "PLANEANGLE",
  "POWER",
  "PRESSURE",
  "RADIOACTIVITY",
  "SOLIDANGLE",
  "THERMODYNAMICTEMPERATURE",
  "TIME",
  "VOLUME",
  "ACCELERATION",
  "ANGULARVELOCITY",
  "AREADENSITY",
  "COMPOUNDPLANEANGLE",
  "CURVATURE",
  "DYNAMICVISCOSITY",
  "HEATFLUXDENSITY",
  "HEATINGVALUE",
  "INTEGERCOUNTRATE",
  "IONCONCENTRATION",
  "ISOTHERMALMOISTURECAPACITY",
  "KINEMATICVISCOSITY",
  "LINEARFORCE",
  "LINEARMOMENT",
  "LINEARSTIFFNESS",
  "LINEARVELOCITY",
  "LUMINOUSINTENSITYDISTRIBUTION",
  "MASSDENSITY",
  "MASSFLOWRATE",
  "MASSPERLENGTH",
  "MODULUSOFELASTICITY",
  "MODULUSOFLINEARSUBGRADEREACTION",
  "MODULUSOFROTATIONALSUBGRADEREACTION",
  "MODULUSOFSUBGRADEREACTION",
  "MOISTUREDIFFUSIVITY",
  "MOLECULARWEIGHT",
  "MOMENTOFINERTIA",
  "PH",
  "PLANARFORCE",
  "ROTATIONALFREQUENCY",
  "ROTATIONALMASS",
  "ROTATIONALSTIFFNESS",
  "SECTIONAREAINTEGRAL",
  "SECTIONMODULUS",
  "SHEARMODULUS",
  "SOUNDPOWERLEVEL",
  "SOUNDPOWER",
  "SOUNDPRESSURELEVEL",
  "SOUNDPRESSURE",
  "SPECIFICHEATCAPACITY",
  "TEMPERATUREGRADIENT",
  "TEMPERATURERATEOFCHANGE",
  "THERMALADMITTANCE",
  "THERMALCONDUCTANCE",
  "THERMALEXPANSIONCOEFFICIENT",
  "THERMALRESISTANCE",
  "THERMALTRANSMITTANCE",
  "TORQUE",
  "VAPORPERMEABILITY",
  "VOLUMETRICFLOWRATE",
  "WARPINGCONSTANT",
  "WARPINGMOMENT",
] as const;

export type IfcPortableMeasureName =
  (typeof IFC_PORTABLE_MEASURE_NAMES)[number];
