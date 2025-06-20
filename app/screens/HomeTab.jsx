import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Import TabNavigator
import { getStores } from '../api/api'; // Your API to fetch stores
import QRScancreen from '../screens/QRScanScreen'
import CartScreen from '../screens/CartScreen'
import OrdersScreen from '../screens/OrdersScreen'
import AccountScreen from '../screens/AccountScreen';
import { StoreContext } from '../context/StoreContext';
import { Horse, Heart, Cube, House, Scan, Basket, User, ListChecks, Storefront, MapPin, ShoppingCart, ShoppingBag } from 'phosphor-react-native';

const Tab = createBottomTabNavigator();

function HomeScreen({ navigation }) {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const { selectedStoreId, changeStore } = useContext(StoreContext);


    useEffect(() => {
        (async () => {
            try {
                const res = await getStores();
                setStores(res.data);
                if (res.data.length > 0 && !selectedStoreId) {
                    changeStore(res.data[0].id); // set default if not set
                }
            } catch (err) {
                console.error('Error fetching stores', err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleStoreChange = (storeId) => {
        changeStore(storeId); // ✅ update context
    };


    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#7D5FFF" />
                <Text>Loading stores...</Text>
            </View>
        );
    }

    return (


        <View style={styles.container}>
            <Text style={styles.title}>👋 Welcome to TapCart</Text>
            <Text style={styles.subtitle}>
                Select your nearest store to start scanning and shopping seamlessly.
            </Text>

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedStoreId}
                    onValueChange={handleStoreChange}
                    style={styles.picker}
                    dropdownIconColor="#7D5FFF"
                >
                    {stores.map((store) => (
                        <Picker.Item key={store.id} label={store.name} value={store.id} />
                    ))}
                </Picker>
            </View>

            {selectedStoreId && (
                <View style={styles.storeInfo}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', gap:'10%' }}>
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Storefront color="#7D5FFF" weight="fill" size={32} />
                            <Text style={styles.storeInfoText}>
                                {stores.find(s => s.id === selectedStoreId)?.name}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <MapPin color="#7D5FFF" weight="fill" size={32} />
                            <Text style={styles.storeInfoText}>
                                {stores.find(s => s.id === selectedStoreId)?.location}
                            </Text>
                        </View>

                        </View>
                   
                </View>
            )}

            <View style={styles.infoBox}>
                <Text style={styles.infoHeader}>✨ What's New</Text>
                <Text style={styles.infoText}>
                    - Scan products quickly from your camera{'\n'}
                    - Seamless checkout experience{'\n'}
                    - Track your past orders anytime
                </Text>
            </View>
        </View>

    );
}

export default function HomeTabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#2D1066',
                    height: 80,
                    justifyContent: 'space-around'
                },
                tabBarLabel: () => null, // Hide labels
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabIconContainer}>
                            <House style={[styles.icon, { color: focused ? '#C9FF9A' : '#FFFFFF' }]} />
                            <Text style={[styles.label, { color: focused ? '#C9FF9A' : '#FFFFFF' }]}>Home</Text>
                        </View>
                    ),

                }}
            />
            <Tab.Screen
                name="Scan"
                component={QRScancreen} // Replace with your Scan component
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabIconContainer}>
                            <Scan style={[styles.icon, { color: focused ? '#C9FF9A' : '#FFFFFF' }]} />
                            <Text style={[styles.label, { color: focused ? '#C9FF9A' : '#FFFFFF' }]}>Scan</Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Cart"
                component={CartScreen} // Replace with your Cart component
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabIconContainer}>
                            <ShoppingCart style={[styles.icon, { color: focused ? '#C9FF9A' : '#FFFFFF' }]} />
                            <Text style={[styles.label, { color: focused ? '#C9FF9A' : '#FFFFFF' }]}>Cart</Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Orders"
                component={OrdersScreen} // Replace with your Orders component
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabIconContainer}>
                            <ShoppingBag style={[styles.icon, { color: focused ? '#C9FF9A' : '#FFFFFF' }]} />
                            <Text style={[styles.label, { color: focused ? '#C9FF9A' : '#FFFFFF' }]}>Orders</Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Account"
                component={AccountScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabIconContainer}>
                            <User style={[styles.icon, { color: focused ? '#C9FF9A' : '#FFFFFF' }]} />
                            <Text style={[styles.label, { color: focused ? '#C9FF9A' : '#FFFFFF' }]}>Account</Text>
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 30,
        paddingHorizontal: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#7D5FFF',
        textAlign: 'center',
        marginBottom: 10
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 15
    },
    pickerContainer: {
        backgroundColor: '#f3f0ff',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 30,
        paddingBottom: 5,
        paddingHorizontal: 10,
    },
    picker: {
        height: 70,
        width: '100%',
        color: '#333'
    },
    storeInfo: {
        backgroundColor: '#f0edff',
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center',
    },

    storeInfoText: {
        fontSize: 25,
        fontWeight: '600',
        color: '#2D1066',
    },

    infoBox: {
        backgroundColor: '#fff9ec',
        padding: 15,
        borderRadius: 10,
        elevation: 2,
    },

    infoHeader: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ff9f00',
        marginBottom: 5,
    },

    infoText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 22,
    },

    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 18,
        marginTop: 10
    },
    icon: {
        fontSize: 5,
    },
    label: {
        fontSize: 8,
        fontWeight: '600',
        marginTop: 2,
    },
});
