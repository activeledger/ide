import { AngularElectronPage } from "./app.po";
import { element, by } from "protractor";

describe("Active Harmony", () => {
  let page: AngularElectronPage;

  beforeEach(() => {
    page = new AngularElectronPage();
  });

  it("should display message saying App works !", () => {
    page.navigateTo("/");
    expect(element(by.css("app-home h1")).getText()).toMatch("App works !");
  });
});
