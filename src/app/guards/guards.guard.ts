import { Token } from '@angular/compiler';
import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services';

export const canActivateGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (localStorage.getItem('token')) {
    return true;
  } else {
    router.navigate(['']);
    return false;
  }
};

export const isLoggedIn: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const authService = inject(AuthService)
  if (tokenService.loggedIn()) {
    authService.logOut()
    alert('Your token has been expired. You are getting redirect to the login page.')
    return false;
  } 
  else {
    return true;
  }
};

export const loginCheck: CanActivateFn = () => {
  const router = inject(Router);
  if (localStorage.getItem('token')) {
    router.navigate(['home/summary']);
    return false;
  } else {
    return true;
  }
};


export const isAdminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  if (localStorage.getItem('token') && tokenService.hasRole('Admin') ) {
    return true;
  } else {
    router.navigate(['']);
    return false;
  }
};