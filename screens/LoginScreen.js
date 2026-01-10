import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { COLORS, COMMON_STYLES, SIZES } from '../styles/theme';
import CustomButton from '../components/CustomButton';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = ({ navigation }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState(''); // Serves as Mobile or Email
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateInput = () => {
        setError('');

        // Name Validation (Signup only)
        if (!isLogin) {
            if (!name.trim()) return "Full Name is required.";
            if (name.length < 3) return "Name must be at least 3 characters.";
        }

        // Mobile/Email Validation
        if (!email.trim()) return "Mobile Number or Email is required.";

        // Simple Regex for Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Simple Regex for 10-digit Mobile
        const mobileRegex = /^[0-9]{10}$/;

        if (!emailRegex.test(email) && !mobileRegex.test(email)) {
            return "Please enter a valid Email or 10-digit Mobile Number.";
        }

        return null;
    };

    const handleAuth = async () => {
        const validationError = validateInput();
        if (validationError) {
            setError(validationError); // Show inline error
            Alert.alert("Invalid Input", validationError);
            return;
        }

        setLoading(true);

        try {
            // Mock Auth & Location Permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required to detect your city.');
                setLoading(false);
                return;
            }

            // Fetch current location for "first login" simulation
            await Location.getCurrentPositionAsync({});

            // Mock delay
            setTimeout(() => {
                setLoading(false);
                navigation.replace('MainApp', {
                    user: { name: name || 'Citizen', email }
                });
            }, 1500);

        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };

    const handleGoogleLogin = async () => {
        // In a real app, use response = await promptAsync();
        // Here we mock the success for the demo as requested, 
        // assuming the user clicked the button and auth succeeded in the browser popup
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigation.replace('MainApp', {
                user: { name: 'Google User', email: 'user@gmail.com' }
            });
        }, 1500);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={COMMON_STYLES.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                    {/* Header Section */}
                    <View style={styles.header}>
                        {/* Placeholder for Logo - In real app, replace text logo with real Image */}
                        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
                        {/* <View style={styles.logoContainer}>
                            <Ionicons name="location" size={60} color={COLORS.primary} />
                            <Text style={styles.logoText}>SpotIt</Text>
                        </View> */}

                        <Text style={styles.title}>{isLogin ? 'Welcome Back!' : 'Join the Mission'}</Text>
                        <Text style={styles.subtitle}>
                            {isLogin ? 'Sign in to make your city cleaner.' : 'Register to start reporting issues.'}
                        </Text>
                    </View>

                    {/* Form Section */}
                    <View style={styles.cardForm}>
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        {!isLogin && (
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name"
                                    placeholderTextColor="#999"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        )}

                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Mobile Number or Email"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <CustomButton
                            title={isLogin ? 'Login' : 'create Account'}
                            onPress={handleAuth}
                            loading={loading}
                            style={styles.authButton}
                        />

                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin} activeOpacity={0.8}>
                            {loading && isLogin === 'GOOGLE' ? (
                                <ActivityIndicator color={COLORS.text} />
                            ) : (
                                <>
                                    <Ionicons name="logo-google" size={24} color={COLORS.danger} style={{ marginRight: 10 }} />
                                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <View style={styles.toggleContainer}>
                            <Text style={styles.toggleText}>
                                {isLogin ? "New to SpotIt? " : 'Already a Citizen? '}
                            </Text>
                            <TouchableOpacity onPress={() => { setError(''); setIsLogin(!isLogin); }}>
                                <Text style={styles.toggleLink}>
                                    {isLogin ? 'Sign Up' : 'Login'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Footer decoration */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Swachh Bharat Mission Initiative</Text>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginTop: -5,
        // Use a nice font family if available
    },
    logo: {
        width: 150,
        height: 150, // Adjusted size
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        color: COLORS.text,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    cardForm: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        ...COMMON_STYLES.shadow, // Use the new card shadow
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: 12,
        marginBottom: 15,
        paddingHorizontal: 15,
        height: 55,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        height: '100%',
    },
    authButton: {
        marginTop: 10,
        marginBottom: 20,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },
    dividerText: {
        marginHorizontal: 10,
        color: COLORS.textLight,
        fontSize: 12,
        fontWeight: '600',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        height: 55,
        borderRadius: 27.5,
        marginBottom: 20,
    },
    googleButtonText: {
        color: COLORS.text, // Navy text
        fontWeight: '600',
        fontSize: 16,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    toggleText: {
        color: COLORS.textLight,
        fontSize: 15,
    },
    toggleLink: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 15,
    },
    errorText: {
        color: COLORS.danger,
        textAlign: 'center',
        marginBottom: 15,
        fontWeight: '500',
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    footerText: {
        color: COLORS.textLight,
        fontSize: 12,
        opacity: 0.6,
    }
});

export default LoginScreen;
