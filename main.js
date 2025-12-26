document.addEventListener('DOMContentLoaded', function() {
    console.log('BusinessLunch - Система заказа бизнес-ланчей загружена');
    
    // Проверяем, что все необходимые скрипты загружены
    if (typeof dishes !== 'undefined') {
        console.log(`Загружено ${dishes.length} блюд`);
    }
});