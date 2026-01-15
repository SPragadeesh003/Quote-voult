import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { QuoteWidget } from './src/components/QuoteWidget';

const nameToWidget = {
    QuoteWidget: QuoteWidget,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
    const widgetInfo = props.widgetInfo;
    const Widget = nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

    switch (props.widgetAction) {
        case 'WIDGET_ADDED':
        case 'WIDGET_UPDATE':
        case 'WIDGET_RESIZED':
            // Get data stored in preferences or passed via update
            // For simplicity in this demo, we can just use default or last known.
            // But props.renderWidget handles rendering.
            // We rely on the app to push updates via requestWidgetUpdate which injects props.

            let quote = "Open the app to see today's quote!";
            let author = "QuickVault";

            try {
                const storedData = await AsyncStorage.getItem('WIDGET_QUOTE_DATA');
                if (storedData) {
                    const parsed = JSON.parse(storedData);
                    if (parsed.quote) quote = parsed.quote;
                    if (parsed.author) author = parsed.author;
                    console.log('Widget Task Handler - Loaded data:', { quote, author, parsed });
                }
            } catch (e) {
                console.error('Error retrieving widget data', e);
            }

            props.renderWidget(
                <Widget quote={quote} author={author} />
            );
            break;

        default:
            break;
    }
}
