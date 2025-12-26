// display-dishes.js
// Обновлен для работы с данными из API

// Массив блюд (будет заполнен из API)
let dishes = [];

// Функция для инициализации данных из API
function initDishes(loadedDishes) {
    if (!Array.isArray(loadedDishes)) {
        console.error('Ошибка: loadedDishes не является массивом', loadedDishes);
        return;
    }
    
    dishes = loadedDishes;
    console.log(`DisplayDishes: инициализировано ${dishes.length} блюд`);
    
    // Логируем категории для отладки
    const categories = {};
    dishes.forEach(dish => {
        if (!categories[dish.category]) {
            categories[dish.category] = 0;
        }
        categories[dish.category]++;
    });
    console.log('Распределение по категориям:', categories);
}

// Функция для сортировки блюд по алфавиту
function sortDishesAlphabetically(dishesArray) {
    return dishesArray.sort((a, b) => {
        return a.name.localeCompare(b.name, 'ru');
    });
}

// Функция для создания карточки блюда
function createDishCard(dish) {
    const dishCard = document.createElement('div');
    dishCard.className = 'dish-card';
    dishCard.setAttribute('data-dish', dish.keyword);
    dishCard.setAttribute('data-kind', dish.kind);
    
    // Обрабатываем URL изображения
    let imageUrl = dish.image;
    
    // Если изображение не начинается с http или /, добавляем путь images/
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/') && !imageUrl.startsWith('images/')) {
        imageUrl = 'images/' + imageUrl;
    }
    
    // Если изображение не указано, используем заглушку
    if (!imageUrl) {
        imageUrl = 'images/default-dish.jpg';
    }
    
    // Создаем HTML карточки
    dishCard.innerHTML = `
        <img src="${imageUrl}" alt="${dish.name}" 
             onerror="this.onerror=null; this.src='images/default-dish.jpg';">
        <p class="price">${dish.price} ₽</p>
        <p class="name">${dish.name}</p>
        <p class="weight">${dish.count}</p>
        <button class="add-btn">Добавить</button>
    `;
    
    return dishCard;
}

// Функция для получения категории по индексу секции
function getCategoryBySectionIndex(sectionIndex) {
    const categoryMap = {
        0: 'soup',      // Супы
        1: 'main',      // Главные блюда
        2: 'salad',     // Салаты
        3: 'drink',     // Напитки
        4: 'dessert'    // Десерты
    };
    
    return categoryMap[sectionIndex] || null;
}

// Функция для отображения блюд в определенной секции
function displayDishesInSection(sectionIndex, filterKind = 'all') {
    const category = getCategoryBySectionIndex(sectionIndex);
    if (!category) {
        console.error(`Неизвестная секция с индексом ${sectionIndex}`);
        return;
    }
    
    // Находим секцию на странице
    const sections = document.querySelectorAll('main section');
    if (sections.length <= sectionIndex) {
        console.error(`Секция с индексом ${sectionIndex} не найдена на странице`);
        return;
    }
    
    const section = sections[sectionIndex];
    const dishesGrid = section.querySelector('.dishes-grid');
    
    if (!dishesGrid) {
        console.error(`Не найден .dishes-grid в секции ${sectionIndex}`);
        return;
    }
    
    // Очищаем сетку
    dishesGrid.innerHTML = '';
    
    // Фильтруем блюда по категории
    let filteredDishes = dishes.filter(dish => dish.category === category);
    
    console.log(`Секция ${sectionIndex} (${category}): найдено ${filteredDishes.length} блюд`);
    
    // Применяем фильтр по kind если нужно
    if (filterKind !== 'all') {
        filteredDishes = filteredDishes.filter(dish => dish.kind === filterKind);
        console.log(`После фильтрации "${filterKind}": ${filteredDishes.length} блюд`);
    }
    
    // Если нет блюд для отображения
    if (filteredDishes.length === 0) {
        const noDishesMessage = document.createElement('div');
        noDishesMessage.className = 'no-dishes-message';
        noDishesMessage.textContent = filterKind === 'all' ? 'Блюда не найдены' : `Нет блюд в категории "${filterKind}"`;
        dishesGrid.appendChild(noDishesMessage);
        return;
    }
    
    // Сортируем по алфавиту
    const sortedDishes = sortDishesAlphabetically(filteredDishes);
    
    // Отображаем блюда
    sortedDishes.forEach(dish => {
        const dishCard = createDishCard(dish);
        dishesGrid.appendChild(dishCard);
    });
}

// Функция для отображения всех блюд на странице
function displayAllDishes() {
    console.log('Отображение всех блюд на странице...');
    
    if (dishes.length === 0) {
        console.warn('Нет данных о блюдах для отображения');
        
        // Показываем сообщение об отсутствии данных
        const sections = document.querySelectorAll('main section');
        sections.forEach((section, index) => {
            if (index < 5) { // Только первые 5 секций (категории)
                const dishesGrid = section.querySelector('.dishes-grid');
                if (dishesGrid) {
                    dishesGrid.innerHTML = '<div class="no-data-message">Данные загружаются...</div>';
                }
            }
        });
        
        return;
    }
    
    // Отображаем блюда в каждой секции
    for (let i = 0; i < 5; i++) {
        displayDishesInSection(i);
    }
    
    console.log('Все блюда отображены на странице');
}

// Callback функция, вызываемая после загрузки данных из API
window.onDishesLoaded = function() {
    console.log('=== onDishesLoaded вызван ===');
    
    // Получаем данные из API сервиса
    let loadedDishes = [];
    
    if (window.apiService && typeof window.apiService.getDishes === 'function') {
        loadedDishes = window.apiService.getDishes();
        console.log(`Получено ${loadedDishes.length} блюд из apiService`);
    } else {
        console.error('apiService не доступен');
        return;
    }
    
    // Инициализируем данные
    initDishes(loadedDishes);
    
    // Отображаем блюда на странице
    displayAllDishes();
    
    // Инициализируем систему фильтрации (если она есть)
    if (typeof initFilters === 'function') {
        console.log('Инициализация фильтров...');
        setTimeout(initFilters, 100);
    }
    
    // Инициализируем систему выбора блюд (если она есть)
    if (typeof window.orderManager !== 'undefined' && 
        typeof window.orderManager.initDishesForOrder === 'function') {
        window.orderManager.initDishesForOrder(loadedDishes);
    }
};

// Экспортируем функции для использования в других модулях
window.displayDishes = {
    displayDishesInSection,
    displayAllDishes,
    getDishes: () => dishes
};

// Информация при загрузке модуля
console.log('DisplayDishes модуль загружен');