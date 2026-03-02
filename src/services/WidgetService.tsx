import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { QuoteWidget } from '../components/QuoteWidget';

export const WidgetService = {
    async updateDailyQuote(quote: string, author: string) {
        try {
            await AsyncStorage.setItem('WIDGET_QUOTE_DATA', JSON.stringify({ quote, author }));

            await requestWidgetUpdate({
                widgetName: 'QuoteWidget',
                renderWidget: () => <QuoteWidget quote={quote} author={author} />,
            });
        } catch (e) {
            console.error('Error updating widget:', e);
        }
    },
};
