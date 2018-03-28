import { Injectable } from '@angular/core';
import { HttpHeaders, HttpRequest } from '@angular/common/http';
import {Game, Set} from '@app/shared/models';

@Injectable()
export class GameService {
  StartGame(): Game {
    var game: Game = new Game();
    game.SetupGame();

    var startingSet: Set = new Set();
    startingSet.AttachToGame(game);
    startingSet.Deal();

    game.Sets.push(startingSet);

    // Persist the game in the store. TODO

    return game;
  }
}
