import { document } from "./dom";

type PeactElementType = "div" | "TEXT_ELEMENT";
type PeactElement = {
  type: PeactElementType;
  props: {
    children: PeactElement[];
    [key: string]: any;
  };
};

const createElement = (
  type: PeactElementType,
  props?: any,
  ...children: any[]
): PeactElement => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
};

const createTextElement = (text: string) => {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
};

const render = (element: PeactElement, container: Node) => {
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  const isProperty = (key: string) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((key) => {
      dom[key] = element.props[key];
    });

  element.props.children.forEach((child) => render(child, dom));

  container.appendChild(dom);

  return container;
};

const peact = {
  createElement,
  createTextElement,
  render,
};

export default peact;
export { createElement, createTextElement, render };
