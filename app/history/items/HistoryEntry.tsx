import { ThemedText } from '@/components/ThemedText';
import Image from '@/components/ui/Image';
import { Device } from '@/components/utils/Api';
import { adjustColor } from '@/components/utils/Utils';
import { check, xmark } from '@/constants/Icons';
import useCache, { HistoryItem } from '@/hooks/useCache';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { StyleProps } from 'react-native-reanimated';

export interface HistoryEntryProps {
    element: HistoryItem;
    style?: StyleProps;
}

export default function HistoryEntry({ element, style }: HistoryEntryProps) {
    const { color, theme } = useTheme();
    const cache = useCache();
    const [device, setDevice] = useState<Device | undefined>();
    const { t } = useLang();

    useEffect(() => {
        const item = cache.data.devices.find((device) => device.address === element.address);
        if (item) setDevice(item);
    }, [cache]);

    const zero = (n: number) => n.toString().padStart(2, '0');

    const getTime = () => {
        const date = new Date(element.at);
        return `${zero(date.getHours())}:${zero(date.getMinutes())}`;
    };
    const getDate = () => {
        const date = new Date(element.at);
        return `${zero(date.getDate())}.${zero(date.getMonth())}.${date.getFullYear()}`;
    };

    if (device === undefined) return null;

    return (
        <View style={[{ backgroundColor: adjustColor(color.background, 8) }, styles.container, style]}>
            <View style={[styles.header, { backgroundColor: element.success ? color.green : color.orange }]}>
                <Image
                    source={element.success ? check : xmark}
                    style={styles.icon}
                />
                <ThemedText>{device.name}</ThemedText>
            </View>
            <View style={[styles.content]}>
                <View style={styles.text}>
                    <Icon
                        source={'clock-outline'}
                        color={element.success ? color.green : color.orange}
                        size={20}
                    />
                    <ThemedText>{getTime()}</ThemedText>
                </View>
                <View style={styles.text}>
                    <Icon
                        source={'calendar-blank'}
                        color={element.success ? color.green : color.orange}
                        size={20}
                    />
                    <ThemedText>{getDate()}</ThemedText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        borderRadius: 25,
        overflow: 'hidden'
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        padding: '5%'
    },
    icon: {
        width: 25,
        aspectRatio: 1,
        marginRight: '5%'
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: '3%',
        padding: '5%'
    },
    text: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }
});
