import { Component, Input } from '@angular/core';
import { BaseComponent } from '../base.component';
import { AuthService } from '../../providers/auth/auth.service';
import {  AlertController, App, MenuController } from 'ionic-angular';
import { User } from '../../models/user.model';
import { UserProfilePage } from '../../pages/user-profile/user-profile';

@Component({
  selector: 'user-menu',
  templateUrl: 'user-menu.html'
})
export class UserMenuComponent extends BaseComponent {

  @Input('user') currentUser: User

  constructor(
    public alertCtrl: AlertController,
    public authSrv: AuthService,
    public app: App,
    public menuCtrl: MenuController
  ) {
    super( 
      alertCtrl,
      authSrv,
      app,
      menuCtrl);
    
  }

  onProfile(): void {
    this.navCtrl.push(UserProfilePage);
  }

}
