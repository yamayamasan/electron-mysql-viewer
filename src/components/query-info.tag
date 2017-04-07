<query-info>
  <div class="section" if={ vv.h.getState.bind(this, 'queried').call() }>
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

  <script>
    const view = new View({
      total: null,
      query: null,
    }, this);

    const queried = (query) => {

    };

    this.on('mount', async() => {
      $$domWatcher($$('query-info'), () => {
        $$accordion();
      });
      state.observe('execquery', queried);
    });
  </script>
</query-info>