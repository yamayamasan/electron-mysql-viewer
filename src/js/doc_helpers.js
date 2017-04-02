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
      if (field.value) label.classList.add('active');
      field.addEventListener('keydown', (e) => {
        setTimeout(() => {
          if (field.value != '') {
            label.classList.add('active');
          } else {
            label.classList.remove('active');
          }
        }, 50);
      });
    }
  });
};