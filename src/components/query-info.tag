<query-info>
  <div class="section" if={ vv.h.getState.bind(this, 'queried').call() }>
    <div class='row'>
      <div class='col s12'>
        <ul class="collapsible" data-collapsible="accordion">
          <li>
            <div class="collapsible-header"><i class="material-icons">filter_drama</i>Info</div>
            <div class="collapsible-body">
              <p>time: { vv.time }</p>
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
      time: null,
    }, this);

    const queried = (result) => {
      view.sets({
        query: state.get('execquery'),
        total: result.total,
        time: result.localtime,
      })
    };

    this.on('mount', async() => {
      $$domWatcher($$('query-info'), () => {
        $$accordion();
      });
      state.observe('result', queried);
    });
  </script>
</query-info>