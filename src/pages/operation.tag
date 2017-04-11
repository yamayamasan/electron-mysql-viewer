<operation>
  <div class="row none">

    <!-- table list -->
    <div class="col tables-nav">
      <!--<button id="close-table-nav" class="waves-effect waves-light btn btn-floating red lighten-1" onclick={ closeSlide }>-->
      <button id="close-table-nav" class="waves-effect waves-light btn btn-floating red lighten-1" onclick={ vv.h.setState.bind(this, 'slide', false) }>
        <i class="material-icons medium">close</i>
      </button>
      <div class="clearfix"></div>
      <ul class="collection with-header z-depth-3">
        <li class="collection-header">
          <h6>DB Name</h6>
          <ul id='databases' class='dropdown-content'>
            <li><a href="#!">one</a></li>
            <li class="divider"></li>
          </ul>
        </li>
        <li class="collection-item" each={ table in vv.tables }>
          <div>
            <a href="#!" class="secondary-content" onclick={ onTblAct.bind(this, table) }>
              <i class="material-icons">more_vert</i>
            </a>
            <span>{ table }</span>
            <ul class='{ table }_btns table-acts'>
              <li class='table-act'>
                <a class="btn-floating red" onclick={ execTblAct.bind(this, { type: 'select', table: table}) }><i class="material-icons">insert_chart</i></a>
              </li>
              <li class='table-act'>
                <a class="btn-floating yellow darken-1"><i class="material-icons">format_quote</i></a>
              </li>
              <li class='table-act'>
                <a class="btn-floating green"><i class="material-icons">publish</i></a>
              </li>
              <!--
              <li class='table-act'>
                <a class="btn-floating blue" style="transform: scaleY(1) scaleX(1) translateY(0px) translateX(0px); opacity: 1;"><i class="material-icons">attach_file</i></a>
              </li>
              -->
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <!-- //table list -->
    <div class="col s12" id="operation-block">
      <div class="section">
        <editor></editor>
      </div>
      <div class="divider"></div>
      <!-- table-acts -->
      <table-acts></table-acts>
      <!-- //table-acts -->

      <!-- data table -->
      <data-table></data-table>
      <!-- //data table -->

      <!-- info -->
      <query-info></query-info>
      <!-- //info -->

    </div>
  </div>
  <style>
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
      margin-top: -32px;
      left: 8px;
    }
    
    li.table-act.active {
      transform: scale(1);
      transition-duration: 0.5s;
      display: block;
    }
    
    li.table-act {
      float: left;
      padding: 0px 5px;
      transform: scale(0);
      transition-duration: 0.5s;
      display: none;
    }
    
    li.table-act.active {
      transform: scale(1);
      transition-duration: 0.5s;
    }
    
    .mis {
      transform: scale(0);
      transition-duration: 0.5s;
    }
    
    .data-tbl-acts {
      margin-bottom: 0px;
      margin-top: 20px;
    }
    
    .open-dialog {
      display: block;
      opacity: 1;
      z-index: 1003;
    }
    
    td.mini,
    th.mini {
      padding: 3px;
    }
    
    .table-act>a {
      transform: scaleY(1) scaleX(1) translateY(0px) translateX(0px);
      opacity: 1;
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
      queried: false,
      isData: false,
      viewfields: {},
    }, this);

    let connection = null;

    const tblAct = (table) => {
      const children = $$(`.${table}_btns`).children;
      for (let i = 0; i < children.length; i++) {
        children[i].classList.toggle('active');
      }
    }

    viewcol(c) {
      console.log(c)
      return 'test';
    }

    execTblAct(arg, e) {
      e.preventDefault();
      switch (arg.type) {
        case 'select':
          state.set('exec_select_table', arg.table);
          tblAct(arg.table);
          break;
      }
      state.set('slide', false);
    }

    onTblAct(table, e) {
      e.preventDefault();
      tblAct(table);
    }

    filterCol(e) {
      $$('#filter-cols').classList.toggle('open-dialog');
    }

    const tableCols = async(fields) => {
      if (!fields) return null;
      const [{
        table
      }] = fields;
      const {
        rows
      } = await mysql.descTable(table);
      return rows;
    };

    const displayRowNum = 50;
    const viewHeight = 50;
    // mysql state
    const queried = async(query) => {
      const res = await mysql.execQuery(query);
      if (!res) return;

      const {
        total,
        fields,
        rows,
        localtime
      } = res;

      const desc = (query.match(/^select/i)) ? await tableCols(fields) : null;

      state.sets({
        result: {
          total,
          fields,
          rows,
          localtime,
          desc,
        },
        queried: true,
      });

      view.fire();

      const project = state.get('project');
      const editText = state.get('editorText');
      helper.saveQueryText(project.id, editText);

      idxdb.add('history_queries', {
        project_id: project.id,
        text: query,
        created_at: moment().format(FORMAT.DATETIME),
      });
    };
    /*
    state.observe('execquery', async(query) => {
      const res = await mysql.execQuery(query);
      if (!res) return;

      state.sets({
        result: {
          fields: res.fields,
          rows: res.rows.slice(0, displayRowNum),
        }
      });

      view.sets({
        fields: res.fields,
        rows: res.rows.slice(0, displayRowNum),
        isData: true,
        query,
        total: res.rows.length,
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
      });

      const project = state.get('project');
      const cond = {
        project_id: project.id
      };

      const queries = await idxdb.get('queries', cond);
      if (queries) cond.id = queries.id;
      cond.text = state.get('editor-text');

      idxdb.put('queries', cond);
      // idxdb.put('history_queries', {
      //   project_id: project.id,
      //   text: query,
      //   created_at: moment(),
      // });
    });
    */

    state.observe('slide', (isOpen) => {
      document.querySelector('.tables-nav').classList.toggle('slide-open');
    });

    const setTables = async() => {
      const {
        rows
      } = await mysql.getTables();
      view.set('tables', rows.map(table => table[Object.keys(table)[0]]));
    };

    this.on('mount', async() => {
      $$('.container').style.width = '97%';
      $$('.container > div.row').classList.remove('none');
      setTables();
      state.observe('execquery', queried);
    });
  </script>
</operation>