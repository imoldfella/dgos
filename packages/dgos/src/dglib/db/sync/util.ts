// create table 

// we need a worker to query the database, and we need to subscribe to the log.
// since we are a worker, we could do 

// this is enough for all client events,  should we do this? maybe with filtering?
export class LogReader {

}

// reads the log, resolves the sandbox. sandbox is not just branch, because concierge sites have n sites
// can't be just server, no trust. sandboxes need id's (root branch) that are

// can you fork a branchset? tag it? name it? grant/revoke it?
// You could have open multiple branchsets, but you still only write to a single branch?
export class BranchSetHandle {
    url = ""

}

class Identity {

}
export class BranchHandle {
    //server?= new HostServer()
    identity?= new Identity // used to sign. 
    publicHmacKey = new Uint8Array(0) // secret shared with server
    writerPublic?: Uint8Array//    readers have this to confirm it was 
    readerSecret = new Uint8Array(0)  // used for encryption at rest. 
    branch = ""
    serverHandle = 0
}


