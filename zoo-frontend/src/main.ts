import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimations(),
    provideAuth0({
      domain:
        process.env['NG_APP_AUTH0_DOMAIN'] ||
        'dev-rkbeore70k0guhoo.us.auth0.com',
      clientId:
        process.env['NG_APP_AUTH0_CLIENT_ID'] ||
        'v3vrmN1YoNbpT0noUABhq1aJpMyby56e',
      authorizationParams: {
        redirect_uri:
          process.env['NG_APP_AUTH0_REDIRECT_URI'] || 'http://localhost:4200',
        audience:
          process.env['NG_APP_AUTH0_AUDIENCE'] || 'http://localhost:3000',
      },
    }),
  ],
});
