// [file name]: sync-service.js - ОБНОВЛЕННАЯ ВЕРСИЯ
// Сервис для синхронизации заказа между вкладками

// Константа для ключа localStorage
const ORDER_STORAGE_KEY = 'businessLunchOrder';
const ORDER_UPDATE_EVENT = 'orderStorageUpdated';

// Уникальный ID для текущей вкладки
const TAB_ID = Math.random().toString(36).substr(2, 9);

// Функция для отправки уведомления об обновлении
function notifyOrderUpdate(order) {
    const updateInfo = {
        order: order,
        timestamp: Date.now(),
        source: TAB_ID,
        type: ORDER_UPDATE_EVENT
    };
    
    // Сохраняем с меткой времени
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(updateInfo));
    
    // Также отправляем custom event для текущей вкладки
    window.dispatchEvent(new CustomEvent(ORDER_UPDATE_EVENT, {
        detail: { order: order, source: TAB_ID }
    }));
}

// Функция для проверки обновлений
function checkForUpdates() {
    try {
        const savedData = localStorage.getItem(ORDER_STORAGE_KEY);
        
        if (!savedData) {
            console.log('Нет сохраненного заказа в localStorage');
            return null;
        }
        
        const data = JSON.parse(savedData);
        
        // Проверяем, что уведомление не от нас самих
        if (data.source !== TAB_ID && data.type === ORDER_UPDATE_EVENT) {
            console.log('Обнаружено обновление заказа из другой вкладки:', data.source);
            
            // Возвращаем актуальный заказ
            return data.order;
        }
        
        return null;
    } catch (error) {
        console.error('Ошибка проверки обновлений:', error);
        return null;
    }
}

// Функция для обновления заказа на текущей странице
function updateOrderFromStorage() {
    try {
        const savedData = localStorage.getItem(ORDER_STORAGE_KEY);
        
        if (!savedData) {
            console.log('Нет сохраненного заказа');
            return;
        }
        
        const data = JSON.parse(savedData);
        const order = data.order;
        
        console.log('Загружаем заказ из localStorage:', order);
        
        // Обновляем selectedDishes в order-manager
        if (window.selectedDishes && typeof window.selectedDishes === 'object') {
            Object.keys(window.selectedDishes).forEach(key => {
                window.selectedDishes[key] = order[key] || null;
            });
            
            console.log('Обновленный selectedDishes:', window.selectedDishes);
        }
        
        // Вызываем функции обновления UI в зависимости от страницы
        if (typeof window.updateCheckoutPanel === 'function') {
            window.updateCheckoutPanel();
        }
        
        if (typeof window.updateOrderDisplay === 'function') {
            window.updateOrderDisplay();
        }
        
        if (typeof window.updateSelectedVisuals === 'function') {
            setTimeout(window.updateSelectedVisuals, 100);
        }
        
        // Обновляем панель оформления
        updateCheckoutPanelFromSync();
        
    } catch (error) {
        console.error('Ошибка обновления заказа:', error);
    }
}

// Обновление панели оформления из синхронизации
function updateCheckoutPanelFromSync() {
    const checkoutPanel = document.getElementById('checkout-panel');
    if (!checkoutPanel) return;
    
    // Пересчитываем стоимость
    const total = calculateTotalCostFromSync();
    const hasAnySelection = checkHasAnySelection();
    
    if (!hasAnySelection) {
        checkoutPanel.style.display = 'none';
        return;
    }
    
    checkoutPanel.style.display = 'block';
    
    const checkoutTotal = checkoutPanel.querySelector('.checkout-total');
    const checkoutMessage = checkoutPanel.querySelector('.checkout-message');
    
    if (checkoutTotal) {
        checkoutTotal.textContent = `${total} ₽`;
    }
    
    if (checkoutMessage) {
        if (window.getComboMessage) {
            const comboMessage = window.getComboMessage(window.selectedDishes || {});
            checkoutMessage.textContent = comboMessage.message;
            checkoutMessage.className = `checkout-message ${comboMessage.type}`;
        }
    }
}

// Вспомогательные функции для синхронизации
function calculateTotalCostFromSync() {
    let total = 0;
    
    if (window.selectedDishes) {
        Object.values(window.selectedDishes).forEach(dish => {
            if (dish && dish.price) {
                total += dish.price;
            }
        });
    }
    
    return total;
}

function checkHasAnySelection() {
    if (!window.selectedDishes) return false;
    return Object.values(window.selectedDishes).some(dish => dish !== null);
}

// Функция для инициализации синхронизации
function initSyncService() {
    console.log('Инициализация синхронизации. ID вкладки:', TAB_ID);
    
    // Слушаем события storage (изменения в localStorage из других вкладок)
    window.addEventListener('storage', function(event) {
        console.log('Storage event:', event.key, 'changed by another tab');
        
        if (event.key === ORDER_STORAGE_KEY) {
            // Небольшая задержка для обработки
            setTimeout(() => {
                updateOrderFromStorage();
            }, 100);
        }
    });
    
    // Слушаем custom events для текущей вкладки
    window.addEventListener(ORDER_UPDATE_EVENT, function(event) {
        console.log('Custom order update event:', event.detail.source);
        updateOrderFromStorage();
    });
    
    // Проверяем при загрузке страницы
    setTimeout(() => {
        updateOrderFromStorage();
    }, 500);
    
    // Периодическая проверка (на всякий случай)
    setInterval(() => {
        const updatedOrder = checkForUpdates();
        if (updatedOrder) {
            updateOrderFromStorage();
        }
    }, 2000);
}

// Обновляем функцию saveOrderToStorage в localStorage-service.js
function updateSaveOrderToStorage(order) {
    if (!order || typeof order !== 'object') {
        console.error('Неверный формат заказа для сохранения:', order);
        return false;
    }
    
    const storageOrder = {
        soup: order.soup ? { ...order.soup } : null,
        main: order.main ? { ...order.main } : null,
        salad: order.salad ? { ...order.salad } : null,
        drink: order.drink ? { ...order.drink } : null,
        dessert: order.dessert ? { ...order.dessert } : null
    };
    
    console.log('Сохранение заказа в localStorage:', storageOrder);
    
    // Используем нашу функцию для уведомления других вкладок
    notifyOrderUpdate(storageOrder);
    
    return true;
}

// Экспортируем функции
window.notifyOrderUpdate = notifyOrderUpdate;
window.initSyncService = initSyncService;
window.updateOrderFromStorage = updateOrderFromStorage;
window.TAB_ID = TAB_ID;

// Переопределяем saveOrderToStorage если нужно
if (window.saveOrderToStorage) {
    const originalSaveOrder = window.saveOrderToStorage;
    window.saveOrderToStorage = function(order) {
        const result = originalSaveOrder(order);
        if (result) {
            notifyOrderUpdate(order);
        }
        return result;
    };
}

// Автоматическая инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Ждем загрузки других скриптов
    setTimeout(initSyncService, 1000);
});