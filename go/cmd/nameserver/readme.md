
Datagrove allows and supports public names, but doesn't require them. Databases and users with public identities register their names on a name server. Name servers are publically auditable. 

Id servers parallel some dns capabilities while adding email-like user identification.

# root server

Datagrove will maintain a root server at id.datagrove.com

Anyone can create their own id server and register it there as a root

Each root server can then offer subdomains, etc, and pointer to more id servers.

# what's the point

a segmented name is assigned to a public key. That's the entire point. The key is signed by the next level up in the hierarchy. It can be revoked by the next level up in the hierarchy. name mappings do not expire, but they may be revoked.

name -> id | invalid


How does datagrove use names?
1. cheaper/weaker dns; 
2. you can search for a name 
3. allow you to move your database from one host to another with minimal disruption. 

You can still have your own dns name, but this way you don't need to.

# revoking

Revoking a key will be very fast to be reflected on any server that's an auditor for the name server.