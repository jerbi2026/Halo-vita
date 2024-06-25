import { RobotService } from './../robot.service';
import { Router } from '@angular/router';
import { FirestoreService } from './../firestore.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
declare var bootstrap: any;
declare var webkitSpeechRecognition : any;
@Component({
  selector: 'app-interface-agriculteur',
  templateUrl: './interface-agriculteur.component.html',
  styleUrls: ['./interface-agriculteur.component.css']
})
export class InterfaceAgriculteurComponent implements OnInit{
  message='';
  isLoading = false;
  valeurs : any = [];
  valeursGroupedByDate: any = {};
  valeursGroupedByZone: any = {};
  zones: number[] = [];
  agriculteur : any;

  nv_reclamation ={
    id_agriculteur:'',
    agriculteur : '',
    time : new Date(),
    titre : '',
    description : ''
  }

  nv_valeur = {
    zone: '',
    latitude: '',
    longitude :'',
    time: new Date(),
    id_agriculteur: '',
    valeur : 20.5
  }
  latitude= ''
  longitude =''
  valeur = "20.5";
  recognizedText: string = '';
  p=1;

  language = 'fr-FR'
  constructor(private FirestoreService : FirestoreService,private router : Router , private datePipe: DatePipe,private ngZone: NgZone, private RobotService : RobotService){  }

  
  
  ngOnInit(): void {

    let numero_agriculteur = localStorage.getItem('agriculteur');
    if(numero_agriculteur){
      this.isLoading = true;
      this.FirestoreService.get_agriculteur_par_numero(numero_agriculteur).subscribe(
        (data)=>{
          if(data.length>0){
            this.agriculteur = data[0];
            this.getValeursByAgriculteur(this.agriculteur.id)
            this.generateZones();
           
            this.isLoading = false
          }
          else{
            this.isLoading = false
            this.router.navigate(['/login_agriculteur']);
          }
        }
      )
    }
    else{
      this.isLoading = false
      this.router.navigate(['/login_agriculteur']);
    }

    
  }





  confirmValue() {
    this.isLoading = true;
    this.nv_valeur.id_agriculteur = this.agriculteur.id;
    this.nv_valeur.time = new Date();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        
        this.nv_valeur.latitude = latitude.toString();
        this.nv_valeur.longitude = longitude.toString();
        

        this.FirestoreService.Add_valeur('Valeurs', this.nv_valeur).then(() => {
          this.isLoading = false;
          this.message = 'تم حفظ القيمة بنجاح';
          this.closeModal();

          var dialog = document.getElementById('dialog');
          if (dialog && this.message != '') {
            dialog.style.display = "block";
          }
        });
      }, (error) => {
        console.log("Geolocation error: ", error);
        this.isLoading = false;
        this.message = 'Erreur de géolocalisation';
        this.closeModal();
      });
    } else {
      console.log("No support for geolocation");
      this.isLoading = false;
      this.message = 'Géolocalisation non supportée';
      this.closeModal();
    }
  }

  closeModal() {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
    }
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

  openPopup(lat : string,long : string  ) {
    let url = 'https://www.latlong.net/c/?lat='+lat+'&long='+long;
    window.open(url, 'popup', 'width=600,height=600,scrollbars=yes,resizable=yes');
  }
  getZones(): string[] {
    return Object.keys(this.valeursGroupedByZone);
  }

  generateZones() {
    this.zones = Array.from({ length: this.agriculteur.nb_zone }, (_, i) => i + 1);

  }


  ajouter_reclamation(){
    this.isLoading = true;
    this.nv_reclamation.id_agriculteur = this.agriculteur.id;
    this.nv_reclamation.agriculteur = this.agriculteur.nom+' '+this.agriculteur.prenom;
    this.nv_reclamation.time = new Date();
    this.FirestoreService.Add_reclamation('reclamation', this.nv_reclamation).then(() => {
      this.isLoading = false;
      this.message = 'تم إرسال الشكوى بنجاح';

      var dialog = document.getElementById('dialog');
      if (dialog && this.message != '') {
        dialog.style.display = "block";
      }
      this. nv_reclamation ={
        id_agriculteur:'',
        agriculteur : '',
        time : new Date(),
        titre : '',
        description : ''
      }
    });

  }
  isListening: boolean = false;

  ai_response = '';
  startListening() {
    if ('webkitSpeechRecognition' in window) {
      const vSearch = new (window as any).webkitSpeechRecognition();
      vSearch.continuous = false;
      vSearch.interimResults = false;
      vSearch.lang = this.language;
      vSearch.start();
      this.recognizedText = '';
      this.isListening = true;

      vSearch.onresult = (e: any) => {
        this.ngZone.run(async () => {
          this.recognizedText = e.results[0][0].transcript;
          vSearch.stop();
          this.isListening = false;
          this.isLoading = true
          let prompt = this.recognizedText + '\n si vous pouvez generer la reponse en la meme langage que de prompt (par exemple si le prompt est en chinois vous repondez en chinois ou bien si en arabe la reponse est en arabe et la meme logique avec les autres langues) ainsi je veux une reponse explicatif meme si la question est courte'
         
          this.ai_response= await this.RobotService.get_response(prompt);
          this.ai_response = this.ai_response.replace(/\*/g, '');
          
          this.isLoading = false
          this.speak()
          
        });
      };

      vSearch.onerror = (e: any) => {
        this.ngZone.run(() => {
          console.error('Speech recognition error:', e.error);
          alert('Speech recognition error occurred. Please try again.');
          this.isListening = false;
        });
      };

      vSearch.onend = () => {
        this.ngZone.run(() => {
          this.isListening = false;
          console.log('Speech recognition ended.');
        });
      };
    } else {
      alert('Your browser does not support voice recognition!');
    }
    
  }

  
  synth = window.speechSynthesis;
  speak() {
    const utterThis = new SpeechSynthesisUtterance(this.ai_response);
    utterThis.lang ='en-US';
    utterThis.rate = 1.2;
    utterThis.pitch = 0.8;
    this.synth.speak(utterThis);
  }

  stop() {
    this.recognizedText=''
    this.synth.cancel();
  }

  signout(){
    localStorage.removeItem('agriculteur');
    this.router.navigate(['/login_agriculteur']);
  }

  

  
 

  
  

}
