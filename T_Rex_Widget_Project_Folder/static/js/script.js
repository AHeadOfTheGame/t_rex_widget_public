// Points Configuration
const pointsConfig = {
    likes: 10,
    shares: 25,
    follows: 100,
    coins: 500,
    subs: 2000,
    universe: 1000000, // Special event: TikTok Universe donation
};

// Core Variables
let currentPoints = 0;
let lifeStage = 1;
let countdownToDeath = 3600; // Countdown timer in seconds
const deathThreshold = 25000; // Minimum points to keep T.rex alive
const progressGoalBase = 1000000; // Points required for stage progression

// Function to Update Points Based on Events
function updatePoints(event, count) {
    if (event === "universe") {
        const nextStagePoints = progressGoalBase * Math.pow(2, lifeStage - 1);
        lifeStage++;
        currentPoints = nextStagePoints;
        updateLifeStage();
        updateProgressBar();
        return;
    }

    if (pointsConfig[event]) {
        currentPoints += pointsConfig[event] * count;
        updateProgressBar();
        checkLifeStage();
    }
}

// Function to Update Progress Bar
function updateProgressBar() {
    const progressPercentage = Math.min((currentPoints / progressGoalBase) * 100, 100);
    document.getElementById('progress-bar').style.width = progressPercentage + "%";
    document.getElementById('progress-bar-text').textContent = `Progress: ${Math.round(progressPercentage)}%`;
}

// Function to Check Life Stage Progression
function checkLifeStage() {
    const nextStagePoints = progressGoalBase * Math.pow(2, lifeStage - 1);
    if (currentPoints >= nextStagePoints) {
        lifeStage++;
        currentPoints -= nextStagePoints;
        updateLifeStage();
    }
}

// Function to Update Life Stage
function updateLifeStage() {
    const lifeStageElement = document.getElementById('life-stage');
    const trexImage = document.getElementById('trex-image');
    lifeStageElement.textContent = lifeStage === 1 ? "New Egg" : `Life Stage ${lifeStage}`;
    trexImage.src = `images/stage${lifeStage}.png`;
}

// Function to Update Countdown Timer
function updateCountdownTimer() {
    const timerElement = document.getElementById('countdown-timer');
    const minutes = Math.floor(countdownToDeath / 60);
    const seconds = countdownToDeath % 60;
    timerElement.textContent = `Time Left Until T.rex Death: ${minutes}m ${seconds}s`;
}

// Countdown Timer Logic
setInterval(() => {
    countdownToDeath--;
    updateCountdownTimer();
    if (countdownToDeath <= 0 && currentPoints < deathThreshold) {
        document.getElementById('status').textContent = "Dead";
        alert("The T.rex has died! 😢");
    }
}, 1000);

// Real-Time WebSocket Connection
const eventSocket = new WebSocket("ws://localhost:21213/");

eventSocket.onopen = function () {
    console.log("WebSocket connection established.");
};

eventSocket.onmessage = function (event) {
    const eventData = JSON.parse(event.data);
    console.log(`Received event: ${eventData.event}, Data:`, eventData.data);
    updatePoints(eventData.event, 1); // Assumes count is always 1 for simplicity
};

eventSocket.onerror = function (error) {
    console.error("WebSocket error:", error);
};

eventSocket.onclose = function () {
    console.log("WebSocket connection closed.");
};
