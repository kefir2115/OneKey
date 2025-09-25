import { ThemedText } from '@/components/ThemedText';
import Image from '@/components/ui/Image';
import { Device } from '@/components/utils/Api';
import { adjustColor } from '@/components/utils/Utils';
import { key, keyDark, xmark } from '@/constants/Icons';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { RefObject, useMemo } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import ItemEntry from './ItemEntry';

export interface BottomListProps {
    devices: Device[];
    bottomSheetRef: RefObject<BottomSheetMethods | null>;
    flatRef: RefObject<FlatList<Device> | null>;
    openKeyList: () => void;
    onScroll: (ev: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export default function BottomList({ devices, bottomSheetRef, flatRef, openKeyList, onScroll }: BottomListProps) {
    const { color, theme } = useTheme();
    const { t } = useLang();
    const snaps = useMemo(() => ['15%', '40%'], []);
    const { width } = Dimensions.get('screen');

    const ITEM_WIDTH = width;

    return (
        <BottomSheet
            index={0}
            snapPoints={snaps}
            ref={bottomSheetRef}
            style={{ borderRadius: 20 }}
            handleIndicatorStyle={{ backgroundColor: color.green + 'aa' }}
            overDragResistanceFactor={0}
            enablePanDownToClose={false}
            enableContentPanningGesture={false}
            enableHandlePanningGesture={true}
            animateOnMount={true}
            backgroundStyle={{ backgroundColor: adjustColor(color.background, 7), pointerEvents: 'none' }}
            handleStyle={{ height: 50, justifyContent: 'center' }}
        >
            <BottomSheetView>
                <TouchableOpacity
                    style={style.bottomHeader}
                    onPress={openKeyList}
                >
                    <ThemedText style={style.cardTitle}>{t('gates')}</ThemedText>
                    <Image
                        source={theme === 'light' ? key : keyDark}
                        style={style.list}
                    />
                </TouchableOpacity>
                <FlatList
                    horizontal={true}
                    style={{ marginBottom: '5%', height: '100%' }}
                    data={devices}
                    ref={flatRef}
                    onScroll={onScroll}
                    snapToInterval={ITEM_WIDTH}
                    renderItem={({ item, index }) => <ItemEntry device={item} />}
                    keyExtractor={(item) => item.address}
                    nestedScrollEnabled
                    pagingEnabled
                />
                {devices.length === 0 && (
                    <View style={style.container}>
                        <Image
                            source={xmark}
                            style={style.icon}
                        />
                        <ThemedText style={style.message}>{t('noDevices')}</ThemedText>
                    </View>
                )}
            </BottomSheetView>
        </BottomSheet>
    );
}

const style = StyleSheet.create({
    bottomHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: '5%'
    },
    cardTitle: {
        fontSize: 24,
        lineHeight: 30,
        fontFamily: 'PoppinsMedium',
        margin: 10
    },
    list: {
        width: 30,
        aspectRatio: 1
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: '10%'
    },
    icon: {
        width: '20%',
        aspectRatio: 1
    },
    message: {
        fontSize: 18,
        lineHeight: 24,
        fontFamily: 'PoppinsMedium'
    }
});
