import { Header } from '@/components/ui/Header';
import Image from '@/components/ui/Image';
import { qr, qrDark } from '@/constants/Icons';
import { global } from '@/constants/Styles';
import useCache from '@/hooks/useCache';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Item from '../settings/items/Item';
import { Arrow } from '../settings/items/SwitchCard';
import DeviceEntry from './items/DeviceEntry';

export default function Devices() {
    const { t } = useLang();
    const router = useRouter();
    const cache = useCache();
    const { color, theme } = useTheme();

    const goToScanner = () => {
        router.navigate('/map/scanner');
    };
    const goToHistory = () => {
        router.navigate('/history');
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
                <Item
                    style={{ width: '80%' }}
                    title={t('history')}
                    right={() => <Arrow />}
                    onClick={goToHistory}
                />
                <Divider style={{ backgroundColor: color.font, width: '90%' }} />
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
