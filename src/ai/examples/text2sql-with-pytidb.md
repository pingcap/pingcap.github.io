---
title: Text2SQL
description: "PyTiDB example: text2sql"
source_repo: "https://github.com/pingcap/pytidb/tree/main/examples/text2sql"
---

# Text2SQL

!!! info "Source Repository"
    This example is from the [pytidb repository](https://github.com/pingcap/pytidb/tree/main/examples/text2sql).
    For the complete source code and latest updates, please visit the original repository.

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