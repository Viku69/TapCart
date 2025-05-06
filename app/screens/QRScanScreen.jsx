import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProductByQR, addToCart } from '../api/api';

export default function QRScanScreen({ navigation }) {
  const { requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const [productData, setProductData] = useState(null);
  const hasScannedRef = useRef(false);

  useEffect(() => {
    requestPermission();
  }, []);

  const handleQRCodeScanned = async (qrValue) => {
    try {
      console.log("Scanning QR:", qrValue);
      const res = await getProductByQR(qrValue);
      setProductData(res.data); // Show product card
    } catch (error) {
      Alert.alert('Failed', 'Invalid QR code');
    } finally {
      hasScannedRef.current = true;
      setTimeout(() => {
        hasScannedRef.current = false;
      }, 3000);
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      const qrValue = codes[0]?.value;
      if (qrValue && !hasScannedRef.current) {
        hasScannedRef.current = true;
        handleQRCodeScanned(qrValue);
      }
    },
  });

  if (!device) {
    return (
      <View style={styles.centered}>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  const handleAddToCart = async () => {
    try {
      const userIdStr = await AsyncStorage.getItem('user_id');
      const user_id = parseInt(userIdStr || '0');
      await addToCart(user_id, productData.id, 1);

      Alert.alert('Added', `${productData.name} added to cart`, [
        // { text: 'OK', onPress: () => navigation.navigate('Cart') },
        {text : 'OK'}
        
      ]);

      setProductData(null); // reset card after adding
    } catch (err) {
      Alert.alert('Error', 'Could not add product');
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        codeScanner={codeScanner}
        isActive={true}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>Scan QR Code</Text>
      </View>

      {productData && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{productData.name}</Text>
          <Text style={styles.cardText}>Price: ₹{productData.price}</Text>
          <Text style={styles.cardText}>Description: {productData.description}</Text>

          <Text style={styles.button} onPress={handleAddToCart}>
            Add to Cart
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#4CAF50',
    color: 'white',
    textAlign: 'center',
    borderRadius: 6,
    fontWeight: 'bold',
  },
});
