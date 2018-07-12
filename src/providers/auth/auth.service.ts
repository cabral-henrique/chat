import { UserService } from './../user/user.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { BaseService } from '../base/base.service';

@Injectable()
export class AuthService extends BaseService {

  authState: any = null;
  constructor(
    public http: HttpClient,
    public auth: AngularFireAuth,
    public userSrv: UserService) {
    super();
    this.auth.authState.subscribe((auth) => {
      this.authState = auth
      if (this.authState !== null) {
        this.userSrv.setUsers(auth.uid);
        this.userSrv.setCurrentUser(auth.uid);
      }
    });
  }
  get authenticated(): boolean {
    return this.authState !== null;
  }

  createAuthUser(user: { email: string, password: string }): Promise<AngularFireAuth> {
    return this.auth.auth.createUserWithEmailAndPassword(user.email, user.password).catch(this.handlePromiseError);
  }

  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }
  get currentUserObservable(): any {
    return this.auth.authState;
  }
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false
  }


  get currentUserDisplayName(): string {
    if (!this.authState) { return 'Guest' }
    else if (this.currentUserAnonymous) { return 'Anonymous' }
    else { return this.authState['displayName'] || 'User without a Name' }
  }

  signinWithEmail(user: { email: string, password: string }): Promise<boolean> {
    return this.auth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then((authS: AngularFireAuth) => {
        this.authState = authS
        return authS != null;
      }).catch(this.handlePromiseError);
  }

  logout(): Promise<any> {
    return this.auth.auth.signOut();
  }


}
