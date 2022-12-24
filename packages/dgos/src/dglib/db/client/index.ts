

// should we use comlink to wrap the shared worker? that way the user can easily create their own shared worker that includes datagrove.

// first get a config from options
// this can be instantiated in multiple workers and in the main thread
// send options to get a config, use config to create a Db to use
export interface Options {
}

// procs is an object used to create wrappers for "server side" procedures in your shared worker
export class Db<T> {
    constructor(sw: SharedWorker) { }


}

// call with the URL for your Datagrove enhanced shared worker
export async function useDb<T>(u: URL) {
    // note this your application's shared worker, but it should expose Datagrove methods for Db to work. 
    return  new Db<T>(new SharedWorker(u))
} 

