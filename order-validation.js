// order-validation.js - ОБНОВЛЕННАЯ ВЕРСИЯ

// Определяем допустимые комбинации блюд для бизнес-ланча
const validCombinations = [
    // Комбо 1: Суп + Главное + Салат + Напиток
    { soup: true, main: true, salad: true, drink: true, dessert: false },
    
    // Комбо 2: Суп + Главное + Напиток
    { soup: true, main: true, salad: false, drink: true, dessert: false },
    
    // Комбо 3: Суп + Салат + Напиток
    { soup: true, main: false, salad: true, drink: true, dessert: false },
    
    // Комбо 4: Главное + Салат + Напиток
    { soup: false, main: true, salad: true, drink: true, dessert: false },
    
    // Комбо 5: Главное + Напиток
    { soup: false, main: true, salad: false, drink: true, dessert: false }
];

// Функция для проверки, соответствует ли заказ одному из допустимых комбо
function validateOrder() {
    // Используем selectedDishes из order-manager
    const selectedDishes = window.orderManager?.selectedDishes || {};
    
    // Проверяем, выбраны ли блюда
    const hasSoup = selectedDishes.soup !== null;
    const hasMain = selectedDishes.main !== null;
    const hasSalad = selectedDishes.salad !== null;
    const hasDrink = selectedDishes.drink !== null;
    const hasDessert = selectedDishes.dessert !== null;
    
    console.log('Проверка заказа:', { hasSoup, hasMain, hasSalad, hasDrink, hasDessert });
    
    // Случай 1: Ничего не выбрано
    if (!hasSoup && !hasMain && !hasSalad && !hasDrink && !hasDessert) {
        return {
            isValid: false,
            notification: {
                title: 'Ошибка заказа',
                message: 'Ничего не выбрано. Выберите блюда для заказа',
                icon: '❌'
            }
        };
    }
    
    // Проверяем, соответствует ли заказ одному из комбо
    const currentOrder = {
        soup: hasSoup,
        main: hasMain,
        salad: hasSalad,
        drink: hasDrink,
        dessert: hasDessert
    };
    
    // Проверяем на соответствие каждому комбо (игнорируем десерт при проверке)
    let matchesAnyCombo = false;
    
    for (const combo of validCombinations) {
        if (currentOrder.soup === combo.soup &&
            currentOrder.main === combo.main &&
            currentOrder.salad === combo.salad &&
            currentOrder.drink === combo.drink) {
            matchesAnyCombo = true;
            break;
        }
    }
    
    // Если заказ соответствует одному из комбо
    if (matchesAnyCombo) {
        return {
            isValid: true,
            notification: null
        };
    }
    
    // Если не соответствует ни одному комбо, определяем, чего не хватает
    
    // Случай 2: Выбраны все необходимые блюда, кроме напитка
    if ((hasSoup || hasMain || hasSalad) && !hasDrink) {
        return {
            isValid: false,
            notification: {
                title: 'Не хватает напитка',
                message: 'Выберите напиток для завершения заказа',
                icon: '🥤'
            }
        };
    }
    
    // Случай 3: Выбран суп, но не выбраны главное блюдо/салат/стартер
    if (hasSoup && !hasMain && !hasSalad) {
        return {
            isValid: false,
            notification: {
                title: 'Дополните заказ',
                message: 'Выберите главное блюдо или салат к супу',
                icon: '🍽️'
            }
        };
    }
    
    // Случай 4: Выбран салат/стартер, но не выбраны суп/главное блюдо
    if (hasSalad && !hasSoup && !hasMain) {
        return {
            isValid: false,
            notification: {
                title: 'Дополните заказ',
                message: 'Выберите суп или главное блюдо к салату',
                icon: '🥗'
            }
        };
    }
    
    // Случай 5: Выбран только напиток/десерт
    if ((hasDrink || hasDessert) && !hasSoup && !hasMain && !hasSalad) {
        return {
            isValid: false,
            notification: {
                title: 'Добавьте основное блюдо',
                message: 'Выберите главное блюдо для заказа',
                icon: '🍛'
            }
        };
    }
    
    // Общий случай: не соответствует ни одному комбо
    return {
        isValid: false,
        notification: {
            title: 'Некорректный заказ',
            message: 'Выбранные блюда не соответствуют ни одному варианту бизнес-ланча. Пожалуйста, выберите один из предложенных вариантов.',
            icon: '⚠️'
        }
    };
}

// Функция для показа уведомления
function showNotification(title, message, icon) {
    // Создаем overlay
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <h3>${title}</h3>
        <p>${message}</p>
        <button class="notification-btn">Окей</button>
    `;
    
    overlay.appendChild(notification);
    document.body.appendChild(overlay);
    
    // Добавляем обработчик для кнопки
    const closeBtn = notification.querySelector('.notification-btn');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    // Закрытие при клике на overlay (кроме самого уведомления)
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
    
    // Закрытие при нажатии Escape
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

// Функция для валидации формы при отправке
function setupFormValidation() {
    const form = document.getElementById('lunch-order-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Предотвращаем отправку
        
        // Проверяем заказ
        const validationResult = validateOrder();
        
        if (validationResult.isValid) {
            // Если заказ валиден, отправляем форму
            console.log('Заказ валиден, отправляем форму...');
            
            // Показываем успешное уведомление
            showNotification(
                'Заказ отправлен!',
                'Ваш заказ успешно оформлен. Мы свяжемся с вами в ближайшее время для подтверждения.',
                '✅'
            );
            
            // Очищаем форму через 3 секунды
            setTimeout(() => {
                // Сброс выбранных блюд
                if (window.orderManager && window.orderManager.selectedDishes) {
                    Object.keys(window.orderManager.selectedDishes).forEach(key => {
                        window.orderManager.selectedDishes[key] = null;
                    });
                    if (typeof window.orderManager.updateOrderForm === 'function') {
                        window.orderManager.updateOrderForm();
                    }
                }
                
                // Сброс формы
                form.reset();
            }, 3000);
            
        } else {
            // Если заказ невалиден, показываем уведомление
            console.log('Заказ невалиден:', validationResult.notification);
            showNotification(
                validationResult.notification.title,
                validationResult.notification.message,
                validationResult.notification.icon
            );
        }
    });
}

// Экспортируем функцию showNotification для использования в других модулях
window.showNotification = showNotification;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Ждем загрузки блюд из API перед настройкой валидации
    if (typeof apiService !== 'undefined') {
        const status = apiService.getLoadingStatus();
        if (!status.isLoading) {
            setupFormValidation();
        } else {
            // Если данные еще загружаются, ждем их загрузки
            const checkInterval = setInterval(() => {
                const currentStatus = apiService.getLoadingStatus();
                if (!currentStatus.isLoading) {
                    clearInterval(checkInterval);
                    setupFormValidation();
                }
            }, 500);
        }
    } else {
        // Если API сервис не загружен, настраиваем валидацию сразу
        setupFormValidation();
    }
    
    console.log('Система валидации заказа загружена');
});