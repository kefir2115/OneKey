import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { get } from "@/components/utils/Config";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Screen } from "expo-router/build/views/Screen";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export interface SettingsEntryProps {
    name: string,
    value: string;
    editable?: boolean;
    onClick?: () => void;
}

export default function Settings() {
    return <SafeAreaView style={{flex: 1}}>
        <Screen options={{ headerShown: false }}/>
        <ThemedView style={s.header}>
            <ThemedText style={s.title}>Settings</ThemedText>
        </ThemedView>
        <Animated.ScrollView style={{marginTop: 20, flex: 1}}>
            <SettingsEntry name={"Seed"} value={get().seed}/>
            <SettingsEntry name={"test2"} value="#2" editable/>
        </Animated.ScrollView>
    </SafeAreaView>;
}

function SettingsEntry({name, value, editable, onClick}: SettingsEntryProps) {
    return (
        <TouchableOpacity style={s.entryBox}>
            <ThemedText>{name}</ThemedText>
            <ThemedView style={s.entryValue}>
                <ThemedText style={{paddingHorizontal: 20, fontSize: 10}}>{value}</ThemedText>
                {editable && <FontAwesome name="pencil" size={25} color={"#fff"}/>}
            </ThemedView>
        </TouchableOpacity>
    );
}

const s = StyleSheet.create({
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",

        padding: 10,

        backgroundColor: "#ffffff2c",
    },
    title: {
        fontSize: 20
    },
    entryBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        padding: 10,
        paddingHorizontal: 20,
        margin: 5,

        backgroundColor: "#ffffff1e",
        borderRadius: 20,
    },
    entryValue: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        padding: 10,

        backgroundColor: "#0000",
    }
});