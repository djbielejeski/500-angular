import * as _ from 'lodash';
import {Card} from '@app/shared/models/card.model';
import {Suit} from '@app/shared/models/types.enums';

export class PlayingRound {
  PlayerWhoseTurnItIs: number;
  PlayerPlayingOrder: number[];
  CardsPlayed: Card[] = [];

  constructor(_PlayerWhoseTurnItIs: number, _PlayerPlayingOrder: number[]){
    this.PlayerWhoseTurnItIs = _PlayerWhoseTurnItIs;
    this.PlayerPlayingOrder = _PlayerPlayingOrder;
  }

  winningPlayerId(trumpSuit: Suit): number {
    if (this.CardsPlayed.length != 4){
      return 0;
    }

    // First see if there was trump played
    var trumpsPlayed = _.sortBy(_.filter(this.CardsPlayed, { suit: trumpSuit }), 'value');

    if(trumpsPlayed.length > 0){
      var highestTrump = trumpsPlayed[trumpsPlayed.length - 1];
      return this.PlayerPlayingOrder[_.indexOf(this.CardsPlayed, highestTrump)];
    }
    else{
      // The person who played the highest card of this suit
      var suit = this.CardsPlayed[0].suit;
      var cardsOfThisSuitPlayed = _.sortBy(_.filter(this.CardsPlayed, { suit: suit }), 'value');

      return this.PlayerPlayingOrder[_.indexOf(this.CardsPlayed, cardsOfThisSuitPlayed)];
    }

  }
}
