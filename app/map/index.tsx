import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Image from "@/components/ui/Image";
import { global } from "@/constants/Styles";
import useTheme from "@/hooks/useTheme";
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";
import { useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button, Card, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const map = require("../../assets/images/testmap.png");
const info = require("../../assets/images/icons/info.svg");

const qr = require("../../assets/images/icons/qr.svg");
const qrDark = require("../../assets/images/icons/qr-dark.svg");

const layers = require("../../assets/images/icons/stack.svg");
const layersDark = require("../../assets/images/icons/stack-dark.svg");

const person = require("../../assets/images/icons/person.svg");
const personDark = require("../../assets/images/icons/person-dark.svg");

export default function Map() {
    const { color, theme } = useTheme();
    const [search, setSearch] = useState("");

    const snaps = useMemo(() => ["20%", "70%"], []);

    const updateSearchBar = (str: string) => {
        setSearch(str);
        // TODO: filter items & display best match
    };

    return (
        <>
            <Image
                source={map}
                style={style.map}
                contentFit="cover"
            />
            <SafeAreaView style={global.container}>
                <Searchbar
                    value={search}
                    onChangeText={updateSearchBar}
                    style={[style.searchBox, { backgroundColor: color(0) }]}
                    inputStyle={{ color: color(1) }}
                    cursorColor={color(4)}
                    placeholder="Search doors"
                />
                <View style={style.rightBar}>
                    <TouchableOpacity style={style.rightImg}>
                        <Image source={theme === "light" ? qr : qrDark} />
                    </TouchableOpacity>
                    <TouchableOpacity style={style.rightImg}>
                        <Image source={theme === "light" ? layers : layersDark} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <GestureHandlerRootView>
                <BottomSheet
                    index={0}
                    snapPoints={snaps}
                    style={{ borderRadius: 20 }}
                    overDragResistanceFactor={0}
                >
                    <BottomSheetView>
                        <ThemedText style={style.cardTitle}>Available gates</ThemedText>
                        <BottomSheetFlatList
                            horizontal
                            style={{ marginBottom: "15%" }}
                            data={Array(5).fill("")}
                            renderItem={(e) => {
                                return <ItemEntry key={e.index} />;
                            }}
                            keyExtractor={(i) => i}
                            nestedScrollEnabled
                        />
                    </BottomSheetView>
                </BottomSheet>
            </GestureHandlerRootView>
        </>
    );
}

const ItemEntry = (_: any) => {
    const { color, theme } = useTheme();
    return (
        <Card
            style={[{ backgroundColor: color(0) }, card.container]}
            {..._}
        >
            {/* <Card.Title title={"20m"} /> */}
            <Card.Content>
                <ThemedView style={card.header}>
                    <ThemedText style={card.distance}>20m</ThemedText>
                    <Image
                        source={info}
                        style={card.img}
                    />
                </ThemedView>
                <ThemedText style={card.name}>Model Gate</ThemedText>
                <ThemedText style={card.location}>Ernesta Kościńskiego 111-041 Olsztyn</ThemedText>
            </Card.Content>
            <Card.Actions>
                <Button>Open</Button>
            </Card.Actions>
        </Card>
    );
};

const card = StyleSheet.create({
    container: {
        margin: 20
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    distance: {
        fontFamily: "PoppinsBold",
        fontSize: 20
    },
    img: {
        width: 30,
        aspectRatio: 1
    },
    name: {
        fontFamily: "PoppinsMedium",
        fontSize: 18
    },
    location: {}
});

const style = StyleSheet.create({
    map: {
        position: "absolute",
        width: "100%",
        height: "100%"
    },
    searchBox: {
        margin: "5%"
    },
    cardTitle: {
        fontSize: 24,
        lineHeight: 30,
        fontFamily: "PoppinsMedium",
        margin: 10
    },
    rightBar: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-end",

        width: "100%",
        top: "50%",
        transform: [{ translateY: "-50%" }]
    },
    rightImg: {
        width: "15%",
        aspectRatio: 1,
        marginHorizontal: "5%",
        marginVertical: 5,
        elevation: 10
    }
});
