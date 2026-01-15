"use no memo";
import { FONTS } from '@/constants/fonts';
import { QUOTE_ICON_SVG } from '@/utils/DoubleQuotesSvg';
import React from 'react';
import { FlexWidget, OverlapWidget, SvgWidget, TextWidget } from 'react-native-android-widget';

interface QuoteWidgetProps {
    quote: string;
    author: string;
}

export function QuoteWidget({ quote, author }: QuoteWidgetProps) {
    return (
        <OverlapWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#4F7942',
                borderRadius: 24,
            }}
        >
            <FlexWidget
                style={{
                    height: 'match_parent',
                    width: 'match_parent',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-end',
                    paddingRight: 16,
                    paddingTop: 16,
                }}
            >
                <SvgWidget
                    svg={QUOTE_ICON_SVG}
                    style={{
                        width: 80,
                        height: 80,
                    }}
                />
            </FlexWidget>

            <FlexWidget
                style={{
                    height: 'match_parent',
                    width: 'match_parent',
                    padding: 20,
                    justifyContent: 'space-between',
                }}
                clickAction="OPEN_APP"
            >
                <TextWidget
                    text="Quote of the Day"
                    style={{
                        fontSize: 12,
                        color: '#ffffffb3',
                        fontFamily: FONTS.GOOGLE_SANS_REGULAR,
                    }}
                />

                <TextWidget
                    text={`"${quote}"`}
                    style={{
                        fontSize: 18,
                        color: '#FFFFFF',
                        fontFamily: 'SamsungOneSans-Regular',
                    }}
                    maxLines={4}
                />

                <TextWidget
                    text={`- ${author}`}
                    style={{
                        fontSize: 14,
                        color: '#ffffffe6',
                        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
                        textAlign: 'right',
                    }}
                />
            </FlexWidget>
        </OverlapWidget>
    );
}
