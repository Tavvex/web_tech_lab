// [file name]: api-service-xhr.js (альтернатива с XMLHttpRequest)

// Версия с XMLHttpRequest для поддержки старых браузеров
function loadDishesXHR() {
    const apiUrl = getApiUrl();
    console.log(`Загрузка блюд с API (XHR): ${apiUrl}`);
    
    isLoading = true;
    hasError = false;
    
    // Показываем индикатор загрузки
    showLoadingIndicator();
    
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.open('GET', apiUrl, true);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
            isLoading = false;
            hideLoadingIndicator();
            
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    dishes = data;
                    console.log(`Успешно загружено ${dishes.length} блюд (XHR)`);
                    
                    if (typeof onDishesLoaded === 'function') {
                        onDishesLoaded();
                    }
                    
                    resolve(dishes);
                } catch (error) {
                    console.error('Ошибка парсинга JSON:', error);
                    hasError = true;
                    showError('Ошибка обработки данных');
                    dishes = getLocalDishesFallback();
                    resolve(dishes);
                }
            } else {
                console.error(`HTTP ошибка: ${xhr.status}`);
                hasError = true;
                showError(`Ошибка сервера: ${xhr.status}`);
                dishes = getLocalDishesFallback();
                resolve(dishes);
            }
        };
        
        xhr.onerror = function() {
            isLoading = false;
            hasError = true;
            hideLoadingIndicator();
            showError('Ошибка сети. Проверьте подключение.');
            dishes = getLocalDishesFallback();
            
            if (typeof onDishesLoaded === 'function') {
                onDishesLoaded();
            }
            
            resolve(dishes);
        };
        
        xhr.ontimeout = function() {
            isLoading = false;
            hasError = true;
            hideLoadingIndicator();
            showError('Таймаут запроса. Попробуйте позже.');
            dishes = getLocalDishesFallback();
            
            if (typeof onDishesLoaded === 'function') {
                onDishesLoaded();
            }
            
            resolve(dishes);
        };
        
        // Устанавливаем таймаут 10 секунд
        xhr.timeout = 10000;
        
        xhr.send();
    });
}

// Добавляем в apiService
if (typeof apiService !== 'undefined') {
    apiService.loadDishesXHR = loadDishesXHR;
}