# Hyperledger Fabric SDK config
Package for creating and modifying Fabric SDK node

- [Install](#install)
- [Usage](#usage)

## Install
Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save fabric-sdk-config
```

## Usage

```js
var fabConf = require('fabric-sk-config');
```


### Create NetworkConfig instance

*Parameters:*
1. name: *string*
2. version: *string*
3. description: *string*
4. xtype: *string*

```js
let networkConfig = new fabConf.NetworkConfig("supply", "1.0", "supply", "hlfv1");
```
**Create and add Peer**

*Parameters:*
1. name: *string*
2. url: *string*
3. grpcOptions: *object*
4. tlsCACerts: *object* | *string*

Variation 1 - create a Peer instance and pass it to the 'addPeer' method of the NetworkConfig class instance

```js
let peer0 = new fabConf.NetworkConfig.Peer(
     "peer0.org1.example.com",
     "grpcs://localhost:7051",
     {"ssl-target-name-override": "peer0.org1.example.com"},
     {path: "artifacts/channel/crypto-config/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt"}
	 //or string "artifacts/channel/crypto-config/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt"
 );
 
 networkConfig.addPeer(peer0);
```

Or variation 2 - pass the parameters directly to the  'addPeer' method

```js
 networkConfig.addPeer(
     "peer0.org1.example.com",
     "grpcs://localhost:7051",
     {"ssl-target-name-override": "peer0.org1.example.com"},
     {path: "artifacts/channel/crypto-config/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt"} //or string "artifacts/channel/crypto-config/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt"
 );
```

------------

**Create and add Orderer**

*Parameters:*
1. name: *string*
2. url: *string*
3. grpcOptions: *object*
4. tlsCACerts: *object* | *string*

Variation 1 - create a Orderer instance and pass it to the 'addOrderer' method of the NetworkConfig class instance

```js
let orderer = new fabConf.NetworkConfig.Orderer(
     "orderer.example.com",
     "grpcs://localhost:7050",
     {"ssl-target-name-override": "orderer.example.com"},
     {path: "artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt"}  //or string "artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt"
 );
 
 networkConfig.addOrderer(orderer);
```

Or variation 2 - pass the parameters directly to the  'addOrderer' method

```js
 networkConfig.addOrderer(
    "orderer.example.com",
     "grpcs://localhost:7050",
     {"ssl-target-name-override": "orderer.example.com"},
     {path: "artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt"}  //or string "artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt"
 );
```


------------

**Create and add Organization**

*Parameters:*

1. name: *string*
2. mspid: *string*
3. peers names: *string* | *string[]* | *Peer* | *Peer[]*
4. certificateAuthorities
5. adminPrivateKey: *object* | *string*
6. signedCert: *object* | *string*

Variation 1 - create a Organization instance and pass it to the 'addOrganization' method of the NetworkConfig class instance

```js
let organization = new fabConf.NetworkConfig.Organization(
     "Org1",
     "Org1MSP",
     peer0, // instance of Peer. or [peer0, peer1, peer2...] or "peer0.org1.example.com" or ["peer0.org1.example.com", "peer1.org1.example.com"]
	 ca, // instance of CertificateAuthority. or [ca1, ca2] or "ca-org1" or ["ca-org1", "ca2-org1"]
     {path: "artifacts/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/5890f0061619c06fb29dea8cb304edecc020fe63f41a6db109f1e227cc1cb2a8_sk"},  //or string "artifacts/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/5890f0061619c06fb29dea8cb304edecc020fe63f41a6db109f1e227cc1cb2a8_sk"
	 {path: "artifacts/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem"}  //or string "artifacts/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem"
 );
 
 networkConfig.addOrganization(organization);
```

Or variation 2 - pass the parameters directly to the  'addOrganization' method

```js
 networkConfig.addOrganization(
      "Org1",
     "Org1MSP",
     peer0, // instance of Peer. or [peer0, peer1, peer2...] or "peer0.org1.example.com" or ["peer0.org1.example.com", "peer1.org1.example.com"]
	 ca, // instance of CertificateAuthority. or [ca1, ca2] or "ca-org1" or ["ca-org1", "ca2-org1"]
     {path: "artifacts/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/5890f0061619c06fb29dea8cb304edecc020fe63f41a6db109f1e227cc1cb2a8_sk"},  //or string "artifacts/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/5890f0061619c06fb29dea8cb304edecc020fe63f41a6db109f1e227cc1cb2a8_sk"
	 {path: "artifacts/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem"}  //or string "artifacts/channel/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem"
 );
```


------------

**Create and add CertificateAuthority**

*Parameters:*

1. name: *string*
2. url: *string*
3. httpOptions: *object*
4. tlsCACerts: *object* | *string*
5. registrar: *object* | *object[]*
6. caName: *string*

Variation 1 - create a CertificateAuthority instance and pass it to the 'addCertificateAuthority' method of the NetworkConfig class instance

```js
let ca = new fabConf.NetworkConfig.Organization(
     "ca-org1",
    "https://localhost:7054",
    {verify: false},
    {path: "artifacts/channel/crypto-config/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem"},  //or string "artifacts/channel/crypto-config/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem"
    {
        enrollId: "admin",
        enrollSecret: "adminpw"
    },
    "ca-org1"
 );

 networkConfig.addCertificateAuthority(ca);
```

Or variation 2 - pass the parameters directly to the  'addCertificateAuthority' method

```js
 networkConfig.addCertificateAuthority(
      "ca-org1",
    "https://localhost:7054",
    {verify: false},
    {path: "artifacts/channel/crypto-config/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem"},  //or string "artifacts/channel/crypto-config/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem"
    {
        enrollId: "admin",
        enrollSecret: "adminpw"
    },
    "ca-org1"
 );
```


------------

**Create and add Channel**

*Parameters:*

1. name: *string*
2. orderers names: *string* | *string[]* | *Orderer* | *Orderer[]*
3. channel_peers:  *object[]*
4. chaincodes

channel_peers format:
```js
{
	"peer0.main.arcelormittal-fabric.test": {
		  endorsingPeer?: *boolean*
		  chaincodeQuery?: *boolean*
		  ledgerQuery?: *boolean*
		  eventSource?: *boolean*
		  discover?: *boolean*
	}
}
```

Variation 1 - create a Channel instance and pass it to the 'addChannel' method of the NetworkConfig class instance

```js
let channel = new fabConf.NetworkConfig.Channel(
     "mychannel",
    orderer,  // instance of Orderer. or [orderer1, orderer2] or "orderer.example.com" or ["orderer1.example.com", "orderer2.example.com"]
    {"peer0.org1.example.com": {
            "endorsingPeer": true,
            "chaincodeQuery": true,
            "ledgerQuery": true,
            "eventSource": true
    }}
 );

 networkConfig.addChannel(channel);
```

Or variation 2 - pass the parameters directly to the  'addChannel' method

```js
 networkConfig.addChannel(
      "mychannel",
    orderer,  // instance of Orderer. or [orderer1, orderer2] or "orderer.example.com" or ["orderer1.example.com", "orderer2.example.com"]
    {"peer0.org1.example.com": {
            "endorsingPeer": true,
            "chaincodeQuery": true,
            "ledgerQuery": true,
            "eventSource": true
    }}
 );
```


### Create ClientOrgConfig instance

*Parameters:*
1. name: *string*
2. version: *string*
3. description: *string*
4. xtype: *string*

```js
let ClientConfig = new fabConf.ClientOrgConfig("supply", "1.0", "supply", "hlfv1");
```
**Create and add Client**

*Parameters:*
1. org_name: *string*
2. credentialStore: *object*

Pass the parameters directly to the  'addClient' method

```js
 ClientConfig.addClient(
     "Org1",
    {
      "path": "./fabric-client-kv-org1",
      "cryptoStore": {
        "path": "/tmp/fabric-client-kv-org1"
      },
      "wallet": "wallet-name"
    }
 );
```






