# Working with Tables

Compare to "Collection" and "Points" concepts in other vector databases, TiDB uses "Table" to represent a collection of data and provides flexibility to define the table structure based on your needs.

A table can contain multiple columns with various data types, including text, numbers, vectors, binary data (BLOB), JSON, and more.

!!! tip

    To check the complete example, please refer to the [example](https://github.com/pingcap/pytidb/tree/main/examples/basic).

## Create a table

### From TableModel

TiDB provides a `TableModel` class that represents the schema of a table, which is compatible with [Pydantic Model] and allows you to define the table structure in a declarative way.

In the following example, we will create a table named `items` with the following columns:

- `id`: a primary key column with an integer type.
- `content`: a text type column.
- `embedding`: a vector type column with 3 dimensions.
- `meta`: a JSON type column.

=== "Python"

    ```python
    from pytidb.schema import TableModel, Field, VectorField
    from pytidb.datatype import TEXT, JSON

    class Item(TableModel, table=True):
        __tablename__ = "items"
        id: int = Field(primary_key=True)
        content: str = Field(sa_type=TEXT)
        embedding: list[float] = VectorField(dimensions=3)
        meta: dict = Field(default_factory=dict, sa_type=JSON)

    table = db.create_table(schema=Item)
    ```

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

Once the table is created, you can use the `table` object to insert, update, delete, query data.

## Add data to a table

### With TableModel

You can using a `TableModel` instance to represent a record and insert it into the table.

Insert a single record:

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

Insert multiple records:

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

## Query data from a table

Get all records from a table:

=== "Python"

    Use the `table.query()` method to get the records from a table.

    ```python
    table.query()
    ```

=== "SQL"

    Use the `SELECT` statement to get the records from a table.

    ```sql
    SELECT * FROM items;
    ```

Find records based on some query conditions:

=== "Python"

    Pass the `filters` parameter to the `table.query()` method.

    ```python
    table.query(filters={
        "meta.category": "database"
    })
    ```

=== "SQL"

    Use the `WHERE` clause to filter the records.

    ```sql
    SELECT * FROM items WHERE meta->>'$.category' = 'database';
    ```

To check all the supported filters, please refer to the [filtering](./filtering.md) guide.


## Update data in a table

=== "Python"

    Use the `table.update()` method to update the specified records with [filters](./filtering.md).

    For example, update the record with `id` equals to 1.

    ```python
    table.update(
        values={
            "content": "TiDB Cloud Serverless is a fully-managed, auto-scaling cloud database service",
            "embedding": [0.1, 0.2, 0.4],
            "meta": {"category": "dbass"},
        },
        filters={
            "id": 1
        },
    )
    ```

=== "SQL"

    Use the `UPDATE` statement to update the specified records with [filters](./filtering.md).

    ```sql
    UPDATE items
    SET
        content = 'TiDB Cloud Serverless is a fully-managed, auto-scaling cloud database service',
        embedding = '[0.1, 0.2, 0.4]',
        meta = '{"category": "dbass"}'
    WHERE id = 1;
    ```

## Delete from a table


=== "Python"

    Use the `table.delete()` method to delete specified data records with [filters](./filtering.md).


    ```python
    table.delete(
        filters={
            "id": 2
        }
    )
    ```

=== "SQL"

    Use the `DELETE` statement to delete the specified records with [filters](./filtering.md).

    ```sql
    DELETE FROM items WHERE id = 2;
    ```

## Truncate table

=== "Python"

    To clean all data in the table but keep the table structure, use the `table.truncate()` method.

    ```python
    table.truncate()
    ```

    Check the table is truncated, should be 0 rows.

    ```python
    table.rows()
    ```

=== "SQL"

    To clean all data in the table but keep the table structure, use the `TRUNCATE TABLE` statement.

    ```sql
    TRUNCATE TABLE items;
    ```

    Check the table is truncated, should be 0 rows.

    ```sql
    SELECT COUNT(*) FROM items;
    ```

## Drop a table


=== "Python"

    To remove the specified table from the database permanently, use the `db.drop_table()` method.

    ```python
    db.drop_table("items")
    ```

    Check the table is removed from the database.

    ```
    db.table_names()
    ```

=== "SQL"

    To remove the specified table from the database permanently, use the `DROP TABLE` statement.

    ```sql
    DROP TABLE items;
    ```

    Check the table is removed from the database.

    ```sql
    SHOW TABLES;
    ```