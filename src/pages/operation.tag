<operation>
  <div class="row">
    <div class="col s2">
      <ul class="collection with-header">
        <li class="collection-header">
          <h6>DB Name</h6>
        </li>
        <li class="collection-item">
          <div>
            <a href="#!" class="secondary-content"><i class="material-icons">view_headline</i></a>
            <span>users</span>
          </div>
        </li>
        <li class="collection-item">
          <div>
            <a href="#!" class="secondary-content"><i class="material-icons">view_headline</i></a>
            <span>users</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="col s10">
      <div class="section">
        <editor></editor>
      </div>
      <div class="divider"></div>
      <table class="striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Item Name</th>
            <th>Item Price</th>
          </tr>
        </thead>

        <tbody>
          <tr each={col in vv.arr}>
            <td>{ col.name }</td>
            <td>{ col.col }</td>
            <td>{ col.ram }</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <script>
    const view = new View({
      arr: [],
    }, this);
    this.on('mount', () => {
      document.querySelector('.container').style.width = '97%';
      const arr = [];
      for (let i = 0; i < 10; i++) {
        arr.push({
          name: `name_${i}`,
          col: 'col',
          ram: 'ram',
        })
      }
      view.sets({
        arr: arr
      });
    });
  </script>
</operation>