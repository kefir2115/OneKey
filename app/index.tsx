import { verifyUser } from '@/components/utils/Transactions';
import useCache from '@/hooks/useCache';
import useConfig, { Language } from '@/hooks/useConfig';
import useTheme from '@/hooks/useTheme';
import * as Localization from 'expo-localization';
import * as NavigationBar from 'expo-navigation-bar';
import * as QuickActions from 'expo-quick-actions';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import Loading from './loading';

export default function Base() {
    const { color, theme } = useTheme();
    const cache = useCache();
    const router = useRouter();
    const config = useConfig();

    const detectLanguage = () => {
        const languages = ['en', 'pl'] as Language[];
        const userLanguage = (Localization.getLocales()
            .map((l) => l.languageTag.split('-')[0])
            .filter((e) => languages.includes(e as any))[0] || 'en') as Language;
        config.language = userLanguage;
        config.save();
        console.log('Set user language to:', userLanguage);
    };

    const verify = () => {
        (async () => {
            if (config.account && config.account.address && config.account.active) {
                const success = await verifyUser(config);
                if (success) return;

                setTimeout(() => {
                    router.dismissAll();
                    router.replace('/welcome');
                }, 1000);
            }
        })();
    };

    useEffect(() => {
        if (Platform.OS === 'android') {
            NavigationBar.setStyle('auto');
        }

        detectLanguage();
        verify();

        QuickActions.addListener((action) => {
            if (action.params)
                router.navigate({
                    pathname: '/devices/info',
                    params: {
                        address: action.params.address as string
                    }
                });
        });

        (async () => {
            const hasAccount = config.account && config.account.seed && config.account.address;
            const logged = config.account && config.account.active;
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
