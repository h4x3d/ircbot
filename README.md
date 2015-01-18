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

Create `config.json` file. See [config.template.json](https://github.com/h4x3d/ircbot/blob/master/config.template.json) for possible options.
The config file consists of environment specific blocks. Environment variable `NODE_ENV` determines which block is used. If the environment variable is not present, the `development` block will be selected. 
`all` block is always used and the block selected is merged into it so that it overwrites the values defined in it.


Start your bot
```
node index.js
```

## Usage

### Channels
Handles joining/leaving channels

#### Commands

##### `!join [channel]`

Joins to channel
<hr>

##### `!join [channel] [password]`

Joins to channel with password
<hr>

##### `!part [channel]`

Leaves channel
<hr>

##### `!part [channel] [message]`

Leaves channel with part message
<hr>

### Say
Handles sending messages to channel or nickname

#### Commands

##### `!say [target] [message]`

Sends a message to given target (channel or nickname)
<hr>

### Auth
Handles commands for user authentication and user management

#### Commands

##### `!auth help`

List all commands
<hr>

##### `!auth users`

List all user
<hr>

##### `!auth create [username]`

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

* _optional_ Install and start [UnrealIRCd](http://www.unrealircd.com/) 

* Start bot
```
node index.js
```

`npm test` only passes if you have ircserver running in port 6667 on your local machine
