import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Image from '@/components/ui/Image';
import { Device, getDevices, getOrganisations } from '@/components/utils/Api';
import Path from '@/components/utils/PathUtils';
import { global, mapDark, mapLight } from '@/constants/Styles';
import useCache from '@/hooks/useCache';
import useConfig from '@/hooks/useConfig';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { randomUUID } from 'expo-crypto';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    ListRenderItemInfo,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import { Button, Card, Modal, Portal, Searchbar, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path as PathView } from 'react-native-svg';

const map = require('../../assets/images/testmap.png');
const info = require('../../assets/images/icons/info.svg');
const xmark = require('../../assets/images/icons/xmark.svg');
const check = require('../../assets/images/icons/check.svg');

const qr = require('../../assets/images/icons/qr.svg');
const qrDark = require('../../assets/images/icons/qr-dark.svg');

const key = require('../../assets/images/icons/key.svg');
const keyDark = require('../../assets/images/icons/key-dark.svg');

const layers = require('../../assets/images/icons/stack.svg');
const layersDark = require('../../assets/images/icons/stack-dark.svg');

const setting = require('../../assets/images/icons/settings.svg');
const settingDark = require('../../assets/images/icons/settings-dark.svg');

const location = require('../../assets/images/icons/navigation.svg');
const locationDark = require('../../assets/images/icons/navigation-dark.svg');
const locationOn = require('../../assets/images/icons/navigation-on.svg');
const locationOnDark = require('../../assets/images/icons/navigation-on-dark.svg');

const marker = require('../../assets/images/icons/pin-1.png');
const markerCurrent = require('../../assets/images/icons/pin-0.png');

export default function Map() {
    const router = useRouter();
    const config = useConfig();
    const cache = useCache();
    const props = useLocalSearchParams();
    const { f } = useLang();
    const { color, theme } = useTheme();
    const [snackOpen, setSnackOpen] = useState(props.opened !== undefined);
    const [loc, setLoc] = useState<Location.LocationObject | undefined>(undefined);
    const [search, setSearch] = useState('');
    const [locationModal, setLocationModal] = useState(false);
    const [isSatelite, setSatelite] = useState(false);
    const [currentPin, setCurrentPin] = useState(0);
    const [locStatus, setLocStatus] = useState(0);
    const [results, setResults] = useState<Device[]>([]);
    const [tutorial, setTutorial] = useState<{ step: number; path: string; text: { value: string; x: number; y: number } }>({
        step: -1,
        path: '',
        text: { value: '', x: 0, y: 0 }
    });
    const [snapCause, setSnapCause] = useState<'map' | 'list' | null>(null);

    const [devices, setDevices] = useState(cache.data.devices);

    const mapRef = useRef<MapView>(null);
    const bottomSheet = useRef<BottomSheet>(null);
    const flatRef = useRef<FlatList>(null);

    const { width, height } = useWindowDimensions();

    const ITEM_WIDTH = width * 0.9;

    const snaps = useMemo(() => ['10%', '40%'], []);

    useEffect(() => {
        if (props.tutorial && tutorial.step === -1) nextTutorial();
        if (loc === undefined) return;

        loadInfo();
        const interval = setInterval(() => {
            loadInfo();
        }, 10000);
        return (() => {
            clearInterval(interval);
        })();
    }, [cache, loc]);

    useEffect(() => {
        getLoc(false);
        Location.watchPositionAsync(
            {
                accuracy: Location.LocationAccuracy.High,
                timeInterval: 10000
            },
            (geoloc) => {
                if (geoloc === null) return;

                setLoc(geoloc);
                setLocStatus(0);
            }
        )
            .then((sub) => {
                sub.remove();
            })
            .catch(() => {
                // console.log('No location permission!');
            });
    }, []);

    useEffect(() => {
        const device = devices[currentPin];
        if (devices.length > currentPin && snapCause !== 'list') {
            flatRef.current?.scrollToIndex({ index: currentPin, animated: true, viewPosition: 0.5 });
        }
        mapRef.current?.animateToRegion(
            {
                latitude: device.lat,
                longitude: device.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            },
            500
        );
    }, [currentPin]);

    function loadInfo() {
        if (loc !== undefined)
            getOrganisations(config, (o) => {
                if (o.length === 0) return;
                cache.data.orgs = o;

                if (!config.account.org) {
                    config.account.org = o[0].address;
                    config.save();
                }

                const org = cache.data.orgs.find((e) => e.address === config.account.org);
                if (!org) return;

                getDevices(org, loc, (list) => {
                    if (list.length === 0) return;
                    setDevices(list);

                    cache.data.devices = list;
                    cache.save();
                });
            });
    }

    async function getLoc(current: boolean) {
        const func = current ? Location.getCurrentPositionAsync : Location.getLastKnownPositionAsync;

        func({ accuracy: Location.LocationAccuracy.High })
            .then((e) => {
                if (e === null) return;

                setLoc(e);
                setLocStatus(0);
            })
            .catch((err) => {
                setLoc(undefined);
                Location.hasServicesEnabledAsync().then((e) => {
                    setLocStatus(e ? 2 : 1);
                });
            });
    }

    const updateSearchBar = (str: string) => {
        setSearch(str);

        setResults((prev) => {
            return devices.filter((item) => (item.name + ' ' + item.description).toLowerCase().includes(str.toLowerCase()));
        });
    };

    const openLocationPrompt = () => {
        if (locStatus !== 0) setLocationModal(true);
    };

    const openScanner = () => {
        router.navigate('/map/scanner');
        setResults([]);
        setSearch('');
    };

    const openKeyList = () => {
        router.navigate('/devices');
        setResults([]);
        setSearch('');
    };
    const goToSettings = () => {
        router.navigate('/settings');
        setResults([]);
        setSearch('');
    };

    const requestLocation = () => {
        Location.requestForegroundPermissionsAsync().then((e) => {
            if (e.granted) {
                setLocationModal(false);
                setLocStatus(0);
                getLoc(true);
            }
        });
    };

    const onScroll = (ev: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (snapCause !== 'list') return;

        const index = Math.round(ev.nativeEvent.contentOffset.x / ITEM_WIDTH);
        setCurrentPin(index);
    };

    const nextTutorial = () => {
        let path = '',
            text = '';
        let x = 0,
            y = 0;

        switch (tutorial.step + 1) {
            case 0: {
                path = new Path(width, height).getRoundRect(0, height - height * 0.1, width, height * 0.1, 20);
                text = f('tutorial1');
                y = height - height * 0.1 - 40;
                break;
            }
            case 1: {
                bottomSheet.current?.snapToIndex(1);
                path = new Path(width, height).getCircle(width - width * 0.22, height - height * 0.21, 30);
                text = f('tutorial2');
                y = height - height * 0.3 - 40;
                break;
            }
            case 2: {
                path = new Path(width, height).getRoundRect(0, height - height * 0.25, width, height * 0.2, 20);
                text = f('tutorial3');
                y = height - height * 0.3 - 40;
                break;
            }
            case 3: {
                path = new Path(width, height).getRoundRect(0, height - height * 0.35, width, height * 0.1, 20);
                text = f('tutorial4');
                y = height - height * 0.4 - 40;
                break;
            }
            case 4: {
                path = new Path(width, height).getRoundRect(0, 0, width, height * 0.4, 20);
                text = f('tutorial5');
                y = height * 0.45;
                break;
            }
            default: {
                router.dismissAll();
                path = '';
                text = '';
                break;
            }
        }

        setTutorial((prev) => {
            return { ...{ step: tutorial.step + 1, path, text: { ...{ value: text, x, y } } } };
        });
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: color(0) }}>
            {loc !== undefined && (
                <MapView
                    loadingEnabled
                    loadingBackgroundColor={color(0)}
                    loadingIndicatorColor={color(1)}
                    initialRegion={
                        devices[currentPin]
                            ? {
                                  latitude: devices[currentPin].lat,
                                  longitude: devices[currentPin].lng,
                                  latitudeDelta: 0.005,
                                  longitudeDelta: 0.005
                              }
                            : {
                                  latitude: loc.coords.latitude,
                                  longitude: loc.coords.longitude,
                                  latitudeDelta: 0.005,
                                  longitudeDelta: 0.005
                              }
                    }
                    ref={mapRef}
                    mapType={isSatelite ? 'satellite' : 'standard'}
                    showsUserLocation
                    showsMyLocationButton={false}
                    showsCompass={false}
                    style={{ width: '100%', height: '100%' }}
                    customMapStyle={theme === 'dark' ? mapDark : mapLight}
                >
                    {devices.map((device, idx) => (
                        <Marker
                            key={'marker' + idx}
                            coordinate={{ latitude: device.lat, longitude: device.lng }}
                            image={currentPin === idx ? markerCurrent : marker}
                            onSelect={() => {
                                setSnapCause('map');
                                setCurrentPin(idx);
                            }}
                        />
                    ))}
                </MapView>
            )}
            <SafeAreaView
                style={[
                    global.container,
                    {
                        position: 'absolute',
                        flex: 1
                    }
                ]}
            >
                <View style={style.topbar}>
                    <Searchbar
                        value={search}
                        onChangeText={updateSearchBar}
                        style={[style.searchBox, { backgroundColor: color(0) }]}
                        inputStyle={{ color: color(1) }}
                        cursorColor={color(4)}
                        placeholder={f('search')}
                        placeholderTextColor={color(1) + 'aa'}
                        iconColor={color(1)}
                    />
                    <TouchableOpacity
                        style={{ width: 50, aspectRatio: 1 }}
                        onPress={goToSettings}
                    >
                        <Image source={theme === 'light' ? setting : settingDark} />
                    </TouchableOpacity>
                </View>
                <View
                    style={style.bar}
                    pointerEvents="box-none"
                >
                    <TouchableOpacity
                        style={[style.rightImg]}
                        onPress={() => setSatelite((s) => !s)}
                    >
                        <Image source={theme === 'light' ? layers : layersDark} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[style.rightImg]}
                        onPress={openScanner}
                    >
                        <Image source={theme === 'light' ? qr : qrDark} />
                    </TouchableOpacity>
                </View>
                <View
                    style={[style.bar]}
                    pointerEvents="box-none"
                >
                    {locStatus !== 0 && (
                        <ThemedText
                            style={style.popupLocation}
                            key={'popup'}
                        >
                            <ThemedText style={[{ fontSize: 12, backgroundColor: color(0), padding: 5 }]}>{f('actionRequired')}</ThemedText>
                        </ThemedText>
                    )}
                    <TouchableOpacity
                        style={[style.rightImg, loc ? border.use : null, { borderColor: color(4) }]}
                        onPress={openLocationPrompt}
                        key={'locbtn'}
                    >
                        <Image
                            key={'locimg'}
                            source={
                                locStatus === 0
                                    ? theme === 'light'
                                        ? locationOn
                                        : locationOnDark
                                    : theme === 'light'
                                    ? location
                                    : locationDark
                            }
                        />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <BottomSheet
                index={0}
                snapPoints={snaps}
                ref={bottomSheet}
                style={{ borderRadius: 20 }}
                handleIndicatorStyle={{ backgroundColor: color(3) + 'aa' }}
                overDragResistanceFactor={0}
                enablePanDownToClose={false}
                enableContentPanningGesture={false}
                enableHandlePanningGesture={true}
                animateOnMount={true}
                backgroundStyle={{ backgroundColor: color(0), pointerEvents: 'none' }}
            >
                <BottomSheetView>
                    <TouchableOpacity
                        style={style.bottomHeader}
                        onPress={openKeyList}
                    >
                        <ThemedText style={style.cardTitle}>{f('gates')}</ThemedText>
                        <Image
                            source={theme === 'light' ? key : keyDark}
                            style={style.list}
                        />
                    </TouchableOpacity>
                    {devices.length !== 0 && (
                        <FlatList
                            horizontal
                            style={{ marginBottom: '15%', height: '100%' }}
                            data={devices}
                            ref={flatRef}
                            onScroll={(ev) => {
                                setSnapCause('list');
                                onScroll(ev);
                            }}
                            snapToInterval={ITEM_WIDTH}
                            pagingEnabled
                            renderItem={(e: ListRenderItemInfo<any>) => {
                                return (
                                    <ItemEntry
                                        device={e.item}
                                        key={e.index}
                                    />
                                );
                            }}
                            keyExtractor={(i: any) => randomUUID()}
                            nestedScrollEnabled
                        />
                    )}
                    {devices.length === 0 && (
                        <View style={nodevices.container}>
                            <Image
                                source={xmark}
                                style={nodevices.icon}
                            />
                            <ThemedText style={nodevices.message}>{f('noDevices')}</ThemedText>
                        </View>
                    )}
                </BottomSheetView>
            </BottomSheet>
            {search.length > 0 && (
                <Portal>
                    <ThemedView style={{ flex: 1, marginTop: '40%' }}>
                        <ThemedText style={{ textAlign: 'center' }}>{f('results', search)}</ThemedText>
                        {results.length > 0 && (
                            <GestureHandlerRootView>
                                <FlatList
                                    data={devices}
                                    keyExtractor={(it, i) => String(i)}
                                    renderItem={(e) => {
                                        if (results.includes(e.item))
                                            return (
                                                <ItemEntry
                                                    device={e.item}
                                                    key={e.index}
                                                    onClick={() => {
                                                        setResults([]);
                                                        setSearch('');
                                                    }}
                                                />
                                            );
                                        return null;
                                    }}
                                />
                            </GestureHandlerRootView>
                        )}
                        {results.length === 0 && (
                            <ThemedView style={{ alignSelf: 'center', alignItems: 'center', marginTop: '20%' }}>
                                <ThemedText style={{ textAlign: 'center', fontSize: 20, fontFamily: 'PoppinsBold' }}>
                                    {f('noResults')}
                                </ThemedText>
                                <Image
                                    source={xmark}
                                    style={{ width: '20%', aspectRatio: 1 }}
                                />
                            </ThemedView>
                        )}
                    </ThemedView>
                </Portal>
            )}
            <Portal>
                <Modal
                    visible={locationModal}
                    onDismiss={() => setLocationModal(false)}
                >
                    {locStatus === 1 && (
                        <Card style={{ backgroundColor: color(0), borderRadius: 20 }}>
                            <Card.Content>
                                <ThemedText>{f('noService')}</ThemedText>
                            </Card.Content>
                        </Card>
                    )}
                    {locStatus === 2 && (
                        <Card style={{ backgroundColor: color(0), borderRadius: 20 }}>
                            <Card.Content>
                                <ThemedText>{f('noPermission')}</ThemedText>
                            </Card.Content>
                            <Card.Actions>
                                <Button onPress={requestLocation}>{f('allow')}</Button>
                            </Card.Actions>
                        </Card>
                    )}
                </Modal>
                <Snackbar
                    onDismiss={() => setSnackOpen(false)}
                    visible={snackOpen}
                    duration={3000}
                    style={[{ backgroundColor: color(0), borderWidth: 1 }, { borderColor: props.opened === 'true' ? '#0f0' : '#f00' }]}
                >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Image
                            source={props.opened === 'true' ? check : xmark}
                            style={{ height: 20, aspectRatio: 1, margin: 5 }}
                        />
                        <ThemedText>{f(props.opened === 'true' ? 'gateOpenSuccess' : 'gateOpenFail')}</ThemedText>
                    </View>
                </Snackbar>
            </Portal>
            {tutorial.step >= 0 && (
                <Portal>
                    <TouchableOpacity
                        style={[StyleSheet.absoluteFill]}
                        onPress={nextTutorial}
                    >
                        <Svg
                            width={width}
                            height={height}
                        >
                            <PathView
                                d={tutorial.path}
                                fill="#0000008f"
                                fillRule="evenodd"
                            />
                        </Svg>
                    </TouchableOpacity>
                    <ThemedText
                        style={{ position: 'absolute', top: tutorial.text.y, left: tutorial.text.x, textAlign: 'center', width: '100%' }}
                    >
                        {tutorial.text.value}
                    </ThemedText>
                    <ThemedText style={{ position: 'absolute', top: '50%', textAlign: 'center', width: '100%', opacity: 0.7 }}>
                        {f('tutorialClick')}
                    </ThemedText>
                </Portal>
            )}
        </GestureHandlerRootView>
    );
}

const ItemEntry = ({ device, onClick, ...rest }: { device: Device; onClick?: () => void }) => {
    const { f } = useLang();
    const { color } = useTheme();
    const router = useRouter();

    const openDeviceInfo = () => {
        onClick?.();
        router.navigate({
            pathname: '/devices/info',
            params: {
                address: device.address
            }
        });
    };

    const openDoor = () => {
        onClick?.();
        router.replace({
            pathname: '/devices/open',
            params: {
                address: device.address
            }
        });
    };

    return (
        <Card
            style={[{ backgroundColor: color(0) }, card.container]}
            {...rest}
        >
            <Card.Content>
                <ThemedView style={card.header}>
                    <ThemedText style={card.distance}>{device.distance.toFixed(1)}m</ThemedText>
                    <TouchableOpacity onPress={() => openDeviceInfo()}>
                        <Image
                            source={info}
                            style={card.img}
                        />
                    </TouchableOpacity>
                </ThemedView>
                <ThemedText style={card.name}>{device.name}</ThemedText>
                <ThemedText style={card.location}>
                    {device.details.physicalAddress.addressLine1} {device.details.physicalAddress.addressLine2}
                    {device.details.physicalAddress.postcode} {device.details.physicalAddress.city}
                </ThemedText>
            </Card.Content>
            <Card.Actions>
                <Button onPress={openDoor}>{f('open')}</Button>
            </Card.Actions>
        </Card>
    );
};

const card = StyleSheet.create({
    container: {
        margin: 20,
        borderRadius: 20
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    distance: {
        fontFamily: 'PoppinsBold',
        fontSize: 20
    },
    img: {
        width: 30,
        aspectRatio: 1
    },
    name: {
        fontFamily: 'PoppinsMedium',
        fontSize: 18
    },
    location: {}
});

const style = StyleSheet.create({
    topbar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    searchBox: {
        margin: '5%',
        width: '75%'
    },
    cardTitle: {
        fontSize: 24,
        lineHeight: 30,
        fontFamily: 'PoppinsMedium',
        margin: 10
    },
    bar: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',

        width: '100%'
    },
    rightImg: {
        width: '10%',
        aspectRatio: 1,
        marginHorizontal: '5%',
        marginVertical: 5,
        elevation: 10
    },
    popupLocation: {
        position: 'absolute',
        right: 0,
        textAlign: 'right',

        fontSize: 12,
        marginRight: '10%',
        padding: 20,
        overflow: 'hidden'
    },
    list: {
        width: 30,
        aspectRatio: 1
    },
    bottomHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: '5%'
    }
});
const border = StyleSheet.create({
    use: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 100
    }
});
const nodevices = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: '10%'
    },
    icon: {
        width: '20%',
        aspectRatio: 1
    },
    message: {
        fontSize: 18,
        lineHeight: 24,
        fontFamily: 'PoppinsMedium'
    }
});
