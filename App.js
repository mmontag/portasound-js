import React from "https://unpkg.com/es-react@latest/dev/react.js";
import ReactDOM from "https://unpkg.com/es-react@latest/dev/react-dom.js";
import PropTypes from "https://unpkg.com/es-react@latest/dev/prop-types.js";
import htm from "https://unpkg.com/htm@latest?module";
const html = htm.bind(React.createElement);

const App = (props) => {
  return html`<div>Hello World! Foo: ${props.foo}</div>`;
}

ReactDOM.render(
  html`<${App} foo=${"bar"} />`,
  document.getElementById("root")
);