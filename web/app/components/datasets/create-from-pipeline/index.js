"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../../base/effect");
const footer_1 = require("./footer");
const header_1 = require("./header");
const list_1 = require("./list");
const CreateFromPipeline = () => {
    return (<div className="relative flex h-[calc(100vh-56px)] flex-col overflow-hidden rounded-t-2xl border-t border-effects-highlight bg-background-default-subtle">
      <effect_1.default className="left-8 top-[-34px] opacity-20"/>
      <header_1.default />
      <list_1.default />
      <footer_1.default />
    </div>);
};
exports.default = CreateFromPipeline;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFDWiw4Q0FBc0M7QUFDdEMscUNBQTZCO0FBQzdCLHFDQUE2QjtBQUM3QixpQ0FBeUI7QUFFekIsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLEVBQUU7SUFDOUIsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUNGLFNBQVMsQ0FBQywwSUFBMEksQ0FFcEo7TUFBQSxDQUFDLGdCQUFNLENBQUMsU0FBUyxDQUFDLCtCQUErQixFQUNqRDtNQUFBLENBQUMsZ0JBQU0sQ0FBQyxBQUFELEVBQ1A7TUFBQSxDQUFDLGNBQUksQ0FBQyxBQUFELEVBQ0w7TUFBQSxDQUFDLGdCQUFNLENBQUMsQUFBRCxFQUNUO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsa0JBQWtCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCBFZmZlY3QgZnJvbSAnLi4vLi4vYmFzZS9lZmZlY3QnXG5pbXBvcnQgRm9vdGVyIGZyb20gJy4vZm9vdGVyJ1xuaW1wb3J0IEhlYWRlciBmcm9tICcuL2hlYWRlcidcbmltcG9ydCBMaXN0IGZyb20gJy4vbGlzdCdcblxuY29uc3QgQ3JlYXRlRnJvbVBpcGVsaW5lID0gKCkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT1cInJlbGF0aXZlIGZsZXggaC1bY2FsYygxMDB2aC01NnB4KV0gZmxleC1jb2wgb3ZlcmZsb3ctaGlkZGVuIHJvdW5kZWQtdC0yeGwgYm9yZGVyLXQgYm9yZGVyLWVmZmVjdHMtaGlnaGxpZ2h0IGJnLWJhY2tncm91bmQtZGVmYXVsdC1zdWJ0bGVcIlxuICAgID5cbiAgICAgIDxFZmZlY3QgY2xhc3NOYW1lPVwibGVmdC04IHRvcC1bLTM0cHhdIG9wYWNpdHktMjBcIiAvPlxuICAgICAgPEhlYWRlciAvPlxuICAgICAgPExpc3QgLz5cbiAgICAgIDxGb290ZXIgLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDcmVhdGVGcm9tUGlwZWxpbmVcbiJdfQ==