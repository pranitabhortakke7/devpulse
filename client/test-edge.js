const { spawn, execSync } = require('child_process');
const http = require('http');

console.log("Checking if Edge is available...");
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

// Start Edge in headless debugging mode
console.log("Launching Edge headless...");
const edge = spawn(edgePath, [
  '--headless',
  '--disable-gpu',
  '--remote-debugging-port=9222',
  'http://localhost:5173/'
]);

edge.stderr.on('data', (data) => {
  // console.log(`Edge stderr: ${data}`);
});

setTimeout(() => {
  // Query devtools to get list of pages and find WebSocket debugger URL
  console.log("Fetching DevTools session list...");
  http.get('http://127.0.0.1:9222/json/list', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const list = JSON.parse(data);
        console.log("Active pages found in headless browser:");
        console.log(JSON.stringify(list, null, 2));
      } catch (err) {
        console.error("Failed to parse pages list", err);
      }
      cleanup();
    });
  }).on('error', (err) => {
    console.error("Error communicating with DevTools port 9222:", err.message);
    cleanup();
  });
}, 3000);

function cleanup() {
  console.log("Terminating headless browser...");
  edge.kill();
  process.exit(0);
}
