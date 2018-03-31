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
    // My new hand is all the trump cards to start.
    var newHand: Card[] = _.takeRight(_.sortBy(_.filter(set.PlayerWhoWonTheBid.Hand.Cards, { suit: set.TrumpSuit}), 'value'), 10);

    if(newHand.length < 10){
      var nonTrumpCards: Card[] = _.filter(set.PlayerWhoWonTheBid.Hand.Cards, (card: Card) => card.suit != set.TrumpSuit);
      var cardsNeeded: number = 10 - newHand.length;
      var enemiesBidsSuits: Suit[] = _.uniq(_.map(_.filter(set.Players, (player: SetPlayer) => player.TeamId != set.PlayerWhoWonTheBid.TeamId && player.Bid != Bids.Pass()), (x: SetPlayer) => x.Bid.suit));

      newHand = newHand.concat(this.getBestNonTrumpCards(nonTrumpCards, cardsNeeded, enemiesBidsSuits))
    }

    set.Blind.Cards = _.filter(set.PlayerWhoWonTheBid.Hand.Cards, (card: Card) => newHand.indexOf(card) === -1);
    set.PlayerWhoWonTheBid.Hand.Cards = newHand;
    set.PlayerWhoWonTheBid.Hand.Sort();

    set.DiscardComplete = true;
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

    // Kings with cover is priority 3. But only keep kings with cover if we have 2 cards needed for it.
    if(cardsNeeded - cardsToKeep.length > 1) {
      var kings = _.filter(nonTrumpCards, {value: CardValue.king});

      _.each(kings, (king: Card) => {
        var cardsOfThisSuit = _.filter(nonTrumpCards, (card: Card) => {
          return card.value != CardValue.king && card.suit == king.suit;
        });

        if (cardsOfThisSuit.length > 0 && cardsToKeep.length <= nonTrumpCards.length - 5) {
          // grab the king and the highest covercard
          cardsToKeep.push(king);
          var cardToKeepToCoverKing = _.sortBy(cardsOfThisSuit, 'value')[cardsOfThisSuit.length - 1];
          cardsToKeep.push(cardToKeepToCoverKing);

          nonTrumpCards = _.filter(nonTrumpCards, (card: Card) => card != king && card != cardToKeepToCoverKing);
        }
      });
    }

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

      if (cardsNeeded - cardsToKeep.length > 0) {
        // we still have more to dump. Continue short suiting.

        // Keep cards of suits we already have
        var suitsIAlreadyHaveInMyHand = _.uniq(_.map(cardsToKeep, 'suit'));
        var suitsIHaveAvailableToDiscard = _.uniq(_.map(nonTrumpCards, 'suit'));

        _.each(suitsIHaveAvailableToDiscard, (suit: Suit) => {
          if (cardsNeeded - cardsToKeep.length > 0 && suitsIAlreadyHaveInMyHand.indexOf(suit) != -1) {
            // we area already holding this suit, lets keep the cards from this suit.
            var cardsToKeepFromThisSuit = _.takeRight(_.sortBy(_.filter(nonTrumpCards, {suit: suit}), 'value'), cardsNeeded - cardsToKeep.length);
            cardsToKeep = cardsToKeep.concat(cardsToKeepFromThisSuit);
            nonTrumpCards = _.filter(nonTrumpCards, (card: Card) => cardsToKeepFromThisSuit.indexOf(card) == -1);
          }
        });

        // See if we have enough dumped or in our hand.
        if(cardsNeeded - cardsToKeep.length > 0){
          // see if we can keep queens with 2 cover here
          var queens = _.filter(nonTrumpCards, { value: CardValue.queen });
          _.each(queens, (queen: Card) => {
            if(cardsNeeded - cardsToKeep.length >= 3) {
              var cardsOfThisSuit = _.filter(nonTrumpCards, (card: Card) => card.suit == queen.suit && card.value != CardValue.queen);
              if (cardsOfThisSuit.length >= 2) {
                // we can keep these and the queen
                var cardsToKeepFromThisSuit = _.takeRight(_.sortBy(_.filter(nonTrumpCards, {suit: queen.suit}), 'value'), cardsNeeded - cardsToKeep.length);
                cardsToKeep = cardsToKeep.concat(cardsToKeepFromThisSuit);
                nonTrumpCards = _.filter(nonTrumpCards, (card: Card) => cardsToKeepFromThisSuit.indexOf(card) == -1);
              }
            }
          });

          // see if we have one suit that has the amount that we should dump.
          if(cardsNeeded - cardsToKeep.length > 0){
            var suits = _.uniq(_.map(nonTrumpCards, 'suit'));
            _.each(suits, (suit: Suit) => {
              var cardsToKeepFromThisSuit = _.takeRight(_.sortBy(_.filter(nonTrumpCards, {suit: suit}), 'value'), cardsNeeded - cardsToKeep.length);
              if(cardsNeeded - cardsToKeep.length > 0 && cardsToKeepFromThisSuit.length >= cardsNeeded - cardsToKeep.length){
                var cardsToKeepFromThisSuit = _.takeRight(_.sortBy(_.filter(nonTrumpCards, {suit: suit}), 'value'), cardsNeeded - cardsToKeep.length);
                cardsToKeep = cardsToKeep.concat(cardsToKeepFromThisSuit);
                nonTrumpCards = _.filter(nonTrumpCards, (card: Card) => cardsToKeepFromThisSuit.indexOf(card) == -1);
              }
            });
          }

          if(cardsNeeded - cardsToKeep.length > 0) {
            // Grab the best cards left.
            var cardsToKeepFromTheCrapThatIsLeft = _.takeRight(_.sortBy(nonTrumpCards, 'value'), cardsNeeded - cardsToKeep.length);
            cardsToKeep = cardsToKeep.concat(cardsToKeepFromTheCrapThatIsLeft);
            nonTrumpCards = _.filter(nonTrumpCards, (card: Card) => cardsToKeepFromTheCrapThatIsLeft.indexOf(card) == -1);
          }
        }
      }
    }

    return cardsToKeep;
  }
}
