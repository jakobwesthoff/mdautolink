import {Node} from 'unist';
import visit = require('unist-util-visit');

export interface EmptyLink {
  node: Node;
  linkText: string;
}

export const autolinkExtractor = (extractionSet: Set<EmptyLink>): any => () => {
  const transformer = (tree: Node) => {
    visit(tree, 'link', emptyLinkExtractor);
  };

  const createLinkTextVisitor = (linkTexts: string[]) => (node: Node) => {
    linkTexts.push(node.value as string);
  };

  const emptyLinkExtractor = (node: Node) => {
    if (node.url as string !== '') {
      return;
    }

    const linkTexts: string[] = [];
    visit(node, 'text', createLinkTextVisitor(linkTexts));

    const linkText = linkTexts.join('');
    extractionSet.add({node, linkText});
  };

  return transformer;
};
