function Emitter() {
  this.subUid = -1;
  this.topics = {};
}

Emitter.prototype.publish = function() {
  const [topic, ...args] = Array.from(arguments);
    const subscribers = this.topics[topic];
    if (!subscribers) {
      return;
    }
    let len = subscribers.length || 0;
    while(len--) {
      subscribers[len].callback.apply(null, args);
    }
    return this;
};

Emitter.prototype.subscribe = function() {
  const [topic, callback] = Array.from(arguments);
  const subscribers = this.topics[topic];
  if (!subscribers) {
    this.topics[topic] = [];
  }
  const token = ++this.subUid;
  this.topics[topic].push({
    token,
    callback,
  });
  return token;
};

Emitter.prototype.unsubscribe = function(token) {
  const entries = Object.entries(this.topics);
  for(let [topic, subscribers] of entries) {
    const index = subscribers.findIndex(({ token: subUid }) => token === subUid );
    if (index > -1) {
      this.topics[topic].splice(index, 1);
      return;
    }
  }
  return token;
};

class Emitter {
  subUid = -1;
  topics = {};

  publish() {
    const [topic, ...args] = Array.from(arguments);
      const subscribers = this.topics[topic];
      if (!subscribers) {
        return;
      }
      let len = subscribers.length || 0;
      while(len--) {
        subscribers[len].callback.apply(null, args);
      }
      return this;
  };

  subscribe() {
    const [topic, callback] = Array.from(arguments);
    const subscribers = this.topics[topic];
    if (!subscribers) {
      this.topics[topic] = [];
    }
    const token = ++this.subUid;
    this.topics[topic].push({
      token,
      callback,
    });
    return token;
  };

  unsubscribe(token) {
    const entries = Object.entries(this.topics);
    for(let [topic, subscribers] of entries) {
      const index = subscribers.findIndex(({ token: subUid }) => token === subUid );
      if (index > -1) {
        this.topics[topic].splice(index, 1);
        return;
      }
    }
    return token;
  };
}

const EventOwner = new Emitter();

const token = EventOwner.subscribe('send', (...args) => {
  console.log(args);
});

EventOwner.publish('send', 1, 2, 3);

EventOwner.unsubscribe(token);

EventOwner.publish('send', 4, 5, 6);

