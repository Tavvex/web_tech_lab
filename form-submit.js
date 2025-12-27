// [file name]: form-submit.js
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('lunch-order-form');
    if (!orderForm) return;
    
    // Получаем все блюда для получения их ID
    let dishesData = [];
    
    // Загружаем блюда при загрузке страницы
    loadDishesForForm();
    
    async function loadDishesForForm() {
        try {
            dishesData = await getDishes();
            console.log('Блюда загружены для формы:', dishesData.length);
        } catch (error) {
            console.error('Ошибка при загрузке блюд:', error);
        }
    }
    
    // Обработчик отправки формы
    orderForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Проверяем, выбраны ли блюда
        const selectedDishes = window.selectedDishes || {};
        const hasSelectedDishes = Object.values(selectedDishes).some(dish => dish !== null);
        
        if (!hasSelectedDishes) {
            alert('Пожалуйста, выберите хотя бы одно блюдо');
            return;
        }
        
        // Находим ID выбранных блюд
        const formData = new FormData(orderForm);
        
        // Подготавливаем данные для API
        const orderData = {
            full_name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            delivery_address: formData.get('address'),
            delivery_type: formData.get('delivery_time') === 'specific' ? 'by_time' : 'now',
            subscribe: formData.get('subscription') ? 1 : 0
        };
    
        // Добавляем время доставки если выбрано "ко времени"
        if (formData.get('delivery_time') === 'specific' && formData.get('delivery_time_input')) {
            orderData.delivery_time = formData.get('delivery_time_input');
        }
    
        // Добавляем комментарий если есть
        const comment = formData.get('comment');
        if (comment) {
            orderData.comment = comment;
        }
        
        // Добавляем ID выбранных блюд
        if (selectedDishes.soup) {
            const dish = dishesData.find(d => d.keyword === selectedDishes.soup.keyword);
            if (dish) orderData.soup_id = dish.id;
        }
        
        if (selectedDishes.main) {
            const dish = dishesData.find(d => d.keyword === selectedDishes.main.keyword);
            if (dish) orderData.main_course_id = dish.id;
        }
        
        if (selectedDishes.salad) {
            const dish = dishesData.find(d => d.keyword === selectedDishes.salad.keyword);
            if (dish) orderData.salad_id = dish.id;
        }
        
        if (selectedDishes.drink) {
            const dish = dishesData.find(d => d.keyword === selectedDishes.drink.keyword);
            if (dish) orderData.drink_id = dish.id;
        }
        
        if (selectedDishes.dessert) {
            const dish = dishesData.find(d => d.keyword === selectedDishes.dessert.keyword);
            if (dish) orderData.dessert_id = dish.id;
        }
        
        // Проверяем обязательное поле drink_id
        if (!orderData.drink_id) {
            alert('Пожалуйста, выберите напиток');
            return;
        }
        
        try {
            // Отправляем заказ на сервер
            const response = await createOrder(orderData);
            
            // Показываем уведомление об успехе
            showFormNotification('Заказ успешно оформлен!', 'success');
            
            // Сбрасываем форму через 2 секунды
            setTimeout(() => {
                orderForm.reset();
                // Сбрасываем выбранные блюда
                Object.keys(selectedDishes).forEach(key => {
                    selectedDishes[key] = null;
                });
                if (window.updateOrderForm) {
                    window.updateOrderForm();
                }
            }, 2000);
            
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            showFormNotification('Ошибка при оформлении заказа', 'error');
        }
    });
});

// Функция для показа уведомлений в форме
function showFormNotification(message, type = 'success') {
    // Создаем или находим элемент уведомления
    let notification = document.getElementById('form-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'form-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.style.backgroundColor = type === 'success' ? '#27ae60' : '#e74c3c';
    notification.style.display = 'block';
    
    // Скрываем через 3 секунды
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}