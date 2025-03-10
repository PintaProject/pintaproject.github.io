function loadReleaseNotes() {
    const container = document.getElementById('pinta-release-notes');

    // Set a temporary height to avoid CLS
    container.style.minHeight = '200px';
    container.innerHTML = '<p>Loading release notes...</p>';

    fetch('https://raw.githubusercontent.com/PintaProject/pintaproject.github.io/master/_config.yml')
        .then(response => response.text())
        .then(yamlContent => {
            const match = yamlContent.match(/release_notes:\s*["']?(.*?)["']?$/m);
            const releaseNotesFile = match ? match[1] : null;

            if (!releaseNotesFile) {
                container.innerHTML = '<p>No release notes file specified.</p>';
                return;
            }

            const releaseNotesUrl = `https://raw.githubusercontent.com/PintaProject/pintaproject.github.io/master/${releaseNotesFile}.md`;

            return fetch(releaseNotesUrl);
        })
        .then(response => {
            if (!response || !response.ok) throw new Error('Error fetching release notes');
            return response.text();
        })
        .then(markdownContent => {
            // Parse and optimize markdown
            const htmlContent = parseMarkdownFast(markdownContent);
            container.innerHTML = htmlContent;
            container.style.minHeight = ''; // Remove temp height after loading
        })
        .catch(error => {
            console.error('Error:', error);
            container.innerHTML = '<p>Error loading release notes.</p>';
        });
}

function parseMarkdownFast(md) {
    // Strip YAML Front Matter (removes `--- ... ---`)
    md = md.replace(/^---[\s\S]*?---\s*/, '');

    let processedHTML = md
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>') // Code block
        .replace(/`([^`]+)`/g, '<code>$1</code>') // Inline code
        .replace(/^# (.*?)$/gm, '<h1>$1</h1>') // Convert # Heading 1
        .replace(/^## (.*?)$/gm, '<h2>$1</h2>') // Convert ## Heading 2
        .replace(/^### (.*?)$/gm, '<h3>$1</h3>') // Convert ### Heading 3
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Convert **bold**
        .replace(/\*(.*?)\*/g, '<i>$1</i>') // Convert *italic*
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" loading="lazy">') // Lazy-load images
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>') // Convert [text](link)
        .replace(/^- (.*?)$/gm, '<li>$1</li>') // Convert - List item
        .replace(/<\/li>\n<li>/g, '</li><li>') // Fix consecutive list items
        .replace(/<li>(.*?)<\/li>/g, '<ul><li>$1</li></ul>') // Wrap in <ul>
        .replace(/<\/ul>\n<ul>/g, '') // Remove extra <ul> tags
        .replace(/(?:\r?\n){2,}/g, '</p><p>') // Ensures paragraph separation
        .replace(/^(.+?)$/gm, '<p>$1</p>'); // Wrap everything in paragraphs

    // Convert first <h1> to <h2> and modify text
    processedHTML = processedHTML.replace(/<h1>(.*?)<\/h1>/, function (_, title) {
        let updatedTitle = title.replace(/.*?(\d[\d.]*)/, 'Pinta version $1');
        return `<h2>${updatedTitle}</h2>`;
    });

    return processedHTML;
}

document.addEventListener('DOMContentLoaded', loadReleaseNotes);
