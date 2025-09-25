import { back } from '@/constants/Icons';
import useTheme from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Appbar } from 'react-native-paper';
import Image from './Image';

export interface HeaderProps {
    style?: ViewStyle;
    content?: any;
    title?: string;
    goBack?: () => void;
}

export function Header({ style, content, title, goBack }: HeaderProps) {
    const { color } = useTheme();
    const router = useRouter();

    const backAction = () => {
        if (goBack) goBack();
        else {
            router.back();
        }
    };

    return (
        <Appbar.Header style={[headerStyle.header, { backgroundColor: color.background }, style]}>
            <TouchableOpacity onPress={backAction}>
                <Image
                    style={{ aspectRatio: 0.5, width: 20, margin: 20 }}
                    source={back}
                />
            </TouchableOpacity>
            <Appbar.Content
                title={title || ''}
                titleStyle={[headerStyle.headerTitle, { color: color.font }]}
            />
            {content}
        </Appbar.Header>
    );
}
export function HeaderTransparent({ style, content, title, goBack }: HeaderProps) {
    const router = useRouter();

    const backAction = () => {
        if (goBack) goBack();
        else {
            router.back();
        }
    };

    return (
        <Appbar.Header style={[headerStyle.header, { backgroundColor: '#0000' }, style]}>
            <TouchableOpacity onPress={backAction}>
                <Image
                    style={{ aspectRatio: 0.5, width: 20, margin: 20 }}
                    source={back}
                />
            </TouchableOpacity>
            <Appbar.Content
                title={title || ''}
                titleStyle={[headerStyle.headerTitle, { color: '#fff' }]}
            />
            {content}
        </Appbar.Header>
    );
}

const headerStyle = StyleSheet.create({
    header: {
        width: '100%'
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'PoppinsLight',
        opacity: 0.8
    }
});
