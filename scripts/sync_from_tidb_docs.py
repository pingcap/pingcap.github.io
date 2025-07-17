import requests
import re
import sys


def remove_custom_content_blocks(content):
    """Remove <CustomContent ...>...</CustomContent> blocks from the content."""
    return re.sub(r"<CustomContent[\s\S]*?</CustomContent>", "", content)


def collapse_extra_blank_lines(content):
    """Collapse 3 or more blank lines to 2 blank lines."""
    return re.sub(r"\n{3,}", "\n\n", content)


def convert_note_blocks(content):
    """Convert '> **Note:**' blocks to '!!! note' syntax with indented content."""

    def note_repl(m):
        note_body = re.sub(r"^> ?", "", m.group(2), flags=re.MULTILINE).strip()
        indented = "\n".join(
            "    " + line if line.strip() else "" for line in note_body.splitlines()
        )
        return "!!! note\n\n" + indented + "\n\n"

    return re.sub(r"> \*\*Note:\*\*\n((?:> *\n)*)(> .*(?:\n|$)+)", note_repl, content)


def convert_warning_blocks(content):
    """Convert '> **Warning:**' blocks to '!!! warning' syntax with indented content."""

    def warning_repl(m):
        warning_body = re.sub(r"^> ?", "", m.group(2), flags=re.MULTILINE).strip()
        indented = "\n".join(
            "    " + line if line.strip() else "" for line in warning_body.splitlines()
        )
        return "!!! warning\n\n" + indented + "\n\n"

    return re.sub(r"> \*\*Warning:\*\*\n((?:> *\n)*)(> .*(?:\n|$)+)", warning_repl, content)


def convert_tip_blocks(content):
    """Convert '> **Tip**' blocks to '!!! tip' syntax with indented content."""

    def tip_repl(m):
        tip_body = re.sub(r"^> ?", "", m.group(2), flags=re.MULTILINE).strip()
        indented = "\n".join(
            "    " + line if line.strip() else "" for line in tip_body.splitlines()
        )
        return "!!! tip\n\n" + indented + "\n\n"

    return re.sub(r"> \*\*Tip:?\*\*\n((?:> *\n)*)(> .*(?:\n|$)+)", tip_repl, content)


def remove_see_also_section(content):
    """Remove the '## See also' section and everything after it."""
    return re.sub(r"## See also[\s\S]*$", "", content)


def replace_image_paths(content):
    """Replace image paths to point to the local assets directory."""
    return content.replace(
        "/media/vector-search/embedding-search.png", "../../assets/embedding-search.png"
    )


def replace_relative_doc_links(content):
    """Replace relative doc links with full tidbcloud doc links, remove .md suffix and 'vector-search/' in path."""

    def link_repl(m):
        path = m.group(1)
        # Remove leading /, ./ or ../
        path = re.sub(r"^/|^\./|^\.\./", "", path)
        path = path.replace("vector-search/", "")  # Remove 'vector-search/' directory
        return f"(https://docs.pingcap.com/tidbcloud/{path})"

    return re.sub(r"\(((?:/|\./|\.\./)[^)]+?)\.md\)", link_repl, content)


def remove_overview_from_title(content):
    """Remove 'Overview' from the main title if present."""
    return re.sub(
        r"^(# .*)Overview(.*)$",
        lambda m: m.group(1).rstrip() + m.group(2) + "\n",
        content,
        flags=re.MULTILINE,
    )


def remove_front_matter(content):
    """Remove YAML front matter if present."""
    return re.sub(r"^---[\s\S]*?---\n", "", content)


def remove_simpletab_blocks(content):
    """Remove <SimpleTab> and <div label=...> ... </div> blocks, flattening their content."""
    content = re.sub(r"<SimpleTab>|</SimpleTab>", "", content)
    content = re.sub(r'<div label="[^"]*">', "", content)
    content = re.sub(r"</div>", "", content)
    return content


def process_overview():
    url = "https://raw.githubusercontent.com/pingcap/docs/refs/heads/master/vector-search/vector-search-overview.md"
    response = requests.get(url)
    content = response.text
    content = remove_custom_content_blocks(content)
    content = collapse_extra_blank_lines(content)
    content = convert_note_blocks(content)
    content = remove_see_also_section(content)
    content = replace_image_paths(content)
    content = replace_relative_doc_links(content)
    content = remove_overview_from_title(content)
    save_to_file(content, "./src/ai/concepts/vector-search.md")


def process_llamaindex():
    url = "https://raw.githubusercontent.com/pingcap/docs/master/vector-search/vector-search-integrate-with-llamaindex.md"
    response = requests.get(url)
    content = response.text
    content = remove_front_matter(content)
    content = remove_custom_content_blocks(content)
    content = remove_simpletab_blocks(content)
    content = collapse_extra_blank_lines(content)
    content = convert_warning_blocks(content)
    content = convert_note_blocks(content)
    content = convert_tip_blocks(content)
    content = remove_see_also_section(content)
    content = replace_image_paths(content)
    content = replace_relative_doc_links(content)
    save_to_file(content, "./src/ai/integrations/llamaindex.md")


def process_langchain():
    url = "https://raw.githubusercontent.com/pingcap/docs/master/vector-search/vector-search-integrate-with-langchain.md"
    response = requests.get(url)
    content = response.text
    content = remove_front_matter(content)
    content = remove_custom_content_blocks(content)
    content = remove_simpletab_blocks(content)
    content = collapse_extra_blank_lines(content)
    content = convert_warning_blocks(content)
    content = convert_note_blocks(content)
    content = convert_tip_blocks(content)
    content = remove_see_also_section(content)
    content = replace_image_paths(content)
    content = replace_relative_doc_links(content)
    save_to_file(content, "./src/ai/integrations/langchain.md")


def save_to_file(content, filename):
    """Save the processed content to a file."""
    with open(filename, "w") as f:
        f.write(content)


def main():
    if len(sys.argv) > 1:
        arg = sys.argv[1].lower()
        if arg in ("--llamaindex", "llamaindex"):
            process_llamaindex()
            print("llamaindex doc synced.")
            return
        elif arg in ("--langchain", "langchain"):
            process_langchain()
            print("langchain doc synced.")
            return
        elif arg in ("--overview", "overview"):
            process_overview()
            print("overview doc synced.")
            return
        else:
            print(f"Unknown argument: {arg}")
            print("Usage: python sync_from_tidb_docs.py [--llamaindex|--langchain|--overview]")
            return

    process_overview()
    print("overview doc synced (default).")


if __name__ == "__main__":
    main()
