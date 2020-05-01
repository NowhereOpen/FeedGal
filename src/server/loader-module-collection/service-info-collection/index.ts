/**
 * 2020-05-01 11:07 
 * 
 * Used in retrieving the service infos for GYST side panel.
 * 
 * The loader modules should use the service info available within each service loader module.
 * 
 * This collection should be considered as a tool FOR the server, not a tool FROM loader module collection.
 * 
 * COULD consider moving up this directory into `src/server` directory instead of the current
 * `/loader-module-collection`.
 */

export let service_info_collection:{ [service_id:string]:any }