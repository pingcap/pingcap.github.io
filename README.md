# TiDB for AI

TiDB is an open-source, distributed SQL database designed for modern AI applications, offering seamless scalability, real-time analytics, and unified storage for vectors, documents, knowledge graphs, operational data and more.

🚀 Follow our [Quickstart Guide](https://pingcap.github.io/ai/quickstart/) to begin building your first AI application with TiDB

## Example Gallery

This documentation site includes an Example Gallery that showcases various AI applications built with TiDB. The examples are automatically synced from the [pytidb repository](https://github.com/pingcap/pytidb/tree/main/examples).

### Available Examples

- **Auto Embedding**: Automatic text embedding with TiDB
- **Basic Usage**: Basic operations with PyTiDB
- **Fulltext Search**: Full-text search capabilities
- **Hybrid Search**: Combining vector and text search
- **Image Search**: Image similarity search
- **Memory**: Agent memory storage
- **Quickstart**: Quick start guide
- **RAG**: Retrieval-Augmented Generation
- **Text2SQL**: Natural language to SQL conversion
- **Vector Search**: Vector similarity search

### Updating Examples

To sync the latest examples from the pytidb repository:

```bash
make sync-examples
```

Or run the script directly:

```bash
python scripts/sync_examples_from_pytidb.py
```

## PyTiDB

TiDB provide a Python SDK and a series of integrations with popular AI frameworks to help developers build AI applications efficiently.

To install the TiDB Python SDK, run the following command:

```bash
pip install pytidb
```

Integrations:

- AI Frameworks: [LlamaIndex](https://docs.pingcap.com/tidbcloud/vector-search-integrate-with-llamaindex/), [LangChain](https://docs.pingcap.com/tidbcloud/vector-search-integrate-with-langchain/)
- ORM Libraries: [SQLAlchemy](https://docs.pingcap.com/tidbcloud/vector-search-integrate-with-sqlalchemy/), [Django-ORM](https://docs.pingcap.com/tidbcloud/vector-search-integrate-with-django-orm/), [Peewee](https://docs.pingcap.com/tidbcloud/vector-search-integrate-with-peewee/)
- AI Services: [Bedrock](https://docs.pingcap.com/tidbcloud/vector-search-integrate-with-amazon-bedrock/)
- Embedding Models/Services: [JinaAI](https://docs.pingcap.com/tidbcloud/vector-search-integrate-with-jinaai-embedding/)

## FAQ

### How can I get support?

- [Join our Discord](https://discord.com/invite/vYU9h56kAX) (recommended)
- [Ask questions in our forum](https://ask.pingcap.com/)
- [Send support tickets](https://tidb.support.pingcap.com/)
