import {
  createDom,
  createElement,
  Fiber,
  performUnitOfWork,
  render,
} from "./peact";
import { document, window } from "./dom";

test("createElement", () => {
  expect(createElement("div")).toStrictEqual({
    type: "div",
    props: { children: [] },
  });

  const hoge = "hoge";
  expect(createElement("div", null, hoge)).toStrictEqual({
    type: "div",
    props: {
      children: [
        {
          props: {
            children: [],
            nodeValue: "hoge",
          },
          type: "TEXT_ELEMENT",
        },
      ],
    },
  });

  const fuga = "fuga";
  expect(createElement("div", null, hoge, fuga)).toStrictEqual({
    type: "div",
    props: {
      children: [
        {
          props: {
            children: [],
            nodeValue: "hoge",
          },
          type: "TEXT_ELEMENT",
        },
        {
          props: {
            children: [],
            nodeValue: "fuga",
          },
          type: "TEXT_ELEMENT",
        },
      ],
    },
  });
});

describe("createDom", () => {
  test("<div />", () => {
    const expectedDom = document.createElement("div");

    expect(
      createDom({
        props: {
          children: [],
        },
        type: "div",
        child: null,
        dom: null,
        parent: null,
        sibling: null,
      })
    ).toStrictEqual(expectedDom);
  });
});

describe("performUnitOfWork", () => {
  test("<div />", () => {
    expect(
      performUnitOfWork({
        type: "div",
        props: {
          children: [],
        },
        dom: null,
        parent: null,
        child: null,
        sibling: null,
      })
    ).toStrictEqual(undefined);
  });

  test("<div><div /></div>", () => {
    const input: Fiber = {
      type: "div",
      props: {
        children: [{ props: { children: [] }, type: "div" }],
      },
      dom: null,
      parent: null,
      child: null,
      sibling: null,
    };
    expect(performUnitOfWork(input)).toStrictEqual(
      // 循環参照を作成するために即時関数を使っている
      (() => {
        const child: Fiber = {
          type: "div",
          props: {
            children: [],
          },
          dom: null,
          parent: {
            type: "div",
            child: input,
            dom: document.createElement("div"),
            parent: null,
            props: {
              children: [{ props: { children: [] }, type: "div" }],
            },
            sibling: null,
          },
          child: null,
          sibling: null,
        };
        input.child = child;
        child.parent = input;
        return child;
      })()
    );
  });
});

// test("render", () => {
//   const expectedDom = document.createElement("div");
//   expectedDom.appendChild(document.createElement("div"));

//   expect(
//     render(createElement("div"), document.createElement("div"))
//   ).toStrictEqual(expectedDom);
// });
