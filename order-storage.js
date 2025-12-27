// [file name]: order-storage.js
// Простое хранение заказов в localStorage для тестирования

const ORDERS_STORAGE_KEY = 'businessLunchOrders';

// Сохранение заказа
function saveOrderToStorage(orderData) {
    try {
        // Загружаем существующие заказы
        const existingOrders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
        
        // Генерируем ID для нового заказа
        const newOrder = {
            id: Date.now(), // Простой ID на основе времени
            ...orderData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        // Добавляем новый заказ
        existingOrders.push(newOrder);
        
        // Сохраняем обратно
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(existingOrders));
        
        console.log('Заказ сохранен в localStorage:', newOrder);
        console.log('Всего заказов:', existingOrders.length);
        
        return newOrder;
        
    } catch (error) {
        console.error('Ошибка сохранения заказа:', error);
        throw error;
    }
}

// Получение всех заказов
function getOrdersFromStorage() {
    try {
        const orders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
        console.log('Загружено заказов из localStorage:', orders.length);
        return orders;
    } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
        return [];
    }
}

// Удаление заказа
function deleteOrderFromStorage(orderId) {
    try {
        const orders = getOrdersFromStorage();
        const filteredOrders = orders.filter(order => order.id !== orderId);
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(filteredOrders));
        console.log('Заказ удален:', orderId);
        return true;
    } catch (error) {
        console.error('Ошибка удаления заказа:', error);
        return false;
    }
}

// Обновление заказа
function updateOrderInStorage(orderId, updatedData) {
    try {
        const orders = getOrdersFromStorage();
        const index = orders.findIndex(order => order.id === orderId);
        
        if (index !== -1) {
            orders[index] = {
                ...orders[index],
                ...updatedData,
                updated_at: new Date().toISOString()
            };
            
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
            console.log('Заказ обновлен:', orderId);
            return orders[index];
        }
        
        return null;
    } catch (error) {
        console.error('Ошибка обновления заказа:', error);
        return null;
    }
}

// Экспортируем функции
window.saveOrderToStorage = saveOrderToStorage;
window.getOrdersFromStorage = getOrdersFromStorage;
window.deleteOrderFromStorage = deleteOrderFromStorage;
window.updateOrderInStorage = updateOrderInStorage;