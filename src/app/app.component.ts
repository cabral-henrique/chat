import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { AuthService } from '../providers/auth/auth.service';
import { SigninPage } from './../pages/signin/signin';
import { User } from '../models/user.model';
import { UserService } from '../providers/user/user.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = SigninPage;
  currentUser: User;

  constructor(
    authService: AuthService, 
    platform: Platform,
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    userService: UserService) {
      authService.auth.authState.subscribe((auth: any)=>{
        if(auth){
         userService.currentUser.valueChanges()
          .subscribe(user =>{
            this.currentUser= user;
          });
        }
      });

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

