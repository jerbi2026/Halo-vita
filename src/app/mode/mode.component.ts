import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mode',
  templateUrl: './mode.component.html',
  styleUrls: ['./mode.component.css']
})
export class ModeComponent {
  role ='';
  constructor(private router : Router){}

  mode(){
    if(this.role=='1'){
      this.router.navigate(['/login']);
    }
    else if(this.role=='2'){
      this.router.navigate(['/login_agriculteur']);
    }
    else{
      alert('veuillez choisir un role');
    }

  }

}
