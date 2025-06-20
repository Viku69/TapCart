import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { getOrderItems } from '../api/api';
import Barcode from 'react-native-barcode-svg';
import QRCode from 'react-native-qrcode-svg';
import { Invoice, Package } from 'phosphor-react-native';

export default function InvoiceScreen({ route }) {
    const { order_id } = route.params;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrderItems = async () => {
        try {
            const res = await getOrderItems(order_id);
            setItems(res.data);
        } catch (error) {
            console.error('Failed to fetch order items:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderItems();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.productText}>{item.name}</Text>
            <Text style={styles.productText}>Price: ₹{item.price}</Text>
            <Text style={styles.productText}>Qty: {item.quantity}</Text>
            <Text style={styles.productText}>Total: ₹{item.total}</Text>
        </View>
    );

    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    const cleanOrderId = order_id.replace(/-/g, '');

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '4%', marginBottom: 20, }}>
                <Invoice color="#7D5FFF" weight="fill" size={32} />
                <Text style={styles.heading}>Invoice</Text>
            </View>
           
            {loading ? (
                <ActivityIndicator size="large" color="#7a5fed" />
            ) : (
                <>
                    <FlatList
                        data={items}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                    />

                    <View style={{ alignItems: 'center', marginTop: 30 }}>
                        <Text style={{ fontSize: 16, marginBottom: 10, color: '#5e3ea1' }}>
                            Scan this QR at the exit
                        </Text>
                        <QRCode value={order_id} size={100} />
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.totalLabel}>Total Amount:</Text>
                        <Text style={styles.totalValue}>₹{totalAmount}</Text>
                    </View>
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
        marginBottom: 4,
    },
    footer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#5e3ea1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5e3ea1',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5e3ea1',
    },
});
