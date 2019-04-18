
function initGameData() {
  var gameData = {
    mana: null,
    manaPerClick: 1,
    multiplier: 1,
    offlineMultiplier: 0.5,
    totalProduction: 0,
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
  gameData.lastSaved = Date.now();
  localStorage.setItem('wizardClickerSave', JSON.stringify(gameData));
  document.getElementById("lastSaved").innerHTML = "<small>Last saved: " + d.toString() + "</small>";
}, 10000)

function initUI() {
  //Initialize gamedata
  window.gameData = new initGameData();

  //If there is a saved game, overwrite with data from localstorage
  var savegame = JSON.parse(localStorage.getItem("wizardClickerSave"))
  if (savegame !== null) {
    gameData = savegame;

    //Generate mana based on time offline
    var timeDiff = Date.now() - gameData.lastSaved;
    var timeDiffSecs = timeDiff / 1000;
    var offlineProd = timeDiffSecs * gameData.totalProduction * gameData.offlineMultiplier;
    if (offlineProd > 1000) {
      var offProdString = offlineProd.toExponential(2);
    } else {
      var offProdString = offlineProd.toFixed(2);
    }
    // Add string to modal telling player how much mana has been gained during offline time
    document.getElementById("offlineModalBody").innerHTML = "You have gained " + offProdString + " mana while offline!";
    // Toggling modal
    $("#offlineProdModal").modal();
    //Updating mana
    gameData.mana += offlineProd;
    updateMana();
  }

  for (const obj in gameData.items) {
    var price = gameData.items[obj].costNext;
    var owned = gameData.items[obj].owned;
    var production = gameData.items[obj].production;
    document.getElementById("lastSaved").innerHTML = "<small>Last saved: " + gameData.lastSaved + "</small>"
    updateButton(obj, price, owned, production);
    updateMana();
  }
}

function gainMana() {
  gameData.mana += gameData.manaPerClick;
  updateMana();
}

function autoMana() {
  var totalProd = 0;
  for (const obj in gameData.items) {
    var item = gameData.items[obj];
    totalProd += item.production * gameData.multiplier;
  }
  gameData.totalProduction = totalProd;
  gameData.mana += gameData.totalProduction;
  updateMana();
  for (const obj in gameData.items) {
    var item = gameData.items[obj];
    updateButton(obj, item.costNext, item.owned, item.production);
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
    updateButton(obj, item.costNext, item.owned, item.production);
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

function updateButton(obj, price, owned, production) {
  var item = obj.toLowerCase();
  var buyString = item + "Buy";
  var ownString = item + "Owned";
  var prodString = item + "Production";
  var priceString = "";
  var productionValue = "";

  if (price < 1000) {
    priceString = price.toFixed(1);
  } else {
    priceString = price.toExponential(2);
  }

  if (production < 1000) {
    productionValue = production.toFixed(1);
  } else {
    productionValue = production.toExponential(2);
  }

  if (gameData.mana < price) {
    document.getElementById(buyString).classList.add("btn-danger");
    document.getElementById(buyString).classList.remove("btn-info");
  } else {
    document.getElementById(buyString).classList.remove("btn-danger");
    document.getElementById(buyString).classList.add("btn-info");
  }

  document.getElementById(buyString).innerHTML = "Buy " + capitalizeFirstLetter(obj) + "<br>Price: " + priceString;
  document.getElementById(ownString).innerHTML = capitalizeFirstLetter(obj) + ": " + owned;
  document.getElementById(prodString).innerHTML = productionValue + " mana/sec";
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function resetGame() {
  localStorage.removeItem('wizardClickerSave');
  initUI();
}
