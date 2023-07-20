
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../app/services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){};
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):boolean {
   
      if(localStorage.getItem('token')) {
        this.router.navigate(['home'])
        return true
      }
      else {
        this.router.navigate(['login'])
        return false
      }
    
  }
  
}























// import { Token } from '@angular/compiler';
// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';

// export const canActivateGuard: CanActivateFn = (route: ActivatedRouteSnapshot, 
//   state: RouterStateSnapshot) => {
    
//     if(localStorage.getItem('token')) {      
//       return true
//     }
//     else {
//       return false;
//     }
//     //this.route.navigate(['home']);
    
//   }
//     /*
//     tokenService: TokenService
//     if(this.tokenService.loggedIn()){
//         console.log(this.tokenService.loggedIn);
        
//         return true;
//       }
//       this.router.navigate(['home']);
//       return false;
//     */

// //   }
