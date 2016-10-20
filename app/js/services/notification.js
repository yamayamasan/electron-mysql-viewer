'use strict';

APP.service('notification', [function(){
  const options = {
    delay: 3000,
    title: '',
    text: '',
    type: '',
    hide: true,
    styling: 'bootstrap3'
  };
  return {
    instance: function(options) {
      new PNotify(options);
    },
    success: function(text, title) {
      if (!title) {
        title = 'Success';
      }
      this.instance(_.merge(options, {
        title, text,
        type: 'success'
      }));
    },
    error: function(text, title) {
      if (!title) {
        title = 'Error';
      }
      this.instance(_.merge(options, {
        title, text,
        type: 'error'
      }));
    },
    warning: function(text, title) {
      if (!title) {
        title = 'Warning';
      }
      this.instance(_.merge(options, {
        title, text,
        type: 'warning'
      }));
    },
    info: function(text, title) {
      if (!title) {
        title = 'Infomation';
      }
      this.instance(_.merge(options, {
        title, text,
        type: 'info'
      }));
    }
  };
}]);
