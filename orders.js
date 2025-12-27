// [file name]: orders.js - ПРОСТАЯ РАБОЧАЯ ВЕРСИЯ
// Отображение заказов из localStorage

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница заказов загружена');
    loadAndDisplayOrders();
});

// Загрузка и отображение заказов
function loadAndDisplayOrders() {
    console.log('Загрузка заказов...');
    
    // Показываем загрузку
    document.getElementById('loading').style.display = 'block';
    document.getElementById('no-orders').style.display = 'none';
    document.getElementById('orders-list').style.display = 'none';
    
    // Загружаем заказы
    let orders = [];
    
    try {
        // Пробуем разные источники
        if (window.getOrdersFromStorage) {
            orders = window.getOrdersFromStorage();
        } else if (window.getOrders) {
            orders = window.getOrders();
        } else {
            // Прямое чтение из localStorage
            const saved = localStorage.getItem('businessLunchOrders');
            orders = saved ? JSON.parse(saved) : [];
        }
        
        console.log('Загружено заказов:', orders.length);
        
    } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
        orders = [];
    }
    
    // Скрываем загрузку
    document.getElementById('loading').style.display = 'none';
    
    // Если есть заказы - отображаем
    if (orders.length > 0) {
        displayOrders(orders);
        document.getElementById('orders-list').style.display = 'block';
    } else {
        // Показываем "нет заказов"
        document.getElementById('no-orders').style.display = 'flex';
    }
}

// Отображение заказов
function displayOrders(orders) {
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = '';
    
    // Сортируем по дате (новые сначала)
    orders.sort((a, b) => {
        const dateA = new Date(a.created_at || a.date || 0);
        const dateB = new Date(b.created_at || b.date || 0);
        return dateB - dateA;
    });
    
    // Создаем карточки для каждого заказа
    orders.forEach((order, index) => {
        const orderElement = createOrderCard(order, index + 1);
        ordersList.appendChild(orderElement);
    });
    
    console.log('Отображено заказов:', orders.length);
}

// Создание карточки заказа
function createOrderCard(order, orderNumber) {
    const card = document.createElement('div');
    card.className = 'order-card';
    card.dataset.orderId = order.id || orderNumber;
    
    // Форматируем дату
    let dateStr = 'Не указана';
    if (order.created_at) {
        const date = new Date(order.created_at);
        dateStr = date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } else if (order.date) {
        dateStr = order.date;
    }
    
    // Получаем состав заказа
    const dishesSummary = getOrderSummary(order);
    
    // Время доставки
    const deliveryTime = order.delivery_type === 'by_time' && order.delivery_time 
        ? `Доставка к ${order.delivery_time}`
        : 'Как можно скорее (с 7:00 до 23:00)';
    
    // Стоимость
    const totalPrice = order.total_price || 'Не указана';
    
    card.innerHTML = `
        <div class="order-header">
            <div class="order-info">
                <h3>Заказ № <span class="order-number">${orderNumber}</span></h3>
                <div class="order-date">${dateStr}</div>
            </div>
            <div class="order-total">${totalPrice} ₽</div>
        </div>
        
        <div class="order-details">
            <div class="dishes-summary">
                <strong>Состав:</strong> ${dishesSummary}
            </div>
            <div class="order-delivery-time">
                <strong>Доставка:</strong> ${deliveryTime}
            </div>
            <div class="order-customer">
                <strong>Клиент:</strong> ${order.full_name || 'Не указано'} (${order.phone || 'нет телефона'})
            </div>
        </div>
        
        <div class="order-actions">
            <button class="btn-icon btn-view" onclick="viewOrder(${order.id || orderNumber})" title="Подробнее">
                <i class="bi bi-eye"></i>
            </button>
            <button class="btn-icon btn-delete" onclick="deleteOrder(${order.id || orderNumber})" title="Удалить">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
    
    return card;
}

// Получение текстового описания заказа
function getOrderSummary(order) {
    const dishes = [];
    
    if (order.soup_name) dishes.push(`Суп: ${order.soup_name}`);
    if (order.main_course_name) dishes.push(`Главное: ${order.main_course_name}`);
    if (order.salad_name) dishes.push(`Салат: ${order.salad_name}`);
    if (order.drink_name) dishes.push(`Напиток: ${order.drink_name}`);
    if (order.dessert_name) dishes.push(`Десерт: ${order.dessert_name}`);
    
    // Альтернативный вариант (старые данные)
    if (dishes.length === 0) {
        if (order.soup_id) dishes.push('Суп');
        if (order.main_course_id) dishes.push('Главное блюдо');
        if (order.salad_id) dishes.push('Салат');
        if (order.drink_id) dishes.push('Напиток');
        if (order.dessert_id) dishes.push('Десерт');
    }
    
    return dishes.length > 0 ? dishes.join(', ') : 'Состав не указан';
}

// Функции для кнопок (простые)
function viewOrder(orderId) {
    alert(`Просмотр заказа #${orderId}\nДетали будут в модальном окне (реализуйте позже)`);
}

function deleteOrder(orderId) {
    if (confirm(`Удалить заказ #${orderId}?`)) {
        // Удаляем из localStorage
        const orders = JSON.parse(localStorage.getItem('businessLunchOrders') || '[]');
        const filteredOrders = orders.filter(order => order.id !== orderId);
        localStorage.setItem('businessLunchOrders', JSON.stringify(filteredOrders));
        
        // Перезагружаем список
        loadAndDisplayOrders();
        
        alert('Заказ удален!');
    }
}

// Экспортируем для глобального доступа
window.loadAndDisplayOrders = loadAndDisplayOrders;