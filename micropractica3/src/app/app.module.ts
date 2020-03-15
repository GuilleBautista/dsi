import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ComunidadComponent } from './comunidad/comunidad.component';
import { ProvinciaComponent } from './provincia/provincia.component';
import { TextoComponent } from './texto/texto.component';
import { ListaComponent } from './lista/lista.component';
import { OpcionComponent } from './opcion/opcion.component';

@NgModule({
  declarations: [
    AppComponent,
    ComunidadComponent,
    ProvinciaComponent,
    TextoComponent,
    ListaComponent,
    OpcionComponent
  ],
  imports: [
    BrowserModule, FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
