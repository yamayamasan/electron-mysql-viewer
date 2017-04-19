const inputElements = {};

const $$$ = (e, cb = null) => {
  const ar = [];
  document.querySelectorAll(e).forEach((d) => {
    const dd = $$(d);
    if (cb) cb(dd);
    ar.push(dd);
  });
  return ar;
}

const $crt = (e) => {
  const _e = document.createElement(e);
  if (_e && !_e.setAttributes) {
    _e.setAttributes = (map) => {
      for (const [key, val] of map) {
        _e.setAttribute(key, val);
      }
    };
  }
  return _e;
}

const $$ = (e) => {
  const _e = (typeof e === 'string') ? document.querySelector(e) : e;
  if (_e && !_e.toggleAttribute) {
    _e.toggleAttribute = function(key, val) {
      const exist = this.hasAttribute(key);
      if (exist) {
        this.removeAttribute(key);
      } else {
        this.setAttribute(key, val);
      }
    };
  }
  if (_e && !_e.setClasses) {
    _e.setClasses = function(adds = [], removes = []) {
      if (typeof adds === 'string') adds = [adds];
      if (typeof removes === 'string') removes = [removes];
      removes.forEach(rm => _e.classList.remove(rm));
      adds.forEach(ad => _e.classList.add(ad));
    };
  }
  return _e;
};

// input text
const setInputEvent = () => {
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
//
const $$texts = () => {
  document.querySelector('body').addEventListener('change', (e) => {
    setInputEvent();
  });
  setInputEvent();
};

const accordionClick = (acr) => {
  acr.onclick = function(e) {
    this.classList.toggle('active');
    const children = this.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.classList.contains('collapsible-header')) {
        child.classList.toggle('active');
      }
      if (child.classList.contains('collapsible-body')) {
        child.classList.toggle('display-block');
      }
    }
  }
};

const $$accordion = () => {
  document.querySelector('body').addEventListener('change', (a) => {
    console.log(a);
  });
  const li = document.querySelectorAll('.collapsible');
  li.forEach((e) => {
    const attr = e.getAttribute('data-collapsible');
    if (attr && attr === 'accordion') {
      const list = e.children;
      for (let i = 0; i < list.length; i++) {
        const child = list[i];
        accordionClick(child);
      }
    }
  });
};

const $$domWatcher = (e, cb, options) => {
  const obs = new MutationObserver(cb);
  obs.observe(e, {
    attributes: true,
    childList: true,
    // subtree: true,
    // attributeFilter: filter
  });
}
