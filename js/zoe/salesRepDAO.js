// JavaScript Document

var salesRepDAO = {getByName:getSalesRepByName, store:storeSalesRep, };
var filterData;
var salesRepReceiveFunction;
var salesRepErrFunc;
var salesRepVO;
var recordSalesRep;

function getSalesRepByName(aName,aReceiveFunction,aErrFunc){
	db = openDatabaseZoe();
	logZoe("getSalesRep db=" + db);
	filterData=aName;
	salesRepReceiveFunction = aReceiveFunction;
	salesRepErrFunc = aErrFunc;
	db.transaction(doSelectSalesRep, salesRepErrFunc, salesRepReceiveFunction);
}
function storeSalesRep(record,aErrFunc,succesCB){
	db = openDatabaseZoe();
	logZoe("storeSalesRep db=" + db);
	recordSalesRep = record;
	salesRepErrFunc = aErrFunc;
	db.transaction(doStoreSalesRep, errorCB, successCB);
}



function doSelectSalesRep(tx){
	logZoe("doSelectSalesRep filterData=" + filterData);
	tx.executeSql('SELECT id_salesrep,Name, Password, isActive, SyncTime FROM salesRep where Name=?', [filterData],localReceiveFunction, salesRepErrFunc);
}

function localReceiveFunction(tx,results){
	logZoe("localReceiveFunction" + results);
	if (results.length>0){
		salesRepVO.id_salesrep = results.rows.item(0).id_salesrep;
		salesRepVO.name = results.rows.item(0).Name;
		salesRepVO.password = results.rows.item(0).Password;
		salesRepVO.isActive = results.rows.item(0).isActive;
		salesRepVO.syncTime = results.rows.item(0).SyncTime;
	logZoe("localReceiveFunction salesRepVO"+ JSON.stringify(salesRepVO));
		salesRepReceiveFunction(salesRepVO);
	}
	logZoe("localReceiveFunction fin");
}

function doStoreSalesRep(tx){
	logZoe ("doStoreSalesRep"+JSON.stringify(recordSalesRep));
	tx.executeSql('INSERT OR REPLACE INTO salesRep(id_salesrep, Name, Password, isActive, SyncTime) values (?,?,?,?,?)',[recordSalesRep.id_salesRep, recordSalesRep.name, recordSalesRep.password, recordSalesRep.isActive, recordSalesRep.syncTime]/*,localReceiveFunction, salesRepErrFunc*/);
}
