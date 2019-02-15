import chalk from 'chalk';
import {access, constants as fseConstants} from 'fs-extra';
import * as minimst from 'minimist';

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
})();
