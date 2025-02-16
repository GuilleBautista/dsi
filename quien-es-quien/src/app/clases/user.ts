
export class User
{
  name: string;
  username: string;
  password: string;
  level: number;
  points: number;

  id: string;
  profilePhotoURL:string;

    constructor(name:string, username:string, password:string, level:number, points:number, id:string, profilePhotoURL:string){
      this.name = name;
      this.username = username;
      this.password = password;
      this.level = level;
      this.points = points;
      this.id = id;
      this.profilePhotoURL = profilePhotoURL;
    }
}
