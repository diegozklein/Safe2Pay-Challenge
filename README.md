# Safe2Pay-Challenge
🛠 Built with JavaScript, Cypress and Node
⚡️ Zero database dependencies
🚀 Dummyapi Test Automation
💻 CI/CD + [Cypress Cloud][cypresscloud]


[cypresscloud]: https://cloud.cypress.io/projects/6xuqh4/branches/main/overview

## Requisites

In order to run the tests on your machine, you should have installed:

- Node
- IDE of your choice (I recommend VSCode)

## How to run the project step-by-step

First, install the project dependencies:

```bash
npm install
```

Then, you have two options:

To execute the tests using CLI, you can type on the console:

```bash
npm run cy:run
```
This will execute all cypress tests and log the progress on the console.

If you prefer using a more visual tool, you can also execute the tests using Cypress GUI. To do that, run the following command on the console:

```bash
npx cypress open
```

Then you have to select: E2E Testing -> Electron -> Start E2E Testing in Electron

Now you have to select the desired spec and voila.

# Cypress Cloud

If you want to check my CI/CD implementation using GitHub Actions and Cypress Cloud, you can check both Actions tab from this repository and the link below to the Cypress Cloud Platform
