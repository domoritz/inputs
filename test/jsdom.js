import {JSDOM} from "jsdom";
import tape from "tape-await";

export default Object.assign(wrap(tape), {
  skip: wrap(tape.skip),
  only: wrap(tape.only)
});

function wrap(tape) {
  return function(description, run) {
    return tape(description, test => {
      return withJsdom(() => run(test));
    });
  };
}

export async function withJsdom(run) {
  const jsdom = new JSDOM("");
  global.window = jsdom.window;
  global.document = jsdom.window.document;
  global.Node = jsdom.window.Node;
  global.NodeList = jsdom.window.NodeList;
  global.HTMLCollection = jsdom.window.HTMLCollection;
  try {
    return await run();
  } finally {
    delete global.window;
    delete global.document;
    delete global.Node;
    delete global.NodeList;
    delete global.HTMLCollection;
  }
}
