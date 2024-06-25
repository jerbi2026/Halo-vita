import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from './../firestore.service';

@Component({
  selector: 'app-forget-account',
  templateUrl: './forget-account.component.html',
  styleUrls: ['./forget-account.component.css']
})
export class ForgetAccountComponent {

  message='';
  numero ='';
  isLoading = false;
  nv_reclamation ={
    id_agriculteur:'',
    agriculteur : '',
    time : new Date(),
    titre : '',
    description : ''
  }
  constructor(private FirestoreService : FirestoreService, private Router : Router) { }

  close_dialog(){
    let dialog = document.getElementById('dialog');
    if(dialog){
      dialog.style.display = "none";
      
    }
    this.Router.navigate(['/login_agriculteur'])
  }
  open_dialog(){
    let dialog = document.getElementById('dialog');
    if(dialog){
      dialog.style.display = "block";
    }
  }


  send_reclamation(){
    this.isLoading = true;
    this.FirestoreService.get_agriculteur_par_numero(this.numero).subscribe(
      (data)=>{
        if(data.length>0){
          this.nv_reclamation.id_agriculteur = data[0].id;
          this.nv_reclamation.agriculteur = this.numero;
          this.FirestoreService.Add_reclamation('reclamation',this.nv_reclamation).then(
            (data)=>{
              this.message = 'تم إرسال الشكوى بنجاح';
              this.isLoading = false;
              this.open_dialog();
            },
            (error)=>{
              this.message = 'Erreur lors de l\'envoi de la réclamation : '+ error;
              this.isLoading = false;
              this.open_dialog();
            }
          )
        }
        else{
          this.message = 'Erreur lors de l\'envoi de la réclamation : Aucun agriculteur trouvé avec ce numéro';
          this.isLoading = false;
          this.open_dialog();
        }

      },
      (error)=>{
        this.message = 'Erreur lors de l\'envoi de la réclamation : '+error;
        this.isLoading = false;
        this.open_dialog();
      }
    )
    
   
  }

}
