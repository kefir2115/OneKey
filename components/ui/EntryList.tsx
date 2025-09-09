import { Animated, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export interface EntryListProps {
    entries: any[],
    title: string
}

export default function EntryList({entries, title}: EntryListProps) {
    return (
        <ThemedView style={s.main}>
            <ThemedText style={{fontSize: 20}}>{title}</ThemedText>
            <Animated.ScrollView style={s.list}>
                {entries}
            </Animated.ScrollView>
        </ThemedView>
    );
}

const s = StyleSheet.create({
    main: {
        display: "flex",
        flexDirection: "column",

        height: 100,
        flex: 1,

        margin: 20,
        padding: 10,

        backgroundColor: "#ffffff2c",
        borderRadius: 20,
    },
    list: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0000"
    }
});