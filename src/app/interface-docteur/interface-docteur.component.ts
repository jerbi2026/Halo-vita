import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-interface-docteur',
  templateUrl: './interface-docteur.component.html',
  styleUrls: ['./interface-docteur.component.css']
})
export class InterfaceDocteurComponent implements OnInit{
  user: firebase.User | null = null;
  agriculteur : any;
  isLoading = false;
  numero='';
  agriculteurs : any[]=[];
  message='';

  agriculteur_id ='';
  agriculteur_add={
    nom:'',
    prenom:'',
    numero:'',
    code:'',
    region:'',
    superficie:0,
    userId:'',
    nb_zone:0
  }
  constructor(private FirestoreService : FirestoreService, private AuthService : AuthService, private router : Router) { }
  async ngOnInit(): Promise<void> {
    const localToken = localStorage.getItem('token');
    const firebaseToken = await this.AuthService.getCurrentUserToken();
    if (!localToken || (localToken !== firebaseToken) ) {
      this.router.navigate(['/login']);
    }
    else{
      this.get_agriculteurs();
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




  search_agriculteur(){
    this.isLoading = true;
    this.FirestoreService.get_agriculteur_par_numero(this.numero).subscribe(
      (data)=>{
        if(data.length>0){
          this.agriculteurs = data;
          this.isLoading = false;
        } 
        else{
          this.message='Aucun agriculteur trouvé';
          this.isLoading = false;
          this.open_dialog()
          this.get_agriculteurs();
          

        }
        
      },
      (error)=>{
        this.message=error;
        this.isLoading = false;
        this.open_dialog()
        
      }
    )
    
    
    

  }


  get_agriculteurs(){
    this.isLoading = true;
    this.FirestoreService.get_agriculteurs_per_docteur().subscribe(
      (data)=>{
        this.agriculteurs = data;
        this.isLoading = false;
      },
      (error)=>{
        this.message=error;
        this.open_dialog()
        this.isLoading = false;
      }
    )

  }

  ajouter_agriculteur(){
   if(this.agriculteur_add.nom!='' && this.agriculteur_add.prenom!='' &&   this.agriculteur_add.numero!='' && this.agriculteur_add.code!='' && this.agriculteur_add.superficie!=0 && this.agriculteur_add.nb_zone!=0 && this.agriculteur_add.region!=''){
    this.isLoading = true;
    this.AuthService.getUserUid().then(userId => {
      if(userId){
        this.agriculteur_add.userId = userId;
        this.FirestoreService.Add_agriculteur('agriculteur', this.agriculteur_add).then(
          ()=>{
            this.isLoading = false;
            this.message='Agriculteur ajouté avec succès';
            this.open_dialog();
           
            this.get_agriculteurs();
            this.agriculteur_add={
              nom:'',
              prenom:'',
              numero:'',
              code:'',
              region:'',
              superficie:0,
              userId:'',
              nb_zone:0
            }
          }
        ).catch(
          (error)=>{
            this.message=error;
            this.open_dialog()
            this.isLoading = false;
            this.agriculteur_add={
              nom:'',
              prenom:'',
              numero:'',
              code:'',
              region:'',
              superficie:0,
              userId:'',
              nb_zone:0
            }
          }
        )
      }
    }).catch(error => {
      this.message=error;
      this.open_dialog()
      this.isLoading = false;
      this.agriculteur_add={
        nom:'',
        prenom:'',
        numero:'',
        code:'',
        region:'',
        superficie:0,
        userId:'',
        nb_zone:0
      }
    });
    

   }
   else{
    this.message='Veuillez remplir tous les champs';
    this.open_dialog()
    this.isLoading = false;
   }
    
  
  }

  close_dialog(){
    let dialog = document.getElementById('dialog');
    if(dialog){
      dialog.style.display = "none";
    }
  }


  delete_agriculteur(agriculteur_id:string){
    this.isLoading = true;
    this.FirestoreService.deleteAgriculteur('agriculteur',agriculteur_id).then(
      ()=>{
        this.isLoading = false;
        this.message='Agriculteur supprimé avec succès';
        this.open_dialog();
        this.get_agriculteurs();
      }
    ).catch(
      (error)=>{
        this.message=error;
        this.open_dialog()
        this.isLoading = false;
      }
    )
  }

  preparer_agriculteur(item : any){
    this.agriculteur_add = item;
    this.agriculteur_id=item.id;
   

  }

  vider(){
    this.agriculteur_add={
      nom:'',
      prenom:'',
      numero:'',
      code:'',
      region:'',
      superficie:0,
      userId:'',
      nb_zone:0
    }
  }

  update_agriculteur(){
    if(this.agriculteur_add.nom!='' && this.agriculteur_add.prenom!='' &&   this.agriculteur_add.numero!='' && this.agriculteur_add.code!='' && this.agriculteur_add.superficie!=0 && this.agriculteur_add.nb_zone!=0 && this.agriculteur_add.region!=''){
      this.isLoading = true;
      
      this.FirestoreService.updateAgriculteur('agriculteur',this.agriculteur_id,this.agriculteur_add).then(
        ()=>{
          this.isLoading = false;
          this.message='Agriculteur modifié avec succès';
          this.open_dialog();
          this.get_agriculteurs();
          this.agriculteur_add={
            nom:'',
            prenom:'',
            numero:'',
            code:'',
            region:'',
            superficie:0,
            userId:'',
            nb_zone:0
          }
          this.agriculteur_id='';
        }
      ).catch(
        (error)=>{
          this.message=error;
          this.open_dialog()
          this.isLoading = false;
          this.agriculteur_add={
            nom:'',
            prenom:'',
            numero:'',
            code:'',
            region:'',
            superficie:0,
            userId:'',
            nb_zone:0
          }
          this.agriculteur_id=''
        }
      )
    }
    else{
      this.message='Veuillez remplir tous les champs';
      this.open_dialog()
      this.isLoading = false;
  }
  }

  view_agriculteur(agriculteur : any){
    this.FirestoreService.numero_agriculteur = agriculteur.numero;
    this.router.navigate(['/agriculteur/'+agriculteur.id]);
  }

  signout(){
    this.AuthService.signOut();
    this.router.navigate(['/login']);
  }
}