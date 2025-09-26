import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/ui/Header';
import Image from '@/components/ui/Image';
import { circle, circleFull, circleFullDark } from '@/constants/Icons';
import { global } from '@/constants/Styles';
import useConfig from '@/hooks/useConfig';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import * as Crypto from 'expo-crypto';
import { authenticateAsync } from 'expo-local-authentication';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import PinButton from './items/PinButton';

export default function Pin() {
    const { t } = useLang();
    const config = useConfig();
    const router = useRouter();
    const params = useLocalSearchParams();
    const prevPin = params.pin ? (params.pin as string).split(',') : [];
    const { color, theme } = useTheme();
    const [nums, setNums] = useState<number[]>([]);
    const [dialog, setDialog] = useState(false);
    const [tries, setTries] = useState(3);

    const buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'arrow', 0, 'finger'];

    useEffect(() => {
        if (config.biometric && config.pin.length > 0) {
            bioAuth();
        }
    }, []);

    useEffect(() => {
        if (nums.length === 4 && prevPin.length === 4) {
            const isCorrect = nums.filter((n, i) => prevPin[i] === String(n)).length === 4;

            if (!isCorrect) {
                setNums([]);
                showDialog();
                setTries((t) => --t);
            } else {
                Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nums.join(',')).then((sha) => {
                    config.pin = sha;
                    config.save();

                    router.replace({
                        pathname: (params.next as any) || '/',
                        params: params
                    });
                });
            }
        }
        if (nums.length === 4 && prevPin.length === 0) {
            if (config.pin.length === 0) {
                router.navigate({
                    pathname: '/pin',
                    params: {
                        ...params,
                        pin: nums.join(',')
                    }
                });
                setNums([]);
                setTries(3);
            } else {
                Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nums.join(',')).then((sha) => {
                    if (config.pin === sha) {
                        if (params.noDismiss !== '1') router.dismiss(params.pin !== undefined ? 2 : 1);
                        router.replace({
                            pathname: (params.next as any) || '/',
                            params: params
                        });
                    } else {
                        setNums([]);
                        showDialog();
                        setTries((t) => --t);
                    }
                });
            }
        }
    }, [nums]);

    const handleClick = (n: number) => {
        if (n < 0) setNums((array) => [...array.slice(0, -1)]);
        else if (nums.length < 4) {
            setNums((array) => [...array, n]);
        }
    };
    const bioAuth = () => {
        authenticateAsync().then((r) => {
            if (r.success) {
                router.replace({
                    pathname: (params.next as any) || '/',
                    params: params
                });
            }
        });
    };

    const hideDialog = () => {
        setDialog(false);
        if (tries === 0) {
            router.navigate('/pin');
        }
    };
    const showDialog = () => setDialog(true);

    return (
        <>
            <Header title={t('back')} />
            <SafeAreaView style={[{ backgroundColor: color.background }, global.container]}>
                <ThemedText style={style.insert}>{prevPin.length === 0 ? t('pinInsert') : t('pinRepeat')}</ThemedText>
                <ThemedView style={style.circles}>
                    {Array(4)
                        .fill(0)
                        .map((n, i) => (
                            <Image
                                key={`circle-${i}`}
                                source={nums[i] === undefined ? circle : theme === 'light' ? circleFull : circleFullDark}
                                style={style.circle}
                            />
                        ))}
                </ThemedView>
                <ThemedView style={style.pinContainer}>
                    {buttons.map((d, idx) => (
                        <PinButton
                            value={String(d)}
                            n={typeof d === 'string' ? -1 * idx : d}
                            bioAuth={bioAuth}
                            handleClick={handleClick}
                            nums={nums}
                            key={`key${idx}`}
                        />
                    ))}
                </ThemedView>
            </SafeAreaView>
            <Portal>
                <Dialog
                    visible={dialog}
                    onDismiss={hideDialog}
                    style={{ borderRadius: 25 }}
                >
                    <Dialog.Title>{t('pinInvalid')}</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">{t('pinTries', String(tries))}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>{t('gotIt')}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
}
const style = StyleSheet.create({
    insert: {
        fontSize: 40,
        lineHeight: 60,
        fontFamily: 'PoppinsLight'
    },
    circles: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: '10%'
    },
    pinContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',

        width: '80%'
    },
    circle: {
        width: 30,
        aspectRatio: 1,
        margin: 5
    }
});
