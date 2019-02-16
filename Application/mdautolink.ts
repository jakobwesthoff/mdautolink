import chalk from 'chalk';
import {access, constants as fseConstants, copyFile, readFile, writeFile} from 'fs-extra';
import * as minimst from 'minimist';
import {autolink} from '../autolink';
import parse = require('remark-parse');
import stringify = require('remark-stringify');
import unified = require('unified');

const args = minimst(process.argv.slice(2));

const usage = () => {
  /* tslint:disable-next-line no-console */
  console.log(`
Markdown Auto Link

Usage:
  ${process.argv[0]}: <markdown-files...>

`);
};

(async () => {
  if (args._.length === 0) {
    /* tslint:disable-next-line no-console */
    usage();
    process.exit(1);
  }

  for (const mdfile of args._) {
    try {
      /* tslint:disable-next-line no-bitwise */
      await access(mdfile, fseConstants.F_OK | fseConstants.R_OK);
    } catch (e) {
      /* tslint:disable-next-line no-console */
      console.log(chalk.red(`${mdfile} is not a readable markdown file.`));
      process.exit(1);
    }
  }

  const processor = unified()
    .use(parse)
    .use(autolink)
    .use(stringify);

  for (const mdfile of args._) {
    /* tslint:disable-next-line no-console */
    console.log(`Processing ${mdfile}.`);
    const input = await readFile(mdfile, 'utf-8');
    /* tslint:disable-next-line no-console */
    const result = await processor.process(input);
    /* tslint:disable-next-line no-console */
    const backupFile = `${mdfile}.bak`;
    /* tslint:disable-next-line no-console */
    console.log(`Creating Backup at ${backupFile}`);
    await copyFile(mdfile, backupFile);
    /* tslint:disable-next-line no-console */
    console.log(`Updating ${mdfile}`);
    await writeFile(mdfile, String(result));
  }
})();
