import { StyleSheet, TouchableOpacity } from "react-native";
import { StyleProps } from "react-native-reanimated";
import { ThemedText } from "../ThemedText";

interface ButtonProps {
    children?: string;
    onClick?: () => void;
    style?: StyleProps,
    textStyle?: StyleProps,
}

export default function Button({children, onClick, style, textStyle}: ButtonProps) {
    return <TouchableOpacity style={{...s.default, ...style}} onPress={onClick}>
        <ThemedText style={{...s.text, ...textStyle} as any}>{children}</ThemedText>
    </TouchableOpacity>
}

const s = StyleSheet.create({
    default: {
        margin: 15,
        padding: 10,
        backgroundColor: "#3884c2ff",
        borderRadius: 15,
    },
    text: {
        fontSize: 20,
        textAlign: "center"
    }
});