// [file name]: filters.js
// Объект для хранения активных фильтров для каждой категории
const activeFilters = {
    soup: 'all',
    main: 'all',
    salad: 'all',
    drink: 'all',
    dessert: 'all'
};

// Функция для получения индекса категории по имени
function getCategoryIndex(category) {
    const categoryMap = {
        'soup': 0,
        'main': 1,
        'salad': 2,
        'drink': 3,
        'dessert': 4
    };
    return categoryMap[category];
}

// Функция для получения имени категории по индексу
function getCategoryNameByIndex(index) {
    const categoryNames = ['soup', 'main', 'salad', 'drink', 'dessert'];
    return categoryNames[index];
}

// Функция для обновления фильтров в определенной секции
function updateFilterInSection(sectionIndex, filterKind) {
    const category = getCategoryNameByIndex(sectionIndex);
    activeFilters[category] = filterKind;
    
    // Обновляем отображение блюд
    switch(category) {
        case 'soup':
            displayDishesInSection(0, 'soup', filterKind);
            break;
        case 'main':
            displayDishesInSection(1, 'main', filterKind);
            break;
        case 'salad':
            displayDishesInSection(2, 'salad', filterKind);
            break;
        case 'drink':
            displayDishesInSection(3, 'drink', filterKind);
            break;
        case 'dessert':
            displayDishesInSection(4, 'dessert', filterKind);
            break;
    }
}

// Функция для обработки клика на фильтр
function handleFilterClick(e) {
    const filterBtn = e.target.closest('.filter-btn');
    if (!filterBtn) return;
    
    // Находим родительскую секцию
    const section = filterBtn.closest('section');
    if (!section) return;
    
    // Находим индекс секции
    const sections = document.querySelectorAll('main section');
    const sectionIndex = Array.from(sections).indexOf(section);
    
    // Получаем значение фильтра
    const filterKind = filterBtn.getAttribute('data-kind');
    
    // Снимаем активный класс со всех кнопок в этой секции
    const allFilterBtns = section.querySelectorAll('.filter-btn');
    allFilterBtns.forEach(btn => btn.classList.remove('active'));
    
    // Проверяем, не кликнули ли на уже активный фильтр
    const category = getCategoryNameByIndex(sectionIndex);
    if (activeFilters[category] === filterKind && filterKind !== 'all') {
        // Если кликнули на активный фильтр (не "Все"), сбрасываем на "Все"
        filterBtn.classList.remove('active');
        const allBtn = section.querySelector('.filter-btn[data-kind="all"]');
        if (allBtn) {
            allBtn.classList.add('active');
            updateFilterInSection(sectionIndex, 'all');
        }
    } else {
        // Активируем выбранную кнопку
        filterBtn.classList.add('active');
        updateFilterInSection(sectionIndex, filterKind);
    }
}

// Функция для инициализации обработчиков фильтров
function initFilters() {
    // Добавляем обработчик клика на все кнопки фильтров
    document.addEventListener('click', handleFilterClick);
}

// Инициализируем при загрузке страницы
document.addEventListener('DOMContentLoaded', initFilters);