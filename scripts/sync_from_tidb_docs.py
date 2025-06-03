import requests
import re


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


def remove_see_also_section(content):
    """Remove the '## See also' section and everything after it."""
    return re.sub(r"## See also[\s\S]*$", "", content)


def replace_image_paths(content):
    """Replace image paths to point to the local assets directory."""
    return content.replace(
        "/media/vector-search/embedding-search.png", "../assets/embedding-search.png"
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


def download_vector_search_overview():
    url = "https://raw.githubusercontent.com/pingcap/docs/refs/heads/master/vector-search/vector-search-overview.md"
    response = requests.get(url)
    content = response.text
    # Step-by-step content processing
    content = remove_custom_content_blocks(content)
    content = collapse_extra_blank_lines(content)
    content = convert_note_blocks(content)
    content = remove_see_also_section(content)
    content = replace_image_paths(content)
    content = replace_relative_doc_links(content)
    content = remove_overview_from_title(content)
    save_to_file(content, "./src/concepts/vector-search.md")


def save_to_file(content, filename):
    """Save the processed content to a file."""
    with open(filename, "w") as f:
        f.write(content)


if __name__ == "__main__":
    download_vector_search_overview()
