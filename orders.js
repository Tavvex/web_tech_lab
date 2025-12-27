// [file name]: orders.js
// Глобальные переменные
let allOrders = [];
let allDishes = [];
let currentOrderId = null;

// DOM элементы
const ordersList = document.getElementById('orders-list');
const loadingElement = document.getElementById('loading');
const noOrdersElement = document.getElementById('no-orders');
const viewModal = document.getElementById('view-modal');
const editModal = document.getElementById('edit-modal');
const deleteModal = document.getElementById('delete-modal');
const notification = document.getElementById('notification');

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Загружаем блюда и заказы
        await Promise.all([loadDishes(), loadOrders()]);
        
        // Инициализируем обработчики событий
        initEventHandlers();
        
        // Скрываем загрузку
        loadingElement.style.display = 'none';
        
        // Показываем список заказов или сообщение "нет заказов"
        if (allOrders.length > 0) {
            ordersList.style.display = 'block';
            displayOrders();
        } else {
            noOrdersElement.style.display = 'flex';
        }
    } catch (error) {
        console.error('Ошибка при загрузке:', error);
        loadingElement.innerHTML = '<p style="color: #e74c3c;">Ошибка при загрузке заказов</p>';
        showNotification('Ошибка при загрузке заказов', 'error');
    }
});

// Загрузка данных о блюдах
async function loadDishes() {
    try {
        allDishes = await getDishes();
        console.log('Загружено блюд:', allDishes.length);
    } catch (error) {
        console.error('Ошибка при загрузке блюд:', error);
        throw error;
    }
}

// Загрузка заказов
async function loadOrders() {
    try {
        allOrders = await getOrders();
        
        // Сортируем по дате (новые сначала)
        allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        console.log('Загружено заказов:', allOrders.length);
    } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
        throw error;
    }
}

// Отображение заказов
function displayOrders() {
    ordersList.innerHTML = '';
    
    allOrders.forEach((order, index) => {
        const orderElement = createOrderElement(order, index + 1);
        ordersList.appendChild(orderElement);
    });
}

// Создание элемента заказа
function createOrderElement(order, orderNumber) {
    const orderElement = document.createElement('div');
    orderElement.className = 'order-card';
    orderElement.dataset.orderId = order.id;
    
    // Форматируем дату
    const orderDate = new Date(order.created_at);
    const formattedDate = orderDate.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Получаем названия блюд
    const dishesSummary = getDishesSummary(order);
    
    // Форматируем время доставки
    const deliveryTime = formatDeliveryTime(order);
    
    // Форматируем стоимость
    const totalPrice = calculateOrderTotal(order);
    
    orderElement.innerHTML = `
        <div class="order-header">
            <div class="order-info">
                <h3>Заказ № <span class="order-number">${orderNumber}</span></h3>
                <div class="order-date">${formattedDate}</div>
            </div>
            <div class="order-total">${totalPrice} ₽</div>
        </div>
        
        <div class="order-details">
            <div class="dishes-summary">${dishesSummary}</div>
            <div class="order-delivery-time">${deliveryTime}</div>
        </div>
        
        <div class="order-actions">
            <button class="btn-icon btn-view" data-action="view" data-order-id="${order.id}" title="Подробнее">
                <i class="bi bi-eye"></i>
            </button>
            <button class="btn-icon btn-edit" data-action="edit" data-order-id="${order.id}" title="Редактировать">
                <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-icon btn-delete" data-action="delete" data-order-id="${order.id}" title="Удалить">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
    
    return orderElement;
}

// Получение краткого описания блюд
function getDishesSummary(order) {
    const dishNames = [];
    
    // Находим названия блюд по их ID
    if (order.soup_id) {
        const dish = allDishes.find(d => d.id === order.soup_id);
        if (dish) dishNames.push(dish.name);
    }
    
    if (order.main_course_id) {
        const dish = allDishes.find(d => d.id === order.main_course_id);
        if (dish) dishNames.push(dish.name);
    }
    
    if (order.salad_id) {
        const dish = allDishes.find(d => d.id === order.salad_id);
        if (dish) dishNames.push(dish.name);
    }
    
    if (order.drink_id) {
        const dish = allDishes.find(d => d.id === order.drink_id);
        if (dish) dishNames.push(dish.name);
    }
    
    if (order.dessert_id) {
        const dish = allDishes.find(d => d.id === order.dessert_id);
        if (dish) dishNames.push(dish.name);
    }
    
    return dishNames.join(', ');
}

// Форматирование времени доставки
function formatDeliveryTime(order) {
    if (order.delivery_type === 'by_time' && order.delivery_time) {
        return `Доставка к ${order.delivery_time}`;
    } else {
        return 'Как можно скорее (с 7:00 до 23:00)';
    }
}

// Расчет общей стоимости заказа
function calculateOrderTotal(order) {
    let total = 0;
    
    // Находим цены блюд по их ID
    if (order.soup_id) {
        const dish = allDishes.find(d => d.id === order.soup_id);
        if (dish) total += parseInt(dish.price);
    }
    
    if (order.main_course_id) {
        const dish = allDishes.find(d => d.id === order.main_course_id);
        if (dish) total += parseInt(dish.price);
    }
    
    if (order.salad_id) {
        const dish = allDishes.find(d => d.id === order.salad_id);
        if (dish) total += parseInt(dish.price);
    }
    
    if (order.drink_id) {
        const dish = allDishes.find(d => d.id === order.drink_id);
        if (dish) total += parseInt(dish.price);
    }
    
    if (order.dessert_id) {
        const dish = allDishes.find(d => d.id === order.dessert_id);
        if (dish) total += parseInt(dish.price);
    }
    
    return total;
}

// Показать модальное окно
function showModal(modal) {
    modal.classList.add('active');
}

// Скрыть модальное окно
function hideModal(modal) {
    modal.classList.remove('active');
}

// Показать уведомление
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    // Автоматически скрыть через 3 секунды
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Открыть окно просмотра деталей заказа
function openViewModal(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    currentOrderId = orderId;
    
    // Заполняем данные
    document.getElementById('detail-id').textContent = order.id;
    
    const orderDate = new Date(order.created_at);
    document.getElementById('detail-created-at').textContent = 
        orderDate.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    
    document.getElementById('detail-full-name').textContent = order.full_name;
    document.getElementById('detail-email').textContent = order.email;
    document.getElementById('detail-phone').textContent = order.phone;
    document.getElementById('detail-address').textContent = order.delivery_address;
    document.getElementById('detail-delivery-time').textContent = formatDeliveryTime(order);
    document.getElementById('detail-comment').textContent = order.comment || '—';
    
    // Заполняем список блюд
    const dishesList = document.getElementById('detail-dishes');
    dishesList.innerHTML = '';
    
    const dishIds = [
        { id: order.soup_id, label: 'Суп' },
        { id: order.main_course_id, label: 'Главное блюдо' },
        { id: order.salad_id, label: 'Салат' },
        { id: order.drink_id, label: 'Напиток' },
        { id: order.dessert_id, label: 'Десерт' }
    ];
    
    dishIds.forEach(item => {
        if (item.id) {
            const dish = allDishes.find(d => d.id === item.id);
            if (dish) {
                const dishElement = document.createElement('div');
                dishElement.className = 'dish-item';
                dishElement.innerHTML = `
                    <span class="dish-name">${item.label}: ${dish.name}</span>
                    <span class="dish-price">${dish.price} ₽</span>
                `;
                dishesList.appendChild(dishElement);
            }
        }
    });
    
    // Отображаем стоимость
    document.getElementById('detail-total').textContent = `${calculateOrderTotal(order)} ₽`;
    
    // Показываем модальное окно
    showModal(viewModal);
}

// Открыть окно редактирования заказа
async function openEditModal(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    currentOrderId = orderId;
    
    // Заполняем форму
    document.getElementById('edit-id').value = order.id;
    document.getElementById('edit-full-name').value = order.full_name;
    document.getElementById('edit-email').value = order.email;
    document.getElementById('edit-phone').value = order.phone;
    document.getElementById('edit-delivery-address').value = order.delivery_address;
    document.getElementById('edit-comment').value = order.comment || '';
    document.getElementById('edit-subscribe').checked = order.subscribe === 1;
    
    // Устанавливаем тип доставки
    const deliveryTypeNow = document.querySelector('input[name="delivery_type"][value="now"]');
    const deliveryTypeByTime = document.querySelector('input[name="delivery_type"][value="by_time"]');
    
    if (order.delivery_type === 'by_time') {
        deliveryTypeByTime.checked = true;
        document.getElementById('edit-delivery-time-group').style.display = 'block';
        document.getElementById('edit-delivery-time').value = order.delivery_time || '';
    } else {
        deliveryTypeNow.checked = true;
        document.getElementById('edit-delivery-time-group').style.display = 'none';
    }
    
    // Показываем модальное окно
    showModal(editModal);
}

// Открыть окно удаления заказа
function openDeleteModal(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    currentOrderId = orderId;
    
    // Заполняем номер заказа
    const orderNumber = allOrders.findIndex(o => o.id === orderId) + 1;
    document.getElementById('delete-order-number').textContent = `№${orderNumber}`;
    
    // Показываем модальное окно
    showModal(deleteModal);
}

// Сохранение изменений заказа
async function saveOrderChanges() {
    const orderId = currentOrderId;
    const form = document.getElementById('edit-order-form');
    
    // Собираем данные формы
    const formData = new FormData(form);
    const deliveryType = formData.get('delivery_type');
    
    // Валидация
    if (deliveryType === 'by_time' && !formData.get('delivery_time')) {
        showNotification('Укажите время доставки', 'error');
        return;
    }
    
    // Подготавливаем данные для отправки
    const updateData = {
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        delivery_address: formData.get('delivery_address'),
        delivery_type: deliveryType,
        subscribe: formData.get('subscribe') ? 1 : 0
    };
    
    if (deliveryType === 'by_time') {
        updateData.delivery_time = formData.get('delivery_time');
    }
    
    const comment = formData.get('comment');
    if (comment) {
        updateData.comment = comment;
    }
    
    try {
        // Отправляем запрос на обновление
        await updateOrder(orderId, updateData);
        
        // Обновляем локальные данные
        const orderIndex = allOrders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            allOrders[orderIndex] = {
                ...allOrders[orderIndex],
                ...updateData
            };
        }
        
        // Обновляем отображение
        displayOrders();
        
        // Закрываем модальное окно
        hideModal(editModal);
        
        // Показываем уведомление
        showNotification('Заказ успешно изменён');
    } catch (error) {
        console.error('Ошибка при обновлении заказа:', error);
        showNotification('Ошибка при сохранении изменений', 'error');
    }
}

// Удаление заказа
async function deleteCurrentOrder() {
    const orderId = currentOrderId;
    
    try {
        // Отправляем запрос на удаление
        await deleteOrder(orderId);
        
        // Удаляем из локальных данных
        allOrders = allOrders.filter(o => o.id !== orderId);
        
        // Обновляем отображение
        displayOrders();
        
        // Проверяем, остались ли заказы
        if (allOrders.length === 0) {
            ordersList.style.display = 'none';
            noOrdersElement.style.display = 'flex';
        }
        
        // Закрываем модальное окно
        hideModal(deleteModal);
        
        // Показываем уведомление
        showNotification('Заказ успешно удалён');
    } catch (error) {
        console.error('Ошибка при удалении заказа:', error);
        showNotification('Ошибка при удалении заказа', 'error');
    }
}

// Инициализация обработчиков событий
function initEventHandlers() {
    // Обработчики для кнопок заказов (делегирование)
    ordersList.addEventListener('click', function(e) {
        const button = e.target.closest('[data-action]');
        if (!button) return;
        
        const action = button.dataset.action;
        const orderId = parseInt(button.dataset.orderId);
        
        switch (action) {
            case 'view':
                openViewModal(orderId);
                break;
            case 'edit':
                openEditModal(orderId);
                break;
            case 'delete':
                openDeleteModal(orderId);
                break;
        }
    });
    
    // Закрытие модальных окон
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            hideModal(modal);
        });
    });
    
    // Кнопка "ОК" в окне просмотра
    document.querySelector('.modal-footer .close-modal').addEventListener('click', function() {
        hideModal(viewModal);
    });
    
    // Кнопки в окне редактирования
    document.getElementById('cancel-edit').addEventListener('click', function() {
        hideModal(editModal);
    });
    
    document.getElementById('save-edit').addEventListener('click', saveOrderChanges);
    
    // Кнопки в окне удаления
    document.getElementById('cancel-delete').addEventListener('click', function() {
        hideModal(deleteModal);
    });
    
    document.getElementById('confirm-delete').addEventListener('click', deleteCurrentOrder);
    
    // Переключение типа доставки в форме редактирования
    document.querySelectorAll('input[name="delivery_type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const timeGroup = document.getElementById('edit-delivery-time-group');
            if (this.value === 'by_time') {
                timeGroup.style.display = 'block';
            } else {
                timeGroup.style.display = 'none';
            }
        });
    });
    
    // Закрытие модальных окон по клику на фон
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal(this);
            }
        });
    });
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                hideModal(modal);
            });
        }
    });
    if (typeof window.checkCurrentOrder === 'function') {
    // Обновляем updateCheckoutPanel для использования новой валидации
    const originalUpdateCheckoutPanel = window.updateCheckoutPanel;
    
    window.updateCheckoutPanel = function() {
        // Вызываем оригинальную функцию
        if (originalUpdateCheckoutPanel) {
            originalUpdateCheckoutPanel();
        }
        
        // Дополнительно обновляем кнопку через новую валидацию
        if (typeof window.updateSubmitButton === 'function') {
            setTimeout(window.updateSubmitButton, 100);
        }
    };
}

// Обновляем selectDish для синхронизации
const originalSelectDish = window.selectDish;
window.selectDish = function(dishKeyword) {
    if (originalSelectDish) {
        originalSelectDish(dishKeyword);
    }
    
    // После выбора блюда проверяем комбо
    setTimeout(() => {
        if (typeof window.checkCurrentOrder === 'function') {
            const result = window.checkCurrentOrder();
            console.log('Проверка комбо после выбора блюда:', result);
        }
        
        if (typeof window.updateSubmitButton === 'function') {
            window.updateSubmitButton();
        }
    }, 200);
};
}