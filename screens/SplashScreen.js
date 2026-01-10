import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS } from '../styles/theme';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.subtitle}>Swachh Bharat Mission Initiative</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 250,
        height: 150,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.secondary,
        fontWeight: '600',
        marginTop: 10,
        letterSpacing: 1,
    },
});

export default SplashScreen;
