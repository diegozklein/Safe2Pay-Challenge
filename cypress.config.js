const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://dummyapi.io/data/v1/'
  },
  projectId: "6xuqh4",
  env: {
    appId: "6536af521956e10e49c899e2"
  }
});
