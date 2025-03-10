document.addEventListener('DOMContentLoaded', function() {
    const themeSwitcher = document.getElementById('pinta-theme-switcher');
    if (!themeSwitcher) return;

    themeSwitcher.addEventListener('click', function() {
        if (document.documentElement.classList.contains('pinta-dark')) {
            document.documentElement.classList.remove('pinta-dark');
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('pinta-dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
});
