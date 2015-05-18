// JavaScript Document
var synchronizing = false;
function consumeWS(mensaje, format){
	if (synchronizing==true){
		alert("Synchronizing in process");
		return;
	}
	console.log("consumeWS1"); 

	synchronizing = true;
	navigator.plugins.activityStart("Synchronizing, please wait", "loading");
	
    var webServiceURL = 'http://127.0.0.1:54321/SyncService';

	$.support.cors = true;
	
    $.ajax({
        type: "POST",
        url: webServiceURL,
		jsonp: "callback",
        data: "{synch:{uploadOperations:'"+mensaje+"',responseFormat:'json'}}",
		complete: recibeSyncResponse,
        dataType: "text",
        success: recibeSyncResponse,
		timeout: 90*1000 ,
        error: function(e){
			synchronizing = false;
			navigator.notification.activityStop();
			alert("Synchronize fails:" + e.message);
            console.log("error " + e);              
        }
    });

}

function recibeSyncResponse(msg)
{
	synchronizing = false
	navigator.notification.activityStop();
	console.log(msg);
}

