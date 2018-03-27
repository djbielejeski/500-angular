import * as _ from 'lodash';
import {BidValue, CardValue, Suit} from '@app/shared/models/types.enums';
import {SetPlayer} from '@app/shared/models/set-player.model';

export class Bid {
  suit: Suit;
  value: BidValue;

  constructor(_suit: Suit, _value: BidValue){
    this.suit = _suit;
    this.value = _value;
  }

  get BidDisplay(): string {
    if(this.value == BidValue.pass){
      return "Pass";
    }

    return this.value + " of " + this.suit;
  }

  get Points(): number {
    // Did they pass?
    if(this.value == BidValue.pass){
      return 0;
    }

    // They didn't pass
    // Suit base amount
    var baseAmount: number = 40;
    if (this.suit == Suit.clubs)
    {
      baseAmount += 20;
    }
    else if (this.suit == Suit.diamonds)
    {
      baseAmount += 40;
    }
    else if (this.suit == Suit.hearts)
    {
      baseAmount += 60;
    }

    // Values base amount
    if (this.value == BidValue.seven)
    {
      baseAmount += 100;
    }
    else if (this.value == BidValue.eight)
    {
      baseAmount += 200;
    }
    else if (this.value == BidValue.nine)
    {
      baseAmount += 300;
    }
    else if (this.value == BidValue.ten)
    {
      baseAmount += 400;
    }

    return baseAmount;

  }
}

export namespace Bids {
  export function highestBid(players: SetPlayer[]): SetPlayer {
    return _(players)
          .filter((player: SetPlayer) => player.Bid != null)
          .sortBy((player: SetPlayer) => player.Bid.Points)
          .takeRight(1);
    //return players.Where(x => x.Bid != null).OrderBy(x => x.Bid.Points).FirstOrDefault();
  }

  export function Pass(): Bid {
    return new Bid(Suit.none, BidValue.pass);
  }

  export function allBids(): Bid[]{
   var allBids: Bid[] = [];
    allBids.push(new Bid(Suit.none, BidValue.pass));

    // 6 bids
    allBids.push(new Bid(Suit.spades, BidValue.six));
    allBids.push(new Bid(Suit.clubs, BidValue.six));
    allBids.push(new Bid(Suit.diamonds,BidValue.six));
    allBids.push(new Bid(Suit.hearts, BidValue.six));

    // 7 bids
    allBids.push(new Bid(Suit.spades, BidValue.seven));
    allBids.push(new Bid(Suit.clubs, BidValue.seven));
    allBids.push(new Bid(Suit.diamonds, BidValue.seven));
    allBids.push(new Bid(Suit.hearts, BidValue.seven));

    // 8 bids
    allBids.push(new Bid(Suit.spades, BidValue.eight));
    allBids.push(new Bid(Suit.clubs, BidValue.eight));
    allBids.push(new Bid(Suit.diamonds, BidValue.eight));
    allBids.push(new Bid(Suit.hearts, BidValue.eight));

    // 9 bids
    allBids.push(new Bid(Suit.spades, BidValue.nine));
    allBids.push(new Bid(Suit.clubs, BidValue.nine));
    allBids.push(new Bid(Suit.diamonds, BidValue.nine));
    allBids.push(new Bid(Suit.hearts, BidValue.nine));

    // 10 bids
    allBids.push(new Bid(Suit.spades, BidValue.ten));
    allBids.push(new Bid(Suit.clubs, BidValue.ten));
    allBids.push(new Bid(Suit.diamonds, BidValue.ten));
    allBids.push(new Bid(Suit.hearts, BidValue.ten));

    return allBids;
  }
}
