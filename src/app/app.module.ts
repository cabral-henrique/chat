
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireDatabaseModule } from 'angularfire2/database';
import { ChatPage } from './../pages/chat/chat';
import { CustomLoggedHeaderComponent } from './../components/custom-logged-header/custom-logged-header';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SignupPage } from '../pages/signup/signup';
import { SigninPage } from './../pages/signin/signin';
import { AuthService } from './../providers/auth/auth.service';
import { UserService } from './../providers/user/user.service';
import { ChatService } from '../providers/chat/chat.service';
import { MessageService } from '../providers/message/message';
import { MessageBoxComponent } from '../components/message-box/message-box';
import { UserInfoComponent } from '../components/user-info/user-info';
import { UserMenuComponent } from '../components/user-menu/user-menu';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { AngularFireStorageModule } from '../../node_modules/angularfire2/storage';
import { Camera } from '../../node_modules/@ionic-native/camera';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';


const firebaseAppConfig = {
  apiKey: "AIzaSyA9zvibu8hLhTv9eSBBzr7HQOXK2oKx824",
  authDomain: "ionic-firebase-chat-4eab7.firebaseapp.com",
  databaseURL: "https://ionic-firebase-chat-4eab7.firebaseio.com",
  projectId: "ionic-firebase-chat-4eab7",
  storageBucket: "ionic-firebase-chat-4eab7.appspot.com",
  messagingSenderId: "115497531399"
};


@NgModule({
  declarations: [
    ChatPage,
    CustomLoggedHeaderComponent,
    HomePage,
    MyApp,
    MessageBoxComponent,
    ProgressBarComponent,
    SignupPage,
    SigninPage,
    UserInfoComponent,
    UserProfilePage,
    UserMenuComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    CommonModule,
    AngularFireStorageModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseAppConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ChatPage,
    CustomLoggedHeaderComponent,
    MyApp,
    HomePage,
    SignupPage,
    SigninPage,
    UserProfilePage
  ],
  providers: [
    AuthService,
    StatusBar,
    SplashScreen,
    UserService,
    AngularFireDatabase,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ChatService,
    MessageService,
  ]
})
export class AppModule {}
