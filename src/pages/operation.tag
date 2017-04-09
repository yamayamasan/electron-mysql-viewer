<operation>
  <div class="row none">

    <!-- table list -->
    <div class="col tables-nav">
      <!--<button id="close-table-nav" class="waves-effect waves-light btn btn-floating red lighten-1" onclick={ closeSlide }>-->
      <button id="close-table-nav" class="waves-effect waves-light btn btn-floating red lighten-1" onclick={ vv.h.setState.bind(this,
        'slide', false) }>
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
                <a class="btn-floating red" style="transform: scaleY(1) scaleX(1) translateY(0px) translateX(0px); opacity: 1;"><i class="material-icons">insert_chart</i></a>
              </li>
              <li class='table-act'>
                <a class="btn-floating yellow darken-1" style="transform: scaleY(1) scaleX(1) translateY(0px) translateX(0px); opacity: 1;"><i class="material-icons">format_quote</i></a>
              </li>
              <li class='table-act'>
                <a class="btn-floating green" style="transform: scaleY(1) scaleX(1) translateY(0px) translateX(0px); opacity: 1;"><i class="material-icons">publish</i></a>
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
      <!--
      <div class="row data-tbl-acts" if={ vv.isData }>
        <div class="col s12">
          <button class="waves-effect waves-light btn btn-floating" onclick={ csvDownload }>
            <i class="material-icons medium">play_circle_outline</i>
          </button>
          <button class="waves-effect waves-light btn btn-floating" onclick={ filterCol }>
            <i class="material-icons medium">play_circle_outline</i>
          </button>
          </button>
          <button class="waves-effect waves-light btn btn-floating" onclick={ toggleTblSize }>
            <i class="material-icons medium">play_circle_outline</i>
          </button>
        </div>
        <div>
          <ul id='filter-cols' class='dropdown-content'>
            <li each={ col in vv.fields }>
              <input type="checkbox" id="filter_{col.name}" name="col_filters.{col.name}" checked/>
              <label for="filter_{ col.name }">{ col.name }</label>
            </li>
            <li>
              <a href="#!" class="waves-effect waves-light" onclick={ updateFilter }>
                <i class="material-icons">replay</i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      -->
      <!-- //table-acts -->

      <!-- data table -->
      <data-table></data-table>
      <!--
      <div class="section data-section" if={ vv.isData }>
        <table class="striped" id="data-table">
          <thead>
            <tr>
              <th each={ filed in vv.fields } class="dcol data-th tbl_col_{filed.name} { viewcol.bind(this, fiel).call() }">{ filed.name }</th>
            </tr>
          </thead>
          <tbody id="data-tbody">
            <tr each={row in vv.rows}>
              <td each={ val, v in row } class="dcol data-td tbl_col_{v} { viewcol.bind(this, v).call() }">{ vv.h.convval(val) }</td>
            </tr>
          </tbody>
        </table>
      </div>
      -->
      <!-- //data table -->

      <!-- info -->
      <query-info></query-info>
      <!--
      <div class="section" if={ vv.isData }>
        <div class='row'>
          <div class='col s12'>
            <ul class="collapsible" data-collapsible="accordion">
              <li>
                <div class="collapsible-header"><i class="material-icons">filter_drama</i>Info</div>
                <div class="collapsible-body">
                  <p>total: { vv.total }</p>
                  <p>query: { vv.query }</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      -->
      <!-- //info -->

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

    viewcol(c) {
      console.log(c)
      return 'test';
    }

    onTblAct(table, e) {
      e.preventDefault();
      const children = $$(`.${table}_btns`).children;
      for (let i = 0; i < children.length; i++) {
        children[i].classList.toggle('active');
      }
      /*
      $$(`.${table}_btns`).children.forEach((child) => {
        child.classList.toggle('active');
      });
      */
    }

    // toggleTblSize() {
    //   $$$('.dcol', e => e.classList.toggle('mini'));
    // }

    // updateFilter() {
    //   $$$('input[name^="col_filters"]', (ckbx, i) => {
    //     const field = ckbx.getAttribute('name').split('.').pop();

    //   });
    //   /*
    //   const checkboxes = $$$('input[name^="col_filters"]');
    //   checkboxes.forEach((checkbox, i) => {
    //     const field = checkbox.getAttribute('name').split('.').pop();
    //     // 差分を見る
    //     $$$(`.tbl_col_${field}`).forEach((e) => {
    //       if (checkbox.checked) {
    //         e.classList.remove('none');
    //       } else {
    //         e.classList.add('none');
    //       }
    //     });
    //   });
    //   */
    //   $$('#filter-cols').classList.toggle('open-dialog');
    // }

    filterCol(e) {
      $$('#filter-cols').classList.toggle('open-dialog');
    }

    // csvDownload() {
    //   const fields = view.get('fields');
    //   const rows = view.get('rows');
    //   csv.export(fields, rows);
    // }

    const displayRowNum = 50;
    const viewHeight = 50;
    // mysql state
    const queried = async (query) => {
      const res = await mysql.execQuery(query);
      if (!res) return;

      let desc = null;
      if (res.fields && query.match(/^select/i)) {
        desctable = await mysql.descTable(res.fields[0].table);
        desc = desctable.rows;
      }
      state.sets({
        result: {
          total: res.total,
          fields: res.fields,
          rows: res.rows,
          localtime: res.localtime,
          desc,
        },
        queried: true,
      });

      view.fire();

      // view.sets({
      //   fields: res.fields,
      //   rows: res.rows.slice(0, displayRowNum),
      //   isData: true,
      //   query,
      //   total: res.rows.length,
      // });

      /*
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
      */
      // state.sets({
      //   datas: {
      //     fields: res.fields,
      //     rows: res.rows,
      //   },
      // });

      const project = state.get('project');
      const editText = state.get('editor-text');
      helper.saveQueryText(project.id, editText);

      // idxdb.put('history_queries', {
      //   project_id: project.id,
      //   text: query,
      //   created_at: moment(),
      // });
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

    const setTables = async () => {
      const res = await mysql.getTables();
      view.set('tables', res.rows.map((table) => {
        return table[Object.keys(table)[0]];
      }));
    };

    this.on('mount', async () => {
      // $$domWatcher(document.querySelector('#operation-block'), () => {
      //   $$accordion();
      // });

      $$('.container').style.width = '97%';
      $$('.container > div.row').classList.remove('none');
      setTables();
      state.observe('execquery', queried);
    });
  </script>
</operation>