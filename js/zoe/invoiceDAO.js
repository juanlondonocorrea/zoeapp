// JavaScript Document

var invoiceDAO = {listBySalesrep:listInvoicesBySalesrep, 
				getById:getInvoiceById, 
				store:storeInvoice, 
				deleteAll:deleteAllInvoices};
var filterDataInvoice;
var invoiceReceiveFunction;
var invoiceReceiveListFunction;
var invoiceErrFunc;
var invoiceVO;
var recordInvoice;

//----------------------
//metodos hacia afuera
//----------------------
function getInvoiceById(aId,aReceiveFunction,aErrFunc){
	db = openDatabaseZoe();
	logZoe("getInvoice db=" + db);
	filterData=aId;
	invoiceReceiveFunction = aReceiveFunction;
	invoiceErrFunc = aErrFunc;
	db.transaction(doSelectInvoice, invoiceErrFunc, invoiceReceiveFunction);
}

function listInvoicesBySalesrep(customer_ListID, aReceiveFunction,aErrFunc){
	db = openDatabaseZoe();
	logZoe("listInvoices db=" + db);
	invoiceReceiveListFunction = aReceiveFunction;
	invoiceErrFunc = aErrFunc;
	filterDataInvoice = customer_ListID;
	db.transaction(doCustomerInvoices, invoiceErrFunc, invoiceLocalListReceiveFunction);
}

function storeInvoice(records,aErrFunc,successCB){
	db = openDatabaseZoe();
	logZoe("storeInvoice db=" + db);
	recordInvoice = records;
	invoiceErrFunc = aErrFunc;
	db.transaction(doStoreInvoice, errorCB, successCB);
}

function deleteAllInvoices(aErrFunc,successCB){
	db = openDatabaseZoe();
	logZoe("deleteAllInvoice db=" + db);
	invoiceErrFunc = aErrFunc;
	db.transaction(doDeleteAllInvoice, errorCB, successCB);
}


//----------------------
//metodos privados
//----------------------

function doSelectInvoice(tx){
	logZoe("doSelectInvoice filterData=" + filterDataInvoice);
	tx.executeSql("SELECT id_invoice, ListID, po_number, dueDate, appliedAmount, balanceRemaining, billAddress_addr1, billAddress_addr2, billAddress_addr3, billAddress_city, billAddress_state, billAddress_postalcode, shipAddress_addr1, shipAddress_addr2, shipAddress_addr3, shipAddress_city, shipAddress_state, shipAddress_postalcode, isPaid, isPending, refNumber, salesTaxPercentage, salesTaxTotal, shipDate, subtotal FROM invoice Where id_invoice = ?", [filterDataInvoice],invoiceLocalReceiveFunction, invoiceErrFunc);
}

function doCustomerInvoices(tx){
	logZoe("doSelectSelesrepInvoices");
	tx.executeSql("SELECT id_invoice, ListID, po_number, dueDate, appliedAmount, balanceRemaining, billAddress_addr1, billAddress_addr2, billAddress_addr3, billAddress_city, billAddress_state, billAddress_postalcode, shipAddress_addr1, shipAddress_addr2, shipAddress_addr3, shipAddress_city, shipAddress_state, shipAddress_postalcode, isPaid, isPending, refNumber, salesTaxPercentage, salesTaxTotal, shipDate, subtotal FROM invoice WHERE ListID = ?", [filterDataInvoice],invoiceLocalListReceiveFunction, invoiceErrFunc);
}

function invoiceLocalReceiveFunction(tx,results){
	logZoe("invoiceLocalReceiveFunction results = " + JSON.stringify(results));
	if (results.rows.length>0){
	logZoe("localReceiveFunction1 " + JSON.stringify(results.rows.item(0)));
		invoiceVO=results.rows.item(0);
		invoiceReceiveFunction(invoiceVO);
	}
	logZoe("localReceiveFunction fin");
}

function invoiceLocalListReceiveFunction(tx,results){
	logZoe("invoiceLocalListReceiveFunction results.length=" + results.rows.length);
	var i;
	var arrayInvoices = new Array();
	for (i=0;i<results.rows.length;i++){
	logZoe("invoiceLocalListReceiveFunction " + JSON.stringify(results.rows.item(0)));
		arrayInvoices[i] = results.rows.item(i);
	}
	invoiceReceiveListFunction(arrayInvoices);
}

function doStoreInvoice(tx){
	logZoe ("doStoreInvoice ");
	if (recordInvoice.length){
		var i;
		for (i=0;i<recordInvoice.length;i++){
			var theRecord = recordInvoice[i];
			logZoe("store invoice:" + JSON.stringify(theRecord));
			doStoreOneInvoice(tx, theRecord);
		}
	}else{
			doStoreOneInvoice(tx, recordInvoice);
	}
	
}

function doStoreOneInvoice(tx, rec){
	tx.executeSql('INSERT OR REPLACE INTO invoice(id_invoice, ListID, po_number, dueDate, appliedAmount, balanceRemaining, billAddress_addr1, billAddress_addr2, billAddress_addr3, billAddress_city, billAddress_state, billAddress_postalcode, shipAddress_addr1, shipAddress_addr2, shipAddress_addr3, shipAddress_city, shipAddress_state, shipAddress_postalcode, isPaid, isPending, refNumber, TaxPercentage, salesTaxTotal, shipDate, subtotal) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[rec.id_invoice, rec.ListID, rec.po_number, rec.dueDate, rec.appliedAmount, rec.balanceRemaining, rec.billAddress_addr1, rec.billAddress_addr2, rec.billAddress_addr3, rec.billAddress_city, rec.billAddress_state, rec.billAddress_postalcode, rec.shipAddress_addr1, rec.shipAddress_addr2, rec.shipAddress_addr3, rec.shipAddress_city, rec.shipAddress_state, rec.shipAddress_postalcode, rec.isPaid, rec.isPending, rec.refNumber, rec.TaxPercentage, rec.salesTaxTotal, rec.shipDate, rec.subtotal]);
	
 if (rec.items){
	 for (var i=0;i<rec.items[i];i++){
		 var item = rec.item;
		 tx.executeSql('INSERT OR REPLACE INTO invoice_item(LineID,id_invoice,Inventory_ListID,Desc,Quantity,Rate,Amount,SalesTax_ListID) VALUES(?,?,?,?,?,?,?,?)',[item.LineID,item.id_invoice,item.Inventory_ListID,item.Desc,item.Quantity,item.Rate,item.Amount,item.SalesTax_ListID]);
	 }
 }
}

function doDeleteAllInvoices(tx){
	tx.executeSql('DELETE FROM invoice',[]);
	tx.executeSql('DELETE FROM invoice_items',[]);
}
