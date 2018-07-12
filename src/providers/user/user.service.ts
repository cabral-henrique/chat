
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { BaseService } from '../base/base.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import { Observable } from 'rxjs';
import { User } from './../../models/user.model';


@Injectable()
export class UserService extends BaseService {
  usersRef: AngularFireList<User> = null;
  users: Observable<User[]>;
  currentUser: AngularFireObject<User>;
  constructor(
    public http: HttpClient,
    public firebaseApp: AngularFireStorage,
    public db: AngularFireDatabase) {
      super();
      this.usersRef = this.db.list("users")
    }

    getUsersList(): AngularFireList<User> {
      return this.usersRef;
    }

    public setUsers(uidToExclude: string): void {
      this.users = this.db.list("users", ref => ref.orderByChild("name")).valueChanges()
      .map((users: User[]) => {
        return users.filter((user: User) => {
          return user.uid !== uidToExclude
        })
      });
    }
    public setCurrentUser(uid: string): void {
       this.currentUser = this.db.object(`/users/${uid}`)
    }

  createUser(user: User,uid: string) {
    return this.db.object(`/users/${uid}`).set(user).catch(()=> this.handlePromiseError);
  }
  userExists(username: string): Observable<boolean> {
     return this.db.list("users", ref => ref.orderByChild('username').equalTo(username))
     .valueChanges().map((user: User[]) => {
       return user.length > 0;
     });
  }
  get(uid: string): Observable<any>{
    return this.db.object(`/users/${uid}`).valueChanges();
  }

  edit(user: {name: string, username:string,photo: string}): Promise<any>  {
    return this.currentUser
      .update(user)
      .catch(this.handlePromiseError);
  }

  uploadPhoto(file: File, uid:string) : AngularFireUploadTask {
    return this.firebaseApp.ref(`/users/${uid}`)
      .put(file);
  }

  getphoto(uid: string): Observable<any> {
    return this.firebaseApp.ref(`/users/${uid}`).getDownloadURL();
  }
}
