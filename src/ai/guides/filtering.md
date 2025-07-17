# Filtering

As a relational database, TiDB supports a rich set of [SQL operators](https://docs.pingcap.com/tidbcloud/operators/) and allows flexible combinations of filtering conditions that enable you to query your data precisely.

## Overview

You can not only apply filtering on scalar fields but also on JSON fields. Filtering on JSON fields is often used for [metadata filtering](./vector-search.md#metadata-filtering) in vector search.

=== "Python"

For PyTiDB, you can apply filtering by passing a **filters** parameter to the `table.query()`, `table.delete()`, `table.update()`, and `table.search()` methods.

The **filters** parameter supports two formats: [Dictionary Filters](#dictionary-filters) and [SQL String Filters](#sql-string-filters).

## Dictionary Filters

=== "Python"

PyTiDB allows you to define filter conditions using a Python dictionary with operators as the **filters** parameter.

The dictionary structure of **filters** is as follows:

```python
{
    "<key>": {
        "<operator>": <value>
    },
    ...
}
```

- `<key>`: The key can be a column name, a JSON path expression to access a JSON field (see [Metadata filtering](./vector-search.md#metadata-filtering)), or a [logical operator](#logical-operators).
- `<operator>`: The operator can be a [compare operator](#compare-operators) or an [inclusion operator](#inclusion-operators).
- `<value>`: The value can be a scalar value, an array, it depends on the operator.

**Example: Filter records where `created_at` is greater than 2024-01-01**

```python
table.query({
    # The `created_at` is a scalar field with DATETIME type
    "created_at": {
        "$gt": "2024-01-01"
    }
})
```

**Example: Filter records where `meta.category` is in the array ["tech", "science"]**

```python
results = (
    table.search("some query", search_type="vector")
        .filter({
            # The `meta` is a JSON field, and its value is a JSON object like {"category": "tech"}
            "meta.category": {
                "$in": ["tech", "science"]
            }
        })
        .limit(10)
        .to_list()
)
```

### Compare operators

You can use the following compare operators to filter records:

| Operator | Description                       |
|----------|-----------------------------------|
| `$eq`    | Equal to value                    |
| `$ne`    | Not equal to value                |
| `$gt`    | Greater than value                |
| `$gte`   | Greater than or equal to value    |
| `$lt`    | Less than value                   |
| `$lte`   | Less than or equal to value       |

**Example: filter records where `user_id` is equal to 1**

```python
{
    "user_id": {
        "$eq": 1
    }
}
```

You can omit the `$eq` operator. The following query is equivalent to the above:

```python
{
    "user_id": 1
}
```

### Inclusion operators

You can use the following inclusion operators to filter records:

| Operator | Description                       |
|----------|-----------------------------------|
| `$in`    | In array (string, int, or float)  |
| `$nin`   | Not in array (string, int, float) |

**Example: Filter records where `category` is in the array ["tech", "science"]**

```python
{
    "category": {
        "$in": ["tech", "science"]
    }
}
```

### Logical operators

You can use the logical operators `$and` and `$or` to combine multiple filters.

| Operator | Description                                         |
|----------|-----------------------------------------------------|
| `$and`   | Returns results that match **all** filters in the list |
| `$or`    | Returns results that match **any** filter in the list |

**Syntax for using `$and` or `$or`:**

```python
{
    "$and|$or": [
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
        ...
    ]
}
```

**Example: using `$and` to combine multiple filters:**

```python
{
    "$and": [
        {
            "created_at": {
                "$gt": "2024-01-01"
            }
        },
        {
            "meta.category": {
                "$in": ["tech", "science"]
            }
        }
    ]
}
```

## SQL String Filters

=== "Python"

You can also use a SQL string as the `filters` parameter. The string should be a valid SQL `WHERE` clause (without the `WHERE` keyword) using TiDB's SQL syntax.

**Example: Filter records where `created_at` is greater than 2024-01-01**

```python
results = table.query(
    filters="created_at > '2024-01-01'",
    limit=10
).to_list()
```

**Example: Filter records where the JSON field `meta.category` equals 'tech'**

```python
results = table.query(
    filters="meta->>'$.category' = 'tech'",
    limit=10
).to_list()
```

You can combine multiple conditions using `AND`, `OR`, and parentheses, and use any [SQL operators](https://docs.pingcap.com/tidbcloud/operators/) supported by TiDB.

!!! warning

    When using SQL string filters with dynamic user input, always validate the input to prevent [SQL injection](https://en.wikipedia.org/wiki/SQL_injection) vulnerabilities.
