import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import { IHostNavigationService, ILocationService, IProjectPageService } from "azure-devops-extension-api";

SDK.register("planning-poker-context-menu", () => {
    return {
        execute: async (actionContext: any) => {
            var extensionContext = SDK.getExtensionContext();
            let workItemIds: number[] | undefined;
            if (actionContext.rows) {
                workItemIds = actionContext.rows.map((row: any[]) => parseInt(row[0], 10));
            } else {
                workItemIds = actionContext.workItemIds || [];
            }

            const projectPageService = await SDK.getService<IProjectPageService>("ms.vss-tfs-web.tfs-page-data-service");
            const projectInfo = await projectPageService.getProject();

            if (workItemIds && projectInfo) {
                const locationService = await SDK.getService<ILocationService>("ms.vss-features.location-service");
                const url = await locationService.routeUrl(
                    "ms.vss-web.fallback-route-new-platform",
                    {
                        project: projectInfo.name,
                        parameters: `${extensionContext.publisherId}.${extensionContext.extensionId}.planning-poker-hub`
                    }
                );
                const nav = await SDK.getService<IHostNavigationService>("ms.vss-features.host-navigation-service");
                nav.navigate(`${url}#/create/${workItemIds.join(",")}`);
            }
        }
    }
});

SDK.init();