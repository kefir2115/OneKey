import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { get } from "@/components/utils/Config";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Screen } from "expo-router/build/views/Screen";
import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EntryList from "@/components/ui/EntryList";
import QRCode from 'react-native-qrcode-svg';

export default function Main() {
    const seed = get().seed;

    function getLocks(): any[] {
        const locks = [
            { name: "Lock #1", geoloc: {lat: 0, lon: 0}, lastOpened: 0, },
            { name: "Lock #2", geoloc: {lat: 0, lon: 0}, lastOpened: 0, },
            { name: "Lock #3", geoloc: {lat: 0, lon: 0}, lastOpened: 0, },
            { name: "Lock #4", geoloc: {lat: 0, lon: 0}, lastOpened: 0, },
            { name: "Lock #5", geoloc: {lat: 0, lon: 0}, lastOpened: 0, },
            { name: "Lock #6", geoloc: {lat: 0, lon: 0}, lastOpened: 0, },
            { name: "Lock #7", geoloc: {lat: 0, lon: 0}, lastOpened: 0, },
            { name: "Lock #8", geoloc: {lat: 0, lon: 0}, lastOpened: 0, },
        ];

        return locks.map((l, idx) => <TouchableOpacity key={idx} style={{display: "flex", flexDirection: "row", alignItems: "center", margin: 5, backgroundColor: "#0000"}}>
            <FontAwesome name="lock" size={25} color={"#fff"} style={{margin: 15}}/>
            <ThemedView style={{ backgroundColor: "#0000" }}>
                <ThemedText>{l.name}</ThemedText>
                <ThemedText>Lat: {l.geoloc.lat} | Lon: {l.geoloc.lon}</ThemedText>
            </ThemedView>
        </TouchableOpacity>)
    }
    
    return (
        <SafeAreaView style={{flex: 1}}>
            <Screen options={{ headerShown: false }}/>
            <ThemedView style={s.header}>
                <ThemedView style={{display: "flex", flexDirection: "row", alignItems: "center", backgroundColor: "#fff0"}}>
                    <FontAwesome name="key" color={"#fff"} size={25} />
                    <ThemedText style={{fontSize: 20}}>OneKey</ThemedText>
                </ThemedView>
            </ThemedView>
            {seed.length === 32 && <ThemedView style={s.qrBox}>
                <ThemedText style={{...s.qrText, fontSize: 18}}>Looks like you are not authorized</ThemedText>
                <ThemedText style={s.qrText}>Contact with admin to verify yourself</ThemedText>
                <ThemedView style={s.qr}>
                    <QRCode value={seed} ecl="M" quietZone={6} size={150}/>
                </ThemedView>
                <ThemedText style={s.qrText}>{seed}</ThemedText>
            </ThemedView>}
            <EntryList title={"Your locks list"} entries={getLocks()}/>
        </SafeAreaView>
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
    qrBox: {
        alignSelf: "center",
        width: "80%",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        margin: 20,

        backgroundColor: "#ffffff3f",
        borderRadius: 10,
    },
    qrText: {
        textAlign: "center"
    },
    qr: {
        margin: 20
    }
});