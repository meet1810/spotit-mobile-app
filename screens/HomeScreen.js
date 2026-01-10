import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    Modal,
    ActivityIndicator,
    TouchableOpacity,
    Animated,
    Dimensions
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, COMMON_STYLES, SHADOWS } from '../styles/theme';
import CustomButton from '../components/CustomButton';
import IssueCard from '../components/IssueCard';
import { useMockContext } from '../utils/MockContext';
import { useLanguage } from '../utils/LanguageContext';
import { reportIssue } from '../utils/api';
import Header from '../components/Header';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    // State
    const [permission, requestPermission] = useCameraPermissions();
    const [location, setLocation] = useState(null);
    const [city, setCity] = useState(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [appState, setAppState] = useState('HOME'); // HOME, PREVIEW, PROCESSING, SUCCESS
    const [cameraRef, setCameraRef] = useState(null);

    // Animations
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Context & Language
    const { points, addIssue, issues, setUserLocation, refreshIssues } = useMockContext();
    const { t } = useLanguage();

    const recentIssues = issues.slice(0, 3); // Top 3

    // Mock Rewards
    const POINTS_PER_SUBMISSION = 50;

    // Initial Location Fetch
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setLocation(loc.coords);

            try {
                let address = await Location.reverseGeocodeAsync({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude
                });

                if (address && address.length > 0) {
                    // Extract ONLY City/District for Header
                    const { city: cityVal, district, utilities, name, street, region } = address[0];
                    const mainCity = cityVal || district || region || "Unknown City";
                    setCity(mainCity);

                    // Build Full Address for Profile (stored in state to pass if needed or re-fetched there)
                    const fullAddr = [name, street, district, cityVal, region].filter(Boolean).join(', ');
                    setLocation(prev => ({ ...prev, address: fullAddr }));

                    // Update Global Context
                    setUserLocation({
                        ...loc.coords,
                        address: fullAddr,
                        city: mainCity
                    });
                }
            } catch (e) {
                console.log("Geocoding error:", e);
                setCity("India");
            }
        })();

        // Start Pulse Animation for Capture Button
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

    }, []);

    // Handlers
    const handleOpenCapture = async () => {
        if (!permission?.granted) {
            await requestPermission();
        }
        if (permission?.granted || permission?.canAskAgain) {
            setIsCameraOpen(true);
        } else {
            Alert.alert("Permission required", "Camera access is needed to spot issues.");
        }
    };

    const handleTakePicture = async () => {
        if (cameraRef) {
            const photo = await cameraRef.takePictureAsync({ quality: 0.7 });
            setCapturedImage(photo.uri);
            setIsCameraOpen(false);
            setAppState('PREVIEW');

            // Refresh location
            try {
                let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                setLocation(loc.coords);
            } catch (e) { console.log('Loc update failed', e) }
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
        setAppState('HOME');
        setIsCameraOpen(true);
    };

    const handleSubmit = async () => {
        setAppState('PROCESSING');

        try {
            const formData = new FormData();
            formData.append('image', {
                uri: capturedImage,
                name: 'issue.jpg',
                type: 'image/jpeg',
            });
            formData.append('latitude', location.latitude.toString());
            formData.append('longitude', location.longitude.toString());
            formData.append('timestamp', Date.now().toString());

            // API URL Provided by User
            const result = await reportIssue(formData);



            const newIssue = {
                id: result.id || Date.now().toString(),
                imageUri: capturedImage,
                timestamp: Date.now(),
                status: 'Analyzed',
                locationText: location.address || `${city}`,
                category: result.category || 'Garbage Dump',
                confidence: result.confidence || 0.95,
                points: POINTS_PER_SUBMISSION,
                coordinates: {
                    latitude: location.latitude,
                    longitude: location.longitude
                }
            };

            // Refresh global issues list from API
            await refreshIssues();

            setAppState('SUCCESS');

        } catch (error) {
            console.error("API Error:", error);
            // Fallback
            const newIssue = {
                id: Date.now().toString(),
                imageUri: capturedImage,
                timestamp: Date.now(),
                status: 'Pending Upload',
                locationText: location.address || `${city}`,
                category: 'Unidentified',
                confidence: 0,
                points: 0,
                coordinates: {
                    latitude: location.latitude,
                    longitude: location.longitude
                }
            };
            addIssue(newIssue);
            setAppState('SUCCESS');
        }
    };

    const handleBackToHome = () => {
        setCapturedImage(null);
        setAppState('HOME');
    };

    // Render Functions
    const renderCamera = () => (
        <Modal visible={isCameraOpen} animationType="slide">
            <View style={{ flex: 1 }}>
                <CameraView style={{ flex: 1 }} ref={(ref) => setCameraRef(ref)} />
                <View style={styles.cameraOverlay}>
                    <View style={styles.cameraControls}>
                        <TouchableOpacity onPress={() => setIsCameraOpen(false)} style={styles.closeButton}>
                            <Ionicons name="close" size={30} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleTakePicture} style={styles.captureButton}>
                            <View style={styles.captureInner} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderPreview = () => (
        <ScrollView contentContainerStyle={styles.centerContent}>
            <Text style={styles.sectionTitle}>{t('spotIssue')}</Text>
            <Image source={{ uri: capturedImage }} style={styles.previewImage} />

            {location && (
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }}
                        scrollEnabled={false}
                    >
                        <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
                    </MapView>
                </View>
            )}

            <View style={styles.buttonRow}>
                <CustomButton title={t('retake')} onPress={handleRetake} type="outline" style={{ flex: 1, marginRight: 10 }} />
                <CustomButton title={t('submit')} onPress={handleSubmit} style={{ flex: 1, marginLeft: 10 }} />
            </View>
        </ScrollView>
    );

    const renderProcessing = () => (
        <View style={COMMON_STYLES.container}>
            <View style={COMMON_STYLES.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={[styles.processingText, { marginTop: 20 }]}>{t('analyzing')}</Text>
            </View>
        </View>
    );

    const renderSuccess = () => (
        <View style={[COMMON_STYLES.container, COMMON_STYLES.center, { padding: 30 }]}>
            <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
            <Text style={styles.successTitle}>{t('issueSubmitted')}</Text>
            <CustomButton title="Back to Home" onPress={handleBackToHome} />
        </View>
    );

    const renderHome = () => (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            {/* Impact / Rewards Card */}
            <TouchableOpacity onPress={() => navigation.navigate('Rewards')}>
                <View style={[styles.rewardsCard, { backgroundColor: COLORS.primary }]}>
                    <View style={styles.rewardsContent}>
                        <View>
                            <Text style={styles.rewardsLabel}>{t('yourImpact')}</Text>
                            <Text style={styles.rewardsValue}>{points} {t('points')}</Text>
                            <Text style={styles.rewardsSub}>Keep it up, Citizen!</Text>
                        </View>
                        <View style={styles.trophyContainer}>
                            <Ionicons name="trophy" size={50} color={COLORS.warning} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Stunning Capture Section */}
            <Text style={styles.sectionHeader}>Quick Action</Text>
            <TouchableOpacity onPress={handleOpenCapture} activeOpacity={0.9}>
                <View style={styles.captureCard}>
                    <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
                    <View style={styles.captureIconContainer}>
                        <Ionicons name="camera" size={40} color={COLORS.white} />
                    </View>
                    <Text style={styles.captureTitle}>{t('spotIssue')}</Text>
                    <Text style={styles.captureDesc}>{t('captureDesc')}</Text>
                </View>
            </TouchableOpacity>

            {/* Recent Issues */}
            <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeader}>{t('recentSubmissions')}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Issues')}>
                    <Text style={styles.seeAllText}>{t('seeAll')}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.recentSection}>
                {recentIssues.length === 0 ? (
                    <Text style={styles.emptyText}>No submissions yet. Start spotting!</Text>
                ) : (
                    recentIssues.map(issue => (
                        <TouchableOpacity key={issue.id} onPress={() => navigation.navigate('IssueDetail', { issue })}>
                            <IssueCard issue={issue} />
                        </TouchableOpacity>
                    ))
                )}
            </View>
        </ScrollView>
    );

    return (
        <View style={COMMON_STYLES.container}>
            {/* Standard Header */}
            <Header showLocation={true} />

            {appState === 'HOME' && renderHome()}
            {appState === 'PREVIEW' && renderPreview()}
            {appState === 'PROCESSING' && renderProcessing()}
            {appState === 'SUCCESS' && renderSuccess()}

            {renderCamera()}
        </View>
    );
};

const styles = StyleSheet.create({
    // Rewards Card
    rewardsCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        ...SHADOWS.strong,
        overflow: 'hidden',
    },
    rewardsContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rewardsLabel: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
    },
    rewardsValue: {
        color: COLORS.white,
        fontSize: 36,
        fontWeight: 'bold',
    },
    rewardsSub: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    trophyContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Capture Card
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 15,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 10,
    },
    seeAllText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    captureCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.card,
        position: 'relative',
        overflow: 'hidden',
    },
    captureIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary, // Saffron
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        zIndex: 2,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
    pulseRing: {
        position: 'absolute',
        top: 20, // Adjust based on padding
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 153, 51, 0.2)', // Light Saffron
        zIndex: 1,
    },
    captureTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 5,
    },
    captureDesc: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
        paddingHorizontal: 20,
    },

    // Legacy / Other Styles
    recentSection: {
        marginBottom: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.textLight,
        marginTop: 20,
        fontStyle: 'italic',
    },

    // Camera Modal
    cameraOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        paddingBottom: 40,
        zIndex: 1, // Ensure it sits on top
    },
    cameraControls: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.white,
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
    },

    // Preview
    centerContent: {
        padding: 20,
        alignItems: 'center',
    },
    previewImage: {
        width: '100%',
        height: 300,
        borderRadius: 12,
        marginBottom: 20,
    },
    mapContainer: {
        width: '100%',
        height: 150,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
    },

    // Success
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: 20,
    },
    successDesc: {
        textAlign: 'center',
        color: COLORS.textLight,
        marginTop: 10,
        marginBottom: 30,
    },
    resultCard: {
        width: '100%',
        padding: 20,
        backgroundColor: '#f0f8ff',
        borderRadius: 12,
        marginBottom: 30,
    },
    resultLabel: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    resultValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 10,
    },
    pointsValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },

    processingText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.secondary
    },
    subText: {
        color: COLORS.textLight,
        marginTop: 5
    }

});

export default HomeScreen;
