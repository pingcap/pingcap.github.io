# Auto Embedding

Auto embedding is a feature that allows you to automatically generate vector embeddings for text data.

!!! tip

    To check the complete example code, please refer to the [auto embedding example](https://github.com/pingcap/pytidb/blob/main/examples/auto_embedding).

## Basic Usage

### Step 1. Define a embedding function

=== "Python"

    Define a embedding function to generate vector embeddings for text data.
    
    In this example, we use OpenAI as the embedding provider for demonstration, for other providers, please check the [Supported Providers](#supported-providers) list.

    ```python
    from pytidb.embeddings import EmbeddingFunction

    embed_func = EmbeddingFunction(
        model_name="openai/{model_name}",       # openai/text-embedding-3-small
        api_key="{your-openai-api-key}",
    )
    ```

### Step 2. Create a table and a vector field

=== "Python"

    Use `embed_func.VectorField()` to create a vector field on the table.

    To enable auto embedding, you need to set `source_field` to the field that you want to embed.

    ```python hl_lines="7"
    from pytidb.schema import TableModel, Field
    from pytidb.datatype import Text

    class Chunk(TableModel, table=True):
        id: int = Field(primary_key=True)
        text: str = Field(sa_type=Text)
        text_vec: list[float] = embed_func.VectorField(source_field="text")

    table = db.create_table(schema=Chunk)
    ```

    You don't need to specify the `dimensions` parameter, it will be automatically determined by the embedding model.
    
    However, you can specify the `dimensions` parameter to override the default dimension.

### Step 3. Insert some sample data

=== "Python"

    Insert some sample data into the table.

    ```python
    table.bulk_insert([
        Chunk(text="TiDB is a distributed database that supports OLTP, OLAP, HTAP and AI workloads."),
        Chunk(text="PyTiDB is a Python library for developers to connect to TiDB."),
        Chunk(text="LlamaIndex is a Python library for building AI-powered applications."),
    ])
    ```

    When inserting data, the `text_vec` field will be automatically populated with the vector embeddings generated based on the `text` field.

### Step 4. Perform a vector search

=== "Python"

    You can pass the query text to the `search()` method directly, the query text will be embedded and then used for vector search.

    ```python
    table.search("HTAP database").limit(3).to_list()
    ```

## Embedding Function

`EmbeddingFunction` provides a unified interface in `pytidb` for accessing external embedding model services.

#### Constructor Parameters

- `model_name` *(required)*:  
  Specifies the embedding model to use, in the format `{provider_name}/{model_name}`.

- `dimensions` *(optional)*:  
  The dimensionality of the output vector embeddings. If not provided and the selected model does not include a default dimension, a test string will be embedded during initialization to automatically determine the actual dimension.

- `api_key` *(optional)*:  
  The API key used to access the embedding service. If not explicitly set, the key will be retrieved from the default environment variable associated with the provider.

- `api_base` *(optional)*:  
  The base URL of the embedding API service.

### Supported Providers

Below is a list of supported embedding model providers. You can follow the corresponding example to create an EmbeddingFunction instance for the provider you are using.

#### OpenAI

For OpenAI users, you can go to [OpenAI API Platform](https://platform.openai.com/api-keys) to create your own API key.

```python
embed_func = EmbeddingFunction(
    model_name="openai/{model_name}",       # openai/text-embedding-3-small
    api_key="{your-openai-api-key}",
)
```

#### OpenAI Like

If you're using a platform or tool that is compatible with the OpenAI API format, you can indicate this by adding the `openai/` prefix to the `model_name` parameter. Then, use the `api_base` parameter to specify the base URL of the API provided by your platform or tool.

```python
embed_func = EmbeddingFunction(
    model_name="openai/{model_name}",        # text-embedding-3-small 
    api_key="{your-server-api-key}",
    api_base="{your-api-server-base-url}"    # http://localhost:11434/
)
```

#### Jina AI

For Jina AI users, you can go to [Jina AI website](https://jina.ai/embeddings/) to create your own API key.

```python
embed_func = EmbeddingFunction(
    model_name="jina_ai/{model_name}",  # jina_ai/jina-embeddings-v3
    api_key="{your-jina-api-key}"
)
```

