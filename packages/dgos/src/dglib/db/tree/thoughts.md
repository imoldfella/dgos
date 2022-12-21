#

// the advantage of writing a page in place is that we don't need to update the parent.
// we can still get some of the advantages of compressed pages by sparse files and trimming holes in the file.
// this is also nice because we can read the entire block and the os will give us 0's.
// b2 tree is interesting, but probably not useful for ordinal index

// if checkpoints write every page up to the root, then aries is simpler?
// then it suffices to roll forward.

// write pages append only to segments (zones), then periodically clean the zone and append more to it.
// zones tend to be about 256mb, so the database will grow until it gets at least 256mb.

// tree built to share with sharedarraybuffer
// lsm where mem tree is a pam tree

const root = await navigator.storage.getDirectory();
// Create a new file handle.
const fileHandle = await root.getFileHandle('Untitled.txt', { create: true });
// Create a new directory handle.
const dirHandle = await root.getDirectoryHandle('New Folder', { create: true });
// Recursively remove a directory.
await root.removeEntry('Old Stuff', { recursive: true });

// we might want to compress before storing. we need special log stuff. we might want to be able to use chrome file access.
// ReadableStreamBYOBReader not in safari.
// can read blobs directly into webassembly
// <https://wicg.github.io/file-system-access/>
// file system access not in firefox.
// <https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API>
// FileSystemWritableStream, not in safari, not in firefox
// relevant open issue (2017!) <https://github.com/WebAssembly/design/issues/1162>
<https://developer.chrome.com/blog/sync-methods-for-accesshandles/>
<https://github.com/whatwg/fs/issues/7#issuecomment-1161768515>
// disk pointers should have two size classes: compressed and uncompressed
// does lz4 allow decompression in place? not a big deal

opfs, wasmfs
no temp files in opfs <https://github.com/WICG/file-system-access/issues/339>
not in service worker
ugh: <https://github.com/WICG/file-system-access/issues/260>

let clients access read only files directly. Maybe all files are readable directly, append only?

Each l1+ block is integer[] key, followed by integer[] pointer

l0 block is integer[]start followed by blobs.

we need an extra int array for start of key
and an extra byte array for the keys.

1. merge the lsm snapshots into the local btree with bulk mvcc
2. generate snapshots the same way.

what about logical pages? what about using shared buffers as pages?

can each page be a cow? single threaded writer.

javascript needs madvise to make this efficient;

basic idea is start by sharing a large array of shared buffers (512KB)?

resizeable array buffers are a stage 3 draft.

<https://db.in.tum.de/~freitag/papers/p2797-freitag.pdf?lang=en>
