// import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

// import { routes } from './app.routes';
// import { provideHttpClient } from '@angular/common/http';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideZoneChangeDetection({ eventCoalescing: true }),
//     provideRouter(routes),
//     provideHttpClient(), // ✅ Add this
//     provideAnimations(), // This is crucial for animations to work in standalone components
//     provideAnimationsAsync(),
//     provideRouter(routes),
//     provideAnimationsAsync(),
//     provideRouter(routes, withPreloading(PreloadAllModules)),
//     provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
// };
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideNgxStripe } from 'ngx-stripe';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(
      routes,
      withPreloading(PreloadAllModules)
    ),

    provideHttpClient(),

    provideAnimations(),
    provideAnimationsAsync(),

    // ✅ STRIPE (IMPORTANT)
    provideNgxStripe(environment.stripePublicKey)
  ]
};
