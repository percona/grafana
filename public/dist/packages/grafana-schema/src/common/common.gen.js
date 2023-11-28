// Code generated - EDITING IS FUTILE. DO NOT EDIT.
//
// Generated by:
//     kinds/gen.go
// Using jennies:
//     CommonSchemaJenny
//
// Run 'make gen-cue' from repository root to regenerate.
export var ScaleDimensionMode;
(function (ScaleDimensionMode) {
    ScaleDimensionMode["Linear"] = "linear";
    ScaleDimensionMode["Quad"] = "quad";
})(ScaleDimensionMode || (ScaleDimensionMode = {}));
export var ScalarDimensionMode;
(function (ScalarDimensionMode) {
    ScalarDimensionMode["Clamped"] = "clamped";
    ScalarDimensionMode["Mod"] = "mod";
})(ScalarDimensionMode || (ScalarDimensionMode = {}));
export var TextDimensionMode;
(function (TextDimensionMode) {
    TextDimensionMode["Field"] = "field";
    TextDimensionMode["Fixed"] = "fixed";
    TextDimensionMode["Template"] = "template";
})(TextDimensionMode || (TextDimensionMode = {}));
export var ResourceDimensionMode;
(function (ResourceDimensionMode) {
    ResourceDimensionMode["Field"] = "field";
    ResourceDimensionMode["Fixed"] = "fixed";
    ResourceDimensionMode["Mapping"] = "mapping";
})(ResourceDimensionMode || (ResourceDimensionMode = {}));
export var FrameGeometrySourceMode;
(function (FrameGeometrySourceMode) {
    FrameGeometrySourceMode["Auto"] = "auto";
    FrameGeometrySourceMode["Coords"] = "coords";
    FrameGeometrySourceMode["Geohash"] = "geohash";
    FrameGeometrySourceMode["Lookup"] = "lookup";
})(FrameGeometrySourceMode || (FrameGeometrySourceMode = {}));
export var HeatmapCalculationMode;
(function (HeatmapCalculationMode) {
    HeatmapCalculationMode["Count"] = "count";
    HeatmapCalculationMode["Size"] = "size";
})(HeatmapCalculationMode || (HeatmapCalculationMode = {}));
export var HeatmapCellLayout;
(function (HeatmapCellLayout) {
    HeatmapCellLayout["auto"] = "auto";
    HeatmapCellLayout["ge"] = "ge";
    HeatmapCellLayout["le"] = "le";
    HeatmapCellLayout["unknown"] = "unknown";
})(HeatmapCellLayout || (HeatmapCellLayout = {}));
export var LogsSortOrder;
(function (LogsSortOrder) {
    LogsSortOrder["Ascending"] = "Ascending";
    LogsSortOrder["Descending"] = "Descending";
})(LogsSortOrder || (LogsSortOrder = {}));
/**
 * TODO docs
 */
export var AxisPlacement;
(function (AxisPlacement) {
    AxisPlacement["Auto"] = "auto";
    AxisPlacement["Bottom"] = "bottom";
    AxisPlacement["Hidden"] = "hidden";
    AxisPlacement["Left"] = "left";
    AxisPlacement["Right"] = "right";
    AxisPlacement["Top"] = "top";
})(AxisPlacement || (AxisPlacement = {}));
/**
 * TODO docs
 */
export var AxisColorMode;
(function (AxisColorMode) {
    AxisColorMode["Series"] = "series";
    AxisColorMode["Text"] = "text";
})(AxisColorMode || (AxisColorMode = {}));
/**
 * TODO docs
 */
export var VisibilityMode;
(function (VisibilityMode) {
    VisibilityMode["Always"] = "always";
    VisibilityMode["Auto"] = "auto";
    VisibilityMode["Never"] = "never";
})(VisibilityMode || (VisibilityMode = {}));
/**
 * TODO docs
 */
export var GraphDrawStyle;
(function (GraphDrawStyle) {
    GraphDrawStyle["Bars"] = "bars";
    GraphDrawStyle["Line"] = "line";
    GraphDrawStyle["Points"] = "points";
})(GraphDrawStyle || (GraphDrawStyle = {}));
/**
 * TODO docs
 */
export var GraphTransform;
(function (GraphTransform) {
    GraphTransform["Constant"] = "constant";
    GraphTransform["NegativeY"] = "negative-Y";
})(GraphTransform || (GraphTransform = {}));
/**
 * TODO docs
 */
export var LineInterpolation;
(function (LineInterpolation) {
    LineInterpolation["Linear"] = "linear";
    LineInterpolation["Smooth"] = "smooth";
    LineInterpolation["StepAfter"] = "stepAfter";
    LineInterpolation["StepBefore"] = "stepBefore";
})(LineInterpolation || (LineInterpolation = {}));
/**
 * TODO docs
 */
export var ScaleDistribution;
(function (ScaleDistribution) {
    ScaleDistribution["Linear"] = "linear";
    ScaleDistribution["Log"] = "log";
    ScaleDistribution["Ordinal"] = "ordinal";
    ScaleDistribution["Symlog"] = "symlog";
})(ScaleDistribution || (ScaleDistribution = {}));
/**
 * TODO docs
 */
export var GraphGradientMode;
(function (GraphGradientMode) {
    GraphGradientMode["Hue"] = "hue";
    GraphGradientMode["None"] = "none";
    GraphGradientMode["Opacity"] = "opacity";
    GraphGradientMode["Scheme"] = "scheme";
})(GraphGradientMode || (GraphGradientMode = {}));
/**
 * TODO docs
 */
export var StackingMode;
(function (StackingMode) {
    StackingMode["None"] = "none";
    StackingMode["Normal"] = "normal";
    StackingMode["Percent"] = "percent";
})(StackingMode || (StackingMode = {}));
/**
 * TODO docs
 */
export var BarAlignment;
(function (BarAlignment) {
    BarAlignment[BarAlignment["After"] = 1] = "After";
    BarAlignment[BarAlignment["Before"] = -1] = "Before";
    BarAlignment[BarAlignment["Center"] = 0] = "Center";
})(BarAlignment || (BarAlignment = {}));
/**
 * TODO docs
 */
export var ScaleOrientation;
(function (ScaleOrientation) {
    ScaleOrientation[ScaleOrientation["Horizontal"] = 0] = "Horizontal";
    ScaleOrientation[ScaleOrientation["Vertical"] = 1] = "Vertical";
})(ScaleOrientation || (ScaleOrientation = {}));
/**
 * TODO docs
 */
export var ScaleDirection;
(function (ScaleDirection) {
    ScaleDirection[ScaleDirection["Down"] = -1] = "Down";
    ScaleDirection[ScaleDirection["Left"] = -1] = "Left";
    ScaleDirection[ScaleDirection["Right"] = 1] = "Right";
    ScaleDirection[ScaleDirection["Up"] = 1] = "Up";
})(ScaleDirection || (ScaleDirection = {}));
export const defaultLineStyle = {
    dash: [],
};
/**
 * TODO docs
 */
export var GraphTresholdsStyleMode;
(function (GraphTresholdsStyleMode) {
    GraphTresholdsStyleMode["Area"] = "area";
    GraphTresholdsStyleMode["Dashed"] = "dashed";
    GraphTresholdsStyleMode["DashedAndArea"] = "dashed+area";
    GraphTresholdsStyleMode["Line"] = "line";
    GraphTresholdsStyleMode["LineAndArea"] = "line+area";
    GraphTresholdsStyleMode["Off"] = "off";
    GraphTresholdsStyleMode["Series"] = "series";
})(GraphTresholdsStyleMode || (GraphTresholdsStyleMode = {}));
/**
 * TODO docs
 * Note: "hidden" needs to remain as an option for plugins compatibility
 */
export var LegendDisplayMode;
(function (LegendDisplayMode) {
    LegendDisplayMode["Hidden"] = "hidden";
    LegendDisplayMode["List"] = "list";
    LegendDisplayMode["Table"] = "table";
})(LegendDisplayMode || (LegendDisplayMode = {}));
export const defaultReduceDataOptions = {
    calcs: [],
};
/**
 * TODO docs
 */
export var VizOrientation;
(function (VizOrientation) {
    VizOrientation["Auto"] = "auto";
    VizOrientation["Horizontal"] = "horizontal";
    VizOrientation["Vertical"] = "vertical";
})(VizOrientation || (VizOrientation = {}));
export const defaultOptionsWithTimezones = {
    timezone: [],
};
/**
 * TODO docs
 */
export var BigValueColorMode;
(function (BigValueColorMode) {
    BigValueColorMode["Background"] = "background";
    BigValueColorMode["BackgroundSolid"] = "background_solid";
    BigValueColorMode["None"] = "none";
    BigValueColorMode["Value"] = "value";
})(BigValueColorMode || (BigValueColorMode = {}));
/**
 * TODO docs
 */
export var BigValueGraphMode;
(function (BigValueGraphMode) {
    BigValueGraphMode["Area"] = "area";
    BigValueGraphMode["Line"] = "line";
    BigValueGraphMode["None"] = "none";
})(BigValueGraphMode || (BigValueGraphMode = {}));
/**
 * TODO docs
 */
export var BigValueJustifyMode;
(function (BigValueJustifyMode) {
    BigValueJustifyMode["Auto"] = "auto";
    BigValueJustifyMode["Center"] = "center";
})(BigValueJustifyMode || (BigValueJustifyMode = {}));
/**
 * TODO docs
 */
export var BigValueTextMode;
(function (BigValueTextMode) {
    BigValueTextMode["Auto"] = "auto";
    BigValueTextMode["Name"] = "name";
    BigValueTextMode["None"] = "none";
    BigValueTextMode["Value"] = "value";
    BigValueTextMode["ValueAndName"] = "value_and_name";
})(BigValueTextMode || (BigValueTextMode = {}));
/**
 * TODO docs
 */
export var TooltipDisplayMode;
(function (TooltipDisplayMode) {
    TooltipDisplayMode["Multi"] = "multi";
    TooltipDisplayMode["None"] = "none";
    TooltipDisplayMode["Single"] = "single";
})(TooltipDisplayMode || (TooltipDisplayMode = {}));
/**
 * TODO docs
 */
export var SortOrder;
(function (SortOrder) {
    SortOrder["Ascending"] = "asc";
    SortOrder["Descending"] = "desc";
    SortOrder["None"] = "none";
})(SortOrder || (SortOrder = {}));
export const defaultVizLegendOptions = {
    calcs: [],
};
/**
 * Enum expressing the possible display modes
 * for the bar gauge component of Grafana UI
 */
export var BarGaugeDisplayMode;
(function (BarGaugeDisplayMode) {
    BarGaugeDisplayMode["Basic"] = "basic";
    BarGaugeDisplayMode["Gradient"] = "gradient";
    BarGaugeDisplayMode["Lcd"] = "lcd";
})(BarGaugeDisplayMode || (BarGaugeDisplayMode = {}));
/**
 * Allows for the table cell gauge display type to set the gauge mode.
 */
export var BarGaugeValueMode;
(function (BarGaugeValueMode) {
    BarGaugeValueMode["Color"] = "color";
    BarGaugeValueMode["Hidden"] = "hidden";
    BarGaugeValueMode["Text"] = "text";
})(BarGaugeValueMode || (BarGaugeValueMode = {}));
/**
 * Allows for the bar gauge name to be placed explicitly
 */
export var BarGaugeNamePlacement;
(function (BarGaugeNamePlacement) {
    BarGaugeNamePlacement["Auto"] = "auto";
    BarGaugeNamePlacement["Left"] = "left";
    BarGaugeNamePlacement["Top"] = "top";
})(BarGaugeNamePlacement || (BarGaugeNamePlacement = {}));
/**
 * Internally, this is the "type" of cell that's being displayed
 * in the table such as colored text, JSON, gauge, etc.
 * The color-background-solid, gradient-gauge, and lcd-gauge
 * modes are deprecated in favor of new cell subOptions
 */
export var TableCellDisplayMode;
(function (TableCellDisplayMode) {
    TableCellDisplayMode["Auto"] = "auto";
    TableCellDisplayMode["BasicGauge"] = "basic";
    TableCellDisplayMode["ColorBackground"] = "color-background";
    TableCellDisplayMode["ColorBackgroundSolid"] = "color-background-solid";
    TableCellDisplayMode["ColorText"] = "color-text";
    TableCellDisplayMode["Custom"] = "custom";
    TableCellDisplayMode["Gauge"] = "gauge";
    TableCellDisplayMode["GradientGauge"] = "gradient-gauge";
    TableCellDisplayMode["Image"] = "image";
    TableCellDisplayMode["JSONView"] = "json-view";
    TableCellDisplayMode["LcdGauge"] = "lcd-gauge";
    TableCellDisplayMode["Sparkline"] = "sparkline";
})(TableCellDisplayMode || (TableCellDisplayMode = {}));
/**
 * Display mode to the "Colored Background" display
 * mode for table cells. Either displays a solid color (basic mode)
 * or a gradient.
 */
export var TableCellBackgroundDisplayMode;
(function (TableCellBackgroundDisplayMode) {
    TableCellBackgroundDisplayMode["Basic"] = "basic";
    TableCellBackgroundDisplayMode["Gradient"] = "gradient";
})(TableCellBackgroundDisplayMode || (TableCellBackgroundDisplayMode = {}));
export const defaultTableFooterOptions = {
    fields: [],
    reducer: [],
};
/**
 * Height of a table cell
 */
export var TableCellHeight;
(function (TableCellHeight) {
    TableCellHeight["Lg"] = "lg";
    TableCellHeight["Md"] = "md";
    TableCellHeight["Sm"] = "sm";
})(TableCellHeight || (TableCellHeight = {}));
/**
 * Optional formats for the template variable replace functions
 * See also https://grafana.com/docs/grafana/latest/dashboards/variables/variable-syntax/#advanced-variable-format-options
 */
export var VariableFormatID;
(function (VariableFormatID) {
    VariableFormatID["CSV"] = "csv";
    VariableFormatID["Date"] = "date";
    VariableFormatID["Distributed"] = "distributed";
    VariableFormatID["DoubleQuote"] = "doublequote";
    VariableFormatID["Glob"] = "glob";
    VariableFormatID["HTML"] = "html";
    VariableFormatID["JSON"] = "json";
    VariableFormatID["Lucene"] = "lucene";
    VariableFormatID["PercentEncode"] = "percentencode";
    VariableFormatID["Pipe"] = "pipe";
    VariableFormatID["QueryParam"] = "queryparam";
    VariableFormatID["Raw"] = "raw";
    VariableFormatID["Regex"] = "regex";
    VariableFormatID["SQLString"] = "sqlstring";
    VariableFormatID["SingleQuote"] = "singlequote";
    VariableFormatID["Text"] = "text";
    VariableFormatID["UriEncode"] = "uriencode";
})(VariableFormatID || (VariableFormatID = {}));
export var LogsDedupStrategy;
(function (LogsDedupStrategy) {
    LogsDedupStrategy["exact"] = "exact";
    LogsDedupStrategy["none"] = "none";
    LogsDedupStrategy["numbers"] = "numbers";
    LogsDedupStrategy["signature"] = "signature";
})(LogsDedupStrategy || (LogsDedupStrategy = {}));
/**
 * Compare two values
 */
export var ComparisonOperation;
(function (ComparisonOperation) {
    ComparisonOperation["EQ"] = "eq";
    ComparisonOperation["GT"] = "gt";
    ComparisonOperation["GTE"] = "gte";
    ComparisonOperation["LT"] = "lt";
    ComparisonOperation["LTE"] = "lte";
    ComparisonOperation["NEQ"] = "neq";
})(ComparisonOperation || (ComparisonOperation = {}));
export const defaultTableFieldOptions = {
    align: 'auto',
    inspect: false,
};
export const defaultTimeZone = 'browser';
//# sourceMappingURL=common.gen.js.map