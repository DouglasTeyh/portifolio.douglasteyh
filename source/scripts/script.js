document.addEventListener("DOMContentLoaded", () => {
    fetch("components/navbar.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
            const link = document.getElementById("orcamento-btn");
            if (link) {
                if (window.location.pathname.endsWith("orcamento.html")) {
                    link.textContent = "Voltar";
                    link.href = "index.html";
                } else {
                    link.textContent = "Orçamentos";
                    link.href = "orcamento.html";
                }
            }
        });
});