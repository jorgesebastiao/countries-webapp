import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { SpinnerService } from './spinner.service';

export const spinnerInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {

  let spinnerService = inject(SpinnerService);
  spinnerService.requestStarted();
  return next(req).pipe(
    finalize(() => {
      spinnerService.requestEnded();
    })
  );
};
