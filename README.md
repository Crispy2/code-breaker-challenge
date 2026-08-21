# Code Breaker Challenge

Create a site that allows a user to play or solve the mastermind code game.

The game:

Player 1 selects 4 coloured, ordered pegs (i.e. fills 4 empty peg positions) which constitute the code. Pegs are selected from a set of 8 colours (white, blue, green, yellow, orange, silver, red, pink). Repeated colours are allowed.

Player 2 has to deduce the code. For each round, they submit a guess. They get feedback for their guess, which consists of:

- the number of pegs that are of the correct colour and are in the correct position

- the number of pegs that are of the correct colour but are not in the correct place.

The game ends when player 2 correctly guesses the code (player 2 wins), or after 10 rounds have been played (player 1 wins).

The site:

- should have separate sections allowing the user to take the role of player 1 or 2

- if the user is player 1, the computer should guess the code. I have existing code to generate guesses - assume that the guesses will be provided by an object implementing a suitable interface, consisting of:

-- set the result of the latest guess

-- generate a new guess

- if the user is player 2, the computer should generate a secret code, allow the users to submit guesses, and provide appropriate feedback on each game.

In both cases, the site should manage the game, so end the game at the appropriate time and display the result.

The look and feel should be intuitive and engaging.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/44d1274e-ce5d-4121-801a-f5e7a0752894).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
