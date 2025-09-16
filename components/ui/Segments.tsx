import useTheme from "@/hooks/useTheme";
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export interface SegmentsProps {
    value: number;
    values: string[];
    icons?: any[];
    onChange: (index: number) => void;
    style?: StyleProp<ViewStyle>;
}

export default function Segments({ value, values, onChange, icons, style }: SegmentsProps) {
    const { color } = useTheme();
    return (
        <ThemedView style={[styles.container, { borderColor: color(4) }, style]}>
            {values.map((v, id) => (
                <TouchableOpacity
                    key={id}
                    onPress={() => onChange(id)}
                    style={[styles.item, value === id ? { backgroundColor: color(4) } : null, { borderColor: color(4) }]}
                >
                    {icons && icons[id]}
                    <ThemedText style={{ marginLeft: "10%" }}>{v}</ThemedText>
                </TouchableOpacity>
            ))}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",

        borderRadius: 20,
        overflow: "hidden",

        borderWidth: 1,
        borderStyle: "solid"
    },
    item: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,

        flex: 1,

        borderRightWidth: 1,
        borderStyle: "solid"
    }
});
