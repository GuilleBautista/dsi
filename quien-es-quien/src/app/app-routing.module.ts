import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Imports de los componentes por los que navegar
import { HomepageComponent, loginDialog, registerDialog } from './homepage/homepage.component';
import { PrincipalPageComponent } from './principal-page/principal-page.component';
import { GameComponent } from './game/game.component';
import { SetSelectorComponent } from './set-selector/set-selector.component';
import { ProfileComponent } from './profile/profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

//Rutas de los componentes
const routes: Routes = [
  { path: '', component: HomepageComponent, pathMatch: 'full'}, //Para que cuando la ruta sea '' se vaya a la página de inicio
  { path: 'principalpage', component: PrincipalPageComponent },
  { path: 'game', component: GameComponent },
  { path: 'set-selector', component: SetSelectorComponent,  },
  { path: 'profile', component: ProfileComponent },
  { path: "**", component: PageNotFoundComponent }  //Para que cuando la ruta sea desconocida se vaya a la página de no encontrado
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

//Constante para guardar todos los componentes que hemos importado solo aquí, así solo tenemos que importar roitingComponents en app.module.ts
export const routingComponents = [HomepageComponent, loginDialog, registerDialog, PrincipalPageComponent, GameComponent, ProfileComponent, PageNotFoundComponent]
