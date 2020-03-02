import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ComunidadComponent } from './comunidad/comunidad.component';
import { ProvinciaComponent } from './provincia/provincia.component';
import { TextoComponent } from './texto/texto.component';

@NgModule({
  declarations: [
    AppComponent,
    ComunidadComponent,
    ProvinciaComponent,
    TextoComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
