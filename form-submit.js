// [file name]: form-submit.js - УПРОЩЕННАЯ ВЕРСИЯ
// Сохранение заказа в localStorage

// Загружаем блюда
async function loadDishesForForm() {
    try {
        if (window.getAllDishes) {
            return window.getAllDishes();
        }
        return [];
    } catch (error) {
        console.error('Ошибка загрузки блюд:', error);
        return [];
    }
}

// Обработчик отправки формы
async function handleFormSubmit(event) {
    event.preventDefault();
    console.log('=== ОТПРАВКА ФОРМЫ ЗАКАЗА ===');
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Получаем текущий заказ
    const selectedDishes = window.selectedDishes || {};
    
    // Проверяем, выбраны ли блюда
    const hasSelectedDishes = Object.values(selectedDishes).some(dish => dish !== null);
    if (!hasSelectedDishes) {
        alert('Пожалуйста, выберите хотя бы одно блюдо');
        return;
    }
    
    // Проверяем комбо
    if (window.checkCombo) {
        const comboResult = window.checkCombo(selectedDishes);
        if (!comboResult.isValid) {
            alert('Заказ не соответствует ни одному варианту ланча. Пожалуйста, выберите другой набор блюд.');
            return;
        }
    }
    
    // Подготавливаем данные
    const orderData = {
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        delivery_address: formData.get('delivery_address'),
        delivery_type: formData.get('delivery_type'),
        subscribe: formData.get('subscribe') ? 1 : 0
    };
    
    // Добавляем время доставки
    if (formData.get('delivery_type') === 'by_time' && formData.get('delivery_time')) {
        orderData.delivery_time = formData.get('delivery_time');
    }
    
    // Добавляем комментарий
    const comment = formData.get('comment');
    if (comment && comment.trim() !== '') {
        orderData.comment = comment;
    }
    
    // Добавляем выбранные блюда
    if (selectedDishes.soup) {
        orderData.soup_id = selectedDishes.soup.keyword;
        orderData.soup_name = selectedDishes.soup.name;
        orderData.soup_price = selectedDishes.soup.price;
    }
    
    if (selectedDishes.main) {
        orderData.main_course_id = selectedDishes.main.keyword;
        orderData.main_course_name = selectedDishes.main.name;
        orderData.main_course_price = selectedDishes.main.price;
    }
    
    if (selectedDishes.salad) {
        orderData.salad_id = selectedDishes.salad.keyword;
        orderData.salad_name = selectedDishes.salad.name;
        orderData.salad_price = selectedDishes.salad.price;
    }
    
    if (selectedDishes.drink) {
        orderData.drink_id = selectedDishes.drink.keyword;
        orderData.drink_name = selectedDishes.drink.name;
        orderData.drink_price = selectedDishes.drink.price;
    }
    
    if (selectedDishes.dessert) {
        orderData.dessert_id = selectedDishes.dessert.keyword;
        orderData.dessert_name = selectedDishes.dessert.name;
        orderData.dessert_price = selectedDishes.dessert.price;
    }
    
    // Подсчитываем общую стоимость
    orderData.total_price = calculateTotalPrice(selectedDishes);
    
    console.log('Данные заказа для сохранения:', orderData);
    
    // Отключаем кнопку
    const submitBtn = form.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Сохранение...';
    }
    
    try {
        // Сохраняем заказ
        let savedOrder;
        
        if (window.saveOrderToStorage) {
            // Используем localStorage
            savedOrder = window.saveOrderToStorage(orderData);
        } else if (window.createOrder) {
            // Пробуем через API
            savedOrder = await window.createOrder(orderData);
        } else {
            // Fallback: сохраняем напрямую
            savedOrder = saveOrderDirectly(orderData);
        }
        
        console.log('Заказ сохранен:', savedOrder);
        
        // Показываем успех
        showSuccessNotification(`Заказ успешно оформлен! Номер заказа: #${savedOrder.id || '1'}`);
        
        // Очищаем текущий заказ
        localStorage.removeItem('businessLunchOrder');
        if (window.selectedDishes) {
            Object.keys(window.selectedDishes).forEach(key => {
                window.selectedDishes[key] = null;
            });
        }
        
        // Обновляем UI если функции есть
        if (window.updateCheckoutPanel) window.updateCheckoutPanel();
        if (window.updateOrderDisplay) window.updateOrderDisplay();
        
        // Перенаправляем на страницу заказов через 2 секунды
        setTimeout(() => {
            window.location.href = 'orders.html';
        }, 2000);
        
    } catch (error) {
        console.error('Ошибка сохранения заказа:', error);
        
        // Включаем кнопку
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить заказ';
        }
        
        alert('Ошибка при оформлении заказа: ' + error.message);
    }
}

// Подсчет общей стоимости
function calculateTotalPrice(selectedDishes) {
    let total = 0;
    Object.values(selectedDishes).forEach(dish => {
        if (dish && dish.price) {
            total += parseInt(dish.price);
        }
    });
    return total;
}

// Fallback сохранение
function saveOrderDirectly(orderData) {
    const orders = JSON.parse(localStorage.getItem('businessLunchOrders') || '[]');
    const newOrder = {
        id: Date.now(),
        ...orderData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    orders.push(newOrder);
    localStorage.setItem('businessLunchOrders', JSON.stringify(orders));
    
    return newOrder;
}

// Показ уведомления
function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-family: 'Roboto', sans-serif;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <div style="font-size: 1.5rem;">✅</div>
            <div>
                <div style="font-weight: bold; margin-bottom: 5px;">Успешно!</div>
                <div>${message}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Стили для анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('Form Submit загружен');
    
    // Находим форму
    const orderForm = document.getElementById('checkout-order-form');
    if (orderForm) {
        console.log('Форма найдена, добавляем обработчик');
        orderForm.addEventListener('submit', handleFormSubmit);
    }
});