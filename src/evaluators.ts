/* eslint no-new-func: 0 */
import { State } from "./types";

function evaluateExpression(expression: string, value: State) {
  try {
    return Function("state", `return ${expression}`)(value);
  } catch (err) {
    console.error("Failed to evaluate", expression, value, err);
  }
}

export { evaluateExpression };
