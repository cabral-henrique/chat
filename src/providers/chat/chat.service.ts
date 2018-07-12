
import { Chat } from './../../models/chat.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import { Observable } from '../../../node_modules/rxjs';

@Injectable()
export class ChatService extends BaseService {

  chats: Observable<any>;
  chat: Chat;
  constructor(
    public http: HttpClient,
    public db: AngularFireDatabase,
    public auth: AngularFireAuth) {
    super();
    this.setChats();
  }

  create(chat: Chat, uid: string, uidOther: string) {
    return this.db.object(`/chats/${uid}/${uidOther}`).set(chat).catch(this.handlePromiseError);
  }

  getDeepChat(uid: string, uidOther: string): AngularFireObject<Chat> {
    return this.db.object(`/chats/${uid}/${uidOther}`);
  }
  private setChats(): void {
    this.auth.authState.subscribe((authState) => {
      if (authState) {
        this.chats = this.db.list(`/chats/${authState.uid}`, ref =>
          ref.orderByChild("timestamp").limitToLast(15)).snapshotChanges()
          .map(action => {
            return action.map(collection => {
              let item = <Chat>collection.payload.val()
              let chat = new Chat(item.lastMessage, item.timestamp, item.title, item.photo);
              chat.uid = collection.key;
              return chat;
            });
          });
      }
    });
  }
  updatePhoto(chat: AngularFireObject<Chat>, chatPhoto: string,recipientUserPhoto:string) : Promise<void> {
    if(chatPhoto !== recipientUserPhoto){
      return chat.update({
        photo: recipientUserPhoto
      }).catch(this.handlePromiseError);
    }
    return Promise.resolve();
  }
}
