const { spawn } = require('child_process');
const http = require('http');

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

console.log("Launching Edge headless...");
const edge = spawn(edgePath, [
  '--headless',
  '--disable-gpu',
  '--remote-debugging-port=9222',
  'http://localhost:5173/devbot'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9222/json/list', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const list = JSON.parse(data);
        const page = list.find(p => p.type === 'page' && p.url.includes('5173'));
        if (!page) {
          console.error("Target page not found.");
          edge.kill();
          return;
        }

        const ws = new WebSocket(page.webSocketDebuggerUrl);

        ws.onopen = () => {
          ws.send(JSON.stringify({ id: 1, method: "Runtime.enable" }));
          ws.send(JSON.stringify({ id: 2, method: "Console.enable" }));
          ws.send(JSON.stringify({ id: 3, method: "Page.reload" }));
        };

        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          
          if (msg.id === 4) {
            console.log("\n--- DOM Content inside #root ---");
            console.log(msg.result.result.value);
            console.log("--------------------------------\n");
          }

          if (msg.method === "Runtime.consoleAPICalled") {
            const args = msg.params.args.map(arg => arg.value || JSON.stringify(arg)).join(' ');
            console.log(`[Browser Console]: ${args}`);
          }
          
          if (msg.method === "Runtime.exceptionThrown") {
            console.error("[Browser Exception]:", msg.params.exceptionDetails.exception.description);
            if (msg.params.exceptionDetails.stackTrace) {
              console.error("Stack trace:");
              msg.params.exceptionDetails.stackTrace.callFrames.forEach(frame => {
                console.error(`  at ${frame.functionName} (${frame.url}:${frame.lineNumber}:${frame.columnNumber})`);
              });
            }
          }
        };

        // Query the DOM after 3 seconds of reload
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 4,
            method: "Runtime.evaluate",
            params: { expression: "document.getElementById('root').innerHTML" }
          }));
        }, 3000);

        setTimeout(() => {
          ws.close();
          edge.kill();
          process.exit(0);
        }, 5000);

      } catch (err) {
        console.error(err);
        edge.kill();
      }
    });
  });
}, 2000);
