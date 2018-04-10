import {IPlayerBaseModel} from '@app/shared/models/player-base.model';
import {BidValue, PlayerType, Position, Suit, Suits} from '@app/shared/models/types.enums';
import {Hand} from '@app/shared/models/hand.model';
import {Bid, Bids} from '@app/shared/models/bid.model';
import {HandStrength, HandStrengthHelpers} from '@app/shared/models/hand-strength.model';
import {GamePlayer} from '@app/shared/models/game-player.model';

export class SetPlayer implements IPlayerBaseModel {
  Id: number;
  PlayerType: PlayerType;
  Hand: Hand;
  Name: string;
  SeatingPosition: Position;
  TeamId: number;

  constructor(player: GamePlayer){
    this.Id = player.Id;
    this.PlayerType = player.PlayerType;
    this.Hand = new Hand();
    this.Name = player.Name;
    this.SeatingPosition = player.SeatingPosition;
    this.TeamId = player.TeamId;
  }

  // Non-Inherited Properties
  Bid: Bid;

  get StrongestBid() : Bid {
    return new Bid(this.StrongestSuit.suit, this.StrongestSuit.bidValue);
  }

  get StrongestSuit(): HandStrength {
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

      if (strongestBid.bidValue == BidValue.pass) {
        strongestBid = new HandStrength(Suit.none);
        strongestBid.bidValue = BidValue.pass;
      }

      return strongestBid;
  }

  get SpadesStrength() : HandStrength {
    return HandStrengthHelpers.getStrength(this.Hand.Cards, Suit.spades);
  }

  get ClubsStrength() : HandStrength {
    return HandStrengthHelpers.getStrength(this.Hand.Cards, Suit.clubs);
  }
  get DiamondsStrength() : HandStrength {
    return HandStrengthHelpers.getStrength(this.Hand.Cards, Suit.diamonds);
  }
  get HeartsStrength() : HandStrength {
    return HandStrengthHelpers.getStrength(this.Hand.Cards, Suit.hearts);
  }
}
