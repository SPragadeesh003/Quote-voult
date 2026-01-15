import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Alert, Linking, Share } from 'react-native';
import { Quote } from '../../types/Quote.types';

class ShareService {
    static async shareText(quote: Quote) {
        try {
            const message = `"${quote.text}"\n\n- ${quote.author || 'Unknown'}\n\nShared via QuickVault`;
            await Share.share({
                message,
                title: 'Share Quote',
            });
        } catch (error) {
            console.error('Error sharing text:', error);
            Alert.alert('Error', 'Failed to share quote');
        }
    }
    static async saveImage(uri: string) {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();

            if (status === 'granted') {
                const asset = await MediaLibrary.createAssetAsync(uri);
                Alert.alert('Success', 'Quote card saved to gallery!');
            } else {
                Alert.alert(
                    'Permission Required',
                    'Please allow access to your photos to save the quote card.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() }
                    ]
                );
            }
        } catch (error) {
            console.error('Error saving image:', error);
            Alert.alert('Error', 'Failed to save image to gallery');
        }
    }
    static async shareImage(uri: string) {
        try {
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'image/png',
                    dialogTitle: 'Share Quote Card',
                    UTI: 'public.png',
                });
            } else {
                Alert.alert('Error', 'Sharing is not available on this device');
            }
        } catch (error) {
            console.error('Error sharing image:', error);
            Alert.alert('Error', 'Failed to share image');
        }
    }
}

export default ShareService;
