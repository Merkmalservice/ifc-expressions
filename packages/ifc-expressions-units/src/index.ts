export {
  IFC_PORTABLE_CATALOG_SOURCE,
  IFC_PORTABLE_MEASURE_NAMES,
  IFC_PORTABLE_UNIT_NAMES,
  IFC_SI_PREFIXES,
  IFC_SI_UNIT_NAMES,
} from "./catalogs.js";
export type {
  IfcPortableMeasureName,
  IfcPortableUnitName,
  IfcSiPrefix,
  IfcSiUnitName,
} from "./catalogs.js";
export { IfcExpressionUnitsConfigurationError } from "./provider.js";
export type {
  IfcExpressionCatalogCompletion,
  IfcExpressionUnitProvider,
  IfcExpressionValueCatalog,
} from "./provider.js";
export { createIfcExpressionUnitsEnvironment } from "./environment.js";
export type { IfcExpressionUnitsEnvironment } from "./environment.js";
