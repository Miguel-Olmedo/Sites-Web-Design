// 1. Alterar a saudação no Hero de acordo com o horário
document.addEventListener("DOMContentLoaded", function() {
    const hora = new Date().getHours();
    const elementoSaudacao = document.querySelector('.hero-content p');

    if (elementoSaudacao) {
        if (hora >= 6 && hora < 12) {
            elementoSaudacao.innerHTML = "☕ Bom dia! Pão quentinho saindo agora!";
        } else {
            elementoSaudacao.innerHTML = "🥐 Boa tarde! Hora do café e daquele salgado fresco!";
        }
    }
});

// 2. Efeito visual ao clicar no botão do WhatsApp
function mostrarConfirmacao(botao) {
    const textoOriginal = botao.innerHTML;
    botao.innerHTML = "✔️ Redirecionando para o WhatsApp...";
    
    setTimeout(() => {
        botao.innerHTML = textoOriginal;
    }, 3000);
}

// Feedback ao cadastrar o e-mail no Clube de Ofertas
document.addEventListener("DOMContentLoaded", function() {
    const formOfertas = document.querySelector('.form-novidades');
    
    if (formOfertas) {
        formOfertas.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o recarregamento da página
            alert("🎉 Sucesso! O seu e-mail foi registado no Clube de Ofertas.");
            formOfertas.reset(); // Limpa o campo de e-mail
        });
    }
});
