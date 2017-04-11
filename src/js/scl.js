class Scl {
  constructor(target) {
    this.target = target;
    this.lineHeight = 22 + (15 * 2); // テーブルの一行の高さ [高さ + padding]
    this.displayRowNum = 13;
    this.viewHeight = this.lineHeight;
  }

  exec(cb) {
    this.target.addEventListener('scroll', () => {
      const top = this.target.scrollTop;
      const startIndex = parseInt(top / this.viewHeight, 10);
      cb(this, top);
    });
  }

  split(lines, start = 0) {
    return lines.slice(start, this.displayRowNum);
  }
}

module.exports = Scl;