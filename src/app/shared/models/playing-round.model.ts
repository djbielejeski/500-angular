import * as _ from 'lodash';
import {Card} from '@app/shared/models/card.model';
import {Suit} from '@app/shared/models/types.enums';

export class PlayingRound {
  PlayerWhoseTurnItIs: number;
  PlayerPlayingOrder: number[];
  CardsPlayed: Card[] = [];
  private TrumpSuit: Suit;

  constructor(_PlayerWhoseTurnItIs: number, _PlayerPlayingOrder: number[], trumpSuit: Suit){
    this.PlayerWhoseTurnItIs = _PlayerWhoseTurnItIs;
    this.PlayerPlayingOrder = _PlayerPlayingOrder;
    this.TrumpSuit = trumpSuit;
  }

  get WinningPlayerId(): number {
    if (this.CardsPlayed.length != 4){
      return 0;
    }

    // First see if there was trump played
    var trumpsPlayed = _.sortBy(_.filter(this.CardsPlayed, { suit: this.TrumpSuit }), 'value');

    if(trumpsPlayed.length > 0){
      var highestTrump = trumpsPlayed[trumpsPlayed.length - 1];
      return this.PlayerPlayingOrder[_.indexOf(this.CardsPlayed, highestTrump)];
    }
    else {
      // The person who played the highest card of this suit
      var suit = this.CardsPlayed[0].suit;
      var cardsOfThisSuitPlayed = _.sortBy(_.filter(this.CardsPlayed, {suit: suit}), 'value');
      var biggestCardPlayed = cardsOfThisSuitPlayed[cardsOfThisSuitPlayed.length - 1];

      return this.PlayerPlayingOrder[_.indexOf(this.CardsPlayed, biggestCardPlayed)];
    }
  }

  cardPlayedByPlayer(playerId: number): Card {
    var playerIndex = this.PlayerPlayingOrder.indexOf(playerId);

    if(this.CardsPlayed.length < playerIndex + 1){
      return null;
    }
    else {
      return this.CardsPlayed[playerIndex];
    }
  }

  get SuitLed(): Suit {
    if(this.CardsPlayed.length == 0){
      return Suit.none;
    }

    return this.CardsPlayed[0].suit;
  }
}
