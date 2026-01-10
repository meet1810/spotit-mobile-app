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
import { login as apiLogin, register as apiRegister } from '../utils/api';
import { useMockContext } from '../utils/MockContext';

const LoginScreen = ({ navigation }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState(''); // Serves as Mobile or Email identifier
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useMockContext();

    const validateInput = () => {
        setError('');

        // Name Validation (Signup only)
        if (!isLogin) {
            if (!name.trim()) return "Full Name is required.";
        }

        // Mobile/Email Validation
        if (!email.trim()) return "Email is required.";
        if (isLogin && !password.trim()) return "Password is required.";
        if (!isLogin && !password.trim()) return "Password is required.";

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
            // Location Permission (keep existing flow)
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                // Alert.alert('Permission Denied', 'Location permission is required.');
            }

            if (isLogin) {
                // LOGIN
                const response = await apiLogin(email, password); // email state holds the input (email or phone)
                console.log('Login Success:', response);

                if (response.success) {
                    await login(response.user, response.token);
                    navigation.replace('MainApp');
                } else {
                    throw new Error(response.message || 'Login failed');
                }
            } else {
                // REGISTER
                // Swagger expects: { name, email, phone, password }
                // UI has Name, Email/Phone. I need to parse or ask for both.
                // Assuming Email input is Email. I'll add a separate Phone input or just send one.
                // For now, I'll send email as email and phone.
                const signupData = {
                    name,
                    email: email.includes('@') ? email : '',
                    password
                };

                // If the user entered only one contact method, the other might be missing.
                // The API might require both? Swagger said "Register a new user with email OR phone".
                // I will send both keys, one might be empty.
                const response = await apiRegister(signupData);
                console.log('Register Success:', response);
                Alert.alert("Success", "Account created! Please login.");
                setIsLogin(true); // Switch to login
            }

        } catch (error) {
            console.log('Auth Error:', error);
            setError(typeof error === 'string' ? error : (error.message || 'Authentication failed'));
            Alert.alert('Error', typeof error === 'string' ? error : (error.message || 'Authentication failed'));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        // Mock Google Login
        setLoading(true);
        setTimeout(async () => {
            setLoading(false);
            const mockUser = { name: 'Google User', email: 'user@gmail.com', u_id: 'g_123' };
            await login(mockUser, 'mock_token');
            navigation.replace('MainApp');
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
                                placeholder="Email"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#999"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
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
