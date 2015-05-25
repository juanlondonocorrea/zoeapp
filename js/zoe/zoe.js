	//load header, footer and menu
		$(document).bind("pageinit", function(event) {
			logZoe("en pageinit");
			$('.app-header').load("header.html", function() {
				$(this).trigger('create');
			});
			$('.app-footer').load("footer.html", function() {
				$(this).trigger('create');
			});
			$('.app-menu').load("menu.html", function() {
				$(this).trigger('create');
			});
			try{
				logZoe("en pageinit localpageinit="  + localpageinit);
				if (localpageinit){
						localpageinit();
				}
			}catch(err){
					logZoe(err.message);
			}
		});
		
		$( document ).on( "pagebeforechange" , function(e, data) {
		  var toPage = data.toPage;
		  if (typeof toPage != 'string'){
			  toPage = data.toPage[0].id;
		  }
		  logZoe("pagebeforechange toPage=" + toPage);
		  if(!toPage || toPage.indexOf("Login") < 0  && toPage.indexOf("config")<0) {
			checkSession();
		  }
		});
			
			function checkSession(){
				var currentSRN = window.localStorage.getItem('salesRepName');
				var lastAccess = window.localStorage.getItem('lastAccess');
				
				if (currentSRN==null){
					$.mobile.navigate('config.html') 	
				}
				
logZoe("en checkSession lastAccess=" + lastAccess);
				if (lastAccess==null || (parseInt(lastAccess, 10) + 5*60*1000) > Date.now()) {
logZoe("redirige al login");
					window.localStorage.setItem('lastAccess', null);
logZoe("redirige al login2");
					$.mobile.navigate('Login.html') 	
logZoe("redirige al listo");
				}
				else {
logZoe("actualiza lastAccess");
					lastAccess = Date.now();
					window.localStorage.setItem('lastAccess',lastAccess);
				}
			}
			
function openDatabaseZoe(){
	logZoe("openDatabaseZoe");
	db = window.openDatabase("Database", "1.0", "Zoe Database", 2*1024*1024);
	return db;
}

	function checkDatabase(){
		logZoe("checkDatabase");
		db = openDatabaseZoe();
		if (window.localStorage.getItem('dbCreated')=="true"){
		}else{
			db.transaction(createDB, errorCB, successCB);
		}
	}

	function dropDatabase(){
		logZoe("dropDatabase");
		db = openDatabaseZoe();
		db.transaction(dropDB, errorCB, successCB);
	}

	function createDB(tx) {
	var	sql = 'CREATE TABLE IF NOT EXISTS salesrep (id_salesrep TEXT NOT NULL, Name TEXT NOT NULL, Password TEXT NOT NULL, isActive INTEGER NOT NULL, SyncTime NUMERIC NOT NULL, CONSTRAINT Key2 PRIMARY KEY (id_salesrep), CONSTRAINT id_salesrep UNIQUE (id_salesrep) )';
		tx.executeSql(sql,[],nullHandler,errorHandler);
	}

	function dropDB(tx) {
	var	sql = 'DROP TABLE salesrep';
		tx.executeSql(sql,[],nullHandler,errorHandler);
	}

	function errorHandler(transaction, error) {
		alert('Fatal error executing transaction: ' + JSON.stringify(error));
	}
            
	function nullHandler(){};
			
	function errorCB(err) {
		logZoe("Error processing SQL: "+JSON.stringify(err));
	}
			
	function errorHandler(transaction, error) {
		alert("Fatal error executing transaction:"+JSON.stringify(error));
	}
            
		 
	function successCB() {
		window.localStorage.setItem('dbCreated',"true")
		alert("Create database success");
	   logZoe("dbCreated");
	}             

	function successDropDB() {
		window.localStorage.setItem('dbCreated',"false")
		alert("Drop database success");
	   logZoe("db drop");
	}             
	
	function logZoe(message){
	  console.log(message);
	}
