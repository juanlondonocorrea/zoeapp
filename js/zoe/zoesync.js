// JavaScript Document
var synchronizing = false;
var xhrSync;
var receiveSyncCallback;
function consumeWS(mensaje, format, receiveFunction){
	receiveSyncCallback = receiveFunction;
	if (synchronizing==true){
		alert("Synchronizing in process");
		return;
	}
	log("consumeWS1"); 

	synchronizing = true;
	$( "#synchDialog" ).popup( "open" );			
	
	log("consumeWS2"); 
    var webServiceURL = 'http://24.234.187.107:54320/SyncService';
//    var webServiceURL = 'http://127.0.0.1:54320/SyncService';

	$.support.cors = true;
	
    xhrSync = $.ajax({
        type: "POST",
        url: webServiceURL,
		timeout: 80000 ,
		jsonp: "callback",
        data: "{synch:{uploadOperations:'"+mensaje+"',responseFormat:'"+format+"'}}",
        dataType: "text",
        success: recibeSyncResponse,
        error: errSync
    });

}

function recibeSyncResponse( jqXHR, textStatus)
{
	log("synchronizing msg received:" + jqXHR.responseText );
	if (jqXHR.responseText){		
		synchronizing = false
		$( "#synchDialog" ).popup( "close" );
		var jsonStr = 	jqXHR.responseText;
		jsonStr = jsonStr.substring(1,jsonStr.length-1);
		log("jsonStr="+jsonStr);
		var obj = JSON.parse(jsonStr);
		var msgObj = obj.QBXML.QBXMLMsgsRs;
		log("se recibiio un objeto ListID:"+ msgObj.EmployeeQueryRs.EmployeeRet.ListID);
		receiveSyncCallback(msgObj);
	}
}

function errSync(jqXHR, textStatus)
{
	synchronizing = false;
	$( "#synchDialog" ).popup( "close" );			
	log("synchronizing error: " + textStatus);              
}

function log(msg){
	var currTime = Date.now();
	console.log(currTime + " - " + msg);
}

function cancelSynch(){
	if(xhrSync && xhrSync.readyState != 4){
		synchronizing = false;
		xhrSync.abort();
	}
}