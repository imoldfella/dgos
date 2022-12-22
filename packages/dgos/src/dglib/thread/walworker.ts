export { }
import { Mem } from './mem'
import { RingBuffer, ringEntry, ringRead } from './ring'

function init(r: RingBuffer) {
    const e = ringEntry(r)
    while (true) {
        ringRead(r, e)
        switch ( ) {

        }
    }
}
onmessage = (e) => {
    switch (e.data.method) {
        case 'init':
            init(e.data.params)
    }
}