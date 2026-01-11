import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { COLORS, COMMON_STYLES, SHADOWS } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useMockContext } from '../utils/MockContext';
import { useLanguage } from '../utils/LanguageContext';
import Header from '../components/Header';
import { getRewards, getMyRewards, buyReward } from '../utils/api';

const RewardsScreen = ({ navigation }) => {
    const { points, updatePoints, user } = useMockContext();
    const { t } = useLanguage();
    const [rewards, setRewards] = useState([]);
    const [myRewards, setMyRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [buyingId, setBuyingId] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const [rewardsData, myRewardsData] = await Promise.all([
                getRewards(),
                getMyRewards()
            ]);

            // Handle different API response structures if needed
            // Assuming data is array or { rewards: [...] }
            setRewards(rewardsData.rewards || rewardsData || []);
            setMyRewards(myRewardsData.myRewards || myRewardsData || []);

        } catch (error) {
            console.log("Error fetching rewards:", error);
            // Alert.alert("Error", "Failed to load rewards");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleBuy = async (reward) => {
        if (points < reward.points) {
            Alert.alert(t('insufficientPoints'), t('needMorePoints'));
            return;
        }

        Alert.alert(
            t('confirmPurchase'),
            `${t('buy')} ${reward.title} ${t('for')} ${reward.points} ${t('points')}?`,
            [
                { text: t('cancel'), style: "cancel" },
                {
                    text: t('confirm'),
                    onPress: async () => {
                        setBuyingId(reward.id);
                        try {
                            const response = await buyReward(reward.id);
                            // Assuming response contains success or new points
                            // Adjust logic based on actual API response
                            const newPoints = points - reward.points;
                            await updatePoints(newPoints);
                            Alert.alert(t('success'), t('rewardRedeemed'));
                            onRefresh(); // Refresh lists
                        } catch (error) {
                            console.log("Buy Error:", error);
                            Alert.alert('Error', typeof error === 'string' ? error : 'Purchase failed');
                        } finally {
                            setBuyingId(null);
                        }
                    }
                }
            ]
        );
    };

    const renderMyRewardItem = (item) => (
        <View key={item.id} style={styles.myRewardCard}>
            <View style={[styles.iconContainer, { backgroundColor: COLORS.successLight }]}>
                <Ionicons name="gift" size={24} color={COLORS.success} />
            </View>
            <View>
                <Text style={styles.myRewardTitle} numberOfLines={1}>{item.title || item.reward?.title}</Text>
                <Text style={styles.myRewardDate}>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</Text>
            </View>
        </View>
    );

    return (
        <View style={COMMON_STYLES.container}>
            <Header title={t('rewards')} />

            <ScrollView
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Hero Card */}
                <View style={[styles.heroCard, { backgroundColor: COLORS.secondary }]}>
                    <View style={styles.heroContent}>
                        <Ionicons name="trophy" size={50} color="white" style={{ marginBottom: 10 }} />
                        <Text style={styles.pointsText}>{points}</Text>
                        <Text style={styles.pointsLabel}>{t('impactPoints')}</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Verified Citizen</Text>
                        </View>
                    </View>
                </View>

                {/* My Rewards Section */}
                {myRewards.length > 0 && (
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>{t('myRewards') || "My Rewards"}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                            {myRewards.map(renderMyRewardItem)}
                        </ScrollView>
                    </View>
                )}

                {/* Redeem Section */}
                <Text style={styles.sectionTitle}>{t('rewardsTitle') || "Available Rewards"}</Text>

                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
                ) : (
                    <View style={styles.grid}>
                        {rewards.length === 0 ? (
                            <Text style={styles.emptyText}>No rewards available at the moment.</Text>
                        ) : (
                            rewards.map(reward => (
                                <TouchableOpacity
                                    key={reward.id}
                                    style={styles.rewardCard}
                                    onPress={() => handleBuy(reward)}
                                    disabled={buyingId !== null}
                                >
                                    <View style={styles.rewardIcon}>
                                        <Ionicons name={reward.icon || "gift-outline"} size={30} color={COLORS.text} />
                                    </View>
                                    <Text style={styles.rewardTitle} numberOfLines={2}>{reward.title}</Text>
                                    <Text style={styles.rewardCost}>{reward.points} {t('points')}</Text>

                                    <View style={[styles.lockBadge, points < reward.points ? styles.locked : styles.unlocked]}>
                                        {buyingId === reward.id ? (
                                            <ActivityIndicator size="small" color={COLORS.white} />
                                        ) : (
                                            <Text style={[styles.lockText, points >= reward.points && { color: COLORS.white }]}>
                                                {points < reward.points ? 'Locked' : 'Redeem'}
                                            </Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                )}

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
    sectionContainer: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 15,
    },
    horizontalScroll: {
        marginBottom: 10,
    },
    myRewardCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 15,
        marginRight: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.light,
        minWidth: 200,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    myRewardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4,
    },
    myRewardDate: {
        fontSize: 12,
        color: COLORS.textLight,
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
        height: 40
    },
    rewardCost: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 10,
    },
    lockBadge: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
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
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.textLight,
        width: '100%',
        marginTop: 20
    }
});

export default RewardsScreen;
