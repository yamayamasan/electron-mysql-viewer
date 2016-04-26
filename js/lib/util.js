
class Util {
  static elementIdsKeyValue(ids) {
    var object = {};
    R.forEach((id) => {
      object[id] = document.getElementById(id).value;
    }, ids);

    return object;
  }

}
