import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import Image from '@/components/ui/Image';
import { global } from '@/constants/Styles';
import useConfig from '@/hooks/useConfig';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Button as PaperButton, Snackbar } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

const back = require('../../assets/images/icons/back.svg');
const copy = require('../../assets/images/icons/copy.svg');
const copyDark = require('../../assets/images/icons/copy-dark.svg');

export default function Activate() {
    const { f } = useLang();
    const config = useConfig();
    const router = useRouter();
    const { color, theme } = useTheme();

    const [authorized, setAuthorized] = useState(false);
    const [snackBar, setSnackBar] = useState(false);

    const copyAddress = () => {
        Clipboard.setStringAsync(config.account.address).then(() => {
            setSnackBar(true);
        });
    };
    const copySeed = () => {
        Clipboard.setStringAsync(config.account.seed).then(() => {
            setSnackBar(true);
        });
    };
    /**
     * TODO: Listen to blockchain if address is activated
     */

    return (
        <>
            <Header title="Activate account" />
            <SafeAreaView style={[{ backgroundColor: color(0) }, global.container]}>
                <ThemedView style={s.subtitleContainer}>
                    <ThemedText style={s.subtitle}>{f('activateMsg')}</ThemedText>
                </ThemedView>
                <ThemedView style={s.qr}>
                    <QRCode
                        value={config.account.address}
                        quietZone={6}
                        size={200}
                    />
                </ThemedView>
                <TouchableOpacity
                    onPress={copyAddress}
                    style={[s.seed, { backgroundColor: color(2) }]}
                >
                    <ThemedText style={[s.seedText, { color: color(4) }]}>{config.account.address}</ThemedText>
                    <Image
                        source={theme === 'dark' ? copyDark : copy}
                        style={{ width: 15, marginLeft: 10 }}
                    />
                </TouchableOpacity>
                <Card style={[s.seedContainer, { backgroundColor: color(0) }]}>
                    <Card.Title
                        title="Your secret password"
                        titleStyle={[s.seedTitle, { color: color(1) }]}
                    />
                    <Card.Content>
                        <ThemedText style={s.seedSubtitle}>{f('saveSeedMsg')}</ThemedText>
                    </Card.Content>
                    <Card.Actions>
                        <Button onClick={copySeed}>{f('copy')}</Button>
                    </Card.Actions>
                </Card>
                <PaperButton
                    mode="contained"
                    disabled={!authorized}
                    style={[s.activateBtn, { backgroundColor: authorized ? color(4) : color(2) }]}
                >
                    {f('activate')}
                </PaperButton>
            </SafeAreaView>
            <Snackbar
                visible={snackBar}
                onDismiss={() => setSnackBar(false)}
                style={{ backgroundColor: color(4) }}
                duration={Snackbar.DURATION_SHORT}
            >
                {f('valueClipboard')}
            </Snackbar>
        </>
    );
}

const s = StyleSheet.create({
    subtitleContainer: {
        width: '80%'
    },
    subtitle: {
        fontSize: 12,
        lineHeight: 16,
        textAlign: 'center'
    },
    qr: {
        marginTop: '10%',
        marginBottom: '5%'
    },
    seed: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
        width: '80%',

        paddingHorizontal: 15,

        borderRadius: 20
    },
    seedText: {
        fontSize: 12,
        textAlign: 'center',
        flex: 1
    },
    seedContainer: {
        // marginHorizontal: "10%",
        margin: 'auto'
    },
    seedTitle: {
        fontSize: 18,
        lineHeight: 20,
        fontFamily: 'PoppinsRegular'
    },
    seedSubtitle: {
        fontSize: 12,
        lineHeight: 16
    },
    activateBtn: {
        width: '90%',
        margin: 'auto'
    }
});
