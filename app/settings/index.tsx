import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/ui/Header';
import Image from '@/components/ui/Image';
import { adjustColor } from '@/components/utils/Utils';
import { Colors } from '@/constants/Colors';
import { copy, copyDark, lock } from '@/constants/Icons';
import { global } from '@/constants/Styles';
import useConfig from '@/hooks/useConfig';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Modal, Portal, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import SwitchCard from './items/SwitchCard';

export default function Settings() {
    const { t } = useLang();
    const config = useConfig();
    const router = useRouter();
    const params = useLocalSearchParams();
    const { color, theme } = useTheme();
    const [expertMode, setExpertMode] = useState(false);
    const [bioAuth] = useState(config.biometric);
    const [snackBar, setSnackBar] = useState(false);
    const [recovery, setRecovery] = useState(false);

    useEffect(() => {
        if (params.action === 'viewRecovery') {
            setRecovery(true);
        } else if (params.action === 'toggleBioAuth') {
            config.biometric = !bioAuth;
            config.save();
            router.replace('/settings');
        }
    }, [params]);

    const copyClipboard = (value: string) => {
        Clipboard.setStringAsync(config.account.seed).then(() => {
            setSnackBar(true);
        });
    };

    const viewRecovery = () => {
        router.navigate({
            pathname: '/pin',
            params: {
                next: '/settings',
                action: 'viewRecovery'
            }
        });
    };
    const copyPhrase = () => {
        copyClipboard(config.account.seed);
    };
    const goToLogoutSubmit = () => {
        config.save();
        router.navigate('/settings/logoutSubmit');
    };
    const closePhrase = () => {
        setRecovery(false);
        router.replace('/settings');
    };

    const containerStyle = { backgroundColor: color.background, padding: 20, borderRadius: 20, width: '80%', alignSelf: 'center' };

    return (
        <>
            <Header title={t('backToMap')} />
            <SafeAreaView style={[global.container, { backgroundColor: color.background }]}>
                <SwitchCard
                    bioAuth={bioAuth}
                    expertMode={expertMode}
                    setExpertMode={setExpertMode}
                    setSnackBar={setSnackBar}
                />
                <ThemedView style={styles.btns}>
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: color.blue }]}
                        onPress={viewRecovery}
                    >
                        <ThemedText style={{ color: Colors.dark.font, fontFamily: 'PoppinsBold' }}>{t('showRecPhrase')}</ThemedText>
                        <Image
                            style={{ width: 15, marginLeft: '5%' }}
                            source={lock}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: color.orange }]}
                        onPress={goToLogoutSubmit}
                    >
                        <ThemedText style={{ color: Colors.dark.font, fontFamily: 'PoppinsBold' }}>{t('logOut')}</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </SafeAreaView>
            <Snackbar
                visible={snackBar}
                onDismiss={() => setSnackBar(false)}
                style={{ backgroundColor: color.blue }}
                duration={Snackbar.DURATION_SHORT}
            >
                {t('valueClipboard')}
            </Snackbar>
            <Portal>
                <Modal
                    visible={recovery}
                    onDismiss={() => closePhrase()}
                    contentContainerStyle={[containerStyle as any, { backgroundColor: adjustColor(color.background, 10) }]}
                >
                    <ThemedText style={{ marginBottom: '10%', fontSize: 18 }}>{t('yourRecPhrase')}</ThemedText>
                    <ThemedText style={[styles.phrase, { borderColor: color.font }]}>{config.account.seed}</ThemedText>
                    <TouchableOpacity
                        style={styles.btn2}
                        onPress={copyPhrase}
                    >
                        <ThemedText>{t('copy')}</ThemedText>
                        <Image
                            source={theme === 'light' ? copy : copyDark}
                            style={styles.copy}
                        />
                    </TouchableOpacity>
                </Modal>
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '90%'
    },
    divider: {
        height: 1,
        width: '90%',
        alignSelf: 'center'
    },
    btns: {
        position: 'absolute',
        bottom: '5%',
        width: '80%'
    },
    btn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        marginVertical: 5,
        borderRadius: 30,
        height: 50
    },
    phrase: {
        borderWidth: 1,
        borderStyle: 'dashed',
        padding: '5%',
        borderRadius: 20
    },
    btn2: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    copy: {
        width: '8%',
        aspectRatio: 1,
        marginHorizontal: 10,
        margin: 5
    }
});
