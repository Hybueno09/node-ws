const { Server } = require('ws');
const fs = require('fs');

const wss = new Server({ port: 8080 });

wss.on('connection', (socket) => {
  socket.on('message', (message) => {
    console.log(message);
    console.log(Object.prototype.toString.call(message));
    try {
      if (Object.prototype.toString.call(message) === '[object Uint8Array]') {
        let sliceBuffer = message.slice(0, 4);
        // console.log(Buffer.from(sliceBuffer).toString('hex') === '504b0304');
        //   case 0x89504E47: file.verified_type = 'image/png'; break;
        // case 0x47494638: file.verified_type = 'image/gif'; break;
        // case 0x25504446: file.verified_type = 'application/pdf'; break;
        // case 0x504b0304: file.verified_type = 'application/zip'; break;
        const hex = Buffer.from(sliceBuffer).toString('hex');
        switch (hex) {
          case '504b0304':
            break;
          default:
            break;
        }

        fs.writeFile('test', message, (err) => {
          if (err) {
            socket.send('保存失败');
          } else {
            socket.send('保存成功');
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
});

wss.on('error', (err) => {
  console.log(err);
});
