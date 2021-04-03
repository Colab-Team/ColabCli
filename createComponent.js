const path = require("path");
const pwd = process.cwd();
const currenpathurl = new URL(import.meta.url).pathname;
const componentsPath = path.resolve(pwd, "src", "components");
const componentsConfig = path.resolve(
  currenpathurl,
  "..",
  "config",
  "componentsConfigs"
);
const inquirer = require("inquirer");
const { readFileSync, writeFileSync, mkdirSync } = require("fs");
const ora = require("ora");

const createComponent = async (name, options) => {
  const componentPath = path.join(componentsPath, name);
  let generateStyle = !options.includes("-s");
  if (generateStyle) {
    const { withStyles } = await inquirer.prompt([
      {
        name: "withStyles",
        message: "Do you want separate style file? (y/n)",
        default: "y",
      },
    ]);
    if (withStyles === "y") {
      generateStyle = true;
    }
  }

  if (generateStyle) {
    const spinner = ora(`Making ${name} directory`).start();
    try {
      mkdirSync(componentPath);
      spinner.text = "Loading style file";
      const styleFile = readFileSync(componentsConfig + "/styles.js");
      spinner.text = "Loading component file";
      const styledComponentsFile = readFileSync(
        componentsConfig + "/componentWithStyles.js"
      );
      spinner.text = "Writing style file";
      writeFileSync(componentPath + "/styles.js", styleFile);
      spinner.text = "Writing component file";
      writeFileSync(componentPath + `/${name}.js`, styledComponentsFile);
      spinner.succeed();
    } catch ({ message }) {
      spinner.text = message;
      spinner.fail();
    }
  } else {
    const spinner2 = ora(`Loading component file`).start();
    try {
      const componentFile = readFileSync(
        componentsConfig + "/componentWithoutStyles.js"
      );
      spinner2.text = "Writing component file";
      writeFileSync(componentsPath + `/${name}.js`, componentFile);
      spinner2.succeed();
    } catch ({ message }) {
      spinner.text = message;
      spinner.fail();
    }
  }
};

module.exports = createComponent;
