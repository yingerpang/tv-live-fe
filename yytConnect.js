import Stream from "./stream";
import UserOpera from "./userOpera";
import RemoteStream from "./remoteStream";

export default class YytConnect{

    constructor(id) {
        this.id = id
        this.url = 'http://159.75.43.185:8702/rtc/connect'
        this.msgCacheMap = new Map()
        this.userOpera = new UserOpera(this)
        this.remoteStream = new RemoteStream(this)
    }

    onErr(e){

    }

    open(){

    }

    close(){

    }

    busMessage(busMsg){

    }

    message(tagMsg){

    }

    guid() {
        function S4() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }


    async connect(){
        const localConnection = new RTCPeerConnection();
        const sendChannel = localConnection.createDataChannel("yytserver"+this.id);
        this.listen(localConnection, sendChannel)
        const offer = await this.getOffer()
        this._connect(offer)
    }

    async getOffer(){
        const offer = await this.localConnection.createOffer()
        await this.localConnection.setLocalDescription(offer)
        return offer
    }

    async setSdp(des){
       return this.localConnection.setRemoteDescription(des)
    }

    createMsgTags(methodName, params, callback){
        const uuid = this.guid();
        this.msgCacheMap.set(uuid, callback)
        const data = this.Tags(uuid, methodName, params)
        this.sendChannel.send(data)
    }

    createMsgUserMethod(methodName, params, callback){
        const uuid = this.guid();
        this.msgCacheMap.set(uuid, callback)
        const data = this.UserMethod(uuid, methodName, params)
        this.sendChannel.send(data)
    }

    createMsgWebrtcMethod(methodName, params, callback){
        const uuid = this.guid();
        this.msgCacheMap.set(uuid, callback)
        const data = this.webrtcMethod(uuid, methodName, params)
        this.sendChannel.send(data)
    }



    listen(localConnection, sendChannel){
        sendChannel.onopen = ()=>{
            if(this.open){
                this.open()
            }
            
        }
        sendChannel.onclose = ()=>{
            if(this.onclose){
                this.onclose()
            }
        }
        sendChannel.onmessage = async e => {
            const data = String.fromCharCode.apply(null, new Uint8Array(e.data));
            const decodedString = decodeURIComponent(escape(data));
            const parse = JSON.parse(decodedString);
            if(parse.msgType.toString() === "2"){
                const callback = this.msgCacheMap.get(parse.msgId.toString())
                if(callback != null){
                    this.msgCacheMap.delete(parse.msgId.toString())
                    callback(parse.data)
                }
                return
            }
            if(parse.msgType.toString() === "1"){
                if(parse.data.source.toString() === "webrtcEngine"){ 
                    this.remoteStream.message(parse.data.data)
                }
                if(parse.data.source.toString() === "tag"){
                    this.message(parse.data.data)
                }
                return
            }
            if(parse.msgType.toString() === "3"){
                this.busMessage(parse.data)
                return
            }
        }

        localConnection.ontrack = (e)=>{
           this.remoteStream._ontrack(e)
        };
        this.sendChannel = sendChannel
        this.localConnection = localConnection
    }

    _connect(desc){
        const url = this.url;
        const httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', url, true);
        httpRequest.setRequestHeader("Content-type", "application/json");
        const obj = {
            "id": this.id,
            "sdp": JSON.stringify(desc)
        };
        httpRequest.send(JSON.stringify(obj));
        httpRequest.onreadystatechange = () => {
            if (httpRequest.status === 200 && httpRequest.readyState == 3) {
                const json = httpRequest.responseText;
                    const obj = JSON.parse(json);
                    if (obj.code === "200") {
                        const sdp = JSON.parse(obj.data);
                        this.setSdp(sdp)
                    }else{
                        this.onErr(new Error(obj))
                    }
            }else{
                this.onErr(new Error(obj))
            }
        };
    }

    close(){
        this.localConnection.close()
        this.localConnection = null
        this.sendChannel = null
    }


    createStream(streamName){
        return new Stream(this, streamName)
    }

    UserOpera(){
        return this.userOpera
    }

    RemoteStream(){
        return this.remoteStream
    }

    Tags(uuid, methodName, params){
        const times = new Date().Format("yyyy-MM-dd HH:mm:ss");
        let datas = {
            "data":{
                "clazz":"Tags",
                "method":methodName,
                "params":params,
                "time":times,
                "timeOut":10
            },
            "msgId": uuid,
            "msgType": 2,
            "time":times,
            "version":0
        };
        return JSON.stringify(datas)
    }
    
    UserMethod(uuid, methodName, params){
        const times = new Date().Format("yyyy-MM-dd HH:mm:ss");
        let datas = {
            "data":{
                "clazz":"UserMethod",
                "method":methodName,
                "params":params,
                "time":times,
                "timeOut":10
            },
            "msgId": uuid,
            "msgType": 2,
            "time":times,
            "version":0
        };
        return JSON.stringify(datas)
    }
    
    webrtcMethod(uuid, methodName, params){
        const times = new Date().Format("yyyy-MM-dd HH:mm:ss");
        const datas = {
            "data":{
                "clazz":"WebrtcMethod",
                "method": methodName,
                "params":params,
                "time":times,
                "timeOut":10
            },
            "msgId":uuid,
            "msgType":2,
            "time":times,
            "version":0
        };
        return JSON.stringify(datas)
    }

}