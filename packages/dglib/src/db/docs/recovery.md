
1. Find the latest complete checkpoint.
2. Analyze forward to the end of the log, as aries to get set of commits and cancels
3. Redo all the transctions to the point of the crash
4. Undo all the cancelled transactions.

Pages can be loaded in parallel.