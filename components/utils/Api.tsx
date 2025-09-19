import { Config } from '@/hooks/useConfig';
import { LocationObject } from 'expo-location';

const GRAPH_URL = 'https://v4.data-service.skey.network/graphql';
const HEADERS = {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Api-Key': 'skey-network'
};

export interface Device {
    active: boolean;
    address: string;
    connected: boolean;
    description: string;
    details: DeviceDetails;
    distance: number;
    lat: number;
    lng: number;
    name: string;
    owner: string;
    visible: boolean;
    supplier: string;
    key: {
        assetId: string;
        owner: string;
    };
}
export interface DeviceDetails {
    additionalDescription: string;
    assetUrl: string;
    deviceModel: string;
    deviceType: string;
    physicalAddress: DeviceAddress;
}
export interface DeviceAddress {
    addressLine1: string;
    addressLine2: string;
    city: string;
    country: string;
    floor: string;
    postcode: string;
}

export interface Organisation {
    address: string;
    name: string;
    description: string;
    users: string[];
    suppliers: {
        objects: { address: string }[];
    };
}
export interface Key {
    assetId: string;
    owner: string;
    supplier: {
        address: string;
    };
}

export function getDevices(org: Organisation, loc: LocationObject, callback?: (devices: Device[]) => void) {
    ping(
        GRAPH_URL,
        'POST',
        `{
            devices(geoSearchCircle: {
                center: {
                    lat: ${loc.coords.latitude}
                    lng: ${loc.coords.longitude}
                },
                radius: 1050
            }, keysOwner: "${org.address}") {
                objects {
                    address name owner lat lng visible active connected description supplier distance
                    details {
                        deviceType deviceModel additionalDescription assetUrl
                        physicalAddress {
                            addressLine1 addressLine2 city postcode country floor 
                        }
                    }
                    key {
                        assetId owner
                    }
                }
            }
        }`
    )
        .then((e) => e.json())
        .then((e: any) => {
            const devices: Device[] = e['data']['devices']['objects'];

            if (callback)
                callback(
                    devices
                        // .filter((d) => org.suppliers.objects.map((o) => o.address).includes(d.supplier))
                        .sort((a, b) => a.distance - b.distance)
                );
        })
        .catch((err) => {
            throw new Error(err);
        });
}
export function getOrganisations(config: Config, callback?: (orgs: Organisation[]) => void) {
    ping(
        GRAPH_URL,
        'POST',
        `{
            organisations(member: "${config.account.address}") {
                objects {
                    address name description users
                    suppliers {
                        objects {
                            address
                        }
                    }
                }
            }
        }`
    )
        .then((e) => e.json())
        .then((e: any) => {
            const orgs: Organisation[] = e['data']['organisations']['objects'];

            if (callback) callback(orgs);
        })
        .catch((err) => {
            throw new Error(err);
        });
}
export function getKeys(callback?: (keys: Key[]) => void) {
    ping(
        GRAPH_URL,
        'POST',
        `{
            keys {
                objects {
                    assetId
                    owner
                    supplier {
                        address
                    }
                }
            }
        }`
    )
        .then((e) => e.json())
        .then((e: any) => {
            const keys: Key[] = e['data']['keys']['objects'];

            if (callback) callback(keys);
        })
        .catch((err) => {
            throw new Error(err);
        });
}

function ping(url: string, method: string, graphQuery: string) {
    return fetch(url, {
        headers: HEADERS,
        method: method,
        body: JSON.stringify({
            query: graphQuery
        })
    });
}
