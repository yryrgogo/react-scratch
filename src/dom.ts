import jsdom from "jsdom";

const { JSDOM } = jsdom;
const dom = new JSDOM();
dom.reconfigure({ url: "http://localhost" });
const { window } = dom;
const { document } = window;

export { document, window };
