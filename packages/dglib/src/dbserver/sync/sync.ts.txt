
import { Tx } from "../data"
import { PublishSync } from "./proto"
import { SharedPubSub } from "../../thread/pubsub"
import * as dx from './schema'
import { QueryServer, deleteServerStatus } from "./schema"
import { Db } from "../client/client"

// probably get a paseto token for each identity to exchange?
// noted earlier that the server could offer some locking for multibranch
// updates. It's not clearly useful though, could be hard for performance.

// 1=start, 2 = stop
let state = 0
// can this just be a worker? can it be started from the shared worker but connect back to the shared worker? would that exit?

// read/write various server/branch logs.
// read/write the prediction log
// write the golden log.
export class HostServer {
    lsn = 0
    constructor(public ws: WebSocket) { }

    // send as heartbeat, server will drop clients that stop heartbeating
    ack() {
        const dv = new DataView(new Uint8Array(8))
        dv.setUint32(0, 0)
        dv.setUint32(0, this.lsn)
        this.ws.send(dv.buffer)
    }
}

// worker globals
const ws = new Map<string, HostServer>()

// db is a proxy&cache to the actual database that's in another (shared) worker
const db = new Db()

async function heartbeat() {
    ws.forEach((v) => {
        v.ack()
    })
}
async function connectServer(s: string) {
    const ws = new WebSocket(s)
    ws.onopen = () => {
        // update the server status, just write back to the database.
        dx.updateOnline(db, {
            url: s,
            status: "y"
        })
    }
    ws.onclose = () => {
        // we want to retry periodically, but we can control that from ui.
        dx.updateOnline(db, {
            url: s,
            status: "n"
        })
    }

    ws.onmessage = (m: MessageEvent) => {
        syncMessage(ws, JSON.parse(m.data))

        // update the device.serverStatus, also add to queue to fetch records

    }
    ws.onerror = (e) => {
        console.log("sync error ", e)
    }
}

// convert this directly to a local database commit
async function syncMessage(ws: WebSocket, s: PublishSync) {
    // commit this update to our database, then acknowledge
    // we might want to piggy back this on sends?
    for (let i in s.slot) {
        s.slot[i]
        s.length[i]
    }

}


function doStop() {

}

async function start() {
    // listen to the log and return a snapshot of everything up to the log starting
    // const first = db.addListener((tx: Tx) => {

    // })        

    // read the connection information from the database
    // read the user mute settings
    // restore the most recent sync state.
    // subscribe to the log.
    // connect to the server and start processing information

    // send a first online status report to subscribers.
    // no counters are put in status, these are written back to the state database
    // the clients will subscribe that table directly.


    dx.queryServer(db, {}, (q: QueryServer) => {
        for (let r of q.inserted) {
            connectServer(r.url)
        }
        for (let d of q.deleted) {
            ws.get(d.url)?.ws.close()
            ws.delete(d.url)
            deleteServerStatus(db, { url: d.url })
        }

    })

    self.setInterval(() => heartbeat(), 1000)
}

// start (two part construction) is not completely necessary, but it allows the dbms to get a static reference while still controlling the start/stop
async function init() {

    self.onmessage = (m: MessageEvent) => {
        // only message is to close
        switch (m.data) {
            case 'start':
                start().then(() => {
                    state++
                    if (state == 2) stop()
                })
                break;
            // emanates from pagehide, so only so much we can do.
            case 'stop':
                state++
                if (state == 2) stop()
                break;
        }
    }
}

init()


