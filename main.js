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

for (var item in gameData.items) {
  const it = gameData.items[item].production();
  console.log(it);
}

function gainMana() {
  gameData.mana += gameData.manaPerClick;
  updateMana();
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
  document.getElementById("manaGained").innerHTML = "Mana: " + gameData.mana;
}

function updateButton(obj, price, owned) {
  var item = obj.toLowerCase();
  var buyString = item + "Buy";
  var ownString = item + "Owned";
  document.getElementById(buyString).innerHTML = "Buy " + obj + "<br>Price: " + price.toFixed(1);
  document.getElementById(ownString).innerHTML = obj + ": " + owned;
}
