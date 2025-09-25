import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Image from '@/components/ui/Image';
import { landscape, landscapeDark, logo0, logo0Dark } from '@/constants/Icons';
import { global } from '@/constants/Styles';
import useConfig from '@/hooks/useConfig';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import { seedUtils } from '@waves/waves-transactions';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Welcome() {
    const { t } = useLang();
    const router = useRouter();
    const config = useConfig();
    const { color, theme } = useTheme();

    const goToImport = () => {
        router.navigate({
            pathname: '/pin',
            params: {
                next: '/recovery'
            }
        });
    };
    const goToCreate = () => {
        router.navigate({
            pathname: '/pin',
            params: {
                next: '/activate'
            }
        });
    };

    useEffect(() => {
        if (!config.account || !config.account.address) {
            config.account = {};
            config.account.seed = seedUtils.generateNewSeed(15);
            config.account.address = new seedUtils.Seed(config.account.seed).address;
            config.save();
        }
    }, [config]);

    return (
        <SafeAreaView style={[{ backgroundColor: color.background }, global.container]}>
            <Image
                style={s.logo}
                source={theme === 'dark' ? logo0Dark : logo0}
            />
            <Image
                style={s.img}
                source={theme === 'dark' ? landscapeDark : landscape}
            />

            <ThemedView style={s.texts}>
                <ThemedText style={s.text}>{t('welcome1')}</ThemedText>
                <ThemedText style={s.text}>{t('welcome2')}</ThemedText>
                <ThemedText style={s.text}>{t('welcome3')}</ThemedText>
            </ThemedView>

            <ThemedView style={s.buttons}>
                <Button
                    mode="contained"
                    buttonColor={color.green}
                    style={s.btn}
                    onPress={goToImport}
                >
                    {t('importAccount')}
                </Button>
                <Button
                    mode="contained"
                    buttonColor={color.blue}
                    style={s.btn}
                    onPress={goToCreate}
                >
                    {t('createAccount')}
                </Button>
            </ThemedView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    logo: {
        width: '100%',
        aspectRatio: 198 / 60,

        padding: 20,
        marginTop: '20%'
    },
    img: {
        height: '30%',
        aspectRatio: 544 / 232,
        marginTop: '20%'
    },
    texts: {
        marginVertical: '10%'
    },
    text: {
        fontSize: 12,
        textAlign: 'center'
    },
    buttons: {
        display: 'flex',
        flexDirection: 'column',

        width: '80%'
    },
    btn: {
        margin: 5
    }
});
