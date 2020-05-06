// TODO add more sounds to game
// TODO write a function for the scoreboard
// TODO test the healthDanger() function

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

// es-lint disable
// eslint-disable-next-line prefer-const
// determines maximum health points for player and monster
const inputValue = prompt('Determine the health points for you and the Monster!', '100');
let chosenMaxLife = parseInt(inputValue);
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
        alert('You did not enter a number or the number you entered was too low!');
        chosenMaxLife = 100;
}

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

// monster attack, checks for bonus life and win condition
function endRound() {
        const initialPlayerHealth = currentPlayerHealth;
        const playerDamage = dealPlayerDamage(MONSTER_ATTACK_DAMAGE);
        currentPlayerHealth -= playerDamage;
        writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentPlayerHealth, currentMonsterHealth);

        if (currentPlayerHealth <= 0 && hasBonusLife) {
                hasBonusLife = false;
                removeBonusLife();
                currentPlayerHealth = initialPlayerHealth;
                setPlayerHealth(initialPlayerHealth);
                alert('You would be dead, but the bonus life saved you!');
        }

        if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
                victorySound.play();
                alert('You won!');
                writeToLog(LOG_EVENT_GAME_OVER, 'PLAYER WON', currentPlayerHealth, currentMonsterHealth);
        } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
                alert('You lost!');
                writeToLog(LOG_EVENT_GAME_OVER, 'MONSTER WON', currentPlayerHealth, currentMonsterHealth);
        } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
                alert('You have a draw!');
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

// ! test this function
function healthDanger() {
        if (monsterHealthBar.value === chosenMaxLife / 2) {
                document.getElementById('player-health').style.color = 'red';
        } else if (playerHealthBar.value === chosenMaxLife / 2) {
                document.getElementById('player-health').style.color = 'red';
        }
}

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

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);
