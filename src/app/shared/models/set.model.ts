import * as _ from 'lodash';
import {SetPlayer} from '@app/shared/models/set-player.model';
import {Hand} from '@app/shared/models/hand.model';
import {Game} from '@app/shared/models/game.model';
import {Card, Cards} from '@app/shared/models/card.model';
import {Bid, Bids} from '@app/shared/models/bid.model';
import {GamePlayer} from '@app/shared/models/game-player.model';
import {PlayingRound} from '@app/shared/models/playing-round.model';
import {BidValue} from '@app/shared/models/types.enums';

export class Set
{
  Players: SetPlayer[] = [];
  Id: number;
  GameId: number;
  Blind: Hand = new Hand();

  PlayerBiddingOrder: number[] = [];
  PlayingRounds: PlayingRound[] = [];
  WinningTeamId: number;
  PointsWon: number;
  LosingTeamId: number;
  PointsLost: number;

  get CurrentPlayersBidId(): number {

    var currentPlayerBidId = 0;

    _.each(this.PlayerBiddingOrder, ((playerId: number) => {
      if(currentPlayerBidId == 0) {
        var playerWithNoBid = _.find(this.Players, (player: SetPlayer) => {
          return player.Id == playerId && player.Bid == null;
        });

        if (playerWithNoBid != null) {
          currentPlayerBidId = playerId;
        }
      }
    }));

    return currentPlayerBidId;
  }

  get PlayerWhoWonTheBid(): SetPlayer {
    var realBids: Bid[] = _(this.Players)
      .filter(x => x.Bid != null)
      .map(x => x.Bid)
      .sortBy(x => x.value)
      .value();

    if (realBids.length == 4 && _.find(realBids, (bid: Bid) => (bid.value > BidValue.six))) {
      return _.find(this.Players, (x => x.Bid.Points == realBids[realBids.length - 1].Points));
    }

    return null;
  }

  get Redeal(): boolean {
    return this.PlayerWhoWonTheBid == null && this.CurrentPlayersBidId == 0;
  }

  get BiddingComplete(): boolean {
    return this.PlayerWhoWonTheBid != null;
  }

  get CurrentPlayingRound(): PlayingRound {
    return _.takeRight(this.PlayingRounds, 1);
  }

  get HighBid(): Bid {
    var maxBid: Bid = null;

    if (this.Bids)
    {
      _.each(this.Bids, (bid) =>
      {
        if (maxBid == null || bid.Points > maxBid.Points)
        {
          maxBid = bid;
        }
      });
    }

    return maxBid;
  }

  get Bids(): Bid[] {
    if (this.Players && this.Players.length > 0)
    {
      return _(this.Players).filter(x => x.Bid != null).map(x => x.Bid).value();
    }

    return [];
  }

  get AllowedBids(): Bid[]  {
    if(this.Bids.length == 0 || _.filter(this.Bids, (bid: Bid) => { return bid.Points > 0 }).length == 0) {
      return Bids.allBids();
    }
    else {
      var allAllowedBids: Bid[]  = [Bids.Pass()];
      allAllowedBids = allAllowedBids.concat(_.filter(Bids.allBids(), (x => x.Points > this.HighBid.Points)));
      return allAllowedBids;
    }
  }

  // Helper functions
  AttachToGame(game: Game) {
    this.GameId = game.Id;
    this.BuildBiddingOrder(game.Players);
  }

  StartNewRound() {
    this.PlayingRounds.push(new PlayingRound(this.PlayerWhoWonTheBid.Id, this.BuildPlayingOrder(this.PlayerWhoWonTheBid.Id)));
  }

  Deal() {
    // Deal in the standard 500 style, 3 - 4 - 3
    // Blind is dealt 3 - 2 - 0
    var deck = Cards.NewShuffledDeck();

    // 3
    deck = this.AddCards(3, this.Players[0].Hand, deck);
    deck = this.AddCards(3, this.Players[1].Hand, deck);
    deck = this.AddCards(3, this.Players[2].Hand, deck);
    deck = this.AddCards(3, this.Players[3].Hand, deck);
    deck = this.AddCards(3, this.Blind, deck);

    // 4
    deck = this.AddCards(4, this.Players[0].Hand, deck);
    deck = this.AddCards(4, this.Players[1].Hand, deck);
    deck = this.AddCards(4, this.Players[2].Hand, deck);
    deck = this.AddCards(4, this.Players[3].Hand, deck);

    deck = this.AddCards(2, this.Blind, deck);

    // 3
    deck = this.AddCards(3, this.Players[0].Hand, deck);
    deck = this.AddCards(3, this.Players[1].Hand, deck);
    deck = this.AddCards(3, this.Players[2].Hand, deck);
    deck = this.AddCards(3, this.Players[3].Hand, deck);

    this.Players[0].Hand.Sort();
    this.Players[1].Hand.Sort();
    this.Players[2].Hand.Sort();
    this.Players[3].Hand.Sort();
    this.Blind.Sort();
  }

  private AddCards(count: number, hand: Hand, deck: Card[]): Card[] {
    if (deck.length == count)
    {
      hand.Cards = hand.Cards.concat(deck);
      deck = [];
    }
    else
    {
      var cardsToAdd = _.take(deck, count);
      hand.Cards = hand.Cards.concat(cardsToAdd);
      deck = _.drop(deck, count);
    }

    return deck;
  }

  RandomPlayerId(players: GamePlayer[]): number {
    var randomNumber = Math.floor(Math.random() * 4) + 1
    var player = _.find(players, (x => x.SeatingPosition == randomNumber));
    return player.Id;
  }

  BuildBiddingOrder(players: GamePlayer[]) {
    var setPlayers: SetPlayer[] = [];
    _.each(players, (player: GamePlayer) => {
      setPlayers.push(new SetPlayer(player));
    });

    this.Players = setPlayers;

    // Build the bidding order
    var biddingOrder: number[] = [];
    var startingBidder: number = this.RandomPlayerId(players);
    var firstBidder: GamePlayer = _.find(players, { Id: startingBidder });
    var nextBidderPosition: number = firstBidder.SeatingPosition;

    biddingOrder.push(firstBidder.Id);

    while (biddingOrder.length < 4)
    {
      nextBidderPosition++;
      if (nextBidderPosition > 4)
      {
        nextBidderPosition = 1;
      }

      var nextBidder: GamePlayer = _.find(players, { SeatingPosition: nextBidderPosition });
      biddingOrder.push(nextBidder.Id);
    }

    this.PlayerBiddingOrder = biddingOrder;
  }

  private BuildPlayingOrder(leadingPlayerId: number): number[] {
    var playingOrder: number[] = [];
    var firstPlayer: SetPlayer = _.find(this.Players, { Id: leadingPlayerId });
    var nextPlayerPosition = firstPlayer.SeatingPosition;

    playingOrder.push(firstPlayer.Id);

    while (playingOrder.length < 4)
    {
      nextPlayerPosition++;
      if (nextPlayerPosition > 4)
      {
        nextPlayerPosition = 1;
      }

      var nextPlayer: SetPlayer = _.find(this.Players, { SeatingPosition: nextPlayerPosition });
      playingOrder.push(nextPlayer.Id);
    }

    return playingOrder;
  }
}
