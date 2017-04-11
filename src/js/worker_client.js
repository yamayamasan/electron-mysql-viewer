class WorkerClinet {

  static load(path) {
    const worker = new Worker(path);
    return worker;
  }
}

module.exports = WorkerClinet;