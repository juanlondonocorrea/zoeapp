	//load header, footer and menu
		$(document).bind("pageinit", function(event) {
			alert("hola");
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
					log(err.message);
				}
			}
		});


            document.addEventListener("deviceready", onDeviceReady, false);
             
            var db2;
			
			function log(message){
				//console.log(message);
				alert(message);
			}
             
            function onDeviceReady() {
				log('INICIO');
				checkDatabase();
     
            }
			
			function checkDatabase(){
                db2 = window.openDatabase("Database", "1.0", "Zoe Database", 2*1024*1024);
                db2.transaction(createDB, errorCB, successCB);
			}
         
			function createDB(tx) {
			// var	sqlCreate1 = 'DROP TABLE salesrep';
		//	tx.executeSql(sqlCreate1,[],nullHandler,errorHandler);
			var	sqlCreate2 = 'CREATE TABLE IF NOT EXISTS salesrep (id_salesrep TEXT NOT NULL, Name TEXT NOT NULL, Password TEXT NOT NULL, isActive INTEGER NOT NULL, SyincTime NUMERIC NOT NULL, CONSTRAINT Key2 PRIMARY KEY (id_salesrep), CONSTRAINT id_salesrep UNIQUE (id_salesrep) )';
			tx.executeSql(sqlCreate2,[],nullHandler,errorHandler);
			log("sqlCreate: "+sqlCreate2);

		//	tx.executeSql('INSERT INTO salesrep (id_salesrep, Name, Password, isActive, SyincTime) VALUES (4,"aa","a1a1",1,11)',null,renderList);
			log("insert"); 
			
			$.mobile.changePage( "#page2", { reverse: false, transition: "slide" } );
			}

// created/openned
/* db2.transaction(function(tx){
    tx.executeSql(sqlCreate,[],nullHandler,errorHandler);
 },errorHandler,successCallBack);
*/
         
            function errorCB(err) {

                log("Error processing SQL: "+err.code + ":" + err.message);
            }
			
			function errorHandler(transaction, error) {
            log('Error: ' + error.message + ' code: ' + error.code);
			}
            
			function nullHandler(){};
		 
            function successCB() {
               log("YEAH!!!!");
			}
         
            function insertSalesRep(tx) {
				var _id_salesrep = 2; // $("[name='code']").val();
                var _Name        = 'Lisa';// $("[name='name']").val();
                var _Password    = 'abcdefg';// $("[name='password']").val();
                var _isActive    = 0; // $("[name='active']").val();
                var _SyincTime   = 2222; // $("[name='syncronize time']").val();
				log("INSERT: ");
				log("_id_salesrep: "+_id_salesrep);
				log("_Name: "+_Name);
				log("_Password: "+_Password);
				log("_isActive: "+_isActive);
				log("_SyincTime: "+_SyincTime);
				log("_Name: "+_Name); 
                //SQLInsert
				//tx.executeSql('INSERT INTO salesrep (id_salesrep, Name, Password, isActive, SyincTime) VALUES (11,aa,a1a1,1,11)', [], sucessQueryDB, errorCB);
				
				//tx.executeSql('INSERT INTO salesrep (id_salesrep, Name, Password, isActive, SyincTime) VALUES (?,?,?,?,?)', [_id_salesrep,_Name,_Password,_isActive,_SyincTime], sucessQueryDB, errorCB);
				//tx.executeSql('insert into People(id, name, age) values (?,?,?)', [1, "Marujita", 105]);
				//tx.executeSql('SELECT * FROM salesrep', [], renderList, errorCB);
 				log();
            }
			

         
            function sucessQueryDB(tx) { 
				log("Success: ");    
                tx.executeSql('SELECT * FROM salesrep', [], renderList, errorCB);
            }
         
            function renderList(tx,results) {
                var htmlstring = '';
                 
                var len = results.rows.length;
                 
                for (var i=0; i<len; i++){
                    htmlstring += '<li>' + results.rows.item(i).title + '</li>';
                     
                }

				log("htmlstring: "+htmlstring); 
               // $('#resultList').html(htmlstring);
                //$('#resultList').listview('refresh');
                 
                 
            }
 
            function submitForm() {
				db2.transaction(insertSalesRep, errorCB);
                $.mobile.changePage( "#page2", { reverse: false, transition: "slide" } );
                return false;
            }
			