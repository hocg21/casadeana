import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

export const authGuard: CanActivateFn = async (route, state) => {

  const firebaseService = inject(FirebaseService);
  const router = inject(Router);


  const isloggedin = await firebaseService.checkSessionStatus()
  .catch((user)=>{
    return false;
  })
  console.log(isloggedin);

  if(isloggedin)
    return true
  else
    router.navigateByUrl('/login');

  return false

};
