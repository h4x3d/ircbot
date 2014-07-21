# ircbot

### Commands

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

##### `!auth login [username] [password]`

Log in
<hr>

##### `!auth logout`

Log out
<hr>

### Development

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
