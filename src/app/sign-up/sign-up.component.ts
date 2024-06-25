import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  email="";
  password="";
  rep_password="";
  message="";
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}


  signUp() {
    if(this.rep_password==this.password && this.password.length>6 ){
      this.isLoading = true;
      this.authService.signUp(this.email, this.password)
          .then((res:any) => {
            this.isLoading = false;
            this.router.navigate(['/login']);
          })
          .catch(err => {
            
              this.message = 'Erreur lors de la connexion : '+ err;
          });
      
      

    }
    else{
      
      this.message = 'Erreur lors de la connexion : Les mots de passe ne sont pas identiques ou le mot de passe est inférieur à 6 caractères';
    }
    
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
    this.router.navigate(['/login']);
  }


}
