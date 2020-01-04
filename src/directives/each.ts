import { BindState, ExtendedHTMLElement } from "../types";
import evaluateValues from "./values";

type StringObject = { [id: string]: any };

function evaluateEach(eachContainers: NodeListOf<ExtendedHTMLElement>) {
  for (let i = eachContainers.length; i--; ) {
    const eachContainer = eachContainers[i];
    const { state }: { state: BindState } = eachContainer.closest(
      "[x-state]"
    ) as ExtendedHTMLElement;

    if (state) {
      const containerParent = eachContainer.parentNode;
      const dataGetters = parseDataGetters(
        eachContainer.getAttribute("x-each") || ""
      );

      if (!containerParent) {
        return;
      }

      // It would be better to diff for changes instead of replacing
      // all nodes.
      while (containerParent.firstChild) {
        containerParent.firstChild.remove();
      }
      containerParent.appendChild(eachContainer);

      if (Array.isArray(state)) {
        state.forEach((item: BindState) => {
          const templateClone = document.importNode(
            eachContainer.content,
            true
          );

          evaluateValues(templateClone, getValues(item, dataGetters), "x-bind");

          containerParent.appendChild(templateClone);
        });
      } else {
        Object.values(getValues(state, dataGetters)).forEach(values =>
          values.forEach((value: any) => {
            const templateClone = document.importNode(
              eachContainer.content,
              true
            );

            evaluateValues(templateClone, value, "x-bind");

            containerParent.appendChild(templateClone);
          })
        );
      }
    }
  }
}

function parseDataGetters(pattern: string) {
  return pattern.split(",").map(part => part.trim());
}

function getValues(data: BindState, getters: string[]): StringObject {
  const ret: StringObject = {};

  getters.forEach(getter => {
    ret[getter] = data[getter];
  });

  return ret;
}

export default evaluateEach;
