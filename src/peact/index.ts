// import { document } from "./dom";

type PeactElementType = "div" | "TEXT_ELEMENT";
type PeactElement = {
  type: PeactElementType;
  props: {
    children: PeactElement[];
    [key: string]: any;
  };
};
type Fiber = PeactElement & {
  dom: Node | null;
  parent: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;
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
      // @ts-ignore
      dom[key] = fiber.props[key];
    });

  return dom;
};

const render = (element: PeactElement, container: Node) => {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    child: null,
    parent: null,
    sibling: null,
    // TODO: div で良いのか？
    type: "div",
  };
  nextUnitOfWork = wipRoot;
};

let nextUnitOfWork: Fiber | null = null;
let wipRoot: Fiber | null = null;

const commitRoot = () => {
  commitWork(wipRoot?.child || null);
  wipRoot = null;
};

const commitWork = (fiber: Fiber | null) => {
  console.log("commitWork: ", fiber);
  if (!fiber) {
    return;
  }
  if (fiber.dom) {
    fiber.parent?.dom?.appendChild(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
};

const workLoop = (deadline: IdleDeadline) => {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    console.log("wipRoot: ", wipRoot);
    commitRoot();
  }

  requestIdleCallback(workLoop);
};

const performUnitOfWork = (fiber: Fiber) => {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  const elements = fiber.props.children;
  let index = 0;
  let prevSibling: Fiber | null = null;

  // fiber の children を Fiber に変換して、child に登録 & fiber の children 同士を単方向にリンクする
  while (index < elements.length) {
    const element = elements[index];
    const newFiber: Fiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      child: null,
      dom: null,
      sibling: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      if (prevSibling) {
        prevSibling.sibling = newFiber;
      }
    }

    prevSibling = newFiber;
    index++;
  }

  // 再帰呼び出しされるわけではないのだが、Fiber のトレースは DFS に似てる
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber: Fiber | null = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }

  return null;
};

requestIdleCallback(workLoop);

const peact = {
  createElement,
  createTextElement,
  render,
};

export type { Fiber };
export {
  createDom,
  createElement,
  createTextElement,
  render,
  performUnitOfWork,
};
export default peact;
