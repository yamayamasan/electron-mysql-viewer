class Scl {
  constructor(target) {
    this.target = target;
  }

  exec(cb) {
    this.target.addEventListener('scroll', () => {
      cb(this.target.scrollTop);
    });
    /*
    const observer = new IntersectionObserver((changes) => {
      for (const change of changes) {
        console.log('------------------>>>');
        console.log(change.time); // 変更が起こったタイムスタン>プ
        console.log(change.rootBounds); // ルートとなる領域
        console.log(change.boundingClientRect); // ターゲットの矩形
        console.log(change.intersectionRect); // ルートとガーゲットの交差町>域
        console.log(change.intersectionRatio); // 交差領域がターゲットの矩形>に占める割合
        console.log(change.target); // ターゲットとなるsp
        console.log('<<<------------------');
      }
    }, {});
    observer.observe(this.target);
    */
  }
}

module.exports = Scl;