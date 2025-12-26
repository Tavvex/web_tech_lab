// display-dishes.js - ОБНОВЛЕННАЯ ВЕРСИЯ

// Глобальная переменная для хранения блюд (будет заполнена из API)
let dishes = [];

// Функция для инициализации блюд (вызывается после загрузки из API)
function initDishes(loadedDishes) {
    dishes = loadedDishes;
    console.log(`Инициализировано ${dishes.length} блюд`);
}

// Функция для сортировки блюд по алфавиту
function sortDishesAlphabetically(dishesArray) {
    return dishesArray.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
}

// Функция для создания карточки блюда
function createDishCard(dish) {
    const dishCard = document.createElement('div');
    dishCard.className = 'dish-card';
    dishCard.setAttribute('data-dish', dish.keyword);
    dishCard.setAttribute('data-kind', dish.kind);
    
    // Обрабатываем URL изображения (может быть абсолютным или относительным)
    let imageUrl = dish.image;
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
        // Если это относительный путь, добавляем базовый путь
        imageUrl = 'images/' + imageUrl;
    }
    
    // Создаем содержимое карточки
    dishCard.innerHTML = `
        <img src="${imageUrl}" alt="${dish.name}" onerror="this.src='images/default-dish.jpg'">
        <p class="price">${dish.price} ₽</p>
        <p class="name">${dish.name}</p>
        <p class="weight">${dish.count}</p>
        <button class="add-btn">Добавить</button>
    `;
    
    return dishCard;
}

// Функция для отображения блюд в определенной секции с фильтрацией
function displayDishesInSection(sectionIndex, category, filterKind = 'all') {
    const sections = document.querySelectorAll('main section');
    if (!sections[sectionIndex]) return;
    
    const section = sections[sectionIndex];
    const dishesGrid = section.querySelector('.dishes-grid');
    if (!dishesGrid) return;
    
    dishesGrid.innerHTML = ''; // Очищаем существующие блюда
    
    // Фильтруем блюда по категории и виду
    let filteredDishes = dishes.filter(dish => dish.category === category);
    
    if (filterKind !== 'all') {
        filteredDishes = filteredDishes.filter(dish => dish.kind === filterKind);
    }
    
    // Если нет блюд для отображения
    if (filteredDishes.length === 0) {
        const noDishesMessage = document.createElement('div');
        noDishesMessage.className = 'no-dishes-message';
        noDishesMessage.textContent = 'Блюда не найдены';
        dishesGrid.appendChild(noDishesMessage);
        return;
    }
    
    // Сортируем по алфавиту
    const sortedDishes = sortDishesAlphabetically(filteredDishes);
    
    // Отображаем блюда
    sortedDishes.forEach(dish => {
        dishesGrid.appendChild(createDishCard(dish));
    });
}

// Функция для отображения всех блюд на странице
function displayAllDishes() {
    if (dishes.length === 0) {
        console.log('Нет данных о блюдах для отображения');
        return;
    }
    
    // Супы (индекс 0)
    displayDishesInSection(0, 'soup');
    
    // Главные блюда (индекс 1)
    displayDishesInSection(1, 'main');
    
    // Салаты (индекс 2)
    displayDishesInSection(2, 'salad');
    
    // Напитки (индекс 3)
    displayDishesInSection(3, 'drink');
    
    // Десерты (индекс 4)
    displayDishesInSection(4, 'dessert');
}

// Функция, вызываемая после загрузки блюд из API
function onDishesLoaded() {
    console.log('Блюда загружены, начинаем отображение...');
    
    // Получаем блюда из API сервиса
    if (typeof apiService !== 'undefined') {
        const loadedDishes = apiService.getDishes();
        if (loadedDishes && loadedDishes.length > 0) {
            initDishes(loadedDishes);
            displayAllDishes();
            
            // Инициализируем фильтры после отображения
            if (typeof initFilters === 'function') {
                setTimeout(initFilters, 100);
            }
        }
    }
}

// Экспортируем функцию для использования в API сервисе
window.onDishesLoaded = onDishesLoaded;

// Инициализация при загрузке страницы (если блюда уже есть)
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, есть ли уже загруженные блюды
    if (dishes.length > 0) {
        displayAllDishes();
    }
    
    console.log('Display dishes module загружен');
});