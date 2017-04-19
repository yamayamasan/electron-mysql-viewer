const moment = require('moment');
const _ = require('lodash');
class Helper {

  arrayCol(arr, key) {
    return arr.map(v => v[key]);
  }

  isColDateType(field) {
    return (field.toUpperCase() === 'DATE' ||
      field.toUpperCase() === 'DATETIME'
    );
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

  convval(val, v, desc) {
    if (desc[v] && val !== null) {
      if (desc[v].Type === 'date') return moment(val).format(FORMAT.DATE);
      if (desc[v].Type === 'datetime') return moment(val).format(FORMAT.DATETIME);
    }
    return val === null ? 'NULL' : val;
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