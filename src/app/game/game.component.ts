import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import {GameService, SetService} from '@app/shared/services';
import {Card, Game, Set, Position, SetPlayer} from '@app/shared/models';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game;
  constructor(private gameService: GameService, private setService: SetService){

  }

  ngOnInit(){
    this.game = this.gameService.StartGame();
    this.setService.startBidding(this.game.activeSet);
    if(this.game.activeSet.Redeal){
      console.log("redeal!");
    }
    else {
      this.setService.resolveBlind(this.game.activeSet);
      console.log(this.game);
    }
  }

  playCard(){
    //this.setService.play
  }

}
