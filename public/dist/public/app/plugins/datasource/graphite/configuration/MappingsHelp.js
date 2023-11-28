import React from 'react';
import { Alert } from '@grafana/ui';
export default function MappingsHelp(props) {
    return (React.createElement(Alert, { severity: "info", title: "How to map Graphite metrics to labels?", onRemove: props.onDismiss },
        React.createElement("p", null, "Mappings are currently supported only between Graphite and Loki queries."),
        React.createElement("p", null, "When you switch your data source from Graphite to Loki, your queries are mapped according to the mappings defined in the example below. To define a mapping, write the full path of the metric and replace nodes you want to map to label with the label name in parentheses. The value of the label is extracted from your Graphite query when you switch data sources."),
        React.createElement("p", null, "All tags are automatically mapped to labels regardless of the mapping configuration. Graphite matching patterns (using {}) are converted to Loki's regular expressions matching patterns. When you use functions in your queries, the metrics, and tags are extracted to match them with defined mappings."),
        React.createElement("p", null,
            "Example: for a mapping = ",
            React.createElement("code", null, "servers.(cluster).(server).*"),
            ":"),
        React.createElement("table", null,
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "Graphite query"),
                    React.createElement("th", null, "Mapped to Loki query"))),
            React.createElement("tbody", null,
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement("code", null,
                            "alias(servers.",
                            React.createElement("u", null, "west"),
                            ".",
                            React.createElement("u", null, "001"),
                            ".cpu,1,2)")),
                    React.createElement("td", null,
                        React.createElement("code", null,
                            "{cluster=\"",
                            React.createElement("u", null, "west"),
                            "\", server=\"",
                            React.createElement("u", null, "001"),
                            "\"}"))),
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement("code", null,
                            "alias(servers.*.",
                            React.createElement("u", null, "{001,002}"),
                            ".*,1,2)")),
                    React.createElement("td", null,
                        React.createElement("code", null,
                            "{server=~\"",
                            React.createElement("u", null, "(001|002)"),
                            "\"}"))),
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement("code", null, "interpolate(seriesByTag('foo=bar', 'server=002'), inf))")),
                    React.createElement("td", null,
                        React.createElement("code", null, "{foo=\"bar\", server=\"002\"}")))))));
}
//# sourceMappingURL=MappingsHelp.js.map