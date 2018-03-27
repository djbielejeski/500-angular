import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { GameService } from '@app/shared/services';
import {Card, Game, Set, Position, SetPlayer} from '@app/shared/models';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game;
  constructor(private gameService: GameService){

  }

  ngOnInit(){
    this.game = this.gameService.StartGame();
  }

}
