import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import useLang from '@/hooks/useLang';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

const image = require('../assets/images/icons/xmark.svg');

export default function NotFound() {
    const { f } = useLang();
    const nav = useRouter();

    return (
        <ThemedView style={s.view}>
            <Image
                style={s.img}
                source={image}
                alt="image not found"
            />
            <ThemedText style={s.title}>{f('pageDontExist')}</ThemedText>
            <Button
                style={s.btn}
                onClick={() => nav.replace('/index')}
            >
                Go back
            </Button>
        </ThemedView>
    );
}

const s = StyleSheet.create({
    title: {
        fontSize: 20,
        textAlign: 'center'
    },
    img: {
        width: '30%',
        aspectRatio: 1,
        margin: '20%',

        alignSelf: 'center',
        color: 'black',

        transform: [{ scale: 1.5 }]
    },
    btn: {
        marginBottom: 35
    },
    view: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%'
    }
});
