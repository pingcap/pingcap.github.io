# Working with tables

TiDB uses tables to organize and store collections of related data. It provides flexible schema definition capabilities, allowing you to structure your tables according to your specific requirements.

A table can contain multiple columns with different data types to store various kinds of data. Supported data types include text, numbers, vectors, binary data (`BLOB`), JSON, and more.

!!! tip

    For a complete working example, see the [basic example](https://github.com/pingcap/pytidb/tree/main/examples/basic) in our repository.

## Create a table

### Using TableModel

TiDB provides a `TableModel` class that represents the schema of a table. This class is compatible with the [Pydantic Model](https://docs.pydantic.dev/latest/concepts/models/) and allows you to define the table structure in a declarative way.

In the following example, you create a table named `items` with these columns:

- `id`: a primary key column with an integer type
- `content`: a text type column
- `embedding`: a vector type column with 3 dimensions
- `meta`: a JSON type column

=== "Python"

    After you [connect to the database](./connect.md) using PyTiDB and obtain a `client` instance, you can create a table with the `create_table` method.

    ```python hl_lines="12"
    from pytidb.schema import TableModel, Field, VectorField
    from pytidb.datatype import TEXT, JSON

    class Item(TableModel):
        __tablename__ = "items"

        id: int = Field(primary_key=True)
        content: str = Field(sa_type=TEXT)
        embedding: list[float] = VectorField(dimensions=3)
        meta: dict = Field(sa_type=JSON, default_factory=dict)

    table = client.create_table(schema=Item, if_exists="overwrite")
    ```

    The `create_table` method accepts these parameters:

    - `schema`: The `TableModel` class that defines your table structure.
    - `if_exists`: The creation mode of the table.
        - `raise` (default): Creates the table if it does not exist; raises an error if it already exists.
        - `skip`: Creates the table if it does not exist; does nothing if it already exists.
        - `overwrite`: Drops the existing table and creates a new one. This is useful for **testing and development**, but not recommended for production environments.
  
    Once the table is created, you can use the `table` object to insert, update, delete, and query data.

=== "SQL"

    Use the `CREATE TABLE` statement to create a table.

    ```sql
    CREATE TABLE items (
        id INT PRIMARY KEY,
        content TEXT,
        embedding VECTOR(3),
        meta JSON
    );
    ```

## Add data to a table

### With TableModel

You can use a `TableModel` instance to represent a record and insert it into the table.

To insert a single record:

=== "Python"

    Use the `table.insert()` method to insert a single record into the table.

    ```python
    table.insert(
        Item(
            id=1,
            content="TiDB is a distributed SQL database",
            embedding=[0.1, 0.2, 0.3],
            meta={"category": "database"},
        )
    )
    ```

=== "SQL"

    Use the `INSERT INTO` statement to insert a single record into the table.

    ```sql
    INSERT INTO items(id, content, embedding, meta)
    VALUES (1, 'TiDB is a distributed SQL database', '[0.1, 0.2, 0.3]', '{"category": "database"}');
    ```

To insert multiple records:

=== "Python"

    Use the `table.bulk_insert()` method to insert multiple records into the table.

    ```python
    table.bulk_insert([
        Item(
            id=2,
            content="GPT-4 is a large language model",
            embedding=[0.4, 0.5, 0.6],
            meta={"category": "llm"},
        ),
        Item(
            id=3,
            content="LlamaIndex is a Python library for building AI-powered applications",
            embedding=[0.7, 0.8, 0.9],
            meta={"category": "rag"},
        ),
    ])
    ```

=== "SQL"

    Use the `INSERT INTO` statement to insert multiple records into the table.

    ```sql
    INSERT INTO items(id, content, embedding, meta)
    VALUES
        (2, 'GPT-4 is a large language model', '[0.4, 0.5, 0.6]', '{"category": "llm"}'),
        (3, 'LlamaIndex is a Python library for building AI-powered applications', '[0.7, 0.8, 0.9]', '{"category": "rag"}');
    ```

### With Dict

You can also use `dict` to represent records and insert them into the table. This approach is more flexible and doesn't require to use a `TableModel` to insert data.

To insert a single record:

=== "Python"

    Use the `table.insert()` method with a dictionary to insert a single record into the table.

    ```python
    table.insert({
        "id": 1,
        "content": "TiDB is a distributed SQL database",
        "embedding": [0.1, 0.2, 0.3],
        "meta": {"category": "database"},
    })
    ```

=== "SQL"

    Use the `INSERT INTO` statement to insert a single record into the table.

    ```sql
    INSERT INTO items(id, content, embedding, meta)
    VALUES (1, 'TiDB is a distributed SQL database', '[0.1, 0.2, 0.3]', '{"category": "database"}');
    ```

## Save data to a table

The `save` method provides a convenient way to insert or update a single record. If a record with the specified primary key does not exist, it creates a new record. If the record already exists, it overwrites the entire record.

!!! note

    If a record ID already exists, `table.save()` function overwrites the entire record. To change only part of a record, use `table.update()`.

=== "Python"

    Use the `table.save()` method to save a single record to the table.

    **Example: Save a new record**

    ```python
    saved_record = table.save(
        Item(
            id=4,
            content="Vector databases enable AI applications",
            embedding=[1.0, 1.1, 1.2],
            meta={"category": "vector-db"},
        )
    )
    ```

    **Example: Save an existing record (overwrites the entire record)**

    ```python
    # This overwrites the entire record with id=1
    updated_record = table.save(
        Item(
            id=1,  # Existing ID
            content="Updated content for TiDB",
            embedding=[0.2, 0.3, 0.4],
            meta={"category": "updated"},
        )
    )
    ```

=== "SQL"

    Use the `INSERT ... ON DUPLICATE KEY UPDATE` statement to save a record.

    **Example: Save a new record or update if it exists**

    ```sql
    INSERT INTO items(id, content, embedding, meta)
    VALUES (4, 'Vector databases enable AI applications', '[1.0, 1.1, 1.2]', '{"category": "vector-db"}')
    ON DUPLICATE KEY UPDATE
        content = VALUES(content),
        embedding = VALUES(embedding),
        meta = VALUES(meta);
    ```

## Query data from a table

To fetch records from a table:

=== "Python"

    Use the `table.query()` method to fetch the records from the table.

    **Example: Fetch the first 10 records**

    ```python
    result = table.query(limit=10).to_list()
    ```

=== "SQL"

    Use the `SELECT` statement to fetch the records from the table.

    **Example: Fetch the first 10 records**

    ```sql
    SELECT * FROM items LIMIT 10;
    ```

To fetch records based on query conditions:

=== "Python"

    Pass the `filters` parameter to the `table.query()` method.

    ```python
    result = table.query(
        filters={"meta.category": "database"},
        limit=10
    ).to_list()
    ```

=== "SQL"

    Use the `WHERE` clause to filter records.

    **Example: Fetch the 10 records with category "database"**

    ```sql
    SELECT * FROM items WHERE meta->>'$.category' = 'database' LIMIT 10;
    ```

For a complete list of supported filter operations and examples, refer to the [filtering](./filtering.md) guide.

## Update data in a table

=== "Python"

    Use the `table.update()` method to update records with [filters](./filtering.md).

    **Example: Update the record whose `id` equals 1**

    ```python
    table.update(
        values={
            "content": "TiDB Cloud Serverless is a fully managed, auto-scaling cloud database service",
            "embedding": [0.1, 0.2, 0.4],
            "meta": {"category": "dbass"},
        },
        filters={
            "id": 1
        },
    )
    ```

=== "SQL"

    Use the `UPDATE` statement to update records with [filters](./filtering.md).

    **Example: Update the record whose `id` equals 1**

    ```sql
    UPDATE items
    SET
        content = 'TiDB Cloud Serverless is a fully managed, auto-scaling cloud database service',
        embedding = '[0.1, 0.2, 0.4]',
        meta = '{"category": "dbass"}'
    WHERE
        id = 1;
    ```

## Delete from a table

=== "Python"

    Use the `table.delete()` method to delete records with [filters](./filtering.md).

    **Example: Delete the record where `id` equals 2**

    ```python
    table.delete(
        filters={
            "id": 2
        }
    )
    ```

=== "SQL"

    Use the `DELETE` statement to delete records with [filters](./filtering.md).

    **Example: Delete the record where `id` equals 2**

    ```sql
    DELETE FROM items WHERE id = 2;
    ```

## Truncate a table

=== "Python"

    To remove all data from the table but keep the table structure, use the `table.truncate()` method.

    ```python
    table.truncate()
    ```

    To check that the table is truncated, verify that it contains 0 rows.

    ```python
    table.rows()
    ```

=== "SQL"

    To remove all data from the table but keep the table structure, use the `TRUNCATE TABLE` statement.

    ```sql
    TRUNCATE TABLE items;
    ```

    To check that the table is truncated, verify that it contains 0 rows.

    ```sql
    SELECT COUNT(*) FROM items;
    ```

## Drop a table

=== "Python"

    To permanently remove a table from the database, use the `client.drop_table()` method.

    ```python
    client.drop_table("items")
    ```

    To check that the table is removed from the database:

    ```python
    client.table_names()
    ```

=== "SQL"

    To permanently remove a table from the database, use the `DROP TABLE` statement.

    ```sql
    DROP TABLE items;
    ```

    To check that the table is removed from the database:

    ```sql
    SHOW TABLES;
    ```
