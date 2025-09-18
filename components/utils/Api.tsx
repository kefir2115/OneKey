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
            }) {
                objects {
                    address name owner lat lng visible active connected description supplier distance
                    details {
                        deviceType deviceModel additionalDescription assetUrl
                        physicalAddress {
                            addressLine1 addressLine2 city postcode country floor 
                        } 
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
                        .filter((d) => org.suppliers.objects.map((o) => o.address).includes(d.supplier))
                        .sort((a, b) => a.distance - b.distance)
                );
        })
        .catch((err) => {
            throw new Error(err);
        });
}
export function getOrganisations(callback?: (orgs: Organisation[]) => void) {
    ping(
        GRAPH_URL,
        'POST',
        `{
            organisations {
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
            const orgs: Organisation[] = e['data']['organisations']['objects'].filter((o: Organisation) =>
                o.users.includes('3KJhsp3e62agAVx47Zk5WsuH5ts5fWU1faY')
            );

            if (callback) callback(orgs);
        })
        .catch((err) => {
            throw new Error(err);
        });
}
export function getSuppliers() {
    ping(
        GRAPH_URL,
        'POST',
        `{
            suppliers {
                objects {
                    address
                    name
                }
            }
        }`
    )
        .then((e) => e.json())
        .then((e: any) => {
            console.log(e['data']['suppliers']['objects']);
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
