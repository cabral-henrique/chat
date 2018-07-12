
import { MessageService } from './../../providers/message/message';
import { Message } from './../../models/message.model';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';

import { AuthService } from './../../providers/auth/auth.service';
import { User } from '../../models/user.model';
import { UserService } from '../../providers/user/user.service';
import { database } from 'firebase';
import { Chat } from '../../models/chat.model';
import { ChatService } from '../../providers/chat/chat.service';
import { AngularFireObject } from '../../../node_modules/angularfire2/database';
import { Subscription } from '../../../node_modules/rxjs';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage implements OnDestroy {


  @ViewChild(Content) content: Content;
  messages: Message[];
  chat1: AngularFireObject<Chat>;
  chat2: AngularFireObject<Chat>;
  newMessage: string;
  view: string = "Chats";
  pageTitle: string;
  sender: User;
  recipent: User;
  chatRom: string;

  getMessageUnregistred: Subscription;


  constructor(
    public authSrv: AuthService,
    public chatSrv: ChatService,
    public navCtrl: NavController,
    public messageSrv: MessageService,
    public navParams: NavParams,
    public userSrv: UserService) {
  }

  ionViewCanEnter(): boolean {
    return this.authSrv.authenticated;
  }
  ionViewDidLoad() {
    this.recipent = this.navParams.get("recipientUser");
    this.pageTitle = this.recipent.name;
    this.userSrv.currentUser.valueChanges()
      .subscribe(user => {
        this.sender = user;

        this.chat1 = this.chatSrv.getDeepChat(user.uid, this.recipent.uid);
        this.chat2 = this.chatSrv.getDeepChat(this.recipent.uid, user.uid);

        if(this.recipent.photo){
        this.chat1.valueChanges()
          .first()  
          .subscribe((chat: Chat)=>{
            this.chatSrv.updatePhoto(this.chat1,chat.photo,this.recipent.photo);
        });
      }




        this.getMessageUnregistred = this.messageSrv.getMessages(user.uid, this.recipent.uid)
          .subscribe((message: Message[]) => {
            if (message.length === 0) {
              this.chatRom = `${this.recipent.uid}-${user.uid}`;
              this.messageSrv.getMessages(this.recipent.uid, user.uid)
                .subscribe((message: Message[]) => {
                  this.messages = message
                  this.scrollToBottom();
                })
            } else {
              this.messages = message;
              this.chatRom = `${user.uid}-${this.recipent.uid}`;
              this.scrollToBottom();
            }
          });
      });
  }


  sendMessage(newMessage: string): void {
    if (newMessage) {
      let timestamp: object = database.ServerValue.TIMESTAMP;
      this.messageSrv.create(this.chatRom,
        new Message(
          this.sender.uid,
          newMessage,
          timestamp)).then(() => {
            this.chat1.update({
              lastMessage: newMessage,
              timestamp: timestamp
            });
            this.chat2.update({
              lastMessage: newMessage,
              timestamp: timestamp
            })

          });
    }
  }
  scrollToBottom(duration?: number): void {
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToBottom(duration || 300);
      }
    }, 50)

  }

  ngOnDestroy(): void {
    if (this.getMessageUnregistred)
      this.getMessageUnregistred.unsubscribe();
  }
}
