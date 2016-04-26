
class EditorWrap {

  constructor() {
    this.soKey = 'ace';
    if (!hasSingleObject(this.soKey)) {
      this.editor = ace.edit('editor');
      this.editor.getSession().setMode('ace/mode/sql');
      this.editor.$blockScrolling = Infinity;
      this.editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
      });
      setSingleObject(this.soKey);
    }
  }

  getValue() {
    return this.editor.getValue();
  }

  setValue(data) {
    this.editor.setValue(data);
  }

  getThemeList() {
    return this.themelist;
  }

  getModeList() {
    return this.modelist.getModeForPath();
  }
}
