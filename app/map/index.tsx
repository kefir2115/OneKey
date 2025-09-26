import { ThemedText } from '@/components/ThemedText';
import Image from '@/components/ui/Image';
import { Device, getDevices, getOrganisations } from '@/components/utils/Api';
import { check, navigation, navigationDark, navigationOn, navigationOnDark, pin0, pin1, xmark } from '@/constants/Icons';
import { global, mapDark, mapLight } from '@/constants/Styles';
import useCache from '@/hooks/useCache';
import useConfig from '@/hooks/useConfig';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import BottomSheet from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Keyboard, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import { Button, Card, Modal, Portal, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomList from './items/BottomList';
import SearchList from './items/SearchList';
import TopBar from './items/TopBar';
import Tutorial from './items/Tutorial';

export default function Map() {
    const router = useRouter();
    const config = useConfig();
    const cache = useCache();
    const props = useLocalSearchParams();
    const { t } = useLang();
    const { color, theme } = useTheme();
    const [snackOpen, setSnackOpen] = useState(props.opened !== undefined);
    const [loc, setLoc] = useState<Location.LocationObject | undefined>(undefined);
    const [search, setSearch] = useState('');
    const [locationModal, setLocationModal] = useState(false);
    const [isSatelite, setSatelite] = useState(false);
    const [currentPin, setCurrentPin] = useState(0);
    const [locStatus, setLocStatus] = useState(0);
    const [results, setResults] = useState<Device[]>([]);
    const [tutorialStep, setTutorialStep] = useState(-1);
    const [snapCause, setSnapCause] = useState<'map' | 'list' | null>(null);
    const [searchFocus, setSearchFocus] = useState(false);

    const [devices, setDevices] = useState(cache.data.devices);

    const mapRef = useRef<MapView>(null);
    const bottomSheet = useRef<BottomSheet>(null);
    const flatRef = useRef<FlatList<Device>>(null);

    const { width, height } = Dimensions.get('screen');
    const ITEM_WIDTH = width;

    useEffect(() => {
        if (props.tutorial && tutorialStep === -1) nextTutorial();
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
        pointToPin();
    }, [currentPin, props]);

    function pointToPin() {
        if (devices.length === 0) return;

        const device = devices[currentPin];
        if (devices.length > currentPin && snapCause !== 'list') {
            flatRef.current?.scrollToOffset({ offset: width * currentPin, animated: true });
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
    }

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
                    setDevices([...list]);

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

    const requestLocation = () => {
        Location.requestForegroundPermissionsAsync().then((e) => {
            if (e.granted) {
                setLocationModal(false);
                setLocStatus(0);
                getLoc(true);
            }
        });
    };

    const updateSearchBar = (str: string) => {
        setSearch(str);

        setResults((prev) => {
            return devices.filter((item) => (item.name + ' ' + item.description).toLowerCase().includes(str.toLowerCase()));
        });
    };

    const openLocationPrompt = () => {
        if (locStatus !== 0) setLocationModal(true);
    };

    const openKeyList = () => {
        router.navigate('/devices');
        setResults([]);
        setSearch('');
    };

    const onSearchPress = () => {
        setSearchFocus(true);
    };
    const onIconPress = () => {
        if (!searchFocus) return;

        setSearchFocus(false);
        setSearch('');
        Keyboard.dismiss();
    };

    const onScroll = (ev: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (snapCause !== 'list') return;

        const index = Math.round(ev.nativeEvent.contentOffset.x / ITEM_WIDTH);
        setCurrentPin(index);
    };

    const nextTutorial = () => {
        setTutorialStep(tutorialStep + 1);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: color.background }}>
            {loc !== undefined && (
                <MapView
                    provider="google"
                    loadingEnabled
                    loadingBackgroundColor={color.background}
                    loadingIndicatorColor={color.font}
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
                            key={`marker ${idx}`}
                            coordinate={{ latitude: device.lat, longitude: device.lng }}
                            image={currentPin === idx ? pin0 : pin1}
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
                <TopBar
                    search={search}
                    searchFocus={searchFocus}
                    onIconPress={onIconPress}
                    onSearchPress={onSearchPress}
                    updateSearchBar={updateSearchBar}
                    setResults={setResults}
                    setSatelite={setSatelite}
                    setSearch={setSearch}
                />
                <View
                    style={[style.bar]}
                    pointerEvents="box-none"
                >
                    {locStatus !== 0 && (
                        <ThemedText
                            style={style.popupLocation}
                            key={'popup'}
                        >
                            <ThemedText style={[{ fontSize: 12, backgroundColor: color.background, padding: 5 }]}>
                                {t('actionRequired')}
                            </ThemedText>
                        </ThemedText>
                    )}
                    <TouchableOpacity
                        style={[style.rightImg, loc ? border.use : null, { borderColor: color.blue }]}
                        onPress={openLocationPrompt}
                        key={'locbtn'}
                    >
                        <Image
                            key={'locimg'}
                            source={
                                locStatus === 0
                                    ? theme === 'light'
                                        ? navigationOn
                                        : navigationOnDark
                                    : theme === 'light'
                                    ? navigation
                                    : navigationDark
                            }
                        />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            {!searchFocus && (
                <BottomList
                    devices={devices}
                    bottomSheetRef={bottomSheet}
                    flatRef={flatRef}
                    openKeyList={openKeyList}
                    onScroll={(ev) => {
                        setSnapCause('list');
                        onScroll(ev);
                    }}
                />
            )}
            {search.length > 0 && (
                <SearchList
                    search={search}
                    onClick={() => {
                        setResults([]);
                        setSearch('');
                    }}
                    results={results}
                />
            )}
            <Portal>
                <Modal
                    visible={locationModal}
                    onDismiss={() => setLocationModal(false)}
                >
                    {locStatus === 1 && (
                        <Card style={{ backgroundColor: color.background, borderRadius: 20 }}>
                            <Card.Content>
                                <ThemedText>{t('noService')}</ThemedText>
                            </Card.Content>
                        </Card>
                    )}
                    {locStatus === 2 && (
                        <Card style={{ backgroundColor: color.background, borderRadius: 20 }}>
                            <Card.Content>
                                <ThemedText>{t('noPermission')}</ThemedText>
                            </Card.Content>
                            <Card.Actions>
                                <Button onPress={requestLocation}>{t('allow')}</Button>
                            </Card.Actions>
                        </Card>
                    )}
                </Modal>
            </Portal>
            <Portal>
                <Snackbar
                    onDismiss={() => setSnackOpen(false)}
                    visible={snackOpen}
                    duration={3000}
                    style={[
                        { backgroundColor: color.background, borderWidth: 1 },
                        { borderColor: props.opened === 'true' ? '#0f0' : '#f00' }
                    ]}
                >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Image
                            source={props.opened === 'true' ? check : xmark}
                            style={{ height: 20, aspectRatio: 1, margin: 5 }}
                        />
                        <ThemedText>{t(props.opened === 'true' ? 'gateOpenSuccess' : 'gateOpenFail')}</ThemedText>
                    </View>
                </Snackbar>
            </Portal>
            <Tutorial
                step={tutorialStep}
                nextStep={nextTutorial}
                bottomSheetRef={bottomSheet}
            />
        </GestureHandlerRootView>
    );
}

const style = StyleSheet.create({
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
    }
});
const border = StyleSheet.create({
    use: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 100
    }
});
