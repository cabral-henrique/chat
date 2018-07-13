import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SignupPage } from '../signup/signup';
import { AuthService } from '../../providers/auth/auth.service';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  signinForm: FormGroup;

  constructor(
    private authService: AuthService,
    public alertController: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadindController: LoadingController,
    public formBuilder: FormBuilder) {
      let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      this.signinForm = this.formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
        password: ['', [Validators.required, Validators.minLength(6)]],
      })
  }

  ionViewDidLoad() {
  }
  onSubmit(): void {
   let loading = this.showLoading();
    this.authService.signinWithEmail(this.signinForm.value)
    .then((isLogged: boolean) => {
      loading.dismiss();
      if(isLogged) {
        this.navCtrl.setRoot(HomePage);
      }
    }).catch((error: any) =>{
      loading.dismiss();
      this.showAlert(error);
    });
  }
  onSignup():void {
    this.navCtrl.push(SignupPage);
  }
  private showLoading(): Loading {
    let loading: Loading = this.loadindController.create({
      content: "Aguarde um momento..."
    });
    loading.present();
    return loading;
  }

  private showAlert(message: string): void {
    this.alertController.create({
      message: message,
      buttons: ['Ok']
    }).present();
  }

}
