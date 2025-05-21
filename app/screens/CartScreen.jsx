import React, { useState, useContext } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, Alert,
    StyleSheet, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    getCart,
    checkout,
    updateCart,
    removeFromCart,
    getProductById
} from '../api/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { StoreContext } from '../context/StoreContext';
import { Invoice, ShoppingCart, Trash } from 'phosphor-react-native';

export default function CartScreen() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { selectedStoreId } = useContext(StoreContext);

    const navigation = useNavigation();

    const fetchCart = async () => {
        setLoading(true);
        const user_id = parseInt(await AsyncStorage.getItem("user_id"));
        const res = await getCart(user_id);

        const enrichedCart = await Promise.all(res.data.map(async (item) => {
            try {
                const productRes = await getProductById(item.product_id);
                const price = productRes.data.price;
                const name = productRes.data.name;
                return {
                    ...item,
                    name,
                    price,
                    total: price * item.quantity
                };
            } catch (error) {
                console.error(`Error fetching product ${item.product_id}`, error);
                return { ...item, name: 'Unknown', price: 0, total: 0 };
            }
        }));

        setCart(enrichedCart);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchCart();
        }, [])
    );

    const handleCheckout = async () => {
        const store_id = selectedStoreId;
        const user_id = parseInt(await AsyncStorage.getItem("user_id"));
        const res = await checkout(user_id, store_id);
        // Alert.alert('Success', `Order #${res.data.order_id} placed`);
        navigation.navigate("Invoice", { order_id: res.data.order_id });

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

    const getCartTotal = () => {
        return cart.reduce((sum, item) => sum + item.total, 0);
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.productText}>{item.name}</Text>
            <Text style={styles.productText}>₹{item.price} x {item.quantity} = ₹{item.total}</Text>
            <View style={styles.controls}>
                <TouchableOpacity onPress={() => updateQuantity(item.product_id, item.quantity - 1)} style={styles.btn}>
                    <Text style={styles.btnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qty}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.product_id, item.quantity + 1)} style={styles.btn}>
                    <Text style={styles.btnText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRemove(item.product_id)} style={styles.deleteBtn}>
                    <Trash color="red" weight="fill" size={28} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '4%', marginBottom: 20, }}>
                <ShoppingCart color="#7D5FFF" weight="fill" size={32} />
                <Text style={styles.heading}>My Cart</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#5e3ea1" style={{ marginTop: 30 }} />
            ) : (
                <>
                    <FlatList
                        data={cart}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        ListEmptyComponent={<Text style={styles.empty}>Your cart is empty</Text>}
                    />

                    {cart.length > 0 && (
                        <View style={{ marginTop: 10, alignItems: 'flex-end' }}>
                            <Text style={[styles.productText, { fontSize: 18, fontWeight: 'bold' }]}>
                                Total: ₹{getCartTotal()}
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.checkoutBtn, cart.length === 0 && { backgroundColor: '#ccc' }]}
                        onPress={handleCheckout}
                        disabled={cart.length === 0}
                    >
                        <Text style={styles.checkoutText}>Checkout</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f0ff',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
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
