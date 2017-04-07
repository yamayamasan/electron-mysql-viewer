<data-table>
  <div class="section data-section" if={ vv.h.getState.bind(this, 'queried').call() }>
    <table class="striped" id="data-table">
      <thead>
        <tr>
          <!--<th each={ field in vv.fields } class="data-th tbl_col_{field.name}">{ field.name }</th>-->
          <th each={ field in vv.fields } class="tbl_col_{field.name} { viewCol.bind(this, field.name).call() }">{ field.name }</th>
        </tr>
      </thead>
      <tbody id="data-tbody">
        <tr each={row in vv.rows}>
          <!--<td each={ val, v in row } class="data-td tbl_col_{v}">{ vv.h.convval(val, v) }</td>-->
          <!--<td each={ val, v in row } class="tbl_col_{v} { viewCol.bind(this, v).call() }">{ vv.h.convval(val, v, vv.desc) }</td>-->
          <td each={ val, v in row } class="tbl_col_{v} { viewCol.bind(this, v).call() }">
            { vv.h.convval(val, v, vv.desc) }
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <script>
    const view = new View({
      fields: [],
      rows: [],
      isData: false,
      desc: null,
    }, this);

    const lineHeight = 22 + (15 * 2); // テーブルの一行の高さ [高さ + padding]

    const displayRowNum = 50;
    const viewHeight = lineHeight;

    viewCol(v) {
      const filters = state.get('filters');
      return (filters && !filters[v]) ? 'none' : '';
    }

    state.observe('filters', () => {
      view.fire();
    });

    const setScl = (rows) => {
      view.sets({
        rows: rows.slice(0, displayRowNum)
      });
      if (rows.length > displayRowNum) {
        console.log(rows.length);
        const table = $$('.data-section');
        const scl = new Scl(table);
        scl.exec((top) => {
          console.log(top);
          const max = (rows.length - displayRowNum) * viewHeight;
          const srt = (top / viewHeight);
          viewrows = _.slice(rows, srt, srt + displayRowNum);
          console.log(top, max, srt, viewrows[0].sampled_at);
          view.sets({
            rows: viewrows
          });
        });
      }
    };

    state.observe('result', (result) => {
      // TIMESTAMPも入れるか？
      const datecols = {};
      if (result.desc) {
        result.desc.filter(d => helper.isColDateType(d.Type)).forEach(d => datecols[d.Field] = d);
      }
      view.sets({
        fields: result.fields,
        desc: datecols,
      });
      setScl(result.rows);

      // state.observe('onToggleTblSize', () => {
      //   $$$('.dcol', e => e.classList.toggle('mini'));
      // });
    });
  </script>
</data-table>