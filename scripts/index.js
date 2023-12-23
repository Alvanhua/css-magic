const glob = require("glob");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { join } = require("path");
const { execSync } = require("child_process");
const rootPkg = require("../package.json");

const appRootDir = join(process.cwd(), "apps");
const apps = glob.sync("*", {
  cwd: appRootDir,
});

const packageRootDir = join(process.cwd(), "packages");
const packages = glob.sync("*", {
  cwd: packageRootDir,
});

function genParams(pkg, key, _f) {
  const f = _f || ((_pkg) => _pkg);
  const r = Array.isArray(pkg) ? [...pkg.map(f)] : [f(p)];
  return r.map((_) => `--${key} ${_}`).join(" ");
}

function genScopes(pkg) {
  return genParams(pkg, "scope", (_pkg) => `@${rootPkg.name}/${_pkg}`);
}

function generateOptionsStr(options) {
  if (options) {
    let str = "";
    for (const key in options) {
      if (options[key]) {
        str += `--${key} ${options[key]}`;
      }
    }
    return str;
  }
  return "";
}

function generateArgs(args) {
  if (!args) return "";
  return args.slice(1).join(" ");
}

function runPkgScript(script, _pkg, argsStr, optionsStr, dir) {
  const pkgs = Array.isArray(_pkg) ? _pkg : [_pkg];
  for (let i = 0; i < pkgs.length; i++) {
    const packageJson = require(join(dir, pkgs[i], "package.json"));
    if (!packageJson.scripts[script]) {
      return console.error(`${pkgs[i]} 模块没有 ${script} 命令, 请确认`);
    }
  }
  const scope = genScopes(pkgs);
  const pkg = genParams(pkgs, "pkg");
  try {
    execSync(
      `lerna ${scope} run ${script} -- ${argsStr} ${optionsStr} && node scripts/mv.js ${pkg}`,
      { stdio: "inherit" }
    );
  } catch (e) {
    console.error(e);
  }
}

function runScript(script, _pkg, args, options) {
  const optionsStr = generateOptionsStr(options);
  const argsStr = generateArgs(args);
  if (_pkg) {
    const appPkgs = (Array.isArray(_pkg) ? _pkg : [_pkg]).filter((p) =>
      apps.includes(p)
    );
    const packagesPkgs = (Array.isArray(_pkg) ? _pkg : [_pkg]).filter((p) =>
      packages.includes(p)
    );
    if (appPkgs.length) {
      return runPkgScript(script, appPkgs, argsStr, optionsStr, appRootDir);
    } else if (packagesPkgs.length) {
      return runPkgScript(
        script,
        packagesPkgs,
        argsStr,
        optionsStr,
        packageRootDir
      );
    }
    return console.error(
      `Could not find app/module ${_pkg}, there are the following apps: [${apps.toString()}] modules: [${packages.toString()}], please confirm.`
    );
  }
  try {
    if (script === "build") {
      execSync(`npx rimraf dist && lerna run build && node scripts/mv.js`, {
        stdio: "inherit",
      });
    } else {
      execSync(`npx rimraf dist && lerna run ${script} -- ${argsStr}`, {
        stdio: "inherit",
      });
    }
  } catch (e) {
    console.error(e);
  }
}

function runServe(argv) {
  runScript("start", argv?.scope, argv._);
}

yargs(hideBin(process.argv))
  .command(
    "start",
    "start app",
    (yargs) => {
      yargs.positional("args", {
        type: "string",
        describe: "app start",
      });
    },
    (argv) => {
      runServe(argv);
    }
  ).argv;
