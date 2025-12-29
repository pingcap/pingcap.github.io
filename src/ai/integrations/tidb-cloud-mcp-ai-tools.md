---
title: Use TiDB Cloud Starter with AI Tools
description: Connect a TiDB Cloud Starter cluster to MCP-compatible AI tools such as Cursor, Claude Code, VS Code, and Windsurf.
---

# Use TiDB Cloud Starter with AI Tools

This guide shows you how to connect a TiDB Cloud Starter cluster to AI-powered development tools that support the Model Context Protocol (MCP), such as Cursor, Claude Code, Visual Studio Code (VS Code), and Windsurf.

By configuring your TiDB Cloud Starter cluster as an MCP server, you can enable AI assistants in these tools to query your database schema, understand your data model, and generate context-aware code suggestions.

## Prerequisites

Before you begin, make sure you have the following:

- **A TiDB Cloud Starter cluster**: If you do not have one, create it at [tidbcloud.com](https://tidbcloud.com/free-trial).
- **Python (>=3.10) and uv**: Ensure Python (version 3.10 or later) and uv are installed. See the [uv installation guide](https://docs.astral.sh/uv/getting-started/installation/).
- **An MCP-compatible AI tool**:
  - [Cursor](https://cursor.com)
  - [Claude Code](https://claude.com/product/claude-code)
  - [Visual Studio Code](https://code.visualstudio.com)
  - [Windsurf](https://windsurf.com)

## Connect your cluster to an AI tool

After creating your TiDB Cloud Starter cluster, follow these steps in the TiDB Cloud console:

1. Go to the [Clusters](https://tidbcloud.com/console/clusters) page, select your cluster, and then click **Use with AI Tools** in the upper-right corner.
2. In the **Access `your_cluster_name` with AI tools** dialog, select the **Branch** and **Database** the AI tool should access.
3. Review the **Prerequisites** list in the dialog and install any missing dependencies.
4. Configure the root password:

   - If you have not set a password yet, click **Generate Password** and store it in a secure location (it is shown only once).
   - If a password already exists, enter it in the **Enter the password for easy setup** field.
   - If you forget the password, click **Reset password** in the **Prerequisites** section to generate a new one.

   !!! note

       Resetting the password disconnects all existing root user sessions.

5. Select the tab for your AI tool (**Cursor**, **Claude Code**, **VS Code**, or **Windsurf**).
6. Follow the tool-specific setup steps shown in the dialog, or use the configuration examples below.

## Tool-specific setup

### Cursor

You can configure Cursor as an MCP client with one of the following methods:

- **Method 1 (recommended)**: In the **Access `your_cluster_name` with AI tools** dialog, click **Add to Cursor** to launch Cursor, then click **Install**.
- **Method 2**: Add the following configuration to your `.cursor/mcp.json` file and replace the placeholders with your cluster parameters:

    ```json
    {
      "mcpServers": {
        "TiDB": {
          "command": "uvx --from pytidb[mcp] tidb-mcp-server",
          "env": {
            "TIDB_HOST": "<YOUR_TIDB_HOST>",
            "TIDB_PORT": "<YOUR_TIDB_PORT>",
            "TIDB_USERNAME": "<YOUR_TIDB_USERNAME>",
            "TIDB_PASSWORD": "<YOUR_TIDB_PASSWORD>",
            "TIDB_DATABASE": "<YOUR_TIDB_DATABASE>"
          }
        }
      }
    }
    ```

For a detailed Cursor walkthrough, see [Get started with Cursor and TiDB MCP Server](./tidb-mcp-cursor.md).

### Claude Code

You can configure Claude Code as an MCP client with one of the following methods:

- **Method 1**: Copy the setup command from the **Access `your_cluster_name` with AI tools** dialog and run it in your terminal:

    ```bash
    claude mcp add --transport stdio TiDB \
      --env TIDB_HOST='<YOUR_TIDB_HOST>' \
      --env TIDB_PORT=<YOUR_TIDB_PORT> \
      --env TIDB_USERNAME='<YOUR_TIDB_USERNAME>' \
      --env TIDB_PASSWORD='<YOUR_TIDB_PASSWORD>' \
      --env TIDB_DATABASE='<YOUR_TIDB_DATABASE>' \
      -- uvx --from 'pytidb[mcp]' 'tidb-mcp-server'
    ```

- **Method 2**: Add the following configuration to your project-level `.mcp.json` file. For details, see the [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp#project-scope).

    ```json
    {
      "mcpServers": {
        "TiDB": {
          "type": "stdio",
          "command": "uvx",
          "args": ["--from", "pytidb[mcp]", "tidb-mcp-server"],
          "env": {
            "TIDB_HOST": "<YOUR_TIDB_HOST>",
            "TIDB_PORT": "<YOUR_TIDB_PORT>",
            "TIDB_USERNAME": "<YOUR_TIDB_USERNAME>",
            "TIDB_PASSWORD": "<YOUR_TIDB_PASSWORD>",
            "TIDB_DATABASE": "<YOUR_TIDB_DATABASE>"
          }
        }
      }
    }
    ```

### VS Code

You can configure VS Code as an MCP client with one of the following methods:

- **Method 1**: In the **Access `your_cluster_name` with AI tools** dialog, click **Add to VS Code** to open VS Code, then click **Install**.
- **Method 2**: Add the following configuration to your `.vscode/mcp.json` file and replace the placeholders with your cluster parameters:

    ```json
    {
      "mcpServers": {
        "TiDB": {
          "type": "stdio",
          "command": "uvx",
          "args": ["--from", "pytidb[mcp]", "tidb-mcp-server"],
          "env": {
            "TIDB_HOST": "<YOUR_TIDB_HOST>",
            "TIDB_PORT": "<YOUR_TIDB_PORT>",
            "TIDB_USERNAME": "<YOUR_TIDB_USERNAME>",
            "TIDB_PASSWORD": "<YOUR_TIDB_PASSWORD>",
            "TIDB_DATABASE": "<YOUR_TIDB_DATABASE>"
          }
        }
      }
    }
    ```

### Windsurf

To add the TiDB MCP server in Windsurf, update your `mcp_config.json` file as follows. For more information, see the [Windsurf MCP documentation](https://docs.windsurf.com/windsurf/cascade/mcp#adding-a-new-mcp-plugin).

```json
{
  "mcpServers": {
    "TiDB": {
      "command": "uvx",
      "args": ["--from", "pytidb[mcp]", "tidb-mcp-server"],
      "env": {
        "TIDB_HOST": "<YOUR_TIDB_HOST>",
        "TIDB_PORT": "<YOUR_TIDB_PORT>",
        "TIDB_USERNAME": "<YOUR_TIDB_USERNAME>",
        "TIDB_PASSWORD": "<YOUR_TIDB_PASSWORD>",
        "TIDB_DATABASE": "<YOUR_TIDB_DATABASE>"
      }
    }
  }
}
```

## See also

- [TiDB MCP Server](./tidb-mcp-server.md)
- [Get started with Cursor and TiDB MCP Server](./tidb-mcp-cursor.md)
- [Get started with Claude Desktop and TiDB MCP Server](./tidb-mcp-claude-desktop.md)
- [Developer Guide Overview](/develop/dev-guide-overview.md)
