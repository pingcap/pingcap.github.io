# Embeddings Integration

## Overview

To help you integrate with different embedding providers, TiDB offers a unified interface for working with various embedding models:

- For programmatic use, you can use the `EmbeddingFunction` class provided by the AI SDK to create an embedding function for a specific provider or model.
- For SQL use, you can use the `EMBED_TEXT` function to generate embeddings from text data.


## Embedding Function

=== "Python"

  Use the `EmbeddingFunction` class to work with different embedding providers and models.

  ```python
  from pytidb.embeddings import EmbeddingFunction

  embed_func = EmbeddingFunction(
      model_name="<provider_name>/<model_name>",
  )
  ```

  **Parameters:**

  - `model_name` *(required)*:  
    Specifies the embedding model to use, in the format `{provider_name}/{model_name}`.

  - `dimensions` *(optional)*:
    The dimensionality of the output vector embeddings. If not provided and the selected model does not include a default dimension, a test string will be embedded during initialization to automatically determine the actual dimension.

  - `api_key` *(optional)*: 
    The API key used to access the embedding service. If not explicitly set, the key will be retrieved from the default environment variable associated with the provider.

  - `api_base` *(optional)*:
    The base URL of the embedding API service.

  - `use_server` *(optional)*:
    Whether to use the database hosted embedding service provided by TiDB Cloud. For TiDB Cloud Starter, `use_server` is set to `True` by default.

  - `multimodal` *(optional)*:
    Whether to use a multimodal embedding model. When you enable multimodal embeddings, the `use_server` parameter is automatically set to `False` by default, and the embedding service is called on the client side.

=== "SQL"

  ```sql
  SELECT EMBED_TEXT('{model_id}', '{text}', '{extra_params}');
  ```

  **Parameters:**

  - `model_id` *(required)*:
    The ID of the embedding model, in the format `{provider_name}/{model_name}`, for example, `tidbcloud_free/amazon/titan-embed-text-v2`.

  - `text` *(required)*:
    The text used to generate the embedding.

  - `extra_params` *(optional)*:
    The extra parameters to be sent to the embedding API, you can refer the documentation of the embedding provider to learn more about the the supported parameters.

## Supported Providers

Below is a list of supported embedding model providers. You can follow the corresponding tutorial to learn how to integrate with the provider you are using and enable automatic embedding for your data.

- [TiDB Cloud Hosted](embedding-tidb-cloud-hosted.md)
- [OpenAI](embedding-openai.md)
- [OpenAI Compatible](embedding-openai-compatible.md) 
- [Cohere](embedding-cohere.md)
- [Jina AI](embedding-jinaai.md)
- [Google Gemini](embedding-gemini.md)
- [Hugging Face](embedding-huggingface.md)
- [NVIDIA NIM](embedding-nvidia-nim.md)
