import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { COLORS, COMMON_STYLES } from '../styles/theme';
import CustomButton from '../components/CustomButton';
import { useMockContext } from '../utils/MockContext';

const EditProfileScreen = ({ navigation }) => {
    const { user, login } = useMockContext();
    const [name, setName] = useState(user?.name || '');
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            login({ ...user, name });
            setLoading(false);
            Alert.alert("Success", "Profile Updated Successfully");
            navigation.goBack();
        }, 1000);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter full name"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Email (Read Only)</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: '#f0f0f0', color: '#999' }]}
                    value={user?.email || 'user@example.com'}
                    editable={false}
                />
            </View>

            <CustomButton title="Save Changes" onPress={handleSave} loading={loading} />
            <CustomButton title="Cancel" onPress={() => navigation.goBack()} type="outline" />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: COLORS.white,
    }
});

export default EditProfileScreen;
