const moment = require('moment');


for (let i = 0;i < 15000;i++) {
  const nowad = moment().add(i, 'second').format('YYYY-MM-DD HH:mm:ss');
  const line = `('300ce010-4d59-463c-a107-5f5f4b554c03', '${nowad}', 35.5006885, 139.4681716, 104,  NULL, 11,     11,     '2017-04-02 08:47:08', '2017-04-02 08:47:08', NULL),`;
  console.log(line);
}
