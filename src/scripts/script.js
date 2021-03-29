const { ipcRenderer } = require("electron");

function GetFormData(form) {
    const form_object = {};

    new FormData(form).forEach((value, key) => form_object[key] = value);

    return form_object;
}

document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();

    const form_data = GetFormData(this);
    const messages = GetMessages();

    console.log("form_data:", form_data);
    console.log("messages:", messages);

    if (messages.length == 0) Swal.fire("Quase lá!!", "Adicione primeiro pelo menos uma mensagem!", "error");
    else ipcRenderer.send("start", form_data, messages);
});