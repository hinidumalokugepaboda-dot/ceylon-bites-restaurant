import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

function realtimeSyncPlugin(): Plugin {
  const cacheFile = path.resolve(__dirname, '.orders_cache.json');
  let orders: any[] = [];
  try {
    if (fs.existsSync(cacheFile)) {
      orders = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      if (!Array.isArray(orders)) orders = [];
    }
  } catch {
    orders = [];
  }

  const sseClients = new Set<ServerResponse>();
  const events: any[] = [];

  const saveCache = () => {
    try {
      fs.writeFileSync(cacheFile, JSON.stringify(orders.slice(0, 100), null, 2), 'utf-8');
    } catch {}
  };

  return {
    name: 'realtime-sync-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = (req.url || '').split('?')[0];

        // Handle CORS Preflight
        if (req.method === 'OPTIONS' && url.startsWith('/api/realtime')) {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          });
          res.end();
          return;
        }

        // 1. Server-Sent Events (SSE) Stream
        if (url === '/api/realtime/events' && req.method === 'GET') {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
          });

          // Immediate handshake
          res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`);
          sseClients.add(res);

          const keepAlive = setInterval(() => {
            try {
              res.write(': keepalive\n\n');
            } catch {
              clearInterval(keepAlive);
              sseClients.delete(res);
            }
          }, 15000);

          req.on('close', () => {
            clearInterval(keepAlive);
            sseClients.delete(res);
          });
          return;
        }

        // 2. Broadcast Event (POST from phone or PC)
        if (url === '/api/realtime/event' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const event = JSON.parse(body || '{}');

              // Store order if provided
              if (event.order && (event.type === 'order:new_order' || event.type === 'order:kitchen_new')) {
                const idx = orders.findIndex(o => o.id === event.order.id);
                if (idx >= 0) {
                  orders[idx] = event.order;
                } else {
                  orders = [event.order, ...orders];
                }
                saveCache();
              } else if (event.type === 'order:status_updated' && event.orderId && event.newStatus) {
                orders = orders.map(o => o.id === event.orderId ? { ...o, status: event.newStatus } : o);
                saveCache();
              }

              events.push(event);
              if (events.length > 200) events.shift();

              // Broadcast to ALL connected SSE clients across the network (PC kitchen, PC cashier, other phones)
              const payload = `data: ${JSON.stringify(event)}\n\n`;
              for (const client of sseClients) {
                try {
                  client.write(payload);
                } catch {
                  sseClients.delete(client);
                }
              }

              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              });
              res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.writeHead(400, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              });
              res.end(JSON.stringify({ success: false, error: err?.message }));
            }
          });
          return;
        }

        // 3. Sync State (GET orders and recent events)
        if (url === '/api/realtime/sync' && req.method === 'GET') {
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(JSON.stringify({ success: true, orders, events: events.slice(-30) }));
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), realtimeSyncPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
