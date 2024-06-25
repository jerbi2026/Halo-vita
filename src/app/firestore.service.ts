import { getAuth } from 'firebase/auth';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, from, Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore, private AuthService : AuthService) { }
  

  numero_agriculteur = '';
  login_agriculteur(number: string, code: string): Observable<any> {
    return this.firestore.collection('agriculteur', ref => ref
      .where('numero', '==', number)
      .where('code', '==', code))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  get_agriculteurs_per_docteur(): Observable<any[]> {
    return new Observable(observer => {
      this.AuthService.getUserUid().then(userId => {
       
        if (userId) {
          this.firestore.collection('agriculteur', ref => ref
            .where('userId', '==', userId))
            .snapshotChanges()
            .pipe(
              map(actions => actions.map(a => {
                const data = a.payload.doc.data() as any;
                const id = a.payload.doc.id;
                return { id, ...data };
              }))
            ).subscribe(data => {
              observer.next(data);
              observer.complete();
            }, error => {
              observer.error(error);
            });
        } else {
          observer.error('User ID not found');
        }
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  Add_agriculteur(collectionPath: string, data: any): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.doc(`${collectionPath}/${id}`).set(data);
  }

  Add_valeur(collectionPath: string, data: any): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.doc(`${collectionPath}/${id}`).set(data);
  }

  Add_reclamation(collectionPath: string, data: any): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.doc(`${collectionPath}/${id}`).set(data);
  }

  get_agriculteur_par_numero(number: string): Observable<any> {
    return this.firestore.collection('agriculteur', ref => ref
      .where('numero', '==', number))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }

  deleteAgriculteur(collectionPath: string, AgrId: string): Promise<void> {
    return this.firestore.doc(`${collectionPath}/${AgrId}`).delete();
  }

  updateAgriculteur(collectionPath: string, AgrId: string, data: any): Promise<void> {
    return this.firestore.doc(`${collectionPath}/${AgrId}`).update(data);
  }


  getValeursParAgriculteur(idAgriculteur: string): Observable<any[]> {
    return this.firestore.collection('Valeurs', ref => ref
      .where('id_agriculteur', '==', idAgriculteur)
      )  
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }



  getAgriculteurById(idAgriculteur: string): Observable<any[]> {
    return this.firestore.collection('agriculteur', ref => ref
      .where('Document ID', '==', idAgriculteur))
      .snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }


  getAgriculteursID(): Observable<string[]>{
    let agriculteurs = this.get_agriculteurs_per_docteur();
    return agriculteurs.pipe(map(actions => actions.map(a => a.id)));
    
  }

  getReclamationsByAgriculteursIds(): Observable<any[]> {
    return this.getAgriculteursID().pipe(
      switchMap(agriculteurIds => {
        if (agriculteurIds.length === 0) {
          return of([]); 
        }
        
  
        const reclamationsObservables = agriculteurIds.map(id =>
          this.firestore.collection('reclamation', ref => ref.where('id_agriculteur', '==', id)).snapshotChanges().pipe(
            map(actions => actions.map(a => a.payload.doc.data() as any)) 
          )
        );
  
        return combineLatest(reclamationsObservables).pipe(
          map(reclamationsArrays => reclamationsArrays.flat()) 
        );
      }),
      catchError(error => {
        console.error(error);
        return of([]); 
      })
    );
  }
  
  
  
}
