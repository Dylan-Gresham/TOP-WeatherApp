const {initialize} =  require("./DomFuncs.js");

async function createContainer() {
    return await initialize()
        .then(response => {
            console.log(response);

            return response;
        })
        .catch(err => {
            console.error(`Error: ${err.message}`);
            console.error(err);

            return undefined;
        });
}

async function appendContainer(documentBody, containerFunc) {

    documentBody.appendChild(await containerFunc());
}

appendContainer(document.body, createContainer)
    .then(response => {
        console.log("Appended to body.");

        return;
    });
