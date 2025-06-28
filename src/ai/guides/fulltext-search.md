# Full-text Search

**Full-text search** is a technique that finds documents or data by matching keywords or phrases within the entire text content.

TiDB provides full-text search capabilities for **massive datasets** with high performance and built-in **multilingual support**.

!!! note

    Currently, Full-text search is only available for **TiDB Cloud Serverless** and the following regions:
    
    - **Frankfurt (eu-central-1)**
    - **Singapore (ap-southeast-1)**

!!! tip

    To check the complete example code, please refer to the [full-text search example](https://github.com/pingcap/pytidb/blob/main/examples/fulltext_search).

## Basic Usage

### Step 1. Create a table and a full-text index

=== "Python"

    You can use `table.create_fts_index()` method to create full-text search index on the specified column (e.g. `title`).

    ```python hl_lines="6"
    from pytidb.schema import TableModel, Field, FullTextField

    class Item(TableModel):
        __tablename__ = "items"
        id: int = Field(primary_key=True)
        title: str = FullTextField(fts_parser="MULTILINGUAL")

    table = db.create_table(schema=Item, mode="overwrite")
    ```

    The `fts_parser` parameter specifies the parser to use for the full-text index. Currently, the following parsers are supported:
    
    - `STANDARD`: fast, works for English contents, splitting words by spaces and punctuation.
    - `MULTILINGUAL` (default): supports multiple languages, including English, Chinese, Japanese, and Korean.

=== "SQL"

    Create a table with a full-text index:

    ```sql
    CREATE TABLE items(
        id INT PRIMARY KEY,
        title TEXT,
        FULLTEXT INDEX (title) WITH PARSER MULTILINGUAL
    );
    ```

    Or add a full-text index to an existing table:

    ```sql
    ALTER TABLE items ADD FULLTEXT INDEX (title)
    WITH PARSER MULTILINGUAL ADD_COLUMNAR_REPLICA_ON_DEMAND;
    ```

    The following parsers are accepted in the `WITH PARSER <PARSER_NAME>` clause:

    - `STANDARD`: fast, works for English contents, splitting words by spaces and punctuation.
    - `MULTILINGUAL`: supports multiple languages, including English, Chinese, Japanese, and Korean.

### Step 2. Ingest sample data

For demonstration purposes, we will ingest some sample text data with multiple languages into the table.

=== "Python"

    ```python
    table.bulk_insert([
        Item(id=1, title="Bluetooth Earphones, HiFi sound, 48h battery, Fast charge, Low latency"),
        Item(id=2, title="Bluetooth 5.3 Headphones, Noise Cancelling, Immersive sound, Comfortable"),
        Item(id=3, title="IPX7 Waterproof Earbuds, Sport ready, Touch control, High-quality music"),
        Item(id=4, title="Sports Earbuds, Secure fit, Sweatproof, Long battery, Workout support"),
        Item(id=5, title="Wired Headphones, Studio-grade, HD sound, Comfortable, Pro music experience"),
        Item(id=6, title="Bluetoothイヤホン HiFi音質 48hバッテリー 急速充電 低遅延"),
        Item(id=7, title="Bluetooth5.3ヘッドホン ノイズキャンセリング 没入サウンド 快適装着"),
        Item(id=8, title="IPX7防水イヤホン スポーツ対応 タッチ操作 高音質音楽"),
        Item(id=9, title="スポーツイヤホン 安定装着 防汗 長持ちバッテリー ワークアウト対応"),
        Item(id=10, title="有線ヘッドホン スタジオ級 HDサウンド 快適装着 プロ音楽体験"),
        Item(id=11, title="无线蓝牙耳机 HiFi音质 48小时超长续航 快速充电 低延迟"),
        Item(id=12, title="蓝牙5.3降噪头戴式耳机 杜比全景声 沉浸音效 舒适佩戴 畅享静谧音乐时光"),
        Item(id=13, title="IPX7防水真无线耳机 运动无忧 智能触控 随时畅听高品质音乐"),
        Item(id=14, title="运动专用耳机 稳固佩戴 防汗设计 超长续航 低延迟音频 高清通话"),
        Item(id=15, title="录音室级有线耳机 高清音质 舒适佩戴 可拆卸线材 多设备兼容 降噪麦克风"),
    ])
    ```

=== "SQL"

    ```sql
    INSERT INTO items (id, title) VALUES
        (1, 'Bluetooth Earphones, HiFi sound, 48h battery, Fast charge, Low latency'),
        (2, 'Bluetooth 5.3 Headphones, Noise Cancelling, Immersive sound, Comfortable'),
        (3, 'IPX7 Waterproof Earbuds, Sport ready, Touch control, High-quality music'),
        (4, 'Sports Earbuds, Secure fit, Sweatproof, Long battery, Workout support'),
        (5, 'Wired Headphones, Studio-grade, HD sound, Comfortable, Pro music experience'),
        (6, 'Bluetoothイヤホン HiFi音質 48hバッテリー 急速充電 低遅延'),
        (7, 'Bluetooth5.3ヘッドホン ノイズキャンセリング 没入サウンド 快適装着'),
        (8, 'IPX7防水イヤホン スポーツ対応 タッチ操作 高音質音楽'),
        (9, 'スポーツイヤホン 安定装着 防汗 長持ちバッテリー ワークアウト対応'),
        (10, '有線ヘッドホン スタジオ級 HDサウンド 快適装着 プロ音楽体験'),
        (11, '无线蓝牙耳机 HiFi音质 48小时超长续航 快速充电 低延迟'),
        (12, '蓝牙5.3降噪头戴式耳机 杜比全景声 沉浸音效 舒适佩戴 畅享静谧音乐时光'),
        (13, 'IPX7防水真无线耳机 运动无忧 智能触控 随时畅听高品质音乐'),
        (14, '运动专用耳机 稳固佩戴 防汗设计 超长续航 低延迟音频 高清通话'),
        (15, '录音室级有线耳机 高清音质 舒适佩戴 可拆卸线材 多设备兼容 降噪麦克风');
    ```

### Step 3. Perform a full-text search

=== "Python"

    To perform a full-text search via pytidb, you need to pass the `search_type="fulltext"` parameter to the `search` method:

    ```python
    results = table.search("Bluetooth Headphones", search_type="fulltext").limit(3).to_list()
    print(json.dumps(results, indent=2, ensure_ascii=False))
    ```

    ```python title="Execution result"
    [
        {
            "id": 2,
            "title": "Bluetooth 5.3 Headphones, Noise Cancelling, Immersive sound, Comfortable",
            "_match_score": 3.7390857,
            "_score": 3.7390857
        },
        {
            "id": 5,
            "title": "Wired Headphones, Studio-grade, HD sound, Comfortable, Pro music experience",
            "_match_score": 1.9798478,
            "_score": 1.9798478
        },
        {
            "id": 1,
            "title": "Bluetooth Earphones, HiFi sound, 48h battery, Fast charge, Low latency",
            "_match_score": 1.620981,
            "_score": 1.620981
        }
    ]
    ```

    The results are ordered by relevance, with the most relevant documents first.

    Try searching keywords in another language:

    ```python
    results = table.search("蓝牙耳机", search_type="fulltext").limit(3).to_list()
    print(json.dumps(results, indent=2, ensure_ascii=False))
    ```

    ```python title="Execution result"
    [
        {
            "id": 11,
            "title": "无线蓝牙耳机 HiFi音质 48小时超长续航 快速充电 低延迟",
            "_match_score": 3.000002,
            "_score": 3.000002
        },
        {
            "id": 12,
            "title": "蓝牙5.3降噪头戴式耳机 杜比全景声 沉浸音效 舒适佩戴 畅享静谧音乐时光",
            "_match_score": 2.5719738,
            "_score": 2.5719738
        },
        {
            "id": 14,
            "title": "运动专用耳机 稳固佩戴 防汗设计 超长续航 低延迟音频 高清通话",
            "_match_score": 1.1418362,
            "_score": 1.1418362
        }
    ]
    ```

=== "SQL"

    To perform a full-text search, you can use the `fts_match_word()` function.

    ```sql
    SELECT *, fts_match_word("Bluetooth Headphones", title) AS score
    FROM items
    WHERE fts_match_word("Bluetooth Headphones", title)
    ORDER BY score DESC
    LIMIT 3;
    ```

    ```plain title="Execution result"
    +----+-----------------------------------------------------------------------------+-----------+
    | id | title                                                                       | score     |
    +----+-----------------------------------------------------------------------------+-----------+
    |  2 | Bluetooth 5.3 Headphones, Noise Cancelling, Immersive sound, Comfortable    | 3.7390857 |
    |  5 | Wired Headphones, Studio-grade, HD sound, Comfortable, Pro music experience | 1.9798478 |
    |  1 | Bluetooth Earphones, HiFi sound, 48h battery, Fast charge, Low latency      |  1.620981 |
    +----+-----------------------------------------------------------------------------+-----------+
    ```

    The results are ordered by relevance, with the most relevant documents first.

    Try searching keywords in another language:

    ```sql
    SELECT *, fts_match_word("蓝牙耳机", title) AS score
    FROM items
    WHERE fts_match_word("蓝牙耳机", title)
    ORDER BY score DESC
    LIMIT 3;
    ```

    ```plain title="Execution result"
    +----+------------------------------------------------------------------+-----------+
    | id | title                                                            | score     |
    +----+------------------------------------------------------------------+-----------+
    | 11 | 无线蓝牙耳机 HiFi音质 48小时超长续航 快速充电 低延迟                    |  3.000002 |
    | 12 | 蓝牙5.3降噪头戴式耳机 杜比全景声 沉浸音效 舒适佩戴 畅享静谧音乐时光        | 2.5719738 |
    | 14 | 运动专用耳机 稳固佩戴 防汗设计 超长续航 低延迟音频 高清通话               | 1.1418362 |+-----------------------------------------------------------------------+-----------+
    ```

## See also

In Retrieval-Augmented Generation (RAG) scenarios, you may need to use full-text search together with vector search to improve the retrieval quality.

In next section, we will introduce how to combine full-text search and vector search via [hybrid search](./hybrid-search.md) mode.