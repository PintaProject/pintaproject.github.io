document.addEventListener('DOMContentLoaded', function() {
    const webLinks = document.querySelectorAll('#pinta-web-links li');
    const maxItemsPerPage = 15;
    let currentlyShown = maxItemsPerPage;

    if (webLinks.length > maxItemsPerPage) {
        const loadMoreButton = document.createElement('button');
        loadMoreButton.textContent = 'Load More';
        loadMoreButton.classList.add('pinta-button', 'load-more-button');

        loadMoreButton.addEventListener('click', () => {
            const items = Array.from(webLinks);
            const nextBatch = items.slice(currentlyShown, currentlyShown + maxItemsPerPage);

            nextBatch.forEach(item => item.style.display = 'list-item');
            currentlyShown += maxItemsPerPage;

            if (currentlyShown >= webLinks.length) {
                loadMoreButton.style.display = 'none';
            }
        });

        document.querySelector('#pinta-web-links').insertAdjacentElement('afterend', loadMoreButton);
    }

    const items = Array.from(webLinks);
    items.slice(maxItemsPerPage).forEach(item => item.style.display = 'none');
});
