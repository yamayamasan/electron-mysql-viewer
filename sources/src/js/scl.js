class Scl {
  constructor(target) {
    this.target = target;
    this.target.onscroll = null;
    this.lineHeight = 22 + (15 * 2); // テーブルの一行の高さ [高さ + padding]
    this.displayRowNum = 13;
    this.viewHeight = this.lineHeight;
  }

  exec(cb) {
    const scrollFnc = () => {
      const { scrollTop } = this.target;
      const startIndex = parseInt(scrollTop / this.viewHeight, 10);
      cb(this, scrollTop);
    };
    this.target.onscroll = scrollFnc;
  }

  split(lines, start = 0) {
    return lines.slice(start, this.displayRowNum);
  }
}

module.exports = Scl;