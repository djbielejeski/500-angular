import {IPlayerBaseModel} from '@app/shared/models/player-base.model';
import {PlayerType, Position, Suit} from '@app/shared/models/types.enums';
import {Hand} from '@app/shared/models/hand.model';
import {Bid} from '@app/shared/models/bid.model';
import {HandStrength, HandStrengthHelpers} from '@app/shared/models/hand-strength.model';

export class SetPlayer implements IPlayerBaseModel {
  Id: number;
  PlayerType: PlayerType;
  Hand: Hand;
  Name: string;
  SeatingPosition: Position;
  TeamId: number;

  // Non-Inherited Properties
  Bid: Bid;

  get StrongestSuit(): HandStrength
  {
      var strongestBid: HandStrength = this.HeartsStrength;
      if (this.DiamondsStrength.bidValue > strongestBid.bidValue)
      {
        strongestBid = this.DiamondsStrength;
      }

      if (this.ClubsStrength.bidValue > strongestBid.bidValue)
      {
        strongestBid = this.ClubsStrength;
      }

      if (this.SpadesStrength.bidValue > strongestBid.bidValue)
      {
        strongestBid = this.SpadesStrength;
      }

      return strongestBid;
  }

  get SpadesStrength() : HandStrength
  {
    return HandStrengthHelpers.getStrength(this.Hand.Cards, Suit.spades);
  }

  get ClubsStrength() : HandStrength
  {
    return HandStrengthHelpers.getStrength(this.Hand.Cards, Suit.clubs);
  }
  get DiamondsStrength() : HandStrength
  {
    return HandStrengthHelpers.getStrength(this.Hand.Cards, Suit.diamonds);
  }
  get HeartsStrength() : HandStrength
  {
    return HandStrengthHelpers.getStrength(this.Hand.Cards, Suit.hearts);
  }
}
