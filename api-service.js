// [file name]: api-service.js

// URL API согласно заданию
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';

// Глобальный массив для хранения блюд
let dishes = [];
let isLoading = false;

// Основная функция loadDishes() - ТРЕБУЕТСЯ ПО ЗАДАНИЮ
async function loadDishes() {
    console.log('Запуск функции loadDishes()...');
    console.log(`URL API: ${API_URL}`);
    
    isLoading = true;
    
    try {
        // Показываем индикатор загрузки
        showLoadingIndicator();
        
        // Используем fetch для запроса к API
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            // mode: 'cors' - включено по умолчанию
        });
        
        console.log('Статус ответа:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }
        
        // Парсим JSON
        const data = await response.json();
        
        // Сохраняем данные
        dishes = data;
        
        console.log(`✅ Успешно загружено ${dishes.length} блюд из API`);
        console.log('Пример первого блюда:', dishes[0]);
        
        // Скрываем индикатор
        hideLoadingIndicator();
        
        // Вызываем callback для инициализации интерфейса
        if (typeof window.onDishesLoaded === 'function') {
            window.onDishesLoaded();
        }
        
        return dishes;
        
    } catch (error) {
        console.error('❌ Ошибка при загрузке блюд:', error);
        
        // Скрываем индикатор
        hideLoadingIndicator();
        
        // Показываем сообщение об ошибке
        showError('Не удалось загрузить меню. Проверьте подключение к интернету.');
        
        // Используем fallback данные
        dishes = getFallbackDishes();
        console.log(`🔄 Использовано ${dishes.length} fallback блюд`);
        
        // Все равно вызываем callback с fallback данными
        if (typeof window.onDishesLoaded === 'function') {
            window.onDishesLoaded();
        }
        
        return dishes;
    } finally {
        isLoading = false;
    }
}

// Fallback данные на случай недоступности API
function getFallbackDishes() {
    return [
        {
            "category": "soup",
            "count": "350 г",
            "image": "images/soup-murhs.jpg",
            "keyword": "gaspacho",
            "kind": "veg",
            "name": "Гаспачо",
            "price": 195
        },
        {
            "category": "soup",
            "count": "330 г",
            "image": "images/soup-meat.jpg",
            "keyword": "mushroom_soup",
            "kind": "veg",
            "name": "Грибной суп-пюре",
            "price": 185
        },
        {
            "category": "soup",
            "count": "400 г",
            "image": "images/soup-tomato.jpg",
            "keyword": "borscht",
            "kind": "meat",
            "name": "Борщ с говядиной",
            "price": 220
        },
        {
            "category": "soup",
            "count": "350 г",
            "image": "images/soup-chicken.jpg",
            "keyword": "chicken_noodle",
            "kind": "meat",
            "name": "Куриный суп с лапшой",
            "price": 200
        },
        {
            "category": "main",
            "count": "400 г",
            "image": "images/main-rise.jpg",
            "keyword": "teriyaki_chicken",
            "kind": "meat",
            "name": "Курица терияки с рисом",
            "price": 350
        },
        {
            "category": "main",
            "count": "350 г",
            "image": "images/main-itally.jpg",
            "keyword": "carbonara",
            "kind": "meat",
            "name": "Паста Карбонара",
            "price": 320
        },
        {
            "category": "main",
            "count": "380 г",
            "image": "images/main-fish.jpg",
            "keyword": "salmon",
            "kind": "fish",
            "name": "Лосось с картофельным пюре",
            "price": 420
        },
        {
            "category": "main",
            "count": "400 г",
            "image": "images/main-beef.jpg",
            "keyword": "beef_stroganoff",
            "kind": "meat",
            "name": "Бефстроганов с гречкой",
            "price": 380
        },
        {
            "category": "salad",
            "count": "250 г",
            "image": "images/salad-caesar.jpg",
            "keyword": "caesar_salad",
            "kind": "meat",
            "name": "Салат Цезарь с курицей",
            "price": 280
        },
        {
            "category": "salad",
            "count": "230 г",
            "image": "images/salad-greek.jpg",
            "keyword": "greek_salad",
            "kind": "veg",
            "name": "Греческий салат",
            "price": 240
        },
        {
            "category": "drink",
            "count": "250 мл",
            "image": "images/drink-orange.jpg",
            "keyword": "orange_juice",
            "kind": "cold",
            "name": "Свежевыжатый апельсиновый сок",
            "price": 180
        },
        {
            "category": "drink",
            "count": "250 мл",
            "image": "images/drink-apple.jpg",
            "keyword": "apple_juice",
            "kind": "cold",
            "name": "Яблочный сок",
            "price": 150
        },
        {
            "category": "dessert",
            "count": "150 г",
            "image": "images/dessert-tiramisu.jpg",
            "keyword": "tiramisu",
            "kind": "medium",
            "name": "Тирамису",
            "price": 220
        }
    ];
}

// Вспомогательные функции UI
function showLoadingIndicator() {
    // Простой индикатор загрузки
    const loader = document.createElement('div');
    loader.id = 'api-loader';
    loader.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        ">
            <div style="
                width: 50px;
                height: 50px;
                border: 5px solid #f3f3f3;
                border-top: 5px solid tomato;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
            "></div>
            <p style="font-size: 1.2rem; color: #2c3e50;">Загрузка меню...</p>
        </div>
    `;
    
    // Добавляем стили для анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loader);
}

function hideLoadingIndicator() {
    const loader = document.getElementById('api-loader');
    if (loader) {
        loader.remove();
    }
}

function showError(message) {
    // Удаляем предыдущие ошибки
    const existingError = document.getElementById('api-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Создаем сообщение об ошибке
    const errorDiv = document.createElement('div');
    errorDiv.id = 'api-error';
    errorDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ffeaea;
            border: 2px solid #e74c3c;
            border-radius: 10px;
            padding: 15px;
            max-width: 300px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        ">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 1.5rem; margin-right: 10px;">⚠️</span>
                <strong style="color: #c0392b;">Ошибка загрузки</strong>
            </div>
            <p style="color: #c0392b; margin-bottom: 15px; font-size: 0.9rem;">${message}</p>
            <button id="retry-api" style="
                background: #e74c3c;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                font-family: inherit;
            ">Повторить</button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Обработчик для кнопки повтора
    document.getElementById('retry-api').addEventListener('click', function() {
        errorDiv.remove();
        loadDishes();
    });
    
    // Автоскрытие через 10 секунд
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 10000);
}

// Альтернативная версия с XMLHttpRequest (для демонстрации)
function loadDishesXHR() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.open('GET', API_URL, true);
        xhr.setRequestHeader('Accept', 'application/json');
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    dishes = data;
                    console.log(`Загружено ${dishes.length} блюд (XHR)`);
                    
                    if (typeof window.onDishesLoaded === 'function') {
                        window.onDishesLoaded();
                    }
                    
                    resolve(dishes);
                } catch (error) {
                    reject(error);
                }
            } else {
                reject(new Error(`HTTP ${xhr.status}`));
            }
        };
        
        xhr.onerror = function() {
            reject(new Error('Network error'));
        };
        
        xhr.send();
    });
}

// Геттеры для доступа к данным
function getDishes() {
    return dishes;
}

function getLoadingStatus() {
    return {
        isLoading,
        dishesCount: dishes.length
    };
}

// Экспортируем API
window.apiService = {
    loadDishes,          // Основная функция
    loadDishesXHR,       // Альтернативная версия
    getDishes,
    getLoadingStatus,
    API_URL              // Для отладки
};

// Экспортируем также глобально для прямого вызова
window.loadDishes = loadDishes;