import * as _ from 'lodash';
import {AfterViewInit, Component, OnInit} from '@angular/core';
import {GameService, SetService} from '@app/shared/services';
import {Card, Game, Set, Position, SetPlayer, PlayerType, Bid} from '@app/shared/models';
import {AIBidService} from "@app/shared/services/ai-bid.service";
import {BidValue, Suit} from "@app/shared/models/types.enums";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game;
  showHumanBidOptions: boolean = false;
  availableBidOptions: Bid[] = [];
  humanBid: Bid;

  showBlind: boolean = false;

  private ai_mode: boolean = false;
  private testCase = 6;
  private pause_at_round = 10;
  private pause_at_player_position = 0;

  private set_started: boolean = false;

  constructor(private gameService: GameService, private aiBidService: AIBidService, private setService: SetService){

  }

  ngOnInit(){
    this.newGame();
  }

  newGame(){
    this.set_started = false;

    this.game = this.gameService.StartGame(this.testCase);
    this.getBid();

    if (this.ai_mode && this.set_started) {
      for (var i = 0; i < this.pause_at_round * 4 + this.pause_at_player_position; i++) {
        this.playCard();
      }
    }
  }

  getBid(){
    console.log("Getting bid");
    var playerWhoseBidItIs = this.game.activeSet.PlayerWhoseBidItIs();

    if (!this.ai_mode && playerWhoseBidItIs.PlayerType == PlayerType.human){
      this.showHumanBidOptions = true;
      this.availableBidOptions = this.aiBidService.availableBids(this.game.activeSet);
      this.humanBid = this.availableBidOptions[0];
    }
    else {
      this.aiBidService.getBid(this.game.activeSet);
      if (!this.game.activeSet.BiddingComplete){
        this.getBid();
      }
      else {
        return;
      }
    }

    if(this.game.activeSet.BiddingComplete && this.game.activeSet.Redeal){
      console.warn("Redeal!");
      this.newGame();
    }
    else if (this.game.activeSet.BiddingComplete && !this.game.activeSet.Redeal) {
      this.setService.fixAllCardsForNewTrumpSuit(this.game.activeSet);

      if(!this.ai_mode && this.game.activeSet.PlayerWhoWonTheBid.PlayerType == PlayerType.human){
        this.showBlind = true;
        // Merge the blind cards with the human's cards
        _.each(this.game.activeSet.Blind.Cards, (blindCard: Card) => {
          this.game.activeSet.PlayerWhoWonTheBid.Hand.Cards.push(blindCard);
        });

        this.game.activeSet.PlayerWhoWonTheBid.Hand.Sort();
        this.game.activeSet.Blind.Cards = [];
      }
      else if (!this.set_started) {
        this.set_started = true;
        this.setService.resolveBlind(this.game.activeSet);
        console.log(this.game);
        // start the round!
        this.setService.startNewRound(this.game.activeSet);
      }
    }
  }

  selectHumanBid() {
    this.showHumanBidOptions = false;
    this.game.activeSet.PlayerWhoseBidItIs().Bid = this.humanBid;
    this.getBid();
  }

  blindCardClick(card: Card) {
    // / put the card back into the player's hand
    this.game.activeSet.Blind.Cards = _.filter(this.game.activeSet.Blind.Cards, (blindCard: Card) => blindCard.value != card.value || blindCard.suit != card.suit);
    this.game.activeSet.PlayerWhoWonTheBid.Hand.Cards.push(card);
    this.game.activeSet.PlayerWhoWonTheBid.Hand.Sort();

  }

  cardClick(card: Card) {
    // if we are resolving the blind, on click move the card to the blind
    if(this.showBlind){
      if(this.game.activeSet.Blind.Cards.length < 5){
        this.game.activeSet.PlayerWhoWonTheBid.Hand.Cards = _.filter(this.game.activeSet.PlayerWhoWonTheBid.Hand.Cards, (myCard: Card) => myCard.value != card.value || myCard.suit != card.suit);
        this.game.activeSet.Blind.Cards.push(card);
      }
    }
    else{
      console.log("todo: play card");
    }
  }

  discardBlind() {
    this.showBlind = false;
    this.setService.startNewRound(this.game.activeSet);
  }

  playCard(){
    if(this.game.activeSet.PlayingRounds.length == 10 && this.game.activeSet.CurrentPlayingRound.CardsPlayed.length == 4){
      console.log("Game Over!");
    }
    else {
      if (this.game.activeSet.CurrentPlayingRound.CardsPlayed.length == 4) {
        this.setService.startNewRound(this.game.activeSet);
      }

      this.setService.playCard(this.game.activeSet);
    }
  }

}
