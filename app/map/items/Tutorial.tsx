import { ThemedText } from '@/components/ThemedText';
import Path from '@/components/utils/PathUtils';
import useLang from '@/hooks/useLang';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useRouter } from 'expo-router';
import { RefObject, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { Portal } from 'react-native-paper';
import { Path as PathView, Svg } from 'react-native-svg';

export interface TutorialProps {
    nextStep: () => void;
    step: number;
    bottomSheetRef: RefObject<BottomSheetMethods | null>;
}

export default function Tutorial({ step, nextStep, bottomSheetRef }: TutorialProps) {
    const { t } = useLang();
    const router = useRouter();
    const [path, setPath] = useState<string>('');
    const [text, setText] = useState<string>('');
    const [y, setY] = useState<number>(-1);

    const { width, height } = Dimensions.get('screen');

    useEffect(() => {
        switch (step) {
            case 0: {
                setPath(new Path(width, height).getRoundRect(0, height - height * 0.2, width, height * 0.2, 20));
                setText(t('tutorial1'));
                setY(height - height * 0.25 - 40);
                return;
            }
            case 1: {
                bottomSheetRef.current?.snapToIndex(1);
                setPath(new Path(width, height).getCircle(width - width * 0.12, height - height * 0.21, 30));
                setText(t('tutorial2'));
                setY(height - height * 0.3 - 40);
                return;
            }
            case 2: {
                setPath(new Path(width, height).getRoundRect(0, height - height * 0.25, width, height * 0.2, 20));
                setText(t('tutorial3'));
                setY(height - height * 0.3 - 40);
                return;
            }
            case 3: {
                setPath(new Path(width, height).getRoundRect(0, height - height * 0.35, width, height * 0.1, 20));
                setText(t('tutorial4'));
                setY(height - height * 0.4 - 40);
                return;
            }
            case 4: {
                setPath(new Path(width, height).getRoundRect(0, 0, width, height * 0.4, 20));
                setText(t('tutorial5'));
                setY(height * 0.45);
                return;
            }
            default: {
                if (step === -1) return;
                router.dismissAll();
                setPath('');
                setText('');
                setY(-1);
                return;
            }
        }
    }, [step]);

    return (
        <>
            {step !== -1 && (
                <Portal>
                    <TouchableOpacity
                        style={{ width: '100%', height: '100%' }}
                        onPress={nextStep}
                    >
                        <Svg
                            width={'100%'}
                            height={'100%'}
                        >
                            <PathView
                                d={path}
                                fill="#000000a6"
                                fillRule="evenodd"
                            />
                        </Svg>
                    </TouchableOpacity>
                    <ThemedText
                        style={[
                            {
                                top: y
                            },
                            style.step
                        ]}
                    >
                        {text}
                    </ThemedText>
                    <ThemedText style={[style.click]}>{t('tutorialClick')}</ThemedText>
                </Portal>
            )}
        </>
    );
}

const style = StyleSheet.create({
    click: {
        position: 'absolute',
        top: '50%',
        textAlign: 'center',
        width: '100%',
        opacity: 0.7,
        color: '#fff'
    },
    step: {
        position: 'absolute',
        textAlign: 'center',
        width: '100%',
        color: '#fff'
    }
});
