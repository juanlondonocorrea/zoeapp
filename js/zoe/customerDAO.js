// JavaScript Document

var customerDAO = {list:listCustomers, getById:getCustomerById, store:storeCustomer };
var filterDataCustomer;
var customerReceiveFunction;
var customerReceiveListFunction;
var customerErrFunc;
var customerVO;
var recordCustomer;

//----------------------
//metodos hacia afuera
//----------------------
function getCustomerById(aId,aReceiveFunction,aErrFunc){
	db = openDatabaseZoe();
	logZoe("getCustomer db=" + db);
	filterData=aId;
	customerReceiveFunction = aReceiveFunction;
	customerErrFunc = aErrFunc;
	db.transaction(doSelectCustomer, customerErrFunc, customerReceiveFunction);
}

function listCustomers(aReceiveFunction,aErrFunc){
	db = openDatabaseZoe();
	logZoe("listCustomers db=" + db);
	customerReceiveListFunction = aReceiveFunction;
	customerErrFunc = aErrFunc;
	db.transaction(doSelectAllCustomer, customerErrFunc, customerReceiveListFunction);
}

function storeCustomer(records,aErrFunc,successCB){
	db = openDatabaseZoe();
	logZoe("storeCustomer db=" + db);
	recordCustomer = records;
	customerErrFunc = aErrFunc;
	db.transaction(doStoreCustomer, errorCB, successCB);
}


//----------------------
//metodos privados
//----------------------

function doSelectCustomer(tx){
	logZoe("doSelectCustomer filterData=" + filterDataCustomer);
	tx.executeSql("SELECT ListId,FullName, openBalance FROM customer Where ListId=?", [filterDataCustomer],customerLocalReceiveFunction, customerErrFunc);
}

function doSelectAllCustomer(tx){
	logZoe("doSelectAllCustomer");
	tx.executeSql("SELECT ListId,FullName, openBalance FROM customer", [],customerLocalListReceiveFunction, customerErrFunc);
}

function customerLocalReceiveFunction(tx,results){
	logZoe("customerLocalReceiveFunction results.length=" + results.rows.length);
	if (results.rows.length>0){
	logZoe("localReceiveFunction1 " + JSON.stringify(results.rows.item(0)));
		customerVO=results.rows.item(0);
		customerReceiveFunction(customerVO);
	}
	logZoe("localReceiveFunction fin");
}

function customerLocalListReceiveFunction(tx,results){
	logZoe("customerLocalListReceiveFunction results.length=" + results.rows.length);
	var i;
	var arrayCustomers;
	for (i=0;i<results.rows.length;i++){
	logZoe("customerLocalListReceiveFunction " + JSON.stringify(results.rows.item(0)));
		arrayCustomer[i] = results.rows.item(i);
	}
	customerReceiveListFunction(customerVO);
}

function doStoreCustomer(tx){
	logZoe ("doStoreCustomer"+JSON.stringify(recordCustomer));
	if (recordCustomer.length){
		var i;
		for (i=0;i<recordCustomer.length;i++){
			var theRecord = recordCustomer[i];
			doStoreOneCustomer(tx, theRecord);
		}
	}else{
			doStoreOneCustomer(tx, recordCustomer);
	}
	
}

function doStoreOneCustumer(tx, theRecord){
	tx.executeSql('INSERT OR REPLACE INTO customer(ListId, FullName, openBalance) values (?,?,?)',[theRecord.ListId, theRecord.FullName, theRecord.openBalance]);
}
