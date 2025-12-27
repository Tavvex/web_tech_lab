// [file name]: config.js
const CONFIG = {
    API_URL: 'https://edu.std-900.ist.mospolytech.ru', // Базовый URL API
    API_KEY: '41fad94b-b5f7-40bf-b968-52a26cd52041',
    ENDPOINTS: {
        DISHES: '/labs/api/dishes',
        ORDERS: '/labs/api/orders'
    }
};

// Функция для добавления API ключа к запросу
function addApiKey(url) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}api_key=${CONFIG.API_KEY}`;
}

// Функция для создания полного URL
function getApiUrl(endpoint) {
    return CONFIG.API_URL + endpoint;
}