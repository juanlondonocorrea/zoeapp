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
	$.mobile.changePage("#synchDialog", {transition: "flow"});
	
	log("consumeWS2"); 
    var webServiceURL = 'http://24.234.187.107:54320/SyncService';
//    var webServiceURL = 'http://127.0.0.1:54320/SyncService';

	$.support.cors = true;
	
	var dataToSend = "{synch:{uploadOperations:'"+mensaje+"',responseFormat:'"+format+"'}}"; 
	
    xhrSync = $.ajax({
        type: "POST",
        url: webServiceURL,
		timeout: 80000 ,
		jsonp: "callback",
        data: dataToSend,
        dataType: "text",
        success: recibeSyncResponse,
        complete: recibeSyncResponse,
        error: errSync
    });

	log("consumeWS3 data:" + dataToSend); 


}

function recibeSyncResponse( jqXHR, textStatus)
{
	log("synchronizing msg received:" + jqXHR.responseText );
	log("synchronizing textStatus:" + textStatus );
	log("synchronizing msg received:" + JSON.stringify(jqXHR ));
	if (jqXHR.responseText){		
		synchronizing = false
		//$( "#synchDialog" ).popup( "close" );
		var jsonStr = 	jqXHR.responseText;
		jsonStr = jsonStr.substring(1,jsonStr.length-1);
		log("jsonStr="+jsonStr);
		var obj = JSON.parse(jsonStr);
		var msgObj = obj.QBXML.QBXMLMsgsRs;
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