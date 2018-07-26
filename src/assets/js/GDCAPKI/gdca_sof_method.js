const $GDCA = require('./gdca-pki-lib.js').default; 
$.ajaxSetup({
	timeout:   120 * 1000
});

/**
 * 获取版本号
 */
var checkGetVersion = function(obj){
	$GDCA.getVersion(function(res){
		showRes(res,obj);
	},function(err){
		var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
		showErr(txt,obj);
	});

	return false;
};

/**
 * 获取用户列表
 * @param obj
 * @returns {boolean}
 */
var ddata;
var checkLoopTime = 0;
var checkReadUserList = function(obj, reFun, failFun){
    $GDCA.getUserList(0, function (res){
		ddata = res[0].split('||')[1].split('"')[0];
        reFun(ddata);
    }, function () {
        checkLoopTime++;
        if (checkLoopTime > 4){
            failFun();
        }else{
            $GDCA.plusPorts();
            checkReadUserList(obj, reFun, failFun);
        }
    });
	return false;
};

//KEY登陆
var checkLoginKey = function(obj,pin,reFun,erFun){
	var username = ddata;
	if(!username){
        erFun();
		return false;
	}
	if(!pin){
		erFun();
		return false;
	}
	$GDCA.Login(username,pin,function(res){
        reFun();
	},function(err){
		var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
		checkGetPinRetryCount(erFun);
	});
};

//修改PIN码
var checkChangePin = function(obj){
	var oldpin = $('input[name="oldpin"]',obj).val();
	var newpin = $('input[name="newpin"]',obj).val();
	var username = $('input[name="username"]',obj).val();
	if(!username){
		showErr('请输入用户名',obj);
		return false;
	}
	if(!oldpin){
		showErr('请输入PIN码',obj);
		return false;
	}
	
	$GDCA.ChangePin(username,oldpin,newpin,function(res){
		var txt = '修改成功';
		showRes(txt,obj);
	},function(err){
		var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
		showErr(txt,obj);
	});

	return false;
};

//获取PIN重试次数
var checkGetPinRetryCount = function(erFun){
	$GDCA.getPinRetryCount(ddata,function(res){
		erFun(res)		
	},function(err){
		var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
		showErr(txt,obj);
	});

	return false;
};

//获取签名算法
var checkGetSignMethod = function(obj){
	$GDCA.getSignMethod(function(res){
		showRes(res,obj);
	},function(err){
		var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
		showErr(txt,obj);
	});

	return false;
};

//导出签名证书
var checkExportUserCert = function(obj){
	var username = $('input[name="username"]',obj).val();
	
	$GDCA.exportUserCert(username,function(res){

		$('textarea[certname="certdata"]').val(res);
		var txt = '导出成功';
		showRes(txt,obj);
	},function(err){
		var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
		showErr(txt,obj);
	});

	return false;
};

//导出加密证书
var checkExportExChangeUserCert = function(obj){
	var username = $('input[name="username"]',obj).val();
	
	$GDCA.exportExChangeUserCert(username,function(res){
		$('textarea[certname1="certdata1"]').val(res);
		var txt = '导出成功';
		showRes(txt,obj);
	},function(err){
		var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
		showErr(txt,obj);
	});

	return false;
};

//验证证书有效性
var checkValidateCert = function(obj){
	var username = $('textarea[name="username"]',obj).val();
	
	$GDCA.validateCert(username,function(res){
		var txt = '验证成功';
		showRes(txt,obj);
	},function(err){
		var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
		showErr(txt,obj);
	});

	return false;
};

//不带原文签名
var checkSignData = function(obj,indata){
	var username = ddata;
	$GDCA.signData(username,indata,function(res){
        return res;
	},function(err){
        return false;
	});
	return false;
};

//验证签名
var checkVerifySignedData = function(obj){
	var EncodeCert = $('textarea[name="EncodeCert"]',obj).val();
	var InData = $('textarea[name="InData"]',obj).val();
	var SignValue = $('textarea[name="SignValue"]',obj).val();
	
	$GDCA.verifySignedData(EncodeCert,InData,SignValue,function(res){
		var txt = '验证成功'
		showRes(txt,obj);
	},function(err){
		var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
		showErr(txt,obj);
	});

	return false;
};

//签名验签循环
var checkLoopSignedData = function(obj){
	var ContainerName = $('input[name="ContainerName"]',obj).val();
	var looptimes = $('input[name="looptimes"]',obj).val();
	var EncodeCert = $('textarea[name="EncodeCert"]',obj).val();
	var ilength = $('input[name="length"]',obj).val();
	
	var total = 0;
	var runFn = function(){
            if(total<looptimes){
                //TODO: 执行
				var l = 1 + Math.ceil(Math.random()*ilength);
				var indata = randomString(l);
				var now1 = new Date();
				var msecs1 = now1.getTime();
                $GDCA.signData(ContainerName,indata,function(res){
					$GDCA.verifySignedData(EncodeCert,indata,res,function(res1){
						var now2 = new Date();
						var msecs2 = now2.getTime();
						var msecs = msecs2 - msecs1;
						$('#looptxt').append('<div>第'+total+'次长度'+l+'成功:'+msecs+'ms</div>');
							
						},function(err){
							var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
							$('#looptxt').append('<div>第'+total+'次'+l+'失败:'+txt+'</div>');
							showErr(txt,obj);
						});
					total++;
					runFn();
				},function(err){
					var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
					
					$('#looptxt').append('<div>第'+total+'次'+l+'失败:'+txt+'</div>');
					
					total++;
					runFn();
					//showErr(txt,obj);
				});
            }
        };

        runFn();

	return false;
};

//签名
var checkSignMessage = function(obj){
	var username = $('input[name="username"]',obj).val();
	var indata = $('textarea[name="indata"]',obj).val();

                $GDCA.signMessage(username,indata,function(res){
					$('textarea[signname1="signdata1"]').val(res);
					
					var txt = '签名成功';
					showRes(txt,obj);
				},function(err){
					var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
					
					showErr(txt,obj);
				});

	return false;
};

//验证签名
var checkVerifySignedMessage = function(obj){
	var MessageData = $('textarea[name="MessageData"]',obj).val();
	var InData;

	$GDCA.verifySignedMessage(MessageData,InData,function(res){
		var txt = '验证成功';
		showRes(txt,obj);
	},function(err){
		var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
		showErr(txt,obj);
	});

	return false;
};

//签名验签循环
var checkLoopSignMessage = function(obj){
	var ContainerName = $('input[name="ContainerName"]',obj).val();
	var looptimes = $('input[name="looptimes"]',obj).val();
	var EncodeCert = $('textarea[name="EncodeCert"]',obj).val();
	var ilength = $('input[name="length"]',obj).val();
	
	var total = 0;
	var runFn = function(){
            if(total<looptimes){
                //TODO: 执行
				var l = 1 + Math.ceil(Math.random()*ilength);
				var indata = randomString(l);
				var now1 = new Date();
				var msecs1 = now1.getTime();
                $GDCA.signMessage(ContainerName,indata,function(res){
					$GDCA.verifySignedMessage(res,'',function(res1){
						var now2 = new Date();
						var msecs2 = now2.getTime();
						var msecs = msecs2 - msecs1;

						$('#looptxt1').append('<div>第'+total+'次长度'+l+'成功:'+msecs+'ms</div>');
							
						},function(err){
							var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
							$('#looptxt1').append('<div>第'+total+'次'+l+'失败:'+txt+'</div>');
							showErr(txt,obj);
						});
					total++;
					runFn();
				},function(err){
					var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
					
					$('#looptxt1').append('<div>第'+total+'次'+l+'失败:'+txt+'</div>');
					
					total++;
					runFn();
					//showErr(txt,obj);
				});
            }
        };

        runFn();

	return false;
};

//解析签名
var checkGetInfoFromSignedMessage = function(obj){
	var MessageData = $('textarea[name="MessageData"]',obj).val();
	var type = $('select[name="Type"]',obj).val();
	
	$GDCA.getInfoFromSignedMessage(MessageData,type,function(res){
		showRes(res,obj);
	},function(err){
		var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
		showErr(txt,obj);
	});

	return false;
};

//加密
var checkEncryptData = function(obj){
	var EncodeCert = $('textarea[name="EncodeCert"]',obj).val();
	var InData = $('textarea[name="InData"]',obj).val();
	

                $GDCA.encryptData(EncodeCert,InData,function(res){
					$('textarea[encodename="encodedata"]').val(res);
					
					var txt = '加密成功';
					showRes(txt,obj);
				},function(err){
					var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;

					showErr(txt,obj);
				});

	return false;
};

//解密
var checkDecryptData = function(obj){
	var ContainerName = $('input[name="ContainerName"]',obj).val();
	var InData = $('textarea[name="InData"]',obj).val();
	
	$GDCA.decryptData(ContainerName,InData,function(res){
		showRes(res,obj);
	},function(err){
		var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
		showErr(txt,obj);
	});

	return false;
};

//加解密循环
var checkLoopEncryptData = function(obj){
	var ContainerName = $('input[name="ContainerName"]',obj).val();
	var looptimes = $('input[name="looptimes"]',obj).val();
	var EncodeCert = $('textarea[name="EncodeCert"]',obj).val();
	var ilength = $('input[name="length"]',obj).val();
	
	var total = 0;
	var runFn = function(){
            if(total<looptimes){
                //TODO: 执行
				var l = 1 + Math.ceil(Math.random()*ilength);
				var indata = randomString(l);
				
				var now1 = new Date();
				var msecs1 = now1.getTime();
                $GDCA.encryptData(EncodeCert,indata,function(res){
					$GDCA.decryptData(ContainerName,res,function(res1){
						var now2 = new Date();
						var msecs2 = now2.getTime();
						var msecs = msecs2 - msecs1;
						if(res1 == indata)
						{
							$('#looptxt2').append('<div>第'+total+'次长度'+l+'成功:'+msecs+'ms</div>');
						}
						else
						{
							$('#looptxt2').append('<div>第'+total+'次'+l+'失败:解密明文与原文不符</div>');
						}
							
						},function(err){
							var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
							$('#looptxt2').append('<div>第'+total+'次'+l+'失败:'+txt+'</div>');
							showErr(txt,obj);
						});
					total++;
					runFn();
				},function(err){
					var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
					
					$('#looptxt2').append('<div>第'+total+'次'+l+'失败:'+txt+'</div>');
					
					total++;
					runFn();
					//showErr(txt,obj);
				});
            }
        };

        runFn();

	return false;
};

//文件Hash
var checkHashFile = function(obj){
	var type = $('select[name="Type"]',obj).val();
	var filepath = $('input[name="filepath"]',obj).val();
	var userid = $('input[name="userid"]',obj).val();
	var sPublicKey = "";
	
	if("1"==type)//sm3
    {
		var usercert = $('#usercert').val();
        $GDCA.getCertInfo(usercert, 8, function(res){  //8: public key
			$GDCA.hashFile(type, filepath, res, userid,function(res1){
		showRes(res1,obj);
	},function(err){
		var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
		showErr(txt,obj);
	});
		},function(err){
			
		});
   	}
	else
	{
		$GDCA.hashFile(type, filepath, sPublicKey, userid,function(res){
		showRes(res,obj);
	},function(err){
		var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
		showErr(txt,obj);
	});
	}
	
	return false;
};

//多用户写
var checkWriteUsrDataFile = function(obj){
	var containername = $('#ContainerName').val();
	var userpin = $('#UserPIN').val();
	var nFileType = $('#FileType').val();
	var nFileIndex = $('#FileIndex').val();
	var nFileOffset = $('#FileOffset').val();
	var sWriteData = $('#WriteData').val();
	
	$GDCA.writeUsrDataFile(containername, userpin, nFileType, nFileIndex,nFileOffset,sWriteData,function(res){
		var txt = '写入成功';
		showRes(txt,obj);
	},function(err){
		var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
		showErr(txt,obj);
	});

	return false;
};

//多用户读
var checkReadUsrDataFile = function(obj){
	var containername = $('#ContainerName').val();
	var nFileType = $('#FileType').val();
	var nFileIndex = $('#FileIndex').val();
	var nFileOffset = $('#FileOffset').val();
	var nReadLen = $('#ReadLen').val();
	
	$GDCA.readUsrDataFile(containername, nFileType, nFileIndex,nFileOffset,nReadLen,function(res){
		$('#ReadData').val(res);
	},function(err){
		var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
		showErr(txt,obj);
	});

	return false;
};

var showErr = function(msg,obj){
	$('.res-txt',obj).html(msg);
	$('.res-txt',obj).removeClass('ok');
	$('.res-txt',obj).addClass('err');
};

var showRes = function(res,obj){
	$('.res-txt',obj).html(res);
	$('.res-txt',obj).removeClass('err');
	$('.res-txt',obj).addClass('ok');
};

var resetForm = function(obj){
	var ofrom = $(obj).parent().parent().get(0);
	ofrom.reset();
	$('.res-txt',ofrom).html('');
	$('.res-txt',ofrom).removeClass('ok');
	$('.res-txt',ofrom).removeClass('err');
};

function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}
module.exports = {
	checkReadUserList,
	checkLoginKey
}