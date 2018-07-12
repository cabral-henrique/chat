import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Message } from './../../models/message.model';
import { BaseService } from '../base/base.service';
import { Observable } from '../../../node_modules/rxjs';

@Injectable()
export class MessageService extends BaseService {

  constructor(public http: HttpClient,
              public db: AngularFireDatabase) {
    super();
  }

  create( chatRom: string,message : Message): any {
    return this.db.list(`/messages/${chatRom}`).push(message);
  }
  getMessages(uid: string,uidOther:string): Observable<Message[]> {
    return <Observable<Message[]>> this.db.list(`/messages/${uid}-${uidOther}`,
    ref => 
        ref.orderByChild("timestamp").limitToLast(30)).valueChanges();
  }

}
