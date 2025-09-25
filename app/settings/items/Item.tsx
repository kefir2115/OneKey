import { ThemedText } from '@/components/ThemedText';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

export default function Item({
    style,
    title,
    right,
    onClick
}: {
    style?: StyleProp<ViewStyle>;
    title: string;
    right: () => React.JSX.Element;
    onClick?: () => void;
}) {
    return (
        <TouchableOpacity
            style={[style, styles.item]}
            onPress={onClick}
        >
            <ThemedText style={{ fontSize: 12 }}>{title}</ThemedText>
            {right()}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});
