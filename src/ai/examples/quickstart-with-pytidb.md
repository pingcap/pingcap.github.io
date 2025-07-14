---
title: Quickstart
description: "PyTiDB example: quickstart"
source_repo: "https://github.com/pingcap/pytidb/tree/main/examples/quickstart"
---

# Quickstart

!!! info "Source Repository"
    This example is from the [pytidb repository](https://github.com/pingcap/pytidb/tree/main/examples/quickstart).
    For the complete source code and latest updates, please visit the original repository.

# Quickstart Demo

This example demonstrates how to use the PyTiDB Python SDK to connect to a TiDB database, create a table, insert data, perform semantic search, and clean up resources.

## Prerequisites

* Python 3.8+
* TiDB server connection string (local or TiDB Cloud)
* OpenAI API key (for embedding)

## How to run

**Step1**: Clone the repository

```bash
git clone https://github.com/pingcap/pytidb.git
cd pytidb/examples/quickstart/
```

**Step2**: Install the required packages

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r reqs.txt
```

**Step3**: Set up environment to connect to storage

If you are using TiDB Cloud, you can find the connection parameters in the [TiDB Cloud console](https://tidbcloud.com/) and set up the environment variable like this:

```bash
cat > .env <<EOF
TIDB_HOST={gateway-region}.prod.aws.tidbcloud.com
TIDB_PORT=4000
TIDB_USERNAME={prefix}.root
TIDB_PASSWORD={password}
TIDB_DATABASE=test
OPENAI_API_KEY={your-openai-api-key}
EOF
```

If you are using a local TiDB server, you can set up the environment variable like this:

```bash
cat > .env <<EOF
TIDB_HOST=localhost
TIDB_PORT=4000
TIDB_USERNAME=root
TIDB_PASSWORD=
TIDB_DATABASE=test
OPENAI_API_KEY={your-openai-api-key}
EOF
```

**Step4**: Run the demo

```bash
python main.py
```

*Expected output:*

```plain
=== Connect to TiDB ===
Connected to TiDB

=== Create embedding function ===
Embedding function created

=== Create table ===
Table created

=== Truncate table ===
Table truncated

=== Insert data ===
Inserted 3 chunks

=== Query data ===
ID: 1, Text: PyTiDB is a Python library for developers to connect to TiDB., User ID: 2
ID: 2, Text: LlamaIndex is a framework for building AI applications., User ID: 2
ID: 3, Text: OpenAI is a company and platform that provides AI models service and tools., User ID: 3

=== Semantic search ===
ID: 2, Text: LlamaIndex is a framework for building AI applications., User ID: 2, Distance: 0.5720575919048316
ID: 3, Text: OpenAI is a company and platform that provides AI models service and tools., User ID: 3, Distance: 0.6032368346515378
ID: 1, Text: PyTiDB is a Python library for developers to connect to TiDB., User ID: 2, Distance: 0.6203520237350386

=== Delete a row ===
Deleted chunk #1

=== Drop table ===
Table dropped
```