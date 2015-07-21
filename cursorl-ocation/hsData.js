var CONSTANT={
    HS_TOKEN:'HS_TOKEN',//存在localStorage里的恒生token的key
    LS_OK:'OK',//
    LS_FAIL:'FAIL'
}

var DataUtil = {
    dataEmptyProcess:function(errObj,dataFactory){
        if(errObj.error_no=='-1' && errObj.error_code=='1'){
            dataFactory.data=[];
            dataFactory.status='dataReady';
            dataFactory.onDataReady();
            dataFactory.end();
            return true;
        }
        return false;
    }
}
var LsManager = {
    getItem:function(key){
        var value = ''
        if(window.localStorage) {
            if(!(key in localStorage)){
                return {
                    result:CONSTANT.LS_FAIL,
                    value:''
                }
            }
            return {
                result: CONSTANT.LS_OK,
                value: localStorage.getItem(key)
            }
        }else{
            return {
                result:CONSTANT.LS_FAIL,
                value:''
            }
        }
    },
    setItem:function(key,value){
        if(window.localStorage){
            localStorage.setItem(key,value);
            return {result:CONSTANT.LS_OK}
        }else{
            return {result:CONSTANT.LS_FAIL}
        }
    },
    removeItem:function(key){
        if(window.localStorage){
            localStorage.removeItem(key);
            return {result:CONSTANT.LS_OK}
        }else{
            return {result:CONSTANT.LS_FAIL}
        }
    }
}

function TokenClient(server,id){
    this.server = server;
    this.id = id;
    this.eventMap = {
        'tokenReady':[]
    }
}

TokenClient.prototype={
    end:function(){
        this.server.removeClient(this);
    },
    needNewToken:function(){
        this.server.reToken();
    },
    on:function(key,fn){
        this.eventMap[key].push(fn)
        if(key =='tokenReady'){
            if(this.server.status=='tokenReady'){
                this.emit(key);
            }
        }
    },
    emit:function(key){
        if(key=='tokenReady'){
            var eventList = this.eventMap[key];
            for(var i in eventList){
                eventList[i](this.server.token)
            }
        }
    },
    tokenErr:function(errObj){
        if(errObj && errObj.error){
            if(errObj.error=='invalid_token'){
                this.needNewToken();
                return true;
            }
        }
        return false;
    }
}

function TokenServer(){
    this.clients = {};
    this.status ='';
    this.tokenRequestTime=0;
    this.clientId = 0;
    //var _this = this;
    this._getToken(function(_this){
        _this.pushToken(_this.token)
    });
}

TokenServer.prototype={
    createClient:function(){
        var client = new TokenClient(this,this.clientId++);
        this.clients[client.id] = client;
        return client;
    },
    removeClient:function(client){
        delete this.clients[client.id];
    },
    pushToken:function(){
        for(var i in this.clients){
            this.clients[i].emit('tokenReady')
        }
    },
    reToken:function(){
        if(this.status=='reToken'){
            return;
        }
        this.status ='reToken';

        LsManager.removeItem(CONSTANT.HS_TOKEN);
        var _this =this;
        this._getToken(function(_this){
            _this.pushToken(_this.token);
        });
    },
    _getToken:function(cb){
        var r = LsManager.getItem(CONSTANT.HS_TOKEN);
        if(r.result==CONSTANT.LS_OK){
            this.token = r.value;
            this.status='tokenReady';
            if(typeof cb == 'function') {
                cb(this)
            }
            return;
        }
        this.tokenRequestTime++;
        if(this.tokenRequestTime>5){
            alert('请求令牌的次数超过5次，这说明你的浏览器版本太低或我们的服务器不可用，请刷新页面重试')
            return;
        }

        var _this = this;

        $.ajax({
            url:"http://api.wallstreetcn.com/v2/itn/token/public",
            jsonp:'callback',
            dataType:'jsonp'
        }).done(function(e) {
            var token = e.results.access_token;
            _this.token = token
            _this.status='tokenReady';
            LsManager.setItem(CONSTANT.HS_TOKEN,token);
            if(typeof cb == 'function'){
                cb(_this);
            }
        }).fail(function(){
            //setTimeout(){}
            _this._getToken(cb)
        })
    }
}
var tokenServer = new TokenServer();

window.getTokenServer= function(){
    return tokenServer;
}

var HsDataFactoryList = {
    'wizard':createDataFactory('https://open.hs.net/quote/v1/wizard'),
    'marketList':createDataFactory('https://open.hs.net/quote/v1/market/list'),
    'kLine':createDataFactory('https://open.hs.net/quote/v1/kline'),
    'real':createDataFactory('https://open.hs.net/quote/v1/real')
}

function createDataFactory(url){
    return function(reqData){
        var factoryInstance = {
            status:'',
            data:null,
            dataReadyFunc:[],
            errorFunc:[],
            reqData:reqData||{},
            errObj:{},
            client:getTokenServer().createClient(),
            url:url
        }
        initMethod(factoryInstance);
        return factoryInstance;
    }
}

function initMethod(instance){
    for(var i in instanceMethods){
        if(instanceMethods.hasOwnProperty(i)){
            instance[i] = instanceMethods[i];
        }
    }
}


var instanceMethods = {
    //now just for test
    _initEnd:function(){

    },
    init:function(){
        var _this =this;
        this.client.on('tokenReady',function(token){
            _this.reData(token);
        });
        //this.reData()
        this._initEnd();
        return this;
    },
    end:function(){
        this.client.end();
    },
    onDataReady:function(fn){
        if(typeof fn =='function'){
            this.dataReadyFunc.push(fn);
        }
        if(this.status =='dataReady'){
            for(var i in this.dataReadyFunc){
                this.dataReadyFunc[i](this.data);
            }
            this.dataReadyFunc = [];
        }
        return this;
    },
    onError:function(fn){
        //this.reData()
        if(typeof fn =='function'){
            this.errorFunc.push(fn)
        }
        if(this.status=='error'){
            for(var i in this.errorFunc){
                this.errorFunc[i](this);
            }
            this.errorFunc=[];
        }
        return this;
    },
    reData:function(token){
        this.status ='error';
        //var token = HsToken.token,
        var  reqData =this.reqData;
        var _this = this;
        $.ajax({
            url:this.url,
            headers:{
                "Authorization" : 'Bearer '+token
            },
            //data:{
            //    prod_code:'zh',
            //    en_finance_mic:'SS,SZ'
            //},
            data:reqData,
            success:function(e){
                _this.status='dataReady'
                if(typeof e =='string'){
                    var resJson = JSON.parse(e);
                }else{
                    resJson =e;
                }
                _this.data = resJson.data;
                //_this.reData();
                _this.onDataReady();
                _this.end();
            },
            error:function(e){
                _this.status = 'error';
                if(e || e.responseText){
                    var errObj =JSON.parse(e.responseText);
                    _this.errObj = errObj;

                    if(_this.client.tokenErr(errObj)){
                        ////Token错误,不触发其他错误处理, here do nothing
                    }else if(DataUtil.dataEmptyProcess(errObj,_this)){
                        //找不到数据，恒生api会返回错误，统一处理一下，here do nothing
                    }else{
                        _this.onError()
                    }
                }
            }
        })
    }
};