
class LocalStorage {

  static put(key, value) {
    if (typeof value === 'object') {
      value = this.objectMerge(key, value);
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  }

  static get(key) {
    var val =  localStorage.getItem(key);

    var isObj = R.match(/^{.*}$/, val);
    if (isObj.length > 0) {
      val = JSON.parse(val);
    }
    return val;
  }

  static remove(key, inObjectKey) {
    if (inObjectKey) {
      var value = this.objectSeparat(key, inObjectKey);
      value = JSON.stringify(value);
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  }

  static objectSeparat(key, inKey) {
    var org = this.get(key);

    if (org) delete org[inKey];
    
    return org;
  }

  static objectMerge(key, value) {
    var org = this.get(key);
    if (org) {
      // @TODO after ramda function
      var key = R.keys(value)[0];
      // @TODO check exist
      org[key] = value[key];
    } else {
      org = value;
    }

    return org;
  }
}
