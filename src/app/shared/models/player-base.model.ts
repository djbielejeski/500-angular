import { PlayerType, Position } from '@app/shared/models/types.enums';
import { Hand } from '@app/shared/models/hand.model';

export interface IPlayerBaseModel {
  Id: number;
  PlayerType: PlayerType;
  Hand: Hand;
  Name: string;
  SeatingPosition: Position;
  TeamId: number;
}
