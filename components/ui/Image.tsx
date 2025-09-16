import { ImageProps, ImageStyle, Image as Img } from "expo-image";
import { StyleProp, StyleSheet, View } from "react-native";

export default function Image(props: ImageProps, image?: StyleProp<ImageStyle>) {
    return (
        <View style={[props.style]}>
            <Img
                contentFit="contain"
                {...props}
                style={[s.image, image]}
            />
        </View>
    );
}

const s = StyleSheet.create({
    image: {
        width: "100%",
        height: "100%"
    }
});
