	//load header, footer and menu
	function initAnyPage(target){
			logZoe("en initAnyPage");
			$('.app-header').load("header.html", function() {
				$(this).trigger('create');
			});
			$('.app-footer').load("footer.html", function() {
				$(this).trigger('create');
			});
			$('.app-menu').load("menu.html", function() {
				$(this).trigger('create');
			});
			

		  var toPage = target.id;
		  logZoe("initAnyPage toPage=" + toPage);
		  if(!toPage || toPage.indexOf("Login") < 0  && toPage.indexOf("config")<0) {
			checkSession();
		  }
		};


			function checkSession(){
				var currentSRN = window.localStorage.getItem('salesRepName');
				var lastAccess = window.localStorage.getItem('lastAccess');
				var currentUser = window.localStorage.getItem('currentUser');
				
				if (currentSRN==null){
					window.location = 'config.html'; 	
				}
				
				if (currentUser==null || currentUser=="null"){
					window.location = 'Login.html'; 	
				}
				
logZoe("en checkSession lastAccess=" + lastAccess);
logZoe("actualiza lastAccess parseInt(lastAccess, 10) + 5*60*1000)="+(parseInt(lastAccess, 10) + 5*60*1000));
logZoe("actualiza lastAccess  Date.now()="+ Date.now());
				if (lastAccess=="null" || lastAccess==null || (parseInt(lastAccess, 10) + 5*60*1000) < Date.now()) {
logZoe("redirige al login");
					window.localStorage.setItem('lastAccess', null);
logZoe("redirige al login2");
					window.location = 'Login.html'; 	
logZoe("redirige al listo");
				}
				else {
					lastAccess = Date.now();
					window.localStorage.setItem('lastAccess',lastAccess);
logZoe("actualiza lastAccess="+window.localStorage.getItem('lastAccess'));
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
		db.transaction(dropDB, errorCB, successDropDB);
	}

	function createDB(tx) {
		logZoe("createDB. antes de ajax");
	    $.ajax({
            url : "dbcreate.sql",
            dataType: "text",
            success : function (data) {
				var sqls = data.split(";");
				logZoe("sqls=" + sqls);
				var index;
				for (index = 0; index < sqls.length; ++index) {
    				console.log("executing..." +sqls[index]);
				}
				tx.executeSql(sqls[index],[],nullHandler,errorHandler);
            },
			error: function(err){
				logZoe("error leyendo dbcreate.sql" + err);
			}
			
        });
	}

	function dropDB(tx) {
	var	sql = 'DROP TABLE salesrep';
		tx.executeSql(sql,[],nullHandler,errorHandler);
	}

	function errorHandler(transaction, error) {
		alert('Fatal error executing transaction: ' + JSON.stringify(error));
	}
            
	function nullHandler(tx, results){
		logZoe("sqlExecuted. " + JSON.stringify(results));
	};
			
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


	function print_call_stack() {
	  var stack = new Error().stack;
	  console.log("PRINTING CALL STACK");
	  console.log( stack );
	}