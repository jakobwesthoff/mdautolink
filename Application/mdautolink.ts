import chalk from 'chalk';
import {access, constants as fseConstants, copyFile, readFile, writeFile} from 'fs-extra';
import * as minimst from 'minimist';
import {autolinkExtractor, EmptyLink} from '../Library/autolinkExtractor';
import {autolinkInjector} from '../Library/autolinkInjector';
import {SelectedLink, selectGoogleResultForEmptyLink} from '../Library/selectGoogleResultForEmptyLink';
import parse = require('remark-parse');
import stringify = require('remark-stringify');
import unified = require('unified');

const args = minimst(process.argv.slice(2));

const usage = () => {
  /* tslint:disable-next-line no-console */
  console.log(`
Markdown Auto Link

Usage:
  ${process.argv[0]}: [--force] <markdown-files...>

  Options:
    --force: Do not create Backup (.bak) file while processing

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

  for (const mdfile of args._) {
    const extractedEmptyLinks = new Set<EmptyLink>();

    const extractor = unified()
      .use(parse)
      .use(autolinkExtractor(extractedEmptyLinks))
      .use(stringify);

    /* tslint:disable-next-line no-console */
    console.log(`Processing ${mdfile}.`);
    const input = await readFile(mdfile, 'utf-8');
    /* tslint:disable-next-line no-console */
    console.log(`Isolating empty links.`);
    await extractor.process(input);
    const selectedLinks = new Set<SelectedLink>();
    for (const emptyLink of extractedEmptyLinks) {
      selectedLinks.add(await selectGoogleResultForEmptyLink(emptyLink));
    }

    const injector = unified()
      .use(parse)
      .use(autolinkInjector(selectedLinks))
      .use(stringify);

    const result = await injector.process(input);

    if (!args.force) {
      const backupFile = `${mdfile}.bak`;
      /* tslint:disable-next-line no-console */
      console.log(`Creating Backup at ${backupFile}`);
      await copyFile(mdfile, backupFile);
    }
    /* tslint:disable-next-line no-console */
    console.log(`Updating ${mdfile}`);
    await writeFile(mdfile, String(result));
  }
})();
