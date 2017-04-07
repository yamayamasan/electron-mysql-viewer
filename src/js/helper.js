const moment = require('moment');
const _ = require('lodash');
class Helper {

  arrayCol(arr, key) {
    return arr.map(v => v[key]);
  }

  saveQueryText(proId, text) {
    const cond = {
      project_id: proId
    };

    // const queries = await idxdb.get('queries', cond);
    idxdb.get('queries', cond).then((queries) => {
      if (queries) cond.id = queries.id;
      cond.text = text;

      idxdb.put('queries', cond);
    });
  }

  setState(key, val) {
    state.set(key, val);
  }

  getState(key, e) {
    return state.get(key);
  }

  convval(val) {
    const type = typeof val;
    if (type === 'object' && val !== null) {
      if (_.isDate(val)) return moment(val).format('YYYY-MM-DD HH:mm:ss');
    }
    return val;
  }

  fmtDatas(rows) {
    return rows.map((row) => {
      return row;
    });
  }

  fmtRows(fields, rows) {
    const headers = this.arrayCol(fields, 'name');
    /*
    console.log(headers);
    const datas = [];
    rows.forEach((row, i) => {
      const data = {};
      headers.forEach((h, n) => {
        data[n] = row[h];
      });
      datas.push(data);
    });
    */
    const datas = rows.map((row) => {
      const data = {};
      headers.forEach((h, n) => {
        data[n] = row[h];
      });
      return data;
    });
    return datas;
  }
}

module.exports = Helper;