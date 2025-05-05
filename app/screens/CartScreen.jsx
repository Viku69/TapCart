
import React, { useEffect, useState , useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCart, checkout, updateCart, removeFromCart } from '../api/api';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function CartScreen() {
    const [cart, setCart] = useState([]);

    const fetchCart = async () => {
        const user_id = parseInt(await AsyncStorage.getItem("user_id"));
        const res = await getCart(user_id);
        setCart(res.data);
    };

   
     // 🔥 This runs every time CartScreen is focused
    useFocusEffect(
        useCallback(() => {
            fetchCart();
        }, [])
    );

 
    const { selectedStoreId } = useContext(StoreContext); // ✅ fetch it here

   console.log('Selected Store ID:', selectedStoreId); // use it anywhere


    const handleCheckout = async () => {
        const store_id = selectedStoreId;
        const user_id = parseInt(await AsyncStorage.getItem("user_id"));
        const res = await checkout(user_id , store_id);
        Alert.alert('Success', `Order #${res.data.order_id} placed`);
        fetchCart();
    };

    const updateQuantity = async (product_id, newQty) => {
        const user_id = parseInt(await AsyncStorage.getItem("user_id"));
        if (newQty <= 0) {
            await removeFromCart(user_id, product_id);
        } else {
            await updateCart(user_id, product_id, newQty);
        }
        fetchCart();
    };

    const handleRemove = async (product_id) => {
        const user_id = parseInt(await AsyncStorage.getItem("user_id"));
        await removeFromCart(user_id, product_id);
        fetchCart();
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.productText}>Product {item.product_id}</Text>
             <Text style={styles.productText}>Product {item.name}</Text>
            <View style={styles.controls}>
                <TouchableOpacity onPress={() => updateQuantity(item.product_id, item.quantity - 1)} style={styles.btn}>
                    <Text style={styles.btnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qty}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.product_id, item.quantity + 1)} style={styles.btn}>
                    <Text style={styles.btnText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRemove(item.product_id)} style={styles.deleteBtn}>
                    <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>🛒 Your Cart</Text>
            <FlatList
                data={cart}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.empty}>Your cart is empty</Text>}
            />
            <TouchableOpacity 
                style={[styles.checkoutBtn, cart.length === 0 && { backgroundColor: '#ccc' }]} 
                onPress={handleCheckout} 
                disabled={cart.length === 0}
            >
                <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f0ff', // Light violet background
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#5e3ea1',
        textAlign: 'center',
    },
    itemContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        shadowColor: '#5e3ea1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    productText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    btn: {
        backgroundColor: '#e0d4fc',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    btnText: {
        fontSize: 18,
        color: '#5e3ea1',
    },
    qty: {
        fontSize: 16,
        marginHorizontal: 10,
        color: '#5e3ea1',
        fontWeight: 'bold',
    },
    deleteBtn: {
        marginLeft: 15,
    },
    deleteText: {
        fontSize: 18,
        color: 'red',
    },
    checkoutBtn: {
        backgroundColor: '#7a5fed',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    checkoutText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    empty: {
        textAlign: 'center',
        fontSize: 16,
        color: '#777',
        marginTop: 50,
    },
});
