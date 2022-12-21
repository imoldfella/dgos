
import { Rpc } from '../../thread/worker_rpc'

// this will eventually be shared worker

onmessage = (e) => {
    // log.dispatch(e.data as Rpc) 
    console.log("store", e.data)
}