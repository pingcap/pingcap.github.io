---
title: Text2SQL
description: "Convert natural language queries into SQL statements using AI models."
source_repo: "https://github.com/pingcap/pytidb/tree/main/examples/text2sql"
---

# Streamlit Examples

* Use `pytidb` to connect to TiDB
* Use Streamlit as web ui


## Prerequisites
* Python 3.8+
* OpenAI API key
* TiDB server connection string, either local or TiDB Cloud


## How to run

**Step0**: Clone the repo

```bash
git clone https://github.com/pingcap/pytidb.git
cd pytidb/examples/text2sql/;
```

**Step1**: Install the required packages

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r reqs.txt
```

**Step2**: Run the Streamlit app

```bash
streamlit run main.py
```

**Step3**: Open the browser and visit `http://localhost:8501`

* Input OpenAI API key in left sidebar
* Input the TiDB Cloud connection string in left sidebar, the format is `mysql+pymysql://root@localhost:4000/test`

---

## Related Resources

- **Source Code**: [View on GitHub](https://github.com/pingcap/pytidb/tree/main/examples/text2sql)
- **Category**: Ai-Apps

- **Description**: Convert natural language queries into SQL statements using AI models.


[🏠 Back to Demo Gallery](../index.md){ .md-button .md-button--primary } 