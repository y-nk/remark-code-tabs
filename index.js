import { parse } from "node:querystring";
import { visit } from "unist-util-visit";

import createStyle from "./style.js";

function createTabs(tabs) {
  return {
    type: "wrapper",
    data: {
      hName: "div",
      hProperties: {
        id: tabs,
        className: "remark-code-tabs",
      },
    },
    children: [],
  };
}

function createTab(node, index) {
  const tabGroup = node.meta.tabs;
  const tabId = `${tabGroup}#${index}`;
  const tabName = node.meta.name;

  return [
    {
      type: "html",
      value: `<label for="${tabId}" class="remark-code-tab">
        <input
          type="radio"
          id=${tabId}
          name="${tabGroup}"
          ${index === 0 ? "checked" : ""}/>
        ${tabName}
      </label>`,
    },
    {
      type: "wrapper",
      data: {
        hName: "div",
        hProperties: {
          className: "remark-code-content",
        },
      },
      children: [node],
    },
  ];
}

function createPlaceholder({ tabs, name }) {
  return {
    type: "html",
    value: `<hr
      class="remark-code-tabs-x"
      rel="${tabs}#${name}"
    />`,
  };
}

export default function remarkCodeTabs({
  injectStyle,
  metaDelimiter = " ",
} = {}) {
  return function transform(tree, file) {
    const queue = {};

    let styled = false;

    visit(tree, "code", function (node, index, parent) {
      const meta = parse(node.meta ?? "", metaDelimiter);

      if (!meta.tabs) return;

      const newNode = !queue[meta.tabs]
        ? createTabs(meta.tabs)
        : createPlaceholder(meta);

      parent.children[index] = newNode;
      queue[meta.tabs] ??= newNode;

      queue[meta.tabs].children.push(
        ...createTab({ ...node, meta }, queue[meta.tabs].children.length)
      );

      if (!styled && injectStyle) {
        tree.children.unshift({
          type: "html",
          value: createStyle(injectStyle === "cdn"),
        });

        styled = true;
      }
    });
  };
}
