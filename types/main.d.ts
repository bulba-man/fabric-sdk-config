declare namespace FabricConfigNetwork {
    export class ConfigNetwork {
        name: string;
        "x-type": string;
        description: string;
        version: string;
        channels?: ChannelInterface[];
        organizations?: OrganizationInterface[];
        orderers?: OrdererInterface[];
        peers?: PeerInterface[];
        certificateAuthorities?: CertificateAuthorityInterface[];

        constructor(name: string, version?: string, description?: string, xtype?: string);

        public addPeer(name_or_peer: string|Peer, url: string, grpcOptions: string|object, tlsCACerts: string|object): void;

    }

    export class Peer{
        constructor(name: string, url: string, grpcOptions: string|object, tlsCACerts: string|object);
        public getName(): string;

        name: string;
        url: string;
        grpcOptions?: object|string;
        tlsCACerts?: PathObjectInterface|string;
    }



    export interface ConfigNetworkInterface {
        name?: string;
        "x-type"?: string;
        description?: string;
        version?: string;
        channels?: ChannelInterface[];
        organizations?: OrganizationInterface[];
        orderers?: OrdererInterface[];
        peers?: PeerInterface[];
        certificateAuthorities?: CertificateAuthorityInterface[];
    }

    export interface ChannelInterface {
        name: string;
        orderers: string[];
        peers: ChannelPeerInterface[];
        chaincodes: object;
    }

    export interface ChannelPeerInterface {
        endorsingPeer?: boolean;
        chaincodeQuery?: boolean;
        ledgerQuery?: boolean;
        eventSource?: boolean;
        discover?: boolean;
    }

    export interface OrganizationInterface {
        name: string;
        mspid: string;
        peers?: string[];
        certificateAuthorities?: string[];
        adminPrivateKey?: PathObjectInterface;
        signedCert?: PathObjectInterface;
    }

    export interface OrdererInterface {
        name: string;
        url: string;
        grpcOptions?: object;
        tlsCACerts?: PathObjectInterface;
    }

    export interface PeerInterface {
        name: string;
        url: string;
        grpcOptions?: object|string;
        tlsCACerts?: PathObjectInterface|string;
    }

    export interface CertificateAuthorityInterface {
        name: string;
        url: string;
        httpOptions: object;
        tlsCACerts?: PathObjectInterface;
        registrar: EnrollInterface[];
        caName: string;
    }

    export interface PathObjectInterface {
        path: string;
    }

    export interface EnrollInterface {
        enrollId: string;
        enrollSecret: string;
    }
}

declare namespace FabricConfigClientOrg {
    export class ConfigClientOrg {
        name: string;
        "x-type"?: string;
        description: string;
        version: string;
        client?: ClientInterface;

        constructor(name: string, version?: string, description?: string, xtype?: string);



    }

    export interface ConfigClientOrgInterface {
        name?: string;
        "x-type"?: string;
        description?: string;
        version?: string;
        channels?: ClientInterface;
    }

    export interface ClientInterface {
        organization: string;
        credentialStore: CredentialStoreInterface;
    }

    export interface CredentialStoreInterface {
        path: string;
        cryptoStore: PathObjectInterface;
        wallet: string;
    }

    export interface PathObjectInterface {
        path: string;
    }
}