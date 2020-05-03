import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../user';

import { GlobalService } from '../services/global/global.service';
import { CookieService } from 'ngx-cookie-service';
import { FirestoreService } from '../services/firestore/firestore.service';

import { cookie_time } from '../global';
import { User } from '../user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  public username:string;
  public level:number;

  public profilePicH:string;

  public user: User;


  constructor(private fs: FirestoreService, private router: Router, private route: ActivatedRoute,  public global: GlobalService,
    private cookieService: CookieService,) {

    //Cargamos la sesion lo primero
    this.loadSesion(
      this.cookieService.get("uid"),
      this.cookieService.get("game")
    );

    this.user=new User(this.global.actualUser.name, this.global.actualUser.username, this.global.actualUser.password, this.global.actualUser.level, this.global.actualUser.points, this.global.actualUser.id,this.global.actualUser.profilePhotoURL);

    this.username = this.user.username;
    this.level = this.user.level;
    this.profilePicH = this.user.profilePhotoURL;

    if (this.profilePicH == "") {
      this.fs.getImg("profilePhotos/user.svg").subscribe(url=>{
        this.profilePicH=url;
        this.user.profilePhotoURL=url;
        console.log(this.profilePicH);
      });

      this.fs.updateUser(this.user);

    }
    else{
      this.fs.getImg("profilePhotos/"+this.user.id).subscribe(url=>{
        this.profilePicH=url;
      });

      this.fs.updateUser(this.user);

    }
  }

  ngOnInit(): void{

  }

   /*
  * Recibe:
  *   -uid: string que se corresponde con el id de un usuario de la bbdd
  *   -game: string que se corresponde con el id de una partida en la bbdd
  * En este caso no recibimos la pagina, ya que si ha iniciado sesion se deja que navegue con la barra
  * de navegacion, y si no se redirige automaticamente a la pagina de inicio.
  *
  * Funcion generica de carga de sesiones, para ponerla en cada pagina
  * En este caso, la funcion hace de constructor, dando valor al usuario y a la foto de perfil
  *   una vez que se ha iniciado sesion con la cookie.
  *   Esto es para que se puedan recargar las paginas y no haya perdida de informacion.
  *
  * La funcion carga al usuario si existe y no está cargado, y lo mismo con la partida.
  * En este caso, si no hay usuario se devuelve a la pagina de inicio para que se inicie sesion.
  *
  * Si no esta en una partida se navega a la ultima pagina cargada por el usuario
  */
 private loadSesion(uid:string, game:string){

  if(uid!=""){

    //Primero iniciamos sesion
    this.fs.getUser(uid).then(user=>{
      this.global.actualUser=user as User;

      //Renovamos la cookie de sesion
      this.cookieService.set("uid", uid, cookie_time);

      //Tras iniciar sesion damos valor a las variables del componente
      this.username = this.global.actualUser.username;
      this.level = this.global.actualUser.level;

      //Cargamos la foto de perfil del usuario
      this.fs.getImg("profilePhotos/user.svg").subscribe(url=>{
      this.defaultProfilePicH=url;

    });
    }).catch(error=>{
      console.log("Error iniciando sesion:",error);
      //Si hay un error eliminamos las cookies y vamos a la pagina de inicio
      this.cookieService.deleteAll();
      this.cookieService.set("page", "/", cookie_time);
      this.router.navigate(["/"]);
    })

  }else{
    alert("la sesion ha caducado, inicia sesion de nuevo para continuar")
    //Si no habia una sesion eliminamos las cookies
    this.cookieService.deleteAll();

    //Despues redirigimos a la pagina de inicio
    this.cookieService.set("page", "/", cookie_time);
    this.router.navigate(['/']);
  }

  //Es necesario cargar la partida estemos en la pagina que estemos
  //  para evitar que se dejen las partidas a medias
  if(game!=""){
    //TODO: cargar partida
  }


}

  //Para ejecutar estas dos instrucciones en el html las agrupamos en una funcion
  //Se ejecuta al hacer clic en la foto de perfil
  public goto(path:string){
    this.cookieService.set("page", path, cookie_time);
    this.router.navigate([path]);
  }

}
