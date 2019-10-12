const fs = require('fs');

const dirs = [
  'core',
  'interfaces',
  'utils'
];
const tasks = dirs.map(dir => {
    return new Promise((resolve, reject) => {
        const dirPath = `./src/${dir}`;
        fs.readdir(dirPath, null, (err, files) => {
            if (!err) {
                const exports = files.reduce((acc, file) => {
                    if (file[0] === file[0].toUpperCase()) {
                        // this is a class/interface definition that should be exposed in the lib
                        const name = file.substring(0, file.length - 3);
                        acc += `export {default as ${name}} from './${name}';\n`;
                    }
                    return acc;
                }, '');
                fs.writeFile(dirPath + '/index.ts', exports, (err) => {
                    if (!err) {
                        resolve('Exports created: ' + dirPath + '/index.ts');
                    } else {
                        reject(err);
                    }
                });
            }
        })
    });
});
Promise
    .all(tasks)
    .then(results => results.forEach(console.log))
    .catch(errors => errors.forEach(console.error));
