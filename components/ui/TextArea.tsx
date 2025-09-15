import useTheme from "@/hooks/useTheme";
import { useState } from "react";
import { StyleProp, StyleSheet, TextInput, TextInputProps, ViewStyle } from "react-native";
import { ThemedView } from "../ThemedView";

export interface TextAreaProps extends TextInputProps {
    containerStyle?: StyleProp<ViewStyle>;
    placeholder?: string;
    children?: any;
}

export default function TextArea({ containerStyle, placeholder, children, ...rest }: TextAreaProps) {
    const { color, theme } = useTheme();
    const [height, setHeight] = useState(20);
    return (
        <ThemedView style={[styles.container, { borderColor: color(3) }, containerStyle]}>
            <TextInput
                multiline
                placeholder={placeholder}
                allowFontScaling
                style={[styles.input, { height: height }]}
                onContentSizeChange={(e) => setHeight(e.nativeEvent.contentSize.height)}
                {...rest}
            />
            {children}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",

        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 15
    },
    input: {
        margin: 10,
        fontSize: 20,
        lineHeight: 24,
        fontFamily: "PoppinsRegular"
    }
});
