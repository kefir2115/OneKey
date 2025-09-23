import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import Image from '@/components/ui/Image';
import Segments from '@/components/ui/Segments';
import { Device } from '@/components/utils/Api';
import { add, remove } from '@/components/utils/Shortcut';
import { global } from '@/constants/Styles';
import useCache from '@/hooks/useCache';
import useConfig from '@/hooks/useConfig';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import { setStringAsync } from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Map, { Marker } from 'react-native-maps';
import { Card, List, Portal, Snackbar } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

const info = require('../../assets/images/icons/info.svg');

const open = require('../../assets/images/icons/open.svg');
const openDark = require('../../assets/images/icons/open-dark.svg');

const qrc = require('../../assets/images/icons/qr.svg');
const qrDark = require('../../assets/images/icons/qr-dark.svg');

const settings = require('../../assets/images/icons/settings.svg');
const settingsDark = require('../../assets/images/icons/settings-dark.svg');

const stack = require('../../assets/images/icons/stack.svg');
const stackDark = require('../../assets/images/icons/stack-dark.svg');

const check = require('../../assets/images/icons/check.svg');
const maptest = require('../../assets/images/testmap.png');

const more = require('../../assets/images/icons/more.svg');
const moreDark = require('../../assets/images/icons/more-dark.svg');

const copyl = require('../../assets/images/icons/copy.svg');
const copyDark = require('../../assets/images/icons/copy-dark.svg');

const pin = require('../../assets/images/icons/pin-1.png');
const pinCurrent = require('../../assets/images/icons/pin-0.png');

export default function Info() {
    const { f } = useLang();
    const config = useConfig();
    const cache = useCache();
    const router = useRouter();
    const [scene, setScene] = useState(0);

    const { color, theme } = useTheme();
    const props = useLocalSearchParams();
    const { width } = useWindowDimensions();

    const [snack, setSnack] = useState<[boolean, string]>([false, '']);
    const [dev, setDev] = useState<Device | undefined>(undefined);

    const [isShortcut, setIsShortcut] = useState(false);

    useEffect(() => {
        setDev(cache.data.devices.filter((d) => d.address === props.address)[0]);
    }, [cache]);
    useEffect(() => {
        if (!dev) return;

        setIsShortcut(config.shortcuts.find((s) => s.address === dev.address) !== undefined);
    }, [dev]);

    const copySecret = () => {
        setStringAsync(props.secret as string);
    };
    const openDoor = () => {
        if (!dev) return;

        router.replace({
            pathname: '/devices/open',
            params: {
                address: dev.address
            }
        });
    };

    const toggleShortcut = () => {
        if (!dev) return;

        let status = false;
        if (isShortcut) status = remove(dev, config);
        else {
            const addOperation = add(dev, config);
            status = addOperation[0];
        }

        setSnack([true, f(status ? 'operationSuccess' : 'operationFail')]);
        setIsShortcut(config.shortcuts.find((s) => s.address === dev.address) !== undefined);
    };

    if (!dev) return <View></View>;

    return (
        <GestureHandlerRootView>
            <Header title={'Back'} />
            <SafeAreaView style={[global.container, { backgroundColor: color(0) }]}>
                <ThemedText style={style.deviceName}>{dev.name || f('gateFallback')}</ThemedText>
                <ThemedText style={[style.deviceName, style.deviceDesc]}>{dev.description || f('descFallback')}</ThemedText>
                <Segments
                    style={{ width: '90%' }}
                    value={scene}
                    values={[f('qrCode'), f('info'), f('more')]}
                    icons={[
                        <Image
                            key={0}
                            source={theme === 'light' ? qrc : qrDark}
                            style={style.img}
                        />,
                        <Image
                            key={1}
                            source={theme === 'light' ? stack : stackDark}
                            style={style.img}
                        />,
                        <Image
                            key={2}
                            source={theme === 'light' ? settings : settingsDark}
                            style={style.img}
                        />
                    ]}
                    onChange={(idx) => setScene(idx)}
                />
                {scene === 0 && (
                    <Card style={[qr.card, { backgroundColor: color(0) }]}>
                        <Card.Content>
                            <View style={{ alignSelf: 'center' }}>
                                <QRCode
                                    size={width / 1.75}
                                    quietZone={width / 50}
                                    value={`https://www.caruma.io/iot/${dev.address}`}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={copySecret}
                                style={qr.field}
                            >
                                <ThemedText
                                    style={qr.value}
                                    numberOfLines={1}
                                >
                                    {dev.address}
                                </ThemedText>
                                <Image
                                    style={qr.img}
                                    source={theme === 'light' ? copyl : copyDark}
                                />
                            </TouchableOpacity>
                        </Card.Content>
                    </Card>
                )}
                {scene === 1 && (
                    <ScrollView
                        style={{ width: '100%' }}
                        contentContainerStyle={style.scroll}
                    >
                        <Card style={[map.mapCard, { backgroundColor: color(0) }]}>
                            <Card.Content style={map.mapTop}>
                                <ThemedView style={map.status}>
                                    <Image
                                        source={check}
                                        style={map.statusImg}
                                    />
                                    <ThemedText style={map.statusText}>
                                        {f(Boolean(dev.active) ? 'statusActive' : 'statusDisconnected')}
                                    </ThemedText>
                                </ThemedView>
                                <ThemedText style={map.distance}>{dev.distance.toFixed(1)}m</ThemedText>
                            </Card.Content>
                            <Map
                                style={map.map}
                                initialRegion={{
                                    latitude: dev.lat,
                                    longitude: dev.lng,
                                    latitudeDelta: 0.005,
                                    longitudeDelta: 0.005
                                }}
                            >
                                <Marker
                                    coordinate={{ latitude: dev.lat, longitude: dev.lng }}
                                    key={0}
                                    title={dev.name || f('gateFallback')}
                                    image={pinCurrent}
                                />
                            </Map>
                            <ThemedText style={{ textAlign: 'right', fontFamily: 'PoppinsLight' }}>
                                {dev.details.physicalAddress.addressLine1 + ' ' + dev.details.physicalAddress.addressLine2 ||
                                    f('addressFallback')}{' '}
                                {dev.details.physicalAddress.postcode || ''} {dev.details.physicalAddress.city}
                            </ThemedText>
                            <Card.Actions>
                                <Button
                                    style={{ backgroundColor: color(4) + 'aa' }}
                                    onClick={openDoor}
                                >
                                    {f('open')}
                                </Button>
                            </Card.Actions>
                        </Card>
                        <Card style={[device.card, { backgroundColor: color(0) }]}>
                            <Card.Content style={device.content}>
                                <ThemedView style={device.top}>
                                    <Image
                                        source={info}
                                        style={device.img}
                                    />
                                    <ThemedText style={device.title}>{f('device')}</ThemedText>
                                </ThemedView>
                                <List.Section style={device.list}>
                                    <List.Item
                                        titleStyle={{ color: color(1) }}
                                        title={f('deviceType')}
                                        right={() => <ThemedText>{dev.details.deviceType}</ThemedText>}
                                    />
                                    <List.Item
                                        titleStyle={{ color: color(1) }}
                                        title={f('deviceModel')}
                                        right={() => <ThemedText>{dev.details.deviceModel}</ThemedText>}
                                    />
                                </List.Section>
                            </Card.Content>
                        </Card>
                    </ScrollView>
                )}
                {scene === 2 && (
                    <Card style={[bonus.card, { backgroundColor: color(0) }]}>
                        <Card.Content>
                            <TouchableOpacity
                                style={bonus.btn}
                                onPress={toggleShortcut}
                            >
                                <Image
                                    source={theme === 'light' ? open : openDark}
                                    style={bonus.img}
                                />
                                <ThemedText style={bonus.text}>{f(isShortcut ? 'remShortcut' : 'addShortcut')}</ThemedText>
                            </TouchableOpacity>
                        </Card.Content>
                    </Card>
                )}
            </SafeAreaView>
            <Portal>
                <Snackbar
                    duration={2000}
                    visible={snack[0]}
                    onDismiss={() => setSnack([false, snack[1]])}
                >
                    {snack[1]}
                </Snackbar>
            </Portal>
        </GestureHandlerRootView>
    );
}

const qr = StyleSheet.create({
    card: {
        width: '90%',
        alignItems: 'center',
        marginVertical: '5%'
    },
    field: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        backgroundColor: '#00000013',
        paddingHorizontal: '5%',
        padding: 5,
        borderRadius: 10,
        marginTop: 10
    },
    value: {
        textOverflow: 'ellipsis',
        width: '80%'
    },
    img: {
        width: '10%',
        aspectRatio: 1
    }
});
const style = StyleSheet.create({
    more: {
        width: '15%',
        aspectRatio: 1 / 3
    },
    deviceName: {
        fontSize: 20,
        lineHeight: 26,
        fontFamily: 'PoppinsMedium',
        alignSelf: 'flex-start',
        marginLeft: '5%',
        margin: 5
    },
    deviceDesc: {
        fontSize: 14,
        lineHeight: 16,
        fontFamily: 'PoppinsLight',
        marginLeft: '7%',
        opacity: 0.7
    },
    scroll: {
        alignItems: 'center'
    },
    img: {
        width: '20%',
        aspectRatio: 1
    }
});

const map = StyleSheet.create({
    mapCard: {
        width: '90%',
        alignItems: 'center',
        marginVertical: '5%'
    },
    mapTop: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    status: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusImg: {
        width: '20%',
        aspectRatio: 1
    },
    statusText: {
        marginLeft: '5%',
        fontFamily: 'PoppinsLight'
    },
    distance: {
        fontFamily: 'PoppinsBold'
    },
    mapOverlay: {
        overflow: 'hidden',
        borderRadius: 25,
        width: '90%',
        elevation: 5,
        marginTop: '5%'
    },
    map: {
        width: '90%',
        aspectRatio: 1
    }
});

const device = StyleSheet.create({
    card: {
        width: '90%',
        marginVertical: '5%'
    },
    content: {
        display: 'flex',
        flexDirection: 'column'
    },
    top: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%'
    },
    img: {
        width: '10%',
        aspectRatio: 1
    },
    title: {
        marginLeft: '5%'
    },
    list: {}
});

const bonus = StyleSheet.create({
    card: {
        width: '90%',
        marginVertical: '5%'
    },
    btn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: '#00000013',
        borderRadius: 30,
        paddingVertical: 10
    },
    img: {
        width: '10%',
        aspectRatio: 1
    },
    text: {
        marginLeft: '5%'
    }
});
