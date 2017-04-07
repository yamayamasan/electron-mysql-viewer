<app-header>
  <nav>
    <!--<div class="nav-wrapper blue darken-2">-->
    <div class="nav-wrapper light-blue">
      <a href="#" class="brand-logo">Mysql Viewer</a>
      <a href="#" class="button-collapse pull-right" onclick={ toggleMenu }><i class="material-icons">menu</i></a>

      <div id="menu-cicle" class="tap-target-wrapper open-cicle">
        <div class="tap-target cyan" data-activates="menu">
          <div class="tap-target-content white-text" style="width: 456px; height: 400px; top: 0px; right: 0px; bottom: 0px; left: 0px; padding: 56px; vertical-align: bottom;">
            <h5>I am here</h5>
            <p class="white-text">Provide value and encourage return visits by introducing users to new features and functionality at contextually relevant moments.</p>
          </div>
        </div>
        <div class="tap-target-wave" style="top: 344px; left: 344px; width: 112px; height: 112px;">
          <a class="btn btn-floating btn-large cyan tap-target-origin" onclick={ toggleMenu }>
            <i class="material-icons">menu</i>
          </a>
        </div>
      </div>
    </div>
  </nav>

  <style>
    .open-cicle {
      right: -368px;
      position: fixed;
      top: -370px;
    }
    
    .pull-right {
      float: right;
    }
    
    .tap-target-wrapper.open .tap-target-wave::after {
      visibility: hidden;
    }
  </style>
  <script>
    toggleMenu(e) {
      e.preventDefault();
      document.querySelector('#menu-cicle').classList.toggle('open');
    }
  </script>
</app-header>