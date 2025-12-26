// display-dishes.js - ОБНОВЛЕННЫЙ
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
        <img src="${dish.image}" alt="${dish.name}">
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

// Инициализируем отображение блюд при загрузке страницы
document.addEventListener('DOMContentLoaded', displayAllDishes);