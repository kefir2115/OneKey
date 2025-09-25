import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Image from '@/components/ui/Image';
import { Device } from '@/components/utils/Api';
import { adjustColor } from '@/components/utils/Utils';
import { xmark } from '@/constants/Icons';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Portal } from 'react-native-paper';
import ItemEntry from './ItemEntry';

export interface SearchListProps {
    search: string;
    onClick: () => void;
    results: Device[];
}

export default function SearchList({ search, onClick, results }: SearchListProps) {
    const { color } = useTheme();
    const { t } = useLang();

    return (
        <Portal>
            <ThemedView style={{ flex: 1, marginTop: '40%', backgroundColor: adjustColor(color.background, 10) }}>
                <ThemedText style={{ textAlign: 'center', margin: '5%' }}>{t('results', search)}</ThemedText>
                {results.length > 0 && (
                    <GestureHandlerRootView>
                        <FlashList
                            data={results}
                            keyExtractor={(it, i) => String(i)}
                            renderItem={(e) => {
                                return (
                                    <ItemEntry
                                        device={e.item}
                                        key={e.index}
                                        onClick={onClick}
                                    />
                                );
                            }}
                        />
                    </GestureHandlerRootView>
                )}
                {results.length === 0 && (
                    <View style={{ alignSelf: 'center', alignItems: 'center', marginTop: '20%' }}>
                        <ThemedText style={{ textAlign: 'center', fontSize: 20, fontFamily: 'PoppinsBold' }}>{t('noResults')}</ThemedText>
                        <Image
                            source={xmark}
                            style={{ width: '20%', aspectRatio: 1, marginTop: '10%' }}
                        />
                    </View>
                )}
            </ThemedView>
        </Portal>
    );
}
