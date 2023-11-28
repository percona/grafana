export default class UrlBuilder {
    static buildResourceUri(templateSrv, resource, multipleResources) {
        const urlArray = [];
        const { subscription, resourceGroup, metricNamespace, resourceName } = resource;
        if (subscription) {
            urlArray.push('/subscriptions', subscription);
            if (resourceGroup && !multipleResources) {
                urlArray.push('resourceGroups', resourceGroup);
                if (metricNamespace && resourceName) {
                    const metricNamespaceProcessed = templateSrv.replace(metricNamespace);
                    const metricNamespaceArray = metricNamespace.split('/');
                    const resourceNameProcessed = templateSrv.replace(resourceName);
                    const resourceNameArray = resourceName.split('/');
                    const provider = metricNamespaceArray.shift();
                    if (provider) {
                        urlArray.push('providers', provider);
                    }
                    if (metricNamespaceProcessed.toLowerCase().startsWith('microsoft.storage/storageaccounts/') &&
                        !resourceNameProcessed.endsWith('default')) {
                        resourceNameArray.push('default');
                    }
                    if (resourceNameArray.length > metricNamespaceArray.length) {
                        const parentResource = resourceNameArray.shift();
                        if (parentResource) {
                            urlArray.push(parentResource);
                        }
                    }
                    for (const i in metricNamespaceArray) {
                        urlArray.push(metricNamespaceArray[i]);
                        urlArray.push(resourceNameArray[i]);
                    }
                }
            }
        }
        return urlArray.join('/');
    }
    static buildAzureMonitorGetMetricNamespacesUrl(baseUrl, apiVersion, query, globalRegion, templateSrv) {
        let resourceUri;
        if ('resourceUri' in query) {
            resourceUri = query.resourceUri;
        }
        else {
            const { subscription, resourceGroup, metricNamespace, resourceName } = query;
            resourceUri = UrlBuilder.buildResourceUri(templateSrv, {
                subscription,
                resourceGroup,
                metricNamespace,
                resourceName,
            });
        }
        return `${baseUrl}${resourceUri}/providers/microsoft.insights/metricNamespaces?api-version=${apiVersion}${globalRegion ? '&region=global' : ''}`;
    }
    static buildAzureMonitorGetMetricNamesUrl(baseUrl, apiVersion, query, templateSrv, multipleResources, region) {
        let resourceUri;
        const { customNamespace, metricNamespace } = query;
        if ('resourceUri' in query) {
            resourceUri = query.resourceUri;
        }
        else {
            const { subscription, resourceGroup, metricNamespace, resourceName } = query;
            resourceUri = UrlBuilder.buildResourceUri(templateSrv, {
                subscription,
                resourceGroup,
                metricNamespace,
                resourceName,
            }, multipleResources);
        }
        let url = `${baseUrl}${resourceUri}/providers/microsoft.insights/metricdefinitions?api-version=${apiVersion}`;
        if (customNamespace) {
            url += `&metricnamespace=${encodeURIComponent(customNamespace)}`;
        }
        if (multipleResources && !customNamespace && metricNamespace) {
            url += `&metricnamespace=${encodeURIComponent(metricNamespace)}`;
            if (region) {
                url += `&region=${region}`;
            }
        }
        return url;
    }
}
//# sourceMappingURL=url_builder.js.map