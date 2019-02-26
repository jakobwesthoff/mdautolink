import {isEqual} from 'lodash';
import {Node} from 'unist';
import {SelectedLink} from './selectGoogleResultForEmptyLink';
/* tslint:disable-next-line ordered-imports*/
import visit = require('unist-util-visit');

export const autolinkInjector = (selectedLinks: Set<SelectedLink>): any => () => {
  const transformer = (tree: Node) => {
    visit(tree, 'link', selectedLinkInjector);
  };

  const toPlainNode = (node: Node) => {
    // @Hack: Not the nicest implementation, but it surely works.
    return JSON.parse(JSON.stringify(node));
  };

  const findSelectedLinkByNode = (node: Node): SelectedLink | false => {
    for (const selectedLink of selectedLinks) {
      if (isEqual(toPlainNode(selectedLink.node), toPlainNode(node))) {
        return selectedLink;
      }
    }

    return false;
  };

  const selectedLinkInjector = (node: Node) => {
    const selectedLink = findSelectedLinkByNode(node);
    if (selectedLink === false) {
      return;
    }

    (node as any).url = selectedLink.selectedUrl;
  };

  return transformer;
};
