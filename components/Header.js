import React from 'react';
import { View, Text, StyleSheet, Image, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../styles/theme';
import { useMockContext } from '../utils/MockContext';

const Header = ({ title, showLocation = false, cityOverride }) => {
    const { userLocation } = useMockContext();
    const city = cityOverride || userLocation?.city || "Detecting...";

    return (
        <View style={styles.header}>
            <View style={styles.logoRow}>
                {/* Real Logo from Assets */}
                <Image
                    source={require('../assets/spot_it_full_logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />
            </View>

            {showLocation && (
                <View style={styles.locationPill}>
                    <Ionicons name="location" size={14} color={COLORS.primary} />
                    <Text style={styles.locationText} numberOfLines={1}>
                        {city}
                    </Text>
                </View>
            )}

            {title && !showLocation && (
                <Text style={styles.headerTitle}>{title}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingBottom: 5,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...SHADOWS.light
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoImage: {
        width: 100,
        height: 60,

    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    locationPill: {
        flexDirection: 'row',
        backgroundColor: '#FFF3E0', // Light Orange
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFE0B2',
        maxWidth: 150
    },
    locationText: {
        color: COLORS.primaryDark,
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
});

export default Header;
