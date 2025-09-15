import { Header } from "@/components/ui/Header";
import { global } from "@/constants/Styles";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Info() {
    return (
        <>
            <Header title={"Back"} />
            <SafeAreaView style={global.container}>
                {/* <Image
                    source={"https://tile.openstreetmap.org/1/0/0.png"}
                    style={{ width: "100%", flex: 1 }}
                /> */}
            </SafeAreaView>
        </>
    );
}

const style = StyleSheet.create({
    map: {
        width: "100%",
        flex: 1
    }
});
