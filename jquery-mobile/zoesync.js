// JavaScript Document

function consumeWS(mensaje, format){
	console.log("consumeWS1"); 
    var webServiceURL = 'http://127.0.0.1:54321/SyncService';

    var parameters = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.quickbooks.harana.com/"> \
   <soapenv:Header/> \
   <soapenv:Body> \
      <ws:synch> \
         <uploadOperations> \
<![CDATA[ ' + mensaje +']]> \
         </uploadOperations> \
         <responseFormat>' + format + '</responseFormat> \
      </ws:synch> \
   </soapenv:Body> \
</soapenv:Envelope>';

	console.log("consumeWS2 parameters=" + parameters);
	
	$.support.cors = true;
	
    $.ajax({
        type: "POST",
        url: webServiceURL,
        data: parameters,
		complete: recibeSyncResponse,
        contentType: "text/xml",
        dataType: "xml",
        success: function(msg) {    
		console.log("consumeWS4 bien");
            console.log("funciono "+msg);
        },
        error: function(e){
            console.log("error " + e.name);              
        }
    });
		console.log("consumeWS3");

}

function recibeSyncResponse(xmlHttpRequest, status)
{
	console.log(xmlHttpRequest);
}