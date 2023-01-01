the go server 

# server
Server clusters divide their capacities into accounts. Accounts are leased to owner sets. Accounts's can host multiple databases

# database 
Each database will typically have a unique dns name eg. database.server.com. This can be cname'd from any dns the owers control. The server may also be private; connected to the internet using webrtc. In this case databases will not have a dns name. In this case you can use a datagrove name server (dgns), the name server will also then serve as a lobby.

# user profiles
Each user has a profile database. It always has a single writer, but may have multiple readders. Each user can choose any server to host their profile, and they can move their profile any time.

# subscription database
Each server has a subscription database. Each partition of the database corresponds to user of that server. The user writes subscription proofs into the database, the server reads the subscriptons and acts accordingly. The server writes invitations into the database that it receives from other users.

# authorization

Each user has identity has a bip39 key pair. Each user device has a key pair signed by the identity.

Each database has a bip39 key pair, and each owner of the database has a copy of the private key.

Each account has a bip39 key pair, each owner has a copy of the private key.

# owner sets

Each owner is a an equal. The database is append-only, owners may always write to it. The datbase may be deleted with 50% of the owners signing. Any owner may fork the database to a copy with a new owner set.

# groups

The database is divided into groups. Each group has readers and writers. A user can be in 


# Efficiency
Each user is also assigned a 64 bit id by the server. (id server?)



# Bring your own everything.

Datagrove is designed to be highly secure with minimal effort on a free or low cost public infrastructure, but some threat models may require you to build you own infrastructure. You can stand up your own databaser server and name server. Your name server may be rooted at datagrove.com but it doesn't need to be. Of course its also open source, but we appreciate contributions.


# Hello Protocol

1. Public server over websockets

The user sends their public device key along with a signed hash of the most recent message they received

2. Private server over Webrtc

In addition to the websocket protocols, the client must first establish a WebRtc connection. The webrtc based host will receive offers from the name server, and will answer authorized users. Also private servers do not use the HTTP protocol to distribute their logs, instead the client requests the log chunks directly from the server.

# Log Protocol

# Chunk Protocol

# Snapshots

When a user joins a group in the database they will need the current state of the group. This can always be done by replaying the database log from the beginning, but this can get slow if the database sees enough activity. In this case you can designate a client to build snapshots. This should generally be logged in as a user that can read the entire database. This client will update the snapshot based on activity to keep device commissioning to within 10% of the time to read a snapshot.

To support this the server stores encrypted chunks of data by their hash, and it stores the root hash for each group. The rest of the logic is in the client.