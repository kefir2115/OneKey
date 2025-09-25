import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/ui/Header';
import Image from '@/components/ui/Image';
import * as Transactions from '@/components/utils/Transactions';
import { Colors } from '@/constants/Colors';
import { check, warning, warningDark } from '@/constants/Icons';
import { global } from '@/constants/Styles';
import useCache from '@/hooks/useCache';
import useConfig from '@/hooks/useConfig';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LogoutSubmit() {
    const { t } = useLang();
    const { color, theme } = useTheme();

    const router = useRouter();
    const config = useConfig();
    const cache = useCache();

    const [confirm, setConfirm] = useState(false);

    const accept = () => {
        setConfirm(!confirm);
    };
    const logOut = () => {
        if (!confirm) return;

        Transactions.logOut(config, cache).then((res) => {
            if (res) {
                router.dismissAll();
                router.replace('/');
            }
        });
    };

    return (
        <>
            <Header title={t('back')} />
            <SafeAreaView style={[global.container, { backgroundColor: color.background }]}>
                <ThemedView style={[global.container, { width: '100%' }]}>
                    <Image
                        source={theme === 'dark' ? warningDark : warning}
                        style={style.img}
                    />
                    <ThemedText style={style.text}>{t('logoutMsg')}</ThemedText>
                    <TouchableOpacity
                        style={[
                            style.btn,
                            {
                                backgroundColor: confirm ? color.background : color.green,
                                borderColor: !confirm ? color.background : color.green
                            }
                        ]}
                        onPress={accept}
                    >
                        {!confirm && <ThemedText style={{ color: Colors.dark.font, fontFamily: 'PoppinsBold' }}>OK</ThemedText>}
                        {confirm && (
                            <Image
                                source={check}
                                style={style.check}
                            />
                        )}
                    </TouchableOpacity>
                </ThemedView>
                <TouchableOpacity
                    style={[style.btn, { backgroundColor: confirm ? color.orange : color.lighterBackground }]}
                    onPress={logOut}
                >
                    <ThemedText style={{ color: Colors.dark.font, fontFamily: 'PoppinsBold' }}>{t('logOut')}</ThemedText>
                </TouchableOpacity>
            </SafeAreaView>
        </>
    );
}

const style = StyleSheet.create({
    img: {
        width: '50%',
        aspectRatio: 1
    },
    check: {
        height: '60%',
        aspectRatio: 1
    },
    text: {
        fontFamily: 'PoppinsMedium',
        width: '70%',
        textAlign: 'center',
        fontSize: 18
    },
    btn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        marginVertical: 5,
        marginTop: '15%',
        borderRadius: 30,
        width: '80%',
        height: 50,

        borderColor: '#0000',
        borderWidth: 2,
        borderStyle: 'solid'
    }
});
