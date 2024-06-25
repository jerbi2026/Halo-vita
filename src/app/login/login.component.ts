import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  email="";
  password="";
  message="";

  isLoading = false;
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
  ngOnInit(): void {
  }

  signIn() {
    this.isLoading = true;
    this.authService.signIn(this.email, this.password)
      .then((res:any) => {
        const user = res.user._delegate;
        localStorage.setItem('token', user.accessToken);
        localStorage.setItem('displayName', user.email);
        
        
        this.router.navigate(['/docteur']);
        this.isLoading = false;
      })
      .catch(err => {

        this.message = 'Erreur lors de la connexion : '+ err;
        let dialog = document.getElementById('dialog');
        this.isLoading = false;
        if(dialog){
            dialog.style.display = "block";
        }
        
       
      });
      
      
  }



  close_dialog(){
    let dialog = document.getElementById('dialog');
    if(dialog){
      dialog.style.display = "none";
    }
    this.router.navigate(['/login']);
  }

  


}
