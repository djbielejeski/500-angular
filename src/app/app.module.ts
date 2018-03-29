import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

//
import { routes } from '@app/app.routes';

// Components
import { AppRootComponent } from '@app/app-root/app-root.component';
import { GameComponent } from '@app/game/game.component';

// Services
import * as services from '@app/shared/services';

// Store


@NgModule({
  declarations: [
    AppRootComponent,

    GameComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes), //, { enableTracing: true }
  ],
  providers: [
    services.GameService,
    services.SetService,
    services.AIBidService,
    services.AIDiscardService,
    services.AIPlayCardService
  ],
  bootstrap: [AppRootComponent]
})
export class AppModule { }
