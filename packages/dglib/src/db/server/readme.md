
# logs

our logical files support trimming (deque of blocks). How its done depends on the FS.

we can't control when we can recover a log file because its based on the oldest record of the oldest transaction.
we could keep making it longer.

each shard (10gb of wal say) then we

0-10,000?

check1
check2

The value log for each table/key/branch is enought to allow us to lazily create a branch.

Globally branch snapshots could be prolly trees.
