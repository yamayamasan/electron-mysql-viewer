<toast>
  <div class="card-panel teal push-toast">
    <span class="white-text">{ vv.title }</span>
  </div>

  <style>
    .push-toast {
      position: fixed;
      bottom: 0;
      right: 0;
      z-index: 1001;
    }
  </style>

  <script>
    const view = new View({
      title: null,
    }, this);

    this.on('mount', () => {
      view.sets({
        title: this.opts.msg
      });
      setTimeout(() => {
        this.unmount(true);
      }, 3000);
    });
  </script>
</toast>