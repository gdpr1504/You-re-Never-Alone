import { Injectable } from "@angular/core";

interface user{
    username:string,
    uid: string,
}
@Injectable()
export class UserService{
    public user:user
    usernameid:string
    lat:string
    long:string
    constructor(){

    }
    setUser(user:user){
        this.user=user
    }
    getUID(){
        return this.user.uid
    }
    getData(){
        return this.usernameid
    }
    setData(value:string){
        this.usernameid=value
    }
    setlat(value:string){
        this.lat=value
    }
    setlong(value:string){
        this.long=value
    }
    getlat(){
        return this.lat
    }
    getlong(){
        return this.long
    }
}