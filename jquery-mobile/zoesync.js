// JavaScript Document

function consumeWS(mensaje){
    var divToBeWorkedOn = "#res";
    var webServiceURL = 'http://localhost:54320/SyncService';

    var parameters = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.quickbooks.harana.com/"> \
   <soapenv:Header/> \
   <soapenv:Body> \
      <ws:synch> \
         <uploadOperations> \
<![CDATA[ ' + mensaje +']]> \
         </uploadOperations> \
         <responseFormat>JSON</responseFormat> \
      </ws:synch> \
   </soapenv:Body> \
</soapenv:Envelope>';

    $.ajax({
        type: "Post",
        url: webServiceURL,
        data: parameters,
        contentType: "text/xml; charset=\"utf-8\"",
        dataType: "xml",
        success: function(msg) {    
            alert("funciono "+msg);
        },
        error: function(e){
            alert("error");              
        }
    });
}