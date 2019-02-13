let path = require('path');
const fs = require('fs-extra');
const util = require('util');

class ClientOrgConfig {
    constructor(name, version, description, xtype) {
        this.name = name;
        this.version = (!version) ? "1.0" : version;
        this.description = (!description) ? "" : description;
        this["x-type"] = (!xtype) ? "hlfv1" : xtype;

        this.client = {};
    }

    addClient(org_name_or_client, credentialStore = {}) {
        if (org_name_or_client instanceof Client) {
            this.client = org_name_or_client;
        } else {
            this.client = new Client(org_name_or_client, credentialStore);
        }
    }

    static loadFromFile(configPath) {

        configPath = (configPath) ? configPath : this.configFileLocation;
        const config_loc =  path.resolve(configPath);

        const file_data = fs.readFileSync(config_loc);
        let config_data = JSON.parse(file_data);

        let configClass = new ClientOrgConfig();

        for (let key in config_data) {
            if (config_data.hasOwnProperty(key)) {
                configClass[key] = config_data[key];
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
        return path.join(RootPATH , 'config/org-config.json');
    }

    toJson(format = false) {
        let res = {
            name: this.name,
            version: this.version,
            description: this.description,
            "x-type": this["x-type"],
            client: this.client
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

class Client {
    constructor(org_name, credentialStore = {}) {
        this.organization = org_name;
        this.credentialStore = credentialStore;
    }
}

module.exports = ClientOrgConfig;
module.exports.Client = Client;