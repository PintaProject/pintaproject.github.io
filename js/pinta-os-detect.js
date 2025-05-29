document.addEventListener("DOMContentLoaded", function () {
  function isAppleSilicon() {
    // Method 1: Check WebGL renderer (Apple Silicon GPUs identify themselves)
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          if (/Apple M[1-9]/.test(renderer) || /Apple GPU/.test(renderer)) return true;
        }
      }
    } catch (e) {}

    // Method 2: Check performance characteristics (Apple Silicon is much faster)
    const start = performance.now();
    let sum = 0;
    for (let i = 0; i < 1e7; i++) sum += Math.random();
    const duration = performance.now() - start;
    if (duration < 15) return true; // Empirical threshold for Apple Silicon speed

    // Method 3: Check for ARM in userAgent (some browsers expose this)
    if (/\bARM\b|Apple Silicon/i.test(navigator.userAgent)) return true;

    // Method 4: High core count + memory (typical of Apple Silicon)
    if (navigator.hardwareConcurrency >= 8 && (navigator.deviceMemory || 0) >= 8) return true;

    return false;
  }

  function getOSInfo() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform || "";

    console.log("🔍 User Agent:", userAgent);
    console.log("🔍 Platform:", platform);

    // 1. Windows
    if (/Windows NT/i.test(userAgent)) return { os: "windows", linkKey: "download_win" };

    // 2. macOS
    if (/Mac OS X|Macintosh|Mac_PowerPC/i.test(userAgent) || /MacIntel/i.test(platform)) {
      if (isAppleSilicon()) {
        return { os: "macos", linkKey: "download_macosarm64" };
      }
      return { os: "macos", linkKey: "download_osx" };
    }

    // 3. OpenBSD
    if (/OpenBSD/i.test(userAgent)) return { os: "openbsd", linkKey: "download_openbsd" };

    // 4. Android
    if (/Android/i.test(userAgent)) return { os: "generic" };

    // 5. iOS
    if (/iPhone|iPad|iPod/i.test(userAgent)) return { os: "github" };

    // 6. Linux Desktop Distros lacking snap/appstream support
    if (/Linux/i.test(userAgent) && !/Android/i.test(userAgent)) {
      const lowerUA = userAgent.toLowerCase();

      const noSnapNoAppstreamDistros = [
        "linux mint",
        "arch",
        "endeavouros",
        "artix",
        "void"
      ];

      if (noSnapNoAppstreamDistros.some(distro => lowerUA.includes(distro))) {
        return {
          os: "flatpak",
          link: "https://flathub.org/apps/com.github.PintaProject.Pinta"
        };
      }

      // Ubuntu/Debian with Snap support
      if (/Ubuntu|Debian/i.test(userAgent)) {
        return {
          os: "ubuntu",
          link: "https://snapcraft.io/pinta"
        };
      }

      // Default for other Linux distros: use appstream (likely GNOME/KDE)
      return {
        os: "flatpak",
        link: "appstream:com.github.PintaProject.Pinta"
      };
    }

    // 7. Mobile viewport fallback
    if (window.innerWidth <= 768) return { os: "generic" };

    // 8. Default fallback
    return { os: "github" };
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
