import { render, createElement, createDom } from "./peact";

const main = () => {
  const root = createDom({
    props: {
      children: [],
    },
    type: "div",
    child: null,
    dom: null,
    parent: null,
    sibling: null,
  });

  //   document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  //   <div>
  //     <a href="https://vitejs.dev" target="_blank">
  //       <img src="/vite.svg" class="logo" alt="Vite logo" />
  //     </a>
  //     <a href="https://www.typescriptlang.org/" target="_blank">
  //       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
  //     </a>
  //     <h1>Vite + TypeScript</h1>
  //     <div class="card">
  //       <button id="counter" type="button"></button>
  //     </div>
  //     <p class="read-the-docs">
  //       Click on the Vite and TypeScript logos to learn more
  //     </p>
  //   </div>
  // `;

  render(<div></div>, document.body);
};

main();
