const github = require("@actions/github");
const core = require("@actions/core");
const { spawnSync } = require("child_process");

module.exports = async () => {
  const { owner } = github.context.repo;
  const eventContext = core.getInput("event_ctx");
  const eventContextJSON = JSON.parse(eventContext);
  const packageURL =
    eventContextJSON.registry_package.package_version.package_url;
  const packageName = eventContextJSON.registry_package.name;
  const packageVersion =
    eventContextJSON.registry_package.package_version.version;
  const packageNameSpace = eventContextJSON.registry_package.namespace;

  try {
    let result;

    switch (eventContextJSON.registry_package.package_type) {
      case "npm":
        result = spawnSync(
          "npm",
          ["install", `@${packageNameSpace}@${packageVersion}`],
          { cwd: process.env.GITHUB_WORKSPACE }
        );
        break;
      case "rubygems":
        result = spawnSync(
          "gem",
          ["install", packageName, `--source ${packageURL}`],
          { cwd: dir }
        );
        break;
      case "docker":
      case "container":
        // Docker has an installation command under registry_package.package_version.installation_command
        const installationCommand =
          eventContextJSON.registry_package.package_version
            .installation_command;
        const baseCommand = installationCommand.split(" ")[0];
        const commandArgs = installationCommand.split(" ").slice(1);
        result = spawnSync(baseCommand, commandArgs, {
          cwd: process.env.GITHUB_WORKSPACE,
        });
      // case "maven":
      //   result = spawnSync("some",["maven","magic"]);
      //   break;
      // case "nuget":
      //   result = spawnSync(
      //     "dotnet",
      //     ["add", "package", `${packageName}`, `-s ${packageURL}`],
      //     { cwd: dir }
      //   );
      //   break;
      default:
        throw new Error(
          `Unsupported package type: ${eventContextJSON.registry_package.package_type}`
        );
    }

    if (result.status == 0) {
      return {
        reports: [
          {
            filename: "",
            isCorrect: true,
            display_type: "actions",
            level: "info",
            msg: "Great job!",
            error: {
              expected: "",
              got: "",
            },
          },
        ],
      };
      // BAD-RESULT
    } else {
      return {
        reports: [
          {
            filename: "",
            isCorrect: false,
            display_type: "actions",
            level: "warning",
            msg: `incorrect solution`,
            error: {
              expected:
                "We expected successful access to your package using the peroper CLI tool.",
              got: `${result.stderr.toString()}`,
            },
          },
        ],
      };
    }
  } catch (error) {
    return {
      reports: [
        {
          filename: "",
          isCorrect: false,
          display_type: "actions",
          level: "fatal",
          msg: "",
          error: {
            expected:
              "To be able to sucessfully use the package you have uploaded",
            got: error.message,
          },
        },
      ],
    };
  }
};
