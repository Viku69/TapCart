import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './app/screens/LoginScreen';
import HomeScreen from './app/screens/HomeTab';
import HomeTabNavigator from './app/screens/HomeTab';
import QRScanScreen from './app/screens/QRScanScreen';
import CartScreen from './app/screens/CartScreen';
import OrdersScreen from './app/screens/OrdersScreen';
import RegisterScreen from './app/screens/RegisterScreen';

import { StoreProvider } from './app/context/StoreContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
   <StoreProvider> 
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="HomeTab" component={HomeTabNavigator} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scan" component={QRScanScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </StoreProvider>
  );
}
