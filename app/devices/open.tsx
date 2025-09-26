import { Device } from '@/components/utils/Api';
import { openDevice } from '@/components/utils/Transactions';
import useCache from '@/hooks/useCache';
import useConfig from '@/hooks/useConfig';
import useLang from '@/hooks/useLang';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Loading from '../loading';

export default function Open() {
    const router = useRouter();
    const config = useConfig();
    const cache = useCache();
    const props = useLocalSearchParams();
    const [device, setDevice] = useState<Device | undefined>(undefined);
    const { t } = useLang();

    useEffect(() => {
        setDevice(cache.data.devices.filter((d) => d.address === props.address)[0]);
    }, [cache]);

    useEffect(() => {
        if (device === undefined) return;

        openDevice(device, config, cache, (result) => {
            cache.data.history.push({
                address: device.address,
                success: result,
                at: Date.now()
            });
            router.replace({
                pathname: '/map',
                params: { opened: result ? 'true' : 'false' }
            });
        });
    }, [device]);

    if (device === undefined) return <View></View>;

    return (
        <Loading
            subtitle={t('opening')}
            address={{
                code: device.details.physicalAddress.city,
                street: device.details.physicalAddress.addressLine1
            }}
        />
    );
}
