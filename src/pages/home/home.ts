import { NavController, MenuController } from 'ionic-angular';
import 'rxjs/add/operator/first';

import { AuthService } from './../../providers/auth/auth.service';
import { Chat } from './../../models/chat.model';
import { ChatService } from './../../providers/chat/chat.service';
import { ChatPage } from './../chat/chat';
import { Component } from '@angular/core';
import { database } from 'firebase';
import { SignupPage } from '../signup/signup';
import { Observable } from '../../../node_modules/rxjs';
import { UserService } from './../../providers/user/user.service';
import { User } from './../../models/user.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  users: User[];
  view: string = "Contatinhos";
  chats: Observable<Chat[]>;
  chat: Chat;
  constructor(public navCtrl: NavController,
    private userService: UserService,
    public authService: AuthService,
    public chatSrv: ChatService,
    public menuController: MenuController) {

  }
  ionViewDidLoad() {
    this.populateChatUser();
    this.menuController.enable(true,'user-menu');
  }

  ionViewCanEnter(): boolean {
    return this.authService.authenticated;
  }


  filterItems(event: any): void {
    let searchTerm: string = event.target.value;
    this.populateChatUser();
    if (searchTerm) {
      switch (this.view) {
        case "Chats":
          this.chatSrv.chats.first().subscribe((item) => {  
            return  this.chats = item.filter((chat: Chat) => {
              return (chat.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
            }); 
          });
          break;
        case "Users":
        this.userService.users.first().subscribe((item) => {  
          return  this.users = item.filter((user: User) => {
            return (user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
          }); 
        });
          break;
      }
    }
  }
  onSignup(): void {
    this.navCtrl.push(SignupPage);
  }
  onChatCreate(user: User) {
    this.userService.currentUser.valueChanges().first().subscribe(currentUser => {
      this.chatSrv.getDeepChat(currentUser.uid, user.uid)
      .valueChanges()
      .first().subscribe((chat: Chat) => {
        if (chat === null) {
          let timestamp = database.ServerValue.TIMESTAMP;
          let chatNew = new Chat("", timestamp, user.name, "");
          this.chatSrv.create(chatNew, currentUser.uid, user.uid);
          let chatNewOther = new Chat("", timestamp, currentUser.name, "");
          this.chatSrv.create(chatNewOther, user.uid, currentUser.uid);
        }
      });
    });

    
    this.navCtrl.push(ChatPage, {
      recipientUser: user
    });
  }
  onChatOpen(chat: Chat): void {
    this.userService.get(chat.uid)
      .first()
      .subscribe((user: User) => {
        this.navCtrl.push(ChatPage, {
          recipientUser: user
        });
      });
  }

  private populateChatUser(): void {
    this.chatSrv.chats.subscribe((item) => {
      this.chats = item;
    });
    this.userService.users.subscribe((user: User[]) => {
      this.users = user;
    });
  }
}
