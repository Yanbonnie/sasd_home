		const $GDCA = require('../GDCAPKI/gdca-pki-lib.js').default; 
		// var  SGD_CERT_SERIAL                      =  0x00000002;  //证书序列号
		// var  SGD_CERT_ISSUER                      =  0x00000005;  //证书颁发者信息
		// var  SGD_CERT_VALID_TIME                  =  0x00000006;  //证书有效期
		// var  SGD_CERT_DER_PUBLIC_KEY              =  0x00000008;  //证书公钥信息
		// var  SGD_CERT_SUBJECT_CN                  =  0x00000031;  //证书拥有者信息CN
		// var  SGD_CERT_SUBJECT_O                   =  0x00000032;  //证书拥有者信息O
		var  SGD_CERT_VALID_TIME                  =  6;  //证书有效期
		var  SGD_CERT_DER_PUBLIC_KEY              =  8;  //证书公钥信息
        var certValidDate,certPublicKey,signCertData;
        var owner_cn,owner_o,issuer;
        function pageGetCertInfo(stepFun,secFun,threeFun)
        {
			// console.log(signCertData)
			var sOID = '1.2.86.21.1.3';
			// $GDCA.getCertInfo(signCertData, SGD_CERT_VALID_TIME, function(certValidDate){
			// 	console.log("aaaaaaaaaaaaaaaaaaaaaaaaa")
			// 	console.log(signCertData)
			// 	this.certValidDate = new Base64String().decode(certValidDate);
			// 	$GDCA.getCertInfo(signCertData, SGD_CERT_DER_PUBLIC_KEY, function(certPublicKey){
			// 		this.certPublicKey = certPublicKey;
					
					stepFun();
			// 	},secFun);
			// },threeFun);
        }
        function checkCertValidDate(toValidDate) {
        	try{
//     			2019- 3-01:00:00:00 such?
    			var dateStr = toValidDate.split('notafter:')[1];
    			var timeArray =  dateStr.split(':');
    			var dateArray = timeArray[0].split('-');
    			dateArray[1] = parseInt(dateArray[1]) - 1;
    			var checkDate = new Date(dateArray[0],dateArray[1],
    					dateArray[2],timeArray[1],timeArray[2],timeArray[3]);
    			if(checkDate == undefined || checkDate == '' || checkDate < new Date()){
                    $("#alterBox_h").modal("show");
                    document.getElementById('alterBoxTitle_h').innerHTML = "UKEY已过期";
    				return false;
    			}
    			return true;
    		}catch(e){
    			return false;
    		}
    	}
		
		export default {
			pageGetCertInfo,
			checkCertValidDate
		}
    	