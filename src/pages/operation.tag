<operation>
  <div class="row">
    <div class="col tables-nav">
      <button id="close-table-nav" class="waves-effect waves-light btn btn-floating red lighten-1" onclick={ closeSlide }>
        <i class="material-icons medium">close</i>
      </button>
      <div class="clearfix"></div>
      <ul class="collection with-header z-depth-3">
        <li class="collection-header">
          <h6>DB Name</h6>
            <ul id='dropdown1' class='dropdown-content'>
    <li><a href="#!">one</a></li>
    <li><a href="#!">two</a></li>
    <li class="divider"></li>
    <li><a href="#!">three</a></li>
    <li><a href="#!"><i class="material-icons">view_module</i>four</a></li>
    <li><a href="#!"><i class="material-icons">cloud</i>five</a></li>
  </ul>
        </li>
        <li class="collection-item" each={ table in vv.tables }>
          <div>
            <ul class='table-acts'>
              <li class='table-act'><a class="btn-floating red" style="transform: scaleY(1) scaleX(1) translateY(0px) translateX(0px); opacity: 1;"><i class="material-icons">insert_chart</i></a></li>
              <li class='table-act'><a class="btn-floating yellow darken-1" style="transform: scaleY(1) scaleX(1) translateY(0px) translateX(0px); opacity: 1;"><i class="material-icons">format_quote</i></a></li>
              <li class='table-act'><a class="btn-floating green" style="transform: scaleY(1) scaleX(1) translateY(0px) translateX(0px); opacity: 1;"><i class="material-icons">publish</i></a></li>
              <li class='table-act'><a class="btn-floating blue" style="transform: scaleY(1) scaleX(1) translateY(0px) translateX(0px); opacity: 1;"><i class="material-icons">attach_file</i></a></li>
            </ul>
            <a href="#!" class="secondary-content" onclick={ onTblAct }>
              <i class="material-icons">more_vert</i>
            </a>
            <span>{ table }</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="col s12" id="operation-block">
      <div class="section">
        <editor></editor>
      </div>
      <div class="divider"></div>
      <div class="row" if={ vv.isData }>
        <div class="col s12">
          <div>
            <button class="waves-effect waves-light btn btn-floating" onclick={ csvDownload }>
              <i class="material-icons medium">play_circle_outline</i>
            </button>
          </div>
        </div>
      </div>
      <div class="section data-section" if={ vv.isData }>
        <table class="striped" id="data-table">
          <thead>
            <tr>
              <th each={ filed in vv.fields }>{ filed.name }</th>
            </tr>
          </thead>
          <tbody id="data-tbody">
            <tr each={row in vv.rows}>
              <td each={ val in row } class="data-td">{ convval(val) }</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="section" if={ vv.isData }>
        <div class='row'>
          <div class='col s12'>
            <ul class="collapsible" data-collapsible="accordion">
              <li>
                <div class="collapsible-header"><i class="material-icons">filter_drama</i>Info</div>
                <div class="collapsible-body">
                  <p>query: { vv.query }</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <style>
    .data-td {
      overflow-x: auto;
      white-space: nowrap;
    }
    
    .data-section {
      overflow-x: auto;
      min-height: 250px;
      max-height: 500px;
    }
    
    .tables-nav {
      position: absolute;
      z-index: 999;
      transform: translateX(-280px);
      transition-duration: 0.5s;
    }
    
    .slide-open {
      z-index: 1003;
      transform: translateX(-12px);
      transition-duration: 0.5s;
    }
    
    #close-table-nav {
      float: right;
      top: 50px;
    }
    
    #background {
      height: 100px;
      background-color: rgba(0, 0, 0, 0.5);
      width: 100%;
      z-index: 1000;
      position: fixed;
      height: 100vh;
      top: 0;
      left: 0;
      display: none;
    }
    ul.table-acts { 
      position: fixed; 
      width: 210px;
      margin-top: -9px;
    } 
    li.table-act{ 
      float: left; 
      padding: 0px 5px;
      transform: scale(0);
      transition-duration: 0.5s;
      display: none;
    } 
    li.table-act.active{ 
      transform: scale(1);
      transition-duration: 0.5s;
    }
    .mis {
          transform: scale(0);
      transition-duration: 0.5s;
    }
  </style>
  <script>
    const csv = new Csv();
    const _ = require('lodash');
    const moment = require('moment');
    const view = new View({
      tables: [],
      fields: [],
      rows: [],
      query: null,
      isData: false,
    }, this);

    let connection = null;

    onTblAct(e) {
      console.log(e);

    }

    csvDownload() {
      const fields = view.get('fields');
      const rows = view.get('rows');
      csv.export(fields, rows);
    }

    convval(val) {
      const type = typeof val;
      if (type === 'object' && val !== null) {
        if (_.isDate(val)) {
          return moment(val).format('YYYY-MM-DD HH:mm:ss');
        }
      }
      return val;
    }

    closeSlide() {
      state.set('slide', false);
    }

    const displayRowNum = 50;
    const viewHeight = 50;
    // mysql state
    state.observe('query', async(query) => {
      const res = await mysql.execQuery(query);
      if (!res) return;

      view.sets({
        fields: res.fields,
        rows: res.rows.slice(0, displayRowNum),
        isData: true,
      });

      if (res.rows.length > displayRowNum) {
        const table = document.querySelector('.data-section');
        const scl = new Scl(table);
        scl.exec((top) => {
          const max = (res.rows.length - displayRowNum) * viewHeight;
          const srt = (top / viewHeight);
          const split = _.slice(res.rows, srt, srt + displayRowNum);
          view.sets({
            rows: split,
          });
          console.log(top, max, srt);
        });
      }
      state.sets({
        datas: {
          fields: res.fields,
          rows: res.rows,
        },
        query,
      });

      const project = state.get('project');
      const cond = {
        project_id: project.id
      };

      const queries = await idxdb.get('queries', cond);
      if (queries) cond.id = queries.id;
      cond.text = state.get('editor-text');

      idxdb.put('queries', cond);
    });

    state.observe('slide', (isOpen) => {
      document.querySelector('.tables-nav').classList.toggle('slide-open');
    });

    const setTables = async() => {
      const res = await mysql.getTables();
      view.set('tables', res.rows.map((table) => {
        console.log(table);
        return table[Object.keys(table)[0]];
      }));
    };

    this.on('mount', async() => {
      $$domWatcher(document.querySelector('#operation-block'), () => {
        $$accordion();
      });
      const id = Number(this.opts.params.id);
      const project = await idxdb.getById('projects', id);
      state.set('project', project);

      await mysql.getConnection(project);
      const c = await mysql.openConnection(state.get('con_uuid'));
      if (c) {
        document.querySelector('.container').style.width = '97%';
        setTables();
      }
    });
  </script>
</operation>