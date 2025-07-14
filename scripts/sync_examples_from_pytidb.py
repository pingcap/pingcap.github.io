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

# Example descriptions for gallery
EXAMPLE_DESCRIPTIONS = {
    "quickstart": "Get started with PyTiDB in minutes. Learn the basics of connecting to TiDB, creating tables, and performing vector search.",
    "basic": "Learn fundamental PyTiDB operations including database connection, table creation, and data manipulation.",
    "auto_embedding": "Automatically generate embeddings for your text data using built-in embedding models.",
    "vector_search": "Implement semantic search using vector embeddings to find similar content.",
    "fulltext_search": "Perform traditional text search using MySQL fulltext search capabilities.",
    "hybrid_search": "Combine vector search and fulltext search for more comprehensive results.",
    "image_search": "Build an image search application using multimodal embeddings for both text-to-image and image-to-image search.",
    "rag": "Build a RAG application that combines document retrieval with language generation.",
    "memory": "Implement conversation memory for chatbots and conversational AI applications.",
    "text2sql": "Convert natural language queries into SQL statements using AI models.",
}

# Example icons for gallery
EXAMPLE_ICONS = {
    "quickstart": ":rocket:{ .lg .middle }",
    "basic": ":material-cog:{ .lg .middle }",
    "auto_embedding": ":material-auto-fix:{ .lg .middle }",
    "vector_search": ":material-vector-triangle:{ .lg .middle }",
    "fulltext_search": ":material-file-search:{ .lg .middle }",
    "hybrid_search": ":material-merge:{ .lg .middle }",
    "image_search": ":material-image-search:{ .lg .middle }",
    "rag": ":material-message-question:{ .lg .middle }",
    "memory": ":material-memory:{ .lg .middle }",
    "text2sql": ":material-code-braces:{ .lg .middle }",
}

# Example key features for table
EXAMPLE_FEATURES = {
    "quickstart": "Database connection, table creation, vector search",
    "basic": "CRUD operations, data manipulation",
    "auto_embedding": "Built-in embedding models, text processing",
    "vector_search": "Similarity search, embedding-based retrieval",
    "fulltext_search": "MySQL fulltext search, keyword matching",
    "hybrid_search": "Vector + fulltext search, result ranking",
    "image_search": "Text-to-image, image-to-image search",
    "rag": "Document retrieval, AI generation",
    "memory": "Chatbot memory, context preservation",
    "text2sql": "NL query conversion, SQL generation",
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

def extract_cover_image(content):
    """Extract the first image from content to use as cover image."""
    if not content:
        return None
    
    # Look for image patterns
    image_patterns = [
        r'!\[([^\]]*)\]\((https://[^\)]+)\)',  # Already absolute URLs
        r'!\[([^\]]*)\]\(([^\)]+)\)',          # Relative URLs
        r'<img[^>]+src="([^"]+)"[^>]*>',       # HTML img tags
    ]
    
    for pattern in image_patterns:
        matches = re.findall(pattern, content)
        if matches:
            if len(matches[0]) == 2:  # Markdown format
                return matches[0][1]
            else:  # HTML format
                return matches[0]
    
    return None

def process_readme_content(content, example_name):
    """Process README content to adapt it for the documentation site."""
    if not content:
        return None, None
    
    display_name = EXAMPLE_DISPLAY_NAMES.get(example_name, example_name.replace('_', ' ').title())
    
    # Extract cover image before processing
    cover_image = extract_cover_image(content)
    
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
    
    # If we have a relative cover image, make it absolute
    if cover_image and not cover_image.startswith('http'):
        cover_image = f"https://raw.githubusercontent.com/pingcap/pytidb/main/examples/{example_name}/{cover_image}"
    
    return processed_content, cover_image

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

def create_gallery_page(example_data):
    """Create the Example Gallery page with grids layout."""
    
    # Start with the frontmatter and header
    gallery_content = """---
title: Example Gallery
description: "Explore all PyTiDB examples with cover images and descriptions"
hide:
  - navigation
  - toc
---

# Example Gallery

Explore these hands-on examples to learn how to build AI applications with TiDB and PyTiDB.

<div class="grid cards" markdown>

"""
    
    # Add grid cards for each example
    for example_name in EXAMPLES_ORDER:
        if example_name in example_data:
            display_name = EXAMPLE_DISPLAY_NAMES.get(example_name, example_name.replace('_', ' ').title())
            description = EXAMPLE_DESCRIPTIONS.get(example_name, f"Learn about {display_name}")
            icon = EXAMPLE_ICONS.get(example_name, ":material-cog:{ .lg .middle }")
            cover_image = example_data[example_name].get('cover_image')
            
            # Create the card
            card_content = f"""-   {icon} **{display_name}**

    ---

    {description}

"""
            
            # Add cover image if available
            if cover_image:
                if example_name == "image_search":
                    # Special handling for image search with specific styling
                    card_content += f'    ![{display_name} Demo]({cover_image}){{ width="300" }}\n\n'
                else:
                    card_content += f'    ![{display_name} Demo]({cover_image}){{ width="250" }}\n\n'
            
            # Add link
            card_content += f"    [:octicons-arrow-right-24: {display_name}]({example_name.replace('_', '-')}-with-pytidb.md)\n\n"
            
            gallery_content += card_content
    
    # Close the grid
    gallery_content += """</div>

## All Examples

| Example | Description | Key Features |
|---------|-------------|--------------|
"""
    
    # Add table rows
    for example_name in EXAMPLES_ORDER:
        if example_name in example_data:
            display_name = EXAMPLE_DISPLAY_NAMES.get(example_name, example_name.replace('_', ' ').title())
            description = EXAMPLE_DESCRIPTIONS.get(example_name, f"Learn about {display_name}")
            features = EXAMPLE_FEATURES.get(example_name, "Various features")
            
            gallery_content += f"| [{display_name}]({example_name.replace('_', '-')}-with-pytidb.md) | {description} | {features} |\n"
    
    # Add footer
    gallery_content += """
---

!!! tip "Getting Started"
    New to PyTiDB? Start with the [Quickstart](quickstart-with-pytidb.md) example to learn the basics, then explore other examples based on your use case.

!!! info "Source Code"
    All examples are available in the [PyTiDB repository](https://github.com/pingcap/pytidb/tree/main/examples). Each example includes complete source code and detailed instructions.
"""
    
    return gallery_content

def update_mkdocs_config(created_files):
    """Update mkdocs.yml with the new examples."""
    if not MKDOCS_CONFIG_FILE.exists():
        print(f"Warning: {MKDOCS_CONFIG_FILE} not found. Skipping mkdocs.yml update.")
        return
    
    try:
        with open(MKDOCS_CONFIG_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Create a mapping of example names to file paths
        created_files_dict = {example_name: filepath for example_name, filepath, _ in created_files}
        
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
    example_data = {}
    
    # Process examples in the specified order
    for example_name in EXAMPLES_ORDER:
        if example_name in available_directories:
            print(f"Processing example: {example_name}")
            
            # Fetch README content
            readme_content = fetch_readme_content(example_name)
            
            if readme_content:
                # Process content
                processed_content, cover_image = process_readme_content(readme_content, example_name)
                
                if processed_content:
                    # Create local file
                    filepath = create_example_file(example_name, processed_content)
                    created_files.append((example_name, filepath, cover_image))
                    
                    # Store example data for gallery generation
                    example_data[example_name] = {
                        'cover_image': cover_image,
                        'filepath': filepath
                    }
            else:
                print(f"  No README.md found for {example_name}")
        else:
            print(f"  Directory {example_name} not found in repository")
    
    print(f"\nSynced {len(created_files)} examples:")
    for example_name, filepath, cover_image in created_files:
        cover_status = "with cover image" if cover_image else "no cover image"
        print(f"  - {example_name} -> {filepath} ({cover_status})")
    
    # Generate Example Gallery page
    print("\nGenerating Example Gallery page...")
    gallery_content = create_gallery_page(example_data)
    gallery_filepath = LOCAL_EXAMPLES_DIR / "index.md"
    
    with open(gallery_filepath, 'w', encoding='utf-8') as f:
        f.write(gallery_content)
    
    print(f"Created gallery page: {gallery_filepath}")
    
    # Update mkdocs.yml configuration
    update_mkdocs_config(created_files)
    
    print("\nDone! The Example Gallery has been created.")
    print("You can now run 'mkdocs serve' to view the documentation site.")

if __name__ == "__main__":
    main() 