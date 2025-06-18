---
title: TiDB MCP Server
description: Manage your TiDB databases using natural language instructions with the TiDB MCP Server.
---

# TiDB MCP Server

The TiDB MCP Server is an open-source tool that enables you to interact with TiDB databases using natural language instructions.

## Prerequisites

Before you begin, ensure you have the following:

- **An MCP-supported Clients**: For example, [Cursor](./tidb-mcp-cursor.md) or [Claude Desktop](./tidb-mcp-claude-desktop.md).
- **Python (>=3.10) and uv**: Ensure Python (version 3.10 or later) and uv is installed. Follow the [installation guide](https://docs.astral.sh/uv/getting-started/installation/) to install uv.
- **A TiDB Serverless Cluster**: You can create a free TiDB CLoud Serverless cluster here [tidbcloud.com](https://tidbcloud.com/free-trial).

## Connect MCP Clients

Refer to the following guides for detailed examples of using the TiDB MCP Server with specific MCP clients:

- [Cursor](./tidb-mcp-cursor.md)
- [Claude Desktop](./tidb-mcp-claude-desktop.md)

If your MCP client is not listed above, please following the setup steps below.

### Stdio Mode

By default, the TiDB MCP Server uses `stdio` mode, which is not required to start up a standalone server in advance.

You can follow the steps below to set up the TiDB MCP Server in your MCP client with `stdio` mode:


1. Check the documentation of your MCP client to learn how to configure the MCP Server.

2. Add the TiDB MCP Server configuration into the `mcpServers` list in your client's MCP configuration file.
  
      Example MCP configuration file:

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

3. Go to the [TiDB Cloud cluster page](https://tidbcloud.com/console/clusters) and navigate to the cluster you want to connect to.
4. Click the **Connect** button in the cluster page to get the connection parameters, and replace the `TIDB_HOST`, `TIDB_PORT`, `TIDB_USERNAME`, `TIDB_PASSWORD`, and `TIDB_DATABASE` values with your own.


### Server-Sent Events (SSE) Mode

The TiDB MCP Server also supports Server-Sent Events (SSE) mode.

You need to start the TiDB MCP Server with the `--transport sse` option in advance.

```bash
uvx --from "pytidb[mcp]" tidb-mcp-server --transport sse
```

Then, add the `TiDB` MCP server configuration to the `mcpServers` list in your client's MCP configuration file.

```json
{
  "mcpServers": {
    "TiDB": {
      "url": "http://localhost:8000/sse"
    }
  }
}
```

## Supported actions (tools)

The TiDB MCP Server provides the following actions (tools) to MCP clients. You can use these tools to interact with your TiDB projects and databases using natural language instructions.

**Database Management**

- `show_databases` - Show all databases in the TiDB cluster

    * `username`: Database username (string, optional)
    * `password`: Database password (string, optional)

- `switch_database` - Switch to a specific database

    * `db_name`: Database name to switch to (string, required)
    * `username`: Database username (string, optional)
    * `password`: Database password (string, optional)

- `show_tables` - Show all tables in the current database

**SQL query and execution**

- `db_query` - Execute read-only SQL queries

    * `sql_stmt`: SQL query statement (string, required)

- `db_execute` - Execute data modification SQL statements

    * `sql_stmts`: A single SQL statement or an array of SQL statements (string or array, required)

**User Management**

- `db_create_user` - Create a new database user

    * `username`: Name for the new user (string, required)
    * `password`: Password for the new user (string, required)

- `db_remove_user` - Remove an existing database user

    * `username`: Name of the user to remove (string, required)
