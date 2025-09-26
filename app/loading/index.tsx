import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { adjustColor } from '@/components/utils/Utils';
import { global } from '@/constants/Styles';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import { useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const loader = require('../../assets/images/loader.json');

export interface LoadingProps {
    subtitle?: string;
    address?: {
        street?: string;
        code?: string;
    };
}

export default function Loading(prop: LoadingProps) {
    const { t } = useLang();
    const { color } = useTheme();
    const props = useLocalSearchParams();
    const [subtitle, setSubtitle] = useState(props.subtitle || prop.subtitle || t('loading'));
    const [address, setAddress] = useState<{ street: string; code: string } | null>(null);

    useEffect(() => {
        if (props.street || props.code || prop.address?.code || prop.address?.street)
            setAddress({
                street: (props.street as string) || prop.address?.street || '',
                code: (props.code as string) || prop.address?.code || ''
            });
    }, []);

    return (
        <>
            <SafeAreaView style={[global.container, { backgroundColor: color.background, width: '100%' }]}>
                <View style={style.mid}>
                    <LottieView
                        source={loader}
                        autoPlay
                        loop
                        style={style.spinner}
                    />
                    <ThemedText style={style.subtitle}>{subtitle}</ThemedText>
                </View>
                {address && (
                    <ThemedView style={[style.address, { backgroundColor: adjustColor(color.background, 8) }]}>
                        <ThemedText style={style.street}>{address.street}</ThemedText>
                        <ThemedText style={style.code}>{address.code}</ThemedText>
                    </ThemedView>
                )}
            </SafeAreaView>
        </>
    );
}

const style = StyleSheet.create({
    mid: {
        alignItems: 'center',
        top: '30%'
    },
    spinner: {
        width: '50%',
        aspectRatio: 1,
        transform: [{ scale: 2 }]
    },
    subtitle: {
        fontFamily: 'PoppinsBold'
    },
    address: {
        position: 'absolute',
        bottom: 0,
        margin: '5%',
        padding: '10%',
        elevation: 10,
        width: '90%',
        borderRadius: 20
    },
    street: {
        textAlign: 'center',
        fontFamily: 'PoppinsMedium',
        fontSize: 20
    },
    code: {
        textAlign: 'center',
        opacity: 0.7
    }
});
