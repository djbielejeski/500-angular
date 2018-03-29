import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpRequest } from '@angular/common/http';
import {
  Bid, Bids, Game, Set, SetPlayer, Position, HandStrengthHelpers, BidValue, Suits, OffsuitStrengthHelpers,
  RaiseStrength,
  RaiseStrengthHelpers, Card, CardValue
} from '@app/shared/models';

@Injectable()
export class AIDiscardService {
  discard(set: Set){
    console.log("-------Starting Discard-------");
    var potentialThrowAwayCards = _.filter(set.PlayerWhoWonTheBid.Hand.Cards, (card: Card) => card.suit != set.PlayerWhoWonTheBid.Bid.suit);
    console.log("Potential Throwaway cards: ",  potentialThrowAwayCards);
    if (potentialThrowAwayCards.length <= 5){
      debugger;
      // Remove the potential throw away cards
      set.PlayerWhoWonTheBid.Hand.Cards = _.pull(set.PlayerWhoWonTheBid.Hand.Cards.concat, potentialThrowAwayCards);
      // Keep the top 10 top trump
      set.PlayerWhoWonTheBid.Hand.Cards = _.takeRight(_.sortBy(_.filter(set.PlayerWhoWonTheBid.Hand.Cards, { suit: set.PlayerWhoWonTheBid.Bid.suit}), 'value'), 10);
    }
    else {
      var cardsToKeep = _.filter(set.PlayerWhoWonTheBid.Hand.Cards, { suit: set.PlayerWhoWonTheBid.Bid.suit });
      var cardsToThrowAway: Card[] = [];

      debugger;
      // Keep our best offsuit (Aces + Kings + Queens + Jacks)
      var bestOffsuit = this.saveOffsuitAcesOnDown(potentialThrowAwayCards);
      potentialThrowAwayCards = _.pull(potentialThrowAwayCards, bestOffsuit);
      cardsToKeep = cardsToKeep.concat(bestOffsuit);

      if (cardsToKeep.length <= 8) {
        // Keep kings with cover if we have two spots or more left.
        var kingsWithCover = this.getKingsWithCover(potentialThrowAwayCards);
        potentialThrowAwayCards = _.pull(potentialThrowAwayCards, kingsWithCover);
        cardsToKeep = cardsToKeep.concat(kingsWithCover);
      }


      if(cardsToKeep.length < 10){
        // Short Suit myself
        cardsToThrowAway = cardsToThrowAway.concat(this.shortSuit(set, cardsToKeep, potentialThrowAwayCards));
        potentialThrowAwayCards = _.pull(potentialThrowAwayCards, cardsToThrowAway);
      }

      if(cardsToKeep.length < 10){
        // Take the best of the worst.
      }


      console.log("Keeping", cardsToKeep);
      console.log("Undetermined: ", potentialThrowAwayCards);
      console.log("Thrown Away: ", cardsToThrowAway);

      set.PlayerWhoWonTheBid.Hand.Cards = cardsToKeep;
      set.Blind.Cards = cardsToThrowAway;
      //
    }
    console.log("-------Ending Discard-------");
  }

  private saveOffsuitAcesOnDown(cards: Card[]): Card[] {
    var cardsToKeep: Card[] = [];

    // Most cards I can save is cards.length - 5
    var aces = _.filter(cards, { value: CardValue.ace });

    // Keep aces + kings + queens + jacks
    _.each(aces, (ace: Card) => {
      if(cardsToKeep.length <= cards.length - 5) {
        cardsToKeep.push(ace);

        var kingOfThisSuit = _.find(cards, {suit: ace.suit, value: CardValue.king});
        if(cardsToKeep.length <= cards.length - 5 && kingOfThisSuit){
          cardsToKeep.push(kingOfThisSuit);

          var queenOfThisSuit = _.find(cards, {suit: ace.suit, value: CardValue.queen});
          if(cardsToKeep.length <= cards.length - 5 && queenOfThisSuit){
            cardsToKeep.push(queenOfThisSuit);

            var jackOfThisSuit = _.find(cards, {suit: ace.suit, value: CardValue.jack});
            if(cardsToKeep.length <= cards.length - 5 && jackOfThisSuit){
              cardsToKeep.push(jackOfThisSuit);
            }
          }
        }
      }
    });

    // See if we have more items for these offsuit suits.
    _.each(aces, (ace: Card) => {
      if(cardsToKeep.length <= cards.length - 5) {
        // How many cards of this suit did I keep?
        var cardsOfThisSuitKept = _.filter(cardsToKeep, {suit: ace.suit});

        if (cardsOfThisSuitKept.length >= 2) {
          // How many cards of this suit do I have left?
          var cardsOfThisSuitLeft = _.filter(cards, (card: Card) => {
            return cardsToKeep.indexOf(card) == -1 && card.suit == ace.suit;
          });

          // take as many of these as possible. ( we have the ace + king of this suit )
          cardsToKeep = cardsToKeep.concat(_.takeRight(_.sortBy(cardsOfThisSuitLeft, 'value'), (cards.length - 5) - cardsToKeep.length));
        }
      }
    });

    return cardsToKeep;
  }

  private getKingsWithCover(cards: Card[]): Card[] {
    var cardsToKeep: Card[] = [];

    // Most cards I can save is cards.length - 5
    var kings = _.filter(cards, { value: CardValue.king });

    _.each(kings, (king: Card) => {
      var cardsOfThisSuit = _.filter(cards, (card: Card) => {
        return card.value != CardValue.king && card.suit == king.suit;
      });

      if (cardsOfThisSuit.length > 0 && cardsToKeep.length <= cards.length - 5){
        // grab the king and the highest covercard
        cardsToKeep.push(king);
        cardsToKeep.push(_.sortBy(cardsOfThisSuit, 'value')[cardsOfThisSuit.length - 1]);
      }
    });

    return cardsToKeep;
  }

  private shortSuit(set: Set, cardsToKeep: Card[], potentialThrowAwayCards: Card[]): Card[] {

    var cardsToThrowAway: Card[] = [];

    var totalCardsWeNeedToGetRidOf = potentialThrowAwayCards.length - 5;

    // Get the enemies bid's
    var enemies = _.filter(set.Players, (player: SetPlayer) => player.TeamId != set.PlayerWhoWonTheBid.TeamId);

    _.each(enemies, (enemy: SetPlayer) => {
      if(enemy.Bid != Bids.Pass()){
        // see if we can shortsuit this entire suit
        var throwawayCardsOfThisEnemiesSuit = _.filter(potentialThrowAwayCards, { suit: enemy.Bid.suit });

        if(_.filter(cardsToKeep, { suit: enemy.Bid.suit }).length == 0 &&
          throwawayCardsOfThisEnemiesSuit.length <= totalCardsWeNeedToGetRidOf){
          // looks like we can get rid of this whole suit.
          cardsToThrowAway = cardsToThrowAway.concat(throwawayCardsOfThisEnemiesSuit);
        }
      }
    });

    if (cardsToThrowAway.length <= totalCardsWeNeedToGetRidOf){
      // See if we can shortsuit any other suits

    }

    return cardsToThrowAway;
  }
}
