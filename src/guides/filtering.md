# Filtering

TiDB provides powerful filtering capabilities that enable precise querying of your data.

TiDB supports filtering on scalar and JSON fields, and JSON field filtering is often used to implement Metadata Filtering.

## Basic Usage

You can filter the queried and operated data rows by passing a `filters` dictionary as a parameter in the `table.query()`, `table.delete()`, `table.update()`, and `table.search()` methods.

=== "Python"

Sample code for `table.query()`:

```python
table.query({
    "<key>": {
        "<operator>": <value>
    },
    ...
})
```

Sample code for `table.search()`:

```python
results = (
    table.search("<query>", search_type="vector")
        .filter({
            "<key>": {
                "<operator>": <value>
            },
            ...
        })
        .limit(10)
        .to_list()
)
```

- `<key>` can be the name of a column in the table, a JSON Path expression to access a JSON field (see [Metadata Filtering](#metadata-filtering) for details), or [Logical Operator](#logical-operators).
- `<operator>` can be a [Compare Operator](#compare-operators), [Inclusion Operator](#inclusion-operators).

### Compare Operators

| Operator | Description                                  | 
|----------|----------------------------------------------|
| `$eq`    | Equal to value                                |
| `$ne`    | Not equal to value                            |
| `$gt`    | Greater than value                            |
| `$gte`   | Greater than or equal to value                |
| `$lt`    | Less than value                               |
| `$lte`   | Less than or equal to value                   |

For example:

```python
{
    "user_id": {
        "$eq": 1
    }
}
```

The `$eq` operator can be omitted, so the following query is equivalent to the above:

```python
{
    "user_id": 1
}
```

### Inclusion Operators

| Operator | Description                                  | 
|----------|----------------------------------------------|
| `$in`    | In array (string, int, float)                |
| `$nin`   | Not in array (string, int, float)            |


For example:
```python
{
    "field_name": {
        "$in": [
            <value1>,
            <value2>,
            ...
        ]
    }
}
```

### Logical Operators

You can also use the logical operators `$and` and `$or` to combine multiple filters.

An `$and` operator will return results that match all of the filters in the list.

```python
{
    "$and": [
        {
            "field_name": {
                <operator>: <value>
            }
        },
        {
            "field_name": {
                <operator>: <value>
            }
        }
    ]
}
```

An `$or` operator will return results that match any of the filters in the list.

```python
{
    "$or": [
        {
            "field_name": {
                <operator>: <value>
            }
        },
        {
            "field_name": {
                <operator>: <value>
            }
        }
    ]
}
```

## Metadata Filtering

In TiDB, you can use the [JSON type](https://docs.pingcap.com/tidb/stable/data-type-json/) to store the metadata of the documents.

```python
from pytidb.schema import TableModel, Field
from pytidb.datatype import TEXT, JSON

class Document(TableModel):
    id: int = Field(primary_key=True)
    text: str = Field(sa_type=TEXT)
    metadata: dict = Field(default_factory=dict, sa_type=JSON)
```

If you want to filter the documents by the metadata, you can use the JSON Path expression to access the metadata.

For example:

Here are some documents in the table:

```python
[
    {
        "id": 1,
        "text": "foo",
        "metadata": {
            "source": "website"
        }
    },
    {
        "id": 2,
        "text": "bar",
        "metadata": {
            "source": "github"
        }
    },
    {
        "id": 2,
        "text": "bar",
        "metadata": {
            "source": "docs"
        }
    }
]
```

If you want to filter the documents according to the `source` field in the `metadata` column, you can use the following query:

```python
{
    "metadata.source": {
        "$eq": "website"
    }
}
```
