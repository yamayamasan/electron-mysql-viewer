<table-acts>
  <div class="row data-tbl-acts" if={ vv.h.getState.bind(this, 'queried').call() }>
    <div class="col s12">
      <button class="waves-effect waves-light btn btn-floating" onclick={ csvDownload }>
        <i class="material-icons medium">file_download</i>
      </button>
      <button class="waves-effect waves-light btn btn-floating" onclick={ filterCol }>
        <i class="material-icons medium">filter_list</i>
      </button>
      <!--<button class="waves-effect waves-light btn btn-floating" onclick={ vv.h.setState.bind(this, 'onToggleTblSize', true) }>
        <i class="material-icons medium">play_circle_outline</i>
      </button>-->
    </div>
    <div class='card'>
      <ul id='filter-cols' class='dropdown-content'>
        <li each={ col in vv.fields }>
          <input type="checkbox" id="filter_{col.name}" name="col_filters.{col.name}" checked/>
          <label for="filter_{ col.name }" class='check-on-dialog'>{ col.name }</label>
        </li>
        <li>
          <a href="#!" class="waves-effect waves-light" onclick={ updateFilter }>
            <i class="material-icons">replay</i>
          </a>
        </li>
      </ul>
    </div>
  </div>
  <style>
    .check-on-dialog {
      min-height: 50px;
      width: 100%;
      margin: 12px 12px -12px 12px;
    }
  </style>

  <script>
    const view = new View({
      total: null,
      fields: null,
    }, this);

    csvDownload() {
      const fields = view.get('fields');
      const rows = view.get('rows');
      csv.export(fields, rows);
    }

    updateFilter() {
      const filters = {};
      $$$('input[name^="col_filters"]', (chkx) => {
        const field = chkx.getAttribute('name').split('.').pop();
        const checked = $$(`#filter_${field}`).checked;
        filters[field] = checked;
      });
      state.set('filters', filters);
      view.fire();
      $$('#filter-cols').classList.toggle('open-dialog');
    }

    filterCol(e) {
      $$('#filter-cols').classList.toggle('open-dialog');
    }

    const setFields = (r) => {
      view.set('fields', r.fields);
    }

    this.on('mount', () => {

      state.observe('result', setFields);
    });
  </script>
</table-acts>