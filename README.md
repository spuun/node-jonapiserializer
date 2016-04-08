# JonApiSerializer
Used to serialize an object structre with functions. It will be serialized to an object that in turn may be serialized to json and sent ov e.g. sockets. The remote side may deserialize the object to an object structure that mirrors the sender side. An invoker method will be triggerd on the reciever side and it's up to you to do what ever with the functions call.

[Look at JonRemoteApi for a real use case.](https://github.com/spuun/node-jonremoteapi)

## Example
Very simple example.

```javascript
const serializer = require('jonapiserializer');

const api = {
	log: function(str) { console.log(str); },
	doNothing: function() { }
}

cosnt serializedApi = serializer.serialize(api);

// json serialize serializedApi or what ever, send it to a remote side that uses it like:
const remoteApiInvoker = (methodName, args) => {
	console.log(`${methodName} invoked. Do something like send args to remote side?`);
};
const remoteApi = serializer.deserialize(serializedApi, remoteApiInvoker);
remoteApi.log('Hello world!');
```
