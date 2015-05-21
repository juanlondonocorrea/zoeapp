// JavaScript Document
var synchronizing = false;
function consumeWS(mensaje, format){
	if (synchronizing==true){
		alert("Synchronizing in process");
		return;
	}
	log("consumeWS1"); 

	synchronizing = true;
	$( "#synchDialog" ).popup( "open" );			
	
    var webServiceURL = 'http://24.234.187.107:54321/SyncService';

	$.support.cors = true;
	
    $.ajax({
        type: "POST",
        url: webServiceURL,
		//timeout: 90000 ,
		jsonp: "callback",
        data: "{synch:{uploadOperations:'"+mensaje+"',responseFormat:'json'}}",
		complete: recibeSyncResponse,
        dataType: "text",
        success: recibeSyncResponse,
        error: errSync
    });

}

function recibeSyncResponse(msg)
{
	synchronizing = false
	$( "#synchDialog" ).popup( "close" );			
	log(msg);
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