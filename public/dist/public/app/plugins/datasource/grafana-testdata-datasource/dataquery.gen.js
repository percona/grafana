// Code generated - EDITING IS FUTILE. DO NOT EDIT.
//
// Generated by:
//     public/app/plugins/gen.go
// Using jennies:
//     TSTypesJenny
//     PluginTSTypesJenny
//
// Run 'make gen-cue' from repository root to regenerate.
export var TestDataQueryType;
(function (TestDataQueryType) {
    TestDataQueryType["Annotations"] = "annotations";
    TestDataQueryType["Arrow"] = "arrow";
    TestDataQueryType["CSVContent"] = "csv_content";
    TestDataQueryType["CSVFile"] = "csv_file";
    TestDataQueryType["CSVMetricValues"] = "csv_metric_values";
    TestDataQueryType["DataPointsOutsideRange"] = "datapoints_outside_range";
    TestDataQueryType["ExponentialHeatmapBucketData"] = "exponential_heatmap_bucket_data";
    TestDataQueryType["FlameGraph"] = "flame_graph";
    TestDataQueryType["GrafanaAPI"] = "grafana_api";
    TestDataQueryType["LinearHeatmapBucketData"] = "linear_heatmap_bucket_data";
    TestDataQueryType["Live"] = "live";
    TestDataQueryType["Logs"] = "logs";
    TestDataQueryType["ManualEntry"] = "manual_entry";
    TestDataQueryType["NoDataPoints"] = "no_data_points";
    TestDataQueryType["NodeGraph"] = "node_graph";
    TestDataQueryType["PredictableCSVWave"] = "predictable_csv_wave";
    TestDataQueryType["PredictablePulse"] = "predictable_pulse";
    TestDataQueryType["RandomWalk"] = "random_walk";
    TestDataQueryType["RandomWalkTable"] = "random_walk_table";
    TestDataQueryType["RandomWalkWithError"] = "random_walk_with_error";
    TestDataQueryType["RawFrame"] = "raw_frame";
    TestDataQueryType["ServerError500"] = "server_error_500";
    TestDataQueryType["Simulation"] = "simulation";
    TestDataQueryType["SlowQuery"] = "slow_query";
    TestDataQueryType["StreamingClient"] = "streaming_client";
    TestDataQueryType["TableStatic"] = "table_static";
    TestDataQueryType["Trace"] = "trace";
    TestDataQueryType["USA"] = "usa";
    TestDataQueryType["VariablesQuery"] = "variables-query";
})(TestDataQueryType || (TestDataQueryType = {}));
export const defaultUSAQuery = {
    fields: [],
    states: [],
};
export const defaultTestData = {
    csvWave: [],
    points: [],
    scenarioId: TestDataQueryType.RandomWalk,
};
//# sourceMappingURL=dataquery.gen.js.map