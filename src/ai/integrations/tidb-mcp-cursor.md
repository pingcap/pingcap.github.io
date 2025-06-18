---
title: Get started with Cursor and TiDB MCP Server
description: This guide shows you how to configure the TiDB MCP Server in the Cursor editor.
---

# Get started with Cursor and TiDB MCP Server

This guide shows you how to configure the TiDB MCP Server in the Cursor editor.

For one-click TiDB MCP Server installation, you can click:

[![Install TiDB MCP Server](https://cursor.com/deeplink/mcp-install-light.svg)](https://cursor.com/install-mcp?name=TiDB&config=eyJjb21tYW5kIjoidXZ4IC0tZnJvbSBweXRpZGJbbWNwXSB0aWRiLW1jcC1zZXJ2ZXIiLCJlbnYiOnsiVElEQl9IT1NUIjoibG9jYWxob3N0IiwiVElEQl9QT1JUIjoiNDAwMCIsIlRJREJfVVNFUk5BTU0iOiJyb290IiwiVElEQl9QQVNTV09SRCI6IiIsIlRJREJfREFUQUJBU0UiOiJ0ZXN0In19)

## Prerequisites

You need to install the following tools in advance:

- [Cursor](https://cursor.com)
- [uv](https://docs.astral.sh/uv/getting-started/installation/) (Python package installer)

  > **Note**
  >
  > For macOS users, you can install the `uvx` command globally by running `brew install uv`.

- A TiDB cluster for testing. If you don't have one, you can go to [TiDB Cloud](https://tidbcloud.com/free-trial) to create a free serverless cluster.

## Configuration

For Cursor users, please refer to the [Model Context Protocol documentation](https://docs.cursor.com/context/model-context-protocol#configuring-mcp-servers) to learn how to configure the MCP server in the Cursor editor.

1. Click the **Open Cursor Settings** button in the top right corner of the editor.
2. On the **Cursor Settings** page, click the **Tools & Integrations** tab.
3. Click the **New MCP Server** button.
4. Copy the following configuration into the `.cursor/mcp.json` file and replace the `TIDB_HOST`, `TIDB_PORT`, `TIDB_USERNAME`, `TIDB_PASSWORD`, and `TIDB_DATABASE` values with your own.

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

## Troubleshooting

If you encounter any issues installing the TiDB MCP Server, please check the MCP logs in the Cursor editor.

1. Click **View** > **Output** in the main menu at the top of the editor.
2. Select **MCP** from the dropdown menu in the **Output** panel.

Common issues:

- If you see error messages like `[error] Could not start MCP server tidb-mcp-server: Error: spawn uvx ENOENT`, it means the `uvx` command does not exist in your `$PATH` system variable.
  - For macOS users, you can install `uvx` by running `brew install uv`.