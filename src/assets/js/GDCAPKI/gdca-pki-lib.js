var GDCA_PKI_ID = {
	SERVICE_HOST: 'localhost',		//后台服务地址
	SERVICE_PORT: 55661,			//后台服务端口
    MAX_PARAM_LEN: 800,             //参数最大长度
    PROTOCOL: 'http://'
};

var getProtocol = function () {
	if('https:' == document.location.protocol){
        GDCA_PKI_ID.PROTOCOL = 'https://';
        GDCA_PKI_ID.SERVICE_PORT = 55662;
	}else{
        GDCA_PKI_ID.PROTOCOL = 'http://';
        GDCA_PKI_ID.SERVICE_PORT = 55661;
	}
	return GDCA_PKI_ID.PROTOCOL;
}

// var GDCA_PKI_LIB = $GDCA = {
var $GDCA = {
	URL: function(){
//		var url = 'http://'+GDCA_PKI_ID.SERVICE_HOST+':'+GDCA_PKI_ID.SERVICE_PORT;
		var url = getProtocol()+GDCA_PKI_ID.SERVICE_HOST+':'+GDCA_PKI_ID.SERVICE_PORT;
		return url;
	}(),
    plusPorts:function () {
        GDCA_PKI_ID.SERVICE_PORT = GDCA_PKI_ID.SERVICE_PORT + 543;
        $GDCA.URL = GDCA_PKI_ID.PROTOCOL + GDCA_PKI_ID.SERVICE_HOST + ':' + GDCA_PKI_ID.SERVICE_PORT;
    },
    /**
     * base64编码
     * @param val
     * @returns {*}
     */
    base64Encode: function(val){
        return BASE64.encoder(val);
    },

    /**
     * base64解码
     * @param val
     * @returns {*}
     */
    base64Decode: function(val){
        return BASE64.decoder(val);
    },

    /**
     * 切割base64参数
     * @param base64
     * @returns {Array}
     */
    _cutParam: function(base64){
        var _this = this;
        var max = GDCA_PKI_ID.MAX_PARAM_LEN;
        var len = base64.length;

        if(len<=max){return [base64];}

        var total = 0;

        if(len%max>0){
            total = parseInt(len/max) + 1;
        }else{
            total = parseInt(len/max);
        }

        var arg = [];
        for(var i=0;i<total;i++){
            var s = 0 + (i*max);
            var e = s + max;

            if(i+1>=total){
                e = base64.length;
            }
            arg.push(base64.substring(s,e));
        }

        return arg;
    },

    /**
     * 创建业务流水号(16位随机数)
     * @private
     */
    _createSN: function(){
        var arg = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9','0'];
        var res = [];
        for(var i=0;i<16;i++){
            var p = parseInt(Math.random()*35+0);
            res.push(arg[p]);
        }
        return res.join('');
    },

	exeFn: function(methodName,paramJson){
        var defer = $.Deferred();

        var _this = this;

        paramJson = paramJson || {};

        setTimeout(function(){
            //TODO: paramJson转字符串
            var sJson = JSON.stringify(paramJson);

            //TODO: paramJson进行base64
            var base64 = _this.base64Encode(sJson);

            //TODO: 切割参数
            var arg = _this._cutParam(base64);

            //TODO: 重新组装
            var sn = _this._createSN();
            var argParam = [];
            for(var i=0,len=arg.length;i<len;i++){
                var data = {
                    sn: sn,
                    total: len,
                    sort: i,
                    part: arg[i]
                };
                argParam.push(data);
            }

            //TODO: 并发提交
            var subFn = function(data,_methodName){
                //var url = _this.URL + '?callback='+_methodName+'_'+data.sn+'_'+data.sort;
				var url = _this.URL;
                $.jsonp({
                    url: url,
                    data: data,
                    dataTypeString: "jsonp",
                    crossDomain: true,
                    callbackParameter: 'callback',
                    contentType: "application/json",
                    cache: false,
                    callback: _methodName+'_'+data.sn+'_'+data.sort,
                    success: function (res) {
                        if(res.Status==1){
                            defer.resolve(res.Result);
                        }else if(res.Status==0){
                            defer.reject({
                                ErrorCode: res.ErrorCode,
                                ErrorMsg: res.ErrorMsg
                            });
                        }
                    },
                    error: function (xOptions, textStatus) {
                        var resJson = {
                            ErrorCode: '0000',
                            ErrorMsg: textStatus
                        };
                        defer.reject(resJson);
                    }
                });
            }

            for(var i=0;i<argParam.length;i++){
                subFn(argParam[i],methodName);
            }
        },0);

        return defer.promise();
	},

    /**
     * 获取版本号
     * @param succFn
     * @param failFn
     * @returns {*}
     */
	getVersion: function(succFn,failFn){
        var defer = $.Deferred();

        var _this = this;

        _this.exeFn('SOF_GetVersion')
            .then(function(resJson){
                var version = resJson.Version;
                if(succFn){succFn(version);}
                defer.resolve(version);
            })
            .fail(function(resJson){
                if(failFn){failFn(resJson);}
                defer.reject(resJson);
            });

        return defer.promise();
	},

    /**
     * 获取用户列表
     * @param returnMethod
     * @param succFn
     * @param failFn
     * @returns {*}
     */
    getUserList: function(returnMethod,succFn,failFn){
        var defer = $.Deferred();

        var _this = this;

        setTimeout(function(){
            var paramJson = {
                ReturnMethod: parseInt(returnMethod)
            };

            _this.exeFn('SOF_GetUserList',paramJson)
                .then(function(resJson){
                    if(succFn){succFn(resJson);}
                    defer.resolve(resJson);
                })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);

        return defer.promise();
    },
	
	Login: function(username,pin,succFn,failFn){
        var defer = $.Deferred();

        var _this = this;

        setTimeout(function(){
            var paramJson = {
				UserName: username,
				PassWd: pin
            };

            _this.exeFn('SOF_Login',paramJson)
                .then(function(resJson){
                    if(succFn){succFn(resJson);}
                    defer.resolve(resJson);
                })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);

        return defer.promise();
    },
	
	ChangePin: function(username,oldpin,newpin,succFn,failFn){
        var defer = $.Deferred();

        var _this = this;

        setTimeout(function(){
            var paramJson = {
				ContainerName: username,
				OldPassWd: oldpin,
				NewPassWd: newpin
            };

            _this.exeFn('SOF_ChangePassWd',paramJson)
                .then(function(resJson){
                    if(succFn){succFn(resJson);}
                    defer.resolve(resJson);
                })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);

        return defer.promise();
    },
	
	getPinRetryCount: function(username,succFn,failFn){
        var defer = $.Deferred();

        var _this = this;

        setTimeout(function(){
            var paramJson = {
				ContainerName: username
            };

            _this.exeFn('SOF_GetPinRetryCount',paramJson)
                .then(function(resJson){
                    if(succFn){succFn(resJson.RetryCount);}
                    defer.resolve(resJson.RetryCount);
                })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);

        return defer.promise();
	},
	
	getSignMethod: function(succFn,failFn){
        var defer = $.Deferred();

        var _this = this;

        _this.exeFn('SOF_GetSignMethod')
            .then(function(resJson){
                if(succFn){succFn(resJson.SignMethod);}
                defer.resolve(resJson.SignMethod);
            })
            .fail(function(resJson){
                if(failFn){failFn(resJson);}
                defer.reject(resJson);
            });

        return defer.promise();
	},
	
	exportUserCert: function(username,succFn,failFn){
        var defer = $.Deferred();

        var _this = this;

        setTimeout(function(){
            var paramJson = {
				ContainerName: username
            };

            _this.exeFn('SOF_ExportUserCert',paramJson)
                .then(function(resJson){
                    if(succFn){succFn(resJson.UserCert);}
                    defer.resolve(resJson.UserCert);
                })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);

        return defer.promise();
	},
	
	exportExChangeUserCert: function(username,succFn,failFn){
        var defer = $.Deferred();

        var _this = this;

        setTimeout(function(){
            var paramJson = {
				ContainerName: username
            };

            _this.exeFn('SOF_ExportExChangeUserCert',paramJson)
                .then(function(resJson){
                    if(succFn){succFn(resJson.UserCert);}
                    defer.resolve(resJson.UserCert);
                })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);

        return defer.promise();
	},
	
	validateCert: function(username,succFn,failFn){
        var defer = $.Deferred();

        var _this = this;

        setTimeout(function(){
            var paramJson = {
				Cert: username
            };

            _this.exeFn('SOF_ValidateCert',paramJson)
                .then(function(resJson){
                    if(succFn){succFn(resJson.Info);}
                    defer.resolve(resJson.Info);
                })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);

        return defer.promise();
	},
    signData: function(username,indata,succFn,failFn){
        var defer = $.Deferred();
        var _this = this;
        setTimeout(function(){
            var paramJson = {
                ContainerName: username,
                InData: indata
            };
            _this.exeFn('SOF_SignData',paramJson)
                .then(function(resJson){
                    if(succFn){succFn(resJson.Sign);}
                    defer.resolve(resJson.Sign);
                })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);
        return defer.promise();
    },

    setSignMethod: function(type,succFn,failFn){
        var defer = $.Deferred();

        var _this = this;
        setTimeout(function(){
            var paramJson = {
                SignMethod: type
            };
            _this.exeFn('SOF_SetSignMethod',paramJson).then(function(resJson){
                if(succFn){succFn(resJson);}
                defer.resolve(resJson);
            })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);
        return defer.promise();
	},
	
	signMessage: function(username,indata,succFn,failFn){
        var defer = $.Deferred();

        var _this = this;

        setTimeout(function(){
            var paramJson = {
				Flag: 0,
				ContainerName: username,
				InData: indata
            };

            _this.exeFn('SOF_SignMessage',paramJson)
                .then(function(resJson){
                    if(succFn){succFn(resJson.SignData);}
                    defer.resolve(resJson.SignData);
                })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);

        return defer.promise();
	},
	
	verifySignedData: function(EncodeCert,InData,SignValue,succFn,failFn){
        var defer = $.Deferred();

        var _this = this;

        setTimeout(function(){
            var paramJson = {
				EncodeCert: EncodeCert,
				InData: InData,
				SignValue: SignValue
            };

            _this.exeFn('SOF_VerifySignedData',paramJson)
                .then(function(resJson){
                    if(succFn){succFn(resJson);}
                    defer.resolve(resJson);
                })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);

        return defer.promise();
	},
	
	verifySignedMessage: function(MessageData,InData,succFn,failFn){
        var defer = $.Deferred();

        var _this = this;

        setTimeout(function(){
            var paramJson = {
				MessageData: MessageData,
				InData: InData
            };

            _this.exeFn('SOF_VerifySignedMessage',paramJson)
                .then(function(resJson){
                    if(succFn){succFn(resJson);}
                    defer.resolve(resJson);
                })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);

        return defer.promise();
	},
	
	getInfoFromSignedMessage: function(MessageData,type,succFn,failFn){
        var defer = $.Deferred();

        var _this = this;

        setTimeout(function(){
            var paramJson = {
				MessageData: MessageData,
				Type: parseInt(type)
            };

            _this.exeFn('SOF_GetInfoFromSignedMessage',paramJson)
                .then(function(resJson){
                    if(succFn){succFn(resJson.Info);}
                    defer.resolve(resJson.Info);
                })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);

        return defer.promise();
	},
	
	encryptData: function(cert,indata,succFn,failFn){
        var defer = $.Deferred();

        var _this = this;

        setTimeout(function(){
            var paramJson = {
				EncodeCert: cert,
				InData: indata
            };

            _this.exeFn('SOF_EncryptData',paramJson)
                .then(function(resJson){
                    if(succFn){succFn(resJson.EncryptData);}
                    defer.resolve(resJson.EncryptData);
                })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);

        return defer.promise();
	},
	
	decryptData: function(ContainerName,InData,succFn,failFn){
        var defer = $.Deferred();

        var _this = this;

        setTimeout(function(){
            var paramJson = {
				ContainerName: ContainerName,
				InData: InData
            };

            _this.exeFn('SOF_DecryptData',paramJson)
                .then(function(resJson){
                    if(succFn){succFn(resJson.DecryptData);}
                    defer.resolve(resJson.DecryptData);
                })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);

        return defer.promise();
	},
	
	getCertInfo: function(usercert,type,succFn,failFn){
        var defer = $.Deferred();
        var _this = this;
        setTimeout(function(){
            var paramJson = {
				Cert: usercert,
				Type: type
            };
            _this.exeFn('SOF_GetCertInfo',paramJson)
                .then(function(resJson){
                    if(succFn){succFn(resJson.Info);}
                    defer.resolve(resJson.Info);
                })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);

        return defer.promise();
	},

    getCertInfoByOid: function(usercert,oid,succFn,failFn){
        var defer = $.Deferred();
        var _this = this;
        setTimeout(function(){
            var paramJson = {
                Cert: usercert,
                oid: oid
            };
            _this.exeFn('SOF_GetCertInfoByOid',paramJson)
                .then(function(resJson){
                    if(succFn){succFn(resJson.Info);}
                    defer.resolve(resJson.Info);
                })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);
        return defer.promise();
    },
	
	hashFile: function(type,filepath,publickey,userid,succFn,failFn){
        var defer = $.Deferred();

        var _this = this;

        setTimeout(function(){
            var paramJson = {
				AlgorithmType: parseInt(type),
				InFile: filepath,
				PublicKey: publickey,
				ID: userid
            };

            _this.exeFn('SOF_HashFile',paramJson)
                .then(function(resJson){
                    if(succFn){succFn(resJson.HashValue);}
                    defer.resolve(resJson.HashValue);
                })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);

        return defer.promise();
	},
	
	writeUsrDataFile: function(containername,userpin,nFileType,nFileIndex,nFileOffset,sWriteData,succFn,failFn){
        var defer = $.Deferred();

        var _this = this;

        setTimeout(function(){
            var paramJson = {
				ContainerName: containername,
				Pin: userpin,
				FileType: parseInt(nFileType),
				FileIndex: parseInt(nFileIndex),
				Offset: parseInt(nFileOffset),
				WriteData: sWriteData
            };

            _this.exeFn('SOF_WriteUsrDataFile',paramJson)
                .then(function(resJson){
                    if(succFn){succFn(resJson);}
                    defer.resolve(resJson);
                })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);

        return defer.promise();
	},
	
	readUsrDataFile: function(containername,nFileType,nFileIndex,nFileOffset,nReadLen,succFn,failFn){
        var defer = $.Deferred();

        var _this = this;

        setTimeout(function(){
            var paramJson = {
				ContainerName: containername,
				FileType: parseInt(nFileType),
				FileIndex: parseInt(nFileIndex),
				Offset: parseInt(nFileOffset),
				ReadLen: parseInt(nReadLen)
            };

            _this.exeFn('SOF_ReadUsrDataFile',paramJson)
                .then(function(resJson){
                    if(succFn){succFn(resJson.ReadData);}
                    defer.resolve(resJson.ReadData);
                })
                .fail(function(resJson){
                    if(failFn){failFn(resJson);}
                    defer.reject(resJson);
                });
        },0);

        return defer.promise();
	}
};

var GDCA_GetUserList = function(res){

};

export default $GDCA;