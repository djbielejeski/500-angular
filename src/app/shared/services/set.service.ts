import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpRequest } from '@angular/common/http';
import {Card, CardValue, Game, Hand, Set, SetPlayer, Suit} from '@app/shared/models';
import {AIBidService} from '@app/shared/services/ai-bid.service';
import {AIDiscardService} from "@app/shared/services/ai-discard.service";

@Injectable()
export class SetService {
  constructor(private aiBidService: AIBidService, private aiDiscardService: AIDiscardService){

  }

  startBidding(set: Set){
    while(!set.BiddingComplete) {
      this.aiBidService.getBid(set);
    }
    this.fixAllCardsForNewTrumpSuit(set);
  }

  resolveBlind(set: Set){
    // merge blind cards with winning bidder hand
    set.PlayerWhoWonTheBid.Hand.Cards =  set.PlayerWhoWonTheBid.Hand.Cards.concat(set.Blind.Cards);
    set.Blind.Cards = [];
    set.PlayerWhoWonTheBid.Hand.Sort();

    // discard 5 cards
    this.aiDiscardService.discard(set);
  }

  private logSetCardInfo(set: Set){
    _.each(set.Players, (player: SetPlayer) => {
      console.log(player.Hand);
    });
    console.log(set.Blind);
  }


  private fixAllCardsForNewTrumpSuit(set: Set){
    // Go through each person and flip bauers to the correct values.
    _.each(set.Players, (player: SetPlayer) => {
      this.fixHand(player.Hand, set.PlayerWhoWonTheBid.Bid.suit)
    });

    this.fixHand(set.Blind, set.PlayerWhoWonTheBid.Bid.suit);
  }

  private fixHand(hand: Hand, trumpSuit: Suit){
    var joker = _.find(hand.Cards, { value: CardValue.joker });

    if(joker){
      joker.suit = trumpSuit;
    }

    var rightBauer = _.find(hand.Cards, { value: CardValue.jack, suit: trumpSuit });
    if(rightBauer){
      rightBauer.value = CardValue.rightBauer;
    }


    var leftBauerSuit = this.getLeftBauerSuit(trumpSuit);
    var leftBauer = _.find(hand.Cards, { value: CardValue.jack, suit: leftBauerSuit });
    if(leftBauer){
      leftBauer.value = CardValue.leftBauer;
      leftBauer.suit = trumpSuit;
    }

    hand.Sort();
  }

  private getLeftBauerSuit(trumpSuit: Suit){
    if(trumpSuit == Suit.hearts){
      return Suit.diamonds;
    }
    else if(trumpSuit == Suit.diamonds){
      return Suit.hearts;
    }
    else if(trumpSuit == Suit.clubs){
      return Suit.spades;
    }
    else if(trumpSuit == Suit.spades){
      return Suit.clubs;
    }

  }
}
