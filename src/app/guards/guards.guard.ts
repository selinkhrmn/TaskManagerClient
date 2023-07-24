
import { Token } from '@angular/compiler';
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export const canActivateGuard: CanActivateFn = () => {
  
    const router= inject(Router) 
    if(localStorage.getItem('token')) {     
   
      return true
    }
    else {
      router.navigate(['/'])
      return false;
    }






    
    //this.route.navigate(['home']);
    
  }
    /*
    tokenService: TokenService
    if(this.tokenService.loggedIn()){
        console.log(this.tokenService.loggedIn);
        
        return true;
      }
      this.router.navigate(['home']);
      return false;
    */

//   }
