# Hybrid Search

Hybrid search is a technique that combines multiple search algorithms to deliver more accurate and relevant results. 

TiDB supports both semantic search (also termed vector search) and keyword-based search (also known as full-text search). You can leverage the strengths of both approaches to achieve better search results via hybrid search.

<p align="center">
    <img src="https://docs-download.pingcap.com/media/images/docs/vector-search/hybrid-search-overview.svg" alt="hybrid search overview" width="800"/>
</p>

!!! tip

    To check complete example of hybrid search, please refer to the [hybrid-search example](https://github.com/pingcap/pytidb/tree/main/examples/hybrid_search).


## Basic Usage

### Step 1. Define a embedding function

Define an embedding function to generate vector representations of text data.

```python
from pytidb.embeddings import EmbeddingFunction

embed_fn = EmbeddingFunction(
    model_name="openai/text-embedding-3-small",
    api_key=os.getenv("OPENAI_API_KEY"),
)
```

### Step 2. Create a table with vector index and full-text index

=== "Python"

    Assuming you have already [connected to your TiDB database](./connect.md) using `TiDBClient`:

    Now, you can create a table with a text field and a vector field. PyTiDB will automatically create a vector index on the `text_vec` column and a full-text index can be created via `create_fts_index()` method.

    Sample code:

    ```python
    from pytidb.schema import TableModel, Field
    from pytidb.datatype import Text

    class Chunk(TableModel, table=True):
        __tablename__ = "chunks_for_hybrid_search"
        id: int = Field(primary_key=True)
        text: str = Field(sa_type=Text)
        text_vec: list[float] = embed_fn.VectorField(source_field="text")

    table = db.create_table(schema=Chunk)

    if not table.has_fts_index("text"):
        table.create_fts_index("text")
    ```

### Step 3. Insert some sample data

=== "Python"

    Using `bulk_insert()` method to insert some sample data into the table.

    ```python
    table.delete()
    table.bulk_insert([
        Chunk(
            text="TiDB is a distributed database that supports OLTP, OLAP, HTAP and AI workloads.",
        ),
        Chunk(
            text="PyTiDB is a Python library for developers to connect to TiDB.",
        ),
        Chunk(
            text="LlamaIndex is a Python library for building AI-powered applications.",
        ),
    ])
    ```

### Step 4. Perform hybrid search

To enable hybrid search, you need to set the `search_type` parameter to `hybrid` when calling the `search()` method.

```python
results = (
    table.search(
        "AI database", search_type="hybrid"
    )
    .limit(3)
    .to_list()
)

for item in results:
    item.pop("text_vec")
print(json.dumps(results, indent=4, sort_keys=True))
```

The search results contains three special fields:

- `_distance`: The distance between the query vector and the vector data in the table returned by the vector search.
- `_match_score`: The match score between the query and the text field returned by the full-text search.
- `_score`: The final score of the search result, which is calculated by the fusion algorithm.

```json title="Output"
[
    {
        "_distance": 0.4740166257687124,
        "_match_score": 1.6804268,
        "_score": 0.03278688524590164,
        "id": 60013,
        "text": "TiDB is a distributed database that supports OLTP, OLAP, HTAP and AI workloads."
    },
    {
        "_distance": 0.6428459116216618,
        "_match_score": 0.78427225,
        "_score": 0.03200204813108039,
        "id": 60015,
        "text": "LlamaIndex is a Python library for building AI-powered applications."
    },
    {
        "_distance": 0.641581407158715,
        "_match_score": null,
        "_score": 0.016129032258064516,
        "id": 60014,
        "text": "PyTiDB is a Python library for developers to connect to TiDB."
    }
]
```


## Fusion Method

PyTiDB currently supports one fusion methods:

- `rrf`: Reciprocal Rank Fusion (RRF) (default)

### Reciprocal Rank Fusion (RRF)

Reciprocal Rank Fusion (RRF) is an algorithm that evaluates the search by leveraging the rank of the documents in multiple search result sets.

For more details, please refer to the [RRF paper](https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf).

=== "Python"

    You can use `fusion()` method to specify the fusion method and parameters.

    ```python
    results = (
        table.search(
            "AI database", search_type="hybrid"
        )
        .fusion(method="rrf", k=60)
        .limit(3)
        .to_list()
    )
    ```

    Parameters:

    - `k`: is a constant (default: 60) to prevent division by zero and control the impact of high-ranked documents.


## Reranking

=== "Python"

    Use the `rerank()` method to specify a reranker that sorts search results by relevance between the query and documents. See the [Reranking](./reranking.md) section for details.

    ```python
    reranker = Reranker(
        # Using the `jina-reranker-m0` model
        model_name="jina_ai/jina-reranker-m0",
        api_key="{your-jinaai-api-key}"
    )

    results = (
        table.search(
            "AI database", search_type="hybrid"
        )
        .fusion(method="rrf", k=60)
        .rerank(reranker, "text")
        .limit(3)
        .to_list()
    )
    ```
