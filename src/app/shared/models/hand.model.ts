import * as _ from 'lodash';
import {CardValue, Suit} from '@app/shared/models/types.enums';
import {Card} from '@app/shared/models/card.model';

export interface IHandModel {
  Cards: Card[];
  Hearts: Card[];
  Diamonds: Card[];
  Spades: Card[];
  Clubs: Card[];
}

export class Hand implements IHandModel {
  Cards: Card[] = [];

  get Hearts(): Card[] {
    return _.reverse(_.sortBy(_.filter(this.Cards, { suit: Suit.hearts}), 'value'));
  }

  get Diamonds(): Card[] {
    return _.reverse(_.sortBy(_.filter(this.Cards, { suit: Suit.diamonds}), 'value'));
  }

  get Spades(): Card[] {
    return _.reverse(_.sortBy(_.filter(this.Cards, { suit: Suit.spades}), 'value'));
  }

  get Clubs(): Card[] {
    return _.reverse(_.sortBy(_.filter(this.Cards, { suit: Suit.clubs}), 'value'));
  }


  Sort() {
    var sortedCards: Card[] = [];
    var suits: Suit[] = _(this.Cards)
      .filter((card: Card) => { return card.suit != Suit.none})
      .map((card: Card) => card.suit)
      .uniq()
      .value();

    var joker = _.find(this.Cards, { value: CardValue.joker });
    if (joker)
    {
      sortedCards.push(joker);
    }

    if (suits.length == 3)
    {
      if (suits.indexOf(Suit.clubs) != -1 && suits.indexOf(Suit.spades) != -1)
      {
        sortedCards = sortedCards.concat(this.Clubs.length >= this.Spades.length ? this.Clubs : this.Spades);
        sortedCards = sortedCards.concat(this.Diamonds.length >= this.Hearts.length ? this.Diamonds : this.Hearts);
        sortedCards = sortedCards.concat(this.Clubs.length >= this.Spades.length ? this.Spades : this.Clubs);
      }
      else
      {
        sortedCards = sortedCards.concat(this.Hearts.length >= this.Diamonds.length ? this.Hearts : this.Diamonds);
        sortedCards = sortedCards.concat(this.Clubs.length >= this.Spades.length ? this.Clubs : this.Spades);
        sortedCards = sortedCards.concat(this.Hearts.length >= this.Diamonds.length ? this.Diamonds : this.Hearts);
      }
    }
    else
    {
      sortedCards = sortedCards.concat(this.Hearts.length >= this.Diamonds.length ? this.Hearts : this.Diamonds);
      sortedCards = sortedCards.concat(this.Clubs.length >= this.Spades.length ? this.Clubs : this.Spades);
      sortedCards = sortedCards.concat(this.Hearts.length >= this.Diamonds.length ? this.Diamonds : this.Hearts);
      sortedCards = sortedCards.concat(this.Clubs.length >= this.Spades.length ? this.Spades : this.Clubs);
    }

    this.Cards = sortedCards;
  }

}
