import useTheme from '@/hooks/useTheme';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({ style, ...rest }: ThemedTextProps) {
    const { theme, color } = useTheme();

    return (
        <Text
            style={[{ color: color.font, fontFamily: 'PoppinsRegular' }, styles.default, style]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        lineHeight: 24
    }
});
