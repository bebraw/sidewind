import { BindState, DirectiveParameters, ExtendedHTMLElement } from "../types";
import { getValues } from "../utils";

// TODO: Communicate somehow this should be evaluated after value directive
// -> dependency declaration
function closestDirective({
  element,
  expression,
  evaluate,
  setState,
}: DirectiveParameters) {
  const { state } = evaluate(expression);
  const key = Object.keys(state)[0];
  const evaluateValue = () =>
    evaluateClosestValue(element, evaluate(expression).state, key, setState);

  window.addEventListener("scroll", evaluateValue);

  evaluateValue();
}

function evaluateClosestValue(
  closestContainer: ExtendedHTMLElement,
  closestState: BindState,
  key: string,
  setState: DirectiveParameters["setState"]
) {
  const elements = Array.from(getValues(closestState, key)[key]).map(value => {
    const element = value as HTMLElement;
    const { top } = element.getBoundingClientRect();

    return {
      element,
      top,
    };
  });

  if (!elements || elements.length < 1) {
    return;
  }

  const closest = elements.reduce((a, b) =>
    Math.abs(a.top) < Math.abs(b.top) ? a : b
  );

  setState({ [key]: closest.element }, { element: closestContainer });
}

export default closestDirective;
