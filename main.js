var gameData = {
  mana: 0,
  manaPerClick: 1,
  multiplier: 1,
  items: {
    spells: {
      owned: 0,
      baseCost: 4,
      coefficient: 1.07,
      iniTime: 0.6,
      iniRevenue: 1,
      costNext: function() {return (this.baseCost * Math.pow(this.coefficient, this.owned))},
      productivity: function() {return (this.iniRevenue/this.iniTime);},
      production: function() {return (this.owned * this.productivity())},
    },
    wands: {
      owned: 0,
      baseCost: 60,
      coefficient: 1.15,
      iniTime: 3,
      iniRevenue: 60,
      costNext: function() {return (this.baseCost * Math.pow(this.coefficient, this.owned))},
      productivity: function() {return (this.iniRevenue/this.iniTime);},
      production: function() {return (this.owned * this.productivity())},
    },
    wizards: {
      owned: 0,
      baseCost: 720,
      coefficient: 1.14,
      iniTime: 6,
      iniRevenue: 540,
      costNext: function() {return (this.baseCost * Math.pow(this.coefficient, this.owned))},
      productivity: function() {return (this.iniRevenue/this.iniTime);},
      production: function() {return (this.owned * this.productivity())},
    },
    professors: {
      owned: 0,
      baseCost: 8640,
      coefficient: 1.13,
      iniTime: 12,
      iniRevenue: 4320,
      costNext: function() {return (this.baseCost * Math.pow(this.coefficient, this.owned))},
      productivity: function() {return (this.iniRevenue/this.iniTime);},
      production: function() {return (this.owned * this.productivity())},
    },
    schools: {
      owned: 0,
      baseCost: 103680,
      coefficient: 1.12,
      iniTime: 24,
      iniRevenue: 51840,
      costNext: function() {return (this.baseCost * Math.pow(this.coefficient, this.owned))},
      productivity: function() {return (this.iniRevenue/this.iniTime);},
      production: function() {return (this.owned * this.productivity())},
    },
  },
};

window.onload = initUI;

window.setInterval(function(){
  autoMana();
}, 1000)

function initUI() {
  for (const obj in gameData.items) {
    var price = gameData.items[obj].costNext();
    var owned = gameData.items[obj].owned;
    updateButton(obj, price, owned);
  }
}

for (var item in gameData.items) {
  const it = gameData.items[item].production();
  console.log(it);
}

function gainMana() {
  gameData.mana += gameData.manaPerClick;
  updateMana();
}

function autoMana() {
  for (const obj in gameData.items) {
    gameData.mana += gameData.items[obj].production() * gameData.multiplier;
    updateMana();
  }
}

function buyItem(obj) {
  const item = gameData.items[obj];
  if(item.costNext() <= gameData.mana) {
    gameData.mana -= item.costNext();
    item.owned += 1;
    updateButton(obj, item.costNext(), item.owned);
  }
  updateMana();
}

function updateMana() {
  var manaString = "";
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
