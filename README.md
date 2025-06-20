# 🛍️ TapCart - React Native App

**TapCart** is a mobile self-checkout app allowing users to scan products via QR codes, add items to a cart, and place orders at physical stores. This React Native app is built to work with a FastAPI backend and uses Context API for state management.

---

## 📱 Features

- 🔐 Mobile number login with OTP verification
- 🏬 Store selection screen (persisted using Context API)
- 📷 QR code scanning via mobile camera
- 🛒 Cart management with add/remove functionality
- ✅ Place order and receive invoice screen
- 📜 View past order history
- ⚙️ Seamless integration with FastAPI backend

---

## 🧱 Folder Structure

```
.
├── api/                   # API service functions (axios requests)
├── context/               # Context for managing global state (e.g. store ID)
├── screens/               # All app screens
│   ├── LoginScreen.js
│   ├── OtpScreen.js
│   ├── HomeScreen.js
│   ├── QRScannerScreen.js
│   ├── CartScreen.js
│   ├── InvoiceScreen.js
│   ├── OrderHistoryScreen.js
├── App.js                 # Main app entry point
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/tapcart-app.git
cd tapcart-app
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Install iOS/Android dependencies (if needed)
```bash
npx pod-install    # For iOS
npx react-native run-android   # For Android
```

### 4. Start the app
```bash
npx react-native start
```

---

## 🔧 Configuration

Make sure your backend FastAPI URL is set correctly in your `api/` service functions, e.g.:

```js
const BASE_URL = "http://<your-fastapi-ip>:8000";
```

For QR scanning, ensure camera permissions are handled and `react-native-vision-camera` is installed and linked:

```bash
npm install react-native-vision-camera
```

Follow platform-specific setup:  
[https://mrousavy.com/react-native-vision-camera/docs](https://mrousavy.com/react-native-vision-camera/docs)

---

## 📸 QR Code Scanning

The app uses `react-native-vision-camera` for scanning product QR codes. Once scanned, the product is fetched from the backend and added to the cart.

---

## 📦 Dependencies

- React Native CLI
- React Navigation
- Axios
- Context API
- react-native-vision-camera
- react-native-vector-icons
- react-native-barcode-svg
- react-native-qrcode-svg
- phosphor-react-native

---

## 📝 Screens Overview

| Screen              | Purpose                                  |
|---------------------|------------------------------------------|
| LoginScreen         | Login via mobile/password                |
| OtpScreen           | Verify OTP                               |
| HomeScreen          | Choose store and navigate                |
| QRScanScreen        | Scan products using QR code              |
| CartScreen          | View/edit cart and checkout              |
| InvoiceScreen       | View ordered items post-checkout         |
| OrdersScreen        | List of past orders                      |

---


