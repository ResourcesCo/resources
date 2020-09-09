import { getChatInputTextarea } from "../support/app.po";

describe("ResourcesApp", () => {
  before(() => cy.wait(5000));
  beforeEach(() => cy.visit("/", { timeout: 60000 }));

  it("should display console", () => {
    getChatInputTextarea().should((t) => expect(t.length).equal(1));
  });
});
