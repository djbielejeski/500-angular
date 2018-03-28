import * as _ from 'lodash';
import {Suit, BidValue, Suits} from '@app/shared/models/types.enums';
import {Card, Cards} from '@app/shared/models/card.model';
import {Bid} from '@app/shared/models/bid.model';
import {SetPlayer} from '@app/shared/models/set-player.model';

export class HandStrength {
  public suit: Suit;
  public bidValue: BidValue;
  public dependsOnOffsuit: boolean;

  constructor(_suit: Suit) {
      this.suit = _suit;
  }
}

export namespace HandStrengthHelpers {
  export function getStrength(cards: Card[], suit: Suit): HandStrength {
    var handStrength = new HandStrength(suit);
    switch (Cards.getBidStrengthKey(cards, suit))
    {
      case "00006": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "00007": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "00008": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "00014": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "00015": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "00016": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "00017": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "00103": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "00104": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "00105": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "00106": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "00112": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "00113": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "00114": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "00115": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "01003": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "01004": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "01005": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "01006": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "01012": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "01013": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "01014": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "01102": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "01103": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "01104": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "01105": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "01111": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "01112": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "01113": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "10003": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "10004": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "10005": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "10006": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "10007": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "10012": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "10013": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "10014": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "10015": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "10102": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "10103": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "10104": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "10111": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "10112": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "10113": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "11002": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "11003": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "11004": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "11010": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "11011": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "11012": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "11013": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "11100": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "11101": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "11102": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "11110": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "11111": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = true; break;
      case "0000A": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "11001": handStrength.bidValue = BidValue.six; handStrength.dependsOnOffsuit = false; break;
      case "00009": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "00018": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "00019": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = false; break;
      case "00107": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "00108": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "00116": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "00117": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "01007": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "01008": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "01015": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "01016": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "01017": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "01106": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "01114": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "10008": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "10016": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "10105": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "10106": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "10114": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "10115": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "11005": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "11014": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "11103": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "11104": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "11112": handStrength.bidValue = BidValue.seven; handStrength.dependsOnOffsuit = true; break;
      case "00109": handStrength.bidValue = BidValue.eight; handStrength.dependsOnOffsuit = false; break;
      case "00118": handStrength.bidValue = BidValue.eight; handStrength.dependsOnOffsuit = false; break;
      case "01009": handStrength.bidValue = BidValue.eight; handStrength.dependsOnOffsuit = false; break;
      case "01018": handStrength.bidValue = BidValue.eight; handStrength.dependsOnOffsuit = false; break;
      case "01107": handStrength.bidValue = BidValue.eight; handStrength.dependsOnOffsuit = true; break;
      case "01115": handStrength.bidValue = BidValue.eight; handStrength.dependsOnOffsuit = true; break;
      case "10009": handStrength.bidValue = BidValue.eight; handStrength.dependsOnOffsuit = false; break;
      case "10017": handStrength.bidValue = BidValue.eight; handStrength.dependsOnOffsuit = true; break;
      case "10107": handStrength.bidValue = BidValue.eight; handStrength.dependsOnOffsuit = true; break;
      case "10116": handStrength.bidValue = BidValue.eight; handStrength.dependsOnOffsuit = true; break;
      case "11006": handStrength.bidValue = BidValue.eight; handStrength.dependsOnOffsuit = true; break;
      case "11015": handStrength.bidValue = BidValue.eight; handStrength.dependsOnOffsuit = true; break;
      case "11105": handStrength.bidValue = BidValue.eight; handStrength.dependsOnOffsuit = true; break;
      case "11113": handStrength.bidValue = BidValue.eight; handStrength.dependsOnOffsuit = true; break;
      case "01108": handStrength.bidValue = BidValue.nine; handStrength.dependsOnOffsuit = false; break;
      case "01116": handStrength.bidValue = BidValue.nine; handStrength.dependsOnOffsuit = false; break;
      case "01117": handStrength.bidValue = BidValue.nine; handStrength.dependsOnOffsuit = false; break;
      case "10018": handStrength.bidValue = BidValue.nine; handStrength.dependsOnOffsuit = false; break;
      case "10108": handStrength.bidValue = BidValue.nine; handStrength.dependsOnOffsuit = false; break;
      case "10117": handStrength.bidValue = BidValue.nine; handStrength.dependsOnOffsuit = false; break;
      case "11007": handStrength.bidValue = BidValue.nine; handStrength.dependsOnOffsuit = true; break;
      case "11016": handStrength.bidValue = BidValue.nine; handStrength.dependsOnOffsuit = false; break;
      case "11106": handStrength.bidValue = BidValue.nine; handStrength.dependsOnOffsuit = false; break;
      case "11114": handStrength.bidValue = BidValue.nine; handStrength.dependsOnOffsuit = true; break;
      case "11115": handStrength.bidValue = BidValue.nine; handStrength.dependsOnOffsuit = true; break;
      case "11008": handStrength.bidValue = BidValue.ten; handStrength.dependsOnOffsuit = false; break;
      case "11017": handStrength.bidValue = BidValue.ten; handStrength.dependsOnOffsuit = false; break;
      case "11107": handStrength.bidValue = BidValue.ten; handStrength.dependsOnOffsuit = false; break;
      case "11116": handStrength.bidValue = BidValue.ten; handStrength.dependsOnOffsuit = false; break;
      default:      handStrength.bidValue = BidValue.pass; handStrength.dependsOnOffsuit = false; break;
    }

    var offsuitStrength: number = OffsuitStrengthHelpers.getOffsuitStrength(cards, suit);
    OffsuitStrengthHelpers.applyOffsuit(handStrength, offsuitStrength);

    return handStrength;
  }
}

export namespace OffsuitStrengthHelpers {
  export function getOffsuitStrength(cards: Card[], suit: Suit ): number
  {
    var offsuitStrength = 0;

    _(Suits.allSuits())
      .filter((x: Suit) => x != suit)
      .each((notTrumpSuit: Suit) => {
        var value = Cards.getOffsuitValue(cards, notTrumpSuit);
        switch (value)
        {
          case "0101": offsuitStrength += 1; break;
          case "0102": offsuitStrength += 1; break;
          case "0103": offsuitStrength += 1; break;
          case "0110": offsuitStrength += 1; break;
          case "0111": offsuitStrength += 1; break;
          case "0112": offsuitStrength += 1; break;
          case "1000": offsuitStrength += 1; break;
          case "1001": offsuitStrength += 1; break;
          case "1002": offsuitStrength += 1; break;
          case "1003": offsuitStrength += 1; break;
          case "1004": offsuitStrength += 1; break;
          case "1005": offsuitStrength += 1; break;
          case "1006": offsuitStrength += 1; break;
          case "1010": offsuitStrength += 1; break;
          case "1011": offsuitStrength += 1; break;
          case "1014": offsuitStrength += 1; break;
          case "1015": offsuitStrength += 1; break;
          case "1104": offsuitStrength += 1; break;
          case "1105": offsuitStrength += 1; break;
          case "1113": offsuitStrength += 1; break;
          case "1114": offsuitStrength += 1; break;
          case "1012": offsuitStrength += 2; break;
          case "1013": offsuitStrength += 2; break;
          case "1100": offsuitStrength += 2; break;
          case "1101": offsuitStrength += 2; break;
          case "1102": offsuitStrength += 2; break;
          case "1103": offsuitStrength += 2; break;
          case "1110": offsuitStrength += 2; break;
          default: break;
        }
      });

    // Offsuit cannot bump up a user by more than 2 points.
    if (offsuitStrength > 2)
    {
      offsuitStrength = 2;
    }

    return offsuitStrength;
  }

  export function applyOffsuit( handStrength: HandStrength, offsuitStrength: number) {
    // A six bid cannot go to an eight bid on offsuit alone.
    if (handStrength.bidValue == BidValue.six && offsuitStrength > 0)
    {
      handStrength.bidValue = BidValue.seven;
    }
    else
    {
      var value = (handStrength.bidValue + offsuitStrength);

      // A bid cannot go over 10
      if (value > 10)
      {
        value = 10;
      }

      // Can't have a bid < 6
      if (value >= 6)
      {
        handStrength.bidValue = value;
      }
    }
  }
}
