

export interface HostServerConfig {
    stripe: StripeOptions
    open: boolean  // hosts 
    // 0 is the same as 1. This is also the maximum number of hosts, although each host can take more than one slice.
    slices: number  // virtual "slices" includes cpu,bandwidth,storage, etc.

    // fixed sharing is based on slices: storageCost / slice + bandwidthCost / slice
    // proportional sharing is based on actual use.
    share: "none" | "fixed" | "proportional"
    storageCost: [number,number]
    bandwidthCost: [number,number]

    // allow variable costs. 
 

    // per month, total
    mbytes: [number,number]
    bandwidth: [number,number] 
}


// for a variable billed HostServer we can query the HostServer for its percentages
// then use these to generate invoices. These should be updated into the management BranchSet 

// client branch
// create table share(month, bytes, storage)

// shared branch
// create table host(month, bytes, storage)


// HostServers can work in a cluster providing higher availibility
// clusters are built by allocating an image in a platform specific way
// then using ssh to install the correct packages and starting the server
// In the end you will have N servers that can all be used identically.
// dns will be provisioned as round robin, but clients will route themselves
// the best server after first contact.
export interface ClusterConfig {
    config: HostServerConfig
    cluster: ClusterManager
    regions: string[]
    failureZones: number
}

type StripeOptions = {

}

type ClusterOptions = {
    type: string
    failureZones: string[]
    regions: string[]
}

interface Kubernetes extends ClusterOptions {
    type: 'kubernetes'
}

interface SSH extends ClusterOptions {
    type: 'ssh'
}

type ClusterManager = {
    provision(region: string, failureZone: string) : Promise<ProvisionedServer>
    dns(ip: string, name: string, region: string):Promise<number>
}

type ProvisionedServer = {
    ssh: string
    key: string
}


