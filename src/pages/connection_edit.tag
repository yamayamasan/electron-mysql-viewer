<connection-edit>
  <div class="row none">
    <div class="col s12">
      <div class="divider"></div>
      <div class="section">
        <h5>Setting</h5>
        <form class="col s12" onsubmit={ onSubmit }>
          <div class="row">
            <div class="input-field col s12">
              <input type="text" id="name" name="name">
              <label for="name">Project Name</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input type="text" id="ssh_host" name="ssh.host">
              <label for="ssh_host">Ssh Host</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input type="text" id="ssh_user" name="ssh.user">
              <label for="ssh_user">Ssh User</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input type="password" id="ssh_password" name="ssh.password">
              <label for="ssh_password">Ssh Password</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input type="text" id="ssh_privateKey" name="ssh.privateKey">
              <label for="ssh_privateKey">Ssh PrivateKey</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input type="text" name="mysql.host" id="mysql_host" value="127.0.0.1">
              <label for="mysql_host">Mysql Host</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input type="text" name="ssh.disthost" id="ssh_disthost">
              <label for="ssh_disthost">Mysql Dist Host</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input type="text" name="mysql.port" id="mysql_port" value="3306">
              <label for="mysql_port">Mysql Port</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input type="text" name="mysql.user" id="mysql_user">
              <label for="mysql_user">Mysql User</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input type="password" name="mysql.password" id="mysql_password">
              <label for="mysql_password">Mysql Password</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <input type="text" name="mysql.database" id="mysql_database">
              <label for="mysql_database">Mysql Database</label>
            </div>
          </div>
          <div class="row">
            <a class="waves-effect waves-light btn-large grey">Cancel</a>
            <button type="submit" class="waves-effect waves-light btn-large">Save</button>
          </div>
        </form>
      </div>
      <div class="divider"></div>
    </div>
  </div>
  <!--
  <div class="pane-group">
    <div class="pane">
      <form onsubmit={ onSubmit }>
        <div class="radio">
          <label>
            <input type="radio" name="type" value="1" checked={!vv.isSsh} onclick={ onRadio }>standard
          </label>
          <label>
            <input type="radio" name="type" value="2" checked={vv.isSsh} onclick={ onRadio }>standard over SSH
          </label>
        </div>
        <div class="form-group">
          <label>[mysql]Name</label>
          <input type="text" class="form-control" placeholder="" name="mysql.name">
        </div>
        <div class="form-group" if={vv.isSsh}>
          <label>[ssh]Host</label>
          <input type="text" class="form-control" placeholder="" name="ssh.host">
        </div>
        <div class="form-group" if={vv.isSsh}>
          <label>[ssh]User</label>
          <input type="text" class="form-control" placeholder="" name="ssh.user">
        </div>
        <div class="form-group" if={vv.isSsh}>
          <label>[ssh]Password</label>
          <input type="password" class="form-control" placeholder="" name="ssh.password">
        </div>
        <div class="form-group" if={vv.isSsh}>
          <label>[ssh]Private Key</label>
          <input type="text" class="form-control" placeholder="" name="ssh.privateKey">
        </div>
        <div class="form-group">
          <label>[mysql]Host</label>
          <input type="text" class="form-control" placeholder="" name="mysql.host" value="127.0.0.1">
        </div>
        <div class="form-group" if={vv.isSsh}>
          <label>[mysql]Dist Host</label>
          <input type="text" class="form-control" placeholder="" name="ssh.disthost">
        </div>
        <div class="form-group">
          <label>[mysql]Port</label>
          <input type="text" class="form-control" placeholder="" name="mysql.port" value="3306">
        </div>
        <div class="form-group">
          <label>[mysql]User</label>
          <input type="text" class="form-control" placeholder="" name="mysql.user">
        </div>
        <div class="form-group">
          <label>[mysql]Password</label>
          <input type="password" class="form-control" placeholder="" name="mysql.password">
        </div>
        <div class="form-group">
          <label>[mysql]Database</label>
          <input type="text" class="form-control" placeholder="" name="mysql.database">
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-form btn-default" onclick={ onCancel }>Cancel</button>
          <button type="submit" class="btn btn-form btn-primary">Save</button>
        </div>
      </form>
    </div>
  </div>
  -->
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

    onCancel() {

    }

    onSave() {

    }

    onSubmit(e) {
      e.preventDefault();
      const forms = {};
      _.forEach(e.target, (tgt, idx) => {
        switch (tgt.type) {
          case 'radio':
            if (tgt.checked) _.set(forms, tgt.name, Number(tgt.value));
            break;
          case 'text':
          case 'password':
            _.set(forms, tgt.name, tgt.value);
            break;
        }
      });
      mysql.getConnection(forms).then((con) => {
        con.connect();
      });
      // const connection = mysql.getConnection(forms);
      // connection.connect();
    }

    this.on('mount', () => {
      $$texts();
    });
  </script>
</connection-edit>