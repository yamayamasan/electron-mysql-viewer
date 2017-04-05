<dashboard>
  <div class="row">
    <div class="col s12">
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
  </div>
  <style>
    .data-td {
      overflow-x: auto;
    }
  </style>
  <script>
    const view = new View({
      tables: [],
      fields: [],
      rows: [],
    }, this);

    this.on('mount', () => {});
  </script>
</dashboard>