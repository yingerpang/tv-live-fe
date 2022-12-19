export default class RemoteStream{

    constructor(connect) {
        this.connect = connect
        this.streamMap = new Map()
        this.availableSize = 0;
    }

    streamMessage(streamData){

    }

    onTrack(track, streamId, stream){
        
    }

    removeTrack(track, streamId, stream){
        
    }

    _ontrack(e){
        const that = this
        e.streams.forEach(stream => {
            if(!that.streamMap.has(stream.id)){
                that.streamMap.set(stream.id, stream)
                const tracks = stream.getTracks()
                tracks.forEach(item => {
                    that.onTrack(item, stream.id, stream)
                })
            }
        });
    }

    message(streamData){
        if(streamData.info == 7){
            this.stopPullStream(streamData.data)
        }
        this.streamMessage(streamData)
    }

    callback(result, resolve, reject){
        if(result.code == 200){
            resolve(result)
        }else{
            reject(result)
        }
    }

    stopPullStream(streamId){
        const that = this
        const promise = new Promise(async (resolve, reject) =>{
            const offer = await this.connect.getOffer()
            if(offer == null){
                reject(new Error("offer fail"))
            }
            const params = {
                0: streamId,
                1: true,
                2: true,
                3: JSON.stringify(offer),
                4: "this"
            }
            that.connect.createMsgWebrtcMethod("StopPullStream", params, (result) => {
                if(result.code == 200){
                    that.connect.setSdp(JSON.parse(result.data))
                    const stream = that.streamMap.get(streamId)
                    if(stream != null){
                        that.streamMap.delete(streamId)
                        const tracks = stream.getTracks()
                        tracks.forEach(item => {
                            that.removeTrack(item, stream.id)
                        })
                    }
                }
                that.callback(result, resolve, reject)
            })
        })
        return promise
    }

    pullStream(uid, streamId){
        const that = this
        const promise = new Promise(async (resolve, reject) =>{
            if(that.availableSize <= that.streamMap.size){
                that.connect.localConnection.addTransceiver("video");
                that.connect.localConnection.addTransceiver("audio");
                that.availableSize++
            }
            const offer = await that.connect.getOffer()
            if(offer == null){
                reject(new Error("offer fail"))
            }
            const params = {
                0: uid,
                1: streamId,
                2: true,
                3: true,
                4: JSON.stringify(offer),
                5: "this"
            }
            that.connect.createMsgWebrtcMethod("PullStream", params, (result) => {
                if(result.code == 200){
                    that.connect.setSdp(JSON.parse(result.data))
                }
                that.callback(result, resolve, reject)
            })
        })
        return promise
    }

}