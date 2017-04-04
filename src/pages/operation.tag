<operation>
  <div class="row">
    <div class="col s2">
      <ul class="collection with-header">
        <li class="collection-header">
          <h6>DB Name</h6>
        </li>
        <li class="collection-item" each={ table in vv.tables }>
          <div>
            <a href="#!" class="secondary-content"><i class="material-icons">more_vert</i></a>
            <span>{ table }</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="col s10">
      <div class="section">
        <editor></editor>
      </div>
      <div class="divider"></div>
      <div class="section">
        <table class="striped" id="data-table">
          <thead>
            <tr>
              <th each={ filed in vv.fields }>{ filed.name }</th>
            </tr>
          </thead>

          <tbody>
            <tr each={row in vv.rows}>
              <td each={ val in row } class="data-td">{ convval(val) }</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="section">
        <div class='row'>
          <div class='col s12'>
            <ul class="collapsible" data-collapsible="accordion">
              <li>
                <div class="collapsible-header"><i class="material-icons">filter_drama</i>First</div>
                <div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
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
    }
  </style>
  <script>
    const _ = require('lodash');
    const moment = require('moment');
    const mysql = new MysqlClient();
    const view = new View({
      tables: [],
      fields: [],
      rows: [],
    }, this);

    let connection = null;

    convval(val) {
      const type = typeof val;
      if (type === 'object' && val !== null) {
        if (_.isDate(val)) {
          return moment(val).format('YYYY-MM-DD HH:mm:ss');
        }
      }
      return val;
    }

    // mysql state
    state.observe('query', async(text) => {
      const res = await mysql.execQuery(text);
      if (!res) return;
      view.sets({
        fields: res.fields,
        rows: res.rows,
      });

      const table = document.querySelector('#data-table');
      const width = table.width;
      const split = width / res.fields.length;
      document.querySelectorAll('.data-td').forEach((ele) => {
        ele.style.maxWidth = `${split}px`;
      });

      const project = state.get('project');
      const cond = {
        connection_id: project.id
      };

      const queries = await idxdb.get('queries', cond);
      if (queries) cond.id = queries.id;
      cond.text = state.get('editor-text');

      idxdb.put('queries', cond);
    });

    const setTables = async() => {
      const res = await mysql.getTables();
      view.set('tables', res.rows.map((table) => {
        return table[Object.keys(table)[0]];
      }));
    };

    this.on('mount', async() => {
      $$accordion();
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