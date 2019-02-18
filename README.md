# Markdown Auto Link

Tooling to automatically fill basic links in markdown pages with their one of
their first google search matches.

## Reasoning

While writing documentation using the [markdown](https://daringfireball.net/projects/markdown/syntax) format I often want to link
to the pages of specific projects or documentations. Usually those links are
the first google result for the keyword provided as a link text. Instead of
always searching for those links by myself and inserting them, I created this
tooling, to scan _empty links_ (`[some link text]()`), for me automatically and
allow me to choose between the first google results for them.

## Usage

```shell
mdautoln <markdown-document.md>
```
