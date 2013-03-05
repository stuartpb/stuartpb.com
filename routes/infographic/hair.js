var lastHaircut = {
  time: 1362355200000, //March 4, 2013 00:00 GMT
  hairMillimeters: 16
};

function spbHairInMillimeters() {
  return lastHaircut.hairMillimeters + // 27/256 mm per 6 hours
    27/256 * (Date.now() - lastHaircut.time) / 21600000;
}

function updateHair(){
  //todo
}