
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import {  NavController, NavParams, ToastController, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './../../providers/auth/auth.service';
import { UserService } from './../../providers/user/user.service';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  signupForm: FormGroup;

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public loadindController: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private toast: ToastController,
    public userService: UserService
  ) {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  ionViewDidLoad() {
  }
  onSubmit(): void {

    let loading: Loading = this.showLoading();
    let formUser = this.signupForm.value;
    let username = formUser.username;


    this.userService.userExists(username).first().subscribe((user: boolean) => {
      if(!user){
        this.authService.createAuthUser({
          email: formUser.email,
          password: formUser.password
        }).then((authState: any) => {
          delete formUser.password;
          formUser.uid = authState.user.uid;
          this.userService.createUser(this.signupForm.value,formUser.uid)
            .then(() => {
              this.toast.create({ message: 'Usuário Adicionado sucesso.', duration: 3000, position: "top" }).present();
              this.navCtrl.setRoot(HomePage);
              loading.dismiss();
            }).catch((error: any) => {
              loading.dismiss();
              this.showAlert(error);
            });
        }).catch((error: any) => {
          loading.dismiss();
          this.showAlert(error);
        });

      } else {
        this.showAlert(`O username ${username} já está sendo usado!`);
        loading.dismiss();
      }
    })



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
