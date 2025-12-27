// [file name]: display-dishes.js
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
    
    // Создаем содержимое карточки
    dishCard.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" loading="lazy">
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
    
    // Получаем блюда из API-сервиса
    const allDishes = window.getAllDishes ? window.getAllDishes() : [];
    if (allDishes.length === 0) {
        dishesGrid.innerHTML = '<p class="loading">Загрузка блюд...</p>';
        return;
    }
    
    // Фильтруем блюда по категории и виду
    let filteredDishes = allDishes.filter(dish => dish.category === category);
    
    if (filterKind !== 'all') {
        filteredDishes = filteredDishes.filter(dish => dish.kind === filterKind);
    }
    
    // Проверяем, есть ли блюда для отображения
    if (filteredDishes.length === 0) {
        dishesGrid.innerHTML = '<p class="no-dishes">Блюда не найдены</p>';
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

// Инициализируем отображение блюд после загрузки данных
document.addEventListener('DOMContentLoaded', () => {
    // Ждем загрузки блюд из API
    if (window.loadDishes) {
        window.loadDishes().then(() => {
            displayAllDishes();
        });
    } else {
        console.error('API service не загружен');
    }
});