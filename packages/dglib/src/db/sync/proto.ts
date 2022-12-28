export interface PublishSync {
    lsn: number    // use to ack
    slot: number[]
    length: number[]
}
export interface SubscribeSync {
    slot: number[]
    branchSecret: Uint8Array[]
}

// If this fails due to key rotation, the client may need to catch up on reading its grant log.
export interface Publish {
    branchSecret: Uint8Array[]
    message: Uint8Array[]
}

// rotate must reference 
export interface Grant {
    userId: Uint8Array[]
    branch: string[]  // branch references the host.
    adminSignature: Uint8Array
}


// generate a payment intent for stripe
// when the hostserver receives notification for the payment, it will activate the associate host options.

// each HostServer can be configured to allow payments, using a stripe account
// it may need to use a different payment processor based 



export interface PaymentIntentRequest {
    processor: string  // "stripe"
    // these can be hosts too. We can pay for a host, or for a branchset on an existing host or branch in a branchset. options can indicate if a branchset accepts unsolicited branches and what payments are required
    branch: string[]
    options: BranchOptions[]
}
export interface PaymentIntentReply {

}

type BranchOptions = BranchSetOptions | HostOptions

// A concierge branchset where people can purchase a branch
export interface BranchSetOptions {
    open: boolean,
    cost?: number
}
export interface HostOptions {
    open: boolean
    // Host bills are always split by activity.
}






// the host data should be a concierge site, where each user has their own branch.
// the user will create a branch using the payment proof.


export interface QueryHostRequest {
    uuid: string[]
    signature: Uint8Array[]  // if uuid exists, signature must match
}
export interface UpdateHost {
    uuid: string[]
    signature: Uint8Array[] 
    name: string[]
    payment: Uint8Array[]   // eg. reference from stripe
}

export interface UpdateHostReply {
    uuid: string[]
    signature: Uint8Array[] 
    name: string[]
    payment: Uint8Array[]   // eg. reference from stripe
}