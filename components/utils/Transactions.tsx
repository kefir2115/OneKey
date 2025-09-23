import { Cache } from '@/hooks/useCache';
import { Config } from '@/hooks/useConfig';
import * as Crypto from '@waves/ts-lib-crypto';
import * as Transactions from '@waves/waves-transactions';
import { broadcast, IInvokeScriptParams, invokeScript } from '@waves/waves-transactions';
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

export const openDevice = async (device: Device, config: Config, cache: Cache, callback: (success: boolean) => void) => {
    try {
        const invokeTx = invokeScript(
            {
                dApp: device.supplier,
                chainId: CHAIN_ID,
                call: device.owner
                    ? ({
                          function: 'deviceActionAs',
                          args: [
                              { type: 'string', value: device.key.assetId },
                              { type: 'string', value: 'open' },
                              { type: 'string', value: device.key.owner },
                              { type: 'string', value: config.account.address }
                          ]
                      } as IInvokeScriptParams['call'])
                    : ({
                          function: 'deviceAction',
                          args: [
                              { type: 'string', value: device.key.assetId },
                              { type: 'string', value: 'open' }
                          ]
                      } as IInvokeScriptParams['call'])
            },
            config.account.seed
        );

        const tx = await broadcast(invokeTx, NODE_URL);

        await aggregateTx(invokeTx);
        await waitForTx(tx.id);

        callback(true);
    } catch (err) {
        console.error(err);

        callback(false);
    }
};

export function seedToAddress(seed: string): string {
    const key = Crypto.publicKey(seed);
    return Crypto.address({ publicKey: key }, CHAIN_ID);
}
export async function verifyUser(config: Config): Promise<boolean> {
    const key = Crypto.publicKey(config.account.seed);
    const auth = Transactions.auth(
        {
            host: NODE_URL,
            data: '',
            publicKey: key
        },
        config.account.seed,
        CHAIN_ID
    );
    return auth.address === config.account.address;
}
export async function logOut(config: Config, cache: Cache): Promise<boolean> {
    try {
        config.account = {};
        config.pin = '';
        config.save();

        cache.data = {
            devices: [],
            keys: [],
            orgs: []
        };
        cache.save();

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
