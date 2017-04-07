<top>
  <div class="row">
    <!-- projects -->
    <div class="col s12 m6" each={ project in vv.projects}>
      <div class="card">
        <div class="card-content">
          <span class="card-title">{ project.name }</span>
        </div>
        <div class="card-action">
          <a class="waves-effect waves-light btn" onclick={ projectOpen.bind(this, project.id) }>open</a>
          <a class="waves-effect waves-light btn" href="#/connections/edit/{project.id}/">edit</a>
        </div>
      </div>
    </div>
    <!-- //projects -->

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
    <!-- //add -->
  </div>

  <script>
    const view = new View({
      projects: [],
    }, this);

    projectOpen = async(projectId) => {
      const project = await idxdb.getById('projects', projectId);

      await mysql.getConnection(project);
      try {
        await mysql.openConnection(state.get('con_uuid'));
        state.set('project', project);
        location.hash = `/operation/${projectId}/`;
      } catch (e) {
        console.log(e)
      }
    }

    this.on('mount', async() => {
      const projects = await idxdb.all('projects');
      view.set('projects', projects);
    });
  </script>
</top>