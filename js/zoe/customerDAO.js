// JavaScript Document

var customerDAO = {list:listCustomers, 
		listByRouteDay:listCustomersByRouteDay,
		getById:getCustomerById, 
		store:storeCustomer, 
		deleteAll:deleteAllCustomer, 
		markToSync:markToSyncCustomer, 
		markSynchronized:doMarkSynchorinizedCustomer};
var filterDataCustomer;
var customerReceiveFunction;
var customerReceiveListFunction;
var customerErrFunc;
var customerVO;
var recordCustomer;
var customerOrigin;
//----------------------
//metodos hacia afuera
//----------------------
function getCustomerById(aId,aReceiveFunction,aErrFunc){
	db = openDatabaseZoe();
	logZoe("getCustomer db=" + db);
	filterData=aId;
	customerReceiveFunction = aReceiveFunction;
	customerErrFunc = aErrFunc;
	db.transaction(doSelectCustomer, customerErrFunc);
}

function listCustomers(aReceiveFunction,aErrFunc){
	db = openDatabaseZoe();
	logZoe("listCustomers db=" + db);
	customerReceiveListFunction = aReceiveFunction;
	customerErrFunc = aErrFunc;
	db.transaction(doSelectAllCustomer, customerErrFunc);
}

function listCustomersByRouteDay(aDay, aReceiveFunction,aErrFunc){
	db = openDatabaseZoe();
	logZoe("listCustomers db=" + db);
	customerReceiveListFunction = aReceiveFunction;
	customerErrFunc = aErrFunc;
	filterDataCustomer = aDay;
	db.transaction(doListCustomersByRouteDay, customerErrFunc);
}


function storeCustomer(records,aErrFunc,successCB,origin){
	db = openDatabaseZoe();
	logZoe("storeCustomer db=" + db);
	recordCustomer = records;
	customerOrigin = origin;
	customerErrFunc = aErrFunc;
	db.transaction(doStoreCustomer, errorCB, successCB);
}

function deleteAllCustomer(aErrFunc,successCB){
	db = openDatabaseZoe();
	logZoe("deleteAllCustomer db=" + db);
	customerErrFunc = aErrFunc;
	db.transaction(doDeleteAllCustomer, errorCB, successCB);
}

function markToSyncCustomer(ListID,aErrFunc,successCB){
	db = openDatabaseZoe();
	logZoe("markToSyncCustomer db=" + db);
	customerErrFunc = aErrFunc;
	filterDataCustomer = ListID;
	db.transaction(doMarkToSyncCustomer, errorCB, successCB);
}

function markSynchronizedCustomer(ListID,aErrFunc,successCB){
	db = openDatabaseZoe();
	logZoe("markSynchronizedCustomer db=" + db);
	customerErrFunc = aErrFunc;
	filterDataCustomer = ListID;
	db.transaction(doMarkToSynchronizedCustomer, errorCB, successCB);
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
	tx.executeSql("SELECT ListID, FullName, IsActive, billAddress1, billAddress2, shipAddress1, shipAddress2, openBalance, overdueBalance, workPhone, cellPhone, email, shipAddressZipcode, billAddresZipcode, billAddresCity, billAddressState, billAddressCountry, shipAddressCity, shipAddressState, shipAddressCountry, id_salesrep, routeDay1, routeDay2, routeDay3, routeDay4, routeDay5, routeDay6, routeDay7, Fax, billAddress3, shipAddress3, name, companyName, otherDetails, id_term, pricelevel_ListID FROM customer ORDER BY FullName", [],customerLocalListReceiveFunction, customerErrFunc);
}

function doListCustomersByRouteDay(tx){
	logZoe("doListCustomersByRouteDay")
	var query = "SELECT customer.ListID, FullName, IsActive, billAddress1, billAddress2, shipAddress1, shipAddress2, openBalance, overdueBalance, workPhone, cellPhone, email, shipAddressZipcode, billAddresZipcode, billAddresCity, billAddressState, billAddressCountry, shipAddressCity, shipAddressState, shipAddressCountry, id_salesrep, routeDay1, routeDay2, routeDay3, routeDay4, routeDay5, routeDay6, routeDay7, Fax, billAddress3, shipAddress3, name, companyName, otherDetails, customer.id_term, pricelevel_ListID ,inv.salesofday FROM customer left join (select listid, sum(subtotal+salestaxtotal) salesofday FROM invoice where shipdate=date('now','localtime') group by listid) as inv on inv.listid= customer.listid"
	+" WHERE customer.routeday" + filterDataCustomer + "=1" ;
	console.log("doListCustomersByRouteDay query=" + query);
	tx.executeSql(query,[],customerLocalListReceiveFunction, customerErrFunc);
}


function customerLocalReceiveFunction(tx,results){
	logZoe("customerLocalReceiveFunction");
	if (results.rows.length>0){
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
			logZoe("customerLocalListReceiveFunction " + JSON.stringify(results.rows.item(i)));
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
	tx.executeSql('INSERT OR REPLACE INTO customer(ListID, FullName, IsActive, billAddress1, billAddress2, shipAddress1, shipAddress2, openBalance, overdueBalance, workPhone, cellPhone, email, shipAddressZipcode, billAddresZipcode, billAddresCity, billAddressState, billAddressCountry, shipAddressCity, shipAddressState, shipAddressCountry, id_salesrep, routeDay1, routeDay2, routeDay3, routeDay4, routeDay5, routeDay6, routeDay7, Fax, billAddress3, shipAddress3, name, companyName, otherDetails, id_term, pricelevel_ListID) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[theRecord.ListID, ifUndefNull(theRecord.FullName), theRecord.IsActive, ifUndefNull(theRecord.billAddress1), ifUndefNull(theRecord.billAddress2), ifUndefNull(theRecord.shipAddress1), ifUndefNull(theRecord.shipAddress2), ifUndefNull(theRecord.openBalance), ifUndefNull(theRecord.overdueBalance), ifUndefNull(theRecord.workPhone), ifUndefNull(theRecord.cellPhone), ifUndefNull(theRecord.email), ifUndefNull(theRecord.shipAddressZipcode), ifUndefNull(theRecord.billAddresZipcode), ifUndefNull(theRecord.billAddresCity), ifUndefNull(theRecord.billAddressState), ifUndefNull(theRecord.billAddressCountry), ifUndefNull(theRecord.shipAddressCity), ifUndefNull(theRecord.shipAddressState), ifUndefNull(theRecord.shipAddressCountry), ifUndefNull(theRecord.id_salesrep), ifUndefNull(theRecord.routeDay1), ifUndefNull(theRecord.routeDay2), ifUndefNull(theRecord.routeDay3), ifUndefNull(theRecord.routeDay4), ifUndefNull(theRecord.routeDay5), ifUndefNull(theRecord.routeDay6), ifUndefNull(theRecord.routeDay7), ifUndefNull(theRecord.Fax), ifUndefNull(theRecord.billAddress3), ifUndefNull(theRecord.shipAddress3), ifUndefNull(theRecord.name), ifUndefNull(theRecord.companyName), ifUndefNull(theRecord.otherDetails), ifUndefNull(theRecord.id_term), theRecord.pricelevel_ListID]);
	if (customerOrigin){
		tx.executeSql('UPDATE customer set origin = ? WHERE ListID = ?',[customerOrigin, theRecord.ListID]);
	}
}

function doMarkToSyncCustomer(tx){
	tx.executeSql("UPDATE customer SET needSync=1, zoeUpdateDate=datetime('now', 'localtime') where ListID = ?",[filterDataCustomer]);
}

function doMarkSynchorinizedCustomer(tx){
	tx.executeSql("UPDATE customer SET needSync=0, zoeSyncDate=datetime('now', 'localtime') where ListID = ?",[filterDataCustomer]);
}

function doDeleteAllCustomer(tx){
	tx.executeSql('DELETE FROM customer',[]);
}
