import { Routes } from '@angular/router';
import { ListeAnimauxComponent } from './pages/liste-animaux/liste-animaux.component';
import { ListeEnclosComponent } from './components/liste-enclos/liste-enclos.component';
import { DetailAnimalComponent } from './pages/detail-animal/detail-animal.component';

export const routes: Routes = [
  { path: 'liste', component: ListeAnimauxComponent },
  { path: 'enclos', component: ListeEnclosComponent },
  { path: 'details/:id', component: DetailAnimalComponent },
  { path: '', redirectTo: '/liste', pathMatch: 'full' },
  { path: '**', redirectTo: '/liste' },
];
