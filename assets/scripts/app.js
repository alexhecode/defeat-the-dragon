/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// TODO find a solution for the checkHealth() function

const ATTACK_DAMAGE = 10;
const STRONG_ATTACK_DAMAGE = 15;
const MONSTER_ATTACK_DAMAGE = 14;
const HEAL_VALUE = 20;

// identifiers
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLATER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

// score
let getPlayerScore = 0;
let getMonsterScore = 0;

// set initial scoreboard
function initialScore() {
        playerScore.textContent = getPlayerScore;
        monsterScore.textContent = getMonsterScore;
}

function winScore() {
        getPlayerScore += 1;
        playerScore.textContent = getPlayerScore;
}

function loseScore() {
        getMonsterScore += 1;
        monsterScore.textContent = getMonsterScore;
}

function drawScore() {
        getPlayerScore += 1;
        getMonsterScore += 1;
        playerScore.textContent = getPlayerScore;
        monsterScore.textContent = getMonsterScore;
}

// determines maximum health points for player and monster
const inputValue = prompt('Determine the health points for you and the Monster!', '100');
let chosenMaxLife = parseInt(inputValue);
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
        errorSound.play();
        alert('You did not enter a number or the number you entered was too low!');
        chosenMaxLife = 100;
        // dragonSound.play();
} else {
        correctSound.play();
        initialScore();
        // dragonSound.play();
}

const criticalHealth = chosenMaxLife / 2;
const battleLog = [];
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, playerHealth, monsterHealth) {
        let logEntry = {
                turn: event,
                damage: value,
                finalPlayerHealth: playerHealth,
                finalMonsterHealth: monsterHealth,
        };

        switch (event) {
                case LOG_EVENT_PLAYER_ATTACK:
                        logEntry.target = 'MONSTER';
                        break;
                case LOG_EVENT_PLATER_STRONG_ATTACK:
                        logEntry.target = 'MONSTER';
                        break;
                case LOG_EVENT_MONSTER_ATTACK:
                        logEntry.target = 'PLAYER';
                        break;
                case LOG_EVENT_PLAYER_HEAL:
                        logEntry.target = 'PLAYER';
                        break;
                default:
                        logEntry = {};
        }
        battleLog.push(logEntry);

        // if (event === LOG_EVENT_PLAYER_ATTACK) {
        //         logEntry.target = 'MONSTER';
        // } else if (event === LOG_EVENT_PLATER_STRONG_ATTACK) {
        //         logEntry.target = 'MONSTER';
        // } else if (event === LOG_EVENT_MONSTER_ATTACK) {
        //         logEntry.target = 'PLAYER';
        // } else if (event === LOG_EVENT_PLAYER_HEAL) {
        //         logEntry.target = 'PLAYER';
        // }
        // battleLog.push(logEntry);
}

function reset() {
        currentMonsterHealth = chosenMaxLife;
        currentPlayerHealth = chosenMaxLife;
        resetGame(chosenMaxLife);
}

// monster attack, checks for bonus life and win condition, updates scoreboard
function endRound() {
        const initialPlayerHealth = currentPlayerHealth;
        const playerDamage = dealPlayerDamage(MONSTER_ATTACK_DAMAGE);
        currentPlayerHealth -= playerDamage;
        eventNote.textContent = 'The dragon attacks you back ferociously!';
        writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentPlayerHealth, currentMonsterHealth);

        if (currentPlayerHealth <= 0 && hasBonusLife) {
                hasBonusLife = false;
                removeBonusLife();
                currentPlayerHealth = initialPlayerHealth;
                setPlayerHealth(initialPlayerHealth);
                bonusLifeSound.play();
                eventNote.textContent = 'A guardian angel watches over you...';
                alert('You would be dead, but the bonus life saved you!');
        }

        if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
                winScore();
                dragonSound.play();
                victorySound.play();
                eventNote.textContent = 'Another wild dragon appeared...';
                alert('You won! The dragon was slain!');
                writeToLog(LOG_EVENT_GAME_OVER, 'PLAYER WON', currentPlayerHealth, currentMonsterHealth);
        } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
                loseScore();
                dragonSound.play();
                gameOverSound.play();
                eventNote.textContent = 'You encounter another dragon in your next life...';
                alert('You lost! You were slain in battle...');
                writeToLog(LOG_EVENT_GAME_OVER, 'MONSTER WON', currentPlayerHealth, currentMonsterHealth);
        } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
                drawScore();
                drawSound.play();
                eventNote.textContent = 'You encounter another dragon in your next life...';
                alert('We have a draw! You both fell to your demise!');
                writeToLog(LOG_EVENT_GAME_OVER, 'DRAW', currentPlayerHealth, currentMonsterHealth);
        }

        if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
                reset();
        }
}

function attackMonster(mode) {
        const maxDamage = mode === MODE_ATTACK ? ATTACK_DAMAGE : STRONG_ATTACK_DAMAGE;
        const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLATER_STRONG_ATTACK;

        // if (mode === MODE_ATTACK) {
        //         maxDamage = ATTACK_DAMAGE;
        //         logEvent = LOG_EVENT_PLAYER_ATTACK;
        // } else if (mode === MODE_STRONG_ATTACK) {
        //         maxDamage = STRONG_ATTACK_DAMAGE;
        //         logEvent = LOG_EVENT_PLATER_STRONG_ATTACK;
        // }
        const damage = dealMonsterDamage(maxDamage);
        currentMonsterHealth -= damage;
        writeToLog(logEvent, damage, currentPlayerHealth, currentMonsterHealth);

        endRound();
}

// ! could not get these functions to work
// let playerHealthBarValue = document.getElementById('player-health').value;
// let monsterHealthBarValue = document.getElementById('monster-health').value;

// function playerHealthDanger() {
//         document.getElementById('player-health').style.color = 'red';
// }

// function monsterHealthDanger() {
//         document.getElementById('monster-health').style.color = 'red';
// }

// function checkHealth() {
//         if (playerHealthBarValue === criticalHealth.valueOf) {
//                 playerHealthDanger();
//         } else if (monsterHealthBarValue === criticalHealth.valueOf) {
//                 monsterHealthDanger();
//         }
// }

function attackHandler() {
        attackMonster(MODE_ATTACK);
        attackSound.play();
}

function strongAttackHandler() {
        attackMonster(MODE_STRONG_ATTACK);
        strongAttackSound.play();
}

function healPlayerHandler() {
        let healValue;
        if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
                errorSound.play();
                alert("You can't heal to more than your max health!");
                healValue = chosenMaxLife - currentPlayerHealth;
        } else {
                healValue = HEAL_VALUE;
                healSound.play();
        }

        increasePlayerHealth(healValue);
        currentPlayerHealth += healValue;
        writeToLog(LOG_EVENT_PLAYER_HEAL, healValue, currentPlayerHealth, currentMonsterHealth);
        endRound();
}

function printLogHandler() {
        console.log(battleLog);
        logSound.play();
}

// let sound = document.getElementsByTagName('audio');
// ? Could not get JS to mute the sound variable above so I had to do it like this:

let attackSoundMuted = attackSound.muted;
let strongAttackSoundMuted = strongAttackSound.muted;
let healSoundMuted = healSound.muted;
let logSoundMuted = logSound.muted;
let victorySoundMuted = victorySound.muted;
let gameOverSoundMuted = gameOverSound.muted;
let drawSoundMuted = drawSound.muted;
let bonusLifeSoundMuted = bonusLifeSound.muted;
let dragonSoundMuted = dragonSound.muted;
let correctSoundMuted = correctSound.muted;
let errorSoundMuted = errorSound.muted;

function muteAudio() {
        attackSound.muted = true;
        strongAttackSound.muted = true;
        healSound.muted = true;
        logSound.muted = true;
        victorySound.muted = true;
        gameOverSound.muted = true;
        drawSound.muted = true;
        bonusLifeSound.muted = true;
        dragonSound.muted = true;
        correctSound.muted = true;
        errorSound.muted = true;
}

function unmuteAudio() {
        attackSound.muted = false;
        strongAttackSound.muted = false;
        healSound.muted = false;
        logSound.muted = false;
        victorySound.muted = false;
        gameOverSound.muted = false;
        drawSound.muted = false;
        bonusLifeSound.muted = false;
        dragonSound.muted = false;
        correctSound.muted = false;
        errorSound.muted = false;
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);
muteBtn.addEventListener('click', muteAudio);
unmuteBtn.addEventListener('click', unmuteAudio);
