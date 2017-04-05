const { dialog } = require('electron').remote;
const fs = require('fs');
const _ = require('lodash');

class Csv {

  constructor() {
    this.opts = {
      filters: [
        { name: 'CSV', extensions: ['csv'] }
      ]
    };
  }

  export (cols, rows) {
    dialog.showSaveDialog(this.opts, (filepath) => {
      try {
        const header = cols.map(col => `"${col.name}"`).join(',');
        Csv.writeToFile(header, filepath);
        rows.forEach((row) => {
          const line = _.map(row, d => _.isNull(d) ? `"NULL"` : `"${d}"`).join(',');
          Csv.writeToFile(line, filepath);
        });
        state.set('push:toast', { type: 'info', title: 'Success save csv file' });
      } catch (e) {
        console.log(e);
        state.set('push:toast', { type: 'error', title: 'Failed save csv file' });
      }
    });
  }

  static writeToFile(line, filepath) {
    fs.appendFileSync(filepath, `${line}\n`);
  }
}

module.exports = Csv;