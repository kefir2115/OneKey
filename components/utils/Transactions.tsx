import { Config } from '@/hooks/useConfig';
import { Device } from './Api';

const TRANSACTION_URL = 'https://api.aggregator.skey.network/mobile/';
const NODE_URL = 'https://master.nodes.skey.network';
const CHAIN_ID = 'M';
const KEY = 'mobileapikeyhbrvpouevfgcdupv';

const aggregateTx = async (tx: any) => {
    await fetch(TRANSACTION_URL + 'aggregate', {
        method: 'POST',
        headers: {
            'x-api-key': KEY,
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify({
            tx: JSON.stringify(tx),
            txStatus: 'created'
        })
    });
};

const waitForTx = async (txId: string) => {
    const resp = await fetch(TRANSACTION_URL + `/wait-for-status/${txId}`, {
        method: 'GET',
        headers: {
            'x-api-key': KEY,
            'Content-Type': 'Application/json'
        }
    });
    const json = await resp.json();
    if (json.status !== 'ok') throw new Error(json.status);
};

export const openDevice = (device: Device, config: Config, callback: (success: boolean) => void) => {
    try {
        setTimeout(() => {
            callback(true);
        }, 2000);
    } catch (err) {
        callback(false);
    }
};
