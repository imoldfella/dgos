// define a simple file system that can be operated from another worker.


// only the log can be split, the buffer writer must be shared
// not clear there is enough value to justify the overhead of splitting the log

export * from './web'
export * from '../weblike'


// check if we already have indexeddb, use it if found
// check if opfs is available, if so use that
// use idb



