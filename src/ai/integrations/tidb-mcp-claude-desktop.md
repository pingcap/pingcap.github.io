---
title: Get started with Claude Desktop and TiDB MCP Server
description: This guide shows you how to configure the TiDB MCP Server in Claude Desktop.
---

# Integrate TiDB MCP Server with Claude Desktop

This guide shows you how to configure the TiDB MCP Server in Claude Desktop.

## Prerequisites

You need to install the following tools in advance:

- [Claude Desktop](https://claude.ai/download)
- [uv](https://docs.astral.sh/uv/getting-started/installation/) (Python package installer)

  > **Note**
  >
  > For macOS users, you can install the `uvx` command globally by running `brew install uv`.

- A TiDB cluster for testing. If you don't have one, you can go to [TiDB Cloud](https://tidbcloud.com/free-trial) to create a free serverless cluster.

## Configuration

For Claude Desktop users, please refer to the quickstart guide to learn [how to configure the MCP server in Claude Desktop](https://modelcontextprotocol.io/quickstart/user).

In short, you can follow these steps:

1. Open the **Settings** dialog.
2. Click the **Developers** tab in the dialog.
3. Click the **Edit Config** button to open the MCP config file `claude_desktop_config.json`.
4. Copy the following configuration into the `claude_desktop_config.json` file and replace the environment variables with your own values.

  ```json
  {
    "mcpServers": {
      "TiDB": {
        "command": "uvx --from pytidb[mcp] tidb-mcp-server",
        "env": {
          "TIDB_HOST": "localhost",
          "TIDB_PORT": "4000",
          "TIDB_USERNAME": "root",
          "TIDB_PASSWORD": "",
          "TIDB_DATABASE": "test"
        }
      }
    }
  }
  ```
5. Restart Claude Desktop.
6. After restarting, you will see the TiDB tools in the **Tools** panel.