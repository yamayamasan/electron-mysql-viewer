// 'use strict';

APP.service('echart', function(){

  return {
    bar: function(ele, _options) {
      const chart = echarts.init(document.querySelector(ele));
      
      _options.series.map((series) => {
        series.type = 'bar';
      });

      const options = _.merge({
        title: {
          text: 'title'
        },
        xAxis: [{
          // 横軸
          type: 'category',
          data: []
        }],
        yAxis: [{
          type: 'value'
        }],
        series: []
      }, _options);

      console.log('options', options);

      chart.setOption(options);
    }
  };
});

// sheet
APP.service('sheet', function(){

  return {
    generate: function(values, columns, target) {
      for (let i = 0;i < values.length + 1; i++) {
        // 縦軸
        const row = document.querySelector(target).insertRow(-1);

        const current = values[i - 1];

        for (let j = 0;j < columns.length; j++) {
          // 横軸
          const column = columns[j];
          const letter = String.fromCharCode("A".charCodeAt(0)+j-1);
          // row.insertCell(-1).innerHTML = i&&j ? "<input id='"+ letter+i +"'/>" : i||letter;
          row.insertCell(-1).innerHTML = (() => {
            if (i === 0) {
              // 一行目
              return column;
            } else {
              return `<input id='${letter + i}' value='${current[column]}' readonly='readonly'/>`;
            }
          })();
          // row.insertCell(-1).innerHTML = i&&j ? `<input id='${letter + i}' value='${current[column]}' />` : i || column;
          
        }
      }

      // var DATA={}, INPUTS=[].slice.call(document.querySelectorAll("input"));
      // INPUTS.forEach(function(elm) {
      //   elm.onfocus = function(e) {
      //     // e.target.value = localStorage[e.target.id] || "";
      //   };
      //   elm.onblur = function(e) {
      //     // localStorage[e.target.id] = e.target.value;
      //     // computeAll();
      //   };
      //   var getter = function() {
      //     var value = localStorage[elm.id] || "";
      //     if (value.charAt(0) == "=") {
      //       with (DATA) return eval(value.substring(1));
      //     } else { 
      //       return isNaN(parseFloat(value)) ? value : parseFloat(value); 
      //     }
      //   };
      //   Object.defineProperty(DATA, elm.id, {get:getter});
      //   Object.defineProperty(DATA, elm.id.toLowerCase(), {get:getter});
      // });
      // (window.computeAll = function() {
      //     INPUTS.forEach(function(elm) { try { elm.value = DATA[elm.id]; } catch(e) {} });
      // })();
    }
  };
});
// for (var i=0; i<6; i++) {
//     var row = document.querySelector("table").insertRow(-1);
//     for (var j=0; j<6; j++) {
//         var letter = String.fromCharCode("A".charCodeAt(0)+j-1);
//         row.insertCell(-1).innerHTML = i&&j ? "<input id='"+ letter+i +"'/>" : i||letter;
//     }
// }

// var DATA={}, INPUTS=[].slice.call(document.querySelectorAll("input"));
// INPUTS.forEach(function(elm) {
//     elm.onfocus = function(e) {
//         e.target.value = localStorage[e.target.id] || "";
//     };
//     elm.onblur = function(e) {
//         localStorage[e.target.id] = e.target.value;
//         computeAll();
//     };
//     var getter = function() {
//         var value = localStorage[elm.id] || "";
//         if (value.charAt(0) == "=") {
//             with (DATA) return eval(value.substring(1));
//         } else { return isNaN(parseFloat(value)) ? value : parseFloat(value); }
//     };
//     Object.defineProperty(DATA, elm.id, {get:getter});
//     Object.defineProperty(DATA, elm.id.toLowerCase(), {get:getter});
// });
// (window.computeAll = function() {
//     INPUTS.forEach(function(elm) { try { elm.value = DATA[elm.id]; } catch(e) {} });
// })();
