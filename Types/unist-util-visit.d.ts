declare module 'unist-util-visit' {
  import {Node} from 'unist';

  function visit(
    tree: Node,
    test: string[] | string,
    visitor: (node: Node, index: number, parent: Node) => void,
    reverse?: any
  ): void;

  export = visit;
}
