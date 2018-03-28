export enum BidValue {
  pass = 1,
  six = 6,
  seven = 7,
  eight = 8,
  nine = 9,
  ten = 10
}

export enum CardValue {
  four = 4,
  five = 5,
  six = 6,
  seven = 7,
  eight = 8,
  nine = 9,
  ten = 10,
  jack = 11,
  queen = 12,
  king = 13,
  ace = 14,
  leftBauer = 15,
  rightBauer = 16,
  joker = 17
}

export enum Color {
  red = 0,
  black = 1,
  colorless = 2 // used for joker
}

export enum PlayerType {
  computer = 0,
  human = 1
}

export enum Position{
  first = 1,
  second = 2,
  third = 3,
  fourth = 4
}

export enum RaiseValue {
  zero = 0,
  one = 1,
  two = 2,
  three = 3,
  four = 4
}

export enum Suit {
  hearts = 4,
  diamonds = 3,
  clubs = 2,
  spades = 1,
  none = 0 // used for joker
}

export namespace Suits {
  export function allSuits(): Suit[]{
    return [
      Suit.clubs, Suit.diamonds, Suit.hearts, Suit.spades
    ];
  }

  export function getColor(suit: Suit): Color {
    if (suit == Suit.clubs || suit == Suit.spades)
    {
      return Color.black;
    }
    else if (suit == Suit.diamonds || suit == Suit.hearts)
    {
      return Color.red;
    }
    else
    {
      return Color.colorless;
    }
  }
}
