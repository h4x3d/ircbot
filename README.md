# ircbot

## Installation
### Requirements
* [node.js](http://nodejs.org/)
* [mongodb](http://www.mongodb.org/downloads)

Clone this repository and install dependencies
```
git clone git@github.com:h4x3d/ircbot.git
cd ircbot
npm install
```

Start your bot
```
node index.js
```

## Usage

### Auth
Handles commands for user authentication and user management

#### Commands

##### `!auth help`

List all commands
<hr>

##### `!auth users`

List all user
<hr>

##### `!auth create [username] [password]`

Create a new user
<hr>

##### `!auth remove [username]`

Remove user
<hr>

##### `!auth change-pass [password]`

Change password
<hr>

##### `!auth reset-pass [username]`

Reset password
<hr>

##### `!auth login [username] [password]`

Log in
<hr>

##### `!auth logout`

Log out
<hr>
---

## Development

* Install package
```
git clone git@github.com:h4x3d/ircbot.git
cd ircbot
npm install
```

* Install and start [UnrealIRCd](http://www.unrealircd.com/)

* Start bot
```
node index.js
```
