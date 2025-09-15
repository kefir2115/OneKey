import { ImageProps, Image as Img } from "expo-image";
import { StyleSheet, View } from "react-native";

export default function Image(props: ImageProps) {
  return (
    <View style={[props.style]}>
      <Img {...props} style={s.image} contentFit="contain" />
    </View>
  );
}

const s = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});
