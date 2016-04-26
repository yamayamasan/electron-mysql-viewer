
class QueryModel {

   constructor() {
     this.connection = getSingleObject('mysql');
   }

   run(sql) {
     var self = this;

     return new Promise(function(resolve, reject){
       self.connection.query(sql, (err, res, field) => {
         if (err) reject(err);
  
         resolve(res);
       });
     }).then(function(res){
       var values = {};
       var columns = [];
       
       res.forEach(function(v, i, arr) {
         if (i === 0) columns = R.keys(v);
        
         values[i] = v;
       });

       return {
         columns: columns,
         values: values
       };
     }).catch(function(err){
       console.log(err); 
       return null;
     });

   }

   tableInfos(table) {
     
   }

   getTableColumns(table) {
     var r = this.run("DESCRIBE " + table);
   }
 }
