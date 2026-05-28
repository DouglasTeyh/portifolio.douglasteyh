document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("epic-budget-form");
    if (!form) return;

    // Elementos do Formulário
    const paginasInput = form.querySelector('input[name="paginas"]');
    const funcionalidadesInputs = form.querySelectorAll('input[name="funcionalidades[]"]');
    const servicoSelect = form.querySelector('select[name="servico"]');
    const valorEstimadoInput = form.querySelector('#valor_estimado');
    const spanValorEstimado = document.getElementById('span-valor-estimado');

    // Lógica do Wizard (Etapas)
    let currentStep = 1;
    const totalSteps = 4;
    
    const steps = form.querySelectorAll(".form-step");
    const nextButtons = form.querySelectorAll(".btn-next");
    const prevButtons = form.querySelectorAll(".btn-prev");
    const progressFill = document.getElementById("progress-fill");
    const stepDots = document.querySelectorAll(".step-dot");

    // 1. Revelar o formulário completo com GSAP no carregamento
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(form, 
            { y: 40, autoAlpha: 0 }, 
            { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
        );
    } else {
        form.style.visibility = "visible";
    }

    // 2. Transições e Controle de Etapas
    function goToStep(targetStep, direction) {
        if (targetStep < 1 || targetStep > totalSteps) return;

        const currentStepEl = document.getElementById(`step-${currentStep}`);
        const targetStepEl = document.getElementById(`step-${targetStep}`);

        if (!currentStepEl || !targetStepEl) return;

        // Definir direções de slide (GSAP)
        const currentExitX = direction === "next" ? -50 : 50;
        const targetStartX = direction === "next" ? 50 : -50;

        if (typeof gsap !== 'undefined') {
            // Animar saída da etapa atual
            gsap.to(currentStepEl, {
                x: currentExitX,
                opacity: 0,
                duration: 0.3,
                ease: "power2.inOut",
                onComplete: () => {
                    currentStepEl.style.display = "none";
                    
                    // Configurar e animar entrada da próxima etapa
                    targetStepEl.style.display = "block";
                    gsap.fromTo(targetStepEl,
                        { x: targetStartX, opacity: 0 },
                        { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
                    );
                }
            });
        } else {
            currentStepEl.style.display = "none";
            targetStepEl.style.display = "block";
        }

        // Atualizar Barra de Progresso
        const progressPercentage = (targetStep / totalSteps) * 100;
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }

        // Atualizar Dots Indicadores
        stepDots.forEach(dot => {
            const stepNum = parseInt(dot.getAttribute("data-step"));
            dot.classList.remove("active", "completed");
            
            if (stepNum === targetStep) {
                dot.classList.add("active");
            } else if (stepNum < targetStep) {
                dot.classList.add("completed");
            }
        });

        currentStep = targetStep;
    }

    // Validar etapa antes de avançar
    function validateStep(stepNum) {
        const stepEl = document.getElementById(`step-${stepNum}`);
        if (!stepEl) return true;

        const inputs = stepEl.querySelectorAll("input[required], select[required]");
        let isValid = true;

        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.reportValidity();
                isValid = false;
            }
        });

        return isValid;
    }

    // Ouvintes de Avançar
    nextButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1, "next");
            }
        });
    });

    // Ouvintes de Voltar
    prevButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            goToStep(currentStep - 1, "prev");
        });
    });

    // 3. Lógica dos Checkboxes Interativos (Adicionar classe .checked ao pai)
    funcionalidadesInputs.forEach(input => {
        const card = input.closest(".checkbox-item");
        
        // Estado inicial
        if (input.checked && card) {
            card.classList.add("checked");
        }

        input.addEventListener("change", () => {
            if (card) {
                if (input.checked) {
                    card.classList.add("checked");
                    // Microinteração GSAP de pulso no clique do item
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(card, { scale: 0.97 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
                    }
                } else {
                    card.classList.remove("checked");
                }
            }
            calcularOrcamento();
        });
    });

    // 4. Lógica de Cálculo de Orçamento
    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

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

        // Atualizar input oculto
        valorEstimadoInput.value = total > 0 ? total : '';
        
        // Atualizar exibição formatada para o usuário com animação do valor
        if (spanValorEstimado) {
            const valorFormatado = formatarMoeda(total);
            if (spanValorEstimado.textContent !== valorFormatado) {
                spanValorEstimado.textContent = valorFormatado;
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(spanValorEstimado, 
                        { scale: 0.8, color: "#fff" }, 
                        { scale: 1, color: "var(--primary-neon)", duration: 0.4, ease: "back.out(2)" }
                    );
                }
            }
        }
    }

    // Ouvintes de eventos para recálculo em tempo real
    if (paginasInput) {
        paginasInput.addEventListener('input', calcularOrcamento);
    }
    if (servicoSelect) {
        servicoSelect.addEventListener('change', calcularOrcamento);
    }

    // Inicializar o cálculo
    calcularOrcamento();

    // 5. Envio do Formulário e Modal de Sucesso
    const modal = document.getElementById("modal-sucesso");
    const btnVoltar = document.getElementById("btn-voltar");

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Garantir que todos os campos obrigatórios em todas as etapas estão válidos
        let formIsValid = true;
        for (let i = 1; i <= totalSteps; i++) {
            if (!validateStep(i)) {
                goToStep(i, "prev");
                formIsValid = false;
                break;
            }
        }

        if (!formIsValid) return;

        const formData = new FormData(form);

        fetch(form.action, {
            method: "POST",
            body: formData,
        })
        .then(response => {
            if (response.ok) {
                if (modal) {
                    modal.style.display = "flex";
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(modal.querySelector('.modal-conteudo'),
                            { scale: 0.7, opacity: 0 },
                            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
                        );
                    }
                }
                form.reset();
                
                // Limpar classes de checked dos checkboxes
                form.querySelectorAll(".checkbox-item").forEach(card => card.classList.remove("checked"));

                // Resetar o wizard para a primeira etapa
                goToStep(1, "prev");
                calcularOrcamento(); 
            } else {
                alert("Ocorreu um erro ao enviar. Tente novamente.");
            }
        })
        .catch(() => {
            alert("Erro de conexão. Verifique sua internet.");
        });
    });

    if (btnVoltar) {
        btnVoltar.addEventListener('click', function () {
            window.location.href = "index.html";
        });
    }
});
