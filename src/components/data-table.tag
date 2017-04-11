<data-table>
  <div id="data-table-section" class="section data-section" if={ vv.h.getState.bind(this, 'queried').call() }>
    <table id="data-table">
      <thead>
        <tr>
          <th each={ field in vv.fields } class="tbl_col_{field.name} { viewCol.bind(this, field.name).call() }">{ field.name }</th>
        </tr>
      </thead>
      <tbody id="data-tbody">
        <tr each={row in vv.rows}>
          <td each={ val, v in row } class="tbl_col_{v} { viewCol.bind(this, v).call() }">
            { vv.h.convval(val, v, vv.desc) }
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <style>
    #data-table {
      border-collapse: separate;
    }
    
    .data-section {
      overflow-x: auto;
      min-height: 250px;
      max-height: 450px;
    }
    
    th[class*="tbl_col_"] {
      border: none;
      border-top: 1px solid #eceeef;
      border-left: 1px solid #eceeef;
      border-bottom: 1px solid #eceeef;
    }
    
    td[class*="tbl_col_"] {
      overflow-x: auto;
      white-space: nowrap;
      padding: 5px;
      border: none;
      border-left: 1px solid #eceeef;
      border-bottom: 1px solid #eceeef;
    }
  </style>
  <script>
    const view = new View({
      fields: [],
      rows: [],
      desc: null,
    }, this);

    const lineHeight = 22 + (15 * 2); // テーブルの一行の高さ [高さ + padding]

    const displayRowNum = 13;
    const viewHeight = lineHeight;

    viewCol(v) {
      const filters = state.get('filters');
      return (filters && !filters[v]) ? 'none' : '';
    }

    state.observe('queryInit', () => {
      if (view.get('rows').length > 0) {
        console.log('queryInit');
        const dataTable = $$('#data-table');
        dataTable.style.paddingTop = '0px';
        dataTable.style.paddingBottom = `0px`;
        view.set('rows', []);
      }
    });

    state.observe('filters', () => {
      view.fire();
    });

    const setScl = (rows) => {
      const dataTable = $$('#data-table');
      view.set('rows', rows.slice(0, displayRowNum));
      if (rows.length > displayRowNum) {
        const scl = new Scl($$('.data-section'));
        const max = (rows.length - displayRowNum) * viewHeight;
        dataTable.style.paddingTop = '0px';
        dataTable.style.paddingBottom = `${max}px`;
        scl.exec((ob, top) => {
          const startIndex = parseInt(top / viewHeight, 10);
          const viewrows = _.slice(rows, startIndex, startIndex + displayRowNum);
          dataTable.style.paddingTop = `${top}px`;
          dataTable.style.paddingBottom = `${max - top}px`;
          view.set('rows', viewrows);
        });
      }
    };

    state.observe('result', (result) => {
      view.init();
      // TIMESTAMPも入れるか？
      const datecols = {};
      let {
        desc,
        fields,
        rows
      } = result;

      if (desc) {
        desc.filter(d => helper.isColDateType(d.Type)).forEach(d => datecols[d.Field] = d);
      }
      view.sets({
        desc: datecols,
        fields,
      });
      setScl(rows);
      // state.observe('onToggleTblSize', () => {
      //   $$$('.dcol', e => e.classList.toggle('mini'));
      // });
    });
  </script>
</data-table>