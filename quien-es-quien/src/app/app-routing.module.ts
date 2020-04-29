import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Imports generales a la web
import { HomepageComponent, loginDialog, registerDialog } from './homepage/homepage.component';
import { PrincipalPageComponent } from './principal-page/principal-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

//Imports juego
import { GameComponent } from './game/game.component';
import { SetSelectorComponent } from './set-selector/set-selector.component';
import { NpcSelectorComponent } from './npc-selector/npc-selector.component';


//Imports usuarios
import { ProfileComponent } from './profile/profile.component';
import { RankingComponent } from './ranking/ranking.component';

//Rutas de los componentes
const routes: Routes = [
  { path: '', component: HomepageComponent, pathMatch: 'full'}, //Para que cuando la ruta sea '' se vaya a la página de inicio
  { path: 'principalpage', component: PrincipalPageComponent },
  
  { path: 'game', component: GameComponent },
  { path: 'set-selector', component: SetSelectorComponent,  },
  { path: 'npc-selector', component: NpcSelectorComponent,  },

  { path: 'profile', component: ProfileComponent },
  { path: 'ranking', component: RankingComponent },

  { path: "**", component: PageNotFoundComponent }  //Para que cuando la ruta sea desconocida se vaya a la página de no encontrado
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

//Constante para guardar todos los componentes que hemos importado solo aquí, así solo tenemos que importar roitingComponents en app.module.ts
export const routingComponents = [HomepageComponent, loginDialog, registerDialog, PrincipalPageComponent, GameComponent, ProfileComponent, RankingComponent, PageNotFoundComponent]
