
// trigger question: If you define triggers, they are generally in the schema. Joe and Jim may have different versions of the application running. Triggers are typically in the database, but in this case they are executed on the edge, and may not load because of the different versions. I think we need a somewhat weaker idea of trigger, that is defined locally.

// this requires a function so it can react to other tabs/people changing the database schema
// we might want to create an app which can use a different schema per branch
// we want fine grained; only recompile the schema that has changed.
//

// when compiling a query, it needs to generate types for both the main thread and the shared worker thread.

// call from your shared worker. it doesn't need to know your worker because you are calling it from the worker. It needs to know your

// put your schema where both your client and your server can execute it.

// you may want to manage your schemas so they can be composed; each database may have multiple schemas.

// objects like tables need to return ()=>DbObject?
// the function wrapper captures the reactivity. It's not clear what parts of the table schema we can react to, but seems like this will be necessary since it can change.

// it might be best to define the views etc after the tables so that they can see the table? or use the solid method to track the function calls?
// will it be hard to allow queries in the namespace (views with parameters?)

    // to execute into existence, everything needs to be executable
    // maybe map name into getters? can we override operators though?
    // how does solid do it? with a compiler...
    // returns an object defining the attributes.
    // select * is hard to type here, but usually a bad idea anyway.
    // this will make no sense programmatically, but transformed
    // it 
    // we could resolve the tables first, then resolve the rest?
    // it could be tricky to use incremental schema changes here because of the dependencies of views on tables, so we need to track those anyway.
// transform this because returns a query.
// this should probably be defined, because it needs to be on both sides, then we can catch it.

// we update the schemas individually (and objects inside them as Dag)

// do we always load the shared worker from the domain?
// here we have the origin string or the worker string? are they required to be the same?
// the shared worker lives in an iframe,
// can we make schemas incrementally downloadable?
// we will call this from shared worker, which is application specific
// it will request all the schemas listed in the dbs, and attempt to reconcile them.
