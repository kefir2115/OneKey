import { ExternalLink } from '@/components/ExternalLink';
import { ThemedText } from '@/components/ThemedText';
import Image from '@/components/ui/Image';
import { back } from '@/constants/Icons';
import useConfig from '@/hooks/useConfig';
import useLang from '@/hooks/useLang';
import useTheme from '@/hooks/useTheme';
import { setStringAsync } from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Card, Divider, Switch } from 'react-native-paper';
import CopyField from './CopyField';
import Item from './Item';

export interface SwitchCardProps {
    expertMode: boolean;
    bioAuth: boolean;

    setExpertMode: (next: boolean) => void;
    setSnackBar: (next: boolean) => void;
}

export default function SwitchCard({ expertMode, bioAuth, setExpertMode, setSnackBar }: SwitchCardProps) {
    const { color } = useTheme();
    const { t } = useLang();
    const config = useConfig();
    const router = useRouter();

    const goToTutorial = () => {
        config.save();
        router.navigate({
            pathname: '/map',
            params: {
                tutorial: '1'
            }
        });
    };

    const goToOrgs = () => {
        config.save();
        router.navigate('/settings/organisations');
    };

    const goToRemoveAccount = () => {
        config.save();
        router.navigate('/settings/deleteAccount');
    };

    const toggleExpertMode = () => setExpertMode(!expertMode);

    const toggleBioAuth = () => {
        router.navigate({
            pathname: '/pin',
            params: {
                next: '/settings',
                action: 'toggleBioAuth'
            }
        });
    };

    const copyClipboard = (value: string) => {
        setStringAsync(config.account.seed).then(() => {
            setSnackBar(true);
        });
    };

    return (
        <Card style={[styles.card, { backgroundColor: color.background }]}>
            <Card.Content>
                <Item
                    title={t('appUse')}
                    right={() => <Arrow />}
                    onClick={goToTutorial}
                />
                <Divider style={[styles.divider, { backgroundColor: color.lighterBackground }]} />
                <Item
                    onClick={goToOrgs}
                    title={t('organisations')}
                    right={() => <Arrow />}
                />
                <Divider style={[styles.divider, { backgroundColor: color.lighterBackground }]} />
                <ExternalLink href={`http://caruma.io/downloads/Terms_And_Conditions_Caruma_${config.language === 'en' ? 'En' : 'Pl'}.pdf`}>
                    <Item
                        style={{ width: '100%' }}
                        title={t('tos')}
                        right={() => <Arrow />}
                    />
                </ExternalLink>
                <Divider style={[styles.divider, { backgroundColor: color.lighterBackground }]} />
                <Item
                    title={t('deleteAccount')}
                    right={() => <Arrow />}
                    onClick={goToRemoveAccount}
                />
                <Divider style={[styles.divider, { backgroundColor: color.lighterBackground }]} />
                <Item
                    title={t('expertMode')}
                    right={() => (
                        <Switch
                            value={expertMode}
                            onChange={toggleExpertMode}
                            thumbColor={expertMode ? color.green : color.lighterBackground}
                            trackColor={{
                                true: color.green + 'aa',
                                false: color.lighterBackground + 'aa'
                            }}
                        />
                    )}
                />
                <Item
                    title={t('bioAuth')}
                    right={() => (
                        <Switch
                            value={bioAuth}
                            onChange={toggleBioAuth}
                            thumbColor={bioAuth ? color.green : color.lighterBackground}
                            trackColor={{
                                true: color.green + 'aa',
                                false: color.lighterBackground + 'aa'
                            }}
                        />
                    )}
                />
                {expertMode && (
                    <>
                        <Divider style={[styles.divider, { backgroundColor: color.lighterBackground }]} />
                        <ThemedText>{t('accAddress')}</ThemedText>
                        <CopyField
                            value={config.account.address}
                            copy={copyClipboard}
                        />
                        <ThemedText>{t('installId')}</ThemedText>
                        <CopyField
                            value={process.env.EXPO_PUBLIC_BUILD_VERSION as string}
                            copy={copyClipboard}
                        />
                    </>
                )}
                <ThemedText style={styles.watermark}>One Key by Caruma v 1.0.0</ThemedText>
            </Card.Content>
        </Card>
    );
}
export const Arrow = () => (
    <Image
        style={{ aspectRatio: 0.5, width: 10, margin: 20, transform: [{ rotate: '180deg' }] }}
        source={back}
    />
);

const styles = StyleSheet.create({
    card: {
        width: '90%'
    },
    divider: {
        height: 1,
        width: '90%',
        alignSelf: 'center'
    },
    watermark: {
        fontSize: 10,
        opacity: 0.7,
        textAlign: 'center',
        margin: 10
    }
});
