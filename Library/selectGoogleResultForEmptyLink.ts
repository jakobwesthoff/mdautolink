import chalk from 'chalk';
import * as inquirer from 'inquirer';
import {EmptyLink} from './autolinkExtractor';
import google = require('google');

export interface SelectedLink extends EmptyLink {
  selectedUrl: string;
}

interface SelectedUrlAnswers {
  selectedUrl: string;
}

export interface Link {
  title: string;
  href: string|null;
  description: string;
}

export const selectGoogleResultForEmptyLink = async (emptyLink: EmptyLink): Promise<SelectedLink> => {
  /* tslint:disable-next-line no-console */
  console.log(`Searching Google for '${emptyLink.linkText}'...`);
  const links = await fetchResultsFromGoogle(emptyLink.linkText);
  /* tslint:disable-next-line no-console */
  console.log(links);
  if (links.length === 0) {
    /* tslint:disable-next-line no-console */
    console.log(chalk.red(`No results for '${emptyLink.linkText}' found. Most likely google blocked us.`));
    return {...emptyLink, selectedUrl: ''};
  }
  const question: Object = {
    type: 'list',
    name: 'selectedUrl',
    message: `Select link for search term '${emptyLink.linkText}'`,
    choices: links.map((link: Link) => ({name: `${link.title}: ${link.href}`, value: link.href})),
  };
  const answer = await inquirer.prompt<SelectedUrlAnswers>(question as any);
  return {...emptyLink, selectedUrl: answer.selectedUrl};
};

const fetchResultsFromGoogle = (searchTerm: string) => {
  return new Promise<Link[]>(
    (resolve, reject) => {
      google.resultsPerPage = 10;
      google(searchTerm, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve((res.links as Link[]).filter((link: Link) => link.href !== null));
      });
    });
};
