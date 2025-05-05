import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { registerUser } from '../api/api';

export default function RegisterScreen({ navigation }) {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const res = await registerUser(mobile, password);
            Alert.alert('Success', res.data.message);
            navigation.goBack(); // back to login
        } catch (error) {
            console.error(error);
            Alert.alert('Registration Failed', error?.response?.data?.detail || 'Something went wrong');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register for TapCart</Text>
            <TextInput style={styles.input} placeholder="Mobile" value={mobile} onChangeText={setMobile} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="Register" onPress={handleRegister} color="#7D5FFF" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center'
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
        color: '#7D5FFF',
        fontWeight: 'bold'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: '#f9f9ff'
    }
});
