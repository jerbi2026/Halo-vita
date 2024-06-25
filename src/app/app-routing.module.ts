import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ModeComponent } from './mode/mode.component';
import { LoginAgriculteurComponent } from './login-agriculteur/login-agriculteur.component';
import { InterfaceDocteurComponent } from './interface-docteur/interface-docteur.component';
import { AgriculteurComponent } from './agriculteur/agriculteur.component';
import { InterfaceAgriculteurComponent } from './interface-agriculteur/interface-agriculteur.component';
import { ForgetAccountComponent } from './forget-account/forget-account.component';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { PrivacyComponent } from './privacy/privacy.component';

const routes: Routes = [
  { path: '', redirectTo: '/mode', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'login_agriculteur', component: LoginAgriculteurComponent },
  { path: 'sign_up', component: SignUpComponent },
  { path: 'forget_password', component: ResetPasswordComponent },
  { path: 'mode', component: ModeComponent },
  { path: 'agriculteur/:id_agriculteur', component: AgriculteurComponent },
  { path: 'docteur', component: InterfaceDocteurComponent },
  { path: 'espace_agriculteur', component: InterfaceAgriculteurComponent },
  { path: 'forget_account', component: ForgetAccountComponent },
  { path: 'reclamations', component: ReclamationComponent },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/notfound' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
