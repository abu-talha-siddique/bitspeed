const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;
const publicDir = path.join(__dirname, 'public');

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css';
    case '.js': return 'application/javascript';
    case '.json': return 'application/json';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    default: return 'text/plain; charset=utf-8';
  }
}

const server = http.createServer((req, res) => {
  // Serve index.html for root and look up files in public/
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  // Prevent path traversal
  const safePath = path.normalize(path.join(publicDir, reqPath));
  if (!safePath.startsWith(publicDir)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.readFile(safePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('Not found');
      } else {
        res.statusCode = 500;
        res.end('Server error');
      }
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', getContentType(safePath));
    res.end(data);
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
