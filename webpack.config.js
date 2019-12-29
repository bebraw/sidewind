const fs = require("fs");
const path = require("path");
const { highlightAuto } = require("highlight.js");
const showdown = require("showdown");
const decodeHTML = require("html-encoder-decoder").decode;
const webpack = require("webpack");
const merge = require("webpack-merge");
const MiniHtmlWebpackPlugin = require("mini-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgeCSSPlugin = require("purgecss-webpack-plugin");

const PATHS = {
  DEMO: path.resolve(__dirname, "demo"),
};

const commonConfig = merge({
  entry: PATHS.DEMO,
  module: {
    rules: [
      {
        test: /\.js$/,
        include: PATHS.DEMO,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(css|pcss)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new MiniHtmlWebpackPlugin({
      filename: "index.html",
      publicPath: "/",
      context: {
        title: "Sidewind",
        htmlAttributes: { lang: "en" },
      },
      template: ({
        css,
        js,
        publicPath,
        title,
        htmlAttributes,
        cssAttributes,
        jsAttributes,
      }) => {
        const {
          generateAttributes,
          generateCSSReferences,
          generateJSReferences,
        } = MiniHtmlWebpackPlugin;
        const htmlAttrs = generateAttributes(htmlAttributes);

        const cssTags = generateCSSReferences({
          files: css,
          attributes: cssAttributes,
          publicPath,
        });

        const jsTags = generateJSReferences({
          files: js,
          attributes: jsAttributes,
          publicPath,
        });

        // TODO: Load markdown here
        return `<!DOCTYPE html>
        <html${htmlAttrs}>
          <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            ${cssTags}
          </head>
          <body>
            <main class="container mx-auto p-8">
              ${processMarkdown(
                fs.readFileSync("./README.md", { encoding: "utf-8" })
              )}
            </main>
            ${jsTags}
          </body>
        </html>`;
      },
    }),
  ],
});

function processMarkdown(input) {
  const classMap = {};
  const bindings = Object.keys(classMap).map(key => ({
    type: "output",
    regex: new RegExp(`<${key}(.*)>`, "g"),
    replace: `<${key} class="${classMap[key]}" $1>`,
  }));
  const convert = new showdown.Converter({
    extensions: [...bindings, expandCode()],
  });

  // TODO: Deal with the code sections
  return convert.makeHtml(input);
}

function expandCode() {
  return {
    type: "output",
    filter(text) {
      let left = "<pre><code\\b[^>]*>",
        right = "</code></pre>",
        flags = "g",
        replacement = (_, match, left, right) => {
          const decodedMatch = decodeHTML(match);

          // TODO: Generate code for tabs now
          return (
            left + highlightAuto(decodedMatch).value + right + decodedMatch
          );
        };
      return showdown.helper.replaceRecursiveRegExp(
        text,
        replacement,
        left,
        right,
        flags
      );
    },
  };
}

class AddDependencyPlugin {
  constructor(options = {}) {
    this.options = options;
    this.plugin = this.plugin.bind(this);
  }

  plugin(compilation, callback) {
    const { path } = this.options;

    compilation.fileDependencies.add(path);

    callback();
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync("AddDependencyPlugin", this.plugin);
  }
}

module.exports = mode => {
  switch (mode) {
    case "development": {
      return merge(commonConfig, {
        mode,
        plugins: [
          new AddDependencyPlugin({ path: "./README.md" }),
          new webpack.HotModuleReplacementPlugin(),
        ],
      });
    }
    case "production": {
      return merge(commonConfig, {
        mode,
        plugins: [
          new PurgeCSSPlugin({
            paths: ["./index.html"],
            extractors: [
              {
                extractor: class TailwindExtractor {
                  static extract(content) {
                    return content.match(/[A-Za-z0-9-_:/]+/g) || [];
                  }
                },
                extensions: ["html"],
              },
            ],
          }),
        ],
      });
    }
  }
};
