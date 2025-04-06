document.addEventListener("DOMContentLoaded", function () {
  function getOSInfo() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform || "";

    console.log("🔍 User Agent:", userAgent);
    console.log("🔍 Platform:", platform);

    if (/Windows NT/i.test(userAgent)) return { os: "windows", linkKey: "download_win" };
    if (/Mac OS X|Macintosh|Mac_PowerPC/i.test(userAgent) || /MacIntel/i.test(platform))
      return { os: "macos", linkKey: "download_osx" };
    if (/OpenBSD/i.test(userAgent)) return { os: "openbsd", linkKey: "download_openbsd" };
    if (/Ubuntu|Debian/i.test(userAgent)) return { os: "ubuntu", link: "https://snapcraft.io/pinta" };
    if (/Android/i.test(userAgent)) return { os: "generic" };
    if (/Linux/i.test(userAgent) && !/Android/i.test(userAgent))
      return { os: "flatpak", link: "appstream:com.github.PintaProject.Pinta" };
    if (/iPhone|iPad|iPod/i.test(userAgent)) return { os: "github" };
    if (window.innerWidth <= 768) return { os: "generic" }; // Default for mobile fallback

    return { os: "github" }; // Default fallback to GitHub
  }

  function updateDownloadButton(config) {
    const downloadButton = document.getElementById("download-button");
    if (!downloadButton) return;

    const { os, linkKey, link } = getOSInfo();
    const downloadLink = link || (config.release && config.release[linkKey]) || "https://github.com/PintaProject/Pinta/releases";

    downloadButton.href = downloadLink;
    downloadButton.className = `pinta-download-button ${os}`;

    console.log(`✅ OS Detected: ${os}`);
    console.log(`🔗 Download Link Set: ${downloadLink}`);
    console.log(`🎨 Class Applied: pinta-download-button ${os}`);
  }

  function parseYAML(yaml) {
    const obj = {};
    let currentKey = null;
    yaml.split('\n').forEach(line => {
      const match = line.match(/^\s*([a-zA-Z0-9_]+):\s*(.*)?$/);
      if (match) {
        const key = match[1];
        const value = match[2]?.trim();

        if (value === undefined) {
          obj[key] = {};
          currentKey = key;
        } else {
          if (currentKey) {
            obj[currentKey][key] = value;
          } else {
            obj[key] = value;
          }
        }
      }
    });
    return obj;
  }

  function fetchYAMLConfig() {
    fetch("https://raw.githubusercontent.com/PintaProject/pintaproject.github.io/master/_config.yml")
      .then(response => response.text())
      .then(yamlContent => {
        console.log("YAML content fetched:", yamlContent);
        const config = parseYAML(yamlContent);
        console.log("Parsed config:", config);

        if (config.release) {
          updateDownloadButton(config);
          setTimeout(() => updateDownloadButton(config), 1000); // Re-check after 1 sec
        } else {
          console.error("YAML parsing failed or missing 'release' section");
        }
      })
      .catch(error => console.error("Error loading YAML file:", error));
  }

  fetchYAMLConfig();
  setTimeout(fetchYAMLConfig, 2000); // Re-check after 2 sec
});

function addAriaLabelIfNeeded(button) {
  if (window.innerWidth <= 768 && !button.hasAttribute("aria-label")) {
    button.setAttribute("aria-label", "Download now");
  }
}

const observer = new MutationObserver(() => {
  const button = document.querySelector("#download-button");
  if (button) {
    addAriaLabelIfNeeded(button);
    observer.disconnect(); // Stop observing once applied
  }
});

observer.observe(document.body, { childList: true, subtree: true });
window.addEventListener("resize", () => {
  const button = document.querySelector("#download-button");
  if (button) addAriaLabelIfNeeded(button);
});
