import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Image from "@/components/ui/Image";
import generate from "@/components/utils/Seed";
import { global } from "@/constants/Styles";
import useLang from "@/hooks/useLang";
import useTheme from "@/hooks/useTheme";
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { Button, Card, Modal, Portal, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const map = require("../../assets/images/testmap.png");
const info = require("../../assets/images/icons/info.svg");
const xmark = require("../../assets/images/icons/xmark.svg");

const qr = require("../../assets/images/icons/qr.svg");
const qrDark = require("../../assets/images/icons/qr-dark.svg");

const key = require("../../assets/images/icons/key.svg");
const keyDark = require("../../assets/images/icons/key-dark.svg");

const layers = require("../../assets/images/icons/stack.svg");
const layersDark = require("../../assets/images/icons/stack-dark.svg");

const setting = require("../../assets/images/icons/settings.svg");
const settingDark = require("../../assets/images/icons/settings-dark.svg");

const location = require("../../assets/images/icons/navigation.svg");
const locationDark = require("../../assets/images/icons/navigation-dark.svg");
const locationOn = require("../../assets/images/icons/navigation-on.svg");
const locationOnDark = require("../../assets/images/icons/navigation-on-dark.svg");

export default function Map() {
    const router = useRouter();
    const { f } = useLang();
    const { color, theme } = useTheme();
    const [loc, setLoc] = useState<Location.LocationObject | undefined>(undefined);
    const [search, setSearch] = useState("");
    const [locationModal, setLocationModal] = useState(false);
    const [locStatus, setLocStatus] = useState(0);
    const [results, setResults] = useState<number[]>([]);

    const snaps = useMemo(() => ["20%", "70%"], []);

    useEffect(() => {
        (async () => {
            Location.getLastKnownPositionAsync({})
                .then((e) => {
                    if (e === null) return;

                    setLoc(e);
                    setLocStatus(0);
                })
                .catch((err) => {
                    setLoc(undefined);
                    Location.hasServicesEnabledAsync().then((e) => {
                        setLocStatus(e ? 2 : 1);
                    });
                });
        })();
    }, []);

    const updateSearchBar = (str: string) => {
        setSearch(str);
        // TODO: filter items & display best match
        // pseudo filter
        let items = 0;
        if (str.length > 0) items = 3;
        if (str.length > 5) items = 0;

        setResults((prev) => {
            prev.splice(0, prev.length);
            prev.push(
                ...Array(items)
                    .fill(0)
                    .map((e, i) => i)
            );
            return prev;
        });
    };

    const openLocationPrompt = () => {
        if (locStatus !== 0) setLocationModal(true);
    };

    const openScanner = () => {
        router.navigate("/map/scanner");
    };

    const openKeyList = () => {
        router.navigate("/devices");
    };
    const goToSettings = () => {
        router.navigate("/settings");
    };

    const requestLocation = () => {
        Location.requestForegroundPermissionsAsync().then((e) => {
            if (e.granted) {
                setLocationModal(false);
                setLocStatus(0);
            }
        });
    };

    return (
        <>
            {/* TODO: change to actual google maps >.< */}
            <Image
                source={map}
                style={style.map}
                contentFit="cover"
            />
            <SafeAreaView style={global.container}>
                <View style={style.topbar}>
                    <Searchbar
                        value={search}
                        onChangeText={updateSearchBar}
                        style={[style.searchBox, { backgroundColor: color(0) }]}
                        inputStyle={{ color: color(1) }}
                        cursorColor={color(4)}
                        placeholder={f("search")}
                        placeholderTextColor={color(1) + "aa"}
                    />
                    <TouchableOpacity
                        style={{ width: 50, aspectRatio: 1 }}
                        onPress={goToSettings}
                    >
                        <Image source={theme === "light" ? setting : settingDark} />
                    </TouchableOpacity>
                </View>
                <View style={style.bar}>
                    <TouchableOpacity style={[style.rightImg]}>
                        <Image source={theme === "light" ? layers : layersDark} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[style.rightImg]}
                        onPress={openScanner}
                    >
                        <Image source={theme === "light" ? qr : qrDark} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <View style={[style.bar]}>
                {!loc && (
                    <ThemedText
                        style={style.popupLocation}
                        key={"popup"}
                    >
                        <ThemedText style={[{ fontSize: 12, backgroundColor: color(0), padding: 5 }]}>{f("actionRequired")}</ThemedText>
                    </ThemedText>
                )}
                <TouchableOpacity
                    style={[style.rightImg, loc ? border.use : null, { borderColor: color(4) }]}
                    onPress={openLocationPrompt}
                    key={"locbtn"}
                >
                    <Image
                        key={"locimg"}
                        source={loc ? (theme === "light" ? locationOn : locationOnDark) : theme === "light" ? location : locationDark}
                    />
                </TouchableOpacity>
            </View>
            <GestureHandlerRootView>
                <BottomSheet
                    index={0}
                    snapPoints={snaps}
                    style={{ borderRadius: 20 }}
                    overDragResistanceFactor={0}
                    backgroundStyle={{ backgroundColor: color(0) }}
                >
                    <BottomSheetView>
                        <TouchableOpacity
                            style={style.bottomHeader}
                            onPress={openKeyList}
                        >
                            <ThemedText style={style.cardTitle}>{f("gates")}</ThemedText>
                            <Image
                                source={theme === "light" ? key : keyDark}
                                style={style.list}
                            />
                        </TouchableOpacity>
                        <BottomSheetFlatList
                            horizontal
                            style={{ marginBottom: "15%" }}
                            data={Array(5).fill("")}
                            renderItem={(e: any) => {
                                return <ItemEntry key={e.index} />;
                            }}
                            keyExtractor={(i: any) => generate()}
                            nestedScrollEnabled
                        />
                    </BottomSheetView>
                </BottomSheet>
            </GestureHandlerRootView>
            {search.length > 0 && (
                <Portal>
                    <ThemedView style={{ flex: 1, marginTop: "40%" }}>
                        <ThemedText style={{ textAlign: "center" }}>{f("results", search)}</ThemedText>
                        {results.length > 0 && (
                            <GestureHandlerRootView>
                                <FlatList
                                    data={Array(5).fill("")}
                                    renderItem={(e) => {
                                        if (results.includes(e.index)) return <ItemEntry key={e.index} />;
                                        return null;
                                    }}
                                />
                            </GestureHandlerRootView>
                        )}
                        {results.length === 0 && (
                            <ThemedView style={{ alignSelf: "center", alignItems: "center", marginTop: "20%" }}>
                                <ThemedText style={{ textAlign: "center", fontSize: 20, fontFamily: "PoppinsBold" }}>
                                    {f("noResults")}
                                </ThemedText>
                                <Image
                                    source={xmark}
                                    style={{ width: "20%", aspectRatio: 1 }}
                                />
                            </ThemedView>
                        )}
                    </ThemedView>
                </Portal>
            )}
            <Portal>
                <Modal
                    visible={locationModal}
                    onDismiss={() => setLocationModal(false)}
                >
                    {locStatus === 1 && (
                        <Card style={{ backgroundColor: color(0), borderRadius: 20 }}>
                            <Card.Content>
                                <ThemedText>{f("noService")}</ThemedText>
                            </Card.Content>
                        </Card>
                    )}
                    {locStatus === 2 && (
                        <Card style={{ backgroundColor: color(0), borderRadius: 20 }}>
                            <Card.Content>
                                <ThemedText>{f("noPermission")}</ThemedText>
                            </Card.Content>
                            <Card.Actions>
                                <Button onPress={requestLocation}>{f("allow")}</Button>
                            </Card.Actions>
                        </Card>
                    )}
                </Modal>
            </Portal>
        </>
    );
}

const ItemEntry = (_: any) => {
    const { f } = useLang();
    const { color } = useTheme();
    const router = useRouter();

    const openDeviceInfo = () => {
        const info = {}; // TODO: get info of device
        router.navigate({
            pathname: "/devices/info",
            params: info
        });
    };

    return (
        <Card
            style={[{ backgroundColor: color(0) }, card.container]}
            {..._}
        >
            {/* <Card.Title title={"20m"} /> */}
            <Card.Content>
                <ThemedView style={card.header}>
                    <ThemedText style={card.distance}>20m</ThemedText>
                    <TouchableOpacity onPress={() => openDeviceInfo()}>
                        <Image
                            source={info}
                            style={card.img}
                        />
                    </TouchableOpacity>
                </ThemedView>
                <ThemedText style={card.name}>Model Gate</ThemedText>
                <ThemedText style={card.location}>Ernesta Kościńskiego 111-041 Olsztyn</ThemedText>
            </Card.Content>
            <Card.Actions>
                <Button>{f("open")}</Button>
            </Card.Actions>
        </Card>
    );
};

const card = StyleSheet.create({
    container: {
        margin: 20,
        borderRadius: 20
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
    topbar: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    searchBox: {
        margin: "5%",
        width: "75%"
    },
    cardTitle: {
        fontSize: 24,
        lineHeight: 30,
        fontFamily: "PoppinsMedium",
        margin: 10
    },
    bar: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-end",

        width: "100%"
    },
    rightImg: {
        width: "10%",
        aspectRatio: 1,
        marginHorizontal: "5%",
        marginVertical: 5,
        elevation: 10
    },
    popupLocation: {
        position: "absolute",
        right: 0,
        textAlign: "right",

        fontSize: 12,
        marginRight: "10%",
        padding: 20,
        overflow: "hidden"
    },
    list: {
        width: 30,
        aspectRatio: 1
    },
    bottomHeader: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: "5%"
    }
});
const border = StyleSheet.create({
    use: {
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 100
    }
});
