import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
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
            <View style={styles.innerContainer}>
                <Image
                    source={require('../assets/images/Tap.png')}
                    style={styles.image}
                    resizeMode="contain"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Mobile"
                    keyboardType="numeric"
                    value={mobile}
                    onChangeText={setMobile}
                    placeholderTextColor="#7D5FFF"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#7D5FFF"
                />

                <Button title="Register" onPress={handleRegister} color="#7D5FFF" />


            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        width: '85%',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 1,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f9f9ff',
        padding: 12,
        marginBottom: 15,
        borderRadius: 10,
        color: '#7D5FFF',
    },
    link: {
        color: '#7D5FFF',
        textAlign: 'center',
        marginTop: 20,
        fontWeight: '500',
    },
});
