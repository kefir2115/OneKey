import { ThemedText } from '@/components/ThemedText';
import Image from '@/components/ui/Image';
import { PIN_COLOR } from '@/constants/Colors';
import { arrow, finger } from '@/constants/Icons';
import useConfig from '@/hooks/useConfig';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export interface PinButtonProps {
    value: string;
    n: number;
    nums: number[];
    handleClick: (n: number) => void;
    bioAuth: () => void;
}

export default function PinButton({ value, n, nums, handleClick, bioAuth }: PinButtonProps) {
    const config = useConfig();
    if ((value === 'arrow' && nums.length === 0) || (value === 'finger' && (!config.biometric || config.pin.length === 0)))
        return (
            <View
                key={Math.random()}
                style={[style.pinView, { borderColor: '#0000' }]}
            />
        );
    return (
        <TouchableOpacity
            key={n}
            style={[style.pinView, { borderColor: PIN_COLOR }]}
            onPress={() => (value === 'finger' ? bioAuth() : handleClick(n))}
        >
            {value === 'arrow' && (
                <Image
                    source={arrow}
                    style={style.pinArrow}
                />
            )}
            {value === 'finger' && (
                <Image
                    source={finger}
                    style={style.pinArrow}
                />
            )}
            {n >= 0 && <ThemedText style={style.pinText}>{value}</ThemedText>}
        </TouchableOpacity>
    );
}

const style = StyleSheet.create({
    pinView: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${70 / 3}%`,
        aspectRatio: 1,

        margin: '3%',

        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 100
    },
    pinText: {
        margin: 'auto',
        fontSize: 30
    },
    pinArrow: {
        width: '50%',
        aspectRatio: 1
    }
});
