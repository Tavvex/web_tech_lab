// [file name]: api-service.js

// Базовые URL для API (в зависимости от хостинга)
const API_URLS = {
    mospolytech: 'http://lab7-api.std-900.ist.mospolytech.ru/api/dishes',
    netlify: 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes'
};

// Выбираем URL в зависимости от текущего хоста
function getApiUrl() {
    const hostname = window.location.hostname;
    
    if (hostname.includes('mospolytech.ru') || hostname.includes('localhost')) {
        return API_URLS.mospolytech;
    } else {
        return API_URLS.netlify;
    }
}

// Глобальная переменная для хранения загруженных блюд
let dishes = [];

// Статус загрузки данных
let isLoading = false;
let hasError = false;

// Функция для загрузки данных с API
async function loadDishes() {
    const apiUrl = getApiUrl();
    console.log(`Загрузка блюд с API: ${apiUrl}`);
    
    isLoading = true;
    hasError = false;
    
    try {
        // Показываем индикатор загрузки
        showLoadingIndicator();
        
        // Используем fetch для получения данных
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors' // Включаем CORS для кроссдоменных запросов
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Парсим JSON ответ
        const data = await response.json();
        
        // Сохраняем данные в глобальную переменную dishes
        dishes = data;
        
        console.log(`Успешно загружено ${dishes.length} блюд`);
        
        // Скрываем индикатор загрузки
        hideLoadingIndicator();
        
        // Вызываем колбэк после успешной загрузки
        if (typeof onDishesLoaded === 'function') {
            onDishesLoaded();
        }
        
        return dishes;
        
    } catch (error) {
        console.error('Ошибка при загрузке блюд:', error);
        hasError = true;
        
        // Показываем сообщение об ошибке
        showError('Не удалось загрузить меню. Пожалуйста, попробуйте позже.');
        
        // Используем локальные данные как fallback
        dishes = getLocalDishesFallback();
        
        // Скрываем индикатор загрузки
        hideLoadingIndicator();
        
        // Вызываем колбэк с fallback данными
        if (typeof onDishesLoaded === 'function') {
            onDishesLoaded();
        }
        
        return dishes;
    } finally {
        isLoading = false;
    }
}

// Функция для отображения индикатора загрузки
function showLoadingIndicator() {
    // Создаем индикатор загрузки
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-indicator';
    loadingDiv.className = 'loading-indicator';
    loadingDiv.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Загрузка меню...</p>
    `;
    
    // Добавляем стили для индикатора
    const style = document.createElement('style');
    style.textContent = `
        .loading-indicator {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid tomato;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loading-indicator p {
            font-size: 1.2rem;
            color: #2c3e50;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loadingDiv);
}

// Функция для скрытия индикатора загрузки
function hideLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Функция для отображения ошибки
function showError(message) {
    // Удаляем существующие ошибки
    const existingError = document.getElementById('api-error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Создаем сообщение об ошибке
    const errorDiv = document.createElement('div');
    errorDiv.id = 'api-error-message';
    errorDiv.className = 'api-error-message';
    errorDiv.innerHTML = `
        <div class="error-content">
            <span class="error-icon">⚠️</span>
            <p>${message}</p>
            <button id="retry-loading" class="retry-btn">Повторить</button>
        </div>
    `;
    
    // Добавляем стили для сообщения об ошибке
    const style = document.createElement('style');
    style.textContent = `
        .api-error-message {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #ffeaea;
            border: 2px solid #e74c3c;
            border-radius: 10px;
            padding: 15px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            animation: slideInRight 0.3s ease;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .error-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
        
        .error-icon {
            font-size: 2rem;
            margin-bottom: 10px;
        }
        
        .api-error-message p {
            color: #c0392b;
            margin-bottom: 15px;
            font-size: 0.9rem;
        }
        
        .retry-btn {
            background-color: #e74c3c;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-family: 'Roboto', sans-serif;
            transition: background-color 0.3s;
        }
        
        .retry-btn:hover {
            background-color: #c0392b;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(errorDiv);
    
    // Добавляем обработчик для кнопки повтора
    const retryBtn = document.getElementById('retry-loading');
    retryBtn.addEventListener('click', function() {
        errorDiv.remove();
        loadDishes();
    });
    
    // Автоматически скрываем через 10 секунд
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 10000);
}

// Fallback данные на случай недоступности API
function getLocalDishesFallback() {
    console.log('Используем локальные данные (fallback)');
    
    return [
        // Супы
        {
            "category": "soup",
            "count": "300 мл",
            "image": "images/soup-murhs.jpg",
            "keyword": "mushroom_cream",
            "kind": "veg",
            "name": "Крем-суп из шампиньонов",
            "price": 250
        },
        {
            "category": "soup",
            "count": "350 мл",
            "image": "images/soup-meat.jpg",
            "keyword": "borscht",
            "kind": "meat",
            "name": "Борщ с говядиной",
            "price": 280
        },
        {
            "category": "soup",
            "count": "300 мл",
            "image": "images/soup-tomato.jpg",
            "keyword": "tomato_basil",
            "kind": "veg",
            "name": "Томатный суп с базиликом",
            "price": 240
        },
        
        // Главные блюда
        {
            "category": "main",
            "count": "400 г",
            "image": "images/main-rise.jpg",
            "keyword": "teriyaki_chicken",
            "kind": "meat",
            "name": "Курица терияки с рисом и овощами гриль",
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
        
        // Салаты
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
        
        // Напитки
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
        
        // Десерты
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
        }
    ];
}

// Функция для получения загруженных блюд
function getDishes() {
    return dishes;
}

// Функция для проверки статуса загрузки
function getLoadingStatus() {
    return {
        isLoading,
        hasError,
        dishesCount: dishes.length
    };
}

// Экспортируем функции для использования в других файлах
window.apiService = {
    loadDishes,
    getDishes,
    getLoadingStatus
};