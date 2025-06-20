import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserMobile } from '../api/api'; // Your API to fetch mobile number
import { useFocusEffect } from '@react-navigation/native';
import {  Phone, Signature, SignOut, UserCircleDashed } from 'phosphor-react-native';

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
                <View style={{ flexDirection: 'row', alignItems: 'center',marginBottom:30, gap:'4%' }}>
                    <UserCircleDashed color="#7D5FFF" weight="fill" size={32} />
                    <Text style={styles.heading}>Account</Text>
                </View>

                <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 30, gap: '4%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap:'3%'}} >
                        <Phone color="#7D5FFF" weight="fill" size={32} />
                        <Text style={styles.label}>Mobile Number:</Text>
                    </View>
                    <View>
                        {
                            mobile ? (
                                <Text style={styles.mobile}>{mobile}</Text>
                            ) : (
                                <Text style={styles.mobile}>Loading...</Text>
                            )
                        }
                    </View>
                    
                </View>
               
                
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <View style={{flexDirection:'row' , alignItems:'center'}}>
                    <SignOut color="#FFFFFF" weight="fill" size={28} />
                    <Text style={styles.logoutText}> Logout</Text>
                </View>
               
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
        justifyContent: 'flex-start',
        alignItems:'flex-start'
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#7D5FFF',
    },
    label: {
        fontSize: 16,
        color: '#2D1066',
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
