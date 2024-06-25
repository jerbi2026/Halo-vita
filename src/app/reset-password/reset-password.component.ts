import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  email="";
  message="";
  isLoading = false;

  constructor(private afAuth:AngularFireAuth, private Router : Router) { }

  resetPassword() {
    this.isLoading = true;
    this.afAuth.sendPasswordResetEmail(this.email)
      .then(() => {
        
        this.message = "Un e-mail de réinitialisation de mot de passe a été envoyé à votre adresse e-mail.";
      
      })
      .catch((error) => {
        console.error(error);
        this.message = "Une erreur s'est produite lors de l'envoi de l'e-mail de réinitialisation de mot de passe. Veuillez réessayer plus tard.";
      });
      let dialog = document.getElementById('dialog');
      this.isLoading = false;
      if(dialog){
            dialog.style.display = "block";
      }
  }

  close_dialog(){
    let dialog = document.getElementById('dialog');
    if(dialog){
      dialog.style.display = "none";
    }
    this.Router.navigate(['/login']);
  }

}
