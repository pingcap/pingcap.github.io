#!/usr/bin/env python3
"""
Sync examples from pytidb repository to this documentation site.
This script fetches README.md files from pytidb/examples and converts them
to be used in this documentation site.
"""

import os
import sys
import requests
import re
import yaml
from pathlib import Path
from urllib.parse import urlparse

# Configuration
PYTIDB_REPO = "pingcap/pytidb"
EXAMPLES_BASE_URL = f"https://raw.githubusercontent.com/{PYTIDB_REPO}/main/examples"
EXAMPLES_API_URL = f"https://api.github.com/repos/{PYTIDB_REPO}/contents/examples"
LOCAL_EXAMPLES_DIR = Path("src/ai/examples")
MKDOCS_CONFIG_FILE = Path("mkdocs.yml")

# Example display names mapping
EXAMPLE_DISPLAY_NAMES = {
    "auto_embedding": "Auto Embedding",
    "basic": "Basic Usage",
    "fulltext_search": "Fulltext Search",
    "hybrid_search": "Hybrid Search",
    "image_search": "Image Search",
    "memory": "Memory",
    "quickstart": "Quickstart",
    "rag": "RAG",
    "text2sql": "Text2SQL",
    "vector_search": "Vector Search",
}

# Fixed order for examples (as they should appear in navigation)
EXAMPLES_ORDER = [
    "quickstart",
    "basic", 
    "auto_embedding",
    "vector_search",
    "fulltext_search",
    "hybrid_search",
    "image_search",
    "rag",
    "memory",
    "text2sql"
]

def fetch_github_directory_contents(url):
    """Fetch directory contents from GitHub API."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching directory contents: {e}")
        return []

def fetch_readme_content(example_name):
    """Fetch README.md content from a specific example directory."""
    readme_url = f"{EXAMPLES_BASE_URL}/{example_name}/README.md"
    try:
        response = requests.get(readme_url)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching README for {example_name}: {e}")
        return None

def process_readme_content(content, example_name):
    """Process README content to adapt it for the documentation site."""
    if not content:
        return None
    
    display_name = EXAMPLE_DISPLAY_NAMES.get(example_name, example_name.replace('_', ' ').title())
    
    # Add front matter with metadata
    processed_content = f"""---
title: {display_name}
description: "PyTiDB example: {example_name}"
source_repo: "https://github.com/pingcap/pytidb/tree/main/examples/{example_name}"
---

# {display_name}

!!! info "Source Repository"
    This example is from the [pytidb repository](https://github.com/pingcap/pytidb/tree/main/examples/{example_name}).
    For the complete source code and latest updates, please visit the original repository.

"""
    
    # Process the original content
    processed_content += content
    
    # Fix relative links to point to the original repository
    processed_content = re.sub(
        r'\]\((?!https?://)(.*?)\)',
        f'](https://github.com/pingcap/pytidb/tree/main/examples/{example_name}/\\1)',
        processed_content
    )
    
    # Fix relative image links
    processed_content = re.sub(
        r'!\[([^\]]*)\]\((?!https?://)(.*?)\)',
        f'![\\1](https://raw.githubusercontent.com/pingcap/pytidb/main/examples/{example_name}/\\2)',
        processed_content
    )
    
    return processed_content

def create_example_file(example_name, content):
    """Create a markdown file for an example."""
    # Create the local examples directory if it doesn't exist
    LOCAL_EXAMPLES_DIR.mkdir(parents=True, exist_ok=True)
    
    # Create the markdown file
    filename = f"{example_name.replace('_', '-')}-with-pytidb.md"
    filepath = LOCAL_EXAMPLES_DIR / filename
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Created: {filepath}")
    return filepath

def update_mkdocs_config(created_files):
    """Update mkdocs.yml with the new examples."""
    if not MKDOCS_CONFIG_FILE.exists():
        print(f"Warning: {MKDOCS_CONFIG_FILE} not found. Skipping mkdocs.yml update.")
        return
    
    try:
        with open(MKDOCS_CONFIG_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Create a mapping of example names to file paths
        created_files_dict = {example_name: filepath for example_name, filepath in created_files}
        
        # Find the Examples section and update it in the specified order
        examples_nav = []
        for example_name in EXAMPLES_ORDER:
            if example_name in created_files_dict:
                display_name = EXAMPLE_DISPLAY_NAMES.get(example_name, example_name.replace('_', ' ').title())
                relative_path = f"ai/examples/{example_name.replace('_', '-')}-with-pytidb.md"
                examples_nav.append(f"    - {display_name}: {relative_path}")
        
        examples_section = "  - Examples:\n" + "\n".join(examples_nav)
        
        # Print the examples section for manual addition if needed
        print(f"\nExamples section for mkdocs.yml:")
        print(examples_section)
        
        print(f"\nNote: You may need to manually add or update the Examples section in mkdocs.yml")
        
    except Exception as e:
        print(f"Error updating mkdocs.yml: {e}")

def main():
    """Main function to sync examples from pytidb repository."""
    print("Syncing examples from pytidb repository...")
    
    # Fetch directory contents
    contents = fetch_github_directory_contents(EXAMPLES_API_URL)
    
    if not contents:
        print("No contents found or error occurred.")
        return
    
    # Filter directories only and exclude assets
    directories = [item for item in contents if item['type'] == 'dir' and item['name'] != 'assets']
    
    if not directories:
        print("No example directories found.")
        return
    
    # Create a set of available directory names for quick lookup
    available_directories = {directory['name'] for directory in directories}
    
    created_files = []
    
    # Process examples in the specified order
    for example_name in EXAMPLES_ORDER:
        if example_name in available_directories:
            print(f"Processing example: {example_name}")
            
            # Fetch README content
            readme_content = fetch_readme_content(example_name)
            
            if readme_content:
                # Process content
                processed_content = process_readme_content(readme_content, example_name)
                
                if processed_content:
                    # Create local file
                    filepath = create_example_file(example_name, processed_content)
                    created_files.append((example_name, filepath))
            else:
                print(f"  No README.md found for {example_name}")
        else:
            print(f"  Directory {example_name} not found in repository")
    
    print(f"\nSynced {len(created_files)} examples:")
    for example_name, filepath in created_files:
        print(f"  - {example_name} -> {filepath}")
    
    # Update mkdocs.yml configuration
    update_mkdocs_config(created_files)
    
    print("\nDone! The Example Gallery has been created.")
    print("You can now run 'mkdocs serve' to view the documentation site.")

if __name__ == "__main__":
    main() 