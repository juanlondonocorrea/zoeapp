// JavaScript Document
var synchronizing = false;
var xhrSync;
var receiveSyncCallback;
function consumeWS(mensaje, format, receiveFunction, cache, xpathExp){
	receiveSyncCallback = receiveFunction;
	if (synchronizing==true){
		alert("Synchronizing in process");
		return;
	}
	log("consumeWS1"); 

	synchronizing = true;
	
	$( "#synchDialog" ).popup( "open" );
	$( "#synchDialog" ).on( "popupafterclose", cancelSynch );
	
	log("consumeWS2"); 
//    var webServiceURL = 'http://24.234.187.107:54320/SyncService';
    var webServiceURL = 'http://192.168.88.103:54320/SyncService';
	
//    var webServiceURL = 'http://127.0.0.1:54320/SyncService';

	$.support.cors = true;
	
	var dataToSend = "{synch:{uploadOperations:'"+mensaje+"',responseFormat:'"+format+"'"; 
	
	if (cache){
		dataToSend = dataToSend + ",cache:'" + cache + "'";
	}
	if (xpathExp){
		dataToSend = dataToSend + ",xpathExp:'" + xpathExp + "'";
	}
	
	dataToSend += "}}";
	
	
    xhrSync = $.ajax({
        type: "POST",
        url: webServiceURL,
		timeout: 80000 ,
		jsonp: "callback",
        data: dataToSend,
        dataType: "text",
        complete: recibeSyncResponse,
        error: errSync,
    });

	log("consumeWS3 data:" + dataToSend); 


}

function recibeSyncResponse( jqXHR, textStatus)
{
	log("synchronizing textStatus:" + textStatus );
	log("synchronizing msg jqXHR:" + JSON.stringify(jqXHR ));
	if (jqXHR && jqXHR.responseText){		
		synchronizing = false
		$( "#synchDialog" ).popup( "close" );
		var jsonStr = 	jqXHR.responseText;
		jsonStr = jsonStr.substring(1,jsonStr.length-1);
		log("jsonStr="+jsonStr);
		var obj = JSON.parse(jsonStr);
		if (obj && obj.QBXML){
			var msgObj = obj.QBXML.QBXMLMsgsRs;
			receiveSyncCallback(msgObj);
		}else{
			log("Synch error: empty response");
			alert("Synch error: empty response");
		}
	}
}

function errSync(jqXHR, textStatus)
{
	synchronizing = false;
	$( "#synchDialog" ).popup( "close" );			
	log("synchronizing error: " + textStatus);              
	log("synchronizing error jqXHR: " + JSON.stringify(jqXHR));              
	alert("Synch error: empty response");
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