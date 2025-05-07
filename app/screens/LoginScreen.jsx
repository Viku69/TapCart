import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../api/api';

export default function LoginScreen({ navigation }) {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const res = await login(mobile, password);
            await AsyncStorage.setItem('user_id', res.data.user_id.toString());
            navigation.replace('Home');
        } catch (error) {
            console.error('Login failed:', error.message || error);

            if (error.response) {
                Alert.alert('Login failed', error.response.data.message || 'Invalid credentials');
            } else if (error.request) {
                Alert.alert('Login failed', 'Network error. Please check your internet connection.');
            } else {
                Alert.alert('Login failed', 'An unexpected error occurred. Please try again.');
            }
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
                    placeholderTextColor = "#7D5FFF" 
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#7D5FFF" 
                />

                <Button title="Login" onPress={handleLogin} color="#7D5FFF" />

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.link}>Don't have an account? Register here</Text>
                </TouchableOpacity>
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

