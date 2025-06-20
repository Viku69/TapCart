import React, { useEffect, useState  , useContext} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOrders } from '../api/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { StoreContext } from '../context/StoreContext';
import { Package, UserCircleDashed } from 'phosphor-react-native';

export default function OrdersScreen() {
    const [orders, setOrders] = useState([]);
    const navigation = useNavigation();

    const fetchOrders = async () => {
        const user_id = parseInt(await AsyncStorage.getItem("user_id"));
        const res = await getOrders(user_id);
        setOrders(res.data);
    };

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [])
    );

    const handlePress = (order_id) => {
        navigation.navigate("Invoice", { order_id }); // Navigate to InvoiceScreen
    };

    const renderOrder = ({ item }) => (
        <TouchableOpacity onPress={() => handlePress(item.order_id)} style={styles.orderCard}>
            <Text style={styles.orderDate}>Placed on: {new Date(item.created_at).toLocaleDateString()}</Text>
            <Text style={styles.orderTitle}>Order #{item.order_id}</Text>
            <Text style={styles.orderAmount}>Total: ₹{item.total_amount}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '5%', marginBottom: 20, }}>
                <Package color="#7D5FFF" weight="fill" size={32} />
                <Text style={styles.header}>My Orders</Text>
            </View>
            <FlatList
                data={orders}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderOrder}
                contentContainerStyle={orders.length === 0 && styles.emptyContainer}
                ListEmptyComponent={<Text style={styles.empty}>No orders yet</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2D1066',
        textAlign: 'center',
    },
    orderCard: {
        backgroundColor: '#F3EDFF',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
    },
    orderTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D1066',
    },
    orderAmount: {
        fontSize: 16,
        color: '#4B3B84',
        marginTop: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    empty: {
        textAlign: 'center',
        fontSize: 16,
        color: '#999',
    },
});
