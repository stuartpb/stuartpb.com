var lastHaircut = {
  time: 1362355200000, //March 4, 2013 00:00 GMT
  hairMillimeters: 16
};

function spbHairInMillimeters() {
  return lastHaircut.hairMillimeters + // 27/256 mm per 6 hours
    27/256 * (Date.now() - lastHaircut.time) / 21600000;
}

function updateHair(testLength){
  var hairLength = testLength || spbHairInMillimeters();
  
  //set the shape size
  document.getElementById("hairellipse").rx.baseVal.value = 50 +
    hairLength / 5;
    
  document.getElementById("hairlength").textContent = hairLength.toFixed(2)
    + ' mm';
    
  document.getElementById("hair-label-group").transform.baseVal.getItem(0)
    .setTranslate(hairLength / 5,0);
}