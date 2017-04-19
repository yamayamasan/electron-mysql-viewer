class Excelike {

    exec(table, lines, cols) {
        for (let i = 0; i < lines.length; i++) {
            let row = table.insertRow(-1); //テーブルの最後に一行追加
            for (let k = 0; k < cols.length; k++) {
                const letter = String.fromCharCode('A'.charCodeAt(0) + k - 1);
                row.insertCell(-1).innerHTML = i && k ? `<input id="${letter}" class="cell"/>` : i || letter;
            }
        }
        const cells = document.querySelectorAll('input.cell');
        cells.forEach((cell) => {
            // cell.onfocus = e => e.target.value = 

        });
    }

    /**
     * 
     * 
     * 
const date = new Date();

let [, year, month, day, hour, min, sec, msec, tz] = date.toISOString().match(/([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})\.([0-9]{3})(.*)$/)
if (tz === 'Z') hour = (Number(hour) + 9).toString();
console.log(year, month, day, hour, min, sec, msec, tz);
     */

    run(table) {
        for (var i = 0; i < 6; i++) {
            // 縦
            var row = document.querySelector(table).insertRow(-1);
            for (var j = 0; j < 6; j++) {
                // 横
                var letter = String.fromCharCode("A".charCodeAt(0) + j - 1);
                row.insertCell(-1).innerHTML = i && j ? "<input id='" + letter + i + "'/>" : i || letter;
            }
        }

        var DATA = {},
            INPUTS = [].slice.call(document.querySelectorAll("input"));
        console.log(INPUTS);
        INPUTS.forEach(function(elm) {
            elm.onfocus = function(e) {
                e.target.value = localStorage[e.target.id] || "";
            };
            elm.onblur = function(e) {
                localStorage[e.target.id] = e.target.value;
                computeAll();
            };
            var getter = function() {
                var value = localStorage[elm.id] || "";
                if (value.charAt(0) == "=") {
                    console.log(DATA);
                    // with(DATA) return eval(value.substring(1));
                } else { return isNaN(parseFloat(value)) ? value : parseFloat(value); }
            };
            Object.defineProperty(DATA, elm.id, { get: getter });
            Object.defineProperty(DATA, elm.id.toLowerCase(), { get: getter });
        });
        (window.computeAll = function() {
            INPUTS.forEach(function(elm) { try { elm.value = DATA[elm.id]; } catch (e) {} });
        })();
    }
}

module.exports = Excelike;