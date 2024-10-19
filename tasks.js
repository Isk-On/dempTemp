// Задания для питомца
const tasks = [
    { description: "Feed your pet", completed: false, reward: 10, type: "feed", cooldown: 300000 }, // 5 минут
    { description: "Play with your pet", completed: false, reward: 15, type: "play", cooldown: 300000 }, // 5 минут
    { description: "Clean your pet's house", completed: false, reward: 5, type: "clean", cooldown: 300000 }, // 5 минут
    { description: "Take your pet for a walk", completed: false, reward: 20, type: "walk", cooldown: 300000 } // 5 минут
];

// Инициализация состояния питомца
const petState = {
    hunger: 50,
    energy: 50,
    mood: 50,
    currency: 0
};

// Функция загрузки и отображения заданий
function loadTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Очистка списка заданий

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.description;

        // Создаем кнопку для выполнения задания
        const button = document.createElement('button');
        button.textContent = "Complete Task";
        button.disabled = task.completed; // Делаем кнопку неактивной, если задание выполнено

        // Добавляем обработчик события для выполнения задания
        button.addEventListener('click', () => {
            if (!task.completed) {
                performTask(task.type, task.reward);
                task.completed = true; // Отмечаем задание как выполненное
                li.style.textDecoration = "line-through"; // Зачеркиваем выполненное задание
                button.disabled = true; // Делаем кнопку неактивной

                // Устанавливаем таймер для повторного выполнения
                setTimeout(() => {
                    task.completed = false; // Сбрасываем статус задания
                    li.style.textDecoration = "none"; // Убираем зачеркивание
                    button.disabled = false; // Активируем кнопку снова
                }, task.cooldown); // Таймер повторного выполнения
            }
        });

        li.appendChild(button);
        taskList.appendChild(li);
    });
}

// Функция для выполнения задания
function performTask(type, reward) {
    switch (type) {
        case "feed":
            petState.hunger = Math.max(0, petState.hunger - 20); // Уменьшаем голод
            petState.mood = Math.min(100, petState.mood + 10); // Улучшаем настроение
            break;
        case "play":
            petState.energy = Math.max(0, petState.energy - 15); // Уменьшаем энергию
            petState.mood = Math.min(100, petState.mood + 20); // Улучшаем настроение
            break;
        case "clean":
            petState.mood = Math.min(100, petState.mood + 5); // Улучшаем настроение
            break;
        case "walk":
            petState.energy = Math.max(0, petState.energy - 25); // Уменьшаем энергию
            petState.hunger = Math.min(100, petState.hunger + 10); // Увеличиваем голод
            petState.mood = Math.min(100, petState.mood + 25); // Улучшаем настроение
            break;
    }

    // Начисляем валюту
    increaseCurrency(reward);
    updatePetStatus(); // Обновляем статус питомца на экране
}

// Функция для увеличения валюты
function increaseCurrency(amount) {
    petState.currency += amount; // Начисляем валюту
    updateCurrencyDisplay(petState.currency); // Обновляем отображение валюты
}

// Функция обновления отображения валюты
function updateCurrencyDisplay(currency) {
    document.getElementById('currency').textContent = currency + '$'; // Обновляем отображение валюты на главной странице
}

function updateExperience(progress, type, typeLvl) {
    const experienceCircle = document.querySelector(`.${type}`);
    const levelDisplay = document.querySelector(`.${typeLvl}`);
  
    // Рассчитываем процент прогресса (0-100)
    const percentage = progress + "%";
    // Обновляем круг с помощью конусного градиента
    experienceCircle.style.setProperty("--percentage", percentage);
  
    // Обновляем текст отображения уровня
    levelDisplay.textContent = Math.round(progress) + "%";
  }
  

// Функция обновления статуса питомца
function updatePetStatus() {

    updateExperience(petState.hunger, 'hunger-bar', 'hunger-level');
    updateExperience(petState.energy, 'energy-bar', 'energy-level');
    updateExperience(petState.mood, 'mood-bar', 'mood-level');

    // Проверяем, не закончилась ли игра
    if (petState.hunger <= 0 || petState.energy <= 0 || petState.mood <= 0) {
        endGame(); // Заканчиваем игру, если одно из состояний питомца достигло нуля
    }
}

// Функция для окончания игры
function endGame() {
    document.getElementById('game-over-modal').classList.remove('hidden'); // Показываем модальное окно окончания игры
}

// Функция для инициализации
function initTasks() {
    updateCurrencyDisplay(petState.currency); // Обновляем отображение валюты
    loadTasks(); // Загружаем задания
}

// Загружаем валюту и задания при загрузке страницы
window.onload = initTasks;