import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
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

  private testCase = 1;
  private enable_pause = false;
  private pause_at_round = 8;
  private pause_at_player_position = 0;

  constructor(private gameService: GameService, private aiBidService: AIBidService, private setService: SetService){

  }

  ngOnInit(){
    this.newGame();
  }

  newGame(){
    this.game = this.gameService.StartGame(this.testCase);
    this.getBid();
  }

  getBid(){
    var playerWhoseBidItIs = this.game.activeSet.PlayerWhoseBidItIs();

    if (playerWhoseBidItIs.PlayerType == PlayerType.human){
      this.showHumanBidOptions = true;
      this.availableBidOptions = this.aiBidService.availableBids(this.game.activeSet);
      this.humanBid = this.availableBidOptions[0];
    }
    else {
      this.aiBidService.getBid(this.game.activeSet);
      if (!this.game.activeSet.BiddingComplete){
        this.getBid();
      }
    }

    if(this.game.activeSet.BiddingComplete && this.game.activeSet.Redeal){
      console.warn("Redeal!");
      this.newGame();
    }
    else if (this.game.activeSet.BiddingComplete && !this.game.activeSet.Redeal) {
      this.setService.fixAllCardsForNewTrumpSuit(this.game.activeSet);

      this.setService.resolveBlind(this.game.activeSet);
      console.log(this.game);

      // start the round!
      this.setService.startNewRound(this.game.activeSet);

      if(this.enable_pause) {
        for (var i = 0; i < this.pause_at_round * 4 + this.pause_at_player_position; i++) {
          this.playCard();
        }
      }
    }
  }

  selectHumanBid() {
    this.showHumanBidOptions = false;
    this.game.activeSet.PlayerWhoseBidItIs().Bid = this.humanBid;
    this.getBid();
  }

  playCard(){
    if(this.game.activeSet.CurrentPlayingRound.CardsPlayed.length == 4){
        this.setService.startNewRound(this.game.activeSet);
    }

    this.setService.playCard(this.game.activeSet);
  }

}
