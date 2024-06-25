import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { Observable, first, map } from 'rxjs';
import firebase from 'firebase/compat/app';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
   user$!: Observable<firebase.User | null >;

  constructor(private afAuth:AngularFireAuth, private router : Router) {
   this.user$ = this.afAuth.authState;
   }

  signUp(email: string, password: string) {
   return this.afAuth.createUserWithEmailAndPassword(email, password);
 }

 signIn(email: string, password: string) {
   return this.afAuth.signInWithEmailAndPassword(email, password);
 }

 signOut() {
   localStorage.removeItem('token');
   localStorage.removeItem('displayName');
   this.afAuth.signOut();
 }

 isLoggedIn(): boolean {
   return !!localStorage.getItem('token');
 }

 async getCurrentUserToken(): Promise<String | null> {
   const user = await this.afAuth.currentUser;
   if (user) {
     const idToken = await user.getIdToken();
     return idToken;
   }
   return null;
 }
 getUser() {

   return this.user$;
 }
 
 async getUserUid(): Promise<string | null> {
  const user = await this.user$.pipe(first()).toPromise();
  return user ? user.uid : null;
}
 
}
