import { ThemedText } from '@/components/ThemedText';
import { Header } from '@/components/ui/Header';
import Image from '@/components/ui/Image';
import { adjustColor } from '@/components/utils/Utils';
import { xmark } from '@/constants/Icons';
import { global } from '@/constants/Styles';
import useCache from '@/hooks/useCache';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import HistoryEntry from './items/HistoryEntry';

const month = 1000 * 3600 * 24 * 30;

export default function History() {
    const { color, theme } = useTheme();
    const { data, save } = useCache();
    const { t } = useLang();

    useEffect(() => {
        const now = Date.now();
        let anyDeleted = false;
        data.history.forEach((element, idx) => {
            if (element.at + month <= now) {
                data.history.splice(idx, 1);
                anyDeleted = true;
            }
        });
        if (anyDeleted) save();
    }, [data]);
    return (
        <>
            <Header title={t('back')} />
            <SafeAreaView style={[global.container, { backgroundColor: color.background }]}>
                <GestureHandlerRootView style={{ width: '100%' }}>
                    {data.history.length !== 0 && (
                        <ScrollView contentContainerStyle={styles.list}>
                            {data.history.map((element, idx) => (
                                <HistoryEntry
                                    style={styles.entry}
                                    element={element}
                                    key={idx}
                                />
                            ))}
                        </ScrollView>
                    )}
                </GestureHandlerRootView>
                {data.history.length === 0 && (
                    <Card style={[{ backgroundColor: adjustColor(color.background, 5), width: '70%' }]}>
                        <Card.Content style={styles.card}>
                            <Image
                                source={xmark}
                                style={styles.xmark}
                            />
                            <ThemedText style={{ textAlign: 'center' }}>{t('noHistory')}</ThemedText>
                        </Card.Content>
                    </Card>
                )}
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    list: {
        width: '100%',
        alignItems: 'center'
    },
    entry: {
        marginVertical: 10
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    xmark: {
        width: '50%',
        aspectRatio: 1,
        marginBottom: '10%'
    }
});
