/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * monaco-json version: 2.1.0(427abfc518aba22b38705f2484e3b50662ea3166)
 * Released under the MIT license
 * https://github.com/Microsoft/monaco-json/blob/master/LICENSE.md
 *-----------------------------------------------------------------------------*/
!(function(e) {
  if ("object" == typeof module && "object" == typeof module.exports) {
    var t = e(require, exports);
    void 0 !== t && (module.exports = t);
  } else
    "function" == typeof define &&
      define.amd &&
      define("vscode-languageserver-types/main", ["require", "exports"], e);
})(function(e, t) {
  "use strict";
  var a, r, n, i, o, s, u, c, l, f, p, h, d;
  Object.defineProperty(t, "__esModule", { value: !0 }),
    ((r = a = t.Position || (t.Position = {})).create = function(e, t) {
      return { line: e, character: t };
    }),
    (r.is = function(e) {
      var t = e;
      return V.defined(t) && V.number(t.line) && V.number(t.character);
    }),
    ((i = n = t.Range || (t.Range = {})).create = function(e, t, r, n) {
      if (V.number(e) && V.number(t) && V.number(r) && V.number(n))
        return { start: a.create(e, t), end: a.create(r, n) };
      if (a.is(e) && a.is(t)) return { start: e, end: t };
      throw new Error(
        "Range#create called with invalid arguments[" +
          e +
          ", " +
          t +
          ", " +
          r +
          ", " +
          n +
          "]"
      );
    }),
    (i.is = function(e) {
      var t = e;
      return V.defined(t) && a.is(t.start) && a.is(t.end);
    }),
    ((o = t.Location || (t.Location = {})).create = function(e, t) {
      return { uri: e, range: t };
    }),
    (o.is = function(e) {
      var t = e;
      return (
        V.defined(t) && n.is(t.range) && (V.string(t.uri) || V.undefined(t.uri))
      );
    }),
    ((s = t.DiagnosticSeverity || (t.DiagnosticSeverity = {})).Error = 1),
    (s.Warning = 2),
    (s.Information = 3),
    (s.Hint = 4),
    ((c = u = t.Diagnostic || (t.Diagnostic = {})).create = function(
      e,
      t,
      r,
      n,
      i
    ) {
      var o = { range: e, message: t };
      return (
        V.defined(r) && (o.severity = r),
        V.defined(n) && (o.code = n),
        V.defined(i) && (o.source = i),
        o
      );
    }),
    (c.is = function(e) {
      var t = e;
      return (
        V.defined(t) &&
        n.is(t.range) &&
        V.string(t.message) &&
        (V.number(t.severity) || V.undefined(t.severity)) &&
        (V.number(t.code) || V.string(t.code) || V.undefined(t.code)) &&
        (V.string(t.source) || V.undefined(t.source))
      );
    }),
    ((f = l = t.Command || (t.Command = {})).create = function(e, t) {
      for (var r = [], n = 2; n < arguments.length; n++)
        r[n - 2] = arguments[n];
      var i = { title: e, command: t };
      return V.defined(r) && 0 < r.length && (i.arguments = r), i;
    }),
    (f.is = function(e) {
      var t = e;
      return V.defined(t) && V.string(t.title) && V.string(t.title);
    }),
    ((h = p = t.TextEdit || (t.TextEdit = {})).replace = function(e, t) {
      return { range: e, newText: t };
    }),
    (h.insert = function(e, t) {
      return { range: { start: e, end: e }, newText: t };
    }),
    (h.del = function(e) {
      return { range: e, newText: "" };
    }),
    ((d = t.TextDocumentEdit || (t.TextDocumentEdit = {})).create = function(
      e,
      t
    ) {
      return { textDocument: e, edits: t };
    }),
    (d.is = function(e) {
      var t = e;
      return V.defined(t) && g.is(t.textDocument) && Array.isArray(t.edits);
    });
  var m,
    g,
    v,
    y,
    b,
    x,
    S,
    j,
    O,
    T,
    C,
    A,
    k = (function() {
      function e(e) {
        this.edits = e;
      }
      return (
        (e.prototype.insert = function(e, t) {
          this.edits.push(p.insert(e, t));
        }),
        (e.prototype.replace = function(e, t) {
          this.edits.push(p.replace(e, t));
        }),
        (e.prototype.delete = function(e) {
          this.edits.push(p.del(e));
        }),
        (e.prototype.add = function(e) {
          this.edits.push(e);
        }),
        (e.prototype.all = function() {
          return this.edits;
        }),
        (e.prototype.clear = function() {
          this.edits.splice(0, this.edits.length);
        }),
        e
      );
    })(),
    E = (function() {
      function e(r) {
        var n = this;
        (this._textEditChanges = Object.create(null)),
          r &&
            ((this._workspaceEdit = r).documentChanges
              ? r.documentChanges.forEach(function(e) {
                  var t = new k(e.edits);
                  n._textEditChanges[e.textDocument.uri] = t;
                })
              : r.changes &&
                Object.keys(r.changes).forEach(function(e) {
                  var t = new k(r.changes[e]);
                  n._textEditChanges[e] = t;
                }));
      }
      return (
        Object.defineProperty(e.prototype, "edit", {
          get: function() {
            return this._workspaceEdit;
          },
          enumerable: !0,
          configurable: !0
        }),
        (e.prototype.getTextEditChange = function(e) {
          if (g.is(e)) {
            if (
              (this._workspaceEdit ||
                (this._workspaceEdit = { documentChanges: [] }),
              !this._workspaceEdit.documentChanges)
            )
              throw new Error(
                "Workspace edit is not configured for versioned document changes."
              );
            var t = e;
            if (!(n = this._textEditChanges[t.uri])) {
              var r = { textDocument: t, edits: (i = []) };
              this._workspaceEdit.documentChanges.push(r),
                (n = new k(i)),
                (this._textEditChanges[t.uri] = n);
            }
            return n;
          }
          if (
            (this._workspaceEdit ||
              (this._workspaceEdit = { changes: Object.create(null) }),
            !this._workspaceEdit.changes)
          )
            throw new Error(
              "Workspace edit is not configured for normal text edit changes."
            );
          var n;
          if (!(n = this._textEditChanges[e])) {
            var i = [];
            (this._workspaceEdit.changes[e] = i),
              (n = new k(i)),
              (this._textEditChanges[e] = n);
          }
          return n;
        }),
        e
      );
    })();
  (t.WorkspaceChange = E),
    ((m =
      t.TextDocumentIdentifier ||
      (t.TextDocumentIdentifier = {})).create = function(e) {
      return { uri: e };
    }),
    (m.is = function(e) {
      var t = e;
      return V.defined(t) && V.string(t.uri);
    }),
    ((v = g =
      t.VersionedTextDocumentIdentifier ||
      (t.VersionedTextDocumentIdentifier = {})).create = function(e, t) {
      return { uri: e, version: t };
    }),
    (v.is = function(e) {
      var t = e;
      return V.defined(t) && V.string(t.uri) && V.number(t.version);
    }),
    ((y = t.TextDocumentItem || (t.TextDocumentItem = {})).create = function(
      e,
      t,
      r,
      n
    ) {
      return { uri: e, languageId: t, version: r, text: n };
    }),
    (y.is = function(e) {
      var t = e;
      return (
        V.defined(t) &&
        V.string(t.uri) &&
        V.string(t.languageId) &&
        V.number(t.version) &&
        V.string(t.text)
      );
    }),
    ((b = t.MarkupKind || (t.MarkupKind = {})).PlainText = "plaintext"),
    (b.Markdown = "markdown"),
    ((x = t.CompletionItemKind || (t.CompletionItemKind = {})).Text = 1),
    (x.Method = 2),
    (x.Function = 3),
    (x.Constructor = 4),
    (x.Field = 5),
    (x.Variable = 6),
    (x.Class = 7),
    (x.Interface = 8),
    (x.Module = 9),
    (x.Property = 10),
    (x.Unit = 11),
    (x.Value = 12),
    (x.Enum = 13),
    (x.Keyword = 14),
    (x.Snippet = 15),
    (x.Color = 16),
    (x.File = 17),
    (x.Reference = 18),
    (x.Folder = 19),
    (x.EnumMember = 20),
    (x.Constant = 21),
    (x.Struct = 22),
    (x.Event = 23),
    (x.Operator = 24),
    (x.TypeParameter = 25),
    ((S = t.InsertTextFormat || (t.InsertTextFormat = {})).PlainText = 1),
    (S.Snippet = 2),
    ((t.CompletionItem || (t.CompletionItem = {})).create = function(e) {
      return { label: e };
    }),
    ((t.CompletionList || (t.CompletionList = {})).create = function(e, t) {
      return { items: e || [], isIncomplete: !!t };
    }),
    ((t.MarkedString || (t.MarkedString = {})).fromPlainText = function(e) {
      return e.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
    }),
    ((
      t.ParameterInformation || (t.ParameterInformation = {})
    ).create = function(e, t) {
      return t ? { label: e, documentation: t } : { label: e };
    }),
    ((
      t.SignatureInformation || (t.SignatureInformation = {})
    ).create = function(e, t) {
      for (var r = [], n = 2; n < arguments.length; n++)
        r[n - 2] = arguments[n];
      var i = { label: e };
      return (
        V.defined(t) && (i.documentation = t),
        V.defined(r) ? (i.parameters = r) : (i.parameters = []),
        i
      );
    }),
    ((j = t.DocumentHighlightKind || (t.DocumentHighlightKind = {})).Text = 1),
    (j.Read = 2),
    (j.Write = 3),
    ((t.DocumentHighlight || (t.DocumentHighlight = {})).create = function(
      e,
      t
    ) {
      var r = { range: e };
      return V.number(t) && (r.kind = t), r;
    }),
    ((O = t.SymbolKind || (t.SymbolKind = {})).File = 1),
    (O.Module = 2),
    (O.Namespace = 3),
    (O.Package = 4),
    (O.Class = 5),
    (O.Method = 6),
    (O.Property = 7),
    (O.Field = 8),
    (O.Constructor = 9),
    (O.Enum = 10),
    (O.Interface = 11),
    (O.Function = 12),
    (O.Variable = 13),
    (O.Constant = 14),
    (O.String = 15),
    (O.Number = 16),
    (O.Boolean = 17),
    (O.Array = 18),
    (O.Object = 19),
    (O.Key = 20),
    (O.Null = 21),
    (O.EnumMember = 22),
    (O.Struct = 23),
    (O.Event = 24),
    (O.Operator = 25),
    (O.TypeParameter = 26),
    ((t.SymbolInformation || (t.SymbolInformation = {})).create = function(
      e,
      t,
      r,
      n,
      i
    ) {
      var o = { name: e, kind: t, location: { uri: n, range: r } };
      return i && (o.containerName = i), o;
    }),
    ((T = t.CodeActionContext || (t.CodeActionContext = {})).create = function(
      e
    ) {
      return { diagnostics: e };
    }),
    (T.is = function(e) {
      var t = e;
      return V.defined(t) && V.typedArray(t.diagnostics, u.is);
    }),
    ((C = t.CodeLens || (t.CodeLens = {})).create = function(e, t) {
      var r = { range: e };
      return V.defined(t) && (r.data = t), r;
    }),
    (C.is = function(e) {
      var t = e;
      return (
        V.defined(t) &&
        n.is(t.range) &&
        (V.undefined(t.command) || l.is(t.command))
      );
    }),
    ((A = t.FormattingOptions || (t.FormattingOptions = {})).create = function(
      e,
      t
    ) {
      return { tabSize: e, insertSpaces: t };
    }),
    (A.is = function(e) {
      var t = e;
      return V.defined(t) && V.number(t.tabSize) && V.boolean(t.insertSpaces);
    });
  var I,
    P,
    _,
    w = function() {};
  (t.DocumentLink = w),
    ((I = w = t.DocumentLink || (t.DocumentLink = {})).create = function(e, t) {
      return { range: e, target: t };
    }),
    (I.is = function(e) {
      var t = e;
      return (
        V.defined(t) &&
        n.is(t.range) &&
        (V.undefined(t.target) || V.string(t.target))
      );
    }),
    (t.DocumentLink = w),
    (t.EOL = ["\n", "\r\n", "\r"]),
    ((P = t.TextDocument || (t.TextDocument = {})).create = function(
      e,
      t,
      r,
      n
    ) {
      return new N(e, t, r, n);
    }),
    (P.is = function(e) {
      var t = e;
      return !!(
        V.defined(t) &&
        V.string(t.uri) &&
        (V.undefined(t.languageId) || V.string(t.languageId)) &&
        V.number(t.lineCount) &&
        V.func(t.getText) &&
        V.func(t.positionAt) &&
        V.func(t.offsetAt)
      );
    }),
    (P.applyEdits = function(e, t) {
      for (
        var r = e.getText(),
          n = (function e(t, r) {
            if (t.length <= 1) return t;
            var n = (t.length / 2) | 0,
              i = t.slice(0, n),
              o = t.slice(n);
            e(i, r), e(o, r);
            for (var a = 0, s = 0, u = 0; a < i.length && s < o.length; ) {
              var c = r(i[a], o[s]);
              t[u++] = c <= 0 ? i[a++] : o[s++];
            }
            for (; a < i.length; ) t[u++] = i[a++];
            for (; s < o.length; ) t[u++] = o[s++];
            return t;
          })(t, function(e, t) {
            return 0 == e.range.start.line - t.range.start.line
              ? e.range.start.character - t.range.start.character
              : 0;
          }),
          i = r.length,
          o = n.length - 1;
        0 <= o;
        o--
      ) {
        var a = n[o],
          s = e.offsetAt(a.range.start),
          u = e.offsetAt(a.range.end);
        if (!(u <= i)) throw new Error("Ovelapping edit");
        (r = r.substring(0, s) + a.newText + r.substring(u, r.length)), (i = s);
      }
      return r;
    }),
    ((_ =
      t.TextDocumentSaveReason || (t.TextDocumentSaveReason = {})).Manual = 1),
    (_.AfterDelay = 2),
    (_.FocusOut = 3);
  var V,
    M,
    F,
    N = (function() {
      function e(e, t, r, n) {
        (this._uri = e),
          (this._languageId = t),
          (this._version = r),
          (this._content = n),
          (this._lineOffsets = null);
      }
      return (
        Object.defineProperty(e.prototype, "uri", {
          get: function() {
            return this._uri;
          },
          enumerable: !0,
          configurable: !0
        }),
        Object.defineProperty(e.prototype, "languageId", {
          get: function() {
            return this._languageId;
          },
          enumerable: !0,
          configurable: !0
        }),
        Object.defineProperty(e.prototype, "version", {
          get: function() {
            return this._version;
          },
          enumerable: !0,
          configurable: !0
        }),
        (e.prototype.getText = function(e) {
          if (e) {
            var t = this.offsetAt(e.start),
              r = this.offsetAt(e.end);
            return this._content.substring(t, r);
          }
          return this._content;
        }),
        (e.prototype.update = function(e, t) {
          (this._content = e.text),
            (this._version = t),
            (this._lineOffsets = null);
        }),
        (e.prototype.getLineOffsets = function() {
          if (null === this._lineOffsets) {
            for (
              var e = [], t = this._content, r = !0, n = 0;
              n < t.length;
              n++
            ) {
              r && (e.push(n), (r = !1));
              var i = t.charAt(n);
              (r = "\r" === i || "\n" === i),
                "\r" === i &&
                  n + 1 < t.length &&
                  "\n" === t.charAt(n + 1) &&
                  n++;
            }
            r && 0 < t.length && e.push(t.length), (this._lineOffsets = e);
          }
          return this._lineOffsets;
        }),
        (e.prototype.positionAt = function(e) {
          e = Math.max(Math.min(e, this._content.length), 0);
          var t = this.getLineOffsets(),
            r = 0,
            n = t.length;
          if (0 === n) return a.create(0, e);
          for (; r < n; ) {
            var i = Math.floor((r + n) / 2);
            t[i] > e ? (n = i) : (r = i + 1);
          }
          var o = r - 1;
          return a.create(o, e - t[o]);
        }),
        (e.prototype.offsetAt = function(e) {
          var t = this.getLineOffsets();
          if (e.line >= t.length) return this._content.length;
          if (e.line < 0) return 0;
          var r = t[e.line],
            n = e.line + 1 < t.length ? t[e.line + 1] : this._content.length;
          return Math.max(Math.min(r + e.character, n), r);
        }),
        Object.defineProperty(e.prototype, "lineCount", {
          get: function() {
            return this.getLineOffsets().length;
          },
          enumerable: !0,
          configurable: !0
        }),
        e
      );
    })();
  (M = V || (V = {})),
    (F = Object.prototype.toString),
    (M.defined = function(e) {
      return void 0 !== e;
    }),
    (M.undefined = function(e) {
      return void 0 === e;
    }),
    (M.boolean = function(e) {
      return !0 === e || !1 === e;
    }),
    (M.string = function(e) {
      return "[object String]" === F.call(e);
    }),
    (M.number = function(e) {
      return "[object Number]" === F.call(e);
    }),
    (M.func = function(e) {
      return "[object Function]" === F.call(e);
    }),
    (M.typedArray = function(e, t) {
      return Array.isArray(e) && e.every(t);
    });
}),
  define("vscode-languageserver-types", [
    "vscode-languageserver-types/main"
  ], function(e) {
    return e;
  }),
  (function(e) {
    if ("object" == typeof module && "object" == typeof module.exports) {
      var t = e(require, exports);
      void 0 !== t && (module.exports = t);
    } else
      "function" == typeof define &&
        define.amd &&
        define("jsonc-parser/impl/scanner", ["require", "exports"], e);
  })(function(e, t) {
    "use strict";
    function p(e) {
      return (
        32 === e ||
        9 === e ||
        11 === e ||
        12 === e ||
        160 === e ||
        5760 === e ||
        (8192 <= e && e <= 8203) ||
        8239 === e ||
        8287 === e ||
        12288 === e ||
        65279 === e
      );
    }
    function h(e) {
      return 10 === e || 13 === e || 8232 === e || 8233 === e;
    }
    function d(e) {
      return 48 <= e && e <= 57;
    }
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.createScanner = function(o, e) {
        void 0 === e && (e = !1);
        var a = 0,
          i = o.length,
          n = "",
          s = 0,
          u = 16,
          c = 0;
        function l(e, t) {
          for (var r = 0, n = 0; r < e || !t; ) {
            var i = o.charCodeAt(a);
            if (48 <= i && i <= 57) n = 16 * n + i - 48;
            else if (65 <= i && i <= 70) n = 16 * n + i - 65 + 10;
            else {
              if (!(97 <= i && i <= 102)) break;
              n = 16 * n + i - 97 + 10;
            }
            a++, r++;
          }
          return r < e && (n = -1), n;
        }
        function t() {
          if (((n = ""), (c = 0), i <= (s = a))) return (s = i), (u = 17);
          var e = o.charCodeAt(a);
          if (p(e)) {
            for (
              ;
              a++, (n += String.fromCharCode(e)), p((e = o.charCodeAt(a)));

            );
            return (u = 15);
          }
          if (h(e))
            return (
              a++,
              (n += String.fromCharCode(e)),
              13 === e && 10 === o.charCodeAt(a) && (a++, (n += "\n")),
              (u = 14)
            );
          switch (e) {
            case 123:
              return a++, (u = 1);
            case 125:
              return a++, (u = 2);
            case 91:
              return a++, (u = 3);
            case 93:
              return a++, (u = 4);
            case 58:
              return a++, (u = 6);
            case 44:
              return a++, (u = 5);
            case 34:
              return (
                a++,
                (n = (function() {
                  for (var e = "", t = a; ; ) {
                    if (i <= a) {
                      (e += o.substring(t, a)), (c = 2);
                      break;
                    }
                    var r = o.charCodeAt(a);
                    if (34 === r) {
                      (e += o.substring(t, a)), a++;
                      break;
                    }
                    if (92 !== r) {
                      if (0 <= r && r <= 31) {
                        if (h(r)) {
                          (e += o.substring(t, a)), (c = 2);
                          break;
                        }
                        c = 6;
                      }
                      a++;
                    } else {
                      if (((e += o.substring(t, a)), i <= ++a)) {
                        c = 2;
                        break;
                      }
                      switch ((r = o.charCodeAt(a++))) {
                        case 34:
                          e += '"';
                          break;
                        case 92:
                          e += "\\";
                          break;
                        case 47:
                          e += "/";
                          break;
                        case 98:
                          e += "\b";
                          break;
                        case 102:
                          e += "\f";
                          break;
                        case 110:
                          e += "\n";
                          break;
                        case 114:
                          e += "\r";
                          break;
                        case 116:
                          e += "\t";
                          break;
                        case 117:
                          var n = l(4, !0);
                          0 <= n ? (e += String.fromCharCode(n)) : (c = 4);
                          break;
                        default:
                          c = 5;
                      }
                      t = a;
                    }
                  }
                  return e;
                })()),
                (u = 10)
              );
            case 47:
              var t = a - 1;
              if (47 === o.charCodeAt(a + 1)) {
                for (a += 2; a < i && !h(o.charCodeAt(a)); ) a++;
                return (n = o.substring(t, a)), (u = 12);
              }
              if (42 === o.charCodeAt(a + 1)) {
                a += 2;
                for (var r = !1; a < i; ) {
                  if (
                    42 === o.charCodeAt(a) &&
                    a + 1 < i &&
                    47 === o.charCodeAt(a + 1)
                  ) {
                    (a += 2), (r = !0);
                    break;
                  }
                  a++;
                }
                return r || (a++, (c = 1)), (n = o.substring(t, a)), (u = 13);
              }
              return (n += String.fromCharCode(e)), a++, (u = 16);
            case 45:
              if (
                ((n += String.fromCharCode(e)),
                ++a === i || !d(o.charCodeAt(a)))
              )
                return (u = 16);
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
              return (
                (n += (function() {
                  var e = a;
                  if (48 === o.charCodeAt(a)) a++;
                  else for (a++; a < o.length && d(o.charCodeAt(a)); ) a++;
                  if (a < o.length && 46 === o.charCodeAt(a)) {
                    if (!(++a < o.length && d(o.charCodeAt(a))))
                      return (c = 3), o.substring(e, a);
                    for (a++; a < o.length && d(o.charCodeAt(a)); ) a++;
                  }
                  var t = a;
                  if (
                    a < o.length &&
                    (69 === o.charCodeAt(a) || 101 === o.charCodeAt(a))
                  )
                    if (
                      (((++a < o.length && 43 === o.charCodeAt(a)) ||
                        45 === o.charCodeAt(a)) &&
                        a++,
                      a < o.length && d(o.charCodeAt(a)))
                    ) {
                      for (a++; a < o.length && d(o.charCodeAt(a)); ) a++;
                      t = a;
                    } else c = 3;
                  return o.substring(e, t);
                })()),
                (u = 11)
              );
            default:
              for (; a < i && f(e); ) a++, (e = o.charCodeAt(a));
              if (s !== a) {
                switch ((n = o.substring(s, a))) {
                  case "true":
                    return (u = 8);
                  case "false":
                    return (u = 9);
                  case "null":
                    return (u = 7);
                }
                return (u = 16);
              }
              return (n += String.fromCharCode(e)), a++, (u = 16);
          }
        }
        function f(e) {
          if (p(e) || h(e)) return !1;
          switch (e) {
            case 125:
            case 93:
            case 123:
            case 91:
            case 34:
            case 58:
            case 44:
              return !1;
          }
          return !0;
        }
        return {
          setPosition: function(e) {
            (a = e), (n = ""), (u = 16), (c = s = 0);
          },
          getPosition: function() {
            return a;
          },
          scan: e
            ? function() {
                for (var e; 12 <= (e = t()) && e <= 15; );
                return e;
              }
            : t,
          getToken: function() {
            return u;
          },
          getTokenValue: function() {
            return n;
          },
          getTokenOffset: function() {
            return s;
          },
          getTokenLength: function() {
            return a - s;
          },
          getTokenError: function() {
            return c;
          }
        };
      });
  }),
  (function(e) {
    if ("object" == typeof module && "object" == typeof module.exports) {
      var t = e(require, exports);
      void 0 !== t && (module.exports = t);
    } else
      "function" == typeof define &&
        define.amd &&
        define("jsonc-parser/impl/format", [
          "require",
          "exports",
          "./scanner"
        ], e);
  })(function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var T = e("./scanner");
    function C(e, t) {
      for (var r = "", n = 0; n < t; n++) r += e;
      return r;
    }
    function A(e, t) {
      return -1 !== "\r\n".indexOf(e.charAt(t));
    }
    (t.format = function(n, e, t) {
      var r, i, o, a, s;
      if (e) {
        for (a = e.offset, s = a + e.length, o = a; 0 < o && !A(n, o - 1); )
          o--;
        for (var u = s; u < n.length && !A(n, u); ) u++;
        (i = n.substring(o, u)),
          (r = (function(e, t, r) {
            for (var n = 0, i = 0, o = r.tabSize || 4; n < e.length; ) {
              var a = e.charAt(n);
              if (" " === a) i++;
              else {
                if ("\t" !== a) break;
                i += o;
              }
              n++;
            }
            return Math.floor(i / o);
          })(i, 0, t));
      } else (a = o = r = 0), (s = (i = n).length);
      var c,
        l = (function(e, t) {
          for (var r = 0; r < t.length; r++) {
            var n = t.charAt(r);
            if ("\r" === n)
              return r + 1 < t.length && "\n" === t.charAt(r + 1)
                ? "\r\n"
                : "\r";
            if ("\n" === n) return "\n";
          }
          return (e && e.eol) || "\n";
        })(t, n),
        f = !1,
        p = 0;
      c = t.insertSpaces ? C(" ", t.tabSize || 4) : "\t";
      var h = T.createScanner(i, !1),
        d = !1;
      function m() {
        return l + C(c, r + p);
      }
      function g() {
        var e = h.scan();
        for (f = !1; 15 === e || 14 === e; )
          (f = f || 14 === e), (e = h.scan());
        return (d = 16 === e || 0 !== h.getTokenError()), e;
      }
      var v = [];
      function y(e, t, r) {
        !d &&
          t < s &&
          a < r &&
          n.substring(t, r) !== e &&
          v.push({ offset: t, length: r - t, content: e });
      }
      var b = g();
      if (17 !== b) {
        var x = h.getTokenOffset() + o;
        y(C(c, r), o, x);
      }
      for (; 17 !== b; ) {
        for (
          var S = h.getTokenOffset() + h.getTokenLength() + o, j = g(), O = "";
          !f && (12 === j || 13 === j);

        )
          y(" ", S, h.getTokenOffset() + o),
            (S = h.getTokenOffset() + h.getTokenLength() + o),
            (O = 12 === j ? m() : ""),
            (j = g());
        if (2 === j) 1 !== b && (p--, (O = m()));
        else if (4 === j) 3 !== b && (p--, (O = m()));
        else {
          switch (b) {
            case 3:
            case 1:
              p++, (O = m());
              break;
            case 5:
            case 12:
              O = m();
              break;
            case 13:
              O = f ? m() : " ";
              break;
            case 6:
              O = " ";
              break;
            case 10:
              if (6 === j) {
                O = "";
                break;
              }
            case 7:
            case 8:
            case 9:
            case 11:
            case 2:
            case 4:
              12 === j || 13 === j
                ? (O = " ")
                : 5 !== j && 17 !== j && (d = !0);
              break;
            case 16:
              d = !0;
          }
          !f || (12 !== j && 13 !== j) || (O = m());
        }
        y(O, S, h.getTokenOffset() + o), (b = j);
      }
      return v;
    }),
      (t.isEOL = A);
  }),
  (function(e) {
    if ("object" == typeof module && "object" == typeof module.exports) {
      var t = e(require, exports);
      void 0 !== t && (module.exports = t);
    } else
      "function" == typeof define &&
        define.amd &&
        define("jsonc-parser/impl/parser", [
          "require",
          "exports",
          "./scanner"
        ], e);
  })(function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var S = e("./scanner");
    function l(e, t, r) {
      var i = S.createScanner(e, !1);
      function n(e) {
        return e
          ? function() {
              return e(i.getTokenOffset(), i.getTokenLength());
            }
          : function() {
              return !0;
            };
      }
      function o(t) {
        return t
          ? function(e) {
              return t(e, i.getTokenOffset(), i.getTokenLength());
            }
          : function() {
              return !0;
            };
      }
      var a = n(t.onObjectBegin),
        s = o(t.onObjectProperty),
        u = n(t.onObjectEnd),
        c = n(t.onArrayBegin),
        l = n(t.onArrayEnd),
        f = o(t.onLiteralValue),
        p = o(t.onSeparator),
        h = n(t.onComment),
        d = o(t.onError),
        m = r && r.disallowComments,
        g = r && r.allowTrailingComma;
      function v() {
        for (;;) {
          var e = i.scan();
          switch (i.getTokenError()) {
            case 4:
              y(14);
              break;
            case 5:
              y(15);
              break;
            case 3:
              y(13);
              break;
            case 1:
              m || y(11);
              break;
            case 2:
              y(12);
              break;
            case 6:
              y(16);
          }
          switch (e) {
            case 12:
            case 13:
              m ? y(10) : h();
              break;
            case 16:
              y(1);
              break;
            case 15:
            case 14:
              break;
            default:
              return e;
          }
        }
      }
      function y(e, t, r) {
        if (
          (void 0 === t && (t = []),
          void 0 === r && (r = []),
          d(e),
          0 < t.length + r.length)
        )
          for (var n = i.getToken(); 17 !== n; ) {
            if (-1 !== t.indexOf(n)) {
              v();
              break;
            }
            if (-1 !== r.indexOf(n)) break;
            n = v();
          }
      }
      function b(e) {
        var t = i.getTokenValue();
        return e ? f(t) : s(t), v(), !0;
      }
      function x() {
        switch (i.getToken()) {
          case 3:
            return (function() {
              c(), v();
              for (var e = !1; 4 !== i.getToken() && 17 !== i.getToken(); ) {
                if (5 === i.getToken()) {
                  if ((e || y(4, [], []), p(","), v(), 4 === i.getToken() && g))
                    break;
                } else e && y(6, [], []);
                x() || y(4, [], [4, 5]), (e = !0);
              }
              return l(), 4 !== i.getToken() ? y(8, [4], []) : v(), !0;
            })();
          case 1:
            return (function() {
              a(), v();
              for (var e = !1; 2 !== i.getToken() && 17 !== i.getToken(); ) {
                if (5 === i.getToken()) {
                  if ((e || y(4, [], []), p(","), v(), 2 === i.getToken() && g))
                    break;
                } else e && y(6, [], []);
                (10 !== i.getToken()
                  ? (y(3, [], [2, 5]), 0)
                  : (b(!1),
                    6 === i.getToken()
                      ? (p(":"), v(), x() || y(4, [], [2, 5]))
                      : y(5, [], [2, 5]),
                    1)) || y(4, [], [2, 5]),
                  (e = !0);
              }
              return u(), 2 !== i.getToken() ? y(7, [2], []) : v(), !0;
            })();
          case 10:
            return b(!0);
          default:
            return (function() {
              switch (i.getToken()) {
                case 11:
                  var e = 0;
                  try {
                    "number" != typeof (e = JSON.parse(i.getTokenValue())) &&
                      (y(2), (e = 0));
                  } catch (e) {
                    y(2);
                  }
                  f(e);
                  break;
                case 7:
                  f(null);
                  break;
                case 8:
                  f(!0);
                  break;
                case 9:
                  f(!1);
                  break;
                default:
                  return !1;
              }
              return v(), !0;
            })();
        }
      }
      return (
        v(),
        17 === i.getToken() ||
          (x() ? (17 !== i.getToken() && y(9, [], []), !0) : (y(4, [], []), !1))
      );
    }
    function f(e) {
      switch (typeof e) {
        case "boolean":
          return "boolean";
        case "number":
          return "number";
        case "string":
          return "string";
        default:
          return "null";
      }
    }
    (t.getLocation = function(e, i) {
      var o = [],
        a = new Object(),
        s = void 0,
        u = { value: {}, offset: 0, length: 0, type: "object" },
        c = !1;
      function n(e, t, r, n) {
        (u.value = e),
          (u.offset = t),
          (u.length = r),
          (u.type = n),
          (u.columnOffset = void 0),
          (s = u);
      }
      try {
        l(e, {
          onObjectBegin: function(e, t) {
            if (i <= e) throw a;
            (s = void 0), (c = e < i), o.push("");
          },
          onObjectProperty: function(e, t, r) {
            if (i < t) throw a;
            if ((n(e, t, r, "property"), (o[o.length - 1] = e), i <= t + r))
              throw a;
          },
          onObjectEnd: function(e, t) {
            if (i <= e) throw a;
            (s = void 0), o.pop();
          },
          onArrayBegin: function(e, t) {
            if (i <= e) throw a;
            (s = void 0), o.push(0);
          },
          onArrayEnd: function(e, t) {
            if (i <= e) throw a;
            (s = void 0), o.pop();
          },
          onLiteralValue: function(e, t, r) {
            if (i < t) throw a;
            if ((n(e, t, r, f(e)), i <= t + r)) throw a;
          },
          onSeparator: function(e, t, r) {
            if (i <= t) throw a;
            if (":" === e && s && "property" === s.type)
              (s.columnOffset = t), (c = !1), (s = void 0);
            else if ("," === e) {
              var n = o[o.length - 1];
              "number" == typeof n
                ? (o[o.length - 1] = n + 1)
                : ((c = !0), (o[o.length - 1] = "")),
                (s = void 0);
            }
          }
        });
      } catch (e) {
        if (e !== a) throw e;
      }
      return {
        path: o,
        previousNode: s,
        isAtPropertyKey: c,
        matches: function(e) {
          for (var t = 0, r = 0; t < e.length && r < o.length; r++)
            if (e[t] === o[r] || "*" === e[t]) t++;
            else if ("**" !== e[t]) return !1;
          return t === e.length;
        }
      };
    }),
      (t.parse = function(e, n, t) {
        void 0 === n && (n = []);
        var r = null,
          i = [],
          o = [];
        function a(e) {
          Array.isArray(i) ? i.push(e) : r && (i[r] = e);
        }
        return (
          l(
            e,
            {
              onObjectBegin: function() {
                var e = {};
                a(e), o.push(i), (i = e), (r = null);
              },
              onObjectProperty: function(e) {
                r = e;
              },
              onObjectEnd: function() {
                i = o.pop();
              },
              onArrayBegin: function() {
                var e = [];
                a(e), o.push(i), (i = e), (r = null);
              },
              onArrayEnd: function() {
                i = o.pop();
              },
              onLiteralValue: a,
              onError: function(e, t, r) {
                n.push({ error: e, offset: t, length: r });
              }
            },
            t
          ),
          i[0]
        );
      }),
      (t.parseTree = function(e, n, t) {
        void 0 === n && (n = []);
        var i = { type: "array", offset: -1, length: -1, children: [] };
        function o(e) {
          "property" === i.type && ((i.length = e - i.offset), (i = i.parent));
        }
        function a(e) {
          return i.children.push(e), e;
        }
        l(
          e,
          {
            onObjectBegin: function(e) {
              i = a({
                type: "object",
                offset: e,
                length: -1,
                parent: i,
                children: []
              });
            },
            onObjectProperty: function(e, t, r) {
              (i = a({
                type: "property",
                offset: t,
                length: -1,
                parent: i,
                children: []
              })).children.push({
                type: "string",
                value: e,
                offset: t,
                length: r,
                parent: i
              });
            },
            onObjectEnd: function(e, t) {
              (i.length = e + t - i.offset), (i = i.parent), o(e + t);
            },
            onArrayBegin: function(e, t) {
              i = a({
                type: "array",
                offset: e,
                length: -1,
                parent: i,
                children: []
              });
            },
            onArrayEnd: function(e, t) {
              (i.length = e + t - i.offset), (i = i.parent), o(e + t);
            },
            onLiteralValue: function(e, t, r) {
              a({ type: f(e), offset: t, length: r, parent: i, value: e }),
                o(t + r);
            },
            onSeparator: function(e, t, r) {
              "property" === i.type &&
                (":" === e ? (i.columnOffset = t) : "," === e && o(t));
            },
            onError: function(e, t, r) {
              n.push({ error: e, offset: t, length: r });
            }
          },
          t
        );
        var r = i.children[0];
        return r && delete r.parent, r;
      }),
      (t.findNodeAtLocation = function(e, t) {
        if (e) {
          for (var r = e, n = 0, i = t; n < i.length; n++) {
            var o = i[n];
            if ("string" == typeof o) {
              if ("object" !== r.type || !Array.isArray(r.children)) return;
              for (var a = !1, s = 0, u = r.children; s < u.length; s++) {
                var c = u[s];
                if (Array.isArray(c.children) && c.children[0].value === o) {
                  (r = c.children[1]), (a = !0);
                  break;
                }
              }
              if (!a) return;
            } else {
              var l = o;
              if (
                "array" !== r.type ||
                l < 0 ||
                !Array.isArray(r.children) ||
                l >= r.children.length
              )
                return;
              r = r.children[l];
            }
          }
          return r;
        }
      }),
      (t.getNodeValue = function e(t) {
        if ("array" === t.type) return t.children.map(e);
        if ("object" === t.type) {
          for (
            var r = Object.create(null), n = 0, i = t.children;
            n < i.length;
            n++
          ) {
            var o = i[n];
            r[o.children[0].value] = e(o.children[1]);
          }
          return r;
        }
        return t.value;
      }),
      (t.visit = l),
      (t.stripComments = function(e, t) {
        var r,
          n,
          i = S.createScanner(e),
          o = [],
          a = 0;
        do {
          switch (((n = i.getPosition()), (r = i.scan()))) {
            case 12:
            case 13:
            case 17:
              a !== n && o.push(e.substring(a, n)),
                void 0 !== t &&
                  o.push(i.getTokenValue().replace(/[^\r\n]/g, t)),
                (a = i.getPosition());
          }
        } while (17 !== r);
        return o.join("");
      });
  }),
  (function(e) {
    if ("object" == typeof module && "object" == typeof module.exports) {
      var t = e(require, exports);
      void 0 !== t && (module.exports = t);
    } else
      "function" == typeof define &&
        define.amd &&
        define("jsonc-parser/impl/edit", [
          "require",
          "exports",
          "./format",
          "./parser"
        ], e);
  })(function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var c = e("./format"),
      x = e("./parser");
    function n(e, t, r, n, i) {
      for (
        var o, a = x.parseTree(e, []), s = void 0, u = void 0;
        0 < t.length &&
        ((u = t.pop()),
        void 0 === (s = x.findNodeAtLocation(a, t)) && void 0 !== r);

      )
        "string" == typeof u ? (((o = {})[u] = r), (r = o)) : (r = [r]);
      if (s) {
        if (
          "object" === s.type &&
          "string" == typeof u &&
          Array.isArray(s.children)
        ) {
          var c = x.findNodeAtLocation(s, [u]);
          if (void 0 !== c) {
            if (void 0 === r) {
              if (!c.parent) throw new Error("Malformed AST");
              var l = s.children.indexOf(c.parent),
                f = void 0,
                p = c.parent.offset + c.parent.length;
              if (0 < l) f = (y = s.children[l - 1]).offset + y.length;
              else if (((f = s.offset + 1), 1 < s.children.length))
                p = s.children[1].offset;
              return S(e, { offset: f, length: p - f, content: "" }, n);
            }
            return S(
              e,
              {
                offset: c.offset,
                length: c.length,
                content: JSON.stringify(r)
              },
              n
            );
          }
          if (void 0 === r) return [];
          var h = JSON.stringify(u) + ": " + JSON.stringify(r),
            d = i
              ? i(
                  s.children.map(function(e) {
                    return e.children[0].value;
                  })
                )
              : s.children.length,
            m = void 0;
          return S(
            e,
            (m =
              0 < d
                ? {
                    offset: (y = s.children[d - 1]).offset + y.length,
                    length: 0,
                    content: "," + h
                  }
                : 0 === s.children.length
                ? { offset: s.offset + 1, length: 0, content: h }
                : { offset: s.offset + 1, length: 0, content: h + "," }),
            n
          );
        }
        if (
          "array" === s.type &&
          "number" == typeof u &&
          Array.isArray(s.children)
        ) {
          if (-1 === u) {
            (h = "" + JSON.stringify(r)), (m = void 0);
            if (0 === s.children.length)
              m = { offset: s.offset + 1, length: 0, content: h };
            else
              m = {
                offset:
                  (y = s.children[s.children.length - 1]).offset + y.length,
                length: 0,
                content: "," + h
              };
            return S(e, m, n);
          }
          if (void 0 === r && 0 <= s.children.length) {
            var g = u,
              v = s.children[g];
            m = void 0;
            if (1 === s.children.length)
              m = { offset: s.offset + 1, length: s.length - 2, content: "" };
            else if (s.children.length - 1 === g) {
              var y,
                b = (y = s.children[g - 1]).offset + y.length;
              m = {
                offset: b,
                length: s.offset + s.length - 2 - b,
                content: ""
              };
            } else
              m = {
                offset: v.offset,
                length: s.children[g + 1].offset - v.offset,
                content: ""
              };
            return S(e, m, n);
          }
          throw new Error("Array modification not supported yet");
        }
        throw new Error(
          "Can not add " +
            ("number" != typeof u ? "index" : "property") +
            " to parent of type " +
            s.type
        );
      }
      if (void 0 === r) throw new Error("Can not delete in empty document");
      return S(
        e,
        {
          offset: a ? a.offset : 0,
          length: a ? a.length : 0,
          content: JSON.stringify(r)
        },
        n
      );
    }
    function S(e, t, r) {
      var n = l(e, t),
        i = t.offset,
        o = t.offset + t.content.length;
      if (0 === t.length || 0 === t.content.length) {
        for (; 0 < i && !c.isEOL(n, i - 1); ) i--;
        for (; o < n.length && !c.isEOL(n, o); ) o++;
      }
      for (
        var a = c.format(n, { offset: i, length: o - i }, r), s = a.length - 1;
        0 <= s;
        s--
      ) {
        var u = a[s];
        (n = l(n, u)),
          (i = Math.min(i, u.offset)),
          (o = Math.max(o, u.offset + u.length)),
          (o += u.content.length - u.length);
      }
      return [
        {
          offset: i,
          length: e.length - (n.length - o) - i,
          content: n.substring(i, o)
        }
      ];
    }
    function l(e, t) {
      return (
        e.substring(0, t.offset) + t.content + e.substring(t.offset + t.length)
      );
    }
    (t.removeProperty = function(e, t, r) {
      return n(e, t, void 0, r);
    }),
      (t.setProperty = n),
      (t.applyEdit = l),
      (t.isWS = function(e, t) {
        return -1 !== "\r\n \t".indexOf(e.charAt(t));
      });
  }),
  (function(e) {
    if ("object" == typeof module && "object" == typeof module.exports) {
      var t = e(require, exports);
      void 0 !== t && (module.exports = t);
    } else
      "function" == typeof define &&
        define.amd &&
        define("jsonc-parser/main", [
          "require",
          "exports",
          "./impl/format",
          "./impl/edit",
          "./impl/scanner",
          "./impl/parser"
        ], e);
  })(function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var n = e("./impl/format"),
      i = e("./impl/edit"),
      r = e("./impl/scanner"),
      o = e("./impl/parser");
    (t.createScanner = r.createScanner),
      (t.getLocation = o.getLocation),
      (t.parse = o.parse),
      (t.parseTree = o.parseTree),
      (t.findNodeAtLocation = o.findNodeAtLocation),
      (t.getNodeValue = o.getNodeValue),
      (t.visit = o.visit),
      (t.stripComments = o.stripComments),
      (t.format = function(e, t, r) {
        return n.format(e, t, r);
      }),
      (t.modify = function(e, t, r, n) {
        return i.setProperty(e, t, r, n.formattingOptions, n.getInsertionIndex);
      }),
      (t.applyEdits = function(e, t) {
        for (var r = t.length - 1; 0 <= r; r--) e = i.applyEdit(e, t[r]);
        return e;
      });
  }),
  define("jsonc-parser", ["jsonc-parser/main"], function(e) {
    return e;
  }),
  (function(e) {
    if ("object" == typeof module && "object" == typeof module.exports) {
      var t = e(require, exports);
      void 0 !== t && (module.exports = t);
    } else
      "function" == typeof define &&
        define.amd &&
        define("vscode-json-languageservice/utils/json", [
          "require",
          "exports"
        ], e);
  })(function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.stringifyObject = function e(t, r, n) {
        if (null !== t && "object" == typeof t) {
          var i = r + "\t";
          if (Array.isArray(t)) {
            if (0 === t.length) return "[]";
            for (var o = "[\n", a = 0; a < t.length; a++)
              (o += i + e(t[a], i, n)),
                a < t.length - 1 && (o += ","),
                (o += "\n");
            return (o += r + "]");
          }
          var s = Object.keys(t);
          if (0 === s.length) return "{}";
          for (o = "{\n", a = 0; a < s.length; a++) {
            var u = s[a];
            (o += i + JSON.stringify(u) + ": " + e(t[u], i, n)),
              a < s.length - 1 && (o += ","),
              (o += "\n");
          }
          return (o += r + "}");
        }
        return n(t);
      });
  }),
  (function(e) {
    if ("object" == typeof module && "object" == typeof module.exports) {
      var t = e(require, exports);
      void 0 !== t && (module.exports = t);
    } else
      "function" == typeof define &&
        define.amd &&
        define("vscode-json-languageservice/utils/strings", [
          "require",
          "exports"
        ], e);
  })(function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.startsWith = function(e, t) {
        if (e.length < t.length) return !1;
        for (var r = 0; r < t.length; r++) if (e[r] !== t[r]) return !1;
        return !0;
      }),
      (t.endsWith = function(e, t) {
        var r = e.length - t.length;
        return 0 < r ? e.lastIndexOf(t) === r : 0 === r && e === t;
      }),
      (t.convertSimple2RegExpPattern = function(e) {
        return e
          .replace(/[\-\\\{\}\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&")
          .replace(/[\*]/g, ".*");
      }),
      (t.repeat = function(e, t) {
        for (var r = ""; 0 < t; )
          1 == (1 & t) && (r += e), (e += e), (t >>>= 1);
        return r;
      });
  }),
  define("vscode-nls/vscode-nls", ["require", "exports"], function(e, t) {
    "use strict";
    function r(e, t) {
      for (var r, n, i = [], o = 2; o < arguments.length; o++)
        i[o - 2] = arguments[o];
      return (
        (r = t),
        0 === (n = i).length
          ? r
          : r.replace(/\{(\d+)\}/g, function(e, t) {
              var r = t[0];
              return void 0 !== n[r] ? n[r] : e;
            })
      );
    }
    function n(e) {
      return r;
    }
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.loadMessageBundle = n),
      (t.config = function(e) {
        return n;
      });
  }),
  define("vscode-nls", ["vscode-nls/vscode-nls"], function(e) {
    return e;
  }),
  (function(e) {
    if ("object" == typeof module && "object" == typeof module.exports) {
      var t = e(require, exports);
      void 0 !== t && (module.exports = t);
    } else
      "function" == typeof define &&
        define.amd &&
        define("vscode-json-languageservice/services/jsonCompletion", [
          "require",
          "exports",
          "jsonc-parser",
          "../utils/json",
          "../utils/strings",
          "vscode-languageserver-types",
          "vscode-nls"
        ], e);
  })(function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = e("jsonc-parser"),
      r = e("../utils/json"),
      u = e("../utils/strings"),
      y = e("vscode-languageserver-types"),
      n = e("vscode-nls").loadMessageBundle(),
      i = (function() {
        function e(e, t, r) {
          void 0 === t && (t = []),
            (this.templateVarIdCounter = 0),
            (this.schemaService = e),
            (this.contributions = t),
            (this.promise = r || Promise);
        }
        return (
          (e.prototype.doResolve = function(e) {
            for (var t = this.contributions.length - 1; 0 <= t; t--)
              if (this.contributions[t].resolveCompletion) {
                var r = this.contributions[t].resolveCompletion(e);
                if (r) return r;
              }
            return this.promise.resolve(e);
          }),
          (e.prototype.doComplete = function(u, e, c) {
            var l = this,
              f = { items: [], isIncomplete: !1 },
              p = u.offsetAt(e),
              h = c.getNodeFromOffsetEndInclusive(p);
            if (this.isInComment(u, h ? h.start : 0, p))
              return Promise.resolve(f);
            var d = this.getCurrentWord(u, p),
              m = null;
            if (
              !h ||
              ("string" !== h.type &&
                "number" !== h.type &&
                "boolean" !== h.type &&
                "null" !== h.type)
            ) {
              var t = p - d.length;
              0 < t && '"' === u.getText()[t - 1] && t--,
                (m = y.Range.create(u.positionAt(t), e));
            } else
              m = y.Range.create(u.positionAt(h.start), u.positionAt(h.end));
            var g = {},
              v = {
                add: function(e) {
                  var t = g[e.label];
                  t
                    ? t.documentation || (t.documentation = e.documentation)
                    : ((g[e.label] = e),
                      m && (e.textEdit = y.TextEdit.replace(m, e.insertText)),
                      f.items.push(e));
                },
                setAsIncomplete: function() {
                  f.isIncomplete = !0;
                },
                error: function(e) {
                  console.error(e);
                },
                log: function(e) {
                  console.log(e);
                },
                getNumberOfProposals: function() {
                  return f.items.length;
                }
              };
            return this.schemaService
              .getSchemaForResource(u.uri, c)
              .then(function(e) {
                var r = [],
                  n = !0,
                  t = "",
                  i = null;
                h &&
                  "string" === h.type &&
                    h.isKey &&
                    ((n = !(h.parent && h.parent.value)),
                    (i = h.parent ? h.parent : null),
                    (t = u.getText().substring(h.start + 1, h.end - 1)),
                    h.parent && (h = h.parent.parent));
                if (h && "object" === h.type) {
                  if (h.start === p) return f;
                  h.properties.forEach(function(e) {
                    (i && i === e) ||
                      (g[e.key.value] = y.CompletionItem.create("__"));
                  });
                  var o = "";
                  n && (o = l.evaluateSeparatorAfter(u, u.offsetAt(m.end))),
                    e
                      ? l.getPropertyCompletions(e, c, h, n, o, v)
                      : l.getSchemaLessPropertyCompletions(c, h, t, v);
                  var a = h.getPath();
                  l.contributions.forEach(function(e) {
                    var t = e.collectPropertyCompletions(
                      u.uri,
                      a,
                      d,
                      n,
                      "" === o,
                      v
                    );
                    t && r.push(t);
                  }),
                    !e &&
                      0 < d.length &&
                      '"' !== u.getText().charAt(p - d.length - 1) &&
                      v.add({
                        kind: y.CompletionItemKind.Property,
                        label: l.getLabelForValue(d),
                        insertText: l.getInsertTextForProperty(d, null, !1, o),
                        insertTextFormat: y.InsertTextFormat.Snippet,
                        documentation: ""
                      });
                }
                var s = {};
                return (
                  e
                    ? l.getValueCompletions(e, c, h, p, u, v, s)
                    : l.getSchemaLessValueCompletions(c, h, p, u, v),
                  0 < l.contributions.length &&
                    l.getContributedValueCompletions(c, h, p, u, v, r),
                  l.promise.all(r).then(function() {
                    if (0 === v.getNumberOfProposals()) {
                      var e = p;
                      !h ||
                        ("string" !== h.type &&
                          "number" !== h.type &&
                          "boolean" !== h.type &&
                          "null" !== h.type) ||
                        (e = h.end);
                      var t = l.evaluateSeparatorAfter(u, e);
                      l.addFillerValueCompletions(s, t, v);
                    }
                    return f;
                  })
                );
              });
          }),
          (e.prototype.getPropertyCompletions = function(e, t, r, i, o, a) {
            var s = this;
            t.getMatchingSchemas(e.schema, r.start).forEach(function(e) {
              if (e.node === r && !e.inverted) {
                var n = e.schema.properties;
                n &&
                  Object.keys(n).forEach(function(e) {
                    var t = n[e];
                    if (
                      "object" == typeof t &&
                      !t.deprecationMessage &&
                      !t.doNotSuggest
                    ) {
                      var r = {
                        kind: y.CompletionItemKind.Property,
                        label: e,
                        insertText: s.getInsertTextForProperty(e, t, i, o),
                        insertTextFormat: y.InsertTextFormat.Snippet,
                        filterText: s.getFilterTextForValue(e),
                        documentation: t.description || ""
                      };
                      u.endsWith(r.insertText, "$1" + o) &&
                        (r.command = {
                          title: "Suggest",
                          command: "editor.action.triggerSuggest"
                        }),
                        a.add(r);
                    }
                  });
              }
            });
          }),
          (e.prototype.getSchemaLessPropertyCompletions = function(e, r, t, n) {
            var i = this,
              o = function(e) {
                e.properties.forEach(function(e) {
                  var t = e.key.value;
                  n.add({
                    kind: y.CompletionItemKind.Property,
                    label: t,
                    insertText: i.getInsertTextForValue(t, ""),
                    insertTextFormat: y.InsertTextFormat.Snippet,
                    filterText: i.getFilterTextForValue(t),
                    documentation: ""
                  });
                });
              };
            if (r.parent)
              if ("property" === r.parent.type) {
                var a = r.parent.key.value;
                e.visit(function(e) {
                  var t = e;
                  return (
                    "property" === e.type &&
                      e !== r.parent &&
                      t.key.value === a &&
                      t.value &&
                      "object" === t.value.type &&
                      o(t.value),
                    !0
                  );
                });
              } else
                "array" === r.parent.type &&
                  r.parent.items.forEach(function(e) {
                    "object" === e.type && e !== r && o(e);
                  });
            else
              "object" === r.type &&
                n.add({
                  kind: y.CompletionItemKind.Property,
                  label: "$schema",
                  insertText: this.getInsertTextForProperty(
                    "$schema",
                    null,
                    !0,
                    ""
                  ),
                  insertTextFormat: y.InsertTextFormat.Snippet,
                  documentation: "",
                  filterText: this.getFilterTextForValue("$schema")
                });
          }),
          (e.prototype.getSchemaLessValueCompletions = function(e, t, r, n, i) {
            var o = this,
              a = r;
            if (
              (!t ||
                ("string" !== t.type &&
                  "number" !== t.type &&
                  "boolean" !== t.type &&
                  "null" !== t.type) ||
                ((a = t.end), (t = t.parent)),
              !t)
            )
              return (
                i.add({
                  kind: this.getSuggestionKind("object"),
                  label: "Empty object",
                  insertText: this.getInsertTextForValue({}, ""),
                  insertTextFormat: y.InsertTextFormat.Snippet,
                  documentation: ""
                }),
                void i.add({
                  kind: this.getSuggestionKind("array"),
                  label: "Empty array",
                  insertText: this.getInsertTextForValue([], ""),
                  insertTextFormat: y.InsertTextFormat.Snippet,
                  documentation: ""
                })
              );
            var s = this.evaluateSeparatorAfter(n, a),
              u = function(e) {
                e.parent.contains(r, !0) ||
                  i.add({
                    kind: o.getSuggestionKind(e.type),
                    label: o.getLabelTextForMatchingNode(e, n),
                    insertText: o.getInsertTextForMatchingNode(e, n, s),
                    insertTextFormat: y.InsertTextFormat.Snippet,
                    documentation: ""
                  }),
                  "boolean" === e.type &&
                    o.addBooleanValueCompletion(!e.getValue(), s, i);
              };
            if ("property" === t.type) {
              var c = t;
              if (r > c.colonOffset) {
                var l = c.value;
                if (
                  l &&
                  (r > l.end || "object" === l.type || "array" === l.type)
                )
                  return;
                var f = c.key.value;
                e.visit(function(e) {
                  var t = e;
                  return (
                    "property" === e.type &&
                      t.key.value === f &&
                      t.value &&
                      u(t.value),
                    !0
                  );
                }),
                  "$schema" === f &&
                    t.parent &&
                    !t.parent.parent &&
                    this.addDollarSchemaCompletions(s, i);
              }
            }
            if ("array" === t.type)
              if (t.parent && "property" === t.parent.type) {
                var p = t.parent.key.value;
                e.visit(function(e) {
                  var t = e;
                  return (
                    "property" === e.type &&
                      t.key.value === p &&
                      t.value &&
                      "array" === t.value.type &&
                      t.value.items.forEach(function(e) {
                        u(e);
                      }),
                    !0
                  );
                });
              } else
                t.items.forEach(function(e) {
                  u(e);
                });
          }),
          (e.prototype.getValueCompletions = function(e, t, n, i, o, a, s) {
            var u = this,
              r = i,
              c = null,
              l = null;
            if (
              (!n ||
                ("string" !== n.type &&
                  "number" !== n.type &&
                  "boolean" !== n.type &&
                  "null" !== n.type) ||
                ((r = n.end), (n = (l = n).parent)),
              n)
            ) {
              if ("property" === n.type && i > n.colonOffset) {
                var f = n,
                  p = f.value;
                if (p && i > p.end) return;
                (c = f.key.value), (n = n.parent);
              }
              if (n && (null !== c || "array" === n.type)) {
                var h = this.evaluateSeparatorAfter(o, r);
                t.getMatchingSchemas(e.schema, n.start, l).forEach(function(e) {
                  if (e.node === n && !e.inverted && e.schema) {
                    if (e.schema.items)
                      if (Array.isArray(e.schema.items)) {
                        var t = u.findItemAtOffset(n, o, i);
                        t < e.schema.items.length &&
                          u.addSchemaValueCompletions(
                            e.schema.items[t],
                            h,
                            a,
                            s
                          );
                      } else
                        u.addSchemaValueCompletions(e.schema.items, h, a, s);
                    if (e.schema.properties) {
                      var r = e.schema.properties[c];
                      r && u.addSchemaValueCompletions(r, h, a, s);
                    }
                  }
                }),
                  "$schema" !== c ||
                    n.parent ||
                    this.addDollarSchemaCompletions(h, a),
                  s.boolean &&
                    (this.addBooleanValueCompletion(!0, h, a),
                    this.addBooleanValueCompletion(!1, h, a)),
                  s.null && this.addNullValueCompletion(h, a);
              }
            } else this.addSchemaValueCompletions(e.schema, "", a, s);
          }),
          (e.prototype.getContributedValueCompletions = function(
            e,
            t,
            r,
            n,
            i,
            o
          ) {
            if (t) {
              if (
                (("string" !== t.type &&
                  "number" !== t.type &&
                  "boolean" !== t.type &&
                  "null" !== t.type) ||
                  (t = t.parent),
                "property" === t.type && r > t.colonOffset)
              ) {
                var a = t.key.value,
                  s = t.value;
                if (!s || r <= s.end) {
                  var u = t.parent.getPath();
                  this.contributions.forEach(function(e) {
                    var t = e.collectValueCompletions(n.uri, u, a, i);
                    t && o.push(t);
                  });
                }
              }
            } else
              this.contributions.forEach(function(e) {
                var t = e.collectDefaultCompletions(n.uri, i);
                t && o.push(t);
              });
          }),
          (e.prototype.addSchemaValueCompletions = function(e, t, r, n) {
            var i = this;
            "object" == typeof e &&
              (this.addDefaultValueCompletions(e, t, r),
              this.addEnumValueCompletions(e, t, r),
              this.collectTypes(e, n),
              Array.isArray(e.allOf) &&
                e.allOf.forEach(function(e) {
                  return i.addSchemaValueCompletions(e, t, r, n);
                }),
              Array.isArray(e.anyOf) &&
                e.anyOf.forEach(function(e) {
                  return i.addSchemaValueCompletions(e, t, r, n);
                }),
              Array.isArray(e.oneOf) &&
                e.oneOf.forEach(function(e) {
                  return i.addSchemaValueCompletions(e, t, r, n);
                }));
          }),
          (e.prototype.addDefaultValueCompletions = function(l, f, p, h) {
            var d = this;
            void 0 === h && (h = 0);
            var m = !1;
            if (l.default) {
              for (var e = l.type, t = l.default, r = h; 0 < r; r--)
                (t = [t]), (e = "array");
              p.add({
                kind: this.getSuggestionKind(e),
                label: this.getLabelForValue(t),
                insertText: this.getInsertTextForValue(t, f),
                insertTextFormat: y.InsertTextFormat.Snippet,
                detail: n("json.suggest.default", "Default value")
              }),
                (m = !0);
            }
            Array.isArray(l.defaultSnippets) &&
              l.defaultSnippets.forEach(function(e) {
                var t,
                  r,
                  n = l.type,
                  i = e.body,
                  o = e.label;
                if (void 0 !== i) {
                  l.type;
                  for (var a = h; 0 < a; a--) (i = [i]), "array";
                  (t = d.getInsertTextForSnippetValue(i, f)),
                    (r = d.getFilterTextForSnippetValue(i)),
                    (o = o || d.getLabelForSnippetValue(i));
                } else if ("string" == typeof e.bodyText) {
                  var s = "",
                    u = "",
                    c = "";
                  for (a = h; 0 < a; a--)
                    (s = s + c + "[\n"),
                      (u = u + "\n" + c + "]"),
                      (c += "\t"),
                      (n = "array");
                  (t = s + c + e.bodyText.split("\n").join("\n" + c) + u + f),
                    (o = o || t),
                    (r = t.replace(/[\n]/g, ""));
                }
                p.add({
                  kind: d.getSuggestionKind(n),
                  label: o,
                  documentation: e.description,
                  insertText: t,
                  insertTextFormat: y.InsertTextFormat.Snippet,
                  filterText: r
                }),
                  (m = !0);
              }),
              m ||
                "object" != typeof l.items ||
                Array.isArray(l.items) ||
                this.addDefaultValueCompletions(l.items, f, p, h + 1);
          }),
          (e.prototype.addEnumValueCompletions = function(e, t, r) {
            if (Array.isArray(e.enum))
              for (var n = 0, i = e.enum.length; n < i; n++) {
                var o = e.enum[n],
                  a = e.description;
                e.enumDescriptions &&
                  n < e.enumDescriptions.length &&
                  (a = e.enumDescriptions[n]),
                  r.add({
                    kind: this.getSuggestionKind(e.type),
                    label: this.getLabelForValue(o),
                    insertText: this.getInsertTextForValue(o, t),
                    insertTextFormat: y.InsertTextFormat.Snippet,
                    documentation: a
                  });
              }
          }),
          (e.prototype.collectTypes = function(e, t) {
            var r = e.type;
            Array.isArray(r)
              ? r.forEach(function(e) {
                  return (t[e] = !0);
                })
              : (t[r] = !0);
          }),
          (e.prototype.addFillerValueCompletions = function(e, t, r) {
            e.object &&
              r.add({
                kind: this.getSuggestionKind("object"),
                label: "{}",
                insertText: this.getInsertTextForGuessedValue({}, t),
                insertTextFormat: y.InsertTextFormat.Snippet,
                detail: n("defaults.object", "New object"),
                documentation: ""
              }),
              e.array &&
                r.add({
                  kind: this.getSuggestionKind("array"),
                  label: "[]",
                  insertText: this.getInsertTextForGuessedValue([], t),
                  insertTextFormat: y.InsertTextFormat.Snippet,
                  detail: n("defaults.array", "New array"),
                  documentation: ""
                });
          }),
          (e.prototype.addBooleanValueCompletion = function(e, t, r) {
            r.add({
              kind: this.getSuggestionKind("boolean"),
              label: e ? "true" : "false",
              insertText: this.getInsertTextForValue(e, t),
              insertTextFormat: y.InsertTextFormat.Snippet,
              documentation: ""
            });
          }),
          (e.prototype.addNullValueCompletion = function(e, t) {
            t.add({
              kind: this.getSuggestionKind("null"),
              label: "null",
              insertText: "null" + e,
              insertTextFormat: y.InsertTextFormat.Snippet,
              documentation: ""
            });
          }),
          (e.prototype.addDollarSchemaCompletions = function(t, r) {
            var n = this;
            this.schemaService
              .getRegisteredSchemaIds(function(e) {
                return "http" === e || "https" === e;
              })
              .forEach(function(e) {
                return r.add({
                  kind: y.CompletionItemKind.Module,
                  label: n.getLabelForValue(e),
                  filterText: n.getFilterTextForValue(e),
                  insertText: n.getInsertTextForValue(e, t),
                  insertTextFormat: y.InsertTextFormat.Snippet,
                  documentation: ""
                });
              });
          }),
          (e.prototype.getLabelForValue = function(e) {
            var t = JSON.stringify(e);
            return 57 < t.length ? t.substr(0, 57).trim() + "..." : t;
          }),
          (e.prototype.getFilterTextForValue = function(e) {
            return JSON.stringify(e);
          }),
          (e.prototype.getFilterTextForSnippetValue = function(e) {
            return JSON.stringify(e).replace(/\$\{\d+:([^}]+)\}|\$\d+/g, "$1");
          }),
          (e.prototype.getLabelForSnippetValue = function(e) {
            var t = JSON.stringify(e);
            return 57 < (t = t.replace(/\$\{\d+:([^}]+)\}|\$\d+/g, "$1")).length
              ? t.substr(0, 57).trim() + "..."
              : t;
          }),
          (e.prototype.getInsertTextForPlainText = function(e) {
            return e.replace(/[\\\$\}]/g, "\\$&");
          }),
          (e.prototype.getInsertTextForValue = function(e, t) {
            var r = JSON.stringify(e, null, "\t");
            return "{}" === r
              ? "{\n\t$1\n}" + t
              : "[]" === r
              ? "[\n\t$1\n]" + t
              : this.getInsertTextForPlainText(r + t);
          }),
          (e.prototype.getInsertTextForSnippetValue = function(e, t) {
            return (
              r.stringifyObject(e, "", function(e) {
                return "string" == typeof e && "^" === e[0]
                  ? e.substr(1)
                  : JSON.stringify(e);
              }) + t
            );
          }),
          (e.prototype.getInsertTextForGuessedValue = function(e, t) {
            switch (typeof e) {
              case "object":
                return null === e
                  ? "${1:null}" + t
                  : this.getInsertTextForValue(e, t);
              case "string":
                var r = JSON.stringify(e);
                return (
                  (r = r.substr(1, r.length - 2)),
                  '"${1:' + (r = this.getInsertTextForPlainText(r)) + '}"' + t
                );
              case "number":
              case "boolean":
                return "${1:" + JSON.stringify(e) + "}" + t;
            }
            return this.getInsertTextForValue(e, t);
          }),
          (e.prototype.getSuggestionKind = function(e) {
            if (Array.isArray(e)) {
              var t = e;
              e = 0 < t.length ? t[0] : null;
            }
            if (!e) return y.CompletionItemKind.Value;
            switch (e) {
              case "string":
                return y.CompletionItemKind.Value;
              case "object":
                return y.CompletionItemKind.Module;
              case "property":
                return y.CompletionItemKind.Property;
              default:
                return y.CompletionItemKind.Value;
            }
          }),
          (e.prototype.getLabelTextForMatchingNode = function(e, t) {
            switch (e.type) {
              case "array":
                return "[]";
              case "object":
                return "{}";
              default:
                return t.getText().substr(e.start, e.end - e.start);
            }
          }),
          (e.prototype.getInsertTextForMatchingNode = function(e, t, r) {
            switch (e.type) {
              case "array":
                return this.getInsertTextForValue([], r);
              case "object":
                return this.getInsertTextForValue({}, r);
              default:
                var n = t.getText().substr(e.start, e.end - e.start) + r;
                return this.getInsertTextForPlainText(n);
            }
          }),
          (e.prototype.getInsertTextForProperty = function(e, t, r, n) {
            var i = this.getInsertTextForValue(e, "");
            if (!r) return i;
            var o,
              a = i + ": ",
              s = 0;
            if (t) {
              if (Array.isArray(t.defaultSnippets)) {
                if (1 === t.defaultSnippets.length) {
                  var u = t.defaultSnippets[0].body;
                  void 0 !== u &&
                    (o = this.getInsertTextForSnippetValue(u, ""));
                }
                s += t.defaultSnippets.length;
              }
              if (
                (t.enum &&
                  (o ||
                    1 !== t.enum.length ||
                    (o = this.getInsertTextForGuessedValue(t.enum[0], "")),
                  (s += t.enum.length)),
                void 0 !== t.default &&
                  (o || (o = this.getInsertTextForGuessedValue(t.default, "")),
                  s++),
                0 === s)
              ) {
                var c = Array.isArray(t.type) ? t.type[0] : t.type;
                switch (
                  (c ||
                    (t.properties ? (c = "object") : t.items && (c = "array")),
                  c)
                ) {
                  case "boolean":
                    o = "$1";
                    break;
                  case "string":
                    o = '"$1"';
                    break;
                  case "object":
                    o = "{\n\t$1\n}";
                    break;
                  case "array":
                    o = "[\n\t$1\n]";
                    break;
                  case "number":
                  case "integer":
                    o = "${1:0}";
                    break;
                  case "null":
                    o = "${1:null}";
                    break;
                  default:
                    return i;
                }
              }
            }
            return (!o || 1 < s) && (o = "$1"), a + o + n;
          }),
          (e.prototype.getCurrentWord = function(e, t) {
            for (
              var r = t - 1, n = e.getText();
              0 <= r && -1 === ' \t\n\r\v":{[,]}'.indexOf(n.charAt(r));

            )
              r--;
            return n.substring(r + 1, t);
          }),
          (e.prototype.evaluateSeparatorAfter = function(e, t) {
            var r = s.createScanner(e.getText(), !0);
            switch ((r.setPosition(t), r.scan())) {
              case 5:
              case 2:
              case 4:
              case 17:
                return "";
              default:
                return ",";
            }
          }),
          (e.prototype.findItemAtOffset = function(e, t, r) {
            for (
              var n = s.createScanner(t.getText(), !0),
                i = e.getChildNodes(),
                o = i.length - 1;
              0 <= o;
              o--
            ) {
              var a = i[o];
              if (r > a.end)
                return (
                  n.setPosition(a.end),
                  5 === n.scan() && r >= n.getTokenOffset() + n.getTokenLength()
                    ? o + 1
                    : o
                );
              if (r >= a.start) return o;
            }
            return 0;
          }),
          (e.prototype.isInComment = function(e, t, r) {
            var n = s.createScanner(e.getText(), !1);
            n.setPosition(t);
            for (
              var i = n.scan();
              17 !== i && n.getTokenOffset() + n.getTokenLength() < r;

            )
              i = n.scan();
            return (12 === i || 13 === i) && n.getTokenOffset() <= r;
          }),
          e
        );
      })();
    t.JSONCompletion = i;
  }),
  (function(e) {
    if ("object" == typeof module && "object" == typeof module.exports) {
      var t = e(require, exports);
      void 0 !== t && (module.exports = t);
    } else
      "function" == typeof define &&
        define.amd &&
        define("vscode-json-languageservice/services/jsonHover", [
          "require",
          "exports",
          "vscode-languageserver-types"
        ], e);
  })(function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var p = e("vscode-languageserver-types"),
      r = (function() {
        function e(e, t, r) {
          void 0 === t && (t = []),
            (this.schemaService = e),
            (this.contributions = t),
            (this.promise = r || Promise);
        }
        return (
          (e.prototype.doHover = function(e, t, s) {
            var r = e.offsetAt(t),
              u = s.getNodeFromOffset(r);
            if (
              !u ||
              (("object" === u.type || "array" === u.type) &&
                r > u.start + 1 &&
                r < u.end - 1)
            )
              return this.promise.resolve(null);
            var n = u;
            if ("string" === u.type && u.isKey) {
              var i = u.parent;
              if (!(u = i.value)) return this.promise.resolve(null);
            }
            for (
              var o = p.Range.create(
                  e.positionAt(n.start),
                  e.positionAt(n.end)
                ),
                c = function(e) {
                  return { contents: e, range: o };
                },
                a = u.getPath(),
                l = this.contributions.length - 1;
              0 <= l;
              l--
            ) {
              var f = this.contributions[l].getInfoContribution(e.uri, a);
              if (f)
                return f.then(function(e) {
                  return c(e);
                });
            }
            return this.schemaService
              .getSchemaForResource(e.uri, s)
              .then(function(e) {
                if (e) {
                  var t = s.getMatchingSchemas(e.schema, u.start),
                    r = null,
                    n = null,
                    i = null,
                    o = null;
                  t.every(function(e) {
                    if (
                      e.node === u &&
                      !e.inverted &&
                      e.schema &&
                      ((r = r || e.schema.title),
                      (n =
                        n ||
                        e.schema.markdownDescription ||
                        h(e.schema.description)),
                      e.schema.enum)
                    ) {
                      var t = e.schema.enum.indexOf(u.getValue());
                      e.schema.markdownEnumDescriptions
                        ? (i = e.schema.markdownEnumDescriptions[t])
                        : e.schema.enumDescriptions &&
                          (i = h(e.schema.enumDescriptions[t])),
                        i &&
                          "string" != typeof (o = e.schema.enum[t]) &&
                          (o = JSON.stringify(o));
                    }
                    return !0;
                  });
                  var a = "";
                  return (
                    r && (a = h(r)),
                    n && (0 < a.length && (a += "\n\n"), (a += n)),
                    i &&
                      (0 < a.length && (a += "\n\n"),
                      (a += "`" + h(o) + "`: " + i)),
                    c([a])
                  );
                }
                return null;
              });
          }),
          e
        );
      })();
    function h(e) {
      if (e)
        return e
          .replace(/([^\n\r])(\r?\n)([^\n\r])/gm, "$1\n\n$3")
          .replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
    }
    t.JSONHover = r;
  }),
  (function(e) {
    if ("object" == typeof module && "object" == typeof module.exports) {
      var t = e(require, exports);
      void 0 !== t && (module.exports = t);
    } else
      "function" == typeof define &&
        define.amd &&
        define("vscode-json-languageservice/utils/objects", [
          "require",
          "exports"
        ], e);
  })(function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 }),
      (t.equals = function e(t, r) {
        if (t === r) return !0;
        if (null == t || null == r) return !1;
        if (typeof t != typeof r) return !1;
        if ("object" != typeof t) return !1;
        if (Array.isArray(t) !== Array.isArray(r)) return !1;
        var n, i;
        if (Array.isArray(t)) {
          if (t.length !== r.length) return !1;
          for (n = 0; n < t.length; n++) if (!e(t[n], r[n])) return !1;
        } else {
          var o = [];
          for (i in t) o.push(i);
          o.sort();
          var a = [];
          for (i in r) a.push(i);
          if ((a.sort(), !e(o, a))) return !1;
          for (n = 0; n < o.length; n++) if (!e(t[o[n]], r[o[n]])) return !1;
        }
        return !0;
      });
  }),
  (function(e) {
    if ("object" == typeof module && "object" == typeof module.exports) {
      var t = e(require, exports);
      void 0 !== t && (module.exports = t);
    } else
      "function" == typeof define &&
        define.amd &&
        define("vscode-uri/index", ["require", "exports"], e);
  })(function(e, t) {
    "use strict";
    function r(e) {
      return (
        "%" +
        e
          .charCodeAt(0)
          .toString(16)
          .toUpperCase()
      );
    }
    function h(e) {
      return encodeURIComponent(e).replace(/[!'()*]/g, r);
    }
    function d(e) {
      return e.replace(/[#?]/, r);
    }
    Object.defineProperty(t, "__esModule", { value: !0 });
    var n,
      i = (function() {
        function p() {
          (this._scheme = p._empty),
            (this._authority = p._empty),
            (this._path = p._empty),
            (this._query = p._empty),
            (this._fragment = p._empty),
            (this._formatted = null),
            (this._fsPath = null);
        }
        return (
          (p.isUri = function(e) {
            return (
              e instanceof p ||
              (!!e &&
                "string" == typeof e.authority &&
                  "string" == typeof e.fragment &&
                  "string" == typeof e.path &&
                  "string" == typeof e.query &&
                  "string" == typeof e.scheme)
            );
          }),
          Object.defineProperty(p.prototype, "scheme", {
            get: function() {
              return this._scheme;
            },
            enumerable: !0,
            configurable: !0
          }),
          Object.defineProperty(p.prototype, "authority", {
            get: function() {
              return this._authority;
            },
            enumerable: !0,
            configurable: !0
          }),
          Object.defineProperty(p.prototype, "path", {
            get: function() {
              return this._path;
            },
            enumerable: !0,
            configurable: !0
          }),
          Object.defineProperty(p.prototype, "query", {
            get: function() {
              return this._query;
            },
            enumerable: !0,
            configurable: !0
          }),
          Object.defineProperty(p.prototype, "fragment", {
            get: function() {
              return this._fragment;
            },
            enumerable: !0,
            configurable: !0
          }),
          Object.defineProperty(p.prototype, "fsPath", {
            get: function() {
              var e;
              this._fsPath ||
                ((e =
                  this._authority && this._path && "file" === this.scheme
                    ? "//" + this._authority + this._path
                    : p._driveLetterPath.test(this._path)
                    ? this._path[1].toLowerCase() + this._path.substr(2)
                    : this._path),
                n && (e = e.replace(/\//g, "\\")),
                (this._fsPath = e));
              return this._fsPath;
            },
            enumerable: !0,
            configurable: !0
          }),
          (p.prototype.with = function(e) {
            if (!e) return this;
            var t = e.scheme,
              r = e.authority,
              n = e.path,
              i = e.query,
              o = e.fragment;
            if (
              (void 0 === t ? (t = this.scheme) : null === t && (t = ""),
              void 0 === r ? (r = this.authority) : null === r && (r = ""),
              void 0 === n ? (n = this.path) : null === n && (n = ""),
              void 0 === i ? (i = this.query) : null === i && (i = ""),
              void 0 === o ? (o = this.fragment) : null === o && (o = ""),
              t === this.scheme &&
                r === this.authority &&
                n === this.path &&
                i === this.query &&
                o === this.fragment)
            )
              return this;
            var a = new p();
            return (
              (a._scheme = t),
              (a._authority = r),
              (a._path = n),
              (a._query = i),
              (a._fragment = o),
              p._validate(a),
              a
            );
          }),
          (p.parse = function(e) {
            var t = new p(),
              r = p._parseComponents(e);
            return (
              (t._scheme = r.scheme),
              (t._authority = decodeURIComponent(r.authority)),
              (t._path = decodeURIComponent(r.path)),
              (t._query = decodeURIComponent(r.query)),
              (t._fragment = decodeURIComponent(r.fragment)),
              p._validate(t),
              t
            );
          }),
          (p.file = function(e) {
            var t = new p();
            if (
              ((t._scheme = "file"),
              n && (e = e.replace(/\\/g, p._slash)),
              e[0] === p._slash && e[0] === e[1])
            ) {
              var r = e.indexOf(p._slash, 2);
              -1 === r
                ? (t._authority = e.substring(2))
                : ((t._authority = e.substring(2, r)),
                  (t._path = e.substring(r)));
            } else t._path = e;
            return (
              t._path[0] !== p._slash && (t._path = p._slash + t._path),
              p._validate(t),
              t
            );
          }),
          (p._parseComponents = function(e) {
            var t = {
                scheme: p._empty,
                authority: p._empty,
                path: p._empty,
                query: p._empty,
                fragment: p._empty
              },
              r = p._regexp.exec(e);
            return (
              r &&
                ((t.scheme = r[2] || t.scheme),
                (t.authority = r[4] || t.authority),
                (t.path = r[5] || t.path),
                (t.query = r[7] || t.query),
                (t.fragment = r[9] || t.fragment)),
              t
            );
          }),
          (p.from = function(e) {
            return new p().with(e);
          }),
          (p._validate = function(e) {
            if (e.scheme && !p._schemePattern.test(e.scheme))
              throw new Error(
                "[UriError]: Scheme contains illegal characters."
              );
            if (e.path)
              if (e.authority) {
                if (!p._singleSlashStart.test(e.path))
                  throw new Error(
                    '[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character'
                  );
              } else if (p._doubleSlashStart.test(e.path))
                throw new Error(
                  '[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")'
                );
          }),
          (p.prototype.toString = function(e) {
            return (
              void 0 === e && (e = !1),
              e
                ? p._asFormatted(this, !0)
                : (this._formatted ||
                    (this._formatted = p._asFormatted(this, !1)),
                  this._formatted)
            );
          }),
          (p._asFormatted = function(e, t) {
            var r = t ? d : h,
              n = [],
              i = e.scheme,
              o = e.authority,
              a = e.path,
              s = e.query,
              u = e.fragment;
            (i && n.push(i, ":"), (o || "file" === i) && n.push("//"), o) &&
              (-1 === (f = (o = o.toLowerCase()).indexOf(":"))
                ? n.push(r(o))
                : n.push(r(o.substr(0, f)), o.substr(f)));
            if (a) {
              var c = p._upperCaseDrive.exec(a);
              c &&
                (a = c[1]
                  ? "/" + c[2].toLowerCase() + a.substr(3)
                  : c[2].toLowerCase() + a.substr(2));
              for (var l = 0; ; ) {
                var f;
                if (-1 === (f = a.indexOf(p._slash, l))) {
                  n.push(r(a.substring(l)));
                  break;
                }
                n.push(r(a.substring(l, f)), p._slash), (l = f + 1);
              }
            }
            return (
              s && n.push("?", r(s)), u && n.push("#", r(u)), n.join(p._empty)
            );
          }),
          (p.prototype.toJSON = function() {
            var e = { fsPath: this.fsPath, external: this.toString(), $mid: 1 };
            return (
              this.path && (e.path = this.path),
              this.scheme && (e.scheme = this.scheme),
              this.authority && (e.authority = this.authority),
              this.query && (e.query = this.query),
              this.fragment && (e.fragment = this.fragment),
              e
            );
          }),
          (p.revive = function(e) {
            var t = new p();
            return (
              (t._scheme = e.scheme || p._empty),
              (t._authority = e.authority || p._empty),
              (t._path = e.path || p._empty),
              (t._query = e.query || p._empty),
              (t._fragment = e.fragment || p._empty),
              (t._fsPath = e.fsPath),
              (t._formatted = e.external),
              p._validate(t),
              t
            );
          }),
          p
        );
      })();
    if (
      ((i._empty = ""),
      (i._slash = "/"),
      (i._regexp = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/),
      (i._driveLetterPath = /^\/[a-zA-z]:/),
      (i._upperCaseDrive = /^(\/)?([A-Z]:)/),
      (i._schemePattern = /^\w[\w\d+.-]*$/),
      (i._singleSlashStart = /^\//),
      (i._doubleSlashStart = /^\/\//),
      (t.default = i),
      "object" == typeof process)
    )
      n = "win32" === process.platform;
    else if ("object" == typeof navigator) {
      var o = navigator.userAgent;
      n = 0 <= o.indexOf("Windows");
    }
  }),
  define("vscode-uri", ["vscode-uri/index"], function(e) {
    return e;
  });
var __extends =
  (this && this.__extends) ||
  (function() {
    var n =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function(e, t) {
          e.__proto__ = t;
        }) ||
      function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
      };
    return function(e, t) {
      function r() {
        this.constructor = e;
      }
      n(e, t),
        (e.prototype =
          null === t
            ? Object.create(t)
            : ((r.prototype = t.prototype), new r()));
    };
  })();
!(function(e) {
  if ("object" == typeof module && "object" == typeof module.exports) {
    var t = e(require, exports);
    void 0 !== t && (module.exports = t);
  } else
    "function" == typeof define &&
      define.amd &&
      define("vscode-json-languageservice/parser/jsonParser", [
        "require",
        "exports",
        "jsonc-parser",
        "../utils/objects",
        "vscode-nls",
        "vscode-uri"
      ], e);
})(function(e, t) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var g,
    r,
    i = e("jsonc-parser"),
    h = e("../utils/objects"),
    n = e("vscode-nls"),
    o = e("vscode-uri"),
    v = n.loadMessageBundle();
  ((r = g = t.ErrorCode || (t.ErrorCode = {}))[(r.Undefined = 0)] =
    "Undefined"),
    (r[(r.EnumValueMismatch = 1)] = "EnumValueMismatch"),
    (r[(r.UnexpectedEndOfComment = 257)] = "UnexpectedEndOfComment"),
    (r[(r.UnexpectedEndOfString = 258)] = "UnexpectedEndOfString"),
    (r[(r.UnexpectedEndOfNumber = 259)] = "UnexpectedEndOfNumber"),
    (r[(r.InvalidUnicode = 260)] = "InvalidUnicode"),
    (r[(r.InvalidEscapeCharacter = 261)] = "InvalidEscapeCharacter"),
    (r[(r.InvalidCharacter = 262)] = "InvalidCharacter"),
    (r[(r.PropertyExpected = 513)] = "PropertyExpected"),
    (r[(r.CommaExpected = 514)] = "CommaExpected"),
    (r[(r.ColonExpected = 515)] = "ColonExpected"),
    (r[(r.ValueExpected = 516)] = "ValueExpected"),
    (r[(r.CommaOrCloseBacketExpected = 517)] = "CommaOrCloseBacketExpected"),
    (r[(r.CommaOrCloseBraceExpected = 518)] = "CommaOrCloseBraceExpected"),
    (r[(r.TrailingComma = 519)] = "TrailingComma");
  var y,
    a,
    s = /^#([0-9A-Fa-f]{3,4}|([0-9A-Fa-f]{2}){3,4})$/,
    u = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  ((a = y = t.ProblemSeverity || (t.ProblemSeverity = {})).Ignore = "ignore"),
    (a.Error = "error"),
    (a.Warning = "warning");
  var c = (function() {
      function e(e, t, r, n, i) {
        (this.type = t),
          (this.location = r),
          (this.start = n),
          (this.end = i),
          (this.parent = e);
      }
      return (
        (e.prototype.getPath = function() {
          var e = this.parent ? this.parent.getPath() : [];
          return null !== this.location && e.push(this.location), e;
        }),
        (e.prototype.getChildNodes = function() {
          return [];
        }),
        (e.prototype.getLastChild = function() {
          return null;
        }),
        (e.prototype.getValue = function() {}),
        (e.prototype.contains = function(e, t) {
          return (
            void 0 === t && (t = !1),
            (e >= this.start && e < this.end) || (t && e === this.end)
          );
        }),
        (e.prototype.toString = function() {
          return (
            "type: " +
            this.type +
            " (" +
            this.start +
            "/" +
            this.end +
            ")" +
            (this.parent ? " parent: {" + this.parent.toString() + "}" : "")
          );
        }),
        (e.prototype.visit = function(e) {
          return e(this);
        }),
        (e.prototype.getNodeFromOffset = function(i) {
          var o = function(e) {
            if (i >= e.start && i < e.end) {
              for (
                var t = e.getChildNodes(), r = 0;
                r < t.length && t[r].start <= i;
                r++
              ) {
                var n = o(t[r]);
                if (n) return n;
              }
              return e;
            }
            return null;
          };
          return o(this);
        }),
        (e.prototype.getNodeFromOffsetEndInclusive = function(i) {
          var o = function(e) {
            if (i >= e.start && i <= e.end) {
              for (
                var t = e.getChildNodes(), r = 0;
                r < t.length && t[r].start <= i;
                r++
              ) {
                var n = o(t[r]);
                if (n) return n;
              }
              return e;
            }
            return null;
          };
          return o(this);
        }),
        (e.prototype.validate = function(e, t, u) {
          var c = this;
          if (u.include(this)) {
            Array.isArray(e.type)
              ? -1 === e.type.indexOf(this.type) &&
                t.problems.push({
                  location: { start: this.start, end: this.end },
                  severity: y.Warning,
                  message:
                    e.errorMessage ||
                    v(
                      "typeArrayMismatchWarning",
                      "Incorrect type. Expected one of {0}.",
                      e.type.join(", ")
                    )
                })
              : e.type &&
                this.type !== e.type &&
                t.problems.push({
                  location: { start: this.start, end: this.end },
                  severity: y.Warning,
                  message:
                    e.errorMessage ||
                    v(
                      "typeMismatchWarning",
                      'Incorrect type. Expected "{0}".',
                      e.type
                    )
                }),
              Array.isArray(e.allOf) &&
                e.allOf.forEach(function(e) {
                  c.validate(d(e), t, u);
                });
            var r = d(e.not);
            if (r) {
              var n = new m(),
                i = u.newSub();
              this.validate(r, n, i),
                n.hasProblems() ||
                  t.problems.push({
                    location: { start: this.start, end: this.end },
                    severity: y.Warning,
                    message: v(
                      "notSchemaWarning",
                      "Matches a schema that is not allowed."
                    )
                  }),
                i.schemas.forEach(function(e) {
                  (e.inverted = !e.inverted), u.add(e);
                });
            }
            var o = function(e, o) {
              var a = [],
                s = null;
              return (
                e.forEach(function(e) {
                  var t = d(e),
                    r = new m(),
                    n = u.newSub();
                  if ((c.validate(t, r, n), r.hasProblems() || a.push(t), s))
                    if (
                      o ||
                      r.hasProblems() ||
                      s.validationResult.hasProblems()
                    ) {
                      var i = r.compare(s.validationResult);
                      0 < i
                        ? (s = {
                            schema: t,
                            validationResult: r,
                            matchingSchemas: n
                          })
                        : 0 === i &&
                          (s.matchingSchemas.merge(n),
                          s.validationResult.mergeEnumValues(r));
                    } else
                      s.matchingSchemas.merge(n),
                        (s.validationResult.propertiesMatches +=
                          r.propertiesMatches),
                        (s.validationResult.propertiesValueMatches +=
                          r.propertiesValueMatches);
                  else
                    s = { schema: t, validationResult: r, matchingSchemas: n };
                }),
                1 < a.length &&
                  o &&
                  t.problems.push({
                    location: { start: c.start, end: c.start + 1 },
                    severity: y.Warning,
                    message: v(
                      "oneOfWarning",
                      "Matches multiple schemas when only one must validate."
                    )
                  }),
                null !== s &&
                  (t.merge(s.validationResult),
                  (t.propertiesMatches += s.validationResult.propertiesMatches),
                  (t.propertiesValueMatches +=
                    s.validationResult.propertiesValueMatches),
                  u.merge(s.matchingSchemas)),
                a.length
              );
            };
            if (
              (Array.isArray(e.anyOf) && o(e.anyOf, !1),
              Array.isArray(e.oneOf) && o(e.oneOf, !0),
              Array.isArray(e.enum))
            ) {
              for (
                var a = this.getValue(), s = !1, l = 0, f = e.enum;
                l < f.length;
                l++
              ) {
                var p = f[l];
                if (h.equals(a, p)) {
                  s = !0;
                  break;
                }
              }
              (t.enumValues = e.enum),
                (t.enumValueMatch = s) ||
                  t.problems.push({
                    location: { start: this.start, end: this.end },
                    severity: y.Warning,
                    code: g.EnumValueMismatch,
                    message:
                      e.errorMessage ||
                      v(
                        "enumWarning",
                        "Value is not accepted. Valid values: {0}.",
                        e.enum
                          .map(function(e) {
                            return JSON.stringify(e);
                          })
                          .join(", ")
                      )
                  });
            }
            if (e.const) {
              a = this.getValue();
              h.equals(a, e.const)
                ? (t.enumValueMatch = !0)
                : (t.problems.push({
                    location: { start: this.start, end: this.end },
                    severity: y.Warning,
                    code: g.EnumValueMismatch,
                    message:
                      e.errorMessage ||
                      v(
                        "constWarning",
                        "Value must be {0}.",
                        JSON.stringify(e.const)
                      )
                  }),
                  (t.enumValueMatch = !1)),
                (t.enumValues = [e.const]);
            }
            e.deprecationMessage &&
              this.parent &&
              t.problems.push({
                location: { start: this.parent.start, end: this.parent.end },
                severity: y.Warning,
                message: e.deprecationMessage
              }),
              u.add({ node: this, schema: e });
          }
        }),
        e
      );
    })(),
    b = (function(i) {
      function e(e, t, r, n) {
        return i.call(this, e, "null", t, r, n) || this;
      }
      return (
        __extends(e, i),
        (e.prototype.getValue = function() {
          return null;
        }),
        e
      );
    })((t.ASTNode = c));
  t.NullASTNode = b;
  var x = (function(a) {
    function e(e, t, r, n, i) {
      var o = a.call(this, e, "boolean", t, n, i) || this;
      return (o.value = r), o;
    }
    return (
      __extends(e, a),
      (e.prototype.getValue = function() {
        return this.value;
      }),
      e
    );
  })(c);
  t.BooleanASTNode = x;
  var S = (function(l) {
    function e(e, t, r, n) {
      var i = l.call(this, e, "array", t, r, n) || this;
      return (i.items = []), i;
    }
    return (
      __extends(e, l),
      (e.prototype.getChildNodes = function() {
        return this.items;
      }),
      (e.prototype.getLastChild = function() {
        return this.items[this.items.length - 1];
      }),
      (e.prototype.getValue = function() {
        return this.items.map(function(e) {
          return e.getValue();
        });
      }),
      (e.prototype.addItem = function(e) {
        return !!e && (this.items.push(e), !0);
      }),
      (e.prototype.visit = function(e) {
        for (var t = e(this), r = 0; r < this.items.length && t; r++)
          t = this.items[r].visit(e);
        return t;
      }),
      (e.prototype.validate = function(e, o, a) {
        var s = this;
        if (a.include(this)) {
          if (
            (l.prototype.validate.call(this, e, o, a), Array.isArray(e.items))
          ) {
            var u = e.items;
            if (
              (u.forEach(function(e, t) {
                var r = d(e),
                  n = new m(),
                  i = s.items[t];
                i
                  ? (i.validate(r, n, a), o.mergePropertyMatch(n))
                  : s.items.length >= u.length && o.propertiesValueMatches++;
              }),
              this.items.length > u.length)
            )
              if ("object" == typeof e.additionalItems)
                for (var t = u.length; t < this.items.length; t++) {
                  var r = new m();
                  this.items[t].validate(e.additionalItems, r, a),
                    o.mergePropertyMatch(r);
                }
              else
                !1 === e.additionalItems &&
                  o.problems.push({
                    location: { start: this.start, end: this.end },
                    severity: y.Warning,
                    message: v(
                      "additionalItemsWarning",
                      "Array has too many items according to schema. Expected {0} or fewer.",
                      u.length
                    )
                  });
          } else {
            var n = d(e.items);
            n &&
              this.items.forEach(function(e) {
                var t = new m();
                e.validate(n, t, a), o.mergePropertyMatch(t);
              });
          }
          var i = d(e.contains);
          if (i)
            this.items.some(function(e) {
              var t = new m();
              return e.validate(i, t, p.instance), !t.hasProblems();
            }) ||
              o.problems.push({
                location: { start: this.start, end: this.end },
                severity: y.Warning,
                message:
                  e.errorMessage ||
                  v(
                    "requiredItemMissingWarning",
                    "Array does not contain required item.",
                    e.minItems
                  )
              });
          if (
            (e.minItems &&
              this.items.length < e.minItems &&
              o.problems.push({
                location: { start: this.start, end: this.end },
                severity: y.Warning,
                message: v(
                  "minItemsWarning",
                  "Array has too few items. Expected {0} or more.",
                  e.minItems
                )
              }),
            e.maxItems &&
              this.items.length > e.maxItems &&
              o.problems.push({
                location: { start: this.start, end: this.end },
                severity: y.Warning,
                message: v(
                  "maxItemsWarning",
                  "Array has too many items. Expected {0} or fewer.",
                  e.minItems
                )
              }),
            !0 === e.uniqueItems)
          ) {
            var c = this.items.map(function(e) {
              return e.getValue();
            });
            c.some(function(e, t) {
              return t !== c.lastIndexOf(e);
            }) &&
              o.problems.push({
                location: { start: this.start, end: this.end },
                severity: y.Warning,
                message: v("uniqueItemsWarning", "Array has duplicate items.")
              });
          }
        }
      }),
      e
    );
  })(c);
  t.ArrayASTNode = S;
  var j = (function(f) {
    function e(e, t, r, n) {
      var i = f.call(this, e, "number", t, r, n) || this;
      return (i.isInteger = !0), (i.value = Number.NaN), i;
    }
    return (
      __extends(e, f),
      (e.prototype.getValue = function() {
        return this.value;
      }),
      (e.prototype.validate = function(e, t, r) {
        if (r.include(this)) {
          var n = !1;
          ("integer" === e.type ||
            (Array.isArray(e.type) && -1 !== e.type.indexOf("integer"))) &&
            (n = !0),
            n && !0 === this.isInteger && (this.type = "integer"),
            f.prototype.validate.call(this, e, t, r),
            (this.type = "number");
          var i = this.getValue();
          "number" == typeof e.multipleOf &&
            i % e.multipleOf != 0 &&
            t.problems.push({
              location: { start: this.start, end: this.end },
              severity: y.Warning,
              message: v(
                "multipleOfWarning",
                "Value is not divisible by {0}.",
                e.multipleOf
              )
            });
          var o = c(e.minimum, e.exclusiveMinimum);
          "number" == typeof o &&
            i <= o &&
            t.problems.push({
              location: { start: this.start, end: this.end },
              severity: y.Warning,
              message: v(
                "exclusiveMinimumWarning",
                "Value is below the exclusive minimum of {0}.",
                o
              )
            });
          var a = c(e.maximum, e.exclusiveMaximum);
          "number" == typeof a &&
            a <= i &&
            t.problems.push({
              location: { start: this.start, end: this.end },
              severity: y.Warning,
              message: v(
                "exclusiveMaximumWarning",
                "Value is above the exclusive maximum of {0}.",
                a
              )
            });
          var s = l(e.minimum, e.exclusiveMinimum);
          "number" == typeof s &&
            i < s &&
            t.problems.push({
              location: { start: this.start, end: this.end },
              severity: y.Warning,
              message: v(
                "minimumWarning",
                "Value is below the minimum of {0}.",
                s
              )
            });
          var u = l(e.maximum, e.exclusiveMaximum);
          "number" == typeof u &&
            u < i &&
            t.problems.push({
              location: { start: this.start, end: this.end },
              severity: y.Warning,
              message: v(
                "maximumWarning",
                "Value is above the maximum of {0}.",
                u
              )
            });
        }
        function c(e, t) {
          return "number" == typeof t
            ? t
            : "boolean" == typeof t && t
            ? e
            : void 0;
        }
        function l(e, t) {
          if ("boolean" != typeof t || !t) return e;
        }
      }),
      e
    );
  })(c);
  t.NumberASTNode = j;
  var O = (function(a) {
    function e(e, t, r, n, i) {
      var o = a.call(this, e, "string", t, n, i) || this;
      return (o.isKey = r), (o.value = ""), o;
    }
    return (
      __extends(e, a),
      (e.prototype.getValue = function() {
        return this.value;
      }),
      (e.prototype.validate = function(e, t, r) {
        if (r.include(this)) {
          if (
            (a.prototype.validate.call(this, e, t, r),
            e.minLength &&
              this.value.length < e.minLength &&
              t.problems.push({
                location: { start: this.start, end: this.end },
                severity: y.Warning,
                message: v(
                  "minLengthWarning",
                  "String is shorter than the minimum length of {0}.",
                  e.minLength
                )
              }),
            e.maxLength &&
              this.value.length > e.maxLength &&
              t.problems.push({
                location: { start: this.start, end: this.end },
                severity: y.Warning,
                message: v(
                  "maxLengthWarning",
                  "String is longer than the maximum length of {0}.",
                  e.maxLength
                )
              }),
            e.pattern)
          )
            new RegExp(e.pattern).test(this.value) ||
              t.problems.push({
                location: { start: this.start, end: this.end },
                severity: y.Warning,
                message:
                  e.patternErrorMessage ||
                  e.errorMessage ||
                  v(
                    "patternWarning",
                    'String does not match the pattern of "{0}".',
                    e.pattern
                  )
              });
          if (e.format)
            switch (e.format) {
              case "uri":
              case "uri-reference":
                var n = void 0;
                if (this.value)
                  try {
                    o.default.parse(this.value).scheme ||
                      "uri" !== e.format ||
                      (n = v(
                        "uriSchemeMissing",
                        "URI with a scheme is expected."
                      ));
                  } catch (e) {
                    n = e.message;
                  }
                else n = v("uriEmpty", "URI expected.");
                n &&
                  t.problems.push({
                    location: { start: this.start, end: this.end },
                    severity: y.Warning,
                    message:
                      e.patternErrorMessage ||
                      e.errorMessage ||
                      v("uriFormatWarning", "String is not a URI: {0}", n)
                  });
                break;
              case "email":
                this.value.match(u) ||
                  t.problems.push({
                    location: { start: this.start, end: this.end },
                    severity: y.Warning,
                    message:
                      e.patternErrorMessage ||
                      e.errorMessage ||
                      v(
                        "emailFormatWarning",
                        "String is not an e-mail address."
                      )
                  });
                break;
              case "color-hex":
                this.value.match(s) ||
                  t.problems.push({
                    location: { start: this.start, end: this.end },
                    severity: y.Warning,
                    message:
                      e.patternErrorMessage ||
                      e.errorMessage ||
                      v(
                        "colorHexFormatWarning",
                        "Invalid color format. Use #RGB, #RGBA, #RRGGBB or #RRGGBBAA."
                      )
                  });
            }
        }
      }),
      e
    );
  })(c);
  t.StringASTNode = O;
  var T = (function(n) {
    function e(e, t) {
      var r = n.call(this, e, "property", null, t.start) || this;
      return (
        ((r.key = t).parent = r),
        (t.location = t.value),
        (r.colonOffset = -1),
        r
      );
    }
    return (
      __extends(e, n),
      (e.prototype.getChildNodes = function() {
        return this.value ? [this.key, this.value] : [this.key];
      }),
      (e.prototype.getLastChild = function() {
        return this.value;
      }),
      (e.prototype.setValue = function(e) {
        return null !== (this.value = e);
      }),
      (e.prototype.visit = function(e) {
        return (
          e(this) && this.key.visit(e) && this.value && this.value.visit(e)
        );
      }),
      (e.prototype.validate = function(e, t, r) {
        r.include(this) && this.value && this.value.validate(e, t, r);
      }),
      e
    );
  })(c);
  t.PropertyASTNode = T;
  var l,
    C = (function(o) {
      function e(e, t, r, n) {
        var i = o.call(this, e, "object", t, r, n) || this;
        return (i.properties = []), i;
      }
      return (
        __extends(e, o),
        (e.prototype.getChildNodes = function() {
          return this.properties;
        }),
        (e.prototype.getLastChild = function() {
          return this.properties[this.properties.length - 1];
        }),
        (e.prototype.addProperty = function(e) {
          return !!e && (this.properties.push(e), !0);
        }),
        (e.prototype.getFirstProperty = function(e) {
          for (var t = 0; t < this.properties.length; t++)
            if (this.properties[t].key.value === e) return this.properties[t];
          return null;
        }),
        (e.prototype.getKeyList = function() {
          return this.properties.map(function(e) {
            return e.key.getValue();
          });
        }),
        (e.prototype.getValue = function() {
          var r = Object.create(null);
          return (
            this.properties.forEach(function(e) {
              var t = e.value && e.value.getValue();
              void 0 !== t && (r[e.key.getValue()] = t);
            }),
            r
          );
        }),
        (e.prototype.visit = function(e) {
          for (var t = e(this), r = 0; r < this.properties.length && t; r++)
            t = this.properties[r].visit(e);
          return t;
        }),
        (e.prototype.validate = function(s, u, c) {
          var i = this;
          if (c.include(this)) {
            o.prototype.validate.call(this, s, u, c);
            var l = Object.create(null),
              r = [];
            this.properties.forEach(function(e) {
              var t = e.key.value;
              (l[t] = e.value), r.push(t);
            }),
              Array.isArray(s.required) &&
                s.required.forEach(function(e) {
                  if (!l[e]) {
                    var t = i.parent && i.parent && i.parent.key,
                      r = t
                        ? { start: t.start, end: t.end }
                        : { start: i.start, end: i.start + 1 };
                    u.problems.push({
                      location: r,
                      severity: y.Warning,
                      message: v(
                        "MissingRequiredPropWarning",
                        'Missing property "{0}".',
                        e
                      )
                    });
                  }
                });
            var f = function(e) {
              for (var t = r.indexOf(e); 0 <= t; )
                r.splice(t, 1), (t = r.indexOf(e));
            };
            s.properties &&
              Object.keys(s.properties).forEach(function(e) {
                f(e);
                var t = s.properties[e],
                  r = l[e];
                if (r)
                  if ("boolean" == typeof t)
                    if (t) u.propertiesMatches++, u.propertiesValueMatches++;
                    else {
                      var n = r.parent;
                      u.problems.push({
                        location: { start: n.key.start, end: n.key.end },
                        severity: y.Warning,
                        message:
                          s.errorMessage ||
                          v(
                            "DisallowedExtraPropWarning",
                            "Property {0} is not allowed.",
                            e
                          )
                      });
                    }
                  else {
                    var i = new m();
                    r.validate(t, i, c), u.mergePropertyMatch(i);
                  }
              }),
              s.patternProperties &&
                Object.keys(s.patternProperties).forEach(function(o) {
                  var a = new RegExp(o);
                  r.slice(0).forEach(function(e) {
                    if (a.test(e)) {
                      f(e);
                      var t = l[e];
                      if (t) {
                        var r = s.patternProperties[o];
                        if ("boolean" == typeof r)
                          if (r)
                            u.propertiesMatches++, u.propertiesValueMatches++;
                          else {
                            var n = t.parent;
                            u.problems.push({
                              location: { start: n.key.start, end: n.key.end },
                              severity: y.Warning,
                              message:
                                s.errorMessage ||
                                v(
                                  "DisallowedExtraPropWarning",
                                  "Property {0} is not allowed.",
                                  e
                                )
                            });
                          }
                        else {
                          var i = new m();
                          t.validate(r, i, c), u.mergePropertyMatch(i);
                        }
                      }
                    }
                  });
                }),
              "object" == typeof s.additionalProperties
                ? r.forEach(function(e) {
                    var t = l[e];
                    if (t) {
                      var r = new m();
                      t.validate(s.additionalProperties, r, c),
                        u.mergePropertyMatch(r);
                    }
                  })
                : !1 === s.additionalProperties &&
                  0 < r.length &&
                  r.forEach(function(e) {
                    var t = l[e];
                    if (t) {
                      var r = t.parent;
                      u.problems.push({
                        location: { start: r.key.start, end: r.key.end },
                        severity: y.Warning,
                        message:
                          s.errorMessage ||
                          v(
                            "DisallowedExtraPropWarning",
                            "Property {0} is not allowed.",
                            e
                          )
                      });
                    }
                  }),
              s.maxProperties &&
                this.properties.length > s.maxProperties &&
                u.problems.push({
                  location: { start: this.start, end: this.end },
                  severity: y.Warning,
                  message: v(
                    "MaxPropWarning",
                    "Object has more properties than limit of {0}.",
                    s.maxProperties
                  )
                }),
              s.minProperties &&
                this.properties.length < s.minProperties &&
                u.problems.push({
                  location: { start: this.start, end: this.end },
                  severity: y.Warning,
                  message: v(
                    "MinPropWarning",
                    "Object has fewer properties than the required number of {0}",
                    s.minProperties
                  )
                }),
              s.dependencies &&
                Object.keys(s.dependencies).forEach(function(t) {
                  if (l[t]) {
                    var e = s.dependencies[t];
                    if (Array.isArray(e))
                      e.forEach(function(e) {
                        l[e]
                          ? u.propertiesValueMatches++
                          : u.problems.push({
                              location: { start: i.start, end: i.end },
                              severity: y.Warning,
                              message: v(
                                "RequiredDependentPropWarning",
                                "Object is missing property {0} required by property {1}.",
                                e,
                                t
                              )
                            });
                      });
                    else {
                      var r = d(e);
                      if (r) {
                        var n = new m();
                        i.validate(r, n, c), u.mergePropertyMatch(n);
                      }
                    }
                  }
                });
            var n = d(s.propertyNames);
            n &&
              this.properties.forEach(function(e) {
                var t = e.key;
                t && t.validate(n, u, p.instance);
              });
          }
        }),
        e
      );
    })(c);
  function d(e) {
    return "boolean" == typeof e ? (e ? {} : { not: {} }) : e;
  }
  (t.ObjectASTNode = C),
    (t.asSchema = d),
    ((l = t.EnumMatch || (t.EnumMatch = {}))[(l.Key = 0)] = "Key"),
    (l[(l.Enum = 1)] = "Enum");
  var f = (function() {
      function e(e, t) {
        void 0 === e && (e = -1),
          void 0 === t && (t = null),
          (this.focusOffset = e),
          (this.exclude = t),
          (this.schemas = []);
      }
      return (
        (e.prototype.add = function(e) {
          this.schemas.push(e);
        }),
        (e.prototype.merge = function(e) {
          var t;
          (t = this.schemas).push.apply(t, e.schemas);
        }),
        (e.prototype.include = function(e) {
          return (
            (-1 === this.focusOffset || e.contains(this.focusOffset)) &&
            e !== this.exclude
          );
        }),
        (e.prototype.newSub = function() {
          return new e(-1, this.exclude);
        }),
        e
      );
    })(),
    p = (function() {
      function e() {}
      return (
        Object.defineProperty(e.prototype, "schemas", {
          get: function() {
            return [];
          },
          enumerable: !0,
          configurable: !0
        }),
        (e.prototype.add = function(e) {}),
        (e.prototype.merge = function(e) {}),
        (e.prototype.include = function(e) {
          return !0;
        }),
        (e.prototype.newSub = function() {
          return this;
        }),
        (e.instance = new e()),
        e
      );
    })(),
    m = (function() {
      function e() {
        (this.problems = []),
          (this.propertiesMatches = 0),
          (this.propertiesValueMatches = 0),
          (this.primaryValueMatches = 0),
          (this.enumValueMatch = !1),
          (this.enumValues = null);
      }
      return (
        (e.prototype.hasProblems = function() {
          return !!this.problems.length;
        }),
        (e.prototype.mergeAll = function(e) {
          var t = this;
          e.forEach(function(e) {
            t.merge(e);
          });
        }),
        (e.prototype.merge = function(e) {
          this.problems = this.problems.concat(e.problems);
        }),
        (e.prototype.mergeEnumValues = function(e) {
          if (
            !this.enumValueMatch &&
            !e.enumValueMatch &&
            this.enumValues &&
            e.enumValues
          ) {
            this.enumValues = this.enumValues.concat(e.enumValues);
            for (var t = 0, r = this.problems; t < r.length; t++) {
              var n = r[t];
              n.code === g.EnumValueMismatch &&
                (n.message = v(
                  "enumWarning",
                  "Value is not accepted. Valid values: {0}.",
                  this.enumValues
                    .map(function(e) {
                      return JSON.stringify(e);
                    })
                    .join(", ")
                ));
            }
          }
        }),
        (e.prototype.mergePropertyMatch = function(e) {
          this.merge(e),
            this.propertiesMatches++,
            (e.enumValueMatch || (!e.hasProblems() && e.propertiesMatches)) &&
              this.propertiesValueMatches++,
            e.enumValueMatch &&
              e.enumValues &&
              1 === e.enumValues.length &&
              this.primaryValueMatches++;
        }),
        (e.prototype.compare = function(e) {
          var t = this.hasProblems();
          return t !== e.hasProblems()
            ? t
              ? -1
              : 1
            : this.enumValueMatch !== e.enumValueMatch
            ? e.enumValueMatch
              ? -1
              : 1
            : this.primaryValueMatches !== e.primaryValueMatches
            ? this.primaryValueMatches - e.primaryValueMatches
            : this.propertiesValueMatches !== e.propertiesValueMatches
            ? this.propertiesValueMatches - e.propertiesValueMatches
            : this.propertiesMatches - e.propertiesMatches;
        }),
        e
      );
    })();
  t.ValidationResult = m;
  var A = (function() {
    function e(e, t, r) {
      void 0 === t && (t = []),
        void 0 === r && (r = []),
        (this.root = e),
        (this.syntaxErrors = t),
        (this.comments = r);
    }
    return (
      (e.prototype.getNodeFromOffset = function(e) {
        return this.root && this.root.getNodeFromOffset(e);
      }),
      (e.prototype.getNodeFromOffsetEndInclusive = function(e) {
        return this.root && this.root.getNodeFromOffsetEndInclusive(e);
      }),
      (e.prototype.visit = function(e) {
        this.root && this.root.visit(e);
      }),
      (e.prototype.validate = function(e) {
        if (this.root && e) {
          var t = new m();
          return this.root.validate(e, t, p.instance), t.problems;
        }
        return null;
      }),
      (e.prototype.getMatchingSchemas = function(e, t, r) {
        void 0 === t && (t = -1), void 0 === r && (r = null);
        var n = new f(t, r);
        return this.root && e && this.root.validate(e, new m(), n), n.schemas;
      }),
      e
    );
  })();
  (t.JSONDocument = A),
    (t.parse = function(o, e) {
      var a = [],
        u = o.getText(),
        c = i.createScanner(u, !1),
        t = e && e.collectComments ? [] : void 0;
      function l() {
        for (;;) {
          var e = c.scan();
          switch ((r(), e)) {
            case 12:
            case 13:
              Array.isArray(t) &&
                t.push({
                  start: c.getTokenOffset(),
                  end: c.getTokenOffset() + c.getTokenLength()
                });
              break;
            case 15:
            case 14:
              break;
            default:
              return e;
          }
        }
      }
      function f(e, t, r) {
        (0 !== a.length && a[a.length - 1].location.start === r.start) ||
          a.push({ message: e, location: r, code: t, severity: y.Error });
      }
      function s(e, t, r, n, i) {
        void 0 === r && (r = null),
          void 0 === n && (n = []),
          void 0 === i && (i = []);
        var o = c.getTokenOffset(),
          a = c.getTokenOffset() + c.getTokenLength();
        if (o === a && 0 < o) {
          for (o--; 0 < o && /\s/.test(u.charAt(o)); ) o--;
          a = o + 1;
        }
        if (
          (f(e, t, { start: o, end: a }),
          r && p(r, !1),
          0 < n.length + i.length)
        )
          for (var s = c.getToken(); 17 !== s; ) {
            if (-1 !== n.indexOf(s)) {
              l();
              break;
            }
            if (-1 !== i.indexOf(s)) break;
            s = l();
          }
        return r;
      }
      function r() {
        switch (c.getTokenError()) {
          case 4:
            return (
              s(
                v("InvalidUnicode", "Invalid unicode sequence in string."),
                g.InvalidUnicode
              ),
              !0
            );
          case 5:
            return (
              s(
                v(
                  "InvalidEscapeCharacter",
                  "Invalid escape character in string."
                ),
                g.InvalidEscapeCharacter
              ),
              !0
            );
          case 3:
            return (
              s(
                v("UnexpectedEndOfNumber", "Unexpected end of number."),
                g.UnexpectedEndOfNumber
              ),
              !0
            );
          case 1:
            return (
              s(
                v("UnexpectedEndOfComment", "Unexpected end of comment."),
                g.UnexpectedEndOfComment
              ),
              !0
            );
          case 2:
            return (
              s(
                v("UnexpectedEndOfString", "Unexpected end of string."),
                g.UnexpectedEndOfString
              ),
              !0
            );
          case 6:
            return (
              s(
                v(
                  "InvalidCharacter",
                  "Invalid characters in string. Control characters must be escaped."
                ),
                g.InvalidCharacter
              ),
              !0
            );
        }
        return !1;
      }
      function p(e, t) {
        return (e.end = c.getTokenOffset() + c.getTokenLength()), t && l(), e;
      }
      function h(e, t) {
        var r = d(null, null, !0);
        if (!r) {
          if (16 !== c.getToken()) return null;
          s(
            v("DoubleQuotesExpected", "Property keys must be doublequoted"),
            g.Undefined
          ),
            ((r = new O(
              null,
              null,
              !0,
              c.getTokenOffset(),
              c.getTokenOffset() + c.getTokenLength()
            )).value = c.getTokenValue()),
            l();
        }
        var n = new T(e, r),
          i = t[r.value];
        if (
          (i
            ? (a.push({
                location: { start: n.key.start, end: n.key.end },
                message: v("DuplicateKeyWarning", "Duplicate object key"),
                code: g.Undefined,
                severity: y.Warning
              }),
              i instanceof T &&
                a.push({
                  location: { start: i.key.start, end: i.key.end },
                  message: v("DuplicateKeyWarning", "Duplicate object key"),
                  code: g.Undefined,
                  severity: y.Warning
                }),
              (t[r.value] = !0))
            : (t[r.value] = n),
          6 === c.getToken())
        )
          (n.colonOffset = c.getTokenOffset()), l();
        else if (
          (s(v("ColonExpected", "Colon expected"), g.ColonExpected),
          10 === c.getToken() &&
            o.positionAt(r.end).line < o.positionAt(c.getTokenOffset()).line)
        )
          return (n.end = r.end), n;
        return n.setValue(m(n, r.value))
          ? ((n.end = n.value.end), n)
          : s(
              v("ValueExpected", "Value expected"),
              g.ValueExpected,
              n,
              [],
              [2, 5]
            );
      }
      function d(e, t, r) {
        if (10 !== c.getToken()) return null;
        var n = new O(e, t, r, c.getTokenOffset());
        return (n.value = c.getTokenValue()), p(n, !0);
      }
      function m(e, t) {
        return (
          (function(e, t) {
            if (3 !== c.getToken()) return null;
            var r = new S(e, t, c.getTokenOffset());
            l();
            for (
              var n = 0, i = !1;
              4 !== c.getToken() && 17 !== c.getToken();

            ) {
              if (5 === c.getToken()) {
                i || s(v("ValueExpected", "Value expected"), g.ValueExpected);
                var o = c.getTokenOffset();
                if ((l(), 4 === c.getToken())) {
                  i &&
                    f(v("TrailingComma", "Trailing comma"), g.TrailingComma, {
                      start: o,
                      end: o + 1
                    });
                  continue;
                }
              } else
                i && s(v("ExpectedComma", "Expected comma"), g.CommaExpected);
              r.addItem(m(r, n++)) ||
                s(
                  v("PropertyExpected", "Value expected"),
                  g.ValueExpected,
                  null,
                  [],
                  [4, 5]
                ),
                (i = !0);
            }
            return 4 !== c.getToken()
              ? s(
                  v(
                    "ExpectedCloseBracket",
                    "Expected comma or closing bracket"
                  ),
                  g.CommaOrCloseBacketExpected,
                  r
                )
              : p(r, !0);
          })(e, t) ||
          (function(e, t) {
            if (1 !== c.getToken()) return null;
            var r = new C(e, t, c.getTokenOffset()),
              n = Object.create(null);
            l();
            for (var i = !1; 2 !== c.getToken() && 17 !== c.getToken(); ) {
              if (5 === c.getToken()) {
                i ||
                  s(
                    v("PropertyExpected", "Property expected"),
                    g.PropertyExpected
                  );
                var o = c.getTokenOffset();
                if ((l(), 2 === c.getToken())) {
                  i &&
                    f(v("TrailingComma", "Trailing comma"), g.TrailingComma, {
                      start: o,
                      end: o + 1
                    });
                  continue;
                }
              } else
                i && s(v("ExpectedComma", "Expected comma"), g.CommaExpected);
              r.addProperty(h(r, n)) ||
                s(
                  v("PropertyExpected", "Property expected"),
                  g.PropertyExpected,
                  null,
                  [],
                  [2, 5]
                ),
                (i = !0);
            }
            return 2 !== c.getToken()
              ? s(
                  v("ExpectedCloseBrace", "Expected comma or closing brace"),
                  g.CommaOrCloseBraceExpected,
                  r
                )
              : p(r, !0);
          })(e, t) ||
          d(e, t, !1) ||
          (function(e, t) {
            if (11 !== c.getToken()) return null;
            var r = new j(e, t, c.getTokenOffset());
            if (0 === c.getTokenError()) {
              var n = c.getTokenValue();
              try {
                var i = JSON.parse(n);
                if ("number" != typeof i)
                  return s(
                    v("InvalidNumberFormat", "Invalid number format."),
                    g.Undefined,
                    r
                  );
                r.value = i;
              } catch (e) {
                return s(
                  v("InvalidNumberFormat", "Invalid number format."),
                  g.Undefined,
                  r
                );
              }
              r.isInteger = -1 === n.indexOf(".");
            }
            return p(r, !0);
          })(e, t) ||
          (function(e, t) {
            var r;
            switch (c.getToken()) {
              case 7:
                r = new b(e, t, c.getTokenOffset());
                break;
              case 8:
                r = new x(e, t, !0, c.getTokenOffset());
                break;
              case 9:
                r = new x(e, t, !1, c.getTokenOffset());
                break;
              default:
                return null;
            }
            return p(r, !0);
          })(e, t)
        );
      }
      var n = null;
      return (
        17 !== l() &&
          ((n = m(null, null))
            ? 17 !== c.getToken() &&
              s(v("End of file expected", "End of file expected."), g.Undefined)
            : s(
                v(
                  "Invalid symbol",
                  "Expected a JSON object, array or literal."
                ),
                g.Undefined
              )),
        new A(n, a, t)
      );
    });
}),
  (function(e) {
    if ("object" == typeof module && "object" == typeof module.exports) {
      var t = e(require, exports);
      void 0 !== t && (module.exports = t);
    } else
      "function" == typeof define &&
        define.amd &&
        define("vscode-json-languageservice/services/jsonValidation", [
          "require",
          "exports",
          "../parser/jsonParser",
          "vscode-languageserver-types",
          "vscode-nls"
        ], e);
  })(function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var h = e("../parser/jsonParser"),
      a = e("vscode-languageserver-types"),
      d = e("vscode-nls").loadMessageBundle(),
      r = (function() {
        function e(e, t) {
          (this.jsonSchemaService = e),
            (this.promise = t),
            (this.validationEnabled = !0);
        }
        return (
          (e.prototype.configure = function(e) {
            e &&
              ((this.validationEnabled = e.validate),
              (this.commentSeverity = e.allowComments
                ? h.ProblemSeverity.Ignore
                : h.ProblemSeverity.Error));
          }),
          (e.prototype.doValidation = function(i, u, c) {
            var l = this;
            if (!this.validationEnabled) return this.promise.resolve([]);
            var f = [],
              o = {},
              p = function(e) {
                if (e.severity !== h.ProblemSeverity.Ignore) {
                  var t =
                    e.location.start + " " + e.location.end + " " + e.message;
                  if (!o[t]) {
                    o[t] = !0;
                    var r = {
                        start: i.positionAt(e.location.start),
                        end: i.positionAt(e.location.end)
                      },
                      n =
                        e.severity === h.ProblemSeverity.Error
                          ? a.DiagnosticSeverity.Error
                          : a.DiagnosticSeverity.Warning;
                    f.push({ severity: n, range: r, message: e.message });
                  }
                }
              };
            return this.jsonSchemaService
              .getSchemaForResource(i.uri, u)
              .then(function(e) {
                var t = c ? c.trailingCommas : h.ProblemSeverity.Error,
                  r = c ? c.comments : l.commentSeverity;
                if (e) {
                  if (e.errors.length && u.root) {
                    var n = u.root,
                      i =
                        "object" === n.type
                          ? n.getFirstProperty("$schema")
                          : null;
                    if (i) {
                      var o = i.value || i;
                      p({
                        location: { start: o.start, end: o.end },
                        message: e.errors[0],
                        severity: h.ProblemSeverity.Warning
                      });
                    } else
                      p({
                        location: { start: n.start, end: n.start + 1 },
                        message: e.errors[0],
                        severity: h.ProblemSeverity.Warning
                      });
                  } else {
                    var a = u.validate(e.schema);
                    a && a.forEach(p);
                  }
                  m(e.schema) && (t = r = h.ProblemSeverity.Ignore);
                }
                if (
                  (u.syntaxErrors.forEach(function(e) {
                    e.code === h.ErrorCode.TrailingComma && (e.severity = t),
                      p(e);
                  }),
                  r !== h.ProblemSeverity.Ignore)
                ) {
                  var s = d(
                    "InvalidCommentToken",
                    "Comments are not permitted in JSON."
                  );
                  u.comments.forEach(function(e) {
                    p({ location: e, severity: r, message: s });
                  });
                }
                return f;
              });
          }),
          e
        );
      })();
    function m(e) {
      if (e && "object" == typeof e) {
        if (e.allowComments) return !0;
        if (e.allOf) return e.allOf.some(m);
      }
      return !1;
    }
    t.JSONValidation = r;
  }),
  (function(e) {
    if ("object" == typeof module && "object" == typeof module.exports) {
      var t = e(require, exports);
      void 0 !== t && (module.exports = t);
    } else
      "function" == typeof define &&
        define.amd &&
        define("vscode-json-languageservice/utils/colors", [
          "require",
          "exports"
        ], e);
  })(function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var r = 48,
      n = 57,
      i = 65,
      o = 97,
      a = 102;
    function s(e) {
      return e < r
        ? 0
        : e <= n
        ? e - r
        : (e < o && (e += o - i), o <= e && e <= a ? e - o + 10 : 0);
    }
    (t.hexDigit = s),
      (t.colorFromHex = function(e) {
        if ("#" !== e[0]) return null;
        switch (e.length) {
          case 4:
            return {
              red: (17 * s(e.charCodeAt(1))) / 255,
              green: (17 * s(e.charCodeAt(2))) / 255,
              blue: (17 * s(e.charCodeAt(3))) / 255,
              alpha: 1
            };
          case 5:
            return {
              red: (17 * s(e.charCodeAt(1))) / 255,
              green: (17 * s(e.charCodeAt(2))) / 255,
              blue: (17 * s(e.charCodeAt(3))) / 255,
              alpha: (17 * s(e.charCodeAt(4))) / 255
            };
          case 7:
            return {
              red: (16 * s(e.charCodeAt(1)) + s(e.charCodeAt(2))) / 255,
              green: (16 * s(e.charCodeAt(3)) + s(e.charCodeAt(4))) / 255,
              blue: (16 * s(e.charCodeAt(5)) + s(e.charCodeAt(6))) / 255,
              alpha: 1
            };
          case 9:
            return {
              red: (16 * s(e.charCodeAt(1)) + s(e.charCodeAt(2))) / 255,
              green: (16 * s(e.charCodeAt(3)) + s(e.charCodeAt(4))) / 255,
              blue: (16 * s(e.charCodeAt(5)) + s(e.charCodeAt(6))) / 255,
              alpha: (16 * s(e.charCodeAt(7)) + s(e.charCodeAt(8))) / 255
            };
        }
        return null;
      }),
      (t.colorFrom256RGB = function(e, t, r, n) {
        return (
          void 0 === n && (n = 1),
          { red: e / 255, green: t / 255, blue: r / 255, alpha: n }
        );
      });
  }),
  (function(e) {
    if ("object" == typeof module && "object" == typeof module.exports) {
      var t = e(require, exports);
      void 0 !== t && (module.exports = t);
    } else
      "function" == typeof define &&
        define.amd &&
        define("vscode-json-languageservice/services/jsonDocumentSymbols", [
          "require",
          "exports",
          "../utils/strings",
          "../utils/colors",
          "vscode-languageserver-types"
        ], e);
  })(function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var i = e("../utils/strings"),
      f = e("../utils/colors"),
      p = e("vscode-languageserver-types"),
      r = (function() {
        function e(e) {
          this.schemaService = e;
        }
        return (
          (e.prototype.findDocumentSymbols = function(a, e) {
            var s = this,
              t = e.root;
            if (!t) return null;
            var r = a.uri;
            if (
              ("vscode://defaultsettings/keybindings.json" === r ||
                i.endsWith(r.toLowerCase(), "/user/keybindings.json")) &&
              "array" === t.type
            ) {
              var n = [];
              return (
                t.items.forEach(function(e) {
                  if ("object" === e.type) {
                    var t = e.getFirstProperty("key");
                    if (t && t.value) {
                      var r = p.Location.create(
                        a.uri,
                        p.Range.create(
                          a.positionAt(e.start),
                          a.positionAt(e.end)
                        )
                      );
                      n.push({
                        name: t.value.getValue(),
                        kind: p.SymbolKind.Function,
                        location: r
                      });
                    }
                  }
                }),
                n
              );
            }
            var u = function(i, e, o) {
              if ("array" === e.type)
                e.items.forEach(function(e) {
                  u(i, e, o);
                });
              else if ("object" === e.type) {
                e.properties.forEach(function(e) {
                  var t = p.Location.create(
                      a.uri,
                      p.Range.create(a.positionAt(e.start), a.positionAt(e.end))
                    ),
                    r = e.value;
                  if (r) {
                    var n = o ? o + "." + e.key.value : e.key.value;
                    i.push({
                      name: e.key.getValue(),
                      kind: s.getSymbolKind(r.type),
                      location: t,
                      containerName: o
                    }),
                      u(i, r, n);
                  }
                });
              }
              return i;
            };
            return u([], t, void 0);
          }),
          (e.prototype.getSymbolKind = function(e) {
            switch (e) {
              case "object":
                return p.SymbolKind.Module;
              case "string":
                return p.SymbolKind.String;
              case "number":
                return p.SymbolKind.Number;
              case "array":
                return p.SymbolKind.Array;
              case "boolean":
                return p.SymbolKind.Boolean;
              default:
                return p.SymbolKind.Variable;
            }
          }),
          (e.prototype.findDocumentColors = function(c, l) {
            return this.schemaService
              .getSchemaForResource(c.uri, l)
              .then(function(e) {
                var t = [];
                if (e)
                  for (
                    var r = {}, n = 0, i = l.getMatchingSchemas(e.schema);
                    n < i.length;
                    n++
                  ) {
                    var o = i[n];
                    if (
                      !o.inverted &&
                      o.schema &&
                      ("color" === o.schema.format ||
                        "color-hex" === o.schema.format) &&
                      o.node &&
                      "string" === o.node.type
                    ) {
                      var a = String(o.node.start);
                      if (!r[a]) {
                        var s = f.colorFromHex(o.node.getValue());
                        if (s) {
                          var u = p.Range.create(
                            c.positionAt(o.node.start),
                            c.positionAt(o.node.end)
                          );
                          t.push({ color: s, range: u });
                        }
                        r[a] = !0;
                      }
                    }
                  }
                return t;
              });
          }),
          (e.prototype.getColorPresentations = function(e, t, r, n) {
            var i,
              o = [],
              a = Math.round(255 * r.red),
              s = Math.round(255 * r.green),
              u = Math.round(255 * r.blue);
            function c(e) {
              var t = e.toString(16);
              return 2 !== t.length ? "0" + t : t;
            }
            return (
              (i =
                1 === r.alpha
                  ? "#" + c(a) + c(s) + c(u)
                  : "#" + c(a) + c(s) + c(u) + c(Math.round(255 * r.alpha))),
              o.push({
                label: i,
                textEdit: p.TextEdit.replace(n, JSON.stringify(i))
              }),
              o
            );
          }),
          e
        );
      })();
    t.JSONDocumentSymbols = r;
  }),
  (function(e) {
    if ("object" == typeof module && "object" == typeof module.exports) {
      var t = e(require, exports);
      void 0 !== t && (module.exports = t);
    } else
      "function" == typeof define &&
        define.amd &&
        define("vscode-json-languageservice/services/configuration", [
          "require",
          "exports",
          "vscode-nls"
        ], e);
  })(function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var r = e("vscode-nls").loadMessageBundle();
    t.schemaContributions = {
      schemaAssociations: {},
      schemas: {
        "http://json-schema.org/draft-04/schema#": {
          title: r(
            "schema.json",
            "Describes a JSON file using a schema. See json-schema.org for more info."
          ),
          $schema: "http://json-schema.org/draft-04/schema#",
          definitions: {
            schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } },
            positiveInteger: { type: "integer", minimum: 0 },
            positiveIntegerDefault0: {
              allOf: [{ $ref: "#/definitions/positiveInteger" }, { default: 0 }]
            },
            simpleTypes: {
              type: "string",
              enum: [
                "array",
                "boolean",
                "integer",
                "null",
                "number",
                "object",
                "string"
              ]
            },
            stringArray: {
              type: "array",
              items: { type: "string" },
              minItems: 1,
              uniqueItems: !0
            }
          },
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uri",
              description: r(
                "schema.json.id",
                "A unique identifier for the schema."
              )
            },
            $schema: {
              type: "string",
              format: "uri",
              description: r(
                "schema.json.$schema",
                "The schema to verify this document against "
              )
            },
            title: {
              type: "string",
              description: r(
                "schema.json.title",
                "A descriptive title of the element"
              )
            },
            description: {
              type: "string",
              description: r(
                "schema.json.description",
                "A long description of the element. Used in hover menus and suggestions."
              )
            },
            default: {
              description: r(
                "schema.json.default",
                "A default value. Used by suggestions."
              )
            },
            multipleOf: {
              type: "number",
              minimum: 0,
              exclusiveMinimum: !0,
              description: r(
                "schema.json.multipleOf",
                "A number that should cleanly divide the current value (i.e. have no remainder)"
              )
            },
            maximum: {
              type: "number",
              description: r(
                "schema.json.maximum",
                "The maximum numerical value, inclusive by default."
              )
            },
            exclusiveMaximum: {
              type: "boolean",
              default: !1,
              description: r(
                "schema.json.exclusiveMaximum",
                "Makes the maximum property exclusive."
              )
            },
            minimum: {
              type: "number",
              description: r(
                "schema.json.minimum",
                "The minimum numerical value, inclusive by default."
              )
            },
            exclusiveMinimum: {
              type: "boolean",
              default: !1,
              description: r(
                "schema.json.exclusiveMininum",
                "Makes the minimum property exclusive."
              )
            },
            maxLength: {
              allOf: [{ $ref: "#/definitions/positiveInteger" }],
              description: r(
                "schema.json.maxLength",
                "The maximum length of a string."
              )
            },
            minLength: {
              allOf: [{ $ref: "#/definitions/positiveIntegerDefault0" }],
              description: r(
                "schema.json.minLength",
                "The minimum length of a string."
              )
            },
            pattern: {
              type: "string",
              format: "regex",
              description: r(
                "schema.json.pattern",
                "A regular expression to match the string against. It is not implicitly anchored."
              )
            },
            additionalItems: {
              anyOf: [{ type: "boolean" }, { $ref: "#" }],
              default: {},
              description: r(
                "schema.json.additionalItems",
                "For arrays, only when items is set as an array. If it is a schema, then this schema validates items after the ones specified by the items array. If it is false, then additional items will cause validation to fail."
              )
            },
            items: {
              anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }],
              default: {},
              description: r(
                "schema.json.items",
                "For arrays. Can either be a schema to validate every element against or an array of schemas to validate each item against in order (the first schema will validate the first element, the second schema will validate the second element, and so on."
              )
            },
            maxItems: {
              allOf: [{ $ref: "#/definitions/positiveInteger" }],
              description: r(
                "schema.json.maxItems",
                "The maximum number of items that can be inside an array. Inclusive."
              )
            },
            minItems: {
              allOf: [{ $ref: "#/definitions/positiveIntegerDefault0" }],
              description: r(
                "schema.json.minItems",
                "The minimum number of items that can be inside an array. Inclusive."
              )
            },
            uniqueItems: {
              type: "boolean",
              default: !1,
              description: r(
                "schema.json.uniqueItems",
                "If all of the items in the array must be unique. Defaults to false."
              )
            },
            maxProperties: {
              allOf: [{ $ref: "#/definitions/positiveInteger" }],
              description: r(
                "schema.json.maxProperties",
                "The maximum number of properties an object can have. Inclusive."
              )
            },
            minProperties: {
              allOf: [{ $ref: "#/definitions/positiveIntegerDefault0" }],
              description: r(
                "schema.json.minProperties",
                "The minimum number of properties an object can have. Inclusive."
              )
            },
            required: {
              allOf: [{ $ref: "#/definitions/stringArray" }],
              description: r(
                "schema.json.required",
                "An array of strings that lists the names of all properties required on this object."
              )
            },
            additionalProperties: {
              anyOf: [{ type: "boolean" }, { $ref: "#" }],
              default: {},
              description: r(
                "schema.json.additionalProperties",
                "Either a schema or a boolean. If a schema, then used to validate all properties not matched by 'properties' or 'patternProperties'. If false, then any properties not matched by either will cause this schema to fail."
              )
            },
            definitions: {
              type: "object",
              additionalProperties: { $ref: "#" },
              default: {},
              description: r(
                "schema.json.definitions",
                "Not used for validation. Place subschemas here that you wish to reference inline with $ref"
              )
            },
            properties: {
              type: "object",
              additionalProperties: { $ref: "#" },
              default: {},
              description: r(
                "schema.json.properties",
                "A map of property names to schemas for each property."
              )
            },
            patternProperties: {
              type: "object",
              additionalProperties: { $ref: "#" },
              default: {},
              description: r(
                "schema.json.patternProperties",
                "A map of regular expressions on property names to schemas for matching properties."
              )
            },
            dependencies: {
              type: "object",
              additionalProperties: {
                anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }]
              },
              description: r(
                "schema.json.dependencies",
                "A map of property names to either an array of property names or a schema. An array of property names means the property named in the key depends on the properties in the array being present in the object in order to be valid. If the value is a schema, then the schema is only applied to the object if the property in the key exists on the object."
              )
            },
            enum: {
              type: "array",
              minItems: 1,
              uniqueItems: !0,
              description: r(
                "schema.json.enum",
                "The set of literal values that are valid"
              )
            },
            type: {
              anyOf: [
                { $ref: "#/definitions/simpleTypes" },
                {
                  type: "array",
                  items: { $ref: "#/definitions/simpleTypes" },
                  minItems: 1,
                  uniqueItems: !0
                }
              ],
              description: r(
                "schema.json.type",
                "Either a string of one of the basic schema types (number, integer, null, array, object, boolean, string) or an array of strings specifying a subset of those types."
              )
            },
            format: {
              anyOf: [
                {
                  type: "string",
                  description: r(
                    "schema.json.format",
                    "Describes the format expected for the value."
                  ),
                  enum: [
                    "date-time",
                    "uri",
                    "email",
                    "hostname",
                    "ipv4",
                    "ipv6",
                    "regex"
                  ]
                },
                { type: "string" }
              ]
            },
            allOf: {
              allOf: [{ $ref: "#/definitions/schemaArray" }],
              description: r(
                "schema.json.allOf",
                "An array of schemas, all of which must match."
              )
            },
            anyOf: {
              allOf: [{ $ref: "#/definitions/schemaArray" }],
              description: r(
                "schema.json.anyOf",
                "An array of schemas, where at least one must match."
              )
            },
            oneOf: {
              allOf: [{ $ref: "#/definitions/schemaArray" }],
              description: r(
                "schema.json.oneOf",
                "An array of schemas, exactly one of which must match."
              )
            },
            not: {
              allOf: [{ $ref: "#" }],
              description: r(
                "schema.json.not",
                "A schema which must not match."
              )
            }
          },
          dependencies: {
            exclusiveMaximum: ["maximum"],
            exclusiveMinimum: ["minimum"]
          },
          default: {}
        }
      }
    };
  }),
  (function(e) {
    if ("object" == typeof module && "object" == typeof module.exports) {
      var t = e(require, exports);
      void 0 !== t && (module.exports = t);
    } else
      "function" == typeof define &&
        define.amd &&
        define("vscode-json-languageservice/services/jsonSchemaService", [
          "require",
          "exports",
          "jsonc-parser",
          "vscode-uri",
          "../utils/strings",
          "../parser/jsonParser",
          "vscode-nls"
        ], e);
  })(function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var a = e("jsonc-parser"),
      n = e("vscode-uri"),
      h = e("../utils/strings"),
      r = e("../parser/jsonParser"),
      f = e("vscode-nls").loadMessageBundle(),
      i = (function() {
        function e(e) {
          try {
            this.patternRegExp = new RegExp(
              h.convertSimple2RegExpPattern(e) + "$"
            );
          } catch (e) {
            this.patternRegExp = null;
          }
          this.schemas = [];
        }
        return (
          (e.prototype.addSchema = function(e) {
            this.schemas.push(e);
          }),
          (e.prototype.matchesPattern = function(e) {
            return this.patternRegExp && this.patternRegExp.test(e);
          }),
          (e.prototype.getSchemas = function() {
            return this.schemas;
          }),
          e
        );
      })(),
      o = (function() {
        function e(e, t, r) {
          (this.service = e),
            (this.url = t),
            r &&
              (this.unresolvedSchema = this.service.promise.resolve(new s(r)));
        }
        return (
          (e.prototype.getUnresolvedSchema = function() {
            return (
              this.unresolvedSchema ||
                (this.unresolvedSchema = this.service.loadSchema(this.url)),
              this.unresolvedSchema
            );
          }),
          (e.prototype.getResolvedSchema = function() {
            var t = this;
            return (
              this.resolvedSchema ||
                (this.resolvedSchema = this.getUnresolvedSchema().then(function(
                  e
                ) {
                  return t.service.resolveSchemaContent(e, t.url);
                })),
              this.resolvedSchema
            );
          }),
          (e.prototype.clearSchema = function() {
            (this.resolvedSchema = null), (this.unresolvedSchema = null);
          }),
          e
        );
      })(),
      s = function(e, t) {
        void 0 === t && (t = []), (this.schema = e), (this.errors = t);
      };
    t.UnresolvedSchema = s;
    var p = (function() {
      function e(e, t) {
        void 0 === t && (t = []), (this.schema = e), (this.errors = t);
      }
      return (
        (e.prototype.getSection = function(e) {
          return r.asSchema(this.getSectionRecursive(e, this.schema));
        }),
        (e.prototype.getSectionRecursive = function(t, r) {
          var n = this;
          if (!r || "boolean" == typeof r || 0 === t.length) return r;
          var i = t.shift();
          if (r.properties && (r.properties[i], 1))
            return this.getSectionRecursive(t, r.properties[i]);
          if (r.patternProperties)
            Object.keys(r.patternProperties).forEach(function(e) {
              if (new RegExp(e).test(i))
                return n.getSectionRecursive(t, r.patternProperties[e]);
            });
          else {
            if ("object" == typeof r.additionalProperties)
              return this.getSectionRecursive(t, r.additionalProperties);
            if (i.match("[0-9]+"))
              if (Array.isArray(r.items)) {
                var e = parseInt(i, 10);
                if (!isNaN(e) && r.items[e])
                  return this.getSectionRecursive(t, r.items[e]);
              } else if (r.items) return this.getSectionRecursive(t, r.items);
          }
          return null;
        }),
        e
      );
    })();
    t.ResolvedSchema = p;
    var u = (function() {
      function e(e, t, r) {
        (this.contextService = t),
          (this.requestService = e),
          (this.promiseConstructor = r || Promise),
          (this.callOnDispose = []),
          (this.contributionSchemas = {}),
          (this.contributionAssociations = {}),
          (this.schemasById = {}),
          (this.filePatternAssociations = []),
          (this.filePatternAssociationById = {}),
          (this.registeredSchemasIds = {});
      }
      return (
        (e.prototype.getRegisteredSchemaIds = function(r) {
          return Object.keys(this.registeredSchemasIds).filter(function(e) {
            var t = n.default.parse(e).scheme;
            return "schemaservice" !== t && (!r || r(t));
          });
        }),
        Object.defineProperty(e.prototype, "promise", {
          get: function() {
            return this.promiseConstructor;
          },
          enumerable: !0,
          configurable: !0
        }),
        (e.prototype.dispose = function() {
          for (; 0 < this.callOnDispose.length; ) this.callOnDispose.pop()();
        }),
        (e.prototype.onResourceChange = function(e) {
          e = this.normalizeId(e);
          var t = this.schemasById[e];
          return !!t && (t.clearSchema(), !0);
        }),
        (e.prototype.normalizeId = function(e) {
          return n.default.parse(e).toString();
        }),
        (e.prototype.setSchemaContributions = function(e) {
          var r = this;
          if (e.schemas) {
            var t = e.schemas;
            for (var n in t) {
              var i = this.normalizeId(n);
              this.contributionSchemas[i] = this.addSchemaHandle(i, t[n]);
            }
          }
          if (e.schemaAssociations) {
            var o = e.schemaAssociations;
            for (var a in o) {
              var s = o[a];
              this.contributionAssociations[a] = s;
              var u = this.getOrAddFilePatternAssociation(a);
              s.forEach(function(e) {
                var t = r.normalizeId(e);
                u.addSchema(t);
              });
            }
          }
        }),
        (e.prototype.addSchemaHandle = function(e, t) {
          var r = new o(this, e, t);
          return (this.schemasById[e] = r);
        }),
        (e.prototype.getOrAddSchemaHandle = function(e, t) {
          return this.schemasById[e] || this.addSchemaHandle(e, t);
        }),
        (e.prototype.getOrAddFilePatternAssociation = function(e) {
          var t = this.filePatternAssociationById[e];
          return (
            t ||
              ((t = new i(e)),
              (this.filePatternAssociationById[e] = t),
              this.filePatternAssociations.push(t)),
            t
          );
        }),
        (e.prototype.registerExternalSchema = function(e, t, r) {
          var n = this;
          void 0 === t && (t = null);
          var i = this.normalizeId(e);
          return (
            (this.registeredSchemasIds[i] = !0),
            t &&
              t.forEach(function(e) {
                n.getOrAddFilePatternAssociation(e).addSchema(i);
              }),
            r ? this.addSchemaHandle(i, r) : this.getOrAddSchemaHandle(i)
          );
        }),
        (e.prototype.clearExternalSchemas = function() {
          var r = this;
          for (var e in ((this.schemasById = {}),
          (this.filePatternAssociations = []),
          (this.filePatternAssociationById = {}),
          (this.registeredSchemasIds = {}),
          this.contributionSchemas))
            (this.schemasById[e] = this.contributionSchemas[e]),
              (this.registeredSchemasIds[e] = !0);
          for (var t in this.contributionAssociations) {
            var n = this.getOrAddFilePatternAssociation(t);
            this.contributionAssociations[t].forEach(function(e) {
              var t = r.normalizeId(e);
              n.addSchema(t);
            });
          }
        }),
        (e.prototype.getResolvedSchema = function(e) {
          var t = this.normalizeId(e),
            r = this.schemasById[t];
          return r ? r.getResolvedSchema() : this.promise.resolve(null);
        }),
        (e.prototype.loadSchema = function(o) {
          if (!this.requestService) {
            var e = f(
              "json.schema.norequestservice",
              "Unable to load schema from '{0}'. No schema request service available",
              c(o)
            );
            return this.promise.resolve(new s({}, [e]));
          }
          return this.requestService(o).then(
            function(e) {
              if (!e) {
                var t = f(
                  "json.schema.nocontent",
                  "Unable to load schema from '{0}': No content.",
                  c(o)
                );
                return new s({}, [t]);
              }
              var r,
                n = [];
              r = a.parse(e, n);
              var i = n.length
                ? [
                    f(
                      "json.schema.invalidFormat",
                      "Unable to parse content from '{0}': Parse error at offset {1}.",
                      c(o),
                      n[0].offset
                    )
                  ]
                : [];
              return new s(r, i);
            },
            function(e) {
              var t = f(
                "json.schema.unabletoload",
                "Unable to load schema from '{0}': {1}",
                c(o),
                e.toString()
              );
              return new s({}, [t]);
            }
          );
        }),
        (e.prototype.resolveSchemaContent = function(e, t) {
          var s = this,
            a = e.errors.slice(0),
            r = e.schema,
            o = this.contextService,
            c = function(e, t, r, n) {
              var i = (function(e, t) {
                if (!t) return e;
                var r = e;
                return (
                  "/" === t[0] && (t = t.substr(1)),
                  t.split("/").some(function(e) {
                    return !(r = r[e]);
                  }),
                  r
                );
              })(t, n);
              if (i)
                for (var o in i)
                  i.hasOwnProperty(o) && !e.hasOwnProperty(o) && (e[o] = i[o]);
              else
                a.push(
                  f(
                    "json.schema.invalidref",
                    "$ref '{0}' in '{1}' can not be resolved.",
                    n,
                    r
                  )
                );
            },
            l = function(r, n, i, e) {
              return (
                o &&
                  !/^\w+:\/\/.*/.test(n) &&
                  (n = o.resolveRelativePath(n, e)),
                (n = s.normalizeId(n)),
                s
                  .getOrAddSchemaHandle(n)
                  .getUnresolvedSchema()
                  .then(function(e) {
                    if (e.errors.length) {
                      var t = i ? n + "#" + i : n;
                      a.push(
                        f(
                          "json.schema.problemloadingref",
                          "Problems loading reference '{0}': {1}",
                          t,
                          e.errors[0]
                        )
                      );
                    }
                    return c(r, e.schema, n, i), u(r, e.schema, n);
                  })
              );
            },
            u = function(e, r, n) {
              if (!e || "object" != typeof e) return Promise.resolve(null);
              for (
                var u = [e],
                  t = [],
                  i = [],
                  o = function(e) {
                    for (; e.$ref; ) {
                      var t = e.$ref.split("#", 2);
                      if ((delete e.$ref, 0 < t[0].length))
                        return void i.push(l(e, t[0], t[1], n));
                      c(e, r, n, t[1]);
                    }
                    !(function() {
                      for (var e = [], t = 0; t < arguments.length; t++)
                        e[t] = arguments[t];
                      for (var r = 0, n = e; r < n.length; r++) {
                        var i = n[r];
                        "object" == typeof i && u.push(i);
                      }
                    })(
                      e.items,
                      e.additionalProperties,
                      e.not,
                      e.contains,
                      e.propertyNames
                    ),
                      (function() {
                        for (var e = [], t = 0; t < arguments.length; t++)
                          e[t] = arguments[t];
                        for (var r = 0, n = e; r < n.length; r++) {
                          var i = n[r];
                          if ("object" == typeof i)
                            for (var o in i) {
                              var a = i[o];
                              "object" == typeof a && u.push(a);
                            }
                        }
                      })(
                        e.definitions,
                        e.properties,
                        e.patternProperties,
                        e.dependencies
                      ),
                      (function() {
                        for (var e = [], t = 0; t < arguments.length; t++)
                          e[t] = arguments[t];
                        for (var r = 0, n = e; r < n.length; r++) {
                          var i = n[r];
                          if (Array.isArray(i))
                            for (var o = 0, a = i; o < a.length; o++) {
                              var s = a[o];
                              "object" == typeof s && u.push(s);
                            }
                        }
                      })(e.anyOf, e.allOf, e.oneOf, e.items);
                  };
                u.length;

              ) {
                var a = u.pop();
                0 <= t.indexOf(a) || (t.push(a), o(a));
              }
              return s.promise.all(i);
            };
          return u(r, r, t).then(function(e) {
            return new p(r, a);
          });
        }),
        (e.prototype.getSchemaForResource = function(e, t) {
          if (t && t.root && "object" === t.root.type) {
            var r = t.root.properties.filter(function(e) {
              return "$schema" === e.key.value && !!e.value;
            });
            if (0 < r.length) {
              var n = r[0].value.getValue();
              if (
                (n &&
                  h.startsWith(n, ".") &&
                  this.contextService &&
                  (n = this.contextService.resolveRelativePath(n, e)),
                n)
              ) {
                var i = this.normalizeId(n);
                return this.getOrAddSchemaHandle(i).getResolvedSchema();
              }
            }
          }
          for (
            var o = Object.create(null),
              a = [],
              s = 0,
              u = this.filePatternAssociations;
            s < u.length;
            s++
          ) {
            var c = u[s];
            if (c.matchesPattern(e))
              for (var l = 0, f = c.getSchemas(); l < f.length; l++) {
                var p = f[l];
                o[p] || (a.push(p), (o[p] = !0));
              }
          }
          return 0 < a.length
            ? this.createCombinedSchema(e, a).getResolvedSchema()
            : this.promise.resolve(null);
        }),
        (e.prototype.createCombinedSchema = function(e, t) {
          if (1 === t.length) return this.getOrAddSchemaHandle(t[0]);
          var r = "schemaservice://combinedSchema/" + encodeURIComponent(e),
            n = {
              allOf: t.map(function(e) {
                return { $ref: e };
              })
            };
          return this.addSchemaHandle(r, n);
        }),
        e
      );
    })();
    function c(e) {
      try {
        var t = n.default.parse(e);
        if ("file" === t.scheme) return t.fsPath;
      } catch (e) {}
      return e;
    }
    t.JSONSchemaService = u;
  }),
  (function(e) {
    if ("object" == typeof module && "object" == typeof module.exports) {
      var t = e(require, exports);
      void 0 !== t && (module.exports = t);
    } else
      "function" == typeof define &&
        define.amd &&
        define("vscode-json-languageservice/jsonLanguageService", [
          "require",
          "exports",
          "vscode-languageserver-types",
          "./services/jsonCompletion",
          "./services/jsonHover",
          "./services/jsonValidation",
          "./services/jsonDocumentSymbols",
          "./parser/jsonParser",
          "./services/configuration",
          "./services/jsonSchemaService",
          "jsonc-parser"
        ], e);
  })(function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var s = e("vscode-languageserver-types");
    (t.TextDocument = s.TextDocument),
      (t.Position = s.Position),
      (t.CompletionItem = s.CompletionItem),
      (t.CompletionList = s.CompletionList),
      (t.Range = s.Range),
      (t.SymbolInformation = s.SymbolInformation),
      (t.Diagnostic = s.Diagnostic),
      (t.TextEdit = s.TextEdit),
      (t.FormattingOptions = s.FormattingOptions),
      (t.MarkedString = s.MarkedString);
    var u = e("./services/jsonCompletion"),
      c = e("./services/jsonHover"),
      l = e("./services/jsonValidation"),
      f = e("./services/jsonDocumentSymbols"),
      p = e("./parser/jsonParser"),
      h = e("./services/configuration"),
      d = e("./services/jsonSchemaService"),
      m = e("jsonc-parser");
    t.getLanguageService = function(e) {
      var t = e.promiseConstructor || Promise,
        r = new d.JSONSchemaService(
          e.schemaRequestService,
          e.workspaceContext,
          t
        );
      r.setSchemaContributions(h.schemaContributions);
      var n = new u.JSONCompletion(r, e.contributions, t),
        i = new c.JSONHover(r, e.contributions, t),
        o = new f.JSONDocumentSymbols(r),
        a = new l.JSONValidation(r, t);
      return {
        configure: function(e) {
          r.clearExternalSchemas(),
            e.schemas &&
              e.schemas.forEach(function(e) {
                r.registerExternalSchema(e.uri, e.fileMatch, e.schema);
              }),
            a.configure(e);
        },
        resetSchema: function(e) {
          return r.onResourceChange(e);
        },
        doValidation: a.doValidation.bind(a),
        parseJSONDocument: function(e) {
          return p.parse(e, { collectComments: !0 });
        },
        doResolve: n.doResolve.bind(n),
        doComplete: n.doComplete.bind(n),
        findDocumentSymbols: o.findDocumentSymbols.bind(o),
        findColorSymbols: function(e, t) {
          return o.findDocumentColors(e, t).then(function(e) {
            return e.map(function(e) {
              return e.range;
            });
          });
        },
        findDocumentColors: o.findDocumentColors.bind(o),
        getColorPresentations: o.getColorPresentations.bind(o),
        doHover: i.doHover.bind(i),
        format: function(t, e, r) {
          var n = void 0;
          if (e) {
            var i = t.offsetAt(e.start);
            n = { offset: i, length: t.offsetAt(e.end) - i };
          }
          var o = {
            tabSize: r ? r.tabSize : 4,
            insertSpaces: !r || r.insertSpaces,
            eol: "\n"
          };
          return m.format(t.getText(), n, o).map(function(e) {
            return s.TextEdit.replace(
              s.Range.create(
                t.positionAt(e.offset),
                t.positionAt(e.offset + e.length)
              ),
              e.content
            );
          });
        }
      };
    };
  }),
  define("vscode-json-languageservice", [
    "vscode-json-languageservice/jsonLanguageService"
  ], function(e) {
    return e;
  }),
  define("vs/language/json/jsonWorker", [
    "require",
    "exports",
    "vscode-json-languageservice",
    "vscode-languageserver-types"
  ], function(e, t, r, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    var o = monaco.Promise,
      n = (function() {
        function e(e) {
          this.wrapped = new monaco.Promise(e);
        }
        return (
          (e.prototype.then = function(e, t) {
            return this.wrapped.then(e, t);
          }),
          (e.prototype.getWrapped = function() {
            return this.wrapped;
          }),
          (e.prototype.cancel = function() {
            this.wrapped.cancel();
          }),
          (e.resolve = function(e) {
            return monaco.Promise.as(e);
          }),
          (e.reject = function(e) {
            return monaco.Promise.wrapError(e);
          }),
          (e.all = function(e) {
            return monaco.Promise.join(e);
          }),
          e
        );
      })(),
      a = (function() {
        function e(e, t) {
          (this._ctx = e),
            (this._languageSettings = t.languageSettings),
            (this._languageId = t.languageId),
            (this._languageService = r.getLanguageService({
              promiseConstructor: n
            })),
            this._languageService.configure(this._languageSettings);
        }
        return (
          (e.prototype.doValidation = function(e) {
            var t = this._getTextDocument(e);
            if (t) {
              var r = this._languageService.parseJSONDocument(t);
              return this._languageService.doValidation(t, r);
            }
            return o.as([]);
          }),
          (e.prototype.doComplete = function(e, t) {
            var r = this._getTextDocument(e),
              n = this._languageService.parseJSONDocument(r);
            return this._languageService.doComplete(r, t, n);
          }),
          (e.prototype.doResolve = function(e) {
            return this._languageService.doResolve(e);
          }),
          (e.prototype.doHover = function(e, t) {
            var r = this._getTextDocument(e),
              n = this._languageService.parseJSONDocument(r);
            return this._languageService.doHover(r, t, n);
          }),
          (e.prototype.format = function(e, t, r) {
            var n = this._getTextDocument(e),
              i = this._languageService.format(n, t, r);
            return o.as(i);
          }),
          (e.prototype.resetSchema = function(e) {
            return o.as(this._languageService.resetSchema(e));
          }),
          (e.prototype.findDocumentSymbols = function(e) {
            var t = this._getTextDocument(e),
              r = this._languageService.parseJSONDocument(t),
              n = this._languageService.findDocumentSymbols(t, r);
            return o.as(n);
          }),
          (e.prototype._getTextDocument = function(e) {
            for (
              var t = 0, r = this._ctx.getMirrorModels();
              t < r.length;
              t++
            ) {
              var n = r[t];
              if (n.uri.toString() === e)
                return i.TextDocument.create(
                  e,
                  this._languageId,
                  n.version,
                  n.getValue()
                );
            }
            return null;
          }),
          e
        );
      })();
    (t.JSONWorker = a),
      (t.create = function(e, t) {
        return new a(e, t);
      });
  });
