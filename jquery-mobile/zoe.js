	//load header, footer and menu
		$(document).bind("pageinit", function(event) {
			$('.app-header').load("header.html", function() {
				$(this).trigger('create');
			});
			$('.app-footer').load("footer.html", function() {
				$(this).trigger('create');
			});
			$('.app-menu').load("menu.html", function() {
				$(this).trigger('create');
			});
			if (typeof(localpageinit) == "function"){
				try{
					localpageinit();
				}catch(err){
					console.log(err.message);
				}
			}
		});


            document.addEventListener("deviceready", onDeviceReady, false);
             
            var db2;
             
            function onDeviceReady() {
				checkDatabase();
     
            }
			
			function checkDatabase(){
                db2 = window.openDatabase("Database", "1.0", "Zoe Database", 2*1024*1024);
                db2.transaction(createDB, errorCB, successCB);
			}
         
			function createDB(tx) {
				sqlCreate = 'CREATE TABLE IF NOT EXISTS salesrep (id_salesrep TEXT NOT NULL, Name TEXT NOT NULL, Password TEXT NOT NULL, isActive INTEGER NOT NULL, SyincTime NUMERIC NOT NULL, CONSTRAINT Key2 PRIMARY KEY (id_salesrep), CONSTRAINT id_salesrep UNIQUE (id_salesrep) )';
			tx.executeSql(sqlCreate,[],nullHandler,errorHandler);
			console.log("sqlCreate: "+sqlCreate);
			}

// created/openned
/* db2.transaction(function(tx){
    tx.executeSql(sqlCreate,[],nullHandler,errorHandler);
 },errorHandler,successCallBack);
*/
         
            function errorCB(err) {
                console.log("Error processing SQL: "+err.code);
            }
			
			function errorHandler(transaction, error) {
            console.log('Error: ' + error.message + ' code: ' + error.code);
			}
            
			function nullHandler(){};
		 
            function successCB() {
               console.log("YEAH!!!!");
			}
            
         
            function insertSalesRep(tx) {
                var _id_salesrep = '1'; // $("[name='code']").val();
                var _Name        = 'Peralta';// $("[name='name']").val();
                var _Password    = '123456';// $("[name='password']").val();
                var _isActive    = '1'; // $("[name='active']").val();
                var _SyincTime   = '1111'; // $("[name='syncronize time']").val();
				
                var _description = $("[name='description']").val();
                var sql = 'INSERT INTO salesrep (id_salesrep, Name, Password, isActive, SyincTime) VALUES (?,?,?,?,?)';
                tx.executeSql(sql, [_id_salesrep,_Name,_Password,_isActive,_SyincTime], sucessQueryDB, errorCB);
 				console.log("sql: "+sql);
            }
         
            function sucessQueryDB(tx) {     
                tx.executeSql('SELECT * FROM salesrep', [], renderList, errorCB);
            }
         
            function renderList(tx,results) {
                var htmlstring = '';
                 
                var len = results.rows.length;
                 
                for (var i=0; i<len; i++){
                    htmlstring += '<li>' + results.rows.item(i).title + '</li>';
                     
                }
                 
                $('#resultList').html(htmlstring);
                $('#resultList').listview('refresh');
                 
                 
            }
 
            function submitForm() {
                //db.transaction(insertDB, errorCB);
				db2.transaction(insertSalesRep, errorCB);
                $.mobile.changePage( "#page2", { reverse: false, transition: "slide" } );
                return false;
            }
			