// move this to the accounting app, 
export interface BillingConfig {
    split: "cost"|"capacity"|"none"

    // these are the costs assigned to one month of bandwid
    storageCost: number // cost to 
    storageBilled: "variable"|"fixed"

    bandwidthCost: number
    bandwidthBilled: "variable"|"fixed"
}