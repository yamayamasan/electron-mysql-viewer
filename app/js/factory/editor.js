'use strict';

APP.factory('editor', [function(){
  function Editor(){
    this.editor = null;
    this.editorSession = null;
  }

  Editor.prototype.initialize = function (_editor) {
    this.editor = _editor;
    this.editorSession = this.editor.getSession();
    this.editor.$blockScrolling = Infinity;
    this.editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    });
    return this;
  };

  Editor.prototype.setValue = function (value, idx) {
    this.editor.setValue(value, idx);
    return this;
  };

  Editor.prototype.insertLastRow = function (value) {
    this.editor.gotoLine(this.editorSession.getLength() + 1);
    this.editor.insert(`\n\n${value}`);
    return this;
  };

  Editor.prototype.getValue = function () {
    return this.editor.getValue();
  };

  Editor.prototype.getCopyText = function () {
    return this.editor.getCopyText();
  };

  

  return new Editor;
}]);
