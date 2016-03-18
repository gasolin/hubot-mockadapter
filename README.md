# mock adapter for unit-testing Webbybot and Hubot

[![Dependency Status](https://david-dm.org/gasolin/webbybot-mock-adapter.svg)](https://david-dm.org/gasolin/webbybot-mock-adapter) [![npm](https://img.shields.io/npm/v/webbybot-mock-adapter.svg)](https://www.npmjs.com/package/webbybot-mock-adapter)

Rewrote from [hubot-mock-adapter](https://github.com/blalor/hubot-mock-adapter)

An `Adapter` implementation could be spied on. For writing unit tests for Webbybot and Hubot scripts.

## example usage

Let's assume you've got a really simple script, like this:

```js
module.exports = function(robot) {
  robot.hear(/Computer!/, function(msg) {
      msg.reply("Why hello there! (ticker tape, ticker tape)");
  });
};
```

You want to test this, of course.  So create a Mocha test:

```js
var expect = require("chai").expect;
var path   = require("path");

var Robot       = require("hubot/src/robot");
var TextMessage = require("hubot/src/message").TextMessage;

describe("Eddie the shipboard computer", function() {
    var robot;
    var user;
    var adapter;

    beforeEach(function(done) {
        // create new robot, without http, using the mock adapter
        robot = new Robot(null, "mock-adapter", false, "Eddie");

        robot.adapter.on("connected", function() {
            // only load scripts we absolutely need, like auth.coffee
            process.env.HUBOT_AUTH_ADMIN = "1";
            robot.loadFile(
                path.resolve(
                    path.join("node_modules/hubot/src/scripts")
                ),
                "auth.coffee"
            );

            // load the module under test and configure it for the
            // robot.  This is in place of external-scripts
            require("../index")(robot);

            // create a user
            user = robot.brain.userForId("1", {
                name: "mocha",
                room: "#mocha"
            });

            adapter = robot.adapter;

            done();
        });

        robot.run();
    });

    afterEach(function() {
        robot.shutdown();
    });

    it("responds when greeted", function(done) {
        // here's where the magic happens!
        adapter.on("reply", function(envelope, strings) {
            expect(strings[0]).match(/Why hello there/);

            done();
        });

        adapter.receive(new TextMessage(user, "Computer!"));
    });
});
```

You'll need `devDependencies` something like this in your `package.json`:

```js
"devDependencies": {
  "chai": "~1.9.0",
  "webbybot-mock-adapter": "~1.0.0",
  "mocha": "~1.17.1",
  "webbybot": "^0.2.1",
  "sinon": "~1.9.0"
}
```

That's (almost) all there is to it!

## firing up Mocha

Assuming you're using [`mocha`][mocha] to run your tests, and your
tests are in `test/`. add a `test` script in your `package.json`:

```js
"scripts": {
  "test": "mocha --compilers js:babel-register"
}
```

Then you can use `npm test` to run your tests!

[mocha]: https://github.com/mhevery/jasmine-node
