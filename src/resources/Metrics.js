//import { Readable, pipeline } from "stream";
//import util from "util";
import { register, Gauge } from "prom-client";

const flowRate = new Gauge({
    name: 'flow_rate',
    help: 'Instantaneous water flow rate',
    labelNames: ['organization', 'site', 'measurementPoint'],
    /*     collect() {
            // collect is invoked each time `register.metrics()` is called.
            //this.inc();
            this.set({ organization: 'org1', site: 'siteA', measurementPoint: 'filter_plant_1_outlet' }, Math.random());
            this.set({ organization: 'org1', site: 'siteA', measurementPoint: 'filter_plant_2_outlet' }, Math.random());
            this.set({ organization: 'org1', site: 'siteB', measurementPoint: 'filter_plant_1_outlet' }, Math.random());
        }, */
});

register.registerMetric(flowRate);

export const Metrics = {
    get: {
        method: "GET",
        path: "/metrics",
        options: {
            description: "Implementing the /metrics endpoint for prometheus to scrape",
        },
        handler: async function (request, h) {
            flowRate.set({ organization: 'org1', site: 'siteA', measurementPoint: 'filter_plant_1_outlet' }, Math.random());
            flowRate.set({ organization: 'org1', site: 'siteA', measurementPoint: 'filter_plant_2_outlet' }, Math.random());
            flowRate.set({ organization: 'org1', site: 'siteB', measurementPoint: 'filter_plant_1_outlet' }, Math.random());
            try {
                return h
                    .response(await register.metrics())
                    .type(register.contentType)
                    .code(200);
            } catch (err) {
                console.error(err);
                return h.response("Internal error").code(500);
            }
        },
    },
};
