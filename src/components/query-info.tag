<query-info>
  <div class="section" if={ vv.h.getState.bind(this, 'queried').call() }>
    <a class="waves-effect waves-light btn fix-btm-right" href="#modal1" onclick={ openInfo }>info</a>
    <div class='modal bottom-sheet'>
      <div class='modal-content' style="padding: 0px">
        <div class="card" style='margin: 0'>
          <!--<div class="card-content"></div>-->
          <div class="card-tabs">
            <ul class="tabs tabs-fixed-width">
              <li class="tab"><a href="#test4">info</a></li>
              <li class="tab"><a class="active" href="#test5">history</a></li>
              <li class="tab"><a href="#test6">Test 3</a></li>
            </ul>
          </div>
          <div class="card-content grey lighten-4">
            <div id="modal_info">Test 1</div>
            <div id="modal_history">Test 2</div>
            <div id="test6">Test 3</div>
          </div>
        </div>
      </div>
    </div>
    <!--
    <div class='row'>
      <div class='col s12'>
        <ul class="collapsible" data-collapsible="accordion">
          <li>
            <div class="collapsible-header"><i class="material-icons">filter_drama</i>Info</div>
            <div class="collapsible-body padding-zero">
              <ul class="tabs">
                <li class="tab col s4"><a href="#test1">info</a></li>
                <li class="tab col s4"><a class="active" href="#test2">history</a></li>
                <li class="tab col s4"><a href="#test4">Test 4</a></li>
              </ul>
              <p>time: { vv.time }</p>
              <p>total: { vv.total }</p>
              <p>query: { vv.query }</p>

            </div>
          </li>
        </ul>
      </div>
    </div>
    -->
  </div>
  <style>
    .fix-btm-right {
      position: fixed;
      bottom: 0;
      right: 4px;
    }
    
    .modal.bottom-sheet.open {
      z-index: 1003;
      display: block;
      opacity: 1;
      bottom: 0px;
    }
    
    .padding-zero {
      padding: 0;
    }
  </style>
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

    openInfo() {
      const modal = $$('.modal.bottom-sheet');
      modal.classList.toggle('open');
      const height = modal.clientHeight;
      $$('.fix-btm-right').style.bottom = `${height}px`;      
    }

    this.on('mount', async () => {
      $$domWatcher($$('query-info'), () => {
        $$accordion();
      });
      state.observe('result', queried);
    });
  </script>
</query-info>