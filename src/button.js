import {html} from "htl";
import {length} from "./css.js";
import {dispatchInput, preventDefault} from "./event.js";
import {identity} from "./identity.js";
import {maybeLabel} from "./label.js";

export function Button(content = "≡", {
  label = "",
  value,
  reduce,
  disabled,
  width
} = {}) {
  const solitary = typeof content === "string" || content instanceof Node;
  if (solitary) {
    if (value === undefined) value = 0;
    if (reduce === undefined) reduce = value => value + 1;
    disabled = new Set(disabled ? [content] : []);
    content = [[content, reduce]];
  } else {
    if (value === undefined) value = null;
    disabled = new Set(disabled === true ? Array.from(content, ([content]) => content) : disabled || undefined);
  }
  const form = html`<form class=__ns__ onsubmit=${preventDefault}>`;
  const style = {width: length(width)};
  const buttons = Array.from(content, ([content, reduce = identity]) => {
    if (typeof reduce !== "function") throw new TypeError("reduce is not a function");
    return html`<button disabled=${disabled.has(content)} style=${style} onclick=${event => {
      form.value = reduce(form.value);
      dispatchInput(event);
    }}>${content}`;
  });
  if (label = maybeLabel(label, solitary ? buttons[0] : undefined)) form.append(label);
  form.append(...buttons);
  form.value = value;
  return form;
}
