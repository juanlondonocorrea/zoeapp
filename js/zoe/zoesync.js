// JavaScript Document

function consumeWS(mensaje, format){
	console.log("consumeWS1");
    var webServiceURL = 'http://192.168.1.101:54320/SyncService';

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
	
    $.ajax({
        type: "Post",
        url: webServiceURL,
        data: parameters,
        contentType: "text/xml; charset=\"utf-8\"",
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