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
      domain: 'dev-rkbeore70k0guhoo.us.auth0.com',
      clientId: 'v3vrmN1YoNbpT0noUABhq1aJpMyby56e', // À remplacer par votre Client ID
      authorizationParams: {
        redirect_uri: 'http://localhost:4201',
        audience: 'http://localhost:3000',
      },
    }),
  ],
});
