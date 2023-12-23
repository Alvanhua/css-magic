const yargs = require("yargs");
const fs = require("fs");
const path = require("path");
const glob = require("glob");

const appRootDir = path.join(process.cwd(), "apps");
const apps = glob.sync("*", {
  cwd: appRootDir,
});

const copyDir = (src, dest, failCallback) => {
  const copy = (copySrc, copyDest) => {
    fs.readdir(copySrc, (err, files) => {
      if (err) {
        failCallback && failCallback(err);
        return;
      }
      files.forEach((item) => {
        const ss = path.resolve(copySrc, item);
        fs.stat(ss, (err, stat) => {
          if (err) {
            failCallback && callback(err);
          } else {
            const curSrc = path.resolve(copySrc, item);
            const curDest = path.resolve(copyDest, item);

            if (stat.isFile()) {
              fs.createReadStream(curSrc).pipe(fs.createWriteStream(curDest));
            } else if (stat.isDirectory()) {
              fs.mkdirSync(curDest, { recursive: true });
              copy(curSrc, curDest);
            }
          }
        });
      });
    });
  };

  fs.access(dest, (err) => {
    if (err) {
      fs.mkdirSync(dest, { recursive: true });
    }
    copy(src, dest);
  });
};

const run = (pkg) => {
  const pkgs = Array.isArray(pkg) ? pkg : pkg ? [pkg] : apps;
  try {
    if (!pkgs.length) {
      console.error(`Move Filed, could not find app/module ${pkg}`);
      return;
    }
    for (let i = 0; i < pkgs.length; i++) {
      const app = pkgs[i];
      const sourcePath = path.join(appRootDir, app, "dist");
      const destinationPath = path.join(__dirname, "../dist");
      copyDir(sourcePath, destinationPath);
    }
  } catch (error) {
    console.error(error);
  }
};

run(yargs.argv?.pkg);
