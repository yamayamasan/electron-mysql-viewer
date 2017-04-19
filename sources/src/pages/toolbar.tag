<toolbar>
  <div class="progress">
      <div class="determinate" style="width: 0%" id="progress_bar"></div>
  </div>

  <script>
    const observeContext = () => {
      state.observe('context', ({ length, position}) => {
        console.log(length, position);
        if ((length - 1) === position) {
          $$('#progress_bar').style.width = `100%`;
        } else {
          const scale = Math.round(100 / length);
          const per = (position + 1) * scale;
          $$('#progress_bar').style.width = `${per}%`;
        }
      });
    }
    this.on('mount', () => {
      observeContext();
    });
  </script>
</toolbar>
