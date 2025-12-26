// order-manager.js
// Обновлен для работы с данными из API

// Объект для хранения выбранных блюд
const selectedDishes = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

// Локальный массив блюд (заполняется из API)
let dishes = [];

// Функция для инициализации блюд из API
function initDishesForOrder(loadedDishes) {
    if (Array.isArray(loadedDishes)) {
        dishes = loadedDishes;
        console.log(`OrderManager: получено ${dishes.length} блюд`);
    } else {
        console.error('OrderManager: переданные данные не являются массивом');
    }
}

// Ссылки на DOM элементы
let orderBlock = null;
let emptyMessage = null;
let costBlock = null;

// Инициализация DOM элементов
function initDomElements() {
    const form = document.getElementById('lunch-order-form');
    if (!form) {
        console.error('Форма заказа не найдена');
        return;
    }
    
    orderBlock = form.querySelector('.order-block');
    if (!orderBlock) {
        console.error('Блок заказа не найден');
        return;
    }
    
    // Создаем или находим элементы
    emptyMessage = orderBlock.querySelector('.empty-order-message');
    if (!emptyMessage) {
        emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-order-message';
    }
    
    costBlock = document.getElementById('order-cost-block');
    if (!costBlock) {
        costBlock = document.createElement('div');
        costBlock.id = 'order-cost-block';
        costBlock.className = 'order-cost-block';
    }
}

// Обновляем форму заказа
function updateOrderForm() {
    if (!orderBlock) initDomElements();
    if (!orderBlock) return;
    
    // Удаляем все элементы кроме заголовка h3
    const h3 = orderBlock.querySelector('h3');
    const existingElements = orderBlock.querySelectorAll('*:not(h3)');
    existingElements.forEach(el => el.remove());
    
    // Добавляем обратно заголовок, если он был удален
    if (!orderBlock.contains(h3)) {
        const newH3 = document.createElement('h3');
        newH3.textContent = 'Ваш заказ';
        orderBlock.appendChild(newH3);
    }
    
    // Проверяем, выбрано ли хотя бы одно блюдо
    const hasAnySelection = Object.values(selectedDishes).some(dish => dish !== null);
    
    if (!hasAnySelection) {
        // Если ничего не выбрано, показываем одно сообщение
        emptyMessage.textContent = 'Ничего не выбрано';
        orderBlock.appendChild(emptyMessage);
        
        // Скрываем блок стоимости
        if (costBlock.parentNode === orderBlock) {
            orderBlock.removeChild(costBlock);
        }
        
        return;
    }
    
    // Функция для создания элемента выбранного блюда
    function createSelectedDishElement(category, dish, categoryName) {
        const dishDiv = document.createElement('div');
        dishDiv.className = 'selected-dish form-group';
        
        if (dish) {
            dishDiv.innerHTML = `
                <label>${categoryName}</label>
                <div class="selected-dish-info">
                    <span class="dish-name">${dish.name}</span>
                    <span class="dish-price">${dish.price} ₽</span>
                    <button type="button" class="remove-dish-btn" data-category="${category}">✕</button>
                </div>
            `;
        } else {
            dishDiv.innerHTML = `
                <label>${categoryName}</label>
                <div class="dish-not-selected">${getNotSelectedMessage(categoryName)}</div>
            `;
        }
        
        return dishDiv;
    }
    
    // Создаем и добавляем элементы для каждой категории
    orderBlock.appendChild(createSelectedDishElement('soup', selectedDishes.soup, 'Суп'));
    orderBlock.appendChild(createSelectedDishElement('main', selectedDishes.main, 'Главное блюдо'));
    orderBlock.appendChild(createSelectedDishElement('salad', selectedDishes.salad, 'Салат или стартер'));
    orderBlock.appendChild(createSelectedDishElement('drink', selectedDishes.drink, 'Напиток'));
    orderBlock.appendChild(createSelectedDishElement('dessert', selectedDishes.dessert, 'Десерт'));
    
    // Добавляем комментарий
    const commentGroup = document.createElement('div');
    commentGroup.className = 'form-group';
    commentGroup.innerHTML = `
        <label for="comment">Комментарий к заказу</label>
        <textarea id="comment" name="comment" rows="4" placeholder="Ваши пожелания..."></textarea>
    `;
    orderBlock.appendChild(commentGroup);
    
    // Добавляем блок стоимости
    updateOrderCost();
    orderBlock.appendChild(costBlock);
    
    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.remove-dish-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            removeDish(category);
        });
    });
}

// Функция для получения сообщения "не выбрано"
function getNotSelectedMessage(categoryName) {
    switch(categoryName) {
        case 'Суп': return 'Суп не выбран';
        case 'Главное блюдо': return 'Главное блюдо не выбрано';
        case 'Салат или стартер': return 'Салат не выбран';
        case 'Напиток': return 'Напиток не выбран';
        case 'Десерт': return 'Десерт не выбран';
        default: return 'Блюдо не выбрано';
    }
}

// Функция для выбора блюда
function selectDish(dishKeyword) {
    console.log(`Выбор блюда: ${dishKeyword}`);
    
    // Проверяем, загружены ли блюда
    if (dishes.length === 0) {
        console.warn('Блюда еще не загружены из API');
        
        // Пробуем получить блюда из API сервиса
        if (window.apiService && typeof window.apiService.getDishes === 'function') {
            dishes = window.apiService.getDishes();
            console.log(`Загружено ${dishes.length} блюд из apiService`);
        }
        
        if (dishes.length === 0) {
            showNotification('Данные загружаются', 'Пожалуйста, подождите загрузки меню.', '⏳');
            return;
        }
    }
    
    // Ищем блюдо по keyword
    const dish = dishes.find(d => d.keyword === dishKeyword);
    
    if (!dish) {
        console.error(`Блюдо с keyword "${dishKeyword}" не найдено`);
        showNotification('Ошибка', 'Блюдо не найдено в меню.', '❌');
        return;
    }
    
    console.log(`Найдено блюдо: ${dish.name} (категория: ${dish.category})`);
    
    // Проверяем, существует ли категория в selectedDishes
    if (!selectedDishes.hasOwnProperty(dish.category)) {
        console.error(`Категория "${dish.category}" не найдена в selectedDishes`);
        return;
    }
    
    // Добавляем визуальную обратную связь
    const dishCard = document.querySelector(`[data-dish="${dishKeyword}"]`);
    if (dishCard) {
        dishCard.classList.add('selected');
        setTimeout(() => {
            dishCard.classList.remove('selected');
        }, 300);
    }
    
    // Сохраняем выбранное блюдо
    selectedDishes[dish.category] = dish;
    
    // Обновляем форму заказа
    updateOrderForm();
    
    console.log(`Блюдо "${dish.name}" добавлено в заказ`);
}

// Функция для удаления блюда из категории
function removeDish(category) {
    if (selectedDishes.hasOwnProperty(category)) {
        const dishName = selectedDishes[category] ? selectedDishes[category].name : null;
        selectedDishes[category] = null;
        updateOrderForm();
        
        if (dishName) {
            console.log(`Блюдо "${dishName}" удалено из категории ${category}`);
        }
    } else {
        console.error(`Попытка удалить блюдо из несуществующей категории: ${category}`);
    }
}

// Функция для подсчета и отображения стоимости заказа
function updateOrderCost() {
    if (!costBlock) return;
    
    // Вычисляем общую стоимость
    let total = 0;
    Object.values(selectedDishes).forEach(dish => {
        if (dish) {
            total += dish.price;
        }
    });
    
    if (total > 0) {
        costBlock.innerHTML = `
            <div class="total-cost">
                <span class="total-label">Стоимость заказа:</span>
                <span class="total-amount">${total} ₽</span>
            </div>
        `;
        costBlock.style.display = 'block';
    } else {
        costBlock.style.display = 'none';
    }
}

// Вспомогательная функция для показа уведомлений
function showNotification(title, message, icon) {
    // Используем существующую функцию из order-validation если она есть
    if (typeof window.showNotification === 'function') {
        window.showNotification(title, message, icon);
        return;
    }
    
    // Простая реализация на случай отсутствия основной
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        border-left: 4px solid tomato;
    `;
    notification.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">${icon} ${title}</div>
        <div>${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Инициализация обработчиков событий
function initEventHandlers() {
    // Обработчик клика на карточку блюда
    document.addEventListener('click', function(e) {
        // Проверяем, был ли клик на карточке блюда или кнопке "Добавить"
        const dishCard = e.target.closest('.dish-card');
        const addBtn = e.target.closest('.add-btn');
        
        if (dishCard || addBtn) {
            const card = addBtn ? addBtn.closest('.dish-card') : dishCard;
            if (card) {
                const dishKeyword = card.getAttribute('data-dish');
                if (dishKeyword) {
                    selectDish(dishKeyword);
                }
            }
        }
    });
}

// Инициализируем при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Order Manager инициализирован');
    
    // Ждем загрузки блюд из API
    if (window.apiService && typeof window.apiService.getLoadingStatus === 'function') {
        const status = window.apiService.getLoadingStatus();
        
        if (!status.isLoading && status.dishesCount > 0) {
            // Блюда уже загружены
            const loadedDishes = window.apiService.getDishes();
            initDishesForOrder(loadedDishes);
        } else {
            console.log('Ожидание загрузки блюд из API...');
            
            // Проверяем периодически
            const checkInterval = setInterval(() => {
                const currentStatus = window.apiService.getLoadingStatus();
                if (!currentStatus.isLoading && currentStatus.dishesCount > 0) {
                    clearInterval(checkInterval);
                    const loadedDishes = window.apiService.getDishes();
                    initDishesForOrder(loadedDishes);
                }
            }, 500);
        }
    }
    
    initDomElements();
    initEventHandlers();
    updateOrderForm();
});

// Обработчик для кнопки сброса формы
document.addEventListener('DOMContentLoaded', function() {
    const resetBtn = document.querySelector('.reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // Сброс выбранных блюд
            Object.keys(selectedDishes).forEach(key => {
                selectedDishes[key] = null;
            });
            updateOrderForm();
            console.log('Форма заказа сброшена');
        });
    }
});

// Экспортируем API Order Manager
window.orderManager = {
    selectedDishes,
    initDishesForOrder,
    selectDish,
    removeDish,
    updateOrderForm,
    updateOrderCost,
    getDishes: () => dishes
};