import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserMobile } from '../api/api'; // Your API to fetch mobile number
import { useFocusEffect } from '@react-navigation/native';

export default function AccountScreen({ navigation }) {
    const [mobile, setMobile] = useState('');



    const fetchMobile = async () => {
        const user_id = await AsyncStorage.getItem('user_id');
        if (user_id) {
            try {
                // Parse the user_id to integer
                const res = await getUserMobile(parseInt(user_id, 10));  // Await is now valid
                console.log('Fetched user mobile:', res.data);          // Axios response has `data`
                setMobile(res.data?.mobile);    
            } catch (err) {
                console.error('Failed to fetch mobile:', err);
                setMobile('errUnavailable');
            }
        } else {
            setMobile('noUnavailable');
        }
    };

    // Fetch mobile on focus of the screen
    useFocusEffect(
        useCallback(() => {
            fetchMobile();
        }, [])
    );

    // Logout handler
    const logout = async () => {
        await AsyncStorage.clear(); // Clear AsyncStorage on logout
        Alert.alert('Logged out', 'You have been logged out.', [
            {
                text: 'OK',
                onPress: () => navigation.replace('Login'), // Navigate to SignIn screen
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.heading}>👤 Account</Text>
                <Text style={styles.label}>Mobile Number:</Text>
                {
                    mobile ? (
                        <Text style={styles.mobile}>{mobile}</Text>
                    ) : (
                        <Text style={styles.mobile}>Loading...</Text>
                    )
                }
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutText}>🚪 Logout</Text>
            </TouchableOpacity>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'space-between',  // Important
    },
    content: {
        flex: 1,
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2D1066',
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        color: '#555',
    },
    mobile: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 40,
    },
    logoutButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    logoutText: {
        color: '#fff',
        fontSize: 18,
    },
});
