import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export const canActivateGuard: CanActivateFn = (route: ActivatedRouteSnapshot, 
  state: RouterStateSnapshot) => {
    
    if(localStorage.getItem('token')) {      
      return true
    }
    return false

  }
