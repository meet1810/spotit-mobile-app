import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity, Linking, Platform } from 'react-native';
import { COLORS, COMMON_STYLES, SHADOWS, SIZES } from '../styles/theme';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import { useLanguage } from '../utils/LanguageContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const IssueDetailScreen = ({ route, navigation }) => {
    const { issue } = route.params;
    const { t } = useLanguage();

    // Configurable Coordinates (fallback to Delhi if missing in legacy mocks)
    const lat = issue.coordinates?.latitude || 28.6139;
    const long = issue.coordinates?.longitude || 77.2090;

    const openMaps = () => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${long}`;
        const label = 'Issue Location';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url);
    };

    // Timeline Data (Enhanced)
    const timeline = [
        { title: t('issueSubmitted'), time: issue.timestamp, done: true, desc: 'Your report was received.' },
        { title: 'AI Analysis Complete', time: issue.timestamp + 3000, done: true, desc: 'Identified as ' + issue.category },
        { title: 'Assigned to Municipality', time: null, done: issue.status === 'Resolved', desc: 'Sanitation team notified.' },
        { title: 'Cleaned & Verified', time: null, done: issue.status === 'Resolved', desc: 'Area is now clean.' },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
            {/* <Header title={t('issueDetail')} /> */}

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Hero Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: issue.imageUri }} style={styles.image} resizeMode="cover" />
                    <View style={styles.imageOverlay} />
                    <View style={styles.overlayTextContainer}>
                        <View style={[styles.statusBadge, { backgroundColor: issue.status === 'Resolved' ? COLORS.success : COLORS.primary }]}>
                            <Text style={styles.statusText}>{issue.status}</Text>
                        </View>
                        <Text style={styles.categoryTitle}>{issue.category}</Text>
                        <Text style={styles.dateText}>{new Date(issue.timestamp).toDateString()}</Text>
                    </View>
                </View>

                {/* Content Body */}
                <View style={styles.content}>

                    {/* Location Card with Map */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="location" size={20} color={COLORS.primary} />
                            <Text style={styles.cardTitle}>{t('location')}</Text>
                        </View>
                        <Text style={styles.locationText}>{issue.locationText || "Location Details Unavailable"}</Text>

                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: lat,
                                    longitude: long,
                                    latitudeDelta: 0.005,
                                    longitudeDelta: 0.005,
                                }}
                                scrollEnabled={false}
                                pitchEnabled={false}
                                rotateEnabled={false}
                                zoomEnabled={false}
                            >
                                <Marker coordinate={{ latitude: lat, longitude: long }} />
                            </MapView>
                            <TouchableOpacity style={styles.openMapBtn} onPress={openMaps}>
                                <Text style={styles.openMapText}>{t('openMaps')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Enhanced Timeline */}
                    <Text style={styles.sectionTitle}>{t('timeline')}</Text>
                    <View style={styles.timeline}>
                        {timeline.map((item, index) => (
                            <View key={index} style={styles.timelineItem}>
                                <View style={styles.timelineLeft}>
                                    <View style={[styles.dot, {
                                        backgroundColor: item.done ? COLORS.success : '#e0e0e0',
                                        // "Green line" effect
                                        borderWidth: item.done ? 0 : 0,
                                        width: item.done ? 20 : 16,
                                        height: item.done ? 20 : 16,
                                        borderRadius: 10,
                                        marginLeft: item.done ? -2 : 0
                                    }]} />
                                    {index !== timeline.length - 1 && (
                                        <View style={[styles.line, {
                                            backgroundColor: item.done ? COLORS.success : '#e0e0e0',
                                            width: 3
                                        }]} />
                                    )}
                                </View>
                                <View style={styles.timelineContent}>
                                    <Text style={[styles.timelineTitle, { color: item.done ? COLORS.text : '#aaa' }]}>{item.title}</Text>
                                    <Text style={styles.timelineDesc}>{item.desc}</Text>
                                    {item.time && <Text style={styles.timelineTime}>{new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>}
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Action Buttons */}
                    {/* <View style={styles.actionRow}>
                        <CustomButton title={t('shareUpdate')} onPress={() => { }} style={{ flex: 1, marginRight: 10 }} />
                        <CustomButton title={t('certificate')} onPress={() => { }} type="outline" style={{ flex: 1, marginLeft: 10 }} />
                    </View> */}

                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: '100%',
        height: 250,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    backButton: {
        position: 'absolute',
        top: 50, // Safe Area rough approx
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)', // Gradient effect
        paddingBottom: 20,
    },
    overlayTextContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        paddingBottom: 20,
    },
    categoryTitle: {
        color: COLORS.white,
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    dateText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 10,
    },
    statusText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 12,
        textTransform: 'uppercase',
    },

    content: {
        padding: 20,
        marginTop: -20, // Overlap effect
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },

    // Card
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 15,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#eee',
        ...SHADOWS.card,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginLeft: 8,
    },
    locationText: {
        color: COLORS.textLight,
        marginBottom: 15,
        lineHeight: 20,
    },
    mapContainer: {
        height: 150,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    map: {
        flex: 1,
    },
    openMapBtn: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: COLORS.white,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        ...SHADOWS.light,
    },
    openMapText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.primary,
    },

    // Timeline
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 20,
    },
    timeline: {
        marginBottom: 30,
        paddingLeft: 10
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 0, // Handled by height of content
        minHeight: 80,
    },
    timelineLeft: {
        alignItems: 'center',
        marginRight: 20,
        width: 25,
    },
    line: {
        flex: 1,
        backgroundColor: '#eee',
        marginTop: -2,  // connection
        marginBottom: -2
    },
    timelineContent: {
        flex: 1,
        paddingBottom: 25,
        justifyContent: 'flex-start'
    },
    timelineTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
    },
    timelineDesc: {
        fontSize: 13,
        color: COLORS.textLight,
        marginBottom: 5,
        lineHeight: 18
    },
    timelineTime: {
        fontSize: 11,
        color: '#999',
        fontWeight: '600'
    },

    actionRow: {
        flexDirection: 'row',
    }
});

export default IssueDetailScreen;
