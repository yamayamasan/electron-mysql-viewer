'use strict';

APP.service('shortcut', [function(){

  let hashkey = null;
  const cKeys = {
    'Alt': 'altKey',
    'Ctrl': 'ctrlKey',
    'Shift': 'shiftKey'
  };
  const convKey = function(keys) {
    const _keys = {
      a: [],
      b: [],
      cnt: keys.length
    };
    keys.forEach((key) => {
      if (cKeys[key]) {
        _keys.b.push(cKeys[key]);
      } else {
        _keys.a.push(key);
      }
    });
    return _keys;
  };
  return {
    initialize: function(hash) {
      hashkey = hash;
      // $(document).off('keydown', "**");
    },
    keyDown: function(key, cb, hash) {
      if (hashkey !== hash) return;
      console.log(hashkey, hash);
      const keys = convKey(key.split('+'));
      $(document).keydown((e) => {
        let mat = 0;
        keys.b.forEach((b) => {
          if (e[b]) {
            mat += 1;
          }
        });
        keys.a.forEach((a) => {
          if (e.key === a) {
            mat += 1;
          }
        });

        if (keys.cnt === mat) {
          cb(e);
        }
      });
    },
    unbind: function() {
      hashkey = null;
      $(document).unbind('keydown', "**");
    }
  };
}]);
