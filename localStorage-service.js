// [file name]: localStorage-service.js (УПРОЩЕННАЯ ВЕРСИЯ)
const STORAGE_KEY = 'businessLunchOrder';

// Функция для сохранения заказа в localStorage
function saveOrderToStorage(order) {
    try {
        console.log('Сохранение заказа:', order);
        
        // Проверяем, что order - это объект
        if (!order || typeof order !== 'object') {
            console.error('Неверный формат заказа для сохранения:', order);
            return false;
        }
        
        // Простая структура с ID блюд
        const storageOrder = {
            soup: order.soup && order.soup.id ? order.soup.id : null,
            main: order.main && order.main.id ? order.main.id : null,
            salad: order.salad && order.salad.id ? order.salad.id : null,
            drink: order.drink && order.drink.id ? order.drink.id : null,
            dessert: order.dessert && order.dessert.id ? order.dessert.id : null
        };
        
        console.log('Сохраняемая структура:', storageOrder);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storageOrder));
        
        return true;
    } catch (error) {
        console.error('Ошибка сохранения в localStorage:', error);
        return false;
    }
}

// Функция для загрузки заказа из localStorage
function loadOrderFromStorage() {
    try {
        const savedOrder = localStorage.getItem(STORAGE_KEY);
        
        if (!savedOrder) {
            console.log('Нет сохраненного заказа в localStorage');
            return {
                soup: null,
                main: null,
                salad: null,
                drink: null,
                dessert: null
            };
        }
        
        const storageOrder = JSON.parse(savedOrder);
        console.log('Загружено из localStorage:', storageOrder);
        
        // Получаем все блюда
        const allDishes = window.getAllDishes ? window.getAllDishes() : [];
        
        if (allDishes.length === 0) {
            console.warn('Блюда еще не загружены');
            return {
                soup: storageOrder.soup ? { id: storageOrder.soup } : null,
                main: storageOrder.main ? { id: storageOrder.main } : null,
                salad: storageOrder.salad ? { id: storageOrder.salad } : null,
                drink: storageOrder.drink ? { id: storageOrder.drink } : null,
                dessert: storageOrder.dessert ? { id: storageOrder.dessert } : null
            };
        }
        
        // Ищем блюда по ID
        return {
            soup: storageOrder.soup ? findDishById(allDishes, storageOrder.soup) : null,
            main: storageOrder.main ? findDishById(allDishes, storageOrder.main) : null,
            salad: storageOrder.salad ? findDishById(allDishes, storageOrder.salad) : null,
            drink: storageOrder.drink ? findDishById(allDishes, storageOrder.drink) : null,
            dessert: storageOrder.dessert ? findDishById(allDishes, storageOrder.dessert) : null
        };
    } catch (error) {
        console.error('Ошибка загрузки из localStorage:', error);
        return {
            soup: null,
            main: null,
            salad: null,
            drink: null,
            dessert: null
        };
    }
}

// Вспомогательная функция для поиска блюда по ID
function findDishById(dishes, id) {
    const dish = dishes.find(d => d.id === id);
    if (!dish) {
        console.warn('Блюдо с ID', id, 'не найдено');
    }
    return dish;
}

// Функция для очистки заказа из localStorage
function clearOrderFromStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Ошибка очистки localStorage:', error);
        return false;
    }
}

// Экспортируем функции
window.saveOrderToStorage = saveOrderToStorage;
window.loadOrderFromStorage = loadOrderFromStorage;
window.clearOrderFromStorage = clearOrderFromStorage;