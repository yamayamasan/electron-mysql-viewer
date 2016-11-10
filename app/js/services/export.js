'use strict';

const remote = require('electron').remote;
const dialog = remote.dialog;

APP.service('export', function(){

  const writeToFile = (line, filepath) => {
    fs.appendFileSync(filepath, `${line}\n`);
  };

  return {
    exportCsv: function(columns, rows) {
      const opts = {
        filters: [
          {name: 'CSV', extensions: ['csv']}
        ]
      };
      dialog.showSaveDialog(opts, (filepath) => {
        fs.writeFile(filepath, '' ,  (err) => {
          const colLine = columns.map((col) => {
            return `"${col}"`;
          }).join(',');
          writeToFile(colLine, filepath);
          
          rows.forEach((row) => {
            const line = _.values(_.omit(row, ['$$hashKey'])).map((data) => {
              return _.isNull(data)?  '"NULL"' : `"${data}"`;
            }).join(',');
            writeToFile(line, filepath);
          });
        });
      });
    }
  };
});
