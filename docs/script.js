const startScreen = document.getElementById("start-screen");
const nicknameInput = document.getElementById("nickname-input");
const playButton = document.getElementById("play-button");
const nickname = document.getElementById("nickname");
const experience = document.getElementById("exp");
const moneyGame = document.getElementById("money");
const music = document.getElementById("background-music");
const shoot = document.getElementById("shoot-sound");
const tank = document.getElementById("tank-image");
const healthbar = document.getElementById("health-bar");
const shootInfo = document.getElementById("shoot-info");
const ammo = document.querySelectorAll(".ammo");
const soundButton = document.getElementById("sound-button");
const soundIcon = document.getElementById("sound-icon");
const resetButton = document.getElementById("reset-button");

const tankTypes = [
    "light",
    "medium",
    "heavy",
    "destroyer"
];

const tankNames = [
    "Light Tank",
    "Medium Tank",
    "Heavy Tank",
    "Tank Destroyer"
];

const tankHealth = [
    1800,
    2300,
    3000,
    2100
];

const tankRewards = {
    light: {
        exp: 100,
        money: 12
    },
    medium: {
        exp: 130,
        money: 20
    },
    heavy: {
        exp: 180,
        money: 40
    },
    destroyer: {
        exp: 150,
        money: 25
    }
};

const ammoStats = {
    AP: {
        damage: [160, 240],
        penetration: [85, 65, 40, 70],
        cost: 1
    },
    APCR: {
        damage: [220, 300],
        penetration: [95, 80, 60, 85],
        cost: 2
    },
    HE: {
        damage: [
            [100, 620],
            [60, 520],
            [20, 220],
            [80, 570]
        ],
        penetration: [100, 100, 100, 100],
        cost: 3
    },
    HEAT: {
        damage: [380, 460],
        penetration: [97, 85, 70, 95],
        cost: 5
    }
};

let tankType;
let tankDestroyed = false;
music.volume = 0.40;
shoot.volume = 0.50;

let pseudo = localStorage.getItem("pseudo");
let exp = localStorage.getItem("exp");
let money = localStorage.getItem("money");

if (pseudo === null || pseudo === "") {
    pseudo = "Noname";
    localStorage.setItem("pseudo", pseudo);
}
if (exp === null) {
    exp = 0;
    localStorage.setItem("exp", exp);
}
if (money === null) {
    money = 35;
    localStorage.setItem("money", money);
}

playButton.addEventListener("click", () => {
    let playerName = nicknameInput.value.trim();
    let nicknameStorage = localStorage.getItem("pseudo");
    if (playerName !== "") {
        pseudo = playerName;
    }
    else if (nicknameStorage !== null && nicknameStorage !== "") {
        pseudo = nicknameStorage;
    }
    else {
        pseudo = "Noname";
    }
    localStorage.setItem("pseudo", pseudo);
    nickname.textContent = pseudo;

    let expValue = localStorage.getItem("exp");
    if (expValue === null || expValue === "")
        exp = 0;
    else
        exp = Number(expValue);
    localStorage.setItem("exp", exp);
    experience.textContent = exp;

    let moneyCount = localStorage.getItem("money");
    if (moneyCount === null || moneyCount === "")
        money = 35;
    else
        money = Number(moneyCount);
    localStorage.setItem("money", money);
    moneyGame.textContent = money;

    music.play();
    startScreen.style.display = "none";
});


(function updateStorage() {
  setTimeout(() => {
    localStorage.setItem("pseudo", pseudo);
    localStorage.setItem("exp", exp);
    localStorage.setItem("money", money);
    console.log("Updated:", localStorage.getItem("pseudo"), localStorage.getItem("exp"), localStorage.getItem("money"));
    updateStorage();
  }, 10000);
})();

soundButton.addEventListener("click", () => {
    if (soundIcon.src.includes("sound-on.png")) {
        soundIcon.src = "images/sound-off.png";
        music.pause();
    } else {
        soundIcon.src = "images/sound-on.png";
        music.play();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("nickname").textContent = pseudo;
    document.getElementById("exp").textContent = exp;
    document.getElementById("money").textContent = money;
    generateAmmoStats();
    generateTank();
});

function generateAmmoStats() {
    ammo.forEach(shell => {
        const ammoType = shell.id;
        const stats = ammoStats[ammoType];

        const damageElement = shell.querySelector(".ammo-damage");
        const penetrationElement = shell.querySelector(".ammo-penetration");
        const costElement = shell.querySelector(".ammo-cost");

        if (ammoType === "HE") {
            damageElement.innerHTML =
                "Light: " + stats.damage[0][0] + "-" + stats.damage[0][1] + "<br>" +
                "Medium: " + stats.damage[1][0] + "-" + stats.damage[1][1] + "<br>" +
                "Heavy: " + stats.damage[2][0] + "-" + stats.damage[2][1] + "<br>" +
                "Destroyer: " + stats.damage[3][0] + "-" + stats.damage[3][1];
        } else {
            damageElement.textContent =
                stats.damage[0] + "-" + stats.damage[1];
        }

        penetrationElement.textContent =
            stats.penetration.join("% / ") + "%";

        costElement.textContent = stats.cost;
    });
}

function generateTank() {
    const random = Math.floor(Math.random() * tankTypes.length);
    tankType = tankTypes[random];
    tank.src = "images/tanks/" + tankType + ".png";
    document.getElementById("tank-name").textContent = tankNames[random];
    healthbar.max = tankHealth[random];
    healthbar.value = tankHealth[random];
    tankDestroyed = false;
    updateHealthBar();
}

function randomDamage(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

function updateHealthBar() {
    document.getElementById("text-health-bar").textContent =
        healthbar.value + "/" + healthbar.max;
}

function showShootInfo(message) {
    shootInfo.textContent = message;
    shootInfo.classList.add("show");
    setTimeout(() => {
        shootInfo.classList.remove("show");
    }, 2500);
}

tank.addEventListener("click", () => {
    if (tankDestroyed) {
        return;
    }
    const activeAmmo = document.querySelector(".ammo.active");
    if (!activeAmmo) {
        return;
    }
    const ammoType = activeAmmo.id;
    const ammoData = ammoStats[ammoType];
    if (money<ammoData.cost){
        showShootInfo("Don't enough money!");
        return;
    }
    shoot.currentTime = 0;
    shoot.play();
    money-=ammoData.cost;
    moneyGame.textContent = money;
    const tankIndex = tankTypes.indexOf(tankType);
    const penetrationChance = ammoData.penetration[tankIndex];
    const penetrationRoll = Math.floor(Math.random() * 100) + 1;
    let penetrated = false;
    let damage = 0;

    if (penetrationRoll <= penetrationChance) {
        penetrated = true;
        if (ammoType === "HE") {
            const minDamage =
                ammoData.damage[tankIndex][0];
            const maxDamage =
                ammoData.damage[tankIndex][1];
            damage = randomDamage(
                minDamage,
                maxDamage
            );
        }
        else {
            const minDamage =
                ammoData.damage[0];
            const maxDamage =
                ammoData.damage[1];
            damage = randomDamage(
                minDamage,
                maxDamage
            );
        }
    }

    if (penetrated) {
        healthbar.value -= damage;
        if (healthbar.value < 0) {
            healthbar.value = 0;
        }
        updateHealthBar();
        showShootInfo(
            ammoType +
            " | PENETRATED | -" +
            damage +
            " HP"
        );
    }
    else {
        showShootInfo(
            ammoType +
            " | DID NOT PENETRATE"
        );
    }

    tank.classList.add("hit");
    setTimeout(() => {
        tank.classList.remove("hit");
    }, 100);

    if (healthbar.value <= 0) {
        tankDestroyed = true;
        const rewardMoney = tankRewards[tankType]["money"];
        const rewardExp = tankRewards[tankType]["exp"];
        exp += rewardExp;
        money += rewardMoney;
        localStorage.setItem("exp", exp);
        localStorage.setItem("money", money);
        experience.textContent = exp;
        moneyGame.textContent = money;
        showShootInfo(
            ammoType +
            " | DESTROYED | +" +
            rewardMoney +
            " MONEY / +" +
            rewardExp +
            " EXP"
        );
        setTimeout(() => {
            generateTank();
        }, 1500);
    }
});

ammo.forEach(shell => {
    shell.addEventListener("click", () => {
        ammo.forEach(item => {
            item.classList.remove("active");
            const status =
                item.querySelector(".ammo-status");
            if (status) {
                status.remove();
            }
        });

        shell.classList.add("active");
        const status = document.createElement("span");
        status.classList.add("ammo-status");
        status.textContent = "ACTIVE";
        shell.appendChild(status);
    });
});

resetButton.addEventListener("click", () => {
    localStorage.setItem("pseudo", "Noname");
    localStorage.setItem("exp", 0);
    localStorage.setItem("money", 35);
    pseudo = "Noname";
    exp = 0;
    money = 35;
    nickname.textContent = pseudo;
    experience.textContent = exp;
    moneyGame.textContent = money;
    nicknameInput.value = "";
    music.pause();
    music.currentTime = 0;
    startScreen.style.display = "flex";
});