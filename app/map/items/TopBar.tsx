import Image from '@/components/ui/Image';
import { qr, qrDark, settings, settingsDark, stack, stackDark } from '@/constants/Icons';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Dispatch } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

export interface TopBarProps {
    setResults: (arr: []) => void;
    setSearch: (str: string) => void;
    onSearchPress: () => void;
    onIconPress: () => void;
    setSatelite: Dispatch<React.SetStateAction<boolean>>;
    updateSearchBar: (str: string) => void;

    search: string;
    searchFocus: boolean;
}

export default function TopBar({
    search,
    searchFocus,
    setResults,
    setSearch,
    onSearchPress,
    onIconPress,
    setSatelite,
    updateSearchBar
}: TopBarProps) {
    const { color, theme } = useTheme();
    const { t } = useLang();
    const router = useRouter();

    const openScanner = () => {
        router.navigate('/map/scanner');
        setResults([]);
        setSearch('');
    };

    const goToSettings = () => {
        router.navigate('/settings');
        setResults([]);
        setSearch('');
    };

    return (
        <>
            <View style={style.topbar}>
                <Searchbar
                    value={search}
                    onChangeText={updateSearchBar}
                    style={[style.searchBox, { backgroundColor: color.background }]}
                    inputStyle={{ color: color.font }}
                    cursorColor={color.blue}
                    placeholder={t('search')}
                    placeholderTextColor={color.font + 'aa'}
                    iconColor={color.font}
                    icon={searchFocus ? ('arrow-left' as IconSource) : undefined}
                    onIconPress={() => onIconPress()}
                    onPress={() => onSearchPress()}
                />
                <TouchableOpacity
                    style={{ width: 50, aspectRatio: 1 }}
                    onPress={goToSettings}
                >
                    <Image source={theme === 'light' ? settings : settingsDark} />
                </TouchableOpacity>
            </View>
            <View
                style={style.bar}
                pointerEvents="box-none"
            >
                <TouchableOpacity
                    style={[style.rightImg]}
                    onPress={() => setSatelite((s) => !s)}
                >
                    <Image source={theme === 'light' ? stack : stackDark} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[style.rightImg]}
                    onPress={openScanner}
                >
                    <Image source={theme === 'light' ? qr : qrDark} />
                </TouchableOpacity>
            </View>
        </>
    );
}

const style = StyleSheet.create({
    topbar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    searchBox: {
        margin: '5%',
        width: '75%'
    },
    bar: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',

        width: '100%'
    },
    rightImg: {
        width: '10%',
        aspectRatio: 1,
        marginHorizontal: '5%',
        marginVertical: 5,
        elevation: 10
    }
});
