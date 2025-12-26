// [file name]: api-service-final.js
// Финальная версия для GitHub Pages

// Специальный proxy для GitHub Pages
const GITHUB_PROXY = 'https://corsproxy.io/?';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';

let dishes = [];

// Основная функция для лабораторной
async function loadDishes() {
    console.log('🚀 Запуск loadDishes() для лабораторной работы 7');
    
    showLab7Loader();
    
    // Метод 1: Пробуем через прокси (самый надежный)
    try {
        dishes = await loadViaProxy();
        console.log(`✅ Загружено через прокси: ${dishes.length} блюд`);
    } catch (proxyError) {
        console.warn('Прокси не сработал:', proxyError.message);
        
        // Метод 2: Пробуем локальный JSON
        try {
            dishes = await loadLocalJson();
            console.log(`✅ Загружено локально: ${dishes.length} блюд`);
        } catch (localError) {
            console.warn('Локальный JSON не найден:', localError.message);
            
            // Метод 3: Используем встроенные данные
            dishes = getBuiltInData();
            console.log(`✅ Использованы встроенные данные: ${dishes.length} блюд`);
        }
    }
    
    hideLab7Loader();
    showLab7Success(dishes.length);
    
    // Важно: вызываем callback для обновления интерфейса
    if (typeof window.onDishesLoaded === 'function') {
        setTimeout(() => {
            console.log('📞 Вызов onDishesLoaded()');
            window.onDishesLoaded();
        }, 300);
    }
    
    return dishes;
}

// Загрузка через прокси
async function loadViaProxy() {
    const proxyUrl = GITHUB_PROXY + encodeURIComponent(API_URL);
    console.log(`Пробуем прокси: ${proxyUrl}`);
    
    const response = await fetch(proxyUrl, {
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    });
    
    if (!response.ok) {
        throw new Error(`Прокси ошибка: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
        throw new Error('Некорректный формат данных');
    }
    
    return data;
}

// Загрузка локального JSON
async function loadLocalJson() {
    const response = await fetch('dishes.json');
    
    if (!response.ok) {
        throw new Error('Файл dishes.json не найден');
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
        throw new Error('Некорректный формат dishes.json');
    }
    
    return data;
}

// Встроенные данные
function getBuiltInData() {
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

// Стили для лабораторной работы 7
function showLab7Loader() {
    const loader = document.createElement('div');
    loader.id = 'lab7-loader';
    
    const styles = `
        #lab7-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            color: white;
            font-family: 'Roboto', sans-serif;
        }
        .lab7-spinner {
            width: 80px;
            height: 80px;
            border: 8px solid rgba(255,255,255,0.3);
            border-top: 8px solid white;
            border-radius: 50%;
            animation: lab7-spin 1.5s linear infinite;
            margin-bottom: 30px;
        }
        .lab7-title {
            font-size: 2rem;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .lab7-subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 20px;
        }
        .lab7-url {
            background: rgba(255,255,255,0.1);
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 0.9rem;
            margin-top: 20px;
        }
        @keyframes lab7-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
    
    loader.innerHTML = `
        <div class="lab7-spinner"></div>
        <div class="lab7-title">Лабораторная работа 7</div>
        <div class="lab7-subtitle">Загрузка данных из API</div>
        <div class="lab7-url">${API_URL}</div>
    `;
    
    document.body.appendChild(loader);
}

function hideLab7Loader() {
    const loader = document.getElementById('lab7-loader');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            if (loader.parentNode) loader.remove();
        }, 500);
    }
}

function showLab7Success(count) {
    const success = document.createElement('div');
    success.id = 'lab7-success';
    
    success.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.5s;
        border-left: 5px solid #27ae60;
        max-width: 300px;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    success.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="
                width: 40px;
                height: 40px;
                background: #27ae60;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                margin-right: 15px;
            ">✓</div>
            <div>
                <div style="font-weight: bold; color: #2c3e50; font-size: 1.2rem;">
                    Лабораторная 7 выполнена!
                </div>
                <div style="color: #7f8c8d; font-size: 0.9rem;">
                    Функция loadDishes() успешно выполнена
                </div>
            </div>
        </div>
        <div style="
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-top: 10px;
        ">
            <div style="color: #27ae60; font-weight: bold; font-size: 1.5rem; text-align: center;">
                ${count} блюд
            </div>
            <div style="color: #7f8c8d; text-align: center; font-size: 0.9rem;">
                успешно загружено
            </div>
        </div>
        <button onclick="this.parentElement.remove()" 
                style="
                    width: 100%;
                    margin-top: 15px;
                    padding: 10px;
                    background: #3498db;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                ">
            Продолжить
        </button>
    `;
    
    document.body.appendChild(success);
    
    setTimeout(() => {
        if (success.parentNode) success.remove();
    }, 5000);
}

// Экспортируем
window.apiService = {
    loadDishes,
    getDishes: () => dishes,
    API_URL,
    GITHUB_PROXY
};

window.loadDishes = loadDishes;

console.log('🎓 GitHub Pages API Service загружен (Лабораторная работа 7)');
console.log('Функция loadDishes() доступна для вызова');