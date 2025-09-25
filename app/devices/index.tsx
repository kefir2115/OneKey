import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/ui/Header';
import Image from '@/components/ui/Image';
import { Device } from '@/components/utils/Api';
import { distance } from '@/components/utils/Utils';
import { check, idle, info, qr, qrDark, xmark } from '@/constants/Icons';
import { global } from '@/constants/Styles';
import useCache from '@/hooks/useCache';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import { setStringAsync } from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CopyField from '../settings/items/CopyField';

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
            <SafeAreaView style={[global.container, { backgroundColor: color.background }]}>
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
    const { t } = useLang();
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
                <ThemedView style={[s.deviceStatusBox, { backgroundColor: color.green }]}>
                    <Image
                        style={{ aspectRatio: 1, width: '18%', marginHorizontal: 5 }}
                        source={device.connected ? check : device.active ? idle : xmark}
                    />
                    <ThemedText style={s.deviceStatus}>
                        {device.connected ? t('statusActive') : device.active ? t('statusInactive') : t('statusDisconnected')}
                    </ThemedText>
                </ThemedView>
                <ThemedView style={[{ backgroundColor: color.blue }, s.deviceDistance]}>
                    <ThemedText style={s.distanceInside}>{distance(device.distance)}</ThemedText>
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
