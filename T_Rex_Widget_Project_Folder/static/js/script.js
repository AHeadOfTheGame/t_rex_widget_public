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
    const lifeStageElement = document
