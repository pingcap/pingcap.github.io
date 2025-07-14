---
title: Memory
description: "PyTiDB example: memory"
source_repo: "https://github.com/pingcap/pytidb/tree/main/examples/memory"
---

# Memory

!!! info "Source Repository"
    This example is from the [pytidb repository](https://github.com/pingcap/pytidb/tree/main/examples/memory).
    For the complete source code and latest updates, please visit the original repository.

# Agent Memory Examples

* Use `pytidb` to connect to TiDB

## Prerequisites

* Python 3.10+
* TiDB server connection parameters, either local or TiDB Cloud
* OpenAI API key


## How to run

**Step1**: Clone the repo

```bash
git clone https://github.com/pingcap/pytidb.git
cd pytidb/examples/memory;
```

**Step2**: Install the required packages and setup environment

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r reqs.txt
```

**Step3**: Set up environment to connect to storage

You can find the connection string in the [TiDB Cloud console](https://tidbcloud.com/).

If you are using a local TiDB server, you can set up the environment variable like this:

```bash
cat > .env <<EOF
TIDB_HOST=localhost
TIDB_PORT=4000
TIDB_USERNAME=root
TIDB_PASSWORD=
TIDB_DATABASE=test

OPENAI_API_KEY=your_openai_api_key
EOF
```

**Step4**: Run the app

Run the following command to start the app, feel free to talk with the AI assistant and tell him/her any information about you.

```bash
python main.py
```

```plain
Chat with AI (type 'exit' to quit)
You: Hello, I am Mini256.
AI: Hello, Mini256! How can I assist you today?
You: I am working at PingCAP.
AI: That's great to hear, Mini256! PingCAP is known for its work on distributed databases, particularly TiDB. How's your experience been working there?
You: I am developing pytidb (A Python SDK for TiDB) which helps developers easy to connect to TiDB.
AI: That sounds like a great project, Mini256! Developing a Python SDK for TiDB can make it much easier for developers to integrate with TiDB and interact with it using Python. If you need any advice on best practices, libraries to use, or specific features to implement, feel free to ask!
You: exit
Goodbye!
```

Open another terminal and run the app again, ask the AI assistant "Who am I?":

```bash
python main.py
```

```plain
Chat with AI (type 'exit' to quit)
You: Who am I?
AI: You are Mini256, and you work at PingCAP, where you are developing pytidb, a Python SDK for TiDB to assist developers in easily connecting to TiDB.
You: exit
Goodbye!
```

As you can see, the AI assistant remembers you!
