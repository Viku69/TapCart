import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProductByQR, addToCart } from '../api/api';

export default function QRScanScreen({ navigation }) {
  const { requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const [latestScannedData, setLatestScannedData] = useState(null);
  const hasScannedRef = useRef(false); // ✅ useRef instead of state

  useEffect(() => {
    requestPermission();
  }, []);

  const handleQRCodeScanned = async (qrValue: string) => {
    try {
      console.log("entered to find and add");
      const userIdStr = await AsyncStorage.getItem('user_id');
      const user_id = parseInt(userIdStr || '0');

      const res = await getProductByQR(qrValue);
      await addToCart(user_id, res.data.id, 1);

      Alert.alert('Added', `${res.data.name} added to cart`, [
        { text: 'OK', onPress: () => navigation.navigate('Cart') },
      ]);
    } catch (error) {
      Alert.alert('Failed', 'Invalid QR code');
    } finally {
      hasScannedRef.current = true; // ✅ prevent further scans
      setTimeout(() => {
        hasScannedRef.current = false; // allow re-scanning after delay
      }, 3000);
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes: Code[]) => {
      const qrValue = codes[0]?.value;
      if (qrValue && !hasScannedRef.current) {
        hasScannedRef.current = true; // immediately block further scans
        setLatestScannedData(qrValue);
        console.log("Scanning:", qrValue);
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
      {latestScannedData && (
        <View>
          <Text style={styles.text}>{latestScannedData}</Text>
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
});
