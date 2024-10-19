let hunger = 50;
let energy = 50;
let mood = 50;
let currency = 0; // Переменная для валюты

const petImage = document.getElementById("pet-image");
const themeToggleButton = document.getElementById("theme-toggle");
const modal = document.getElementById("game-over-modal");

// Массив питомцев с различными изображениями для каждого состояния
const pets = [
  {
    name: "Penguin",
    images: {
      happy: "images/happy-penguin.webp",
      hungry: "images/hungry.webp",
      tired: "images/sad.webp",
      sad: "images/sad-penguin.png",
    },
    hunger: 50,
    energy: 50,
    mood: 50,
  },
  {
    name: "Cat",
    images: {
      happy: "images/cat/happy-cat.jpg",
      hungry: "images/cat/hungry-cat.jpg",
      tired: "images/cat/tired-cat.jpg",
      sad: "images/cat/sad-cat.jpg",
    },
    hunger: 50,
    energy: 60,
    mood: 70,
  },
  {
    name: "Dog",
    images: {
      happy: "images/dog/happy-dog.webp",
      hungry: "images/dog/sad-dog.webp",
      tired: "images/tired-dog.png",
      sad: "images/sad-dog.png",
    },
    hunger: 60,
    energy: 40,
    mood: 80,
  },
];

window.onload = () => {
  currency = parseInt(localStorage.getItem("currency")) || 0; // Получаем валюту, если она есть
  initializePetImage();
  updateStatus();
};

// Функция для перехода к заданиям
function goToTasks() {
  window.location.href = "tasks.html"; // Переход к странице заданий
}

// Текущий выбранный питомец
let currentPet = pets[0];

// Инициализация изображения питомца
function initializePetImage() {
  petImage.src = currentPet.images.happy; // Устанавливаем начальное изображение
}

const cooldownTime = 300000; // 300000 миллисекунд = 5 минут

const taskCounters = {
  "feed-button": {
    count: 0,
    name: "Feed",
    maxUses: 5,
    cooldownTime: 3000,
    lastUsed: 0,
  },
  "play-button": {
    count: 0,
    name: "Play",
    maxUses: 5,
    cooldownTime: 3000,
    lastUsed: 0,
  },
  "rest-button": {
    count: 0,
    name: "Rest",
    maxUses: 5,
    cooldownTime: 3000,
    lastUsed: 0,
  },
};

function startCooldown(btnId) {
  const task = taskCounters[btnId];
  const button = document.getElementById(btnId);
  task.count += 1;

  // console.log(button.className);

  if (task.count >= task.maxUses) {
    button.disabled = true; // Отключаем кнопку

    // Таймер отсчета для восстановления кнопки
    let timeLeft = task.cooldownTime / 1000; // переводим в секунды
    const interval = setInterval(() => {
      timeLeft--;
      button.textContent = `Wait${timeLeft}s`; // Обновляем текст кнопки с оставшимся временем

      if (timeLeft <= 0) {
        clearInterval(interval);
        task.count = 0; // Сбрасываем счётчик
        button.disabled = false; // Включаем кнопку снова
        button.textContent = `${
          task.name.charAt(0).toUpperCase() + task.name.slice(1)
        }`;
      }
    }, 1000);
  }
}

// Функция выбора изображения питомца в зависимости от состояния
function updatePetImage() {
  if (hunger >= 80) {
    petImage.src = currentPet.images.hungry;
  } else if (energy <= 20) {
    petImage.src = currentPet.images.tired;
  } else if (mood <= 20) {
    petImage.src = currentPet.images.sad;
  } else {
    petImage.src = currentPet.images.happy;
  }
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

// Обновление статуса питомца
function updateStatus() {
  hunger = Math.min(100, Math.max(0, hunger));
  energy = Math.min(100, Math.max(0, energy));
  mood = Math.min(100, Math.max(0, mood));
  
  updateExperience(hunger, 'hunger-bar', 'hunger-level');
  updateExperience(energy, 'energy-bar', 'energy-level');
  updateExperience(mood, 'mood-bar', 'mood-level');
  updatePetImage();
}

// Функция кормления питомца
function feedPet() {
  hunger = Math.max(0, hunger - 10);
  energy = Math.max(0, energy - 5);
  mood = Math.min(100, mood + 5);
  updateStatus();
  startCooldown("feed-button");
}

// Функция игры с питомцем
function playWithPet() {
  hunger = Math.min(100, hunger + 10);
  energy = Math.max(0, energy - 10);
  mood = Math.min(100, mood + 10);
  updateStatus();
  startCooldown("play-button");
}

// Функция отдыха питомца
function restPet() {
  energy = Math.min(100, energy + 20);
  hunger = Math.min(100, hunger + 5);
  mood = Math.max(0, mood - 5);
  updateStatus();
  startCooldown("rest-button");
}

// Симуляция времени
setInterval(() => {
  hunger = Math.min(100, hunger + 2);
  energy = Math.max(0, energy - 3);
  mood = Math.max(0, mood - 2);

  if (hunger >= 100 || energy <= 0 || mood <= 0) {
    endGame();
  }

  updateStatus();
}, 3000);

// Завершение игры и отображение модального окна
function endGame() {
  modal.classList.remove("hidden");
}

// Перезапуск игры
function restartGame() {
  hunger = 50;
  energy = 50;
  mood = 50;
  updateStatus();
  modal.classList.add("hidden");
}

// Функция переключения темы
function toggleTheme() {
  document.body.classList.toggle("light-theme");

  themeToggleButton.textContent = document.body.classList.contains("light-theme")
    ? "Switch to Dark Theme"
    : "Switch to Light Theme";
}

// Функция выбора питомца
function choosePet(index) {
  currentPet = pets[index];

  hunger = currentPet.hunger;
  energy = currentPet.energy;
  mood = currentPet.mood;
  
  updateStatus();
  toggleStore();
}

// Открытие/закрытие магазина питомцев
function toggleStore() {
  const petStore = document.getElementById("pet-store");
  petStore.classList.toggle("hidden");
}

// Инициализация игры
initializePetImage();
updateStatus();
