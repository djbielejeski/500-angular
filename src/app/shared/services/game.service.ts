import { Injectable } from '@angular/core';
import { HttpHeaders, HttpRequest } from '@angular/common/http';
import {Game, Set} from '@app/shared/models';

@Injectable()
export class GameService {
  StartGame(testCaseId: number = 0): Game {
    // Pass in a test case id here to get the same test case over and over.
    var game: Game = new Game(testCaseId);
    game.SetupGame();

    var startingSet: Set = new Set();
    startingSet.AttachToGame(game);
    startingSet.Deal();

    game.Sets.push(startingSet);

    // Persist the game in the store. TODO

    return game;
  }
}
