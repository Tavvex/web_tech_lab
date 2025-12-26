// api-service.js
// Основной файл для лабораторной работы 7
// Реализует функцию loadDishes() для загрузки данных с API

// URL API согласно заданию для Netlify/GitHub Pages
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';

// Глобальный массив для хранения блюд
let dishes = [];
let isLoading = false;

// Основная функция loadDishes() - ТРЕБУЕТСЯ ПО ЗАДАНИЮ
async function loadDishes() {
    console.log('Запуск функции loadDishes()...');
    console.log(`Обращение к API: ${API_URL}`);
    
    isLoading = true;
    
    try {
        // Показываем индикатор загрузки
        showLoadingIndicator();
        
        // Используем fetch для запроса к API
        console.log('Отправка fetch запроса...');
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Получен ответ от API. Статус:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }
        
        // Парсим JSON данные
        const data = await response.json();
        
        // Сохраняем данные в глобальный массив
        dishes = data;
        
        console.log(`✅ УСПЕШНО! Загружено ${dishes.length} блюд из API`);
        
        // Выводим информацию о первых 3 блюдах для проверки
        if (dishes.length > 0) {
            console.log('Примеры загруженных блюд:');
            dishes.slice(0, 3).forEach((dish, i) => {
                console.log(`${i + 1}. ${dish.name} (${dish.category}) - ${dish.price} ₽`);
            });
        }
        
        // Скрываем индикатор загрузки
        hideLoadingIndicator();
        
        // Вызываем callback для инициализации интерфейса
        if (typeof window.onDishesLoaded === 'function') {
            console.log('Вызов onDishesLoaded() для обновления интерфейса');
            window.onDishesLoaded();
        }
        
        return dishes;
        
    } catch (error) {
        console.error('❌ ОШИБКА при загрузке блюд:', error.message);
        console.error('Полная ошибка:', error);
        
        // Скрываем индикатор загрузки
        hideLoadingIndicator();
        
        // Показываем сообщение об ошибке
        showError('Не удалось загрузить меню. Проверьте подключение к интернету.');
        
        // Используем fallback данные для демонстрации
        console.log('🔄 Используем fallback данные для демонстрации...');
        dishes = getFallbackDishes();
        console.log(`Загружено ${dishes.length} fallback блюд`);
        
        // Вызываем callback с fallback данными
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
            "category": "soup",
            "count": "300 г",
            "image": "images/soup-salmon.jpg",
            "keyword": "fish_soup",
            "kind": "fish",
            "name": "Уха из семги",
            "price": 250
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
            "category": "main",
            "count": "350 г",
            "image": "images/main-curry.jpg",
            "keyword": "vegetable_curry",
            "kind": "veg",
            "name": "Овощное карри с киноа",
            "price": 290
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
            "category": "salad",
            "count": "200 г",
            "image": "images/salad-shrimp.jpg",
            "keyword": "shrimp_cocktail",
            "kind": "fish",
            "name": "Коктейль из креветок",
            "price": 320
        },
        {
            "category": "salad",
            "count": "220 г",
            "image": "images/salad-caprese.jpg",
            "keyword": "caprese",
            "kind": "veg",
            "name": "Капрезе с моцареллой",
            "price": 260
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
            "category": "drink",
            "count": "250 мл",
            "image": "images/drink-red.jpg",
            "keyword": "cranberry_juice",
            "kind": "cold",
            "name": "Морс клюквенный",
            "price": 160
        },
        {
            "category": "drink",
            "count": "300 мл",
            "image": "images/drink-green.jpg",
            "keyword": "green_tea",
            "kind": "hot",
            "name": "Зеленый чай",
            "price": 120
        },
        {
            "category": "drink",
            "count": "300 мл",
            "image": "images/drink-black.jpg",
            "keyword": "black_tea",
            "kind": "hot",
            "name": "Черный чай с лимоном",
            "price": 120
        },
        {
            "category": "dessert",
            "count": "150 г",
            "image": "images/dessert-tiramisu.jpg",
            "keyword": "tiramisu",
            "kind": "medium",
            "name": "Тирамису",
            "price": 220
        },
        {
            "category": "dessert",
            "count": "140 г",
            "image": "images/dessert-chocolate.jpg",
            "keyword": "chocolate_cake",
            "kind": "medium",
            "name": "Шоколадный торт",
            "price": 200
        },
        {
            "category": "dessert",
            "count": "180 г",
            "image": "images/dessert-cheesecake.jpg",
            "keyword": "cheesecake",
            "kind": "large",
            "name": "Чизкейк Нью-Йорк",
            "price": 240
        }
    ];
}

// Функция для отображения индикатора загрузки
function showLoadingIndicator() {
    // Создаем элемент индикатора
    const loader = document.createElement('div');
    loader.id = 'loading-indicator';
    
    // Стили для индикатора
    const styles = `
        #loading-indicator {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.95);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            font-family: 'Roboto', sans-serif;
        }
        
        .loading-spinner {
            width: 60px;
            height: 60px;
            border: 6px solid #f3f3f3;
            border-top: 6px solid tomato;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        
        .loading-text {
            font-size: 1.2rem;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .loading-subtext {
            font-size: 0.9rem;
            color: #7f8c8d;
            text-align: center;
            max-width: 300px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    // Создаем элемент стилей
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    
    // Содержимое индикатора
    loader.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-text">Загрузка меню...</div>
        <div class="loading-subtext">Обращение к API: ${API_URL}</div>
    `;
    
    document.body.appendChild(loader);
}

// Функция для скрытия индикатора загрузки
function hideLoadingIndicator() {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
        loader.remove();
    }
}

// Функция для отображения ошибки
function showError(message) {
    // Удаляем предыдущие ошибки
    const existingError = document.getElementById('api-error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Создаем сообщение об ошибке
    const errorDiv = document.createElement('div');
    errorDiv.id = 'api-error-message';
    
    // Стили для сообщения об ошибке
    const styles = `
        #api-error-message {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #ffeaea;
            border: 2px solid #e74c3c;
            border-radius: 10px;
            padding: 20px;
            max-width: 350px;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.3s ease;
            font-family: 'Roboto', sans-serif;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .error-header {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .error-icon {
            font-size: 1.5rem;
            margin-right: 10px;
        }
        
        .error-title {
            color: #c0392b;
            font-weight: bold;
            font-size: 1.1rem;
        }
        
        .error-message {
            color: #c0392b;
            margin-bottom: 15px;
            font-size: 0.9rem;
            line-height: 1.4;
        }
        
        .error-buttons {
            display: flex;
            gap: 10px;
        }
        
        .error-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-family: inherit;
            font-weight: 500;
            transition: all 0.3s;
        }
        
        .retry-btn {
            background-color: #e74c3c;
            color: white;
            flex: 2;
        }
        
        .retry-btn:hover {
            background-color: #c0392b;
        }
        
        .continue-btn {
            background-color: #ecf0f1;
            color: #2c3e50;
            flex: 1;
        }
        
        .continue-btn:hover {
            background-color: #bdc3c7;
        }
    `;
    
    // Добавляем стили
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    
    // Содержимое сообщения об ошибке
    errorDiv.innerHTML = `
        <div class="error-header">
            <span class="error-icon">⚠️</span>
            <span class="error-title">Ошибка загрузки</span>
        </div>
        <div class="error-message">${message}</div>
        <div class="error-buttons">
            <button id="retry-loading" class="error-btn retry-btn">Повторить</button>
            <button id="continue-anyway" class="error-btn continue-btn">Продолжить</button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Обработчики для кнопок
    document.getElementById('retry-loading').addEventListener('click', function() {
        errorDiv.remove();
        loadDishes();
    });
    
    document.getElementById('continue-anyway').addEventListener('click', function() {
        errorDiv.remove();
    });
    
    // Автоматически скрываем через 15 секунд
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 15000);
}

// Альтернативная реализация с XMLHttpRequest (для демонстрации)
function loadDishesXHR() {
    console.log('Загрузка данных с использованием XMLHttpRequest...');
    
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.open('GET', API_URL, true);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    dishes = data;
                    console.log(`XMLHttpRequest: Загружено ${dishes.length} блюд`);
                    
                    if (typeof window.onDishesLoaded === 'function') {
                        window.onDishesLoaded();
                    }
                    
                    resolve(dishes);
                } catch (error) {
                    console.error('Ошибка парсинга JSON:', error);
                    reject(error);
                }
            } else {
                reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
        };
        
        xhr.onerror = function() {
            reject(new Error('Ошибка сети при запросе к API'));
        };
        
        xhr.ontimeout = function() {
            reject(new Error('Таймаут запроса к API'));
        };
        
        // Устанавливаем таймаут 15 секунд
        xhr.timeout = 15000;
        
        xhr.send();
    });
}

// Вспомогательные функции для доступа к данным
function getDishes() {
    return dishes;
}

function getLoadingStatus() {
    return {
        isLoading: isLoading,
        dishesCount: dishes.length,
        apiUrl: API_URL
    };
}

// Экспортируем API сервис
window.apiService = {
    loadDishes,          // Основная функция (fetch)
    loadDishesXHR,       // Альтернативная функция (XMLHttpRequest)
    getDishes,           // Получить загруженные блюда
    getLoadingStatus,    // Получить статус загрузки
    API_URL              // URL API (для отладки)
};

// Экспортируем основную функцию глобально для прямого вызова
window.loadDishes = loadDishes;

// Информация при загрузке модуля
console.log('API Service загружен');
console.log('Доступные функции: loadDishes(), apiService.loadDishes(), apiService.loadDishesXHR()');
console.log(`API URL: ${API_URL}`);