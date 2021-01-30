export const getChatInputTextarea = () => cy.get(".chat-input .cm-content");
export const getSendButton = () => cy.get("button.send")
export const getOutputMessages = () => cy.get(".output-message")