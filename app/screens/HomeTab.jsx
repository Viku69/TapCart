import React, { useEffect, useState , useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Import TabNavigator
import { getStores } from '../api/api'; // Your API to fetch stores
import QRScancreen from '../screens/QRScanScreen'
import CartScreen from '../screens/CartScreen'
import OrdersScreen from '../screens/OrdersScreen'
import { StoreContext } from '../context/StoreContext'; 

const Tab = createBottomTabNavigator();

function HomeScreen({ navigation }) {
    const [stores, setStores] = useState([]);
    // const [selectedStore, setSelectedStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const { selectedStoreId, changeStore } = useContext(StoreContext); 

    // useEffect(() => {
    //     (async () => {
    //         try {
    //             const res = await getStores();
    //             setStores(res.data);
    //             if (res.data.length > 0) {
    //                 setSelectedStore(res.data[0].id);
    //                 await AsyncStorage.setItem('store_id', String(res.data[0].id));
    //             }
    //         } catch (err) {
    //             console.error('Error fetching stores', err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     })();
    // }, []);

    // const handleStoreChange = async (storeId) => {
    //     setSelectedStore(storeId);
    //     await AsyncStorage.setItem('store_id', String(storeId));
    // };


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
            <Text style={styles.title}>TapCart</Text>
            <Text style={styles.subtitle}>Select Store</Text>
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
              <Text style={[styles.icon, { color: focused ? '#C9FF9A' : '#FFFFFF' }]}>🏠</Text>
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
              <Text style={[styles.icon, { color: focused ? '#C9FF9A' : '#FFFFFF' }]}>📷</Text>
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
              <Text style={[styles.icon, { color: focused ? '#C9FF9A' : '#FFFFFF' }]}>🛒</Text>
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
              <Text style={[styles.icon, { color: focused ? '#C9FF9A' : '#FFFFFF' }]}>📦</Text>
              <Text style={[styles.label, { color: focused ? '#C9FF9A' : '#FFFFFF' }]}>Orders</Text>
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
        paddingBottom:5,
        paddingHorizontal:10,
    },
    picker: {
        height: 70,
        width: '100%',
        color: '#333'
    },
    tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:18
  },
  icon: {
    fontSize: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
