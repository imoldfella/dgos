
# sync secrets

server will not send sync on a branch unless the client know its sync secret
the sync key is just a random secret
when it is rotated it must be published to all readers and to the host.

a keypair would offer no additional security, since its value is only hidden to the server, and the server knows the lsn anyway.

in solid we want something like

1. queries may represent trees (crosstab?)
2. query can act like a virtualizer

// this needs to be suspense in general.
// resource uses future, still needs signal for subscription
function async createServerList(params) {
    const db = useDb()
    const [signal, setSignal ] createSignal()
    querysome({ params} , setSignal)  // how do i trigger suspense?
    //
   // return createResource(id, async (p) => query(db,p))
}

```html

const x = createServerList( ) // get the db from the context

<virtualizer> 
    <div style={{ height: x.height() }}
<For each={x().items()}>{(r) => {
    <div onClick={x.fold()}> </div>
    }<For>
</virtualizer>
```

# stopping behavior

browser stopping behavior is challenging

> Theoretically pagehide is replacement for beforeunload in safari but practically its not. As correctly observed time to trigger pagehide event can vary because safari fetches the new page in the background and when page is available it fires pagehide.

<https://stackoverflow.com/questions/44655681/time-to-fire-for-beforeunload-vs-pagehide-on-ios>

pagehide is the best available signal for stopping. beforeunload offers user warning, but we have only awkward choices for a clean shutdown: always warn unless the user takes the step of stopping the database. Opfs won't run in a service worker. indexeddb should run transactionally at least.

we count the number of user transactions

sync transactions must fend for themselves, rollback is their only defense.

background sync is not in safari.

but opfs.flush() is async and you can't await inside a pagehide.
you could send an event to the worker in page hide, but what could would it do? you can't store anything anyway (all async)

A mobile user visits your page.
The user then switches to a different app.
Later, the user closes the browser from the app manager.
