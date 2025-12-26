// display-dishes.js - обновленная версия

let dishes = [];

// Функция для инициализации данных
function initDishes(loadedDishes) {
    dishes = loadedDishes;
    console.log(`Display: инициализировано ${dishes.length} блюд`);
}

// Функция для получения категории по индексу секции
function getCategoryBySectionIndex(index) {
    const categories = ['soup', 'main', 'salad', 'drink', 'dessert'];
    return categories[index] || null;
}

// Функция для отображения блюд в секции
function displayDishesInSection(sectionIndex, filterKind = 'all') {
    const category = getCategoryBySectionIndex(sectionIndex);
    if (!category) return;
    
    const sections = document.querySelectorAll('main section');
    if (!sections[sectionIndex]) return;
    
    const section = sections[sectionIndex];
    const dishesGrid = section.querySelector('.dishes-grid');
    if (!dishesGrid) return;
    
    // Очищаем сетку
    dishesGrid.innerHTML = '';
    
    // Фильтруем блюда по категории
    let categoryDishes = dishes.filter(dish => dish.category === category);
    
    // Применяем фильтр по kind
    if (filterKind !== 'all') {
        categoryDishes = categoryDishes.filter(dish => dish.kind === filterKind);
    }
    
    // Сортируем по алфавиту
    categoryDishes.sort((a, b) => a.name.localeCompare(b.name));
    
    // Если нет блюд
    if (categoryDishes.length === 0) {
        dishesGrid.innerHTML = '<p class="no-dishes">Блюда не найдены</p>';
        return;
    }
    
    // Создаем карточки блюд
    categoryDishes.forEach(dish => {
        const dishCard = createDishCard(dish);
        dishesGrid.appendChild(dishCard);
    });
}

// Функция создания карточки блюда
function createDishCard(dish) {
    const dishCard = document.createElement('div');
    dishCard.className = 'dish-card';
    dishCard.setAttribute('data-dish', dish.keyword);
    dishCard.setAttribute('data-kind', dish.kind);
    
    // Обрабатываем URL изображения
    let imageUrl = dish.image;
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('images/')) {
        imageUrl = 'images/' + imageUrl;
    }
    
    dishCard.innerHTML = `
        <img src="${imageUrl || 'images/default-dish.jpg'}" alt="${dish.name}" 
             onerror="this.src='images/default-dish.jpg'">
        <p class="price">${dish.price} ₽</p>
        <p class="name">${dish.name}</p>
        <p class="weight">${dish.count}</p>
        <button class="add-btn">Добавить</button>
    `;
    
    return dishCard;
}

// Функция отображения всех блюд
function displayAllDishes() {
    if (dishes.length === 0) {
        console.warn('Нет данных для отображения');
        return;
    }
    
    // Отображаем блюда в каждой секции
    for (let i = 0; i < 5; i++) {
        displayDishesInSection(i);
    }
    
    console.log('Все блюда отображены');
}

// Callback для вызова после загрузки данных из API
window.onDishesLoaded = function() {
    console.log('onDishesLoaded вызван');
    
    // Получаем данные из API сервиса
    const loadedDishes = window.apiService ? window.apiService.getDishes() : [];
    
    if (loadedDishes && loadedDishes.length > 0) {
        initDishes(loadedDishes);
        displayAllDishes();
        
        // Инициализируем фильтры после отображения
        if (typeof initFilters === 'function') {
            setTimeout(initFilters, 100);
        }
    } else {
        console.error('Нет данных для отображения');
    }
};

// Экспортируем функции для фильтров
window.displayDishesInSection = displayDishesInSection;