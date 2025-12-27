// [file name]: combo-checker.js
// Проверка комбо ланча (Лабораторная работа 6)

// Определяем доступные комбо
const AVAILABLE_COMBOS = [
    {
        name: 'Полный ланч',
        required: ['soup', 'main', 'salad', 'drink'],
        optional: ['dessert']
    },
    {
        name: 'Стандартный',
        required: ['soup', 'main', 'drink'],
        optional: ['dessert']
    },
    {
        name: 'Лёгкий',
        required: ['soup', 'salad', 'drink'],
        optional: ['dessert']
    },
    {
        name: 'Без супа',
        required: ['main', 'salad', 'drink'],
        optional: ['dessert']
    },
    {
        name: 'Минимальный',
        required: ['main', 'drink'],
        optional: ['dessert']
    }
];

// Функция для проверки текущего заказа
function checkCombo(order) {
    // Определяем, какие категории выбраны
    const selectedCategories = [];
    
    if (order.soup) selectedCategories.push('soup');
    if (order.main) selectedCategories.push('main');
    if (order.salad) selectedCategories.push('salad');
    if (order.drink) selectedCategories.push('drink');
    if (order.dessert) selectedCategories.push('dessert');
    
    console.log('Выбранные категории:', selectedCategories);
    
    // Проверяем каждое комбо
    for (const combo of AVAILABLE_COMBOS) {
        let isValid = true;
        
        // Проверяем обязательные категории
        for (const requiredCategory of combo.required) {
            if (!selectedCategories.includes(requiredCategory)) {
                isValid = false;
                break;
            }
        }
        
        // Если все обязательные категории есть, комбо валидно
        if (isValid) {
            console.log(`Заказ соответствует комбо: ${combo.name}`);
            return {
                isValid: true,
                combo: combo,
                missingCategories: [],
                extraCategories: selectedCategories.filter(cat => 
                    !combo.required.includes(cat) && 
                    (!combo.optional || !combo.optional.includes(cat))
                )
            };
        }
    }
    
    // Если ни одно комбо не подошло, определяем ошибку
    return determineOrderError(selectedCategories);
}

// Функция для определения типа ошибки
function determineOrderError(selectedCategories) {
    const hasSoup = selectedCategories.includes('soup');
    const hasMain = selectedCategories.includes('main');
    const hasSalad = selectedCategories.includes('salad');
    const hasDrink = selectedCategories.includes('drink');
    const hasDessert = selectedCategories.includes('dessert');
    
    // Случай 1: Ничего не выбрано
    if (selectedCategories.length === 0) {
        return {
            isValid: false,
            errorType: 'empty',
            message: 'Ничего не выбрано. Выберите блюда для заказа',
            icon: '❌'
        };
    }
    
    // Случай 2: Выбраны все необходимые блюда, кроме напитка
    if ((hasSoup || hasMain || hasSalad) && !hasDrink) {
        return {
            isValid: false,
            errorType: 'no_drink',
            message: 'Выберите напиток',
            icon: '🥤'
        };
    }
    
    // Случай 3: Выбран суп, но не выбраны главное блюдо/салат/стартер
    if (hasSoup && !hasMain && !hasSalad) {
        return {
            isValid: false,
            errorType: 'soup_no_main_or_salad',
            message: 'Выберите главное блюдо или салат',
            icon: '🍽️'
        };
    }
    
    // Случай 4: Выбран салат/стартер, но не выбраны суп/главное блюдо
    if (hasSalad && !hasSoup && !hasMain) {
        return {
            isValid: false,
            errorType: 'salad_no_soup_or_main',
            message: 'Выберите суп или главное блюдо',
            icon: '🥗'
        };
    }
    
    // Случай 5: Выбран только напиток/десерт
    if ((hasDrink || hasDessert) && !hasSoup && !hasMain && !hasSalad) {
        return {
            isValid: false,
            errorType: 'drink_no_main',
            message: 'Выберите главное блюдо',
            icon: '🍛'
        };
    }
    
    // Общий случай: не соответствует ни одному комбо
    return {
        isValid: false,
        errorType: 'invalid_combo',
        message: 'Выбранные блюда не соответствуют ни одному варианту бизнес-ланча',
        icon: '⚠️'
    };
}

// Функция для получения сообщения о состоянии комбо
function getComboMessage(order) {
    const result = checkCombo(order);
    
    if (result.isValid) {
        return {
            type: 'success',
            message: `✅ Заказ соответствует комбо "${result.combo.name}"`,
            canProceed: true
        };
    } else {
        // Для уведомлений используем тексты из задания
        switch(result.errorType) {
            case 'empty':
                return {
                    type: 'info',
                    message: 'Выберите хотя бы одно блюдо',
                    canProceed: false
                };
            case 'no_drink':
                return {
                    type: 'warning',
                    message: '⚠️ Для оформления заказа добавьте: напиток',
                    canProceed: false
                };
            case 'soup_no_main_or_salad':
                return {
                    type: 'warning',
                    message: '⚠️ Для оформления заказа добавьте: главное блюдо или салат',
                    canProceed: false
                };
            case 'salad_no_soup_or_main':
                return {
                    type: 'warning',
                    message: '⚠️ Для оформления заказа добавьте: суп или главное блюдо',
                    canProceed: false
                };
            case 'drink_no_main':
                return {
                    type: 'warning',
                    message: '⚠️ Для оформления заказа добавьте: главное блюдо',
                    canProceed: false
                };
            default:
                return {
                    type: 'warning',
                    message: '⚠️ Выбранные блюда не соответствуют ни одному варианту ланча',
                    canProceed: false
                };
        }
    }
}

// Функция для показа уведомления
function showNotification(title, message, icon) {
    // Удаляем существующие уведомления
    const existingNotification = document.querySelector('.notification-overlay');
    if (existingNotification) {
        existingNotification.remove();
    }
    
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
    
    // Закрытие при клике на overlay
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
    
    // Закрытие по клавише Escape
    const closeOnEscape = function(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', closeOnEscape);
        }
    };
    document.addEventListener('keydown', closeOnEscape);
}

// Функция для проверки формы перед отправкой
function validateOrderForm(order) {
    const result = checkCombo(order);
    
    if (!result.isValid) {
        // Показываем соответствующее уведомление
        showNotification('Внимание!', result.message, result.icon);
        return false;
    }
    
    return true;
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('Combo Checker загружен');
    
    // Находим форму на странице оформления
    const orderForm = document.getElementById('checkout-order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Проверяем заказ
            if (window.selectedDishes) {
                const isValid = validateOrderForm(window.selectedDishes);
                if (isValid) {
                    console.log('Заказ валиден, можно отправлять');
                    // Здесь будет отправка формы
                    this.submit();
                } else {
                    console.log('Заказ невалиден, форма не отправляется');
                }
            }
        });
    }
});

// Экспортируем функции
window.checkCombo = checkCombo;
window.getComboMessage = getComboMessage;
window.showNotification = showNotification;
window.validateOrderForm = validateOrderForm;
window.AVAILABLE_COMBOS = AVAILABLE_COMBOS;