(() => {
    let messages = [];

    try {
        for (const message of JSON.parse(localStorage.messages)) AddMessage(message, false);
    } catch { }

    function AddMessage(message, save = true) {
        if (typeof message === "string" && !!message) message = {
            id: Math.random() * 100,
            message,
        }

        if (typeof message === "object") messages.push(message);
        else return;

        if (!!save) localStorage.setItem("messages", JSON.stringify(messages));

        const message_el = document.createElement("div");
        message_el.innerHTML = `<span></span><button type="button"><img src="../images/trash.svg" /></button>`;
        message_el.querySelector("span").innerText = message.message;

        const empty_msg_el = document.querySelector(".messages>.list>.empty-msg");

        if (empty_msg_el) empty_msg_el.remove();

        document.querySelector(".messages>.list").append(message_el);

        message_el.querySelector("button").addEventListener("click", function () {
            message_el.remove();

            messages = messages.filter(msg => msg.id != message.id);
            localStorage.setItem("messages", JSON.stringify(messages));

            if (messages.length === 0) {
                const msg_el = document.createElement("span");
                msg_el.classList.add("empty-msg");
                msg_el.innerText = "Nenhuma";

                document.querySelector(".messages>.list").append(msg_el);
            }
        });
    }

    document.querySelector(".messages>.add>input").addEventListener("keyup", function (e) {
        if (e.keyCode == 13) AddMessage(this.value);
    });

    document.querySelector(".messages>.add>button").addEventListener("click", function (e) {
        e.preventDefault();

        const input_el = document.querySelector(".messages>.add>input");

        AddMessage(input_el.value);

        input_el.value = "";
    });

    window.GetMessagesData = () => messages;
    window.GetMessages = () => messages.map(msg => msg.message);
    window.AddMessage = AddMessage;
})();