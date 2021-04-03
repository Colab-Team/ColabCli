const inquirer = require("inquirer");
const createComponent = require("./createComponent");

const cli = async (allArgs) => {
  const argv = allArgs.slice(2);
  if (argv[0] === "cc") {
    if (argv[1]) {
      const [_, componentName, ...rest] = argv;
      createComponent(componentName, rest);
      return;
    } else {
      const { name } = await inquirer.prompt([
        {
          name: "name",
          message: "What name should we call the component?",
        },
      ]);
      const [_, ...rest] = argv;
      createComponent(name, rest);
    }
  }
};

module.exports = { cli };
