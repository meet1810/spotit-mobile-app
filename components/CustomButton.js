import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../styles/theme';

const CustomButton = ({ title, onPress, type = 'primary', loading = false, style, textStyle }) => {
    const getBackgroundColor = () => {
        switch (type) {
            case 'secondary':
                return COLORS.secondary;
            case 'outline':
                return 'transparent';
            case 'danger':
                return COLORS.danger;
            default:
                return COLORS.primary;
        }
    };

    const getTextColor = () => {
        if (type === 'outline') return COLORS.primary;
        return COLORS.white;
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor(), borderColor: type === 'outline' ? COLORS.primary : 'transparent', borderWidth: type === 'outline' ? 1 : 0 },
                style,
            ]}
            onPress={onPress}
            disabled={loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 10,
        width: '100%',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CustomButton;
