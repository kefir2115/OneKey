import CopyField from '@/app/settings/items/CopyField';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Image from '@/components/ui/Image';
import { Device } from '@/components/utils/Api';
import { adjustColor, distance } from '@/components/utils/Utils';
import { check, idle, info, xmark } from '@/constants/Icons';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import { setStringAsync } from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export interface DeviceEntryProps {
    device: Device;
}

export default function DeviceEntry({ device }: DeviceEntryProps) {
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
        <ThemedView style={styles.device}>
            <ThemedView style={{ flex: 1, backgroundColor: adjustColor(color.background, 8) }}>
                <View style={styles.infobar}>
                    <ThemedText
                        style={styles.deviceTitle}
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
                </View>
                <ThemedText
                    style={styles.deviceCategory}
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
                <ThemedView style={[styles.deviceStatusBox, { backgroundColor: color.green }]}>
                    <Image
                        style={{ aspectRatio: 1, width: '18%', marginHorizontal: 5 }}
                        source={device.connected ? check : device.active ? idle : xmark}
                    />
                    <ThemedText style={styles.deviceStatus}>
                        {device.connected ? t('statusActive') : device.active ? t('statusInactive') : t('statusDisconnected')}
                    </ThemedText>
                </ThemedView>
                <ThemedView style={[{ backgroundColor: color.blue }, styles.deviceDistance]}>
                    <ThemedText style={styles.distanceInside}>{distance(device.distance)}</ThemedText>
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
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
