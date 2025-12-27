// [file name]: order-checkout.js - ИСПРАВЛЕННАЯ ВЕРСИЯ

// Текущий заказ
let currentOrder = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

// DOM элементы
let orderItemsContainer;
let emptyOrderMessage;
let totalAmountElement;
let submitOrderBtn;

// Инициализация
function initCheckoutPage() {
    console.log('Инициализация страницы оформления');
    
    // Получаем DOM элементы
    orderItemsContainer = document.getElementById('order-items');
    emptyOrderMessage = document.getElementById('empty-order-message');
    totalAmountElement = document.getElementById('total-amount');
    submitOrderBtn = document.getElementById('submit-order-btn');
    
    // Загружаем заказ
    loadOrderForCheckout();
    
    // Настраиваем обработчики
    setupEventHandlers();
    
    // Обновляем отображение
    updateOrderDisplay();
}

// Загрузка заказа для страницы оформления
function loadOrderForCheckout() {
    console.log('Загрузка заказа для оформления');
    
    try {
        // Загружаем из localStorage
        const saved = localStorage.getItem('businessLunchOrder');
        if (!saved) {
            console.log('Нет сохраненного заказа');
            return;
        }
        
        const storageOrder = JSON.parse(saved);
        console.log('Загружен заказ:', storageOrder);
        
        // Получаем все блюда
        const allDishes = window.getAllDishes ? window.getAllDishes() : [];
        if (allDishes.length === 0) {
            console.log('Блюда еще не загружены');
            // Попробуем загрузить
            if (window.loadDishes) {
                window.loadDishes().then(() => {
                    loadOrderForCheckout();
                });
            }
            return;
        }
        
        // Восстанавливаем полные объекты блюд
        Object.keys(storageOrder).forEach(category => {
            if (storageOrder[category] && currentOrder.hasOwnProperty(category)) {
                const dish = allDishes.find(d => d.keyword === storageOrder[category]);
                if (dish) {
                    currentOrder[category] = dish;
                    console.log('Восстановлено блюдо:', category, dish.name);
                }
            }
        });
        
    } catch (error) {
        console.error('Ошибка загрузки заказа:', error);
    }
}

// Обновление отображения заказа
function updateOrderDisplay() {
    console.log('Обновление отображения заказа:', currentOrder);
    
    // Проверяем, есть ли выбранные блюда
    const hasAnySelection = Object.values(currentOrder).some(dish => dish !== null);
    
    if (!hasAnySelection) {
        console.log('Заказ пуст');
        if (emptyOrderMessage) {
            emptyOrderMessage.style.display = 'block';
        }
        if (orderItemsContainer) {
            orderItemsContainer.style.display = 'none';
        }
        if (submitOrderBtn) {
            submitOrderBtn.disabled = true;
        }
        return;
    }
    
    console.log('Есть выбранные блюда');
    
    if (emptyOrderMessage) {
        emptyOrderMessage.style.display = 'none';
    }
    if (orderItemsContainer) {
        orderItemsContainer.style.display = 'block';
    }
    
    // Очищаем контейнеры
    ['soup', 'main', 'salad', 'drink', 'dessert'].forEach(category => {
        const container = document.getElementById(`${category}-items`);
        if (container) {
            container.innerHTML = '';
        }
    });
    
    // Отображаем блюда
    displayOrderItems();
    
    // Обновляем стоимость
    updateTotalCost();
    
    // Проверяем комбо и обновляем кнопку
    checkComboAndUpdateButton();
}

// Отображение блюд заказа
function displayOrderItems() {
    console.log('Отображение блюд заказа');
    
    // Для каждой категории
    ['soup', 'main', 'salad', 'drink', 'dessert'].forEach(category => {
        const container = document.getElementById(`${category}-items`);
        if (!container) return;
        
        const dish = currentOrder[category];
        
        if (dish) {
            // Создаем карточку блюда
            const dishCard = document.createElement('div');
            dishCard.className = 'dish-card';
            
            // Используем изображение по умолчанию, если нет
            const imageSrc = dish.image || 'images/default-dish.jpg';
            
            dishCard.innerHTML = `
                <img src="${imageSrc}" alt="${dish.name}" loading="lazy" 
                     style="width: 100%; height: 120px; object-fit: cover; border-radius: 10px; margin-bottom: 10px;">
                <p class="price" style="font-size: 1.2rem; font-weight: 700; color: #2c3e50; margin-bottom: 5px;">
                    ${dish.price} ₽
                </p>
                <p class="name" style="font-size: 1rem; font-weight: 500; margin-bottom: 5px; flex-grow: 1; line-height: 1.3;">
                    ${dish.name}
                </p>
                <p class="weight" style="color: #7f8c8d; margin-bottom: 10px; font-size: 0.85rem;">
                    ${dish.count}
                </p>
                <button type="button" class="remove-btn" data-category="${category}" 
                        style="background-color: #e74c3c; color: white; border: none; padding: 8px 15px; 
                               border-radius: 5px; cursor: pointer; font-weight: 500; margin-top: 5px; 
                               width: 100%; font-size: 0.9rem;">
                    Удалить
                </button>
            `;
            
            // Добавляем обработчик удаления
            const removeBtn = dishCard.querySelector('.remove-btn');
            removeBtn.addEventListener('click', function() {
                removeDishFromOrder(category);
            });
            
            container.appendChild(dishCard);
            
        } else {
            // Если блюдо не выбрано
            container.innerHTML = `
                <div class="no-dish-message">
                    <p>${getCategoryName(category)} не выбраны</p>
                </div>
            `;
        }
    });
}

// Получение названия категории
function getCategoryName(category) {
    const names = {
        'soup': 'Супы',
        'main': 'Главные блюда',
        'salad': 'Салаты и стартеры',
        'drink': 'Напитки',
        'dessert': 'Десерты'
    };
    return names[category] || category;
}

// Удаление блюда из заказа
function removeDishFromOrder(category) {
    console.log('Удаление блюда:', category);
    
    // Обновляем текущий заказ
    currentOrder[category] = null;
    
    // Обновляем localStorage
    updateLocalStorage();
    
    // Обновляем отображение
    updateOrderDisplay();
    
    // Показываем уведомление
    showNotification('Блюдо удалено из заказа');
}

// Обновление localStorage
function updateLocalStorage() {
    try {
        const storageOrder = {
            soup: currentOrder.soup ? currentOrder.soup.keyword : null,
            main: currentOrder.main ? currentOrder.main.keyword : null,
            salad: currentOrder.salad ? currentOrder.salad.keyword : null,
            drink: currentOrder.drink ? currentOrder.drink.keyword : null,
            dessert: currentOrder.dessert ? currentOrder.dessert.keyword : null
        };
        
        localStorage.setItem('businessLunchOrder', JSON.stringify(storageOrder));
        console.log('LocalStorage обновлен:', storageOrder);
        
    } catch (error) {
        console.error('Ошибка обновления localStorage:', error);
    }
}

// Обновление общей стоимости
function updateTotalCost() {
    let total = 0;
    
    Object.values(currentOrder).forEach(dish => {
        if (dish && dish.price) {
            total += dish.price;
        }
    });
    
    console.log('Общая стоимость:', total);
    
    if (totalAmountElement) {
        totalAmountElement.textContent = `${total} ₽`;
    }
}

// Проверка комбо и обновление кнопки
function checkComboAndUpdateButton() {
    if (!window.checkCombo || !submitOrderBtn) return;
    
    const comboResult = window.checkCombo(currentOrder);
    console.log('Результат проверки комбо:', comboResult);
    
    if (comboResult.isValid) {
        submitOrderBtn.disabled = false;
        submitOrderBtn.title = '';
        console.log('Комбо валидно, кнопка активирована');
    } else {
        submitOrderBtn.disabled = true;
        submitOrderBtn.title = comboResult.message;
        console.log('Комбо невалидно:', comboResult.message);
    }
}

// Настройка обработчиков событий
function setupEventHandlers() {
    console.log('Настройка обработчиков событий');
    
    // Обработчик для переключения времени доставки
    const deliveryTypeNow = document.getElementById('delivery_type_now');
    const deliveryTypeByTime = document.getElementById('delivery_type_by_time');
    const deliveryTimeGroup = document.getElementById('delivery-time-group');
    
    if (deliveryTypeNow && deliveryTypeByTime && deliveryTimeGroup) {
        deliveryTypeNow.addEventListener('change', function() {
            deliveryTimeGroup.style.display = 'none';
        });
        
        deliveryTypeByTime.addEventListener('change', function() {
            deliveryTimeGroup.style.display = 'block';
        });
    }
    
    // Кнопка "Вернуться к выбору"
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'build-lunch.html';
        });
    }
    
    // Обработчик отправки формы
    const form = document.getElementById('checkout-order-form');
    if (form) {
        form.addEventListener('submit', handleOrderSubmit);
    }
}

// Обработчик отправки заказа
async function handleOrderSubmit(event) {
    event.preventDefault();
    console.log('Обработка отправки заказа');
    
    // Проверяем комбо
    if (!window.checkCombo) {
        alert('Ошибка: не удалось проверить состав заказа');
        return;
    }
    
    const comboResult = window.checkCombo(currentOrder);
    if (!comboResult.isValid) {
        alert('Заказ не соответствует ни одному доступному комбо. Пожалуйста, выберите другое сочетание блюд.');
        return;
    }
    
    // Отключаем кнопку отправки
    if (submitOrderBtn) {
        submitOrderBtn.disabled = true;
        submitOrderBtn.textContent = 'Отправка...';
    }
    
    try {
        // Здесь будет отправка на API
        console.log('Заказ готов к отправке:', currentOrder);
        
        // Симуляция отправки
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        alert('Заказ успешно оформлен!');
        
        // Очищаем localStorage
        localStorage.removeItem('businessLunchOrder');
        
        // Перенаправляем на страницу заказов
        setTimeout(() => {
            window.location.href = 'orders.html';
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка оформления заказа:', error);
        alert(`Ошибка при оформлении заказа: ${error.message}`);
        
        // Включаем кнопку отправки
        if (submitOrderBtn) {
            submitOrderBtn.disabled = false;
            submitOrderBtn.textContent = 'Отправить заказ';
        }
    }
}

// Показ уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        ">
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница оформления загружена');
    
    // Ждем загрузки блюд
    const checkInterval = setInterval(() => {
        if (window.getAllDishes && typeof window.getAllDishes === 'function') {
            clearInterval(checkInterval);
            console.log('Блюда загружены, инициализируем страницу оформления');
            initCheckoutPage();
        }
    }, 100);
    
    // Таймаут
    setTimeout(() => {
        if (checkInterval) clearInterval(checkInterval);
        console.log('Таймаут, инициализируем страницу оформления');
        initCheckoutPage();
    }, 3000);
});