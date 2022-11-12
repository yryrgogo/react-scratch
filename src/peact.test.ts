import { createElement, render } from "./peact";

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

test("render", () => {
  expect(
    render(createElement("div"), document.createElement("div"))
  ).toStrictEqual({});
});
