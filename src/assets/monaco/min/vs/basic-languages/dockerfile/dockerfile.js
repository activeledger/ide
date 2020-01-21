/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * monaco-languages version: 1.2.0(6f34b63e4006c357717a7639a1c6f0ea3cf68333)
 * Released under the MIT license
 * https://github.com/Microsoft/monaco-languages/blob/master/LICENSE.md
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/dockerfile/dockerfile", [
  "require",
  "exports"
], function(e, s) {
  "use strict";
  Object.defineProperty(s, "__esModule", { value: !0 }),
    (s.conf = {
      brackets: [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"]
      ],
      autoClosingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" }
      ],
      surroundingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" }
      ]
    }),
    (s.language = {
      defaultToken: "",
      tokenPostfix: ".dockerfile",
      instructions: /FROM|MAINTAINER|RUN|EXPOSE|ENV|ADD|ARG|VOLUME|LABEL|USER|WORKDIR|COPY|CMD|STOPSIGNAL|SHELL|HEALTHCHECK|ENTRYPOINT/,
      instructionAfter: /ONBUILD/,
      variableAfter: /ENV/,
      variable: /\${?[\w]+}?/,
      tokenizer: {
        root: [
          { include: "@whitespace" },
          { include: "@comment" },
          [
            /(@instructionAfter)(\s+)/,
            ["keyword", { token: "", next: "@instructions" }]
          ],
          ["", "keyword", "@instructions"]
        ],
        instructions: [
          [
            /(@variableAfter)(\s+)([\w]+)/,
            ["keyword", "", { token: "variable", next: "@arguments" }]
          ],
          [/(@instructions)/, "keyword", "@arguments"]
        ],
        arguments: [
          { include: "@whitespace" },
          { include: "@strings" },
          [
            /(@variable)/,
            {
              cases: {
                "@eos": { token: "variable", next: "@popall" },
                "@default": "variable"
              }
            }
          ],
          [/\\/, { cases: { "@eos": "", "@default": "" } }],
          [
            /./,
            {
              cases: { "@eos": { token: "", next: "@popall" }, "@default": "" }
            }
          ]
        ],
        whitespace: [
          [
            /\s+/,
            {
              cases: { "@eos": { token: "", next: "@popall" }, "@default": "" }
            }
          ]
        ],
        comment: [[/(^#.*$)/, "comment", "@popall"]],
        strings: [
          [/'$/, "string", "@popall"],
          [/'/, "string", "@stringBody"],
          [/"$/, "string", "@popall"],
          [/"/, "string", "@dblStringBody"]
        ],
        stringBody: [
          [
            /[^\\\$']/,
            {
              cases: {
                "@eos": { token: "string", next: "@popall" },
                "@default": "string"
              }
            }
          ],
          [/\\./, "string.escape"],
          [/'$/, "string", "@popall"],
          [/'/, "string", "@pop"],
          [/(@variable)/, "variable"],
          [/\\$/, "string"],
          [/$/, "string", "@popall"]
        ],
        dblStringBody: [
          [
            /[^\\\$"]/,
            {
              cases: {
                "@eos": { token: "string", next: "@popall" },
                "@default": "string"
              }
            }
          ],
          [/\\./, "string.escape"],
          [/"$/, "string", "@popall"],
          [/"/, "string", "@pop"],
          [/(@variable)/, "variable"],
          [/\\$/, "string"],
          [/$/, "string", "@popall"]
        ]
      }
    });
});