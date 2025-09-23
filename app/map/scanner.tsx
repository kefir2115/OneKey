import { ThemedText } from '@/components/ThemedText';
import Button from '@/components/ui/Button';
import { HeaderTransparent } from '@/components/ui/Header';
import Path from '@/components/utils/PathUtils';
import { global } from '@/constants/Styles';
import useCache from '@/hooks/useCache';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Card, Modal, Portal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path as PathView } from 'react-native-svg';
import Loading from '../loading';

export default function Scanner() {
    const { f } = useLang();
    const { color } = useTheme();
    const cache = useCache();
    const { width, height } = Dimensions.get('screen');
    const [permission, requestPermission] = useCameraPermissions();
    const router = useRouter();

    const [codeResult, setCodeResult] = useState('');
    const [modal, setModal] = useState(false);

    useEffect(() => {
        if (!codeResult || codeResult.length === 0) return;

        if (codeResult.length === 35) {
            const exists = cache.data.devices.find((device) => device.address === codeResult) !== undefined;
            if (exists) {
                setModal(false);
                router.navigate({
                    pathname: '/devices/info',
                    params: {
                        address: codeResult
                    }
                });
            } else {
                setModal(true);
            }
        }
    }, [codeResult]);

    if (!permission) return <Loading />;

    if (!permission.granted) {
        requestPermission().then((p) => {
            if (!p.granted) router.back();
        });
        return <Loading />;
    }

    const qrScanned = (e: BarcodeScanningResult) => {
        if (e.type === 'qr' && e.data !== codeResult) {
            const split = e.data.split('iot/');
            if (split.length > 1) setCodeResult(split[1]);
            else {
                setModal(true);
            }
        }
    };

    const rectWidth = width * 0.7;
    const rectHeight = rectWidth;
    const left = (width - rectWidth) / 2;
    const top = (height - rectHeight) / 2;
    const r = (rectWidth / 100) * 10;

    const path = new Path(width, height).getRoundRect(left, top, rectWidth, rectHeight, r);

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFill}
                onBarcodeScanned={qrScanned}
            />
            <View
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
            >
                <Svg
                    width={width}
                    height={height}
                >
                    <PathView
                        d={path}
                        fill="#00000099"
                        fillRule="evenodd"
                    />
                </Svg>
            </View>
            <SafeAreaView style={global.container}>
                <HeaderTransparent title={'Back'} />
                <ThemedText style={styles.text}>{f('qrScan')}</ThemedText>
            </SafeAreaView>
            <Portal>
                <Modal
                    visible={modal}
                    onDismiss={() => setModal(false)}
                >
                    <Card style={{ backgroundColor: color(0) }}>
                        <Card.Content>
                            <ThemedText style={styles.line1}>{f('invalidAddr1')}</ThemedText>
                            <ThemedText style={styles.line2}>{f('invalidAddr2')}</ThemedText>
                            <ThemedText style={styles.line2}>{f('invalidAddr3')}</ThemedText>
                        </Card.Content>
                        <Card.Actions>
                            <Button onClick={() => setModal(false)}>{f('close')}</Button>
                        </Card.Actions>
                    </Card>
                </Modal>
            </Portal>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        top: '10%',

        fontSize: 25,
        lineHeight: 30,
        fontFamily: 'PoppinsMedium',
        color: '#fff'
    },
    snack: {
        borderWidth: 1,
        borderColor: '#ff5b5bff'
    },
    line1: {
        fontSize: 20,
        fontFamily: 'PoppinsMedium'
    },
    line2: {
        fontFamily: 'PoppinsLIght',
        marginLeft: 10
    }
});
