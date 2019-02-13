'use strict';
let path = require('path');
const fs = require('fs-extra');
const util = require('util');

class NetworkConfig {
    constructor(name, version, description, xtype) {

        // if (!name) {
        //     throw new Error('Failed to create NetworkConfig. Missing requirement "name" parameter.');
        // }
        // if (typeof name !== 'string') {
        //     throw new Error('Failed to create NetworkConfig. NetworkConfig name should be a string');
        // }

        this.name = name;
        this.version = (!version) ? "1.0" : version;
        this.description = (!description) ? "" : description;
        this["x-type"] = (!xtype) ? "hlfv1" : xtype;

        this.channels = {};
        this.organizations = {};
        this.orderers = {};
        this.peers = {};
        this.certificateAuthorities = {};
    }


    addPeer(name_or_peer, url, grpcOptions, tlsCACerts) {
        if (name_or_peer instanceof Peer) {
            this.peers[name_or_peer.getName()] = name_or_peer;
        } else {
            this.peers[name_or_peer] = new Peer(name_or_peer, url, grpcOptions, tlsCACerts);
        }
    }

    addOrderer(name_or_orderer, url, grpcOptions, tlsCACerts) {
        if (name_or_orderer instanceof Orderer) {
            this.orderers[name_or_orderer.getName()] = name_or_orderer;
        } else {
            this.orderers[name_or_orderer] = new Orderer(name_or_orderer, url, grpcOptions, tlsCACerts);
        }
    }

    addCertificateAuthority(name_or_center, url, httpOptions, tlsCACerts, registrar, caName) {
        if (name_or_center instanceof CertificateAuthority) {
            this.certificateAuthorities[name_or_center.getName()] = name_or_center;
        } else {
            this.certificateAuthorities[name_or_center] = new CertificateAuthority(name_or_center, url, httpOptions, tlsCACerts, registrar, caName);
        }
    }

    addOrganization(name_or_org, mspid, peers, certificateAuthorities, adminPrivateKey, signedCert) {
        if (name_or_org instanceof Organization) {
            this.organizations[name_or_org.getName()] = name_or_org;
        } else {
            this.organizations[name_or_org] = new Organization(name_or_org, mspid, peers, certificateAuthorities, adminPrivateKey, signedCert);
        }
    }

    addChannel(name_or_channel, orderers, channel_peers, chaincodes) {
        if (name_or_channel instanceof Channel) {
            this.channels[name_or_channel.getName()] = name_or_channel;
        } else {
            this.channels[name_or_channel] = new Channel(name_or_channel, orderers, channel_peers, chaincodes);
        }
    }

    static loadFromFile(configPath) {

        configPath = (configPath) ? configPath : this.configFileLocation;
        const config_loc =  path.resolve(configPath);

        const file_data = fs.readFileSync(config_loc);
        let config_data = JSON.parse(file_data);

        let configClass = new NetworkConfig();

        for (let key in config_data) {
            if (config_data.hasOwnProperty(key)) {
                if (typeof config_data[key] === 'string') {
                    configClass[key] = config_data[key];
                }
            }
        }

        if (config_data.hasOwnProperty("peers")) {
            for (let name in config_data.peers) {
                if (config_data.peers.hasOwnProperty(name)) {
                    let peer_data = config_data.peers[name];

                    configClass.addPeer(name, peer_data.url, peer_data.grpcOptions, peer_data.tlsCACerts)
                }
            }
        }

        if (config_data.hasOwnProperty("orderers")) {
            for (let name in config_data.orderers) {
                if (config_data.orderers.hasOwnProperty(name)) {
                    let orderer_data = config_data.orderers[name];

                    configClass.addOrderer(name, orderer_data.url, orderer_data.grpcOptions, orderer_data.tlsCACerts)
                }
            }
        }

        if (config_data.hasOwnProperty("certificateAuthorities")) {
            for (let name in config_data.certificateAuthorities) {
                if (config_data.certificateAuthorities.hasOwnProperty(name)) {
                    let certificate_data = config_data.certificateAuthorities[name];

                    configClass.addCertificateAuthority(name, certificate_data.url, certificate_data.httpOptions, certificate_data.tlsCACerts, certificate_data.registrar, certificate_data.caName)
                }
            }
        }

        if (config_data.hasOwnProperty("organizations")) {
            for (let name in config_data.organizations) {
                if (config_data.organizations.hasOwnProperty(name)) {
                    let organization_data = config_data.organizations[name];

                    configClass.addOrganization(name, organization_data.mspid, organization_data.peers, organization_data.certificateAuthorities, organization_data.adminPrivateKey, organization_data.signedCert)
                }
            }
        }

        if (config_data.hasOwnProperty("channels")) {
            for (let name in config_data.channels) {
                if (config_data.channels.hasOwnProperty(name)) {
                    let channels_data = config_data.channels[name];

                    configClass.addChannel(name, channels_data.orderers, channels_data.peers, channels_data.chaincodes)
                }
            }
        }

        return configClass;
    }

    saveToFile(configPath) {
        configPath = (configPath) ? configPath : this.constructor.configFileLocation;

        var json = this.toJson(true);
        fs.writeFile(configPath, json, 'utf8', (err) => {
            if (err) throw new Error(util.format('Error writing to file: %s, details: %s', configPath, err.toString()));
        });
    }


    static get configFileLocation() {
        return path.join(RootPATH , 'config/network-config.json');
    }

    toJson(format = false) {
        let res = {
            name: this.name,
            version: this.version,
            description: this.description,
            "x-type": this["x-type"],
            channels: this.channels,
            organizations: this.organizations,
            orderers: this.orderers,
            peers: this.peers,
            certificateAuthorities: this.certificateAuthorities
        };

        let json = "";

        if (format) {
            json = JSON.stringify(res, null, 2);
        } else {
            json = JSON.stringify(res);
        }

        return json;
    }
}

class Peer {
    constructor(name, url, grpcOptions, tlsCACerts) {

        if (!name) {
            throw new Error('Missing name parameter');
        }
        if (!url) {
            throw new Error('Missing url parameter');
        }
        if (!tlsCACerts) {
            throw new Error('Missing tlsCACerts parameter');
        }

        this.name = name;
        this.url = url;
        this.grpcOptions = (grpcOptions && typeof grpcOptions === 'object') ? grpcOptions : {"ssl-target-name-override": name};

        if (typeof tlsCACerts === 'string') {
            this.tlsCACerts = {path: tlsCACerts}
        } else if (typeof tlsCACerts === 'object') {
            this.tlsCACerts = tlsCACerts
        }
    }

    getName() {
        return this.name;
    }
}

class Orderer {
    constructor(name, url, grpcOptions, tlsCACerts) {

        if (!name) {
            throw new Error('Missing name parameter');
        }
        if (!url) {
            throw new Error('Missing url parameter');
        }
        if (!tlsCACerts) {
            throw new Error('Missing tlsCACerts parameter');
        }

        this.name = name;
        this.url = url;
        this.grpcOptions = (grpcOptions && typeof grpcOptions === 'object') ? grpcOptions : {"ssl-target-name-override": name};

        if (typeof tlsCACerts === 'string') {
            this.tlsCACerts = {path: tlsCACerts}
        } else if (typeof tlsCACerts === 'object') {
            this.tlsCACerts = tlsCACerts
        }
    }

    getName() {
        return this.name;
    }
}

class CertificateAuthority {
    constructor(name, url, httpOptions, tlsCACerts, registrar, caName) {

        if (!name) {
            throw new Error('Missing name parameter');
        }
        if (!url) {
            throw new Error('Missing url parameter');
        }
        if (!tlsCACerts) {
            throw new Error('Missing tlsCACerts parameter');
        }
        if (!registrar) {
            throw new Error('Missing registrar parameter');
        }

        this.name = name;
        this.url = url;
        this.httpOptions = (httpOptions && typeof httpOptions === 'object') ? httpOptions : {verify: false};
        this.caName = (!caName) ? "" : caName;

        if (typeof tlsCACerts === 'string') {
            this.tlsCACerts = {path: tlsCACerts}
        } else if (typeof tlsCACerts === 'object') {
            this.tlsCACerts = tlsCACerts
        }

        if (typeof registrar === 'object') {
            this.registrar = [registrar]
        } else if (Array.isArray(registrar)) {
            this.registrar = registrar
        }
    }

    getName() {
        return this.name;
    }
}

class Organization {
    constructor(name, mspid, peers, certificateAuthorities, adminPrivateKey, signedCert) {
        if (!name) {
            throw new Error('Missing name parameter');
        }
        if (!mspid) {
            throw new Error('Missing mspid parameter');
        }
        if (!certificateAuthorities) {
            throw new Error('Missing certificateAuthorities parameter');
        }
        if (!adminPrivateKey) {
            throw new Error('Missing adminPrivateKey parameter');
        }
        if (!signedCert) {
            throw new Error('Missing signedCert parameter');
        }

        this.name = name;
        this.mspid = mspid;
        this.peers = [];
        this.certificateAuthorities = [];

        if (typeof peers === 'string') {
            this.peers = [peers]
        } else if (Array.isArray(peers)) {
            for (let i = 0; i < peers.length; i++) {
                let peer = peers[i];

                if (typeof peer === 'string') {
                    this.peers.push(peer);
                } else if (peer instanceof Peer) {
                    this.peers.push(peer.getName());
                }
            }
        } else if (peers instanceof Peer) {
            this.peers.push(peers.getName());
        }

        if (typeof certificateAuthorities === 'string') {
            this.certificateAuthorities = [certificateAuthorities]
        } else if (Array.isArray(certificateAuthorities)) {
            for (let i = 0; i < certificateAuthorities.length; i++) {
                let center = certificateAuthorities[i];

                if (typeof center === 'string') {
                    this.certificateAuthorities.push(center);
                } else if (center instanceof CertificateAuthority) {
                    this.certificateAuthorities.push(center.getName());
                }
            }
        } else if (certificateAuthorities instanceof CertificateAuthority) {
            this.certificateAuthorities.push(certificateAuthorities.getName());
        }

        if (typeof adminPrivateKey === 'string') {
            this.adminPrivateKey = {path: adminPrivateKey}
        } else if (typeof tlsCACerts === 'object') {
            this.adminPrivateKey = adminPrivateKey
        }

        if (typeof signedCert === 'string') {
            this.signedCert = {path: signedCert}
        } else if (typeof signedCert === 'object') {
            this.signedCert = signedCert
        }
    }

    getName() {
        return this.name;
    }
}

class Channel {
    constructor(name, orderers, channel_peers = {}, chaincodes = []) {
        if (!name) {
            throw new Error('Missing name parameter');
        }
        if (!orderers) {
            throw new Error('Missing orderers parameter');
        }
        if (!channel_peers) {
            throw new Error('Missing channel_peers parameter');
        }


        this.name = name;
        this.orderers = [];
        this.peers = channel_peers;
        this.chaincodes = (!chaincodes) ? [] : chaincodes;

        if (typeof orderers === 'string') {
            this.orderers = [orderers]
        } else if (Array.isArray(orderers)) {
            for (let i = 0; i < orderers.length; i++) {
                let orderer = orderers[i];

                if (typeof orderer === 'string') {
                    this.orderers.push(orderer);
                } else if (orderer instanceof Orderer) {
                    this.orderers.push(orderer.getName());
                }
            }
        } else if (orderers instanceof Orderer) {
            this.orderers.push(orderers.getName());
        }

    }

    getName() {
        return this.name;
    }
}


module.exports = NetworkConfig;
module.exports.Peer = Peer;
module.exports.Orderer = Orderer;
module.exports.CertificateAuthority = CertificateAuthority;
module.exports.Organization = Organization;
module.exports.Channel = Channel;