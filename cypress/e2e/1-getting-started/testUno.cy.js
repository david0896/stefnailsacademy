describe("Test app ToDo", ()=>{
    it("Visita pagina", ()=>{
        cy.visit("https://example.cypress.io/todo");
        //cy.get(".todo-list li ").first().get(".toggle").first().click()
        //cy.get(".todo-list li .toggle").first().click()
        cy.get(':nth-child(1) > .view > .toggle').click();
        cy.visit("https://example.cypress.io/commands/actions");
        cy.get('.action-select').select("fr-oranges")
    })

    //aserciones
    it("Practica de aserciones", ()=>{
        cy.visit("https://example.cypress.io");
        cy.get(".banner").should("be.visible");
        //cy.get("#navbar").should("have.text", "Commands");
        cy.get("#navbar").should("contain", "Commands");
        cy.get(".container").then((items)=>{
            const numeroDeItems = items.length;
            console.log(numeroDeItems);
            expect(numeroDeItems).to.equal(8)
        })
    })

    //prueba 1 curso cypress - visite una pagina y verifique su titulo contenga la palabra impresora
    it("Verifica que el titulo sea h1 y que tenga la palabra impresora", ()=>{
        cy.visit("https://www.colortrade.com/");
        cy.get("p").first().should("contain", "Impresoras"); //esta pagina no tiene h1 en su cabezera 
        cy.title().should("eq", "Inicio - Color trade");
    })

})