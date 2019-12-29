const fs = require("fs");
const path = require("path");
const temp = require("temp");
const { highlightAuto } = require("highlight.js");
const showdown = require("showdown");
const decodeHTML = require("html-encoder-decoder").decode;
const webpack = require("webpack");
const merge = require("webpack-merge");
const CopyPlugin = require("copy-webpack-plugin");
const MiniHtmlWebpackPlugin = require("mini-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgeCSSPlugin = require("purgecss-webpack-plugin");

const PATHS = {
  ASSETS: path.resolve(__dirname, "assets"),
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
    new CopyPlugin([{ from: PATHS.ASSETS, to: "assets" }]),
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

        return getHTML({ title, htmlAttrs, cssTags, jsTags });
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
          const example = decodeHTML(match);
          const code = left + highlightAuto(example).value + right;

          return `<section data-state="'code'">
  <nav class="flex flex-row justify-between">
    <div
      class="p-2 w-full"
      data-btn-muted="state !== 'code'"
      data-bg-gray-200="state === 'code'"
      onclick="setState(this, 'code')"
    >
      Code
    </div>
    <div
      class="p-2 w-full"
      data-btn-muted="state !== 'example'"
      data-bg-gray-200="state === 'example'"
      onclick="setState(this, 'example')"
    >
      Example
    </div>
  </nav>
  <div class="bg-gray-100 p-2">
    <div data-hidden="state !== 'code'">${code}</div>
    <div data-hidden="state !== 'example'">${example}</div>
  </div>
</section>`;
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
          new AddDependencyPlugin({
            path: path.join(__dirname, "./README.md"),
          }),
          new webpack.HotModuleReplacementPlugin(),
        ],
      });
    }
    case "production": {
      const fileStream = temp.createWriteStream();
      fileStream.write(getHTML());
      fileStream.end();

      return merge(commonConfig, {
        mode,
        plugins: [
          new PurgeCSSPlugin({
            paths: [fileStream.path],
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

function getHTML({
  title = "",
  htmlAttrs = "",
  cssTags = "",
  jsTags = "",
} = {}) {
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
}
