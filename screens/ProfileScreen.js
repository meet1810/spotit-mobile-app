import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, COMMON_STYLES, SHADOWS } from '../styles/theme';
import { useMockContext } from '../utils/MockContext';
import { useLanguage } from '../utils/LanguageContext';
import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }) => {
    const { user, points, issues, logout, userLocation } = useMockContext();
    const { t, language, changeLanguage, languages } = useLanguage();

    const [profileImage, setProfileImage] = useState(null);
    const [langModalVisible, setLangModalVisible] = useState(false);

    const handlePickImage = async () => {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission Needed", "Please allow gallery access to upload photo.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const menuItems = [
        { icon: 'create-outline', label: t('editProfile'), action: () => navigation.navigate('EditProfile') },
        { icon: 'notifications-outline', label: t('notifications'), action: () => Alert.alert("Notifications", "No new notifications") },
        { icon: 'share-social-outline', label: t('shareApp'), action: () => Alert.alert("Share", "Sharing URL copied!") },
        { icon: 'help-circle-outline', label: t('helpSupport'), action: () => Alert.alert("Support", "Contact: help@spotit.in") },
        { icon: 'shield-checkmark-outline', label: t('privacyPolicy'), action: () => Alert.alert("Privacy", "Data is secure.") },
    ];

    const stats = [
        { label: t('issuesReported'), value: issues.length, icon: 'camera', color: COLORS.primary },
        { label: t('impactPoints'), value: points, icon: 'trophy', color: COLORS.warning },
        { label: t('rank'), value: 'Guard', icon: 'ribbon', color: COLORS.secondary },
    ];

    return (
        <View style={COMMON_STYLES.container}>
            <Header title={t('profile')} />

            <ScrollView contentContainerStyle={styles.container}>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <TouchableOpacity onPress={handlePickImage} style={styles.avatarContainer}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
                            </View>
                        )}
                        <View style={styles.cameraIconBadge}>
                            <Ionicons name="camera" size={14} color={COLORS.white} />
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.userName}>{user?.name || 'Citizen'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'user@spotit.com'}</Text>

                    {/* Location */}
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-sharp" size={16} color={COLORS.textLight} />
                        <Text style={styles.locationText}>
                            {userLocation?.address || 'Location not detected'}
                        </Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    {stats.map((stat, index) => (
                        <View key={index} style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                                <Ionicons name={stat.icon} size={24} color={stat.color} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Language Picker */}
                <TouchableOpacity style={styles.langSelector} onPress={() => setLangModalVisible(true)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="language" size={24} color={COLORS.primary} style={{ marginRight: 15 }} />
                        <Text style={styles.menuLabel}>{t('language')}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.currentLang}>
                            {languages.find(l => l.code === language)?.label || 'English'}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.border} />
                    </View>
                </TouchableOpacity>

                {/* Menu */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>{t('settings')}</Text>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
                            <View style={styles.menuLeft}>
                                <View style={styles.menuIconBox}>
                                    <Ionicons name={item.icon} size={22} color={COLORS.text} />
                                </View>
                                <Text style={styles.menuLabel}>{item.label}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.border} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout */}
                <View style={styles.logoutContainer}>
                    <CustomButton
                        title={t('logout')}
                        onPress={logout}
                        type="outline"
                        style={{ borderColor: COLORS.danger }}
                        textStyle={{ color: COLORS.danger }}
                    />
                    <Text style={styles.versionText}>App Version 1.0.4</Text>
                </View>

            </ScrollView>

            {/* Language Modal */}
            <Modal visible={langModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Language</Text>
                            <TouchableOpacity onPress={() => setLangModalVisible(false)}>
                                <Ionicons name="close" size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={{ padding: 20 }}>
                            {languages.map(lang => (
                                <TouchableOpacity
                                    key={lang.code}
                                    style={[styles.langOption, language === lang.code && styles.selectedLang]}
                                    onPress={() => {
                                        changeLanguage(lang.code);
                                        setLangModalVisible(false);
                                    }}
                                >
                                    <Text style={[styles.langText, language === lang.code && { color: COLORS.primary, fontWeight: 'bold' }]}>
                                        {lang.label}
                                    </Text>
                                    {language === lang.code && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    profileCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        marginBottom: 20,
        ...SHADOWS.card,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary, // Saffron
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.strong,
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    cameraIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.secondary,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 15,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 15,
    },
    locationText: {
        color: COLORS.textLight,
        fontSize: 12,
        marginLeft: 5,
        textAlign: 'center',
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    statCard: {
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        width: '31%',
        ...SHADOWS.light,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    statLabel: {
        fontSize: 10,
        color: COLORS.textLight,
        marginTop: 2,
    },

    // Language Selector
    langSelector: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        ...SHADOWS.card,
    },
    currentLang: {
        color: COLORS.textLight,
        marginRight: 10,
        fontSize: 14,
    },

    // Menu
    menuSection: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        ...SHADOWS.card,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 15,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuLabel: {
        fontSize: 16,
        color: COLORS.text,
        fontWeight: '500',
    },

    logoutContainer: {
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    versionText: {
        marginTop: 15,
        color: COLORS.textLight,
        fontSize: 12,
        opacity: 0.5
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: '50%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    langOption: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    selectedLang: {
        backgroundColor: '#f9f9f9'
    },
    langText: {
        fontSize: 16,
        color: COLORS.text,
    }

});

export default ProfileScreen;
