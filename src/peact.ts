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
  const dom = document.createElement(element.type);

  container.appendChild(dom);
};

const peact = {
  createElement,
  createTextElement,
  render,
};

export default peact;
export { createElement, createTextElement, render };
