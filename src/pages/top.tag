<top>
  <div class="row">
    <div class="col s12 m6">
      <div class="card">
        <div class="card-content">
          <span class="card-title">Project Name</span>
          <p>*****</p>
        </div>
        <div class="card-action">
          <a class="waves-effect waves-light btn">button</a>
        </div>
      </div>
    </div>

    <!-- add -->
    <div class="col s12 m6">
      <div class="card">
        <div class="card-content">
          <span class="card-title">Add Project</span>
          <p>*****</p>
        </div>
        <div class="card-action">
          <a class="waves-effect waves-light btn" onclick={ viewAddProject }>button</a>
        </div>
      </div>
    </div>
  </div>

  <script>

    viewAddProject() {
      // tag作成
      communicator.send('view:open:connection_edit', true);
      document.querySelector('top').classList.add('none');
    }

    this.on('mount', () => {

    });
  </script>
</top>