// JavaScript Document

var salesRepDAO = {get:getSalesRep, insert:insertSalesRep, };
var name;
var salesRepReceiveFunction;
var salesRepErrFunc;
var salesRepVO;
var recordSalesRep;

function getSalesRep(aName,aReceiveFunction,aErrFunc){
	logZoe("getSalesRep");
	name=aName;
	salesRepReceiveFunction = aReceiveFunction;
	salesRepErrFunc = aErrFunc;
	db.transaction(doSelectSalesRep, errorCB, successCB);
}
function insertSalesRep(record,aErrFunc,succesCB){
	logZoe("insertSalesRep");
	recordSalesRep = record;
	salesRepErrFunc = aErrFunc;
	db.transaction(doInsertSalesRep, errorCB, successCB);
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

function doInsertSalesRep(tx){
	tx.executeSql('INSERT INTO salesRep(id_salesrep, Name, Password, isActive, SyncTime) values (?,?,?,?,?)',[recordSalesRep.id_salesRep, recordSalesRep.name, recordSalesRem.password, recordSalesRep.isActive, recordSalesRep.syncTime],localReceiveFunction, salesRepErrFunc);
}