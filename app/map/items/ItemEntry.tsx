import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Image from '@/components/ui/Image';
import { Device } from '@/components/utils/Api';
import { distance } from '@/components/utils/Utils';
import { info } from '@/constants/Icons';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Card } from 'react-native-paper';

export default function ItemEntry({ device, onClick, ...rest }: { device: Device; onClick?: () => void }) {
    const { t } = useLang();
    const { color } = useTheme();
    const { width } = Dimensions.get('screen');
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
            style={[{ backgroundColor: color.background, width: width * 0.9 }, card.container]}
            {...rest}
        >
            <Card.Content>
                <ThemedView style={card.header}>
                    <ThemedText style={card.distance}>{distance(device.distance)}</ThemedText>
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
                <Button
                    onPress={openDoor}
                    textColor={color.font}
                >
                    {t('open')}
                </Button>
            </Card.Actions>
        </Card>
    );
}

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
