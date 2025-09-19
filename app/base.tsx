import useConfig from '@/hooks/useConfig';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import Loading from './loading';

export default function Base() {
    const router = useRouter();
    const config = useConfig();
    const [logged, setLogged] = useState(false);
    const [hasAccount, setHasAccount] = useState(false); // TODO: read from config

    useEffect(() => {
        (async () => {
            const hasAccount = config.account.seed && config.account.address;
            const logged = await (async () => true)(); // use getAddressStatus function from Transactions
            if (!hasAccount || !logged) router.replace('/welcome');
            else router.replace('/map');
        })();
    }, []);

    return <>{hasAccount && !logged && <Loading subtitle="Logging in..." />}</>;
}
