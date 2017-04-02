<editor>
  <div id="editor"></div>

  <div class="row">
    <div class="col s12">
      <div>
        <a class="waves-effect waves-light btn">button</a>
        <a class="waves-effect waves-light btn">button</a>
        <a class="waves-effect waves-light btn">button</a>
      </div>
    </div>
  </div>

  <!--
  <div class="row">
    <div class="col s12">
      <div class="cus-fixed-action-btn fixed-action-btn toolbar active light-blue lighten-4">
        <ul>
          <li class="waves-effect waves-light"><a href="#!" style="opacity: 1;"><i class="material-icons">insert_chart</i></a></li>
          <li class="waves-effect waves-light"><a href="#!" style="opacity: 1;"><i class="material-icons">format_quote</i></a></li>
          <li class="waves-effect waves-light"><a href="#!" style="opacity: 1;"><i class="material-icons">publish</i></a></li>
          <li class="waves-effect waves-light"><a href="#!" style="opacity: 1;"><i class="material-icons">attach_file</i></a></li>
        </ul>
      </div>
    </div>
  </div>
  -->
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
    // require('ace-min-noconflict/mode-javascript');

    let editor = null;
    this.on('mount', () => {
      editor = ace.edit("editor");
      editor.$blockScrolling = Infinity;
    });
  </script>
</editor>