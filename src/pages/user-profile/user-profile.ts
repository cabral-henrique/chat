import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { UserService } from '../../providers/user/user.service';
import { User } from '../../models/user.model';
import firebase from 'firebase/app';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  currentUser: User;
  canEdit: boolean = false;
  progress: number;
  private filePhoto: File;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public userService: UserService,
    public loadindController: LoadingController,
    private camera: Camera) {
  }

  ionViewCanEnter(): boolean {
    return this.authService.authenticated;
  }

  ionViewDidLoad() {
    this.userService.currentUser.valueChanges()
      .subscribe(user => this.currentUser = user);
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.filePhoto) {
      let loading = this.showLoading();
      let uploadTask = this.userService.uploadPhoto(this.filePhoto, this.currentUser.uid);

      uploadTask.percentageChanges().subscribe((percent: number) =>{
        this.progress = Math.round(percent);
      });

      uploadTask.then(s => {
        if (s.state === firebase.storage.TaskState.SUCCESS) {
          this.userService.getphoto(this.currentUser.uid).subscribe(userPhoto => {
            this.editUser(userPhoto);
            loading.dismiss();
          })
        }
      }).catch(error=>{
        loading.dismiss();
      });
    } else {
      this.editUser();
    }

  }

  onPhoto(event): void {
    this.filePhoto = event.target.files[0];
  }

  private editUser(photoUrl?: string): void {
    this.userService.edit({
      name: this.currentUser.name,
      username: this.currentUser.username,
      photo: photoUrl || this.currentUser.photo || ''
    }).then(() => {
      this.canEdit = false;
      this.filePhoto = undefined;
      this.progress = 0;
    });
  }

  async captureImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA
    }

    return await this.camera.getPicture(options)
  }

  private showLoading(): Loading {
    let loading: Loading = this.loadindController.create({
      content: "Aguarde um momento..."
    });
    loading.present();
    return loading;
  }

}
