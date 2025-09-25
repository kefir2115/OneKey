import { ThemedText } from '@/components/ThemedText';
import Image from '@/components/ui/Image';
import { copy, copyDark } from '@/constants/Icons';
import useTheme from '@/hooks/useTheme';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

export interface CopyFieldProps {
    value: string;
    copy?: (value: string) => void;
    style?: StyleProp<ViewStyle>;
}

export default function CopyField({ value, copy: onCopy, style }: CopyFieldProps) {
    const { color, theme } = useTheme();
    return (
        <TouchableOpacity
            onPress={() => onCopy?.(value)}
            style={[styles.seed, { backgroundColor: color.lighterBackground }, style]}
        >
            <ThemedText
                numberOfLines={1}
                style={[styles.seedText, { color: color.blue, textOverflow: 'ellipsis' }]}
            >
                {value}
            </ThemedText>
            <Image
                source={theme === 'dark' ? copyDark : copy}
                style={{ width: 15, marginLeft: 10 }}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    seed: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
        width: '100%',

        paddingHorizontal: 15,

        borderRadius: 20
    },
    seedText: {
        fontSize: 12,
        textAlign: 'center',
        flex: 1
    }
});
