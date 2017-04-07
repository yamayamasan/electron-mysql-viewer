<connection-edit>
  <div class="row">
    <div class="col s12">
      <div class="divider"></div>
      <div class="section">
        <h5>New Project</h5>
        <form class="col s12" onsubmit={ onSubmit }>
          <div class="row">
            <div class="input-field col s12">
              <input type="text" id="name" name="name">
              <label for="name">Project Name</label>
            </div>
            <div class="col s12">
              <input name="type" type="radio" id="radio_type_1" value="1" checked={!vv.isSsh} onclick={ onRadio } />
              <label for="radio_type_1">standard</label>
              <input name="type" type="radio" id="radio_type_2" value="2" checked={vv.isSsh} onclick={ onRadio }/>
              <label for="radio_type_2">standard over SSH</label>
            </div>
            <div class="input-field col s12" if={vv.isSsh}>
              <input type="text" id="ssh_host" name="ssh.host">
              <label for="ssh_host">Ssh Host</label>
            </div>
            <div class="input-field col s12" if={vv.isSsh}>
              <input type="text" id="ssh_user" name="ssh.user">
              <label for="ssh_user">Ssh User</label>
            </div>
            <div class="input-field col s12" if={vv.isSsh}>
              <input type="password" id="ssh_password" name="ssh.password">
              <label for="ssh_password">Ssh Password</label>
            </div>
            <div class="input-field col s12" if={vv.isSsh}>
              <input type="text" id="ssh_privateKey" name="ssh.privateKey">
              <label for="ssh_privateKey">Ssh PrivateKey</label>
            </div>
            <div class="input-field col s12">
              <input type="text" name="mysql.host" id="mysql_host" value="127.0.0.1">
              <label for="mysql_host">Mysql Host</label>
            </div>
            <div class="input-field col s12" if={vv.isSsh}>
              <input type="text" name="ssh.disthost" id="ssh_disthost">
              <label for="ssh_disthost">Mysql Dist Host</label>
            </div>
            <div class="input-field col s12">
              <input type="text" name="mysql.port" id="mysql_port" value="3306">
              <label for="mysql_port">Mysql Port</label>
            </div>
            <div class="input-field col s12">
              <input type="text" name="mysql.user" id="mysql_user">
              <label for="mysql_user">Mysql User</label>
            </div>
            <div class="input-field col s12">
              <input type="password" name="mysql.password" id="mysql_password">
              <label for="mysql_password">Mysql Password</label>
            </div>
            <div class="input-field col s12">
              <input type="text" name="mysql.database" id="mysql_database">
              <label for="mysql_database">Mysql Database</label>
            </div>
            <a class="waves-effect waves-light btn-large grey" href="#/">Cancel</a>
            <button type="submit" class="waves-effect waves-light btn-large">Save</button>
          </div>
        </form>
      </div>
      <div class="divider"></div>
    </div>
  </div>
  <script>
    const mysql = new MysqlClient();
    const _ = require('lodash');
    const view = new View({
      isSsh: false,
    }, this);

    onRadio() {
      // isSsh と readonlyは連動させるべき？
      const isSsh = view.get('isSsh');
      view.set('isSsh', !isSsh);
      const tgt = $$('input[name="mysql.host"]');
      tgt.toggleAttribute('readonly', 'readonly');
    }

    onSubmit = async(e) => {
      e.preventDefault();
      const forms = {};
      _.forEach(e.target, (tgt, idx) => {
        switch (tgt.type) {
          case 'radio':
            console.log();
            if (tgt.checked) _.set(forms, tgt.name, Number(tgt.value));
            break;
          case 'text':
          case 'password':
            _.set(forms, tgt.name, tgt.value);
            break;
        }
      });
      const connection = await mysql.getConnection(forms);
      connection.connect((err) => {
        if (err) {
          console.error(`error connecting: ${err.stack}`);
          return;
        }
        idxdb.add('projects', forms);
        mysql.closeConnection();
        location.hash = '/';
      });
    };

    /*
    onSubmit(e) {
      e.preventDefault();
      const forms = {};
      _.forEach(e.target, (tgt, idx) => {
        switch (tgt.type) {
          case 'radio':
            console.log();
            if (tgt.checked) _.set(forms, tgt.name, Number(tgt.value));
            break;
          case 'text':
          case 'password':
            _.set(forms, tgt.name, tgt.value);
            break;
        }
      });
      (async() => {
        const connection = await mysql.getConnection(forms);
        connection.connect((err) => {
          if (err) {
            console.error(`error connecting: ${err.stack}`);
            return;
          }
          idxdb.add('projects', forms);
          location.hash = '/';
        });
      }).call();
    }
    */

    this.on('mount', async() => {
      $$texts();
      const id = Number(this.opts.params.id);
      if (id !== 0) {
        const project = await idxdb.getById('projects', id);
        console.log(project);
      }
    });
  </script>
</connection-edit>