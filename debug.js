// [file name]: debug.js
// Файл для отладки

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DEBUG MODE ENABLED ===');
    
    // Проверяем доступные функции
    console.log('Проверка функций:');
    console.log('getAllDishes:', typeof window.getAllDishes);
    console.log('getDishByKeyword:', typeof window.getDishByKeyword);
    console.log('saveOrderToStorage:', typeof window.saveOrderToStorage);
    console.log('selectDish:', typeof window.selectDish);
    
    // Проверяем текущий заказ
    if (window.selectedDishes) {
        console.log('Текущий заказ:', window.selectedDishes);
    }
    
    // Добавляем кнопку для отладки
    const debugBtn = document.createElement('button');
    debugBtn.textContent = 'DEBUG: Очистить заказ';
    debugBtn.style.cssText = 'position: fixed; top: 10px; left: 10px; z-index: 9999; padding: 10px; background: red; color: white; border: none; cursor: pointer;';
    debugBtn.onclick = function() {
        localStorage.removeItem('businessLunchOrder');
        console.log('LocalStorage очищен');
        alert('LocalStorage очищен');
        location.reload();
    };
    document.body.appendChild(debugBtn);
    
    // Проверяем localStorage
    console.log('LocalStorage:', localStorage.getItem('businessLunchOrder'));
});