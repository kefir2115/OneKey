import useTheme from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import { StyleProp, StyleSheet, TouchableOpacity, ViewProps } from "react-native";
import { Appbar } from "react-native-paper";
import Image from "./Image";

const backImg = require("../../assets/images/icons/back.svg");

export interface HeaderProps {
    style?: StyleProp<ViewProps>;
    content?: any;
    title?: string;
    goBack?: () => void;
}

export function Header({ style, content, title, goBack }: HeaderProps) {
    const { color } = useTheme();
    const router = useRouter();

    const back = () => {
        if (goBack) goBack();
        else {
            router.back();
        }
    };

    return (
        <Appbar.Header style={[headerStyle.header, { backgroundColor: color(0) }, style]}>
            <TouchableOpacity onPress={back}>
                <Image
                    style={{ aspectRatio: 0.5, width: 20, margin: 20 }}
                    source={backImg}
                />
            </TouchableOpacity>
            <Appbar.Content
                title={title || ""}
                titleStyle={[headerStyle.headerTitle, { color: color(1) }]}
            />
            {content}
        </Appbar.Header>
    );
}

const headerStyle = StyleSheet.create({
    header: {
        width: "100%"
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: "PoppinsLight",
        opacity: 0.8
    }
});
