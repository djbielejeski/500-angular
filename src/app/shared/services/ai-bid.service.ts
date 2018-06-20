import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpRequest } from '@angular/common/http';
import {
  Bid, Bids, Game, Set, SetPlayer, Position, HandStrengthHelpers, BidValue, Suits, OffsuitStrengthHelpers, RaiseStrength,
  RaiseStrengthHelpers
} from '@app/shared/models';

@Injectable()
export class AIBidService {
  getBid(set: Set) {
    var bid: Bid;

    // Figure out whose turn it is to bid
    var player = set.PlayerWhoseBidItIs();

    var biddingPosition = set.Bids.length + 1;
    switch (biddingPosition) {
      case Position.first: bid = this.firstBid(set, player);
        break;
      case Position.second: bid = this.secondBid(set, player);
        break;
      case Position.third: bid = this.thirdBid(set, player);
        break;
      case Position.fourth: bid = this.fourthBid(set, player);
        break;
      default: break;
    }

    // Save the bid
    if(player == null){
      debugger;
    }
    player.Bid = bid;
  }

  availableBids(set: Set): Bid[] {
    var playerWithHighestBid = Bids.highestBid(set.Players);

    if (playerWithHighestBid != null && playerWithHighestBid.Bid != null) {
      return _.filter(Bids.allBids(), (bid: Bid) => {
        return bid.value == BidValue.pass || bid.value > playerWithHighestBid.Bid.value;
      });
    }
    else {
      return Bids.allBids();
    }
  }

  private firstBid(set: Set, player: SetPlayer ): Bid  {
    return player.StrongestBid;
  }

  private secondBid(set: Set, player: SetPlayer ): Bid  {
    var playerWithHighestBid = Bids.highestBid(set.Players);
    var enemyBid = Bids.Pass();
    if(playerWithHighestBid != null && playerWithHighestBid.Bid != null){
      enemyBid = playerWithHighestBid.Bid;
    }

    var myBid: Bid = player.StrongestBid;
    if (myBid.value == BidValue.pass)
    {
      return myBid;
    }
    else
    {
      var myBidPlusOne: BidValue = myBid.value + 1;
      if (myBid.value >= 6 && enemyBid.value <= BidValue.eight) {
        if (myBid.Points < enemyBid.Points && // if our bid is less than their bid
          Suits.getColor(myBid.suit) != Suits.getColor(enemyBid.suit) && // and if our suit is both different and mightier than theirs
          myBidPlusOne >= enemyBid.value) // so that if we bid + 1, we take the bid away from them
        {
          // Lets be aggressive and do it
          myBid.value = myBidPlusOne;
        }
        else if (enemyBid.value == BidValue.pass && myBid.value == BidValue.six)
        {
          // If player 1 passes, and we have a six bid, go to 7 (aggressive again)
          myBid.value = myBidPlusOne;
        }
      }

      if (myBid.Points <= enemyBid.Points)
      {
        myBid = Bids.Pass();
      }

      return myBid;
    }
  }

  private thirdBid(set: Set, player: SetPlayer ): Bid  {
    var partner: SetPlayer = _.find(set.Players, { Id: set.PlayerBiddingOrder[0] });
    var enemy: SetPlayer = _.find(set.Players, { Id: set.PlayerBiddingOrder[1] });
    var partnerBid: Bid = partner.Bid != null ? partner.Bid : Bids.Pass();
    var enemyBid: Bid = enemy.Bid != null ? enemy.Bid : Bids.Pass();

    var myBid: Bid = player.StrongestBid;

    var raiseStrength: RaiseStrength = null;
    if (partnerBid.value <= BidValue.eight)
    {
      raiseStrength = RaiseStrengthHelpers.GetSupportingStrength(player.Hand.Cards, partnerBid);

      var offsuitValue: number = 0;
      if (raiseStrength.dependsOnOffsuit)
      {
        offsuitValue = OffsuitStrengthHelpers.getOffsuitStrength(player.Hand.Cards, partnerBid.suit);
        if (offsuitValue > 0)
        {
          offsuitValue = 1;
        }
      }

      raiseStrength.raiseValue += offsuitValue;
    }


    if (partnerBid.value != BidValue.pass && raiseStrength != null)
    {
      // Check and see if my raise + their bid is > my strongest bid
      var proposedBid: Bid = new Bid(raiseStrength.suit, raiseStrength.raiseValue + partnerBid.value)

      if (proposedBid.Points > myBid.Points)
      {
        myBid = proposedBid;
      }
    }

    if (myBid.value == BidValue.six &&
      partnerBid.value == BidValue.pass &&
      enemyBid.value == BidValue.pass)
    {
      // Set it to seven, we've got two passes in front of us
      myBid.value = BidValue.seven;
    }

    if (myBid.Points <= enemyBid.Points || myBid.value == BidValue.six || myBid.Points <= partnerBid.Points)
    {
      myBid = Bids.Pass();
    }

    return myBid;
  }

  private fourthBid(set: Set, player: SetPlayer ): Bid  {
    var partner: SetPlayer = _.find(set.Players, { Id: set.PlayerBiddingOrder[1] });
    var enemy1Bid: Bid = _.find(set.Players, { Id: set.PlayerBiddingOrder[0] }).Bid;
    var enemy2Bid: Bid = _.find(set.Players, { Id: set.PlayerBiddingOrder[2] }).Bid;
    var partnerBid: Bid = partner.Bid != null ? partner.Bid : Bids.Pass();
    var highEnemyBid: Bid = enemy1Bid.Points > enemy2Bid.Points ? enemy1Bid : enemy2Bid;

    var myBid: Bid = player.StrongestBid;

    // don't need to overbid or up a 9 bid, would do more harm than good
    if (partnerBid.value > BidValue.eight)
    {
      myBid = Bids.Pass();
      return myBid;
    }

    // calculate what we can do given our partners bid and our hand
    var raiseStrength: RaiseStrength = RaiseStrengthHelpers.GetSupportingStrength(player.Hand.Cards, partnerBid);

    var offsuitValue: number = 0;
    if (raiseStrength.dependsOnOffsuit)
    {
      offsuitValue = OffsuitStrengthHelpers.getOffsuitStrength(player.Hand.Cards, partnerBid.suit);
      if (offsuitValue > 0)
      {
        offsuitValue = 1;
      }
    }

    raiseStrength.raiseValue += offsuitValue;

    if (partnerBid.value != BidValue.pass && raiseStrength != null)
    {
      // Check and see if my raise + their bid is > my strongest bid
      var proposedBid: Bid = new Bid(raiseStrength.suit, raiseStrength.raiseValue + partnerBid.value);
      if (proposedBid.Points > myBid.Points)
      {
        myBid = proposedBid;
      }
    }

    if (myBid.value == BidValue.six &&
      partnerBid.value == BidValue.pass &&
      enemy1Bid.value == BidValue.pass &&
      enemy2Bid.value == BidValue.pass)
    {
      // Set it to seven, we've got three passes in front of us
      myBid.value = BidValue.seven;
    }

    if (myBid.value == BidValue.six &&
      partnerBid.value == BidValue.pass &&
      highEnemyBid.value == BidValue.pass)
    {
      // Set it to seven, we've got 3 passes in front of us
      myBid.value = BidValue.seven;
    }

    if (myBid.Points <= highEnemyBid.Points || myBid.value == BidValue.six || myBid.Points <= partnerBid.Points)
    {
      myBid = Bids.Pass();
    }

    return myBid;
  }
}
