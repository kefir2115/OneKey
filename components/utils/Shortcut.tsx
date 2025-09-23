import { Config } from '@/hooks/useConfig';
import { Device } from './Api';

import * as QuickActions from 'expo-quick-actions';

export function add(device: Device, config: Config): [boolean, string] {
    if (config.shortcuts.length < 4) {
        config.shortcuts.push({
            address: device.address,
            name: device.name
        });
        update(config);
        return [true, ''];
    }
    return [false, 'limit'];
}
export function remove(device: Device, config: Config): boolean {
    const item = config.shortcuts.find((shortcut) => shortcut.address === device.address);

    if (item) {
        config.shortcuts.splice(config.shortcuts.indexOf(item), 1);
        update(config);
        return true;
    }
    return false;
}

function update(config: Config) {
    QuickActions.setItems(
        config.shortcuts.map((d) => {
            return {
                id: d.address,
                title: d.name,
                icon: 'symbol:lock',
                params: {
                    address: d.address
                }
            } as QuickActions.Action;
        })
    );
}
