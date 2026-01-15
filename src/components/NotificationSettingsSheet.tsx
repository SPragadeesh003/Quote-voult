import { COLORS } from '@/constants/Colors';
import { useTheme } from '@/src/context/ThemeContext';
import { NotificationService } from '@/src/services/NotificationService';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import AnimatedBottomSheetModal from './AnimatedBottomSheetModal';
import { FONTS } from '@/constants/fonts';

interface NotificationSettingsSheetProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function NotificationSettingsSheet({ isVisible, onClose }: NotificationSettingsSheetProps) {
    const { theme } = useTheme();
    const [enabled, setEnabled] = useState(false);
    const [time, setTime] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        if (isVisible) {
            loadSettings();
        }
    }, [isVisible]);

    const loadSettings = async () => {
        setLoading(true);
        const settings = await NotificationService.getSettings();
        setEnabled(settings.enabled);
        setTime(settings.time);
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (enabled) {
                const granted = await NotificationService.registerForPushNotificationsAsync();
                if (!granted) {
                    Alert.alert('Permission Required', 'Please enable notifications in your device settings.');
                    setEnabled(false);
                    setSaving(false);
                    return;
                }
            }

            await NotificationService.saveSettings({ enabled, time });
            onClose();
        } catch (e) {
            Alert.alert('Error', 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleTimeChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowTimePicker(false);
        }
        if (selectedDate) {
            setTime(selectedDate);
        }
    };

    return (
        <AnimatedBottomSheetModal isVisible={isVisible} onClose={onClose}>
            <View style={styles.container}>
                <Text style={[styles.title, { color: theme.text }]}>Daily Notifications</Text>

                {loading ? (
                    <ActivityIndicator size="large" color={theme.tint} style={{ margin: 40 }} />
                ) : (
                    <View style={styles.content}>
                        <View style={[styles.row, { borderBottomColor: theme.text }]}>
                            <Text style={[styles.label, { color: theme.text }]}>Enable Daily Quote</Text>
                            <Switch
                                value={enabled}
                                onValueChange={setEnabled}
                                trackColor={{ false: COLORS.GRAY_DARK, true: theme.tint }}
                            />
                        </View>

                        {enabled && (
                            <View style={styles.timeSection}>
                                <Text style={[styles.label, { color: theme.text, marginBottom: 10 }]}>Notification Time</Text>

                                {Platform.OS === 'android' ? (
                                    <TouchableOpacity
                                        style={[styles.timeButton, { backgroundColor: theme.cardBackground }]}
                                        onPress={() => setShowTimePicker(true)}
                                    >
                                        <Text style={[styles.timeText, { color: theme.text }]}>
                                            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <DateTimePicker
                                        value={time}
                                        mode="time"
                                        display="spinner"
                                        onChange={handleTimeChange}
                                        textColor={theme.text}
                                        style={{ height: 120, width: '100%' }}
                                    />
                                )}

                                {showTimePicker && Platform.OS === 'android' && (
                                    <DateTimePicker
                                        value={time}
                                        mode="time"
                                        display="default"
                                        onChange={handleTimeChange}
                                    />
                                )}
                            </View>
                        )}

                        <TouchableOpacity
                            style={[styles.saveButton, { backgroundColor: theme.tint }]}
                            onPress={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator color={COLORS.WHITE} />
                            ) : (
                                <Text style={styles.saveButtonText}>Save Preferences</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </AnimatedBottomSheetModal>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 20,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
        marginBottom: 20,
        textAlign: 'center',
    },
    content: {
        gap: 24,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    label: {
        fontSize: 16,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
    },
    timeSection: {
        alignItems: 'center',
    },
    timeButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(128,128,128,0.2)',
    },
    timeText: {
        fontSize: 24,
        fontFamily: FONTS.GOOGLE_SANS_REGULAR,
    },
    saveButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontFamily: FONTS.GOOGLE_SANS_MEDIUM,
    }
});
