import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpRequest } from '@angular/common/http';
import {
  Bid, Bids, Game, Set, SetPlayer, Position, HandStrengthHelpers, BidValue, Suits, OffsuitStrengthHelpers,
  RaiseStrength,
  RaiseStrengthHelpers, Card, CardValue, Suit
} from '@app/shared/models';

@Injectable()
export class AIDiscardService {
  discard(set: Set){
    console.log("-------Starting Discard-------");

    // My new hand is all the trump cards to start.
    var newHand: Card[] = _.takeRight(_.sortBy(_.filter(set.PlayerWhoWonTheBid.Hand.Cards, { suit: set.PlayerWhoWonTheBid.Bid.suit}), 'value'), 10);

    if(newHand.length < 10){
      var nonTrumpCards: Card[] = _.filter(set.PlayerWhoWonTheBid.Hand.Cards, (card: Card) => card.suit != set.PlayerWhoWonTheBid.Bid.suit);
      var cardsNeeded: number = 10 - newHand.length;
      var enemiesBidsSuits: Suit[] = _.uniq(_.map(_.filter(set.Players, (player: SetPlayer) => player.TeamId != set.PlayerWhoWonTheBid.TeamId && player.Bid != Bids.Pass()), (x: SetPlayer) => x.Bid.suit));

      newHand = newHand.concat(this.getBestNonTrumpCards(nonTrumpCards, cardsNeeded, enemiesBidsSuits))
    }

    set.Blind.Cards = _.filter(set.PlayerWhoWonTheBid.Hand.Cards, (card: Card) => newHand.indexOf(card) === -1);
    set.PlayerWhoWonTheBid.Hand.Cards = newHand;
    set.PlayerWhoWonTheBid.Hand.Sort();

    console.log("-------Ending Discard-------");
  }

  private getBestNonTrumpCards(nonTrumpCards: Card[], cardsNeeded: number, enemiesBidsSuits: Suit[]): Card[] {

    // Aces are priority number 1
    var cardsToKeep: Card[] = [];

    var aces = _.filter(nonTrumpCards, { value: CardValue.ace });
    if(aces.length >= cardsNeeded){
      return _.take(aces, cardsNeeded);
    }

    if(aces.length > 0){
      cardsToKeep = cardsToKeep.concat(aces);
      nonTrumpCards = _.filter(nonTrumpCards, (card: Card) => aces.indexOf(card) === -1);

      // Backing kings for aces are priority 2
      _.each(aces, (ace: Card) => {
        var kingOfThisSuit = _.find(nonTrumpCards, {suit: ace.suit, value: CardValue.king});
        if(kingOfThisSuit && cardsNeeded - cardsToKeep.length > 0){
          cardsToKeep.push(kingOfThisSuit);
          nonTrumpCards = _.filter(nonTrumpCards, (card: Card) => card != kingOfThisSuit);

          var queenOfThisSuit = _.find(nonTrumpCards, {suit: ace.suit, value: CardValue.queen});
          if (queenOfThisSuit && cardsNeeded - cardsToKeep.length > 0) {
            cardsToKeep.push(queenOfThisSuit);
            nonTrumpCards = _.filter(nonTrumpCards, (card: Card) => card != queenOfThisSuit);
          }

          // Add the rest of this suit if we have it (we have the king and the ace, so the rest are better than kings with cover or other misc offsuit).
          var cardsOfThisSuitLeft = _.filter(nonTrumpCards, {suit: ace.suit});
          if (cardsOfThisSuitLeft.length > 0 && cardsNeeded - cardsToKeep.length > 0) {
            var theCardsOfThisSuitWeAreKeeping = _.takeRight(_.sortBy(cardsOfThisSuitLeft, 'value'), cardsNeeded - cardsToKeep.length);
            nonTrumpCards = _.filter(nonTrumpCards, (card: Card) => theCardsOfThisSuitWeAreKeeping.indexOf(card) === -1);
            cardsToKeep = cardsToKeep.concat(theCardsOfThisSuitWeAreKeeping);
          }
        }
      });
    }

    // Kings with cover is priority 3
    var kings = _.filter(nonTrumpCards, { value: CardValue.king });

    _.each(kings, (king: Card) => {
      var cardsOfThisSuit = _.filter(nonTrumpCards, (card: Card) => {
        return card.value != CardValue.king && card.suit == king.suit;
      });

      if (cardsOfThisSuit.length > 0 && cardsToKeep.length <= nonTrumpCards.length - 5){
        // grab the king and the highest covercard
        cardsToKeep.push(king);
        var cardToKeepToCoverKing = _.sortBy(cardsOfThisSuit, 'value')[cardsOfThisSuit.length - 1];
        cardsToKeep.push(cardToKeepToCoverKing);

        nonTrumpCards = _.filter(nonTrumpCards, (card: Card) => card != king && card != cardToKeepToCoverKing);
      }
    });

    // short suiting is priority 4
    if(cardsNeeded - cardsToKeep.length > 0) {
      var cardsToThrowAway: Card[] = [];
      // see if we can shortsuit whatever our enemies bid.
      _.each(enemiesBidsSuits, (enemyBidSuit: Suit) => {
        // see if we can shortsuit this entire suit
        var throwawayCardsOfThisEnemiesSuit = _.filter(nonTrumpCards, {suit: enemyBidSuit});

        if (_.filter(cardsToKeep, {suit: enemyBidSuit}).length == 0 &&
          throwawayCardsOfThisEnemiesSuit.length <= cardsNeeded - cardsToKeep.length) {
          // looks like we can get rid of this whole suit.
          cardsToThrowAway = cardsToThrowAway.concat(throwawayCardsOfThisEnemiesSuit);

          nonTrumpCards = _.filter(nonTrumpCards, (card: Card) => cardsToThrowAway.indexOf(card) === -1);
        }
      });

      if (cardsToThrowAway.length < cardsNeeded - cardsToKeep.length) {
        // we still have more to dump

        var suitsIAlreadyHaveInMyHand = _.uniq(_.map(cardsToKeep, 'suit'));
        var suitsIHaveAvailableToDiscard = _.uniq(_.map(nonTrumpCards, 'suit'));

        _.each(suitsIHaveAvailableToDiscard, (suit: Suit) => {
          if (cardsNeeded - cardsToKeep.length > 0 && suitsIAlreadyHaveInMyHand.indexOf(suit) != -1) {
            // we area already holding this suit, lets keep the cards from this suit.
            var cardsToKeepFromThisSuit = _.takeRight(_.sortBy(_.filter(nonTrumpCards, {suit: suit}), 'value'), cardsNeeded - cardsToKeep.length);
            cardsToKeep = cardsToKeep.concat(cardsToKeepFromThisSuit);
            nonTrumpCards = _.filter(nonTrumpCards, (card: Card) => cardsToKeepFromThisSuit.indexOf(card) != -1);
          }
        });

        // Dump cards of
      }
    }

    return cardsToKeep;
  }
}
