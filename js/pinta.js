// Utility function to toggle a class on an element by ID
function toggleClass(elementId, classy) {
    let actor = document.getElementById(elementId);
    if (actor) {
        actor.classList.toggle(classy);
    }
}

// Check if the device is mobile
function isMobile() {
    return window.innerWidth <= 800 || /Mobi|Android/i.test(navigator.userAgent);
}

// Ensure DOM is loaded before executing
document.addEventListener("DOMContentLoaded", function () {
    const menuTag = document.querySelector("#pinta-menu-tag");
    const footerTag = document.querySelector("#pinta-footer-tag");
    const basePath = menuTag?.getAttribute("data-base") || footerTag?.getAttribute("data-base") || "";

    window.togglePintaMenu = function () {
        console.log("togglePintaMenu called");
        let menuButton = document.getElementById('menu_button');
        let menuCloser = document.getElementById('menu_closer');
        if (!menuButton || !menuCloser) {
            console.warn("Menu button or closer not found");
            return;
        }
        toggleClass('pinta-menu', 'pinta-menu-open');
        toggleClass('menu_button', 'active');
        toggleClass('menu_closer', 'active');
        document.documentElement.classList.toggle('nooverflow');
    };

    function loadSection(tag, filePath, activeItemSelector) {
        if (!tag) return;

        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch from ${filePath}`);
                }
                return response.text();
            })
            .then(html => {
                const temp = document.createElement('div');
                temp.innerHTML = html;
                adjustPaths(temp, basePath);

                if (activeItemSelector) {
                    const activeItem = temp.querySelector(activeItemSelector);
                    if (activeItem) {
                        activeItem.classList.add("pinta-disabled");
                    } else {
                        console.warn(`Active item not found: ${activeItemSelector}`);
                    }
                }

                const children = Array.from(temp.children);
                let previousElement = tag;
                children.forEach(child => {
                    previousElement.insertAdjacentElement('afterend', child);
                    previousElement = child;
                });

                console.log(`Loaded from: ${filePath}`);

                let menuButton = document.getElementById('menu_button');
                let menuCloser = document.getElementById('menu_closer');

                if (menuButton) {
                    menuButton.addEventListener('click', togglePintaMenu);
                } else {
                    console.warn("Menu button still not found after menu load");
                }

                if (menuCloser) {
                    menuCloser.addEventListener('click', togglePintaMenu);
                } else {
                    console.warn("Menu closer still not found after menu load");
                }

                moveThemeSwitcher();
            })
            .catch(error => console.warn(`Error loading section: ${error.message}`));
    }

    function adjustPaths(container, basePath) {
        if (!container || !basePath) return;

        container.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                link.setAttribute('href', basePath + href);
            }
        });

        const pintaTitle = container.querySelector('.pinta-title');
        if (pintaTitle && pintaTitle.tagName === 'A' && basePath) {
            const href = pintaTitle.getAttribute('href') || '';
            pintaTitle.setAttribute('href', basePath + href);
        }

        container.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src');
            if (src && !src.startsWith('http')) {
                img.setAttribute('src', basePath + src);
            }
        });
    }

    function moveThemeSwitcher() {
        const themeSwitcher = document.getElementById("pinta-theme-switcher");
        const menuInfo = document.querySelector(".pinta-menu-info");

        if (themeSwitcher && menuInfo) {
            menuInfo.appendChild(themeSwitcher);
            console.log("Moved #pinta-theme-switcher into .pinta-menu-info");
        } else {
            console.warn("Either #pinta-theme-switcher or .pinta-menu-info not found, skipping move");
        }
    }

    if (menuTag) {
        const menuPath = basePath + "menu/pinta-menu.html";
        loadSection(menuTag, menuPath, menuTag.getAttribute("data-active"));
    }

    if (footerTag) {
        const footerPath = basePath + "footer/pinta-footer.html";
        loadSection(footerTag, footerPath, footerTag.getAttribute("data-active"));
    }

    window.addEventListener('scroll', function () {
        let titleTagline = document.querySelector('.pinta-title-tagline');
        if (titleTagline) {
            titleTagline.style.opacity = window.scrollY > 300 ? '1' : '0';
            titleTagline.style.visibility = window.scrollY > 300 ? 'visible' : 'hidden';
        }
    });
});

if (navigator.vendor && navigator.vendor.includes('Apple') && !navigator.userAgent.includes('CriOS') && !navigator.userAgent.includes('FxiOS')) {
  document.documentElement.classList.add('safari');
}
