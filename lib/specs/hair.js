var lastHaircut = {
  time: 1564898400000, // Sat Aug 03 2019 23:00:00 GMT-0700 (Pacific Daylight Time)
  hairMillimeters: 3
};

function spbHairInMillimeters() {
  return lastHaircut.hairMillimeters + // 27/2048 mm per 36 minutes
    27/2048 * (Date.now() - lastHaircut.time) / 2160000;
}

function updateHair(testLength){
  var hairLength = testLength || spbHairInMillimeters();

  //set the shape size
  document.getElementById("hairellipse").rx.baseVal.value = 50 +
    hairLength / 5;

  document.getElementById("hairlength").textContent = hairLength.toFixed(3)
    + ' mm';

  document.getElementById("hair-label-group").transform.baseVal.getItem(0)
    .setTranslate(hairLength / 5,0);
}
