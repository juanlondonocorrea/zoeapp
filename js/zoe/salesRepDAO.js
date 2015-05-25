// JavaScript Document

var salesRepDAO = {get:getSalesRep, store:storeSalesRep, };
var name;
var salesRepReceiveFunction;
var salesRepErrFunc;
var salesRepVO;
var recordSalesRep;

function getSalesRep(aName,aReceiveFunction,aErrFunc){
	db = openDatabaseZoe();
	logZoe("getSalesRep db=" + db);
	name=aName;
	salesRepReceiveFunction = aReceiveFunction;
	salesRepErrFunc = aErrFunc;
	db.transaction(doSelectSalesRep, errorCB, successCB);
}
function storeSalesRep(record,aErrFunc,succesCB){
	db = openDatabaseZoe();
	logZoe("storeSalesRep db=" + db);
	recordSalesRep = record;
	salesRepErrFunc = aErrFunc;
	db.transaction(doStoreSalesRep, errorCB, successCB);
}



function doSelectSalesRep(tx){
	tx.executeSql('SELECT id_salesrep,Name, Password, isActive, SyncTime FROM salesRep where Name=?', [name],localReceiveFunction, salesRepErrFunc);
}

function localReceiveFunction(tx,results){
	if (results.length>0){
		salesRepVO = results.rows.item(0)
		salesRepReceiveFunction(salesRepVO);
	}
}

function doStoreSalesRep(tx){
	logZoe ("doStoreSalesRep"+JSON.stringify(recordSalesRep));
	tx.executeSql('INSERT OR REPLACE INTO salesRep(id_salesrep, Name, Password, isActive, SyncTime) values (?,?,?,?,?)',[recordSalesRep.id_salesRep, recordSalesRep.name, recordSalesRep.password, recordSalesRep.IsActive, recordSalesRep.syncTime]/*,localReceiveFunction, salesRepErrFunc*/);
}
