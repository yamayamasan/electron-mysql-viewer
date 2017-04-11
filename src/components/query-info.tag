<query-info>
  <div class="section" if={ vv.h.getState.bind(this, 'queried').call() }>
    <a class="waves-effect waves-light btn fix-btm-right" href="#modal1" onclick={ openInfo }>info</a>
    <div class='modal bottom-sheet'>
      <div class='modal-content' style="padding: 0px">
        <div class="card" style='margin: 0'>
          <!--<div class="card-content"></div>-->
          <div class="card-tabs">
            <ul class="tabs tabs-fixed-width">
              <li class="tab"><a href="#" class="active" onclick={ switchTab.bind(this, 'info') }>info</a></li>
              <li class="tab"><a href="#" onclick={ switchTab.bind(this, 'history') }>history</a></li>
              <li class="tab"><a href="#">Test 3</a></li>
            </ul>
          </div>
          <div class="card-content tab-content">
            <div id="modal_info" class="">
              <p>time: { vv.localtime }</p>
              <p>total: { vv.total }</p>
              <p>query: { vv.query }</p>
            </div>
            <div id="modal_history" class="none">
              <ul>
                <li each={ history in vv.histories }>{ history.text }</li>
              </ul>
            </div>
            <div id="test6" class="none">

            </div>
          </div>
        </div>
      </div>
    </div>
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

    const queried = async(result) => {
      const {
        total,
        localtime
      } = result;
      view.sets({
        query: state.get('execquery'),
        total,
        localtime,
      });

      const project = state.get('project');
      const histories = await idxdb.d('history_queries')
        .where('project_id')
        .equals(project.id)
        .limit(100)
        .reverse()
        .sortBy('created_at');
      view.set('histories', histories);
    };

    switchTab(type, e) {
      e.preventDefault();
      $$$('.tab-content > div', (e) => {
        if (e.id === `modal_${type}`) {
          e.classList.remove('none');
        } else {
          e.classList.add('none');
        }
      });
    }

    openInfo() {
      const modal = $$('.modal.bottom-sheet');
      modal.classList.toggle('open');
      const height = modal.clientHeight;
      $$('.fix-btm-right').style.bottom = `${height}px`;
    }

    this.on('mount', async() => {
      $$domWatcher($$('query-info'), () => {
        $$accordion();
      });
      state.observe('result', queried);
    });
  </script>
</query-info>