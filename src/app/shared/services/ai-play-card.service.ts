import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpRequest } from '@angular/common/http';
import {
  Bid, Bids, Game, Set, SetPlayer, Position, HandStrengthHelpers, BidValue, Suits, OffsuitStrengthHelpers, RaiseStrength,
  RaiseStrengthHelpers, Card, Cards, PlayingRound, Suit, CardValue
} from '@app/shared/models';

@Injectable()
export class AIPlayCardService {
  playCard(set: Set, player: SetPlayer) {
    var cardToPlay: Card = null;
    // 1st position - opening
    if(this.currentRound(set).CardsPlayed.length == 0){
      if(set.PlayingRounds.length == 1) {
        cardToPlay = this.OpeningRound_FirstCard(set, player);
      }
      else{
        cardToPlay = this.FirstCard(set, player);
      }
    }
    // 2nd position
    else if(this.currentRound(set).CardsPlayed.length == 1){
      if(set.PlayingRounds.length == 1) {
        cardToPlay = this.OpeningRound_SecondCard(set, player);
      }
      else{
        cardToPlay = this.SecondCard(set, player);
      }
    }
    // 3rd position
    else if(this.currentRound(set).CardsPlayed.length == 2){
      if(set.PlayingRounds.length == 1) {
        cardToPlay = this.OpeningRound_ThirdCard(set, player);
      }
      else{
        cardToPlay = this.ThirdCard(set, player);
      }
    }
    // 4th position
    else if(this.currentRound(set).CardsPlayed.length == 3){
      if(set.PlayingRounds.length == 1) {
        cardToPlay = this.OpeningRound_FourthCard(set, player);
      }
      else{
        cardToPlay = this.FourthCard(set, player);
      }
    }

    else {
      /*
      // previous rounds have occurred, different logic
      var cardsPlayed: Card[] = [];

      _.each(set.PlayingRounds, (round) => {
        cardsPlayed.push(round.Card1Play);
        cardsPlayed.push(round.Card2Play);
        cardsPlayed.push(round.Card3Play);
        cardsPlayed.push(round.Card4Play);
      });

      var lastRound: PlayingRound = set.PlayingRounds[set.PlayingRounds.length - 1];

      Dictionary<Suit, List<Card>> cardsPlayedBySuit = new Dictionary<Suit, List<Card>>();
      var groups = cardsPlayed.GroupBy(x => x.Suit);
      foreach (var group in groups)
      {
        cardsPlayedBySuit.Add(group.Key, group.ToList());
      }
    }*/

      //#region Opening round?
      //#region yes
      //#region Am I lead player?
      //#region yes
      // do I have trump?
      // yes
      // play highest I have
      // no
      // play highest offsuit, if tied, look at lowest card count in that suit for tie breaker
      //#endregion // yes
      //#region no
      // do I have to follow suit?
      // yes
      // Does partner currently have the trick?
      // yes
      // sluff what I can following suit or short suit
      // no
      // Does partner currently have the trick?
      // yes
      // is his card going to make it around?  Ace offsuit, high trump, King that I have the Ace for, etc
      // yes
      // sluff what I can following suit or short suit
      // no
      // go bigger than his card following suit or trump it
      // no
      // can I trump it?
      // yes
      // play lowest trump to win
      // no
      // sluff card, try to short suit as best we can
      //#endregion // no
      //#endregion // Am I lead player?
      //#endregion // yes
      //#region no
      //#region Am I lead player?
      //#region yes
      // do I have trump?
      // yes
      // does enemy have trump?
      // yes
      // do I have highest?
      // yes
      // play highest trump
      // no
      // does enemy have highest?
      // yes

      // If not, figure out best offsuit lead
      // if not
      // did my partner play yet?
      // if so, do they own this trick?

      // if so, sluff what I can following suit or short suit
      // if not, can I win while following suit?
      // if so, take the trick thus far
      // if not, sluff what I can following suit or short suit

      // if not, do I need to follow suit on a non trump play?
      // if so, play my biggest card in that suit
      // if not, figure out my best play within trump
      //#endregion // yes
      //#endregion // Am I lead player?
      //#endregion // no
      //#endregion // Opening round?
    }

    // Play the card
    this.playCard(player, cardToPlay);
  }

  ///
  /// Card Actions
  ///

  private OpeningRound_FirstCard(set: Set, player: SetPlayer): Card {
    // Play my biggest trump
    var cardToPlay = this.getBiggestCardOfSuit(player.Hand.Cards, this.winningBid(set).suit);

    // If I dont have a trump, still need to play a card, so find my biggest offsuit
    if (cardToPlay == null) {
      // Find my biggest offsuit
      cardToPlay = this.getAceOrKingWithCoverOffsuit(player.Hand.Cards, this.winningBid(set).suit);

      if (cardToPlay == null) {
        // find card from my partners suit, and lead to that
        cardToPlay = this.getCardFromPartnerSuit(set, player);

        if (cardToPlay == null) {
          // Just play a random low card
          cardToPlay = this.getLowCard(player.Hand.Cards, this.winningBid(set).suit);
        }
      }
    }

    return cardToPlay;
  }

  private FirstCard(set: Set, player: SetPlayer): Card {
    var cardToPlay: Card = null;

    //Am I the one who is trying to make the bid?
    if(this.isItMyTeamsBid(set, player)){
      // it is our bid.
      // Do i have the rest of the trump? Or are my enemies out of trump?
      if (this.doIHaveTheRestOfTrump(set, player) ||
          this.areMyEnemiesOutOfSuit(set, player, this.winningBid(set).suit)){

        cardToPlay = this.getWinningOffsuitCard(set, player);

        if (cardToPlay == null) {
          // I (or my partner) have the rest of the trump, but I don't have a winning card
          // play into my partners void (if he has trump) or the suit which he bid.
          cardToPlay = this.getCardFromPartnerSuit(set, player);

          if(cardToPlay == null) {
            // Check if my partner has trump, and if he does, if I know what suit he is out of
            // If i don't know what suit he is out of, then I guess the suit that my opponents bid.
            // If none of that works, then I throw a terrible card
            if(this.partnerHasTrump(set, player)){
              // The "true" is for getting the lowest card of that suit
              cardToPlay = this.getCardFromSuitsMyPartnerIsOutOf(set, player, true);

              if(cardToPlay == null){
                // I don't know what suits he is out of, or I don't have any of that suit,
                // figure out what suits my enemies bid, because
                // my partner probably tried to short-suit that suit

                // The "true" is for getting the lowest card of that suit
                cardToPlay = this.getCardFromSuitMyEnemiesBid(set, player, true);
              }
            }
            else {
              // Partner does not have trump, we are going to fall down into the throwing away a terrible card.
              // NOOP
            }

            if (cardToPlay == null) {
              cardToPlay = this.throwAwayTerribleCard(set, player);
            }
          }
          else{
            // I have a card from my partner's bidded suit, so I am going to lead to him
            // NOOP
          }
        }
        else {
          // I have an ace or king with cover in an offsuit
          // NOOP
        }
      }
      else {
        // My partner and I do not have the rest of the trump,
        // play my best trump if I don't know that my enemies are out of trump
        if(!this.isOneOfMyEnemiesOutOfSuit(set, player, this.winningBid(set).suit)){
          // If I have the biggest trump throw it, if I don't, throw a card that will pull the highest
          // unless I know my partner has it
          cardToPlay = this.getBiggestCardOfSuit(player.Hand.Cards, this.winningBid(set).suit);

          if (!this.doIHaveTheBestCardOfSuit(set, player, this.winningBid(set).suit)) {
            // I do not have the best card of this suit, play my smallest trump
            cardToPlay = this.getLowestCardOfSuit(player.Hand.Cards, this.winningBid(set).suit);

            if(cardToPlay == null){
              // I do not have any trump left,
              // play an offsuit card
              cardToPlay = this.getWinningOffsuitCard(set, player);

              if (cardToPlay == null){
                //we were not able to play a winning offsuit card
                cardToPlay = this.getCardFromPartnerSuit(set, player);

                if (cardToPlay == null){
                  // I don't have any cards from my partners bid to throw, default to throwing a bad card.
                  cardToPlay = this.throwAwayTerribleCard(set, player);
                }
                else{
                  // I have a card I can try to pass with to my partner
                  // NOOP
                }
              }
              else {
                // We have a winning offsuit card. Play that
                // NOOP
              }
            }
            else {
              // We have a small trump to play
              // NOOP
            }
          }
          else {
            // we have the best trump card available, we are going to throw that
            // NOOP
          }
        }
      }
    }
    else {
      // Not my bid, play a winner card if possible
      cardToPlay = this.getWinningOffsuitCard(set, player);

      if(cardToPlay == null){

        // Try to pass to our partner
        cardToPlay = this.getCardFromPartnerSuit(set, player);

        if (cardToPlay == null) {
          // Can't pass to our partner, play a bad card.
          cardToPlay = this.throwAwayTerribleCard(set, player);
        }
      }
      else {
        // We have a winning offsuit card
        // NOOP
      }
    }

    return cardToPlay;
  }

  private OpeningRound_SecondCard(set: Set, player: SetPlayer): Card {
    var cardToPlay: Card = null;

    return cardToPlay;
  }
  private SecondCard(set: Set, player: SetPlayer): Card {
    var cardToPlay: Card = null;

    return cardToPlay;
  }

  private OpeningRound_ThirdCard(set: Set, player: SetPlayer): Card {
    var cardToPlay: Card = null;

    return cardToPlay;
  }
  private ThirdCard(set: Set, player: SetPlayer): Card {
    var cardToPlay: Card = null;

    return cardToPlay;
  }

  private OpeningRound_FourthCard(set: Set, player: SetPlayer): Card {
    var cardToPlay: Card = null;

    return cardToPlay;
  }
  private FourthCard(set: Set, player: SetPlayer): Card {
    var cardToPlay: Card = null;

    return cardToPlay;
  }

  ///
  /// Helper functions
  ///
  private winningBid(set: Set): Bid {
    return set.PlayerWhoWonTheBid.Bid;
  }

  private isItMyTeamsBid(set, player): boolean {
    // TODO

  }

  private getCardFromPartnerSuit(set: Set, player: SetPlayer): Card {
    // TODO
  }

  private currentRound(set: Set): PlayingRound {
    return set.PlayingRounds[set.PlayingRounds.length - 1]
  }

  private getBiggestCardOfSuit(cards: Card[], suit: Suit): Card {
    // TODO
  }

  private getLowestCardOfSuit(cards: Card[], suit: Suit): Card {
    // TODO
  }

  private getWinningOffsuitCard(set, player): Card {
    // TODO
  }

  private doIHaveTheRestOfTrump(set: Set, player: SetPlayer): boolean {
    // TODO
  }

  private areMyEnemiesOutOfSuit(set: Set, player: SetPlayer, suit: Suit): boolean {
    // TODO
  }

  private partnerHasTrump(set: Set, player: SetPlayer): boolean {
    // TODO
  }

  private getCardFromSuitsMyPartnerIsOutOf(set: Set, player: SetPlayer, lowestCardAvailable: boolean = false): Card {
    // TODO
  }

  private getCardFromSuitMyEnemiesBid(set: Set, player: SetPlayer, lowestCardAvailable: boolean = false): Card {
    // TODO
  }

  private throwAwayTerribleCard(set: Set, player: SetPlayer): Card {
    // TODO
  }

  private isOneOfMyEnemiesOutOfSuit(set: Set, player: SetPlayer, suit: Suit): boolean {
    // TODO
  }

  private doIHaveTheBestCardOfSuit(set: Set, player: SetPlayer, suit: Suit): boolean {
    // TODO
  }
}
