import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { DatePipe } from '@angular/common';
import { FirestoreService } from './../firestore.service';
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent implements OnInit{
  user: firebase.User | null = null;
  reclamations : any[]=[];
  message = '';
  isLoading = false;
  p=1;



  constructor(private FirestoreService : FirestoreService,private datePipe: DatePipe, private AuthService : AuthService, private router : Router){}
  async ngOnInit(): Promise<void> {
    const localToken = localStorage.getItem('token');
    const firebaseToken = await this.AuthService.getCurrentUserToken();
    if (!localToken || (localToken !== firebaseToken) ) {
      this.router.navigate(['/login']);
    }
    else{
      this.isLoading = true;
      this.FirestoreService.getReclamationsByAgriculteursIds().subscribe(
       (data)=>{
         this.reclamations = data;
         this.reclamations.map(item => {
           if (item.time && item.time.seconds) {
             item.time = new Date(item.time.seconds * 1000);
           }
         });
   
         this.reclamations.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
         console.log(this.reclamations)
   
         
         this.isLoading = false;
         
       },
       (error)=>{
         this.isLoading = false;
         this.message = 'Erreur de chargement des réclamations : '+error;
         this.open_dialog();
       }
      )

    }
   
    
  }
  Signout(){
    this.AuthService.signOut();
    localStorage.removeItem('token')
    this.router.navigate(['/login']);
  }

  open_dialog(){
    let dialog = document.getElementById('dialog');
    if(dialog){
      dialog.style.display = "block";
    }
  
  }
  close_dialog(){
    let dialog = document.getElementById('dialog');
    if(dialog){
      dialog.style.display = "none";
    }
  }

  formatDate(date: Date): string | null {
    return this.datePipe.transform(date, 'medium');
  }

  

}
