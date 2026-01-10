import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, COMMON_STYLES } from '../styles/theme';

const IssueCard = ({ issue }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Analyzed': return COLORS.success;
            case 'Pending': return COLORS.primary;
            default: return COLORS.textLight;
        }
    };

    return (
        <View style={COMMON_STYLES.card}>
            <View style={styles.row}>
                <Image source={{ uri: issue.imageUri }} style={styles.thumbnail} />
                <View style={styles.details}>
                    <View style={[styles.badge, { backgroundColor: getStatusColor(issue.status) }]}>
                        <Text style={styles.badgeText}>{issue.status}</Text>
                    </View>
                    <Text style={styles.date}>{new Date(issue.timestamp).toLocaleDateString()}</Text>
                    <Text style={styles.location} numberOfLines={1}>{issue.locationText || 'Unknown Location'}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 16,
        backgroundColor: '#eee',
    },
    details: {
        flex: 1,
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    location: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '500',
    },
});

export default IssueCard;
