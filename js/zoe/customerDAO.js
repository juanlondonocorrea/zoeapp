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
	db.transaction(doSelectAllCustomer, customerErrFunc, customerReceiveListFunction);
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
	tx.executeSql("SELECT ListID, FullName, IsActive, billAddress1, billAddress2, shipAddress1, shipAddress2, openBalance, overdueBalance, workPhone, cellPhone, email, shipAddressZipcode, billAddresZipcode, billAddresCity, billAddressState, billAddressCountry, shipAddressCity, shipAddressState, shipAddressCountry, id_salesrep, routeDay1, routeDay2, routeDay3, routeDay4, routeDay5, routeDay6, routeDay7, Fax, billAddress3, shipAddress3, name, companyName, otherDetails, id_term FROM customer Where ListId=?", [filterDataCustomer],customerLocalReceiveFunction, customerErrFunc);
}

function doSelectAllCustomer(tx){
	logZoe("doSelectAllCustomer");
	tx.executeSql("SELECT ListID, FullName, IsActive, billAddress1, billAddress2, shipAddress1, shipAddress2, openBalance, overdueBalance, workPhone, cellPhone, email, shipAddressZipcode, billAddresZipcode, billAddresCity, billAddressState, billAddressCountry, shipAddressCity, shipAddressState, shipAddressCountry, id_salesrep, routeDay1, routeDay2, routeDay3, routeDay4, routeDay5, routeDay6, routeDay7, Fax, billAddress3, shipAddress3, name, companyName, otherDetails, id_term FROM customer", [],customerLocalListReceiveFunction, customerErrFunc);
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
	tx.executeSql('INSERT OR REPLACE INTO customer(ListID, FullName, IsActive, billAddress1, billAddress2, shipAddress1, shipAddress2, openBalance, overdueBalance, workPhone, cellPhone, email, shipAddressZipcode, billAddresZipcode, billAddresCity, billAddressState, billAddressCountry, shipAddressCity, shipAddressState, shipAddressCountry, id_salesrep, routeDay1, routeDay2, routeDay3, routeDay4, routeDay5, routeDay6, routeDay7, Fax, billAddress3, shipAddress3, name, companyName, otherDetails, id_term) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[theRecord.ListID, theRecord.FullName, theRecord.IsActive, theRecord.billAddress1, theRecord.billAddress2, theRecord.shipAddress1, theRecord.shipAddress2, theRecord.openBalance, theRecord.overdueBalance, theRecord.workPhone, theRecord.cellPhone, theRecord.email, theRecord.shipAddressZipcode, theRecord.billAddresZipcode, theRecord.billAddresCity, theRecord.billAddressState, theRecord.billAddressCountry, theRecord.shipAddressCity, theRecord.shipAddressState, theRecord.shipAddressCountry, theRecord.id_salesrep, theRecord.routeDay1, theRecord.routeDay2, theRecord.routeDay3, theRecord.routeDay4, theRecord.routeDay5, theRecord.routeDay6, theRecord.routeDay7, theRecord.Fax, theRecord.billAddress3, theRecord.shipAddress3, theRecord.name, theRecord.companyName, theRecord.otherDetails, theRecord.id_term]);
}

function doDeleteAllCustomer(tx){
	tx.executeSql('DELETE FROM customer',[]);
}
