import * as _ from 'lodash';
import {CardValue, Suit, Suits} from '@app/shared/models/types.enums';

export class Card {
  suit: Suit;
  value: CardValue;

  constructor(_suit: Suit, _value: CardValue){
    this.suit = _suit;
    this.value = _value;
  }

  get cssClass(): string {

    var _value: CardValue = this.value;
    var _suit: Suit = this.suit;

    if(_value == CardValue.leftBauer){
      _value = CardValue.jack;
      if (_suit == Suit.clubs) { _suit = Suit.spades; }
      else if (_suit == Suit.hearts) { _suit = Suit.diamonds; }
      else if (_suit == Suit.diamonds) { _suit = Suit.hearts; }
      else if (_suit == Suit.spades) { _suit = Suit.clubs; }
    }
    else if (_value == CardValue.rightBauer) {
      _value = CardValue.jack;
    }
    else if (_value == CardValue.joker) {
      _suit = Suit.none;
    }

    return 'playing-card-' + this.getSuitNameAsString(_suit) + '-' + _value;
  }

  private getSuitNameAsString(_suit: Suit){
    return Suit[_suit];
  }

  fixValue(trumpSuit: Suit){
    // This only matters for Joker and Jacks
    if (this.value == CardValue.joker || this.value == CardValue.jack)
    {
      if (this.value == CardValue.joker)
      {
        this.suit = trumpSuit;
        return;
      }

      // See if it matches color and is a jack
      if (this.value == CardValue.jack && Suits.getColor(this.suit) == Suits.getColor(trumpSuit))
      {
        if (this.suit == trumpSuit)
        {
          this.value = CardValue.rightBauer;
        }
        else
        {
          this.value = CardValue.leftBauer;
          this.suit = trumpSuit;
        }
      }
    }
  }
}


export namespace Cards {
  export function joker(): Card {
    return new Card(Suit.none, CardValue.joker);
  }

  export function trumpListBySuit(trumpSuit: Suit): Card[]{
    return getTrump(trumpSuit);
  }

  export function getTrump(suit: Suit): Card[]{
    return [
      new Card(suit, CardValue.joker ),
      new Card(suit, CardValue.rightBauer),
      new Card(suit, CardValue.leftBauer),
      new Card(suit, CardValue.ace),
      new Card(suit, CardValue.king),
      new Card(suit, CardValue.queen),
      new Card(suit, CardValue.ten),
      new Card(suit, CardValue.nine),
      new Card(suit, CardValue.eight),
      new Card(suit, CardValue.seven),
      new Card(suit, CardValue.six),
      new Card(suit, CardValue.five),
      new Card(suit, CardValue.four),
    ]
  }

  export function getValue(cards: Card[], suit: Suit): string {
    return Cards.getBidStrengthKey(cards, suit);
  }

  export function getBidStrengthKey(cards: Card[], suit: Suit): string {
    // Joker
    var query = _.find(cards, { value: CardValue.joker }) != null ? "1" : "0";

    // Right Bauer
    query += _.find(cards, { value: CardValue.jack, suit: suit }) != null ? "1" : "0";

    // Left Bauer
    query += _.find(cards, (card: Card) => {
      return card.value == CardValue.jack &&
            card.suit != suit &&
            Suits.getColor(card.suit) == Suits.getColor(suit)
    }) != null ? "1" : "0";

    // Ace
    query += _.find(cards, { value: CardValue.ace, suit: suit }) != null ? "1" : "0";

    // Count of other cards in the suit
    query += _.filter(cards, (card) => {
      return card.suit == suit &&
        card.value != CardValue.jack &&
        card.value != CardValue.ace;
    }).length;

    return query;
  }

export function getOffsuitValue(cards: Card[], suit: Suit) : string
  {
    // Ace
    var query = _.find(cards, { value: CardValue.ace, suit: suit }) != null ? "1" : "0";

    // King
    query += _.find(cards, { value: CardValue.king, suit: suit }) != null ? "1" : "0";

    // Queen
    query += _.find(cards, { value: CardValue.queen, suit: suit }) != null ? "1" : "0";

    //append the total count of other cards in the suit
    query += _.filter(cards, (card) => {
      return card.suit == suit &&
        card.value != CardValue.ace &&
        card.value != CardValue.king &&
        card.value != CardValue.queen &&
        card.value != CardValue.jack;
    }).length;

    return query;
  }

  export function NewShuffledDeck(): Card[]
  {
    var deck: Card[] = [];
    deck.push(joker());

    // Add each of the suits
    _.each(Suits.allSuits(), (suit) => {
      deck.push(new Card(suit, CardValue.four));
      deck.push(new Card(suit, CardValue.five));
      deck.push(new Card(suit, CardValue.six));
      deck.push(new Card(suit, CardValue.seven));
      deck.push(new Card(suit, CardValue.eight));
      deck.push(new Card(suit, CardValue.nine));
      deck.push(new Card(suit, CardValue.ten));
      deck.push(new Card(suit, CardValue.jack));
      deck.push(new Card(suit, CardValue.queen));
      deck.push(new Card(suit, CardValue.king));
      deck.push(new Card(suit, CardValue.ace));
    });

    deck = _.shuffle(deck);

    return deck;
  }
}
