
class View {

  static showStart() {
      var start = document.getElementById('start');
      var main = document.getElementById('main');

      start.style.display = 'block';
      main.style.display = 'none';
  }

  static showMain() {
      var start = document.getElementById('start');
      var main = document.getElementById('main');

      start.style.display = 'none';
      main.style.display = 'block';

      // test
      appEmitter.emit('show-main');
  }

  static toggleStartOrMain() {
      var start = document.getElementById('start');
      var main = document.getElementById('main');

      start.style.display = 'block';
      main.style.display = 'none';

      // test
  }
}
