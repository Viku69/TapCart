import axios from 'axios';

const API = axios.create({
    baseURL: 'https://61b1-103-214-60-19.ngrok-free.app',
});

export const registerUser = (mobile, password) =>
    API.post('/register', { mobile, password });

export const login = (mobile, password) => API.post('/token', { mobile, password });
export const getStores = () => API.get('/stores'); // optional for dynamic store list
export const getProductByQR = (qr) => API.get(`/products/qr/${qr}`);
export const addToCart = (user_id, product_id, quantity) =>
    API.post('/cart/add', { user_id, product_id, quantity });
export const getCart = (user_id) => API.get(`/cart/${user_id}`);
export const checkout = (user_id, store_id) => API.post('/order/checkout', null, { params: { user_id , store_id } });
export const getOrders = (user_id) => API.get(`/orders/${user_id}`);
export const updateCart = (user_id, product_id, quantity) =>
    API.put('/cart/update', { user_id, product_id, quantity });

export const removeFromCart = (user_id, product_id) =>
    API.delete('/cart/remove', { params: { user_id, product_id } });

export const getProductById = (product_id) =>
    API.get(`/products/${product_id}`);

export const getOrderItems = (order_id) =>
    API.get(`/order/${order_id}/items`);

export const getUserMobile = (user_id) => 
    API.get(`/user/${user_id}`);
