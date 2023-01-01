
Local operations are committed locally, as in Bayou. The transactions are created as rebaseable steps.

Remote transactions are already sequenced and must be committed or cancelled in order. A cancelled transaction will potentially be referenced by a future rebase operation, so they are not discarded. Logically when a remote transaction is received, it is applied to the canonical copy of the database. Then, as in bayou, the local transactions are rebased and rolled forward on this copy. Unlike bayou, transactions that are not in sequence are cancelled; the authoring device will then attempt to rebase the transaction and resubmit it (this process is similar to prosemirror).





Datagrove uses only single shot and super size transactions. 

Local transactions enter through the shared worker. Single shot transactions are already complete; (use standard calvin-style probes for transactions). 

Bulk transactions are first stored somewhere as an encrypted attachment. The transaction executor puts bulk transactions in a fifo queue similar to umbra, only one proceeds at a time. Synchronization is stopped when processing a bulk transaction. When the bulk transaction completes, the local transactions are rebased after the bulk transaction and the synchronization restarts.

Aries primarily benefits the super size transactions.




Transctions are either normal sized or super sized. Only one super size transaction may proceed at a time. 

key thing initially is install.