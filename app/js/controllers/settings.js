'use strict';

APP.controller('SettingsCtrl', ['$scope', '$location', 'notification',
  function($scope, $location,  notification){
    const inputs = require(`${APP_CONFIG_PATH}/input_fields.json`).settings;
    const settings = require(`${APP_CONFIG_PATH}/settings.json`);

    $scope.init = function() {
      $scope.userInput = {};
      _.forEach(inputs, (input, key) => {
        _.map(input, (detail, field) => {
          detail.default = settings[key][field];
        });
      });
      $scope.settings = inputs;
    };
    
    $scope.onBack = function() {
      $location.path('/connections');
    };

    $scope.onSave = function() {
      const update = _.clone(settings);
      _.forEach(update, (setting) => {
        _.map(setting, (detail, field) => {
          setting[field] = $scope.userInput[field];
        });
      });
      try {
        fs.writeFileSync(`${APP_CONFIG_PATH}/settings.json`, JSON.stringify(update));
        notification.success('Succes update settings');
        $scope.onBack();
      } catch(e) {
        console.error(e);
        notification.error('Faild update settings');
      }
    };

}]);
