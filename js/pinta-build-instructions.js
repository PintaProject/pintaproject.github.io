async function loadMarkdownSections(url, sections) {
    try {
        const response = await fetch(url);
        const markdown = await response.text();
        const mainElement = document.querySelector('main');

        sections.forEach(sectionTitle => {
            // Regex to extract the required section
            const sectionRegex = new RegExp(`##\\s*${sectionTitle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}([\\s\\S]*?)(?=\n##|$)`, 'i');
            const match = markdown.match(sectionRegex);

            if (match) {
                let sectionContent = match[1].trim(); // Get only the content, excluding the title

                // Convert Markdown to HTML using Marked.js
                const htmlContent = marked.parse(sectionContent);

                // Create and append section
                const sectionElement = document.createElement('section');
                sectionElement.classList.add('pinta-description-box');
                sectionElement.innerHTML = `<h2>${sectionTitle}</h2>${htmlContent}`;
                mainElement.appendChild(sectionElement);
            }
        });
    } catch (error) {
        console.error("Error loading Markdown:", error);
        document.querySelector('main').innerHTML = `<p>Failed to load content.</p>`;
    }
}

// Define sections to extract
const buildSections = [
    "Building on Windows",
    "Building on Linux",
    "Building on macOS"
];

// Fetch and parse the markdown file
loadMarkdownSections('https://raw.githubusercontent.com/PintaProject/Pinta/master/readme.md', buildSections);
