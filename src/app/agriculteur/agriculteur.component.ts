import { RobotService } from './../robot.service';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import {  ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import firebase from 'firebase/compat/app';


declare var window: any;

@Component({
  selector: 'app-agriculteur',
  templateUrl: './agriculteur.component.html',
  styleUrls: ['./agriculteur.component.css']
})
export class AgriculteurComponent implements OnInit{
  user: firebase.User | null = null;
  message='';
  isLoading = false;
  valeurs : any = [];
  agriculteur : any =[]
  valeursGroupedByDate: any = {};
  valeursGroupedByZone: any = {};
  analyse = '';
  constructor(private FirestoreService : FirestoreService, private AuthService : AuthService, private router : Router, private route: ActivatedRoute,private datePipe: DatePipe,private RobotService : RobotService) { }
  async ngOnInit(): Promise<void> {
    const localToken = localStorage.getItem('token');
    const firebaseToken = await this.AuthService.getCurrentUserToken();
    if (!localToken || (localToken !== firebaseToken) ) {
      this.router.navigate(['/login']);
    }
    else{
      this.route.params.subscribe(
        (params)=>{
          const encodedid = params['id_agriculteur'];
          if(encodedid==''){
            this.router.navigate(['/login']);
           
          }
          else{
            this.getValeursByAgriculteur(encodedid);
            this.get_agriculteur_by_id();
          }
         
        }
      )

    }

    
  }

  Signout(){
    this.AuthService.signOut();
    localStorage.removeItem('token')
    this.router.navigate(['/login']);
  }
  getDates(): string[] {
    return Object.keys(this.valeursGroupedByDate);
  }

  getValeursByAgriculteur(idAgriculteur: string) {
    this.isLoading = true;
    this.FirestoreService.getValeursParAgriculteur(idAgriculteur).subscribe(
      (data) => {
        const valeurs = data.map(item => {
          if (item.time && item.time.seconds) {
            item.time = new Date(item.time.seconds * 1000);
          }
          return item;
        });
        this.valeurs = valeurs;
       
  
        const groupedByDate = valeurs.reduce((acc, curr) => {
          const dateKey = this.datePipe.transform(curr.time, 'yyyy-MM-dd');
          if (dateKey) {
            if (!acc[dateKey]) {
              acc[dateKey] = [];
            }
            acc[dateKey].push(curr);
          }
          return acc;
        }, {});
  
        this.valeursGroupedByDate = {};
        Object.keys(groupedByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).forEach(key => {
          this.valeursGroupedByDate[key] = groupedByDate[key].sort((a: { time: number; }, b: { time: number; }) => b.time - a.time);
        });
  
        const groupedByZone = valeurs.reduce((acc, curr) => {
          const zoneKey = curr.zone;
          if (!acc[zoneKey]) {
            acc[zoneKey] = [];
          }
          acc[zoneKey].push(curr);
          return acc;
        }, {});
  
        this.valeursGroupedByZone = {};
        Object.keys(groupedByZone).sort().forEach(key => {
          this.valeursGroupedByZone[key] = groupedByZone[key].sort((a: { time: number; }, b: { time: number; }) => b.time - a.time);
        });
  
        this.isLoading = false;
      }
    );
  }


  get_agriculteur_by_id(){
    this.isLoading = true;
   let numero_agriculteur = this.FirestoreService.numero_agriculteur
  this.FirestoreService.get_agriculteur_par_numero(numero_agriculteur).subscribe(
      (data)=>{
        if (data) {
          this.agriculteur = data;
        }
        
        this.isLoading = false;
      }
    )
  
  }
  formatDate(date: Date): string | null {
    return this.datePipe.transform(date, 'medium');
  }
  close_dialog(){
    let dialog = document.getElementById('dialog');
    if(dialog){
      dialog.style.display = "none";
    }
  }

  openPopup(long : string , lat : string) {
    let url = 'https://www.latlong.net/c/?lat='+long+'&long='+lat;
    window.open(url, 'popup', 'width=600,height=600,scrollbars=yes,resizable=yes');
  }
  getZones(): string[] {
    return Object.keys(this.valeursGroupedByZone);
  }

 

  openModal() {
    this.isLoading = true
    const jsonString = JSON.stringify(this.valeurs, null, 2);
    let prompt = 'je veux une analyse bien détaillé sur une terre d agriculture ainsi que les valeurs qui se trouvent dans le document suivant sont les valeurs de salinité de la zone de la terre (s il vous plait au lieu de mettre une suite de * dans la reponse fait un retour a la ligne).\n voici les données de la terre\n '+jsonString;
    this.RobotService.get_response(prompt).then(
      (data)=>{
        this.isLoading= false;
        this.analyse = data;
        this.analyse = this.analyse.replace(/\*/g, '\n👨🏻‍🌾');
        const modal = new window.bootstrap.Modal(document.getElementById('myModal'));
        modal.show();
      },
      (error)=>{
        this.message = 'erreur lors de la generation de la reponse'
        let dialog = document.getElementById('dialog')
        if(dialog){
          dialog.style.display = "block";
        
        }
        this.isLoading = false;
        
      }
    )
   
  }


 



}
