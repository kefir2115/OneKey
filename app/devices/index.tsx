import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/ui/Header';
import Image from '@/components/ui/Image';
import { Device } from '@/components/utils/Api';
import { global } from '@/constants/Styles';
import useCache from '@/hooks/useCache';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import { setStringAsync } from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CopyField } from '../settings';

// const back = require("../../assets/images/icons/back.svg");

const info = require('../../assets/images/icons/info.svg');

const qr = require('../../assets/images/icons/qr.svg');
const qrDark = require('../../assets/images/icons/qr-dark.svg');

// const copy = require("../../assets/images/icons/copy.svg");
// const copyDark = require("../../assets/images/icons/copy-dark.svg");

const active = require('../../assets/images/icons/check.svg');
const disconnected = require('../../assets/images/icons/xmark.svg');
const idle = require('../../assets/images/icons/idle.svg');
const inactive = require('../../assets/images/icons/key-inactive.svg');

export default function Devices() {
    const router = useRouter();
    const cache = useCache();
    const { color, theme } = useTheme();

    const goToScanner = () => {
        router.navigate('/map/scanner');
    };

    return (
        <>
            <Header
                title="Your devices"
                content={
                    <TouchableOpacity
                        onPress={goToScanner}
                        style={{ aspectRatio: 1, width: '15%', margin: 20 }}
                    >
                        <Image source={theme === 'dark' ? qrDark : qr} />
                    </TouchableOpacity>
                }
            />
            <SafeAreaView style={[global.container, { backgroundColor: color(0) }]}>
                <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                    {cache.data.devices.map((device, idx) => (
                        <DeviceEntry
                            key={idx}
                            device={device}
                        />
                    ))}
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

function DeviceEntry({ device }: { device: Device }) {
    const { f } = useLang();
    const router = useRouter();
    const { color, theme } = useTheme();

    const goToDeviceInfo = () => {
        router.navigate({
            pathname: '/devices/info',
            params: {
                address: device.address
            }
        });
    };

    return (
        <ThemedView style={s.device}>
            <ThemedView style={{ flex: 1 }}>
                <ThemedView style={s.infobar}>
                    <ThemedText
                        style={s.deviceTitle}
                        numberOfLines={1}
                    >
                        {device.name}
                    </ThemedText>
                    <TouchableOpacity
                        style={{ aspectRatio: 1, width: '10%', marginHorizontal: 5 }}
                        onPress={goToDeviceInfo}
                    >
                        <Image source={info} />
                    </TouchableOpacity>
                </ThemedView>
                <ThemedText
                    style={s.deviceCategory}
                    numberOfLines={1}
                >
                    {device.description}
                </ThemedText>
                <CopyField
                    style={{ width: '70%', marginHorizontal: '3%', margin: '2%' }}
                    value={device.address}
                    copy={setStringAsync}
                />
            </ThemedView>
            <ThemedView style={{ width: '40%' }}>
                <ThemedView style={[s.deviceStatusBox, { backgroundColor: color(3) }]}>
                    <Image
                        style={{ aspectRatio: 1, width: '18%', marginHorizontal: 5 }}
                        source={device.connected ? active : device.active ? idle : disconnected}
                    />
                    <ThemedText style={s.deviceStatus}>
                        {device.connected ? f('statusActive') : device.active ? f('statusInactive') : f('statusDisconnected')}
                    </ThemedText>
                </ThemedView>
                <ThemedView style={[{ backgroundColor: color(4) }, s.deviceDistance]}>
                    <ThemedText style={s.distanceInside}>{device.distance.toFixed(1)}m</ThemedText>
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

const s = StyleSheet.create({
    device: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

        borderRadius: 15,
        overflow: 'hidden',
        marginHorizontal: 10,
        margin: 10,

        width: '95%',
        elevation: 5
    },
    infobar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    deviceTitle: {
        fontSize: 16,
        margin: '3%',
        textOverflow: 'ellipsis',
        width: '80%'
    },
    deviceCategory: {
        fontSize: 14,
        opacity: 0.7,
        marginHorizontal: '3%'
    },
    deviceStatusBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

        padding: 5
    },
    deviceStatus: {
        fontSize: 14
    },
    deviceDistance: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    distanceInside: {
        fontFamily: 'PoppinsBold',
        fontSize: 20
    }
});
