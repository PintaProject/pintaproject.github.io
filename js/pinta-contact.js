document.addEventListener("DOMContentLoaded", function () {
  // Function to fetch and parse YAML file
  function fetchYamlConfig() {
    fetch("https://raw.githubusercontent.com/PintaProject/pintaproject.github.io/master/_config.yml")
      .then(response => response.text())
      .then(yamlText => {
        const links = parseYaml(yamlText);
        updateLinks(links);
      })
      .catch(error => console.error("Error fetching YAML config:", error));
  }

  // Simple YAML parser function
  function parseYaml(yamlText) {
    const lines = yamlText.split("\n");
    const links = {};
    let inLinksSection = false;

    lines.forEach(line => {
      line = line.trim();
      if (line.startsWith("links:")) {
        inLinksSection = true;
      } else if (inLinksSection && line.includes(":")) {
        const [key, ...valueParts] = line.split(":").map(part => part.trim());
        if (valueParts.length > 0) {
          links[key] = valueParts.join(":").replace(/^"|"$/g, ""); // Preserve full URL
        }
      }
    });
    return links;
  }  

  // Function to update links dynamically
  function updateLinks(links) {
    const linkMapping = {
      "pinta-bug": "bugs",
      "pinta-question": "questions",
      "pinta-discuss": "discussions",
      "pinta-translate": "translations"
    };

    Object.keys(linkMapping).forEach(id => {
      const element = document.getElementById(id);
      if (element && links[linkMapping[id]]) {
        element.href = links[linkMapping[id]];
      }
    });
  }

  fetchYamlConfig();
});


function updateContactInfo() {
  var select = document.getElementById("contact-select");
  var emailDisplay = document.getElementById("email-display");
  var copyButton = document.getElementById("copy-button");
  var emailButton = document.getElementById("email-button");
  var selectedOption = select.options[select.selectedIndex];
  var username = selectedOption.value;
  var domain = selectedOption.getAttribute("data-domain");

  if (username && domain) {
    var email = `${username}@${domain}`;
    emailDisplay.innerHTML = `${username} <img src='../img/icons/atsign.svg' alt='@'> ${domain}`;
    emailButton.classList.remove("pinta-disabled");
    emailButton.removeAttribute("disabled");
    emailButton.setAttribute("data-email", email);
    copyButton.classList.remove("pinta-disabled");
    copyButton.removeAttribute("disabled");
    copyButton.setAttribute("data-email", email);
  } else {
    emailDisplay.innerHTML = "";
    emailButton.classList.add("pinta-disabled");
    emailButton.setAttribute("disabled", "true");
    emailButton.removeAttribute("data-email");
    copyButton.classList.add("pinta-disabled");
    copyButton.setAttribute("disabled", "true");
    copyButton.removeAttribute("data-email");
  }
}

function copyEmail() {
  var copyButton = document.getElementById("copy-button");
  var email = copyButton.getAttribute("data-email");

  if (email) {
    navigator.clipboard.writeText(email).then(() => {
      // Update the button text to "Copied!"
      copyButton.querySelector('div').innerText = 'Copied!';

      // After 2 seconds, revert back to the original text "copy"
      setTimeout(() => {
        copyButton.querySelector('div').innerText = 'copy';
      }, 2000);
    });
  }
}

function sendEmail() {
  var emailButton = document.getElementById("email-button");
  var email = emailButton.getAttribute("data-email");
  if (email) {
    window.location.href = `mailto:${email}`;
  }
}
