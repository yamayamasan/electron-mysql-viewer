
class Init {
  static view() {
    var start = document.getElementById('start');
    var main = document.getElementById('main');

    start.style.display = 'block';
    main.style.display = 'none';
  }

  static setAce() {
    var editor = new EditorWrap();
  }

  static viewConnectionInfo() {
    var infos = LocalStorage.get('mysqlOptions');
    console.log(infos);
    var names = R.keys(infos);
    console.log(names);
    console.log(document.getElementById('conList01'));
    document.getElementById('conList01').innerHtml = names[0];
    document.getElementById('conList02').innerHtml = names[1];
    console.log(document.getElementById('conList01'));
  }
}

Init.view();
Init.setAce();
Init.viewConnectionInfo();
