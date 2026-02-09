*This project has been created as part
of the 42 curriculum by amagnell, andmart2, josorteg, kkoval and tatahere*

## Description
Our ft_transendence consists of a web application where users can play pong against another user locally, without registering, or also remotely if they're signed in. 

With registration users are able to have a personalized display name and avatar, friend other registered users, and look at their game history and statistics.

## Instructions
Prerequisites:
- Docker installed in your PC
- .env files where there are env.example files

Clone the project then run `docker compose up` in the root of the repository. 
## Team Information

## Project management
We organized ourselves through a Whatsapp group chat where we shared our advancements and where we coordinated for meetings and tasks.

At first we had a scheduled video call, specially because all team memebers had other responsabilities outside the project, but once the project was more advanced we slowed the meetings up for more specific coordination.

In the docs folder we have some other documents that were useful in managing the project and keeping team objectives on track.

## Technical Stack
**Frontend:** Vue with Tailwind CSS

**Backend:** Fastify

**Database:** Sqlite
## Database Schema
![alt text](docs/db_schema.png)
Our initial design of the database.

As of our latest implementation we lack the achievements table where we fell short on time.
## Features List
Mandatory requirements:
- Frontend                  -   andmart2, kkoval, tatahere
- Backend                   -   amagnell, josorteg, kkoval
- Database                  -   josorteg
- Containerized deployement -   amagnell
- User management system    -   amagnell, josorteg

Modules:
- Websockets                -   kkoval
- API                       -   josorteg
- Design system             -   andmart2, tatahere
- User management and auth  -   amagnell, josorteg
- Game statistics           -   josorteg, tatahere
- Remote authentication     -   amagnell
- Web-based game            -   kkoval
- Remote players            -   kkoval

## Modules

| Module                                                             | Points  |
| ------------------------------------------------------------------ | ------- |
| Use a framework for both the frontend and backend                  | 2       |
| Implement real-time features using WebSockets or similar technology| 2       |
| A public API to interact with the database with a secured API key  | 2       |
| Custom-made design system with reusable components                 | 1       |
| Standard user management and authentication                        | 2       |
| Game statistics and match history                                  | 1       |
| Implement remote authentication with OAuth 2.0.                    | 1       |
| Implement a web-based game where users can play against each other | 2       |
| Remote players                                                     | 2       |
| **TOTAL**                                                          | **15**  |

This project began with the old requirements then we decided to adapt it to the new subject, which we thought would make for a more solid project. 

Because this was a Pong project from the start with some features already decided before the new list of modules was available the biggest change was dropping the tournament system where we foresaw some issues which would be difficult to solve in our limited time frame to finish the project.
### Use frameworks for both the backend and frontend

With the mandatory requirement of having a frontend and a backend it seemed logical to complete these modules by adding a framework to each one.

In the backend we went with Fastify following the previous subject and in the frontend we decided on Vue because our team was unfamiliar with javascript and frontend development and Vue appeared friendlier to newbies.

### Web Game, Websockets, and Remote players

The Pong game implementation was mainly inspired and followed the logic of the original Pong 1971 game. We decided to use Authoritative server architecture. All calculations and general managment of movement of paddles, ball and score of the game resides on the backend container and frontend only renders the image using Canvas Api. This way we protect our game from possible cheating and secure the same rendering image for both players. The comunication happens via web sockets, where front end sends an message every time  player presses the keys to backend and backend does a calculation of movement and collisions and sends an updated game state of ball, paddles and scores to be rendered by frontend.

### Public API

### Custom design system with reusable components

### Standard user management

This module was another natural choice as basic user management was already required and adding the features needed simply filled out the feature. 

Users can see their information in their user page and modify their nickname and or avatar in their setting page.

Users can upload avatars which are saved in our server and the route to the image is saved in our database which the frontend uses to render it on the client.

### Game statistics and match history

The pong games played are stored in a database with score, winner, difference in point. This data is used to show a user's game history on their profile and also keep a leaderboard of the players with the most ranking points, something calculated by their number of wins and multiplier factor.

### Remote authentication with OAuth 2.0

Github OAuth 2.0 has been implemented, there's an option to instead of registering via email and password to sign up with Github. After you've signed up with it you can sign with it in the sign in page. It was implemented with @fastify/oauth2 plugin plus the @fastify/cookie plugin. To implement it, the users entity in the database had to be slightly modified, the password and email were made nullable and a githubid field was added. The logic of login and registration of github users and normal users is separated.

## Individual Contributions


## Resources

### AI usage

