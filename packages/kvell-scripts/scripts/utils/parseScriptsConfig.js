const path = require("path");
// const readFileFromPath = require("./fsWrapper").readFromFile;
const parsedConfigInit = require("../config/appDefaultConfig");

const configFileName = "kvell.config.js";

const configErrorKeys = ["routes", "protocol", "models"];

// const isObject = obj => {
//   return !Array.isArray(obj) && obj === Object(obj);
// };

const createConfigObject = parsedConfigs => {
  const configKeysStatus = {
    routes: {
      valid: !parsedConfigs.routes ? true : Array.isArray(parsedConfigs.routes)
    },
    protocol: {
      valid: !parsedConfigs.protocol
        ? true
        : ["http", "https"].indexOf(parsedConfigs.protocol) !== -1
    },
    models: {
      valid: !parsedConfigs.models ? true : Array.isArray(parsedConfigs.models)
    }
    // database: {
    //   valid: !parsedConfigs.database ? true : isObject(parsedConfigs.database)
    // }
  };

  const { routes, protocol, models } = configKeysStatus;

  let configObject = {};
  if (!routes.valid || !protocol.valid || !models.valid) {
    const errorString = `Your ./${configFileName} contains invalid config values for:\n${configErrorKeys
      .filter(configKey => !configKeysStatus[configKey].valid)
      .join("\n")}`;
    throw new Error(errorString);
  } else {
    configObject = {
      routes: parsedConfigs.routes || parsedConfigInit.routes,
      protocol: parsedConfigs.protocol || parsedConfigInit.protocol,
      models: parsedConfigs.models || parsedConfigInit.models,
      autoRequireRoutes:
        parsedConfigs.autoRequireRoutes === undefined
          ? parsedConfigInit.autoRequireRoutes
          : parsedConfigs.autoRequireRoutes
      // database: parsedConfigs.database || parsedConfigInit.database
    };
  }
  return configObject;
};

/**
 * @typedef {Object} Routes
 * @property {string} name
 * @property {string} path
 */

/**
 *
 * @typedef {Object} ScriptsConfig
 * @property {Routes[]} routes
 * @property {string[]]} models
 * @property {("http" | "https")} protocol
 * @property {boolean} autoRequireRoutes
 */

/**
 * @returns {Promise<ScriptsConfig>}
 */
const parseScriptsConfig = async appSrcDirectory => {
  let parsedConfig = parsedConfigInit;
  const configFilePath = path.join(appSrcDirectory, `./${configFileName}`);
  const parsedConfigObject = require(configFilePath);
  parsedConfig = createConfigObject(parsedConfigObject);
  return parsedConfig;
};

module.exports = parseScriptsConfig;
