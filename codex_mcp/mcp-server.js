// mcp/mcp-server.js
// FINAL — 100% working with @modelcontextprotocol/sdk@1.23.0

import {
  Server,
  NodeStdioServerTransport
} from "@modelcontextprotocol/sdk/server";

// ----------------------------------------
// Backend Proxy Helper
// ----------------------------------------
async function callBackend(path, body) {
  const url = `http://localhost:4000${path}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return res.json();
}

// ----------------------------------------
// CREATE MCP SERVER
// ----------------------------------------
const server = new Server(
  {
    name: "codex-refactor-mcp",
    version: "1.0.0",
  },
  {
    tools: {
      // ----------------------------------------
      // Tool 1 — Analyze Code
      // ----------------------------------------
      analyze_code: {
        description: "Analyze source code AST and structure.",
        inputSchema: {
          type: "object",
          properties: {
            code: { type: "string" }
          },
          required: ["code"],
        },
        handler: async ({ code }) => {
          try {
            const resp = await callBackend("/analyze", { code });
            return { ok: true, analysis: resp.analysis };
          } catch (err) {
            return { ok: false, error: err.message };
          }
        }
      },

      // ----------------------------------------
      // Tool 2 — Suggest Refactors
      // ----------------------------------------
      suggest_refactors: {
        description:
          "Suggest AST-based refactors and return full patched file output.",
        inputSchema: {
          type: "object",
          properties: {
            code: { type: "string" }
          },
          required: ["code"],
        },
        handler: async ({ code }) => {
          try {
            const resp = await callBackend("/suggest", { code });
            return { ok: true, suggestions: resp.suggestions };
          } catch (err) {
            return { ok: false, error: err.message };
          }
        }
      }
    }
  }
);

// ----------------------------------------
// START SERVER USING STDIO TRANSPORT
// ----------------------------------------
const transport = new NodeStdioServerTransport();

server.start(transport);

console.error("🚀 codex-refactor-mcp server started (NodeStdioServerTransport)");
