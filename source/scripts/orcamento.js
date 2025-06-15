document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const paginasInput = form.querySelector('input[name="paginas"]');
    const funcionalidadesInputs = form.querySelectorAll('input[name="funcionalidades[]"]');
    const servicoSelect = form.querySelector('select[name="servico"]');
    const valorEstimadoInput = form.querySelector('#valor_estimado');

    function calcularOrcamento() {
        let valorBase = 0;

        switch (servicoSelect.value) {
            case "Criar um site do zero":
                valorBase = 1500;
                break;
            case "Editar ou atualizar meu site":
                valorBase = 900;
                break;
            case "Manutenção ou suporte mensal":
                valorBase = 700;
                break;
            case "Outro":
                valorBase = 500;
                break;
        }

        const paginas = parseInt(paginasInput.value) || 0;
        const valorPorPagina = 100;
        let valorFuncionalidades = 0;

        funcionalidadesInputs.forEach((input) => {
            if (input.checked) {
                if (input.value === "Loja Virtual") {
                    valorFuncionalidades += 1200;
                } else if (input.value === "Área de Membros") {
                    valorFuncionalidades += 900;
                } else {
                    valorFuncionalidades += 350;
                }
            }
        });

        const total = valorBase + (paginas * valorPorPagina) + valorFuncionalidades;

        valorEstimadoInput.value = total > 0 ? total : '';
    }

    paginasInput.addEventListener('input', calcularOrcamento);
    funcionalidadesInputs.forEach(input => input.addEventListener('change', calcularOrcamento));
    servicoSelect.addEventListener('change', calcularOrcamento);

    calcularOrcamento();


    const modal = document.getElementById("modal-sucesso");
    const btnVoltar = document.getElementById("btn-voltar");

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(form);

        fetch(form.action, {
            method: "POST",
            body: formData,
        })
            .then(response => {
                if (response.ok) {
                    modal.style.display = "flex";
                    form.reset();
                    calcularOrcamento(); 
                } else {
                    alert("Ocorreu um erro ao enviar. Tente novamente.");
                }
            })
            .catch(() => {
                alert("Erro de conexão. Verifique sua internet.");
            });
    });

    btnVoltar.addEventListener('click', function () {
        window.location.href = "index.html";
    });
});
