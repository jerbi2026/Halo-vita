import { Router } from '@angular/router';
import { FirestoreService } from './../firestore.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login-agriculteur',
  templateUrl: './login-agriculteur.component.html',
  styleUrls: ['./login-agriculteur.component.css']
})
export class LoginAgriculteurComponent {
  message='';
  numero ='';
  code = '';
  isLoading = false;
  constructor(private FirestoreService : FirestoreService, private Router : Router) { }


  open_dialog(){
    let dialog = document.getElementById('dialog');
    if(dialog){
      dialog.style.display = "block";
    }
  }


  connect(){
    this.isLoading = true;
    this.FirestoreService.login_agriculteur(this.numero, this.code).subscribe(
      (data)=>{
        if(data.length>0){
          this.message = 'Connexion réussie';
          localStorage.setItem('agriculteur',data[0].numero);
          this.isLoading = false;
          this.Router.navigate(['/espace_agriculteur'])
        }
        else{
          this.message = 'حدث خطأ أثناء الاتصال: تحقق من رقمك ورمز';
          this.open_dialog()
          this.isLoading = false;
        }
      
      },
      (error)=>{
        this.message = 'Erreur lors de la connexion : '+ error;
        this.open_dialog()
        this.isLoading = false;
      }
    )
    
  
  }

  close_dialog(){
    let dialog = document.getElementById('dialog');
    if(dialog){
      dialog.style.display = "none";
    }
  }
}
