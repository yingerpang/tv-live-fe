


export default class Stream{

    constructor(connect, streamName) {
        this.connect = connect
        this.mediaStream = new MediaStream();
        this.audioTrack = null
        this.videoTrack = null
        this.audioSender = null
        this.videoSender = null
        if(streamName === undefined){
            this.streamName = this.mediaStream.id
        }else{
            this.streamName = streamName
        }
        
    }

    Id(){
        return this.mediaStream.id
    }

    Name(){
        return this.streamName
    }

    MediaStream(){
        return this.mediaStream
    }

    changeVideoStatus(closeOrOpen){
        if (this.videoTrack != null){
            let methodName = ""
            if (!closeOrOpen){
                methodName = "PauseStreamToUser"
                this.videoTrack.enabled = false
            }else {
                methodName = "ResumeStreamToUser"
                this.videoTrack.enabled = true
            }
            const params = {
                "0": this.Id(),
                "1": "video",
                "2": "this"
            }
            this.connect.createMsgWebrtcMethod(methodName, params, (result) =>{})
        }
    }

    changeAudioStatus(closeOrOpen){
        if (this.audioTrack != null){
            let methodName = ""
            if (!closeOrOpen){
                methodName = "PauseStreamToUser"
                this.audioTrack.enabled = false
            }else {
                methodName = "ResumeStreamToUser"
                this.audioTrack.enabled = true
            }
            const params = {
                "0": this.Id(),
                "1": "audio",
                "2": "this"
            }
            this.connect.createMsgWebrtcMethod(methodName, params, (result) =>{})
        }
    }

    createAudio(){
        const that = this
        const promise = new Promise((resolve, reject) =>{
            if(that.audioTrack == null){
                const constraints = {
                    video: false,
                    audio: true
                };
                navigator.mediaDevices.getUserMedia(constraints)
                    .then((sendStream) =>{
                        sendStream.getTracks().forEach((track) => {
                            if(track.kind == "audio"){
                                that.audioTrack = track
                            }
                        });
                        sendStream.removeTrack(that.audioTrack)
                        that.mediaStream.addTrack(that.audioTrack)
                        resolve()
                    })
                    .catch(e => {
                        reject(e)
                    });
            }else{
                reject()
            }
        })
        return promise
        
    }

    createVideo(width, height, fps){
        const that = this
        const promise = new Promise((resolve, reject) =>{
            if(that.videoTrack == null){
                const constraints = {
                    video: {width: {exact: width}, height: {exact: height}, frameRate: fps},
                    audio: false
                };
                navigator.mediaDevices.getUserMedia(constraints)
                    .then((sendStream) =>{
                        sendStream.getTracks().forEach((track) => {
                            if(track.kind == "video"){
                                that.videoTrack = track
                            }
                        });
                        sendStream.removeTrack(that.videoTrack)
                        that.mediaStream.addTrack(that.videoTrack)
                        resolve()
                    })
                    .catch(e => {
                        reject(e)
                    });
            }else{
                reject()
            }
        })
        return promise
       
    }

    createScreen(width, height, fps){
        const that = this
        const promise = new Promise((resolve, reject) =>{
            if(that.videoTrack == null){
                const constraints = {video: { width: width, height: height, frameRate: fps}}
                navigator.mediaDevices.getDisplayMedia(constraints)
                    .then((sendStream) =>{
                        sendStream.getTracks().forEach((track) => {
                            if(track.kind == "video"){
                                that.videoTrack = track
                            }
                        });
                        sendStream.removeTrack(that.videoTrack)
                        that.mediaStream.addTrack(that.videoTrack)
                        resolve()
                    })
                    .catch(e => {
                        reject(e)
                    });
            }else{
                reject()
            }
        })
        return promise
    }

    sendStreamToTag(...tags){
        const that = this
        const promise = new Promise(async (resolve, reject) =>{
            const params = {
                "0": tags,
                "1": that.Id(),
                "2": "this"
            }
            that.connect.createMsgWebrtcMethod("SendStreamToTag", params, (result) =>{
                if(result.code == 200){
                    resolve({
                        code: result.code,
                        data: result.data,
                    })
                }else{
                    reject(new Error(JSON.stringify({
                        code: result.code,
                        errMsg: result.errMsg
                    })))
                }
            })
        })
        return promise
    }

    getStreamInfo(){
        const that = this
        const promise = new Promise(async (resolve, reject) =>{
            const params = {
                "0": "this"
            }
            that.connect.createMsgWebrtcMethod("GetStreamInfo", params, (result) =>{
                if(result.code == 200){
                    resolve({
                        code: result.code,
                        data: result.data,
                    })
                }else{
                    reject(new Error(JSON.stringify({
                        code: result.code,
                        errMsg: result.errMsg
                    })))
                }
            })
        })
        return promise
    }

    getUserStreamInfo(...uids){
        const that = this
        const promise = new Promise(async (resolve, reject) =>{
            const params = {
                "0": uids,
                "1": "this",
            }
            that.connect.createMsgWebrtcMethod("GetUserStreamInfo", params, (result) =>{
                console.log('getUserStreamInfo', result)
                if(result.code == 200){
                    resolve({
                        code: result.code,
                        data: result.data,
                    })
                }else{
                    reject(new Error(JSON.stringify({
                        code: result.code,
                        errMsg: result.errMsg
                    })))
                }
            })
        })
        return promise
    }

    sendStreamStopToTag(...tags){
        const that = this
        const promise = new Promise(async (resolve, reject) =>{
            const params = {
                "0": tags,
                "1": that.Id(),
                "2": that.Name(),
                "3": "this"
            }
            that.connect.createMsgWebrtcMethod("SendStreamStopToTag", params, (result) =>{
                if(result.code == 200){
                    resolve({
                        code: result.code,
                        data: result.data,
                    })
                }else{
                    reject(new Error(JSON.stringify({
                        code: result.code,
                        errMsg: result.errMsg
                    })))
                }
            })
        })
        return promise
    }

    changeStreamName(streamName){
        this.streamName = streamName
        const that = this
        const promise = new Promise(async (resolve, reject) =>{
            const params = {
                "0": that.Id(),
                "1": that.Name(),
                "2": "this"
            }
            that.connect.createMsgWebrtcMethod("ChangeStreamName", params, (result) =>{
                if(result.code == 200){
                    resolve({
                        code: result.code,
                        data: result.data,
                    })
                }else{
                    reject(new Error(JSON.stringify({
                        code: result.code,
                        errMsg: result.errMsg
                    })))
                }
            })
        })
        return promise
    }

    push(){
        const that = this
        const promise = new Promise(async (resolve, reject) =>{
            const localConnection = that.connect.localConnection
            if(that.audioTrack != null){
                that.audioSender = localConnection.addTrack(that.audioTrack, that.mediaStream)
            }
            if(that.videoTrack != null){
                that.videoSender = localConnection.addTrack(that.videoTrack, that.mediaStream)
            }
            const offer = await this.connect.getOffer()
            const params = {
                "0": JSON.stringify(offer),
                "1": "this"
            }
            that.connect.createMsgWebrtcMethod("UpdateSdp", params, (result) =>{
                if(result.code == 200){
                    const sdp = JSON.parse(result.data)
                    that.connect.setSdp(sdp).then(()=>{
                        setTimeout(()=>{
                            try{
                            
                                let data = that.changeStreamName(that.Name())
                                resolve(data)
                            }catch(e){
                                reject(e)
                            }
                        }, 200)
                    
                    }).catch(e=>{
                        reject(e)
                    })
                    
                }else{
                    reject(new Error(JSON.stringify({
                        code: result.code,
                        errMsg: result.errMsg
                    })))
                }
            })
        })
        return promise
    }

    stopPush(){
        const that = this
        const promise = new Promise(async (resolve, reject) =>{
            const localConnection = that.connect.localConnection
            if(that.audioSender != null){
                localConnection.removeTrack(that.audioSender)
            }
            if(that.videoSender != null){
                localConnection.removeTrack(that.videoSender)
            }
            const offer = await this.connect.getOffer()
            const params = {
                "0": JSON.stringify(offer),
                "1": "this"
            }
            that.connect.createMsgWebrtcMethod("UpdateSdp", params, (result) =>{
                if(result.code == 200){
                    const sdp = JSON.parse(result.data)
                    that.connect.setSdp(sdp)
                    resolve({
                        code: result.code
                    })
                }else{
                    reject(new Error(JSON.stringify({
                        code: result.code,
                        errMsg: result.errMsg
                    })))
                }
            })
        })
        return promise
    }

    // close(){
    //     if(this.audioTrack != null){
    //         this.mediaStream.removeTrack(this.audioTrack)
    //         this.audioTrack.dispose()
    //     }
    //     if(this.videoTrack != null){
    //         this.mediaStream.removeTrack(this.videoTrack)
    //         this.videoTrack.dispose()
    //     }
    //     this.mediaStream.dispose();
    // }

    close(){
        if(this.audioTrack != null){
            this.mediaStream.removeTrack(this.audioTrack)
            try {
                this.audioTrack.close()
                this.audioTrack.dispose()
            } catch (e) {
                console.log('停止音频错误', e)
            }
        }
        if(this.videoTrack != null){
            this.mediaStream.removeTrack(this.videoTrack)
            try {
                this.videoTrack.stop()
                this.videoTrack.dispose()
            } catch (e) {
                console.log('停止视频错误', e)
            }
            // this.videoTrack.dispose()
        }
        try {
            this.mediaStream.dispose();
        } catch (e) {
            console.log('停止mediaStream错误', e)
        }
    }
}