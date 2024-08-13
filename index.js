const axios = require("axios");
const yaml = require("js-yaml");
const script = require("./script.js");
const path = require("path");

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const yamlUrl = req.url.slice(1);

    if (!yamlUrl) {
      return res.status(400).send("Missing YAML URL");
    }

    try {
      const response = await axios.get(yamlUrl, {
        responseType: "arraybuffer",
      });

      // 复制原始响应的标头
      for (const [key, value] of Object.entries(response.headers)) {
        // 排除一些不应该或不需要复制的标头
        if (
          ![
            "content-length",
            "connection",
            "keep-alive",
            "transfer-encoding",
          ].includes(key.toLowerCase())
        ) {
          res.setHeader(key, value);
        }
      }

      // 处理文件名
      let filename = "";
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      if (!filename) {
        filename = path.basename(new URL(yamlUrl).pathname);
      }

      if (!filename.endsWith(".yaml") && !filename.endsWith(".yml")) {
        filename += ".yaml";
      }

      const yamlContent = response.data.toString("utf-8");
      const config = yaml.load(yamlContent);
      const result = script.main(config);
      const outputYaml = yaml.dump(result);

      // 覆盖或设置一些特定的标头
      res.setHeader("Content-Type", "application/x-yaml");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.setHeader("Content-Length", Buffer.byteLength(outputYaml));

      res.status(200).send(outputYaml);
    } catch (error) {
      res.status(500).send(`Error processing YAML: ${error.message}`);
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
};
