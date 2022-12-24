
// we need a log worker whether we have opfs or idb to implement group commit
// the log worker needs to a spsc queue with each worker and a common bell
// data read/write is a little different, but a worker currently is the best strategy for opfs because writes in opfs are synchronous. queues are cheaper than locks?
// how easy is it for the worker to work on something else while data arrives?
// a worker gives it some async even where opfs is sync, is preload/block the best strategy given the edge load?

// we can use the ring buffer to accept requests, then use the port to ring the bell.

//In the origin private file system, a FileSystemHandle represents either the root directory of the origin’s space, or a descendant of the root directory.