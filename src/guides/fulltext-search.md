# Fulltext Search

Full-text search enables you to retrieve documents for exact keywords.

!!! note

    Currently, full-text search is only available for the following product option and region:
    
    - **TiDB Cloud Serverless: Frankfurt (eu-central-1)**

!!! tip

    To check the complete example code, please refer to the [full-text search example](https://github.com/pingcap/pytidb/blob/main/examples/fulltext_search).

## Basic Usage

### Step 1. Create a table and a full-text index

=== "Python"

    You can use `table.create_fts_index()` method to create full-text search index on the specified column (e.g. `title`).

    ```python hl_lines="10"
    from pytidb.schema import TableModel, Field
    from pytidb.datatype import Text

    class StockItem(TableModel, table=True):
        id: int = Field(primary_key=True)
        title: str = Field(sa_type=Text)

    table = db.create_table(schema=StockItem)

    table.create_fts_index("title")
    ```

=== "SQL"

    Create a table with a full-text index:

    ```sql
    CREATE TABLE stock_items(
        id INT,
        title TEXT,
        FULLTEXT INDEX (title) WITH PARSER MULTILINGUAL
    );
    ```

    Or add a full-text index to an existing table:

    ```sql
    ALTER TABLE stock_items ADD FULLTEXT INDEX (title)
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
        {"id": 1, "title": "イヤホン bluetooth ワイヤレスイヤホン "},
        {"id": 2, "title": "完全ワイヤレスイヤホン/ウルトラノイズキャンセリング 2.0 "},
        {"id": 3, "title": "ワイヤレス ヘッドホン Bluetooth 5.3 65時間再生 ヘッドホン 40mm HD "},
        {"id": 4, "title": "楽器用 オンイヤーヘッドホン 密閉型【国内正規品】"},
        {"id": 5, "title": "ワイヤレスイヤホン ハイブリッドANC搭载 40dBまでアクティブノイズキャンセル"},
        {"id": 6, "title": "Lightweight Bluetooth Earbuds with 48 Hours Playtime"},
        {"id": 7, "title": "True Wireless Noise Cancelling Earbuds - Compatible with Apple & Android, Built-in Microphone"},
        {"id": 8, "title": "In-Ear Earbud Headphones with Mic, Black"},
        {"id": 9, "title": "Wired Headphones, HD Bass Driven Audio, Lightweight Aluminum Wired in Ear Earbud Headphones"},
        {"id": 10, "title": "LED Light Bar, Music Sync RGB Light Bar, USB Ambient Lamp"},
        {"id": 11, "title": "无线消噪耳机-黑色 手势触控蓝牙降噪 主动降噪头戴式耳机（智能降噪 长久续航）"},
        {"id": 12, "title": "专业版USB7.1声道游戏耳机电竞耳麦头戴式电脑网课办公麦克风带线控"},
        {"id": 13, "title": "投影仪家用智能投影机便携卧室手机投影"},
        {"id": 14, "title": "无线蓝牙耳机超长续航42小时快速充电 流光金属耳机"},
        {"id": 15, "title": "皎月银 国家补贴 心率血氧监测 蓝牙通话 智能手表 男女表"},
    ])
    ```

=== "SQL"

    ```sql
    INSERT INTO stock_items(id, title) VALUES
        (1, "イヤホン bluetooth ワイヤレスイヤホン "),
        (2, "完全ワイヤレスイヤホン/ウルトラノイズキャンセリング 2.0 "),
        (3, "ワイヤレス ヘッドホン Bluetooth 5.3 65時間再生 ヘッドホン 40mm HD "),
        (4, "楽器用 オンイヤーヘッドホン 密閉型【国内正規品】"),
        (5, "ワイヤレスイヤホン ハイブリッドANC搭載 40dBまでアクティブノイズキャンセル"),
        (6, "Lightweight Bluetooth Earbuds with 48 Hours Playtime"),
        (7, "True Wireless Noise Cancelling Earbuds - Compatible with Apple & Android, Built-in Microphone"),
        (8, "In-Ear Earbud Headphones with Mic, Black"),
        (9, "Wired Headphones, HD Bass Driven Audio, Lightweight Aluminum Wired in Ear Earbud Headphones"),
        (10, "LED Light Bar, Music Sync RGB Light Bar, USB Ambient Lamp"),
        (11, "无线消噪耳机-黑色 手势触控蓝牙降噪 主动降噪头戴式耳机（智能降噪 长久续航）"),
        (12, "专业版USB7.1声道游戏耳机电竞耳麦头戴式电脑网课办公麦克风带线控"),
        (13, "投影仪家用智能投影机便携卧室手机投影"),
        (14, "无线蓝牙耳机超长续航42小时快速充电 流光金属耳机"),
        (15, "皎月银 国家补贴 心率血氧监测 蓝牙通话 智能手表 男女表");
    ```

### Step 3. Perform a full-text search

=== "Python"

    To perform a full-text search via pytidb, you need to pass the `search_type="fulltext"` parameter to the `search` method:

    ```python
    table.search("bluetoothイヤホン", search_type="fulltext").limit(3)
    ```

    ```python title="Execution result"
    [
        {"id": 1, "title": "イヤホン bluetooth ワイヤレスイヤホン "},
        {"id": 6, "title": "Lightweight Bluetooth Earbuds with 48 Hours Playtime"},
        {"id": 2, "title": "完全ワイヤレスイヤホン/ウルトラノイズキャンセリング 2.0 "},
    ]
    ```

    The results are ordered by relevance, with the most relevant documents first.

    Try searching keywords in another language:

    ```python
    table.search("蓝牙耳机", search_type="fulltext").limit(3)
    ```

    ```python title="Execution result"
    [
        {"id": 14, "title": "无线蓝牙耳机超长续航42小时快速充电 流光金属耳机"},
        {"id": 11, "title": "无线消噪耳机-黑色 手势触控蓝牙降噪 主动降噪头戴式耳机（智能降噪 长久续航）"},
        {"id": 15, "title": "皎月银 国家补贴 心率血氧监测 蓝牙通话 智能手表 男女表"},
    ]
    ```

=== "SQL"

    To perform a full-text search, you can use the `fts_match_word()` function.

    ```sql
    SELECT *
    FROM stock_items
    WHERE fts_match_word("bluetoothイヤホン", title)
    ORDER BY fts_match_word("bluetoothイヤホン", title) DESC
    LIMIT 10;
    ```

    ```plain title="Execution result"
    +----+--------------------------------------------------------------------+
    | id | title                                                              |
    +----+--------------------------------------------------------------------+
    |  1 | イヤホン bluetooth ワイヤレスイヤホン                                  |
    |  6 | Lightweight Bluetooth Earbuds with 48 Hours Playtime               |
    |  2 | 完全ワイヤレスイヤホン/ウルトラノイズキャンセリング 2.0                    |
    |  3 | ワイヤレス ヘッドホン Bluetooth 5.3 65時間再生 ヘッドホン 40mm HD        |
    |  5 | ワイヤレスイヤホン ハイブリッドANC搭载 40dBまでアクティブノイズキャンセル     |
    +----+--------------------------------------------------------------------+
    ```

    The results are ordered by relevance, with the most relevant documents first.

    Try searching keywords in another language:

    ```sql
    SELECT *
    FROM stock_items
    WHERE fts_match_word("蓝牙耳机", title)
    ORDER BY fts_match_word("蓝牙耳机", title) DESC
    LIMIT 10;
    ```

    ```plain title="Execution result"
    +----+-------------------------------------------------------------------+
    | id | title                                                             |
    +----+-------------------------------------------------------------------+
    | 14 | 无线蓝牙耳机超长续航42小时快速充电 流光金属耳机                          |
    | 11 | 无线消噪耳机-黑色 手势触控蓝牙降噪 主动降噪头戴式耳机（智能降噪 长久续航）    |
    | 15 | 皎月银 国家补贴 心率血氧监测 蓝牙通话 智能手表 男女表                     |
    +----+-------------------------------------------------------------------+
    ```

## See also

In Retrieval-Augmented Generation (RAG) scenarios, you may need to use full-text search together with vector search to improve the retrieval quality.

In next section, we will introduce how to combine full-text search and vector search via [hybrid search](./hybrid-search.md) mode.