// dishes.js - ОБНОВЛЕННЫЙ
const dishes = [
    // ================= СУПЫ (6 блюд) =================
    {
        keyword: "mushroom_cream",
        name: "Крем-суп из шампиньонов",
        price: 250,
        category: "soup",
        kind: "veg",
        count: "300 мл",
        image: "images/soup-murhs.jpg"
    },
    {
        keyword: "borscht",
        name: "Борщ с говядиной",
        price: 280,
        category: "soup",
        kind: "meat",
        count: "350 мл",
        image: "images/soup-meat.jpg"
    },
    {
        keyword: "tomato_basil",
        name: "Томатный суп с базиликом",
        price: 240,
        category: "soup",
        kind: "veg",
        count: "300 мл",
        image: "images/soup-tomato.jpg"
    },
    {
        keyword: "fish_soup",
        name: "Уха из красной рыбы",
        price: 320,
        category: "soup",
        kind: "fish",
        count: "350 мл",
        image: "images/soup-fish.jpg"
    },
    {
        keyword: "chicken_noodle",
        name: "Куриный суп с лапшой",
        price: 260,
        category: "soup",
        kind: "meat",
        count: "400 мл",
        image: "images/soup-chicken.jpg"
    },
    {
        keyword: "salmon_chowder",
        name: "Сливочный суп с лососем",
        price: 340,
        category: "soup",
        kind: "fish",
        count: "350 мл",
        image: "images/soup-salmon.jpg"
    },
    
    // ================= ГЛАВНЫЕ БЛЮДА (6 блюд) =================
    {
        keyword: "teriyaki_chicken",
        name: "Курица терияки с рисом и овощами гриль",
        price: 350,
        category: "main",
        kind: "meat",
        count: "400 г",
        image: "images/main-rise.jpg"
    },
    {
        keyword: "carbonara",
        name: "Паста Карбонара",
        price: 320,
        category: "main",
        kind: "meat",
        count: "350 г",
        image: "images/main-itally.jpg"
    },
    {
        keyword: "salmon",
        name: "Лосось с картофельным пюре",
        price: 420,
        category: "main",
        kind: "fish",
        count: "380 г",
        image: "images/main-fish.jpg"
    },
    {
        keyword: "beef_stroganoff",
        name: "Бефстроганов с гречкой",
        price: 380,
        category: "main",
        kind: "meat",
        count: "400 г",
        image: "images/main-beef.jpg"
    },
    {
        keyword: "vegetable_curry",
        name: "Овощное карри с киноа",
        price: 290,
        category: "main",
        kind: "veg",
        count: "350 г",
        image: "images/main-curry.jpg"
    },
    {
        keyword: "trout_steak",
        name: "Стейк форели с овощами",
        price: 400,
        category: "main",
        kind: "fish",
        count: "370 г",
        image: "images/main-trout.jpg"
    },
    {
        keyword: "vegan_burger",
        name: "Вегетарианский бургер с бататом",
        price: 310,
        category: "main",
        kind: "veg",
        count: "380 г",
        image: "images/main-vegan.jpg"
    },
    
    // ================= САЛАТЫ И СТАРТЕРЫ (6 блюд) =================
    {
        keyword: "caesar_salad",
        name: "Салат Цезарь с курицей",
        price: 280,
        category: "salad",
        kind: "meat",
        count: "250 г",
        image: "images/salad-caesar.jpg"
    },
    {
        keyword: "greek_salad",
        name: "Греческий салат",
        price: 240,
        category: "salad",
        kind: "veg",
        count: "230 г",
        image: "images/salad-greek.jpg"
    },
    {
        keyword: "shrimp_cocktail",
        name: "Коктейль из креветок",
        price: 320,
        category: "salad",
        kind: "fish",
        count: "200 г",
        image: "images/salad-shrimp.jpg"
    },
    {
        keyword: "caprese",
        name: "Капрезе с моцареллой",
        price: 260,
        category: "salad",
        kind: "veg",
        count: "220 г",
        image: "images/salad-caprese.jpg"
    },
    {
        keyword: "beef_tartare",
        name: "Тартар из говядины",
        price: 350,
        category: "salad",
        kind: "meat",
        count: "180 г",
        image: "images/salad-tartare.jpg"
    },
    {
        keyword: "quinoa_salad",
        name: "Салат с киноа и авокадо",
        price: 230,
        category: "salad",
        kind: "veg",
        count: "240 г",
        image: "images/salad-quinoa.jpg"
    },
    {
        keyword: "vegetable_spring",
        name: "Весенний овощной салат",
        price: 210,
        category: "salad",
        kind: "veg",
        count: "220 г",
        image: "images/salad-spring.jpg"
    },
    
    // ================= НАПИТКИ (6 блюд) =================
    {
        keyword: "orange_juice",
        name: "Свежевыжатый апельсиновый сок",
        price: 180,
        category: "drink",
        kind: "cold",
        count: "250 мл",
        image: "images/drink-orange.jpg"
    },
    {
        keyword: "apple_juice",
        name: "Яблочный сок",
        price: 150,
        category: "drink",
        kind: "cold",
        count: "250 мл",
        image: "images/drink-apple.jpg"
    },
    {
        keyword: "cranberry_juice",
        name: "Морс клюквенный",
        price: 160,
        category: "drink",
        kind: "cold",
        count: "250 мл",
        image: "images/drink-red.jpg"
    },
    {
        keyword: "green_tea",
        name: "Зеленый чай",
        price: 120,
        category: "drink",
        kind: "hot",
        count: "300 мл",
        image: "images/drink-green.jpg"
    },
    {
        keyword: "black_tea",
        name: "Черный чай с лимоном",
        price: 120,
        category: "drink",
        kind: "hot",
        count: "300 мл",
        image: "images/drink-black.jpg"
    },
    {
        keyword: "cappuccino",
        name: "Капучино",
        price: 190,
        category: "drink",
        kind: "hot",
        count: "250 мл",
        image: "images/drink-cappuccino.jpg"
    },
    {
        keyword: "lemonade",
        name: "Домашний лимонад",
        price: 170,
        category: "drink",
        kind: "cold",
        count: "300 мл",
        image: "images/drink-lemonade.jpg"
    },
    {
        keyword: "americano",
        name: "Американо",
        price: 160,
        category: "drink",
        kind: "hot",
        count: "250 мл",
        image: "images/drink-americano.jpg"
    },
    
    // ================= ДЕСЕРТЫ (6 блюд) =================
    {
        keyword: "tiramisu",
        name: "Тирамису",
        price: 220,
        category: "dessert",
        kind: "medium",
        count: "150 г",
        image: "images/dessert-tiramisu.jpg"
    },
    {
        keyword: "chocolate_cake",
        name: "Шоколадный торт",
        price: 200,
        category: "dessert",
        kind: "medium",
        count: "140 г",
        image: "images/dessert-chocolate.jpg"
    },
    {
        keyword: "cheesecake",
        name: "Чизкейк Нью-Йорк",
        price: 240,
        category: "dessert",
        kind: "large",
        count: "180 г",
        image: "images/dessert-cheesecake.jpg"
    },
    {
        keyword: "fruit_salad",
        name: "Фруктовый салат",
        price: 160,
        category: "dessert",
        kind: "small",
        count: "200 г",
        image: "images/dessert-fruit.jpg"
    },
    {
        keyword: "panna_cotta",
        name: "Панна котта с ягодным соусом",
        price: 180,
        category: "dessert",
        kind: "small",
        count: "120 г",
        image: "images/dessert-panna.jpg"
    },
    {
        keyword: "apple_pie",
        name: "Яблочный пирог",
        price: 190,
        category: "dessert",
        kind: "small",
        count: "130 г",
        image: "images/dessert-apple.jpg"
    },
    {
        keyword: "brownie",
        name: "Брауни с мороженым",
        price: 210,
        category: "dessert",
        kind: "medium",
        count: "160 г",
        image: "images/dessert-brownie.jpg"
    }
];