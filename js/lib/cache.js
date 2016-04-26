
var single = {};

function setSingleObject(key, val) {
  //if (!sinlge[key]) {
    single[key] = val;
  //}
}

function getSingleObject(key) {
  return single[key];
}

function hasSingleObject(key) {
  if (single[key]) return true;

  return false;
}

function delSingleObject(key) {

}
