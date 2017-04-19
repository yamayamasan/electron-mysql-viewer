<viewer>
  <div class="row" id="frame">
    <div id="full">
      <img src="{ vv.imgsrc.current }" class="image current" id="img_current"/>
      <img src="{ vv.imgsrc.next }" class="image next width50 none" id="img_next"/>
    </div>
  </div>
  <style>
  #frame {
    height: 100vh;
    /*height: 93vh;*/
    margin: -15px auto;
  }
  #full {
    height: 100vh;
    /*height: 93vh;*/
    width: 100vh;
  }
  .image.height100 {
    height: 100vh;
    /*height: 93vh;*/
  }
  .image.width100 {
    width: 100vh;
  }
  .image.width50 {
    width: 50vh;
  }
  .image.show {
    display: block;
  }
  .image.none {
    display: none;
  }
  .image.next {
    float: left;
  }
  .none {
    display: none;
  }
  </style>
  <script>
  //  keyCode [37: ←][39: →]
  const MOVE_KEY_ACTS = new Map([[37, 'PREV'], [39, 'NEXT']]);
  //  keyCode [32: space]
  const EXC_KEY_ACTS = new Map([[32, 'TGL_HALF']]);
  const filer = new Filer();
  const view = new View({
    fullImgsrc: null,
    fullImgsrcNext: null,
    halfImgsrc: {
      p: null,
      n: null,
    },
    imgsrc: {
      current: null,
      next: null,
    },
    isHalf: false,
    // viewType: 'FULL', // 一旦 FULL or Halfの2パターンなので isHalfで管理
  }, this);


  function viewImg({dir, filelist, path, next, position, isVertical}) {
    // context.isHeightがfalseならimgのheightを100vhにする
    let adds = 'height100';
    let removes = 'width100';
    if (!isVertical) {
      [removes, adds] = [adds, removes];
    }
    $$('.image').setClasses([adds], [removes]);
    view.set('imgsrc.current', path);
    if (state.get('isHalf')) {
      view.set('imgsrc.next', next);
    }
  }

  function skipMoveFile(move, opts = null) {
    if (!state.has('context')) return;
    if (opts.shiftKey) {
      move = `SKIP_${move}`;
    }
    filer.moveFile(move, state.get('context')).then((context) => {
      if (context) {
        state.set('context', context);
        viewImg(context);
      }
    });
  }

  function callMoveFile(move) {
    if (!state.has('context')) return;
    if (state.get('isHalf')) {
      move = `TWO_${move}`;
    }
    filer.moveFile(move, state.get('context')).then((context) => {
      if (context) {
        state.set('context', context);
        viewImg(context);
      }
    });
  }

  function callExcAct(act) {
    if (act === 'TGL_HALF') {
      toggleHalfView();
    }
  }

  function toggleHalfView() {
    const { next } = state.get('context');
    const isHalf = state.get('isHalf');
    if (isHalf) {
      // half=>full
      $$('#img_current').setClasses(['width100'], ['width50']);
      $$('#img_next').setClasses(['none'], []);
    } else {
      // full=>half
      $$('#img_current').setClasses(['width50'], ['width100']);
      $$('#img_next').setClasses([], ['none']);
    }
    state.set('isHalf', !isHalf);
    view.sets({
      'imgsrc.next': next,
    });
  }

  function command() {
    document.onkeydown = (e) => {
      const { keyCode } = e;
      console.log(e);
      if (MOVE_KEY_ACTS.has(keyCode)) {
        e.preventDefault();
        callMoveFile(MOVE_KEY_ACTS.get(keyCode));
      }
      if (EXC_KEY_ACTS.has(keyCode)) {
        e.preventDefault();
        callExcAct(EXC_KEY_ACTS.get(keyCode));
      }
      if (e.shiftKey && MOVE_KEY_ACTS.has(keyCode)) {
        e.preventDefault();
        skipMoveFile(MOVE_KEY_ACTS.get(keyCode), {shiftKey: true});
      }
    };
  }

  this.on('mount', () => {
    // setViewerSize();
    // const frame = $$('#frame');
    const frame = $$('body');
    command();
    frame.ondragover = e => false;
    /** hoverエリアから外れた or ドラッグが終了した */
    frame.ondragleave = frame.ondragend = e => false;
    /** hoverエリアにドロップされた */
    frame.ondrop = async (e) => {
      e.preventDefault();
      const { files: [file] } = e.dataTransfer;
      const fileType = filer.getFileType(file);
      let context = null;
      if (fileType === 'DIR') {
        context = await filer.dirs(file);
      } else if (fileType === 'ZIP') {
        context = await filer.unzip(file);
      } else if (fileType === 'IMG') {
        context = await filer.setFile(file);
      }
      if (context) {
        state.set('context', context);
        state.set('isHalf', false);
        viewImg(context);
      }

      return false;
    };
  });
  </script>
</viewer>
