import useTheme from "@/hooks/useTheme";
import { StyleProp, TextStyle } from "react-native";
import { Button as Btn } from "react-native-paper";
import { StyleProps } from "react-native-reanimated";

interface ButtonProps {
    children?: any;
    onClick?: () => void;
    style?: StyleProps;
    textStyle?: StyleProp<TextStyle>;
    right?: any;
}

export default function Button({ children, onClick, style, textStyle, right }: ButtonProps) {
    const { color } = useTheme();
    return (
        <Btn
            style={[{ backgroundColor: color(0) }, style]}
            labelStyle={[{ color: color(1) }, textStyle]}
            onPress={onClick}
        >
            {children}
            {right}
        </Btn>
    );
}
