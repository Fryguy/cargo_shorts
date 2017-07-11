# CargoShorts

[![Build Status](https://travis-ci.org/Fryguy/cargo_shorts.svg?branch=master)](https://travis-ci.org/Fryguy/cargo_shorts)

CargoShorts is a simple set of tools that allow you to create a basic room
system for BlueJeans.  You will need a dedicated microcomputer, camera, TV, and
phone system in each room and thats it.

## Installation

### Set up the in-room microcomputer

1. Install Fedora.

  a. Create a user and set it to Automatic Login.
  b. Go to Settings -> Privacy and disable Screen Lock.
  c. Go to Settings -> Notifications and disable Notification Banners.
  d. Go to Settings -> Power and set Blank Screen to Never.

2. Install Chrome.

  a. Make sure it's the default browser.

3. Do an initial connection to a BlueJeans meeting to get past the first-time tooltips.

  a. Enable camera and audio.
  b. Set microphone, camera, and notifications prompts to Allow, when asked.
  c. Dismiss BlueJeans specific tooltips.
  d. Close the meeting.

4. Create a DNS entry for this computer.

### Installing

1. Install openssl-devel and crystal.
2. Build

   ```bash
   cd ~
   git clone git@github.com:Fryguy/cargo_shorts.git
   cd cargo_shorts
   shards build --release
   ```

3. `sudo bin/cargo_shorts -p 80 &` # TODO: Make this a daemon process
4. Install Tampermonkey extension in Chrome.

  a. Import the script by going to Tampermonkey -> Utilities -> URL, enter
     http://localhost/userscripts/cargo_shorts.js , press Import, and then press
     Install.
  b. Quit Chrome.

### Configuring

1. `cd cargo_shorts`
2. Create a public/configuration.json file with the following content:

   ```json
   {
     "name": "Your Room Name",
     "phone": "1234567890"
   }
   ```

   where

   - `name`: The name as you want it to appear in the Participants list.
   - `phone`: An optional phone number if you have an in-room phone system and
     you want BlueJeans to call it.

## Usage

If you've set up a DNS entry for the room, go to that room's URL.  You will be
presented with a simple interface that allows you to enter the meeting ID and
optional passcode.  CargoShorts will then launch a BlueJeans session and present
on the in-room TV.  Additionally, it will dial the in-room phone system to be
used for audio.  When you are done with your meeting, end the meeting through
the same interface.

## Contributing

1. Fork it ( https://github.com/Fryguy/cargo_shorts/fork )
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create a new Pull Request

## Contributors

- [Fryguy](https://github.com/Fryguy) Jason Frey - creator, maintainer
- [bdunne](https://github.com/bdunne) Brandon Dunne

## License

The project is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

The [CargoShorts logo](public/images/logo.svg) is created by [Chameleon Design](https://thenounproject.com/Chamedesign)
and obtained from the [Noun Project](https://thenounproject.com/browse/?i=230603)
under the terms of the [Creative Commons Attribution 3.0 US license](https://creativecommons.org/licenses/by/3.0/us).
