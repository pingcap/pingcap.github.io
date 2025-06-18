---
title: Get started with Cursor and TiDB MCP Server
description: This guide shows you how to configure the TiDB MCP Server in the Cursor editor.
---

# Get started with Cursor and TiDB MCP Server

This guide shows you how to configure the TiDB MCP Server in the Cursor editor.

For one-click installation, you can click the following button:

[![Install TiDB MCP Server](https://cursor.com/deeplink/mcp-install-light.svg)](https://cursor.com/install-mcp?name=TiDB&config=eyJjb21tYW5kIjoidXZ4IC0tZnJvbSBweXRpZGJbbWNwXSB0aWRiLW1jcC1zZXJ2ZXIiLCJlbnYiOnsiVElEQl9IT1NUIjoibG9jYWxob3N0IiwiVElEQl9QT1JUIjoiNDAwMCIsIlRJREJfVVNFUk5BTU0iOiJyb290IiwiVElEQl9QQVNTV09SRCI6IiIsIlRJREJfREFUQUJBU0UiOiJ0ZXN0In19)

## Prerequisites

Before you begin, ensure you have the following:

- **Cursor Editor**: Download and install Cursor from [cursor.com](https://cursor.com).
- **Python (>=3.10) and uv**: Ensure Python (version 3.10 or later) and uv is installed. Follow the [installation guide](https://docs.astral.sh/uv/getting-started/installation/) to install uv.
- **A TiDB Serverless Cluster**: You can create a free TiDB CLoud Serverless cluster here [tidbcloud.com](https://tidbcloud.com/free-trial).

## Setup steps

You can follow the steps below to set up the TiDB MCP Server in the Cursor editor:

1. Click the **Open Cursor Settings** button in the top right corner of the editor.
2. On the **Cursor Settings** page, click the **Tools & Integrations** tab.
3. Click the **New MCP Server** button.
4. Copy the following configuration into the `.cursor/mcp.json` file.

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

5. Go to the [TiDB Cloud cluster page](https://tidbcloud.com/console/clusters) and navigate to the cluster you want to connect to.
6. Click the **Connect** button to get the connection parameters, and replace the `TIDB_HOST`, `TIDB_PORT`, `TIDB_USERNAME`, `TIDB_PASSWORD`, and `TIDB_DATABASE` values with your own.

For more details, please refer to the [Model Context Protocol documentation](https://docs.cursor.com/context/model-context-protocol#configuring-mcp-servers) to learn how to configure the MCP server in the Cursor editor.

## Troubleshooting

If you encounter any issues installing the TiDB MCP Server, please check the MCP logs in the Cursor editor.

1. Click **View** > **Output** in the main menu at the top of the editor.
2. Select **MCP** from the dropdown menu in the **Output** panel.
3. If you find error messages like `[error] Could not start MCP server tidb-mcp-server: Error: spawn uvx ENOENT`, it means the `uvx` command may not exist in your `$PATH` system variable. For macOS users, you can install `uvx` by running `brew install uv`.