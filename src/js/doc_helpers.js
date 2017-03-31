const $$ = (e) => {
  const _e = document.querySelector(e);
  if (!_e.toggleAttribute) {
    _e.toggleAttribute = function(key, val) {
      const exist = this.hasAttribute(key);
      if (exist) {
        this.removeAttribute(key);
      } else {
        this.setAttribute(key, val);
      }
    }
  }
  return _e;
};

// input text
const $$texts = () => {
  const labels = document.querySelectorAll('label');
  labels.forEach((label) => {
    const tgtId = label.getAttribute('for');
    const field = document.querySelector(`#${tgtId}`);
    if (field) {
      if (field.value) label.classList.add('not-val-input');
      field.addEventListener('keydown', (e) => {
        setTimeout(() => {
          if (field.value != '') {
            label.classList.add('not-val-input');
          } else {
            label.classList.remove('not-val-input');
          }
        }, 50);
      });
    }
  });
};