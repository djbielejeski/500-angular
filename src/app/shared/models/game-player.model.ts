import {PlayerType, Position} from '@app/shared/models/types.enums';

export class GamePlayer {
  Id: number;
  Name: string;
  SeatingPosition: Position;
  PlayerType: PlayerType;
  TeamId: number;

  constructor(playerId: number, name: string, seatingPosition: Position, playerType: PlayerType, teamId: number) {
    this.Id = playerId;
    this.Name = name;
    this.SeatingPosition = seatingPosition;
    this.PlayerType = playerType;
    this.TeamId = teamId;
  }
}
