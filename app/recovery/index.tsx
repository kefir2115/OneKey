import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/ui/Header';
import Image from '@/components/ui/Image';
import TextArea from '@/components/ui/TextArea';
import { Colors } from '@/constants/Colors';
import { global } from '@/constants/Styles';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import 'react-native-get-random-values';

import { seedToAddress } from '@/components/utils/Transactions';
import { check, copy, copyDark, logo0, logo0Dark, xmark } from '@/constants/Icons';
import useConfig from '@/hooks/useConfig';
import { getStringAsync } from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Recovery() {
    const { t } = useLang();
    const { color, theme } = useTheme();
    const config = useConfig();
    const router = useRouter();
    const [isValid, setValid] = useState(false);
    const [value, setValue] = useState('');

    const setFromClipboard = () => {
        getStringAsync().then((v) => setValue(v));
    };

    const proceed = () => {
        if (!isValid) return;

        const address = seedToAddress(value);

        config.account.seed = value;
        config.account.address = address;
        config.account.active = true;
        config.save();

        router.dismissAll();
        router.replace('/');
    };

    useEffect(() => {
        const split = value.split(' ');
        setValid(split.length === 15);
    }, [value]);

    return (
        <>
            <Header title="Back" />
            <SafeAreaView style={[global.container, { backgroundColor: color.background }]}>
                <Image
                    source={theme === 'dark' ? logo0Dark : logo0}
                    style={style.logo}
                />
                <Card style={[style.card, { backgroundColor: color.background }]}>
                    <Card.Content>
                        <ThemedText>{t('recoveryMsg')}</ThemedText>
                        <TextArea
                            containerStyle={style.textArea}
                            style={{ color: color.font }}
                            value={value}
                            onChangeText={setValue}
                        >
                            <TouchableOpacity
                                style={[{ backgroundColor: color.lighterBackground }, style.clipBox]}
                                onPress={setFromClipboard}
                            >
                                <ThemedText style={style.clipText}>{t('pasteClipboard')}</ThemedText>
                                <Image
                                    source={theme === 'dark' ? copyDark : copy}
                                    style={style.copyIcon}
                                />
                            </TouchableOpacity>
                        </TextArea>
                        <ThemedView style={[style.infoBox, { borderColor: isValid ? color.green : '#ce7777ff' }]}>
                            <Image
                                source={isValid ? check : xmark}
                                style={style.info}
                            />
                            <ThemedText style={style.infoText}>{t(isValid ? 'phraseCorrectInfo' : 'phraseIncorrectInfo')}</ThemedText>
                        </ThemedView>
                    </Card.Content>
                    <Card.Actions>
                        <Button
                            mode="contained"
                            style={{ backgroundColor: isValid ? color.green : color.lighterBackground }}
                            labelStyle={{ fontFamily: 'PoppinsBold' }}
                            textColor={isValid ? Colors.dark.font : Colors.dark.background + '9a'}
                            onPress={proceed}
                        >
                            {t('continue')}
                        </Button>
                    </Card.Actions>
                </Card>
            </SafeAreaView>
        </>
    );
}

const style = StyleSheet.create({
    logo: {
        width: '60%',
        aspectRatio: 198 / 60
    },
    card: {
        margin: 'auto'
    },
    textArea: {
        marginVertical: 10
    },
    clipBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        margin: 10,
        padding: 5,
        borderRadius: 20
    },
    clipText: {
        textAlign: 'center'
    },
    copyIcon: {
        width: 20,
        aspectRatio: 1,
        marginHorizontal: 10
    },
    infoBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        // borderRadius: 20,
        paddingHorizontal: 10,
        width: 'auto',
        alignSelf: 'center',

        borderBottomWidth: 1,
        borderStyle: 'solid'
    },
    info: {
        width: 20,
        aspectRatio: 1,
        margin: 5,
        marginRight: 10
    },
    infoText: {
        fontSize: 12,
        fontFamily: 'PoppinsLight'
    }
});
