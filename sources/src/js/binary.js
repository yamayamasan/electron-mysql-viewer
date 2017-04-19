const crypto = require('crypto');
// const config = require('../../config/init.json');

class Binary {

  constructor({ method = null, characode = null, algorithm = null}) {
    this.method = method || 'base64';
    this.characode = characode || 'utf-8';
    this.algorithm = algorithm || 'aes-256-ctr';
    // this.secret = config.secret;
    this.secret = 'imgviewer';
  }

  encode(data) {
    const str = (typeof data === 'object') ? JSON.stringify(data) : data;
    const buffer = new Buffer(str, this.characode);
    const enc = buffer.toString(this.method);
    return enc;
  }

  decode(buffer) {
    const debuffer = new Buffer(buffer, this.method);
    const str = debuffer.toString();
    return str;
  }

  hash(data) {
    const str = (typeof data === 'object') ? JSON.stringify(data) : data;
    const { algorithm, secret, method } = this;

    const cipher = crypto.createCipher(algorithm, secret);
    const crypted = cipher.update(str, 'utf8', method);
    const hash = `${crypted}${cipher.final(method)}`;
    return hash;
  }

  dehash(hash) {
    const { algorithm, secret, method } = this;
    const decipher = crypto.createDecipher(algorithm, secret);
    const dec = decipher.update(hash, method, 'utf8');
    const dehash = `${dec}${decipher.final('utf8')}`;
    return dehash;
  }
}

module.exports = Binary;
