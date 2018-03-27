import {Card} from '@app/shared/models/card.model';

export class PlayingRound {
  PlayerWhoseTurnItIs: number;
  PlayerPlayingOrder: number[];
  WinningPlayerId: number;
  Card1Play: Card;
  Card2Play: Card;
  Card3Play: Card;
  Card4Play: Card;

  constructor(_PlayerWhoseTurnItIs: number, _PlayerPlayingOrder: number[]){
    this.PlayerWhoseTurnItIs = _PlayerWhoseTurnItIs;
    this.PlayerPlayingOrder = _PlayerPlayingOrder;
  }
}
