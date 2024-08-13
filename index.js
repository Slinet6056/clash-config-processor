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

      // 尝试从 Content-Disposition 头获取文件名
      let filename = "";
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // 如果无法从头部获取文件名，则使用 URL 的最后一部分
      if (!filename) {
        filename = path.basename(new URL(yamlUrl).pathname);
      }

      // 确保文件名以 .yaml 结尾
      if (!filename.endsWith(".yaml") && !filename.endsWith(".yml")) {
        filename += ".yaml";
      }

      const yamlContent = response.data.toString("utf-8");
      const config = yaml.load(yamlContent);
      const result = script.main(config);
      const outputYaml = yaml.dump(result);

      res.setHeader("Content-Type", "application/x-yaml");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${filename}`,
      );
      res.status(200).send(outputYaml);
    } catch (error) {
      res.status(500).send(`Error processing YAML: ${error.message}`);
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
};
