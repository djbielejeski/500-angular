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
    this.newGame();
  }

  newGame(){
    this.game = this.gameService.StartGame(1);
    this.setService.startBidding(this.game.activeSet);
    if(this.game.activeSet.Redeal){
      console.warn("Redeal!");
      this.newGame();
    }
    else {
      this.setService.resolveBlind(this.game.activeSet);
      console.log(this.game);

      // start the round!
      this.setService.startNewRound(this.game.activeSet);
    }
  }

  playCard(){
    if(this.game.activeSet.CurrentPlayingRound.CardsPlayed.length == 4){
        this.setService.startNewRound(this.game.activeSet);
    }

    this.setService.playCard(this.game.activeSet);
  }

}
