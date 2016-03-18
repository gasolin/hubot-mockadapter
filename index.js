import Adapter from 'webbybot/dist/src/adapter';

class MockAdapter extends Adapter {
  send(envelope, ...strings) {
    this.robot.emit('send', envelope, strings);
  }

  emote(envelope, ...strings) {
    this.robot.emit('emote', envelope, strings);
  }

  reply(envelope, ...strings) {
    this.robot.emit('reply', envelope, strings);
  }

  topic(envelope, ...strings) {
    this.robot.emit('topic', envelope, strings);
  }

  play(envelope, ...strings) {
    this.robot.emit('play', envelope, strings);
  }

  run() {
    this.robot.emit('connected');
  };

  close() {
    this.robot.emit('closed');
  };

  receive(message) {
    this.robot.emit('received');
  }
}

export function use(robot) {
  return new MockAdapter(robot);
};
