import config from "config"

module.exports = {
  development: {
    client: "postgres",
    connection: config.get("osm.db")
  },
};
