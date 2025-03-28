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
function updatePoints(event, count = 1) {
    if (event === "universe") {
        // Automatically progress to the next life stage for a Universe event
        const nextStagePoints = progressGoalBase * Math.pow(2, lifeStage - 1);
        lifeStage++;
        currentPoints = nextStagePoints;
        updateLifeStage();
        updateProgressBar();
        return;
    }

    // Update points for other events
    if (pointsConfig[event]) {
        currentPoints += pointsConfig[event] * count;
        currentPoints = Math.max(currentPoints, 0); // Ensure points don't go negative
        updateProgressBar();
        checkLifeStage();
    }
}

// Function to Update Progress Bar
function updateProgressBar() {
    const progressPercentage = Math.min((currentPoints / progressGoalBase) * 100, 100);
    const progressBar = document.getElementById('progress-bar');
    const progressBarText = document.getElementById('progress-bar-text');

    progressBar.style.width = `${progressPercentage}%`;
    progressBarText.textContent = `Progress: ${Math.round(progressPercentage)}%`;
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
    trexImage.src = `static/images/stage${lifeStage}.png`; // Update the image path
}

// Function to Update Countdown Timer
function updateCountdownTimer() {
    const timerElement = document.getElementById('countdown-timer');
    const minutes = Math.floor(countdownToDeath / 60);
    const seconds = countdownToDeath % 60;

    timerElement.textContent = `Time Left Until T.rex Death: ${minutes}m ${seconds.toString().padStart(2, '0')}s`;
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
const eventSocket = new WebSocket("wss://t-rex-widget-public.onrender.com/"); // Updated WebSocket URL for production

eventSocket.onopen = function () {
    console.log("WebSocket connection established.");
};

eventSocket.onmessage = function (event) {
    const eventData = JSON.parse(event.data);
    console.log(`Received event: ${eventData.event}, Data:`, eventData.data);
    updatePoints(eventData.event, eventData.count || 1); // Use eventData.count if available, otherwise default to 1
};

eventSocket.onerror = function (error) {
    console.error("WebSocket error:", error);
};

eventSocket.onclose = function () {
    console.log("WebSocket connection closed.");
};
