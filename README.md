# Code Breaker Challenge

A site that allows a user to play or solve the mastermind code game.

The game:

Player 1 selects 4 coloured, ordered pegs (i.e. fills 4 empty peg positions) which constitute the code. Pegs are selected from a set of 8 colours. Repeated colours are allowed.

Player 2 has to deduce the code. For each round, they submit a guess. They get feedback for their guess, which consists of:

- the number of pegs that are of the correct colour and are in the correct position

- the number of pegs that are of the correct colour but are not in the correct place.

The game ends when player 2 correctly guesses the code (player 2 wins), or after 10 rounds have been played (player 1 wins).

This project was initially built with [Lovable](https://lovable.dev).

## Development

You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
