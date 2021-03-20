import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private router: Router,
        private afAuth: AngularFireAuth
    ){}

    canActivate(): Observable<boolean>{
        return this.afAuth.authState.pipe(
            map(auth => {
                if (!auth){
                    this.router.navigate(['/login']); //redirigimos de nuevo a login para que se logue
                    return false;
                }else{
                    return true;
                }
            })
        )
    }
}