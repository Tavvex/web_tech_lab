// [file name]: data-loader.js
// Централизованный загрузчик данных

class DataLoader {
    constructor() {
        this.dishesLoaded = false;
        this.orderLoaded = false;
        this.listeners = [];
    }
    
    // Загрузка всех необходимых данных
    async loadAllData() {
        console.log('Загрузка всех данных...');
        
        try {
            // 1. Загружаем блюда
            if (!this.dishesLoaded && window.loadDishes) {
                console.log('Загрузка блюд из API...');
                await window.loadDishes();
                this.dishesLoaded = true;
                console.log('Блюда загружены');
            }
            
            // 2. Загружаем заказ из localStorage
            if (!this.orderLoaded) {
                console.log('Загрузка заказа из localStorage...');
                this.orderLoaded = true;
            }
            
            // Уведомляем слушателей
            this.notifyListeners();
            
            return true;
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            return false;
        }
    }
    
    // Регистрация слушателя
    addListener(callback) {
        this.listeners.push(callback);
    }
    
    // Уведомление слушателей
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Ошибка в слушателе:', error);
            }
        });
    }
    
    // Проверка, загружены ли данные
    isDataLoaded() {
        return this.dishesLoaded;
    }
    
    // Получение блюд
    getDishes() {
        return window.getAllDishes ? window.getAllDishes() : [];
    }
    
    // Получение заказа
    getOrder() {
        if (window.loadOrderFromStorage) {
            return window.loadOrderFromStorage();
        }
        return null;
    }
}

// Создаем глобальный экземпляр
window.dataLoader = new DataLoader();

// Автоматическая загрузка при старте
document.addEventListener('DOMContentLoaded', function() {
    console.log('DataLoader: запуск загрузки данных');
    window.dataLoader.loadAllData().then(success => {
        console.log('DataLoader: загрузка завершена', success ? 'успешно' : 'с ошибкой');
    });
});