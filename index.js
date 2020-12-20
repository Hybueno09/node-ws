const WebSocketServer = require('websocket').server;

const http = require('http');

const server = http.createServer((req, res) => {
  console.log(new Date() + ' Received request for ' + req.url);
  res.writeHead(404);
  res.end();
});

server.listen(8080, () => {
  console.log(new Date() + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

function originIsAllowed(origin) {
  return true;
}

wsServer.on('request', (req) => {
  if (!originIsAllowed(req.origin)) {
    req.reject();
    console.log(
      new Date() + ' Connection from origin ' + req.origin + ' rejected.'
    );
    return;
  }
  const connection = req.accept('echo-protocol', req.origin);
  console.log(new Date() + ' Connection accepted.');
  connection.on('message', (message) => {
    console.log(222);
    console.log(message);
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      connection.sendUTF(message.utf8Data);
    } else if (message.type === 'binary') {
      console.log(
        'Received Binary Message of ' + message.binaryData.length + ' bytes'
      );
      connection.sendBytes(message.binaryData);
    } else {
      console.log(message.type);
    }
  });
  connection.on('close', (reasonCode, description) => {
    console.log(
      new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.'
    );
  });
});
