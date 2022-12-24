import {  DgguiShared } from './data'
import { createDbms } from  '../dglib/db/server'

// top level await - ok? or wrap?
let dbms = await createDbms();

// you can implement a "server" api here (it all runs locally, but shared across tabs)
// define all server api here, per the interface in data.
dbms.api<DgguiShared>({
    double(value: number) { return value * 2}
});

// you can extend sql here with user defined functions and virtual tables.
// you can also add official extensions here like map
dbms.table({});
dbms.formula({});


(self as any).onconnect = function (event: any) {
    const port = event.ports[0];
    dbms.onconnect(port)
};
  