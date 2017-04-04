<top>
  <div class="row">
    <div class="col s12 m6" each={ project in vv.projects}>
      <div class="card">
        <div class="card-content">
          <span class="card-title">{ project.name }</span>
        </div>
        <div class="card-action">
          <a class="waves-effect waves-light btn" href="#/operation/{project.id}/">open</a>
          <a class="waves-effect waves-light btn" href="#/connections/edit/{project.id}/">edit</a>
        </div>
      </div>
    </div>

    <!-- add -->
    <div class="col s12 m6">
      <div class="card">
        <div class="card-content">
          <span class="card-title">Add Project</span>
        </div>
        <div class="card-action">
          <a class="waves-effect waves-light btn" href="#/connections/edit/0/">button</a>
        </div>
      </div>
    </div>
  </div>

  <script>
    const view = new View({
      projects: [],
    }, this);

    this.on('mount', async() => {
      const projects = await idxdb.all('projects');
      view.set('projects', projects);
    });
  </script>
</top>