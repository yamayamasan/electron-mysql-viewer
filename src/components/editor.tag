<editor>
  <div class="row">
    <div class="col s12">
      <div>
        <button class="waves-effect waves-light btn btn-floating" onclick={ slide }>
          <i class="material-icons medium">list</i>
        </button>
        <button class="waves-effect waves-light btn btn-floating" onclick={ run }>
          <i class="material-icons medium">play_for_work</i>
        </button>
        <button class="waves-effect waves-light btn btn-floating" onclick={ stop }>
          <i class="material-icons medium">pause_circle_outline</i>
        </button>
        <a class="waves-effect waves-light btn">button</a>
        <button class="waves-effect waves-light btn btn-floating">
          <i class="material-icons medium">dashboard</i>
        </button>
      </div>
    </div>
  </div>
  <div id="editor"></div>

  <style>
    #editor {
      height: 200px;
    }
    
    .cus-fixed-action-btn {
      position: relative;
      text-align: center;
      width: 100%;
      bottom: 0px;
      left: 0px;
      transition: transform 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53), background-color 0s linear 0.2s;
      overflow: hidden;
    }
  </style>
  <script>
    require('ace-min-noconflict');
    require('ace-min-noconflict/mode-mysql');
    require('ace-min-noconflict/snippets/text');
    require('ace-min-noconflict/snippets/mysql');
    require('ace-min-noconflict/ext-language_tools');
    let editor = null;

    const execRun = () => {
      const text = editor.getCopyText() || editor.getValue();
      state.set('execquery', text);
      state.set('editor-text', editor.getValue());
    }

    const execStop = () => {
      mysql.processKill();
    };

    slide() {
      state.set('slide', true);
    }

    stop() {
      execStop();
    }

    run() {
      execRun();
    }

    this.on('mount', async() => {
      editor = ace.edit("editor");
      editor.$blockScrolling = Infinity;
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
      });
      editor.getSession().setMode("ace/mode/mysql");

      const project = state.get('project');
      const queries = await idxdb.get('queries', {
        project_id: project.id,
      });
      if (queries) editor.setValue(queries.text, -1);

      editor.commands.addCommand({
        name: 'exec run',
        bindKey: {
          win: 'Ctrl-Enter',
          mac: 'Command-Enter'
        },
        exec: function(editor) {
          execRun();
        },
      });

    });
  </script>
</editor>