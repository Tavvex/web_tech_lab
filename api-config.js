// [file name]: api-config.js
const API_CONFIG = {
    BASE_URL: 'https://edu.std-900.ist.mospolytech.ru',
    // BASE_URL: 'http://lab8-api.std-900.ist.mospolytech.ru', // Для Московского Политеха
    API_KEY: '41fad94b-b5f7-40bf-b968-52a26cd52041', // Замените на ваш ключ API
    ENDPOINTS: {
        DISHES: '/labs/api/dishes',
        ORDERS: '/labs/api/orders'
    }
};

// Функция для получения URL с API ключом
function getApiUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}${endpoint}?api_key=${API_CONFIG.API_KEY}`;
}

// Общие функции для работы с API
async function makeApiRequest(url, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Accept': 'application/json'
        }
    };

    if (data) {
        if (data instanceof FormData) {
            options.body = data;
        } else {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data);
        }
    }

    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Функция для получения данных о блюдах
async function getDishes() {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.DISHES);
    return await makeApiRequest(url);
}

// Функция для получения заказов
async function getOrders() {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.ORDERS);
    return await makeApiRequest(url);
}

// Функция для получения конкретного заказа
async function getOrder(orderId) {
    const url = getApiUrl(`${API_CONFIG.ENDPOINTS.ORDERS}/${orderId}`);
    return await makeApiRequest(url);
}

// Функция для создания заказа
async function createOrder(orderData) {
    const url = getApiUrl(API_CONFIG.ENDPOINTS.ORDERS);
    return await makeApiRequest(url, 'POST', orderData);
}

// Функция для обновления заказа
async function updateOrder(orderId, orderData) {
    const url = getApiUrl(`${API_CONFIG.ENDPOINTS.ORDERS}/${orderId}`);
    return await makeApiRequest(url, 'PUT', orderData);
}

// Функция для удаления заказа
async function deleteOrder(orderId) {
    const url = getApiUrl(`${API_CONFIG.ENDPOINTS.ORDERS}/${orderId}`);
    return await makeApiRequest(url, 'DELETE');
}