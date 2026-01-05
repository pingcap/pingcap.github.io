# Integrate Vector Search with Camel Framework

This tutorial demonstrates how to integrate the [vector search](https://docs.pingcap.com/tidbcloud/vector-search-overview) feature of TiDB with [Camel Framework](https://www.camel-ai.org), a multi-agent framework for large language models.

!!! note

    The vector search feature is only available for TiDB Self-Managed clusters and [TiDB Cloud Starter](https://docs.pingcap.com/tidbcloud/select-cluster-tier#tidb-cloud-starter) clusters.

!!! tip

    You can view the complete [sample code](https://github.com/camel-ai/camel/blob/master/examples/storages/tidb_vector_storage.py) on GitHub, or refer to the [Camel TiDB API documentation](https://docs.camel-ai.org/reference/camel.storages.vectordb_storages.tidb) for detailed usage.

## Prerequisites

To complete this tutorial, you need:

- [Python 3.8 or higher](https://www.python.org/downloads/) installed.
- [Jupyter Notebook](https://jupyter.org/install) installed.
- [Git](https://git-scm.com/downloads) installed.
- A TiDB cluster.

## Get started

This section provides step-by-step instructions for integrating TiDB Vector Search with Camel Framework to perform semantic searches using multi-agent capabilities.

### Step 1. Create a new Jupyter Notebook file

In the root directory, create a new Jupyter Notebook file named `integrate_with_camel.ipynb`:

```shell
touch integrate_with_camel.ipynb
```

### Step 2. Install required dependencies

In your project directory, run the following command to install the required packages:

```shell
pip install camel-ai[all]
pip install pytidb
```

Open the `integrate_with_camel.ipynb` file in Jupyter Notebook and add the following code to import the required packages:

```python
import textwrap
from typing import List

from camel.storages.vectordb_storages.tidb import TiDBVectorStorage
from camel.types import StorageType
from camel.embeddings import OpenAIEmbedding
from camel.agents import ChatAgent
from camel.messages import BaseMessage
```

### Step 3. Configure environment variables

Configure the environment variables depending on the TiDB deployment option you've selected.

For a TiDB Cloud Starter cluster, take the following steps to obtain the cluster connection string and configure environment variables:

1. Navigate to the [**Clusters**](https://tidbcloud.com/console/clusters) page, and then click the name of your target cluster to go to its overview page.

2. Click **Connect** in the upper-right corner. A connection dialog is displayed.

3. Ensure the configurations in the connection dialog match your operating environment.

    - **Connection Type** is set to `Public`.
    - **Branch** is set to `main`.
    - **Connect With** is set to `SQLAlchemy`.
    - **Operating System** matches your environment.

4. Click the **PyMySQL** tab and copy the connection string.

    > **Tip:**
    >
    > If you have not set a password yet, click **Generate Password** to generate a random password.

5. Configure environment variables.

    This document uses [OpenAI](https://platform.openai.com/docs/introduction) as the embedding model provider. In this step, you need to provide the connection string obtained from the previous step and your [OpenAI API key](https://platform.openai.com/docs/quickstart/step-2-set-up-your-api-key).

    To configure the environment variables, run the following code. You will be prompted to enter your connection string and OpenAI API key:

    ```python
    # Use getpass to securely prompt for environment variables in your terminal.
    import getpass
    import os

    # Copy your connection string from the TiDB Cloud console.
    # Connection string format: "mysql+pymysql://<USER>:<PASSWORD>@<HOST>:4000/<DB>?ssl_ca=/etc/ssl/cert.pem&ssl_verify_cert=true&ssl_verify_identity=true"
    tidb_connection_string = getpass.getpass("TiDB Connection String:")
    os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
    ```

For TiDB Self-Managed clusters, configure the environment variables as follows:

```python
# Use getpass to securely prompt for environment variables in your terminal.
import getpass
import os

# Connection string format: "mysql+pymysql://<USER>:<PASSWORD>@<HOST>:4000/<DB>?ssl_ca=/etc/ssl/cert.pem&ssl_verify_cert=true&ssl_verify_identity=true"
tidb_connection_string = getpass.getpass("TiDB Connection String:")
os.environ["OPENAI_API_KEY"] = getpass.getpass("OpenAI API Key:")
```

Taking macOS as an example, the cluster connection string is as follows:

```dotenv
TIDB_DATABASE_URL="mysql+pymysql://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASE_NAME>"
# For example: TIDB_DATABASE_URL="mysql+pymysql://root@127.0.0.1:4000/test"
```

You need to modify the parameters in the connection string according to your TiDB cluster. If you are running TiDB on your local machine, `<HOST>` is `127.0.0.1` by default. The initial `<PASSWORD>` is empty, so if you are starting the cluster for the first time, you can omit this field.

The following are descriptions for each parameter:

- `<USERNAME>`: The username to connect to the TiDB cluster.
- `<PASSWORD>`: The password to connect to the TiDB cluster.
- `<HOST>`: The host of the TiDB cluster.
- `<PORT>`: The port of the TiDB cluster.
- `<DATABASE>`: The name of the database you want to connect to.

### Step 4. Initialize the TiDB vector storage

The following code creates a TiDB vector storage instance that will be used by the Camel framework for storing and retrieving embeddings.

```python
# Initialize the TiDB vector storage
tidb_storage = TiDBVectorStorage(
    url_and_api_key=(tidb_connection_string, None),
    vector_dim=1536,  # OpenAI embedding dimension
    collection_name="camel_documents",
)

# Initialize the embedding model
embedding_model = OpenAIEmbedding()
```

### Step 5. Load and process documents

#### Step 5.1 Download the sample document

In your project directory, create a directory named `data/paul_graham/` and download the sample document [`paul_graham_essay.txt`](https://raw.githubusercontent.com/run-llama/llama_index/main/docs/docs/examples/data/paul_graham/paul_graham_essay.txt) from the LlamaIndex repository.

```shell
!mkdir -p 'data/paul_graham/'
!wget 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/docs/examples/data/paul_graham/paul_graham_essay.txt' -O 'data/paul_graham/paul_graham_essay.txt'
```

#### Step 5.2 Load and chunk the document

Load the sample document and split it into chunks for processing:

```python
# Read the document
with open("./data/paul_graham/paul_graham_essay.txt", "r") as file:
    document_text = file.read()

# Split the document into chunks
chunk_size = 1000
chunks = []
for i in range(0, len(document_text), chunk_size):
    chunk = document_text[i:i + chunk_size]
    chunks.append({
        "content": chunk,
        "metadata": {
            "source": "paul_graham_essay.txt",
            "chunk_id": i // chunk_size,
            "book": "paul_graham"
        }
    })

print(f"Created {len(chunks)} chunks from the document")
```

### Step 6. Embed and store document vectors

Generate embeddings for the document chunks and store them in TiDB:

```python
# Generate embeddings and store in TiDB
records = []
for chunk in chunks:
    # Generate embedding for the chunk
    embedding = embedding_model.embed(chunk["content"])
    
    # Create record for storage
    record = {
        "payload": chunk["content"],
        "vector": embedding,
        "metadata": chunk["metadata"]
    }
    records.append(record)

# Store all records in TiDB
tidb_storage.add(records)

print(f"Successfully stored {len(records)} document embeddings in TiDB")
```

### Step 7. Perform vector search

Create a search function and perform semantic similarity search using the Camel framework:

```python
def search_documents(query: str, top_k: int = 3) -> List[dict]:
    """
    Search for documents similar to the query using TiDB vector search.
    
    Args:
        query: The search query string
        top_k: Number of top results to return
        
    Returns:
        List of matching documents with metadata
    """
    # Generate embedding for the query
    query_embedding = embedding_model.embed(query)
    
    # Search in TiDB vector storage
    results = tidb_storage.query(
        query=query_embedding,
        top_k=top_k
    )
    
    return results

# Perform a search
query = "What did the author do?"
search_results = search_documents(query, top_k=3)

print("Search Results:")
for i, result in enumerate(search_results):
    print(f"\n--- Result {i+1} ---")
    print(f"Score: {result.get('score', 'N/A')}")
    print(f"Content: {textwrap.fill(result['payload'][:200], 80)}...")
    print(f"Metadata: {result['metadata']}")
```

### Step 8. Use with Camel agents

Integrate the TiDB vector search with Camel's multi-agent system:

```python
from camel.agents import ChatAgent
from camel.messages import BaseMessage
from camel.types import RoleType

# Create a knowledge-enhanced agent
class KnowledgeAgent(ChatAgent):
    def __init__(self, tidb_storage, embedding_model, **kwargs):
        super().__init__(**kwargs)
        self.tidb_storage = tidb_storage
        self.embedding_model = embedding_model
    
    def search_knowledge(self, query: str, top_k: int = 3) -> str:
        """Search for relevant knowledge using TiDB vector search."""
        query_embedding = self.embedding_model.embed(query)
        results = self.tidb_storage.query(query=query_embedding, top_k=top_k)
        
        # Format results as context
        context = "\n\n".join([
            f"Document {i+1}: {result['payload']}"
            for i, result in enumerate(results)
        ])
        return context

# Initialize the knowledge agent
knowledge_agent = KnowledgeAgent(
    tidb_storage=tidb_storage,
    embedding_model=embedding_model,
    role_name="Knowledge Assistant",
    role_type=RoleType.ASSISTANT
)

# Use the agent to answer questions with knowledge retrieval
user_query = "What did the author learn from his experiences?"

# Search for relevant context
relevant_context = knowledge_agent.search_knowledge(user_query)

# Create a message with context
enhanced_query = f"""
Based on the following context:

{relevant_context}

Please answer: {user_query}
"""

response = knowledge_agent.step(BaseMessage.make_user_message(
    role_name="User",
    content=enhanced_query
))

print("Agent Response:")
print(textwrap.fill(str(response.msg.content), 100))
```

### Step 9. Search with metadata filters

To refine your searches, you can use metadata filters to retrieve specific results that match the applied filters:

#### Query with `book == "paul_graham"` filter

The following example filters results to include only documents where the `book` metadata field is `"paul_graham"`:

```python
# Search with metadata filter
filtered_results = tidb_storage.query(
    query=embedding_model.embed("What did the author learn?"),
    top_k=2,
    filter_criteria={"book": "paul_graham"}
)

print("Filtered Search Results:")
for i, result in enumerate(filtered_results):
    print(f"\n--- Filtered Result {i+1} ---")
    print(f"Content: {textwrap.fill(result['payload'][:200], 80)}...")
    print(f"Metadata: {result['metadata']}")
```

#### Query with exclusion filter

The following example excludes results where the `book` metadata field is `"paul_graham"`:

```python
# Search with exclusion filter
excluded_results = tidb_storage.query(
    query=embedding_model.embed("What did the author learn?"),
    top_k=2,
    filter_criteria={"book": {"$ne": "paul_graham"}}
)

print("Excluded Search Results:")
if excluded_results:
    for i, result in enumerate(excluded_results):
        print(f"\n--- Excluded Result {i+1} ---")
        print(f"Content: {textwrap.fill(result['payload'][:200], 80)}...")
else:
    print("No results found (as expected - all documents have book='paul_graham')")
```

### Step 10. Delete documents

Delete specific documents from the TiDB vector storage:

```python
# Delete documents by metadata filter
deleted_count = tidb_storage.delete(
    filter_criteria={"book": "paul_graham", "chunk_id": 0}
)

print(f"Deleted {deleted_count} documents")

# Verify deletion by searching again
verification_results = tidb_storage.query(
    query=embedding_model.embed("What did the author learn?"),
    top_k=5
)

print(f"Remaining documents: {len(verification_results)}")
```

## Multi-agent workflow example

The following example demonstrates how to use TiDB vector storage in a multi-agent Camel workflow:

```python
from camel.societies import RolePlaying
from camel.types import TaskType, RoleType

# Create a role-playing scenario with knowledge retrieval
def create_knowledge_enhanced_roleplay(tidb_storage, embedding_model):
    # Define the task
    task_prompt = """
    You are working on analyzing Paul Graham's essay. 
    Use the knowledge base to provide accurate information about his experiences.
    """
    
    # Create agents with access to knowledge base
    user_agent = ChatAgent(
        role_name="Researcher",
        role_type=RoleType.USER
    )
    
    assistant_agent = KnowledgeAgent(
        tidb_storage=tidb_storage,
        embedding_model=embedding_model,
        role_name="Knowledge Expert",
        role_type=RoleType.ASSISTANT
    )
    
    # Create role-playing society
    role_play_session = RolePlaying(
        assistant_role_name="Knowledge Expert",
        user_role_name="Researcher",
        assistant_agent=assistant_agent,
        user_agent=user_agent,
        task_prompt=task_prompt,
        task_type=TaskType.AI_SOCIETY
    )
    
    return role_play_session

# Create and run the knowledge-enhanced workflow
roleplay = create_knowledge_enhanced_roleplay(tidb_storage, embedding_model)

# Start the conversation
initial_message = "What can you tell me about the author's journey in programming and entrepreneurship?"

# Get response from the knowledge-enhanced agent
response = roleplay.step(initial_message)
print("Multi-agent Response:")
print(textwrap.fill(str(response), 100))
```

This example demonstrates how TiDB's vector search capabilities can be seamlessly integrated with Camel's multi-agent framework to create knowledge-enhanced AI systems that can retrieve and reason over large document collections.
