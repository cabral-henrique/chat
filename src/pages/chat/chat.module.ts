import { CustomLoggedHeaderComponent } from './../../components/custom-logged-header/custom-logged-header';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';

@NgModule({
  declarations: [
    ChatPage,
    CustomLoggedHeaderComponent
  ],
  imports: [
    IonicPageModule.forChild(ChatPage),
  ],
})
export class ChatPageModule {}
