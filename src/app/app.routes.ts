import { Routes } from '@angular/router';

import { GameComponent } from '@app/game/game.component';

export const routes: Routes = [
  { path: '', component: GameComponent },
  // Wildcard route
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];
