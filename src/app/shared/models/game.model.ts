import * as _ from 'lodash';
import { PlayerType, Position } from '@app/shared/models/types.enums';
import { GamePlayer } from '@app/shared/models/game-player.model';
import { Team } from '@app/shared/models/team.model';
import { Set } from '@app/shared/models/set.model';
import {Card, SetPlayer} from '@app/shared/models/index';

export class Game {
  Id: number;
  Players: GamePlayer[] = [];
  StartingBidPlayerId: number;
  Sets: Set[] = [];

  private team1Id: number = 1;
  private team2Id: number = 2;
  Team1: Team;
  Team2: Team;
  WinningTeamId: number;

  TestCaseId: number = 0;

  constructor(testCaseId: number = 0){
   this.Team1 = new Team(this.team1Id);
   this.Team2 = new Team(this.team2Id);
   this.TestCaseId = testCaseId;
  }

  SetupGame(){
    var player1 = new GamePlayer(Math.floor(Math.random() * 100000) + 100000, "Player 1", Position.first, PlayerType.human, this.team1Id);
    var player2 = new GamePlayer(Math.floor(Math.random() * 100000) + 100000, "Player 2", Position.second, PlayerType.computer, this.team2Id);
    var player3 = new GamePlayer(Math.floor(Math.random() * 100000) + 100000, "Player 3", Position.third, PlayerType.computer, this.team1Id);
    var player4 = new GamePlayer(Math.floor(Math.random() * 100000) + 100000, "Player 4", Position.fourth, PlayerType.computer, this.team2Id);

    this.Players.push(player1);
    this.Players.push(player2);
    this.Players.push(player3);
    this.Players.push(player4);

    this.Team1.TeamMember1Id = _.find(this.Players, { SeatingPosition: Position.first }).Id;
    this.Team1.TeamMember2Id = _.find(this.Players, { SeatingPosition: Position.third }).Id;
    this.Team2.TeamMember1Id = _.find(this.Players, { SeatingPosition: Position.second }).Id;
    this.Team2.TeamMember2Id = _.find(this.Players, { SeatingPosition: Position.fourth }).Id;
  }

  get activeSet(): Set {
    if(this.Sets && this.Sets.length > 0){
      return this.Sets[this.Sets.length - 1];
    }

    return null;
  }

  get blindCards(): Card[]{
    if(this.activeSet){
      return this.activeSet.Blind.Cards;
    }
    return [];
  }

  get player1(): SetPlayer{
    return this.getPlayer(Position.first);
  }
  get player1BiddingPosition(): Position {
    return this.activeSet.PlayerBiddingOrder.indexOf(this.player1.Id) + 1;
  }

  get player2(): SetPlayer{
    return this.getPlayer(Position.second);
  }
  get player2BiddingPosition(): Position {
    return this.activeSet.PlayerBiddingOrder.indexOf(this.player2.Id) + 1;
  }

  get player3(): SetPlayer{
    return this.getPlayer(Position.third);
  }
  get player3BiddingPosition(): Position {
    return this.activeSet.PlayerBiddingOrder.indexOf(this.player3.Id) + 1;
  }

  get player4(): SetPlayer {
    return this.getPlayer(Position.fourth);
  }
  get player4BiddingPosition(): Position {
    return this.activeSet.PlayerBiddingOrder.indexOf(this.player4.Id) + 1;
  }

  private getPlayer(position: Position) : SetPlayer {
    if(this.activeSet){
      return _.find(this.activeSet.Players, (player: SetPlayer) => player.SeatingPosition == position);
    }

    return null;
  }

  get Team1Score(): number
  {
    return _(this.Sets)
      .filter((set: Set) => set.WinningTeamId == this.Team1.Id)
      .map((set: Set) => set.PointsWon - set.PointsLost)
      .sum()
      .value();
  }

  get Team2Score(): number
  {
    return _(this.Sets)
      .filter((set: Set) => set.WinningTeamId == this.Team2.Id)
      .map((set: Set) => set.PointsWon - set.PointsLost)
      .sum()
      .value();
  }
  get CurrentSet(): Set
  {
    return _.takeRight(this.Sets, 1);
  }
}
