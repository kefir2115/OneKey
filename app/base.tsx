import useConfig from '@/hooks/useConfig';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import Loading from './loading';

export default function Base() {
    const router = useRouter();
    const config = useConfig();

    useEffect(() => {
        (async () => {
            const hasAccount = config.account.seed && config.account.address;
            const logged = await (async () => true)(); // TODO use getAddressStatus function from Transactions
            if (!hasAccount || !logged) router.replace('/welcome');
            else router.replace('/map');
        })();
    }, []);

    return (
        <>
            <Loading />
        </>
    );
}
