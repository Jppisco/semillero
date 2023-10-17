import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AngularFireModule } from '@angular/fire/compat'
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { CreateInstanciaComponent } from './components/create-instancia/create-instancia.component';
import { ListInstanciaComponent } from './components/list-instancia/list-instancia.component';
import { environment } from 'src/environments/environment.prod';
import { CreateUsuarioComponent } from './components/create-usuario/create-usuario.component';
import { ListUsuarioComponent } from './components/list-usuario/list-usuario.component';
import { RegistrarUsuarioComponent } from './components/register-user/registrar-usuario.component';
import { LoginComponent } from './components/login/login.component';
import { VerificarCorreoComponent } from './components/verificar-correo/verificar-correo.component';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';
import { CreateProgramaComponent } from './components/create-programa/create-programa.component';
import { ListProgramaComponent } from './components/list-programa/list-programa.component';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  declarations: [
    AppComponent,
    CreateInstanciaComponent,
    ListInstanciaComponent,
    CreateUsuarioComponent,
    ListUsuarioComponent,
    RegistrarUsuarioComponent,
    LoginComponent,
    VerificarCorreoComponent,
    RecuperarPasswordComponent,
    CreateProgramaComponent,
    ListProgramaComponent,
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    NgxPaginationModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
