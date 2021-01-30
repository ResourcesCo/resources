import { getChatInputTextarea, getOutputMessages, getSendButton } from "../support/app.po";

describe("ResourcesApp", () => {
  before(() => cy.wait(5000));
  beforeEach(() => cy.visit("/", { timeout: 60000 }));

  it("should display console", () => {
    getChatInputTextarea().should((t) => expect(t.length).equal(1));
  });

  it("should run help command", () => {
    getOutputMessages().should('have.length', 0).then(() => {
      getChatInputTextarea().type('help{enter}').wait(1000).then(() => {
        getOutputMessages().should('have.length.of.at.least', 1)
      })
    })
  })

  it("should run clear command with button", () => {
    getOutputMessages().should('have.length', 0).then(() => {
      getChatInputTextarea().type('help{enter}').wait(1000).then(() => {
        getOutputMessages().should('have.length.of.at.least', 1).then(() => {
          getChatInputTextarea().type(':clear').then(() => {
            getSendButton().click().wait(1000).then(() => {
              getOutputMessages().should('have.length', 0)
            })
          })
        })
      })
    })
  })
});
