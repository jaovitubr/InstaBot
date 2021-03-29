(() => {
    const { ipcRenderer } = require("electron");

    const working_alert_elem = document.querySelector("#working-alert");
    const working_alert_title_elem = document.querySelector("#working-alert>div .infos>h2");
    const progress_bar_elem = document.querySelector("#working-alert>div .infos>.progress-bar>div");

    const counter_count_elem = document.querySelector("#working-alert>div .infos>.counter>.count");
    const counter_max_elem = document.querySelector("#working-alert>div .infos>.counter>.max");

    const last_message_elem = document.querySelector("#working-alert>div .infos>.last-message>span");
    const next_left_time_elem = document.querySelector("#working-alert>div .infos>.next-left-time>b");

    function setProgressBarProgress(progress) {
        progress_bar_elem.style.width = `${parseFloat(progress) || 0}%`;
    }

    document.querySelector("#working-alert .infos>button.close").addEventListener("click", function () {
        working_alert_elem.classList.remove("show");
    });

    ipcRenderer.on("starting", (event) => {
        setProgressBarProgress(0);
        working_alert_title_elem.innerText = "Iniciando...";

        working_alert_elem.classList.remove("close");
        working_alert_elem.classList.remove("error");
        working_alert_elem.classList.remove("finished");
        working_alert_elem.classList.add("show");
        working_alert_elem.classList.add("starting");
    });

    ipcRenderer.on("wait_auth", (event) => {
        working_alert_title_elem.innerText = "Aguardando autenticação...";
    });

    ipcRenderer.on("logged", (event) => {
        working_alert_title_elem.innerText = "Carregando postagem...";
    });

    ipcRenderer.on("loaded", (event) => {
        working_alert_title_elem.innerText = "Aguardando primeiro comentário...";

        working_alert_elem.classList.remove("starting");
    });

    let countdown;

    function StartCountdown(delay_ms) {
        const seconds = delay_ms / 1000;
        let ticks = 0;

        function Update() {
            const cur_seconds = seconds - ticks;
            next_left_time_elem.innerText = `${cur_seconds} segundo${cur_seconds > 1 ? "s" : ""}`;
            ticks++;
        }

        clearInterval(countdown);
        Update();
        countdown = setInterval(Update, 500);
        return countdown;
    }

    ipcRenderer.on("message-sended", (event, args) => {
        working_alert_title_elem.innerText = "Enviando comentários...";
        counter_count_elem.innerText = args.count;
        counter_max_elem.innerText = args.max;
        last_message_elem.innerText = args.message;

        StartCountdown(args.delay);
        setProgressBarProgress((args.count / args.max) * 100);
    });

    ipcRenderer.on("finished", (event) => {
        Swal.fire("Prontinho!", "A automação foi finalizada!", "success");

        working_alert_title_elem.innerText = "Finalizado!";

        working_alert_elem.classList.remove("starting");
        working_alert_elem.classList.remove("error");

        working_alert_elem.classList.add("finished");
        working_alert_elem.classList.add("close");
    });

    ipcRenderer.on("error", (event, error) => {
        Swal.fire("Ops...", "Ocorreu um erro!", "error");
        Swal.showValidationMessage(error);

        working_alert_title_elem.innerText = "Ocorreu um erro!";

        working_alert_elem.classList.remove("starting");
        working_alert_elem.classList.remove("finished");

        working_alert_elem.classList.add("show");
        working_alert_elem.classList.add("error");
        working_alert_elem.classList.add("close");
    });
})();