import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/ui/Header';
import Image from '@/components/ui/Image';
import { global } from '@/constants/Styles';
import useConfig from '@/hooks/useConfig';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import { FontAwesome } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import * as Crypto from 'expo-crypto';
import { authenticateAsync } from 'expo-local-authentication';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const arrow = require('../../assets/images/icons/arrow.svg');
const finger = require('../../assets/images/icons/finger.svg');
const COLOR = '#858FAB';

export default function Pin() {
    const { f } = useLang();
    const config = useConfig();
    const route = useRoute();
    const router = useRouter();
    const params = useLocalSearchParams();
    const prevPin = params.pin ? (params.pin as string).split(',') : [];
    const { color } = useTheme();
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
                        pathname: (params.next as any) || '/base',
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
                    if (config.pin === sha)
                        router.replace({
                            pathname: (params.next as any) || '/base',
                            params: params
                        });
                    else {
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
                    pathname: (params.next as any) || '/base',
                    params: params
                });
            }
        });
    };

    const createButton = (value: string, n: number) => {
        if ((value === 'arrow' && nums.length === 0) || (value === 'finger' && config.pin.length === 0))
            return (
                <View
                    key={Math.random()}
                    style={[s.pinView, { borderColor: '#0000' }]}
                ></View>
            );
        return (
            <TouchableOpacity
                key={n}
                style={[s.pinView, { borderColor: COLOR }]}
                onPress={() => (value === 'finger' ? bioAuth() : handleClick(n))}
            >
                {value === 'arrow' && (
                    <Image
                        source={arrow}
                        style={s.pinArrow}
                    />
                )}
                {value === 'finger' && (
                    <Image
                        source={finger}
                        style={s.pinArrow}
                    />
                )}
                {n >= 0 && <ThemedText style={s.pinText}>{value}</ThemedText>}
            </TouchableOpacity>
        );
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
            <Header title={f('back')} />
            <SafeAreaView style={[{ backgroundColor: color(0) }, global.container]}>
                <ThemedText style={s.insert}>{prevPin.length === 0 ? f('pinInsert') : f('pinRepeat')}</ThemedText>
                <ThemedView style={s.circles}>
                    {Array(4)
                        .fill(0)
                        .map((n, i) => (
                            <FontAwesome
                                key={i}
                                name={!nums[i] ? 'circle-thin' : 'circle'}
                                size={25}
                                color={color(1)}
                                style={{ margin: 8 }}
                            />
                        ))}
                </ThemedView>
                <ThemedView style={s.pinContainer}>
                    {buttons.map((d, idx) => createButton(String(d), typeof d === 'string' ? -1 * idx : d))}
                </ThemedView>
            </SafeAreaView>
            <Portal>
                <Dialog
                    visible={dialog}
                    onDismiss={hideDialog}
                    style={{ borderRadius: 25 }}
                >
                    <Dialog.Title>{f('pinInvalid')}</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">{f('pinTries', String(tries))}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Done</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
}
const s = StyleSheet.create({
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

        width: '70%'
    },
    pinView: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '25%',
        aspectRatio: 1,

        margin: 5,

        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 100
    },
    pinText: {
        margin: 'auto',
        fontSize: 30
    },
    pinArrow: {
        width: '50%',
        aspectRatio: 1
    }
});
