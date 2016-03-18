import Adapter from 'webbybot/src/adapter';

class MockAdapter extends Adapter {
  send(envelope, ...strings) {
    this.emit('send', envelope, strings);
  }

  emote(envelope, ...strings) {
    this.emit('emote', envelope, strings);
  }

  reply(envelope, ...strings) {
    this.emit('reply', envelope, strings);
  }

  topic(envelope, ...strings) {
    this.emit('topic', envelope, strings);
  }

  play(envelope, ...strings) {
    this.emit('play', envelope, strings);
  }

  run() {
    this.emit('connected');
  };

  close() {
    this.emit('closed');
  };

  receive(message) {
    this.emit('received');
  }
}

export function use(robot) {
  return new MockAdapter(robot);
};
