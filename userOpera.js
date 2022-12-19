

export default class UserOpera{

    constructor(connect) {
        this.connect = connect
    }

    callback(result, resolve, reject){
        if(result.code == 200){
            resolve({
                code: 200,
                data: result.data
            })
        }else{
            reject(result)
        }
    }

    AddTagsUser(...tagsName){
        const that = this
        const params = {
            0: tagsName,
            1: "this"
        }
        const promise = new Promise((resolve, reject) =>{
            that.connect.createMsgTags("AddTagsUser", params, (result) => {
                that.callback(result, resolve, reject)
            })
        })
        return promise
    }

    DelTagsUser(...tagsName){
        const that = this
        const params = {
            0: tagsName,
            1: "this"
        }
        const promise = new Promise((resolve, reject) =>{
            that.connect.createMsgTags("DelTagsUser", params, (result) => {
                that.callback(result, resolve, reject)
            })
        })
        return promise
    }

    CheckUserInTag(...tagsName){
        const that = this
        const params = {
            0: tagsName,
            1: "this"
        }
        const promise = new Promise((resolve, reject) =>{
            that.connect.createMsgTags("CheckUserInTag", params, (result) => {
                that.callback(result, resolve, reject)
            })
        })
        return promise
    }

    CheckOtherUserInTag(userId, ...tagsName){
        const that = this
        const params = {
            0: tagsName,
            1: userId
        }
        const promise = new Promise((resolve, reject) =>{
            that.connect.createMsgTags("CheckOtherUserInTag", params, (result) => {
                that.callback(result, resolve, reject)
            })
        })
        return promise
    }
    CheckTagIsCreate( ...tagsName){
        const that = this
        const params = {
            0: tagsName
        }
        const promise = new Promise((resolve, reject) =>{
            that.connect.createMsgTags("CheckTagIsCreate", params, (result) => {
                that.callback(result, resolve, reject)
            })
        })
        return promise
    }

    ClearTags( ...tagsName){
        const that = this
        const params = {
            0: tagsName
        }
        const promise = new Promise((resolve, reject) =>{
            that.connect.createMsgTags("ClearTags", params, (result) => {
                that.callback(result, resolve, reject)
            })
        })
        return promise
    }
    TagsInUsers( ...tagsName){
        const that = this
        const params = {
            0: tagsName
        }
        const promise = new Promise((resolve, reject) =>{
            that.connect.createMsgTags("TagsInUsers", params, (result) => {
                that.callback(result, resolve, reject)
            })
        })
        return promise
    }
    TagsSetData(data, ...tagsName){
        const that = this
        const params = {
            0: tagsName,
            1: data
        }
        const promise = new Promise((resolve, reject) =>{
            that.connect.createMsgTags("TagsSetData", params, (result) => {
                that.callback(result, resolve, reject)
            })
        })
        return promise
    }
    TagsGetData(...tagsName){
        const that = this
        const params = {
            0: tagsName
        }
        const promise = new Promise((resolve, reject) =>{
            that.connect.createMsgTags("TagsGetData", params, (result) => {
                that.callback(result, resolve, reject)
            })
        })
        return promise
    }

    Data(){
        const that = this
        const params = {
            0: "this"
        }
        const promise = new Promise((resolve, reject) =>{
            that.connect.createMsgUserMethod("Data", params, (result) => {
                that.callback(result, resolve, reject)
            })
        })
        return promise
    }

    InitUserBean(data){
        const that = this
        const params = {
            0: data,
            1: "this"
        }
        const promise = new Promise((resolve, reject) =>{
            that.connect.createMsgUserMethod("InitUserBean", params, (result) => {
                that.callback(result, resolve, reject)
            })
        })
        return promise
    }

    UserData(userId){
        const that = this
        const params = {
            0: userId
        }
        const promise = new Promise((resolve, reject) =>{
            that.connect.createMsgUserMethod("UserData", params, (result) => {
                that.callback(result, resolve, reject)
            })
        })
        return promise
    }
    SendMessageBus(sendData,...receiver){
        const that = this
        const params = {
            0: receiver,
            1: sendData,
            2: "this"
        }
        const promise = new Promise((resolve, reject) =>{
            that.connect.createMsgUserMethod("SendMessageBus", params, (result) => {
                that.callback(result, resolve, reject)
            })
        })
        return promise
    }
    SendMessageTagBus(sendData,...tagsName){
        const that = this
        const params = {
            0: tagsName,
            1: sendData,
            2: "this"
        }
        const promise = new Promise((resolve, reject) =>{
            that.connect.createMsgUserMethod("SendMessageTagBus", params, (result) => {
                that.callback(result, resolve, reject)
            })
        })
        return promise
    }
}