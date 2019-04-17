
function initGameData() {
  var gameData = {
    mana: null,
    manaPerClick: 1,
    multiplier: 1,
    lastSaved: '',
    items: {
      spells: {
        owned: 0,
        baseCost: 4,
        coefficient: 1.07,
        iniTime: 0.6,
        iniRevenue: 1,
        costNext: 4,
        productivity: 0,
        production: 0,
      },
      wands: {
        owned: 0,
        baseCost: 60,
        coefficient: 1.15,
        iniTime: 3,
        iniRevenue: 60,
        costNext: 60,
        productivity: 0,
        production: 0,
      },
      wizards: {
        owned: 0,
        baseCost: 720,
        coefficient: 1.14,
        iniTime: 6,
        iniRevenue: 540,
        costNext: 720,
        productivity: 0,
        production: 0,
      },
      professors: {
        owned: 0,
        baseCost: 8640,
        coefficient: 1.13,
        iniTime: 12,
        iniRevenue: 4320,
        costNext: 8640,
        productivity: 0,
        production: 0,
      },
      schools: {
        owned: 0,
        baseCost: 103680,
        coefficient: 1.12,
        iniTime: 24,
        iniRevenue: 51840,
        costNext: 103680,
        productivity: 0,
        production: 0,
      },
    },
  };
  return gameData;
}


window.onload = initUI;

window.setInterval(function(){
  autoMana();
}, 1000)

var saveGameLoop = window.setInterval(function() {
  var d = new Date();
  gameData.lastSaved = d.toString();
  localStorage.setItem('wizardClickerSave', JSON.stringify(gameData));
  document.getElementById("lastSaved").innerHTML = "<small>Last saved: " + gameData.lastSaved + "</small>";
}, 15000)

function initUI() {
  window.gameData = new initGameData();
  var savegame = JSON.parse(localStorage.getItem("wizardClickerSave"))
  if (savegame !== null) {
    gameData = savegame;
  }
  console.log(gameData);
  for (const obj in gameData.items) {
    var price = gameData.items[obj].costNext;
    var owned = gameData.items[obj].owned;
    document.getElementById("lastSaved").innerHTML = "<small>Last saved: " + gameData.lastSaved + "</small>"
    updateButton(obj, price, owned);
    updateMana();
  }
}

function gainMana() {
  gameData.mana += gameData.manaPerClick;
  updateMana();
}

function autoMana() {
  for (const obj in gameData.items) {
    gameData.mana += gameData.items[obj].production * gameData.multiplier;
    updateMana();
  }
}

function buyItem(obj) {
  const item = gameData.items[obj];
  if(item.costNext <= gameData.mana) {
    gameData.mana -= item.costNext;
    item.owned += 1;
    item.costNext = item.baseCost * Math.pow(item.coefficient, item.owned);
    item.productivity = item.iniRevenue / item.iniTime;
    item.production = item.owned * item.productivity;
    updateButton(obj, item.costNext, item.owned);
  }
  updateMana();
}

function updateMana() {
  var manaString = "";
  if (gameData.mana === null) {
    gameData.mana = 0;
  }
  if (gameData.mana < 1000) {
    manaString = gameData.mana.toFixed(2);
  } else {
    manaString = gameData.mana.toExponential(2);
  }
  document.getElementById("manaGained").innerHTML = "Mana: " + manaString;
}

function updateButton(obj, price, owned) {
  var item = obj.toLowerCase();
  var buyString = item + "Buy";
  var ownString = item + "Owned";
  var priceString = "";
  if (price < 1000) {
    priceString = price.toFixed(1);
  } else {
    priceString = price.toExponential(1);
  }
  document.getElementById(buyString).innerHTML = "Buy " + obj + "<br>Price: " + priceString;
  document.getElementById(ownString).innerHTML = obj + ": " + owned;
}

function resetGame() {
  localStorage.removeItem('wizardClickerSave');
  initUI();
}
