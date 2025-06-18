---
title: TiDB MCP Server
description: Manage your TiDB databases using natural language instructions with the TiDB MCP Server.
---

# TiDB MCP Server

The TiDB MCP Server is an open-source tool that enables you to interact with TiDB databases using natural language commands.

## Prerequisites

1. An MCP-supported application that you want to integrate with.
2. [uv](https://docs.astral.sh/uv/getting-started/installation/) (Python package installer)
3. A TiDB cluster for testing. If you don't have one, you can go to [TiDB Cloud](https://tidbcloud.com/free-trial) to create a free serverless cluster.

The connection parameters for the TiDB cluster can be provided through environment variables or by using a `.env` file:

- `TIDB_HOST` - TiDB host address, e.g. `gateway01.us-east-1.prod.aws.tidbcloud.com`
- `TIDB_PORT` - TiDB port (default: `4000`)
- `TIDB_USERNAME` - Database username, e.g.  `xxxxxxxxxx.<username>`
- `TIDB_PASSWORD` - Database password
- `TIDB_DATABASE` - Database name, default is `test`


## Connect MCP Clients

You can refer to our individual guides for detailed examples on using the TiDB MCP Server with specific MCP clients:

- [Cursor](./mcp-cursor.md)
- [Claude Desktop](./mcp-claude-desktop.md)

If your MCP client is not listed above, you can refer to the following [Setup options](#setup-options) to set up the TiDB MCP Server.

## Setup options

You can set up the TiDB MCP Server in two ways:

- [Stdio Mode](#stdio-mode)
- [Server Sent Event (SSE) Mode](#server-sent-event-sse-mode)

### Stdio Mode

By default, TiDB MCP Server uses `stdio` mode. You can add `TiDB` MCP server configuration to the `mcpServers` list in the MCP configuration file of your clients.

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

### Server Sent Event (SSE) Mode

TiDB MCP Server also supports `sse` mode. You can start the server with the `--transport sse` option:

```bash
uvx --from "pytidb[mcp]" tidb-mcp-server --transport sse
```

Then, you can add `TiDB` MCP server configuration to the `mcpServers` list in the MCP configuration file of your clients.

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

The TiDB MCP Server provides the following actions (tools) to MCP Clients. You can use these tools to interact with your TiDB projects and databases using natural language instructions.

**Database Management**

- `show_databases` - Show all databases in the TiDB cluster
  - `username`: Database username (string, optional)
  - `password`: Database password (string, optional)

- `switch_database` - Switch to a specific database
  - `db_name`: Database name to switch to (string, required)
  - `username`: Database username (string, optional)
  - `password`: Database password (string, optional)

- `show_tables` - Show all tables in the current database

**SQL query and execution**

- `db_query` - Execute read-only SQL queries
  - `sql_stmt`: SQL query statement (string, required)

- `db_execute` - Execute data modification SQL statements
  - `sql_stmts`: A single SQL statement or an array of SQL statements (string|array, required)

**User Management**

- `db_create_user` - Create a new database user
  - `username`: Name for the new user (string, required)
  - `password`: Password for the new user (string, required)

- `db_remove_user` - Remove an existing database user
  - `username`: Name of the user to remove (string, required)


## Development

To develop or debug TiDB MCP Server, you can use the MCP CLI to start a development server.

1. Install MCP CLI on your local machine:

  ```bash
  pip install "mcp[cli]"
  ```

2. Start the development server for TiDB MCP Server:

  ```bash
  mcp dev pytidb/ext/mcp/server.py
  ```