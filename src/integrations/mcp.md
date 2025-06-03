# MCP Server

MCP server implementation for TiDB database.

## Prerequisites

- [uv](https://docs.astral.sh/uv/getting-started/installation/) (Python package installer)

## Installation

Clone the pytidb repository to the local.

```bash
git clone https://github.com/pingcap/pytidb
cd pytidb
```

Install the dependencies.

```bash
uv sync --extra mcp
```

## Configuration

### Environment variables

Go [tidbcloud.com](https://tidbcloud.com) to create a free TiDB database cluster, or use [TiUP Playground](https://docs.pingcap.com/tidb/stable/quick-start-with-tidb/#deploy-a-local-test-cluster) to deploy a local database cluster.

Configuration can be provided through environment variables, or using `.env` file:

- `TIDB_HOST` - TiDB host address, e.g. 'gateway01.us-east-1.prod.aws.tidbcloud.com'
- `TIDB_PORT` - TiDB port (default: 4000)
- `TIDB_USERNAME` - Database username, e.g.  'xxxxxxxxxx.\<username\>'
- `TIDB_PASSWORD` - Database password
- `TIDB_DATABASE` - Database name, default is test

### MCP Clients 

#### Claude Desktop

For Claude Desktop users, please check the quickstart to learn [how to configure mcp server in the Claude Desktop](https://modelcontextprotocol.io/quickstart/user),

In short, you can go to **Settings** dialog, and open the MCP config file by click **Developers > Edit Config**.

Here is an example for `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "tidb": {
      "command": "uv",
      "args": [
        "--directory",
        "/path/to/pytidb",
        "run",
        "--env-file",
        "/path/to/.env",
        "-m",
        "pytidb.ext.mcp"
      ]
    }
  }
}
```

> **Note**
>
> For macOS users, you may need to install the `uv` command globally by command `brew install uv`.

#### Cursor

For Cursor users, please check the [Model Context Protocol](https://docs.cursor.com/context/model-context-protocol#configuring-mcp-servers) document to learn how to configure the MCP server in Cursor editor.

In short, you can create a `.cursor/mcp.json` file in your opening project and configure the project-level MCP servers:

Here is an example for `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "tidb": {
      "command": "uv",
      "args": [
        "run",
        "--directory",
        "/path/to/pytidb",
        "--env-file",
        "/path/to/.env",
        "-m",
        "pytidb.ext.mcp"
      ]
    }
  }
}
```

### Server Sent Event (SSE) Mode

TiDB MCP Server using `stdio` mode to serve by default. You can start up the server with `sse` mode with command:

```bash
uv run tidb-mcp-server --transport sse
```

And then, you can configure the `mcpServers` in the configuration file like:

```json
{
  "mcpServers": {
    "tidb": {
      "url": "http://localhost:8000/sse"
    }
  }
}
```

### Development Mode

If you want to using MCP CLI to start a development server, you can use the following command:

```bash
mcp dev pytidb/ext/mcp/server.py
```

And then, you can use the following command to start the server:

```bash
mcp run --transport sse pytidb/ext/mcp/server.py
```


## Aha: Start the TiDB MCP Server in 2 Lines of Shell

There is a very easy way to start the SSE server like this:

```bash
pip install pytidb pytidb[mcp]
DATABASE_URL="mysql+pymysql://user:pass@host:4000/test" python -m pytidb.ext.mcp --transport=sse
# Please don't use `root` user.
```

Then, you can config the follow SSE server address to your MCP clients:

```text
http://localhost:8000/sse
```
> * **Note** Please select the `sse` transport mode in your MCP clients, otherwise, it will not work.
> * **Note** Please don't use `root` user.

## Tools

### Database Management

- `show_databases` - Show all databases in the TiDB cluster
  - `username`: Database username (string, optional)
  - `password`: Database password (string, optional)

- `switch_database` - Switch to a specific database
  - `db_name`: Database name to switch to (string, required)
  - `username`: Database username (string, optional)
  - `password`: Database password (string, optional)

- `show_tables` - Show all tables in the current database

### SQL Operations

- `db_query` - Execute read-only SQL queries
  - `sql_stmt`: SQL query statement (string, required)

- `db_execute` - Execute data modification SQL statements
  - `sql_stmts`: Single SQL statement or array of SQL statements (string|array, required)

### User Management

- `db_create_user` - Create a new database user
  - `username`: Name for the new user (string, required)
  - `password`: Password for the new user (string, required)

- `db_remove_user` - Remove an existing database user
  - `username`: Name of the user to remove (string, required)
