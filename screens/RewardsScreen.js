import React from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, COMMON_STYLES, SHADOWS } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useMockContext } from '../utils/MockContext';
import { useLanguage } from '../utils/LanguageContext';
import Header from '../components/Header';

const RewardsScreen = ({ navigation }) => {
    const { points } = useMockContext();
    const { t } = useLanguage();

    // Mock Rewards Data
    const rewards = [
        { id: '1', title: 'Coffee Voucher', points: 500, icon: 'cafe' },
        { id: '2', title: 'Movie Ticket', points: 1000, icon: 'film' },
        { id: '3', title: 'Metro Smart Card', points: 2000, icon: 'train' },
        { id: '4', title: 'Shopping Coupon', points: 5000, icon: 'cart' },
    ];

    return (
        <View style={COMMON_STYLES.container}>
            <Header title={t('rewards')} />

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* Hero Card */}
                <View style={[styles.heroCard, { backgroundColor: COLORS.secondary }]}>
                    <View style={styles.heroContent}>
                        <Ionicons name="trophy" size={50} color="white" style={{ marginBottom: 10 }} />
                        <Text style={styles.pointsText}>{points}</Text>
                        <Text style={styles.pointsLabel}>{t('impactPoints')}</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Responsible Citizen</Text>
                        </View>
                    </View>
                    {/* Progress Bar Mock */}
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { width: '30%' }]} />
                        <Text style={styles.progressText}>150 / 500</Text>
                    </View>
                </View>

                {/* Redeem Section */}
                <Text style={styles.sectionTitle}>{t('rewardsTitle')}</Text>

                <View style={styles.grid}>
                    {rewards.map(reward => (
                        <TouchableOpacity key={reward.id} style={styles.rewardCard}>
                            <View style={styles.rewardIcon}>
                                <Ionicons name={reward.icon} size={30} color={COLORS.text} />
                            </View>
                            <Text style={styles.rewardTitle}>{reward.title}</Text>
                            <Text style={styles.rewardCost}>{reward.points} {t('points')}</Text>

                            <View style={[styles.lockBadge, points < reward.points ? styles.locked : styles.unlocked]}>
                                <Text style={styles.lockText}>{points < reward.points ? 'Locked' : 'Redeem'}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    heroCard: {
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        marginBottom: 30,
        ...SHADOWS.strong
    },
    heroContent: {
        alignItems: 'center',
        marginBottom: 20,
    },
    pointsText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    pointsLabel: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 15,
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
    },
    badgeText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    progressContainer: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 3,
        marginTop: 10,
        position: 'relative',
    },
    progressBar: {
        height: '100%',
        backgroundColor: COLORS.warning, // Orange progress
        borderRadius: 3,
    },
    progressText: {
        position: 'absolute',
        right: 0,
        top: -20,
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    rewardCard: {
        width: '48%',
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
        ...SHADOWS.card,
    },
    rewardIcon: {
        marginBottom: 10,
        opacity: 0.7
    },
    rewardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 5,
        height: 40 // simple alignment
    },
    rewardCost: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 10,
    },
    lockBadge: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 15,
        width: '100%',
        alignItems: 'center',
    },
    locked: {
        backgroundColor: '#e0e0e0',
    },
    unlocked: {
        backgroundColor: COLORS.primary,
    },
    lockText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textLight,
    }
});

export default RewardsScreen;
