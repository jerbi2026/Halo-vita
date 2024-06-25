import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environment/environment';
import { ModeComponent } from './mode/mode.component';
import { LoginComponent } from './login/login.component';
import { LoginAgriculteurComponent } from './login-agriculteur/login-agriculteur.component';
import { FormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HttpClientModule } from '@angular/common/http';
import { InterfaceDocteurComponent } from './interface-docteur/interface-docteur.component';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AgriculteurComponent } from './agriculteur/agriculteur.component';
import { DatePipe } from '@angular/common';
import { InterfaceAgriculteurComponent } from './interface-agriculteur/interface-agriculteur.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ForgetAccountComponent } from './forget-account/forget-account.component';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { OfflineComponent } from './offline/offline.component';
import { PrivacyComponent } from './privacy/privacy.component';

@NgModule({
  declarations: [
    AppComponent,
    ModeComponent,
    LoginComponent,
    LoginAgriculteurComponent,
    ResetPasswordComponent,
    SignUpComponent,
    InterfaceDocteurComponent,
    AgriculteurComponent,
    InterfaceAgriculteurComponent,
    ForgetAccountComponent,
    ReclamationComponent,
    NotfoundComponent,
    OfflineComponent,
    PrivacyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    HttpClientModule,
    AngularFirestoreModule,
    NgxPaginationModule
    
    
   
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
