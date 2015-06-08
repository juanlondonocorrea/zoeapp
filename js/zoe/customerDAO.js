// JavaScript Document

var customerDAO = {list:listCustomers, getById:getCustomerById, store:storeCustomer, deleteAll:deleteAllCustomer};
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
	db.transaction(doSelectAllCustomer, customerErrFunc);
}

function storeCustomer(records,aErrFunc,successCB){
	db = openDatabaseZoe();
	logZoe("storeCustomer db=" + db);
	recordCustomer = records;
	customerErrFunc = aErrFunc;
	db.transaction(doStoreCustomer, errorCB, successCB);
}

function deleteAllCustomer(aErrFunc,successCB){
	db = openDatabaseZoe();
	logZoe("deleteAllCustomer db=" + db);
	customerErrFunc = aErrFunc;
	db.transaction(doDeleteAllCustomer, errorCB, successCB);
}


//----------------------
//metodos privados
//----------------------

function doSelectCustomer(tx){
	logZoe("doSelectCustomer filterData=" + filterDataCustomer);
	tx.executeSql("SELECT ListID, FullName, IsActive, billAddress1, billAddress2, shipAddress1, shipAddress2, openBalance, overdueBalance, workPhone, cellPhone, email, shipAddressZipcode, billAddresZipcode, billAddresCity, billAddressState, billAddressCountry, shipAddressCity, shipAddressState, shipAddressCountry, id_salesrep, routeDay1, routeDay2, routeDay3, routeDay4, routeDay5, routeDay6, routeDay7, Fax, billAddress3, shipAddress3, name, companyName, otherDetails, id_term, pricelevel_ListID FROM customer Where ListId=?", [filterDataCustomer],customerLocalReceiveFunction, customerErrFunc);
}

function doSelectAllCustomer(tx){
	logZoe("doSelectAllCustomer")
	print_call_stack();
	tx.executeSql("SELECT ListID, FullName, IsActive, billAddress1, billAddress2, shipAddress1, shipAddress2, openBalance, overdueBalance, workPhone, cellPhone, email, shipAddressZipcode, billAddresZipcode, billAddresCity, billAddressState, billAddressCountry, shipAddressCity, shipAddressState, shipAddressCountry, id_salesrep, routeDay1, routeDay2, routeDay3, routeDay4, routeDay5, routeDay6, routeDay7, Fax, billAddress3, shipAddress3, name, companyName, otherDetails, id_term, pricelevel_ListID FROM customer ORDER BY FullName", [],customerLocalListReceiveFunction, customerErrFunc);
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
	print_call_stack();
	var arrayCustomers= new Array();
	if (results && results.rows){
		logZoe("customerLocalListReceiveFunction results.length=" + results.rows.length);
		var i;
		for (i=0;i<results.rows.length;i++){
			logZoe("customerLocalListReceiveFunction " + JSON.stringify(results.rows.item(0)));
			arrayCustomers[i] = results.rows.item(i);
		}
	}else if (results){
		arrayCustomers[0] = results;
		//logZoe("arrayCustomers[0] " + JSON.stringify(arrayCustomers[0]));
	}
	customerReceiveListFunction(arrayCustomers);	
}

function doStoreCustomer(tx){
	logZoe ("doStoreCustomer ");
	if (recordCustomer.length){
		var i;
		for (i=0;i<recordCustomer.length;i++){
			var theRecord = recordCustomer[i];
			logZoe("store customer:" + JSON.stringify(theRecord));
			doStoreOneCustomer(tx, theRecord);
		}
	}else{
			doStoreOneCustomer(tx, recordCustomer);
	}
	
}

function doStoreOneCustomer(tx, theRecord){
	tx.executeSql('INSERT OR REPLACE INTO customer(ListID, FullName, IsActive, billAddress1, billAddress2, shipAddress1, shipAddress2, openBalance, overdueBalance, workPhone, cellPhone, email, shipAddressZipcode, billAddresZipcode, billAddresCity, billAddressState, billAddressCountry, shipAddressCity, shipAddressState, shipAddressCountry, id_salesrep, routeDay1, routeDay2, routeDay3, routeDay4, routeDay5, routeDay6, routeDay7, Fax, billAddress3, shipAddress3, name, companyName, otherDetails, id_term, pricelevel_ListID) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[theRecord.ListID, ifUndefNull(theRecord.FullName), theRecord.IsActive, ifUndefNull(theRecord.billAddress1), ifUndefNull(theRecord.billAddress2), ifUndefNull(theRecord.shipAddress1), ifUndefNull(theRecord.shipAddress2), ifUndefNull(theRecord.openBalance), ifUndefNull(theRecord.overdueBalance), ifUndefNull(theRecord.workPhone), ifUndefNull(theRecord.cellPhone), ifUndefNull(theRecord.email), ifUndefNull(theRecord.shipAddressZipcode), ifUndefNull(theRecord.billAddresZipcode), ifUndefNull(theRecord.billAddresCity), ifUndefNull(theRecord.billAddressState), ifUndefNull(theRecord.billAddressCountry), ifUndefNull(theRecord.shipAddressCity), ifUndefNull(theRecord.shipAddressState), ifUndefNull(theRecord.shipAddressCountry), ifUndefNull(theRecord.id_salesrep), ifUndefNull(theRecord.routeDay1), ifUndefNull(theRecord.routeDay2), ifUndefNull(theRecord.routeDay3), ifUndefNull(theRecord.routeDay4), ifUndefNull(theRecord.routeDay5), ifUndefNull(theRecord.routeDay6), ifUndefNull(theRecord.routeDay7), ifUndefNull(theRecord.Fax), ifUndefNull(theRecord.billAddress3), ifUndefNull(theRecord.shipAddress3), ifUndefNull(theRecord.name), ifUndefNull(theRecord.companyName), ifUndefNull(theRecord.otherDetails), ifUndefNull(theRecord.id_term)], theRecord.pricelevel_ListID);
}

function doDeleteAllCustomer(tx){
	tx.executeSql('DELETE FROM customer',[]);
}
