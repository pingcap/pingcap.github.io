#!/usr/bin/env python3
"""
Generate demo gallery and individual demo documentation pages.
This script reads configuration from demos.yml and generates:
1. Individual demo pages using demo_template.j2
2. Gallery index page using gallery_template.j2
"""

import sys
import requests
import re
import yaml
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
import click

# Configuration
LOCAL_EXAMPLES_DIR = Path("src/examples")
CONFIG_FILE = Path("demos.yml")
DEMO_TEMPLATE_FILE = Path("src/templates/demo_page_template.j2")
GALLERY_TEMPLATE_FILE = Path("src/templates/demo_gallery_template.j2")
OUTPUT_FILE = LOCAL_EXAMPLES_DIR / "index.md"


def load_config():
    """Load configuration from YAML file."""
    if not CONFIG_FILE.exists():
        raise click.ClickException(f"Configuration file {CONFIG_FILE} not found.")
    
    try:
        with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f)
        return config
    except yaml.YAMLError as e:
        raise click.ClickException(f"Error parsing {CONFIG_FILE}: {e}")


def fetch_readme_from_doc_link(doc_link):
    """Fetch README.md content from the provided doc_link."""
    # Convert GitHub tree URL to raw content URL
    if "github.com" in doc_link and "/tree/" in doc_link:
        raw_url = doc_link.replace("github.com", "raw.githubusercontent.com").replace("/tree/", "/")
    elif doc_link.endswith("/README.md"):
        raw_url = doc_link
    else:
        # Assume it's a directory link, append README.md
        raw_url = doc_link.rstrip('/') + '/README.md'
        if "github.com" in raw_url and "/tree/" in raw_url:
            raw_url = raw_url.replace("github.com", "raw.githubusercontent.com").replace("/tree/", "/")
    
    try:
        response = requests.get(raw_url, timeout=30)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        click.echo(f"Error fetching README from {raw_url}: {e}", err=True)
        return None


def extract_repo_info_from_doc_link(doc_link):
    """Extract repository and path information from doc_link."""
    if "github.com" not in doc_link:
        return None, None, None, None
        
    # Parse URL to extract owner, repo, and path
    parts = doc_link.replace("https://github.com/", "").split("/")
    if len(parts) < 2:
        return None, None, None, None
        
    owner, repo = parts[0], parts[1]
    
    # Extract path after /tree/branch/
    if "/tree/" in doc_link:
        try:
            tree_index = parts.index("tree")
            if len(parts) > tree_index + 2:  # owner/repo/tree/branch/path...
                branch = parts[tree_index + 1]
                path_parts = parts[tree_index + 2:]
                # Remove README.md if present
                if path_parts and path_parts[-1] == "README.md":
                    path_parts = path_parts[:-1]
                path = "/".join(path_parts)
                return owner, repo, branch, path
        except ValueError:
            pass
    
    return None, None, None, None


def process_readme_content(content, demo_config):
    """Process README content to adapt it for the documentation site."""
    if not content:
        return None
    
    # Extract repository info
    owner, repo, branch, example_path = extract_repo_info_from_doc_link(demo_config['doc_link'])
    
    if not all([owner, repo, branch, example_path]):
        click.echo(f"Warning: Could not extract repo info from {demo_config['doc_link']}", err=True)
        return content
    
    base_repo_url = f"https://github.com/{owner}/{repo}"
    base_raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}"
    
    # Fix relative links to point to the original repository
    processed_content = re.sub(
        r'\]\((?!https?://)(.*?)\)',
        f']({base_repo_url}/tree/{branch}/{example_path}/\\1)',
        content
    )
    
    # Fix relative image links
    processed_content = re.sub(
        r'!\[([^\]]*)\]\((?!https?://)(.*?)\)',
        f'![\\1]({base_raw_url}/{example_path}/\\2)',
        processed_content
    )
    
    return processed_content


def create_demo_page(demo_config, content):
    """Create a markdown file for a demo using the demo template."""
    if not DEMO_TEMPLATE_FILE.exists():
        raise click.ClickException(f"Demo template file {DEMO_TEMPLATE_FILE} not found.")
    
    # Create the local examples directory if it doesn't exist
    LOCAL_EXAMPLES_DIR.mkdir(parents=True, exist_ok=True)
    
    try:
        # Set up Jinja2 environment
        env = Environment(loader=FileSystemLoader("src/templates"))
        template = env.get_template('demo_page_template.j2')
        
        # Render the template
        rendered_content = template.render(
            demo=demo_config,
            content=content
        )
        
        # Create the markdown file
        filename = f"{demo_config['id'].replace('_', '-')}-with-pytidb.md"
        filepath = LOCAL_EXAMPLES_DIR / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(rendered_content)
        
        return filepath
    except Exception as e:
        raise click.ClickException(f"Error creating demo page for {demo_config['id']}: {e}")


def generate_gallery_page(config):
    """Generate the gallery page using Jinja2 template."""
    if not GALLERY_TEMPLATE_FILE.exists():
        raise click.ClickException(f"Gallery template file {GALLERY_TEMPLATE_FILE} not found.")
    
    try:
        # Set up Jinja2 environment
        env = Environment(loader=FileSystemLoader("src/templates"))
        template = env.get_template('demo_gallery_template.j2')
        
        # Render the template
        rendered_content = template.render(
            config=config,
            categories=config.get('categories', {}),
            demos=config.get('demos', {})
        )
        
        # Write the rendered content to the output file
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write(rendered_content)
        
        return True
    except Exception as e:
        raise click.ClickException(f"Error generating gallery page: {e}")


def sync_demo_docs(config, fetch_from_remote=True):
    """Sync demo documentation files based on demos.yml configuration."""
    if not fetch_from_remote:
        return []
    
    created_files = []
    demos_config = config.get('demos', [])
    
    with click.progressbar(demos_config, label='Processing demos') as demos:
        for demo_config in demos:
            demo_id = demo_config['id']
            doc_link = demo_config.get('doc_link')
            
            if not doc_link:
                click.echo(f"Warning: No doc_link found for demo '{demo_id}', skipping...", err=True)
                continue
            
            # Fetch README content
            readme_content = fetch_readme_from_doc_link(doc_link)
            
            if readme_content:
                # Process content
                processed_content = process_readme_content(readme_content, demo_config)
                
                if processed_content:
                    # Create demo page
                    filepath = create_demo_page(demo_config, processed_content)
                    if filepath:
                        created_files.append((demo_id, filepath))
                else:
                    click.echo(f"Failed to process content for {demo_id}", err=True)
            else:
                click.echo(f"Failed to fetch README for {demo_id}", err=True)
    
    return created_files


@click.command()
@click.option('--skip-demos', is_flag=True, 
              help='Skip generating individual demo pages from remote repositories')
@click.option('--skip-gallery', is_flag=True,
              help='Skip generating the demo gallery index page')
@click.option('--verbose', '-v', is_flag=True, help='Enable verbose output')
def main(skip_demos, skip_gallery, verbose):
    """Generate demo gallery and individual demo documentation pages.
    
    This script reads configuration from demos.yml and generates:
    1. Individual demo pages using demo_template.j2
    2. Gallery index page using gallery_template.j2
    
    By default, both demo pages and gallery are generated.
    """
    if verbose:
        click.echo("Running in verbose mode...")
    
    # Load configuration
    try:
        config = load_config()
    except click.ClickException:
        raise
    
    created_files = []
    
    # Generate demo pages (unless skipped)
    if not skip_demos:
        if verbose:
            click.echo("Generating demo pages from remote repositories...")
        created_files = sync_demo_docs(config, fetch_from_remote=True)
        
        if created_files:
            click.echo(f"\n✅ Generated {len(created_files)} demo pages:")
            for demo_id, filepath in created_files:
                click.echo(f"   • {demo_id} → {filepath}")
        elif verbose:
            click.echo("No demo pages were generated.")
    else:
        if verbose:
            click.echo("Skipping demo page generation...")
    
    # Generate gallery page (unless skipped)
    if not skip_gallery:
        if verbose:
            click.echo("Generating gallery page from template...")
        
        if generate_gallery_page(config):
            click.echo(f"✅ Gallery page generated: {OUTPUT_FILE}")
        else:
            raise click.ClickException("Failed to generate gallery page.")
    else:
        if verbose:
            click.echo("Skipping gallery page generation...")
    
    # Check if nothing was generated
    if skip_demos and skip_gallery:
        click.echo("⚠️  Both demos and gallery generation were skipped. Nothing to do.")
    else:
        click.echo("\n🎉 Done! You can now run 'mkdocs serve' to view the documentation site.")


if __name__ == "__main__":
    main() 