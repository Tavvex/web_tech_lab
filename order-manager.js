// [file name]: order-manager.js - ИСПРАВЛЕННАЯ ВЕРСИЯ

// Объект для хранения выбранных блюд
const selectedDishes = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

// DOM элементы
let checkoutPanel = null;

// Инициализация
function initOrderManager() {
    console.log('Инициализация Order Manager');
    
    // Находим панель оформления
    checkoutPanel = document.getElementById('checkout-panel');
    
    // Загружаем сохраненный заказ
    loadOrder();
    
    // Настраиваем обработчики событий
    initEventHandlers();
    
    // Обновляем UI
    updateSelectedVisuals();
    updateCheckoutPanel();
}

// Функция для выбора блюда - ОСНОВНАЯ ИСПРАВЛЕННАЯ ФУНКЦИЯ
function selectDish(dishKeyword) {
    console.log('Выбор блюда:', dishKeyword);
    
    // Получаем все блюда
    const allDishes = window.getAllDishes ? window.getAllDishes() : [];
    console.log('Всего блюд:', allDishes.length);
    
    // Ищем блюдо по keyword
    const dish = allDishes.find(d => d.keyword === dishKeyword);
    
    if (!dish) {
        console.error('Блюдо не найдено:', dishKeyword);
        
        // Пробуем найти в dishes.js
        if (typeof dishes !== 'undefined') {
            const localDish = dishes.find(d => d.keyword === dishKeyword);
            if (localDish) {
                console.log('Найдено в dishes.js:', localDish.name);
                updateDishInOrder(localDish);
                return;
            }
        }
        
        alert('Блюдо не найдено!');
        return;
    }
    
    console.log('Найдено блюдо:', dish.name, 'Категория:', dish.category);
    updateDishInOrder(dish);
}

// Обновление блюда в заказе
function updateDishInOrder(dish) {
    // Проверяем категорию
    if (!selectedDishes.hasOwnProperty(dish.category)) {
        console.error('Неизвестная категория:', dish.category);
        return;
    }
    
    // Сохраняем предыдущее значение для лога
    const previousDish = selectedDishes[dish.category];
    console.log('Предыдущее блюдо в этой категории:', previousDish ? previousDish.name : 'нет');
    
    // Обновляем заказ
    selectedDishes[dish.category] = dish;
    
    // Сохраняем в localStorage
    saveOrderToStorage();
    
    // Визуальная обратная связь
    showDishAddedNotification(dish.name);
    
    // Обновляем UI
    updateSelectedVisuals();
    updateCheckoutPanel();
}

// Сохранение в localStorage
function saveOrderToStorage() {
    try {
        // Сохраняем только ID блюд
        const storageOrder = {
            soup: selectedDishes.soup ? selectedDishes.soup.keyword : null,
            main: selectedDishes.main ? selectedDishes.main.keyword : null,
            salad: selectedDishes.salad ? selectedDishes.salad.keyword : null,
            drink: selectedDishes.drink ? selectedDishes.drink.keyword : null,
            dessert: selectedDishes.dessert ? selectedDishes.dessert.keyword : null
        };
        
        localStorage.setItem('businessLunchOrder', JSON.stringify(storageOrder));
        console.log('Заказ сохранен в localStorage:', storageOrder);
    } catch (error) {
        console.error('Ошибка сохранения в localStorage:', error);
    }
}

// Загрузка из localStorage
function loadOrder() {
    try {
        const saved = localStorage.getItem('businessLunchOrder');
        if (!saved) {
            console.log('Нет сохраненного заказа');
            return;
        }
        
        const storageOrder = JSON.parse(saved);
        console.log('Загружен заказ из localStorage:', storageOrder);
        
        // Получаем все блюда
        const allDishes = window.getAllDishes ? window.getAllDishes() : [];
        
        // Восстанавливаем полные объекты блюд
        if (allDishes.length > 0) {
            Object.keys(storageOrder).forEach(category => {
                if (storageOrder[category] && selectedDishes.hasOwnProperty(category)) {
                    const dish = allDishes.find(d => d.keyword === storageOrder[category]);
                    if (dish) {
                        selectedDishes[category] = dish;
                        console.log('Восстановлено блюдо:', category, dish.name);
                    }
                }
            });
        }
    } catch (error) {
        console.error('Ошибка загрузки заказа:', error);
    }
}

// Обновление визуального выделения
function updateSelectedVisuals() {
    console.log('Обновление визуального выделения');
    
    // Снимаем все выделения
    document.querySelectorAll('.dish-card.selected').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Выделяем выбранные блюда
    Object.values(selectedDishes).forEach(dish => {
        if (dish && dish.keyword) {
            const dishCard = document.querySelector(`[data-dish="${dish.keyword}"]`);
            if (dishCard) {
                dishCard.classList.add('selected');
                console.log('Выделено блюдо:', dish.name);
            }
        }
    });
}

// Обновление панели оформления
function updateCheckoutPanel() {
    console.log('Обновление панели оформления');
    
    if (!checkoutPanel) {
        console.log('Панель оформления не найдена на странице');
        return;
    }
    
    // Считаем общую стоимость
    let total = 0;
    Object.values(selectedDishes).forEach(dish => {
        if (dish && dish.price) {
            total += dish.price;
        }
    });
    
    console.log('Общая стоимость:', total);
    
    // Проверяем, есть ли выбранные блюда
    const hasAnySelection = Object.values(selectedDishes).some(dish => dish !== null);
    
    if (!hasAnySelection) {
        checkoutPanel.style.display = 'none';
        return;
    }
    
    checkoutPanel.style.display = 'block';
    
    // Обновляем элементы панели
    const checkoutTotal = checkoutPanel.querySelector('.checkout-total');
    const checkoutMessage = checkoutPanel.querySelector('.checkout-message');
    const checkoutLink = checkoutPanel.querySelector('.checkout-link');
    
    if (checkoutTotal) {
        checkoutTotal.textContent = `${total} ₽`;
    }
    
    // Проверяем комбо (если функция есть)
    if (window.getComboMessage) {
        const comboMessage = window.getComboMessage(selectedDishes);
        if (checkoutMessage) {
            checkoutMessage.textContent = comboMessage.message;
            checkoutMessage.className = `checkout-message ${comboMessage.type}`;
        }
        
        if (checkoutLink) {
            checkoutLink.style.opacity = comboMessage.canProceed ? '1' : '0.5';
            checkoutLink.style.pointerEvents = comboMessage.canProceed ? 'auto' : 'none';
        }
    }
}

// Инициализация обработчиков событий
function initEventHandlers() {
    console.log('Инициализация обработчиков событий');
    
    // Обработчик клика на карточку блюда
    document.addEventListener('click', function(e) {
        const dishCard = e.target.closest('.dish-card');
        const addBtn = e.target.closest('.add-btn');
        
        if (dishCard || addBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = addBtn ? addBtn.closest('.dish-card') : dishCard;
            if (card) {
                const dishKeyword = card.getAttribute('data-dish');
                console.log('Клик по блюду:', dishKeyword);
                selectDish(dishKeyword);
            }
        }
    });
}

// Показ уведомления
function showDishAddedNotification(dishName) {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        ">
            <span>✓ ${dishName} добавлен в заказ</span>
        </div>
    `;
    
    // Стили для анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
            if (style.parentNode) style.remove();
        }, 300);
    }, 2000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== ORDER MANAGER ЗАГРУЖЕН ===');
    
    // Ждем загрузки блюд
    const checkInterval = setInterval(() => {
        if (window.getAllDishes && typeof window.getAllDishes === 'function') {
            clearInterval(checkInterval);
            console.log('Блюда загружены, инициализируем Order Manager');
            initOrderManager();
        }
    }, 100);
    
    // Если через 3 секунды блюда не загрузились, инициализируем без них
    setTimeout(() => {
        if (checkInterval) clearInterval(checkInterval);
        console.log('Таймаут загрузки блюд, инициализируем Order Manager');
        initOrderManager();
    }, 3000);
});

// Экспортируем функции
window.selectedDishes = selectedDishes;
window.selectDish = selectDish;
window.updateCheckoutPanel = updateCheckoutPanel;
window.loadOrder = loadOrder;