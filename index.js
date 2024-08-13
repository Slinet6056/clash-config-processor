const axios = require('axios');
const yaml = require('js-yaml');
const script = require('./script.js');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const yamlUrl = req.url.slice(1);
    
    if (!yamlUrl) {
      return res.status(400).send('Missing YAML URL');
    }

    try {
      const response = await axios.get(yamlUrl);
      const yamlContent = response.data;
      const config = yaml.load(yamlContent);
      const result = script.main(config);
      const outputYaml = yaml.dump(result);
      res.status(200).send(outputYaml);
    } catch (error) {
      res.status(500).send(`Error processing YAML: ${error.message}`);
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};