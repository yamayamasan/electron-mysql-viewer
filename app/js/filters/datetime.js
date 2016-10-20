APP.filter('datefmt', [function(){
  return function(input) {
    if (input && _.isDate(input)) {
      return moment(input).format('YYYY-MM-DD HH:mm:ss');
    }
    return input;
  };
}]);

APP.filter('convnull', [function(){
  return function(input) {
    if (_.isNull(input)) {
      return 'NULL';
    }
    return input;
  };
}]);

