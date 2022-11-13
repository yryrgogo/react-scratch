import { document } from "./dom";

type PeactElementType = "div" | "TEXT_ELEMENT";
type PeactElement = {
  type: PeactElementType;
  props: {
    children: PeactElement[];
    [key: string]: any;
  };
};
type Fiber = PeactElement & {
  dom?: Node;
  parent?: Fiber;
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

const isProperty = (key: string) => key !== "children";

const createDom = (fiber: Fiber): Node => {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((key) => {
      dom[key] = fiber.props[key];
    });

  return dom;
};

const render = (element: PeactElement, container: Node) => {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
};

let nextUnitOfWork = null;

const workLoop = (deadline) => {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUniOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
};

requestIdleCallback(workLoop);

const performUnitOfWork = (fiber: Fiber) => {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  if (fiber.parent) {
    const parentDom = fiber.parent?.dom;
    if (!parentDom) {
      throw new Error("parent dom is not found");
    }
    parentDom.appendChild(fiber.dom);
  }
};

const peact = {
  createElement,
  createTextElement,
  render,
};

export default peact;
export { createDom, createElement, createTextElement, render };
