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

  get CardsPlayed(): Card[]{
    var cards: Card[] = [];

    if(this.Card1Play != null){
      cards.push(this.Card1Play);
    }
    if(this.Card2Play != null){
      cards.push(this.Card2Play);
    }
    if(this.Card3Play != null){
      cards.push(this.Card3Play);
    }
    if(this.Card4Play != null){
      cards.push(this.Card4Play);
    }

    return cards;
  }
}
