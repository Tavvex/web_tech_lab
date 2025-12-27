// [file name]: api-service.js
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';

// Глобальная переменная для хранения блюд
let dishes = [];

// Функция для загрузки блюд с API
async function loadDishes() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Преобразуем данные API в нашу структуру
        dishes = data.map(item => ({
            keyword: item.keyword,
            name: item.name,
            price: item.price,
            category: mapCategory(item.category),
            kind: item.kind,
            count: item.count,
            image: item.image
        }));
        
        console.log('Блюда загружены:', dishes.length);
        console.log('Категории:', [...new Set(dishes.map(d => d.category))]);
        
        // Инициализируем отображение после загрузки
        if (typeof displayAllDishes === 'function') {
            displayAllDishes();
        }
        
        return dishes;
    } catch (error) {
        console.error('Ошибка загрузки блюд:', error);
        // Можно показать сообщение об ошибке пользователю
        document.querySelector('main').innerHTML += `
            <div class="error-message">
                <p>Ошибка загрузки меню. Пожалуйста, обновите страницу.</p>
            </div>
        `;
        return [];
    }
}

// Функция для преобразования категорий из API в наши категории
function mapCategory(apiCategory) {
    const categoryMap = {
        'soup': 'soup',
        'main-course': 'main',
        'salad': 'salad',
        'drink': 'drink',
        'dessert': 'dessert'
    };
    
    return categoryMap[apiCategory] || apiCategory;
}

// Функция для получения всех блюд
function getAllDishes() {
    return dishes;
}

// Функция для получения блюд по категории
function getDishesByCategory(category) {
    return dishes.filter(dish => dish.category === category);
}

// Функция для получения блюда по keyword
function getDishByKeyword(keyword) {
    return dishes.find(dish => dish.keyword === keyword);
}

// Экспортируем функции
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadDishes,
        getAllDishes,
        getDishesByCategory,
        getDishByKeyword
    };
}