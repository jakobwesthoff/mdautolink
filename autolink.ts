import {Node} from 'unist';
import visit = require('unist-util-visit');

export const autolink: any = () => transformer;

const transformer = (tree: Node) => {
  visit(tree, 'link', visitLink);
};

const visitLink = (node: Node, _: number, __: Node) => {
  /* tslint:disable-next-line no-console */
  console.log(JSON.stringify(node));
};
