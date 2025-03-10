// Fetch the YAML file
fetch('https://raw.githubusercontent.com/PintaProject/pintaproject.github.io/master/_config.yml')
  .then(response => response.text())
  .then(yamlContent => {
    console.log('YAML content fetched:', yamlContent);

    // Improved YAML parser to handle nested structures
    const parseYAML = (yaml) => {
      const obj = {};
      let currentKey = null;
      yaml.split('\n').forEach(line => {
        const indentMatch = line.match(/^(\s*)([a-zA-Z0-9_]+):\s*(.*)?$/);
        if (indentMatch) {
          const [, indent, key, value] = indentMatch;
          if (indent.length === 0) {
            currentKey = key;
            obj[currentKey] = value ? value.trim() : {};
          } else if (currentKey) {
            if (typeof obj[currentKey] !== 'object') {
              obj[currentKey] = {};
            }
            obj[currentKey][key] = value ? value.trim() : '';
          }
        }
      });
      return obj;
    };

    // Parse the YAML content
    const config = parseYAML(yamlContent);
    console.log('Parsed config:', config);

    if (config.release && typeof config.release === 'object') {
      // Extract and update download links
      const keys = ['download_tarball', 'download_osx', 'download_win', 'download_zip'];
      keys.forEach(key => {
        const elementId = `pinta-${key.replace('_', '-')}`;
        const element = document.getElementById(elementId);
        if (element) {
          if (config.release[key]) {
            element.href = config.release[key];
            console.log(`Updated ${elementId} to ${config.release[key]}`);
          } else {
            console.warn(`Missing value for ${key} in YAML`);
          }
        } else {
          console.warn(`Element with ID ${elementId} not found`);
        }
      });

      // Extract and update version number
      if (config.release.version) {
        const headingElement = document.getElementById('pinta-downloads-heading');
        if (headingElement) {
          headingElement.textContent = `Latest Release (v${config.release.version})`;
          console.log(`Updated heading to: Latest Release (v${config.release.version})`);
        } else {
          console.warn('Heading element not found');
        }
      } else {
        console.warn('Version number not found in YAML');
      }
    } else {
      console.error('YAML parsing failed or missing "release" section');
    }
  })
  .catch(error => {
    console.error('Error loading or parsing the YAML file:', error);
  });
