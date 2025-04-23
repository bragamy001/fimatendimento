function calcular() {
    const caixasFaltando = parseFloat(document.getElementById('caixasFaltando').value);
    const capacidade = parseFloat(document.getElementById('capacidade').value);

    if (isNaN(caixasFaltando) || isNaN(capacidade) || capacidade <= 0) {
        alert('Por favor, insira valores válidos.');
        return;
    }

    // Cálculo das horas necessárias
    const horasNecessarias = caixasFaltando / capacidade;

    // Cálculo do total de horas (incluindo refeição)
    let totalHoras = horasNecessarias;

    // Adiciona 1 hora de refeição para cada 7 horas trabalhadas
    const horasExtras = Math.floor(horasNecessarias / 7);
    totalHoras += horasExtras;

    // Arredonda totalHoras para cima
    totalHoras = Math.ceil(totalHoras);

    // Adiciona 2 horas ao tempo total (ajuste máximo de faturamento)
    totalHoras += 3;

    // Previsão de finalização com ajustes
    const agora = new Date();
    agora.setHours(agora.getHours() + totalHoras);

    // Verifica se o horário de finalização passa pela ceia (01:00 às 02:00)
    const horaFinalizacao = agora.getHours();
    if (horaFinalizacao >= 1 && horaFinalizacao < 2) {
        totalHoras += 1; // Adiciona 1 hora por conta da ceia
        agora.setHours(agora.getHours() + 1);
    }

    // Formatação da previsão de finalização
    const dataFinalizacao = agora.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Determinação do turno com base na hora final
    const horaFinalizacaoFinal = agora.getHours();
    let turno;
    if (horaFinalizacaoFinal >= 6 && horaFinalizacaoFinal < 14) {
        turno = '1° TURNO';
    } else if (horaFinalizacaoFinal >= 14 && horaFinalizacaoFinal < 22) {
        turno = '2° TURNO';
    } else {
        turno = '3° TURNO';
    }

    // Atualiza a interface com os resultados
    document.getElementById('result').innerHTML = `
        <p><strong>HORAS NECESSÁRIAS:</strong> ${Math.ceil(horasNecessarias).toFixed(0)}</p>
        <p><strong>PREVISÃO DE FINALIZAÇÃO:</strong> ${dataFinalizacao}</p>
        <p><strong>TURNO:</strong> ${turno}</p>
    `;
}

function calcularSimulador() {
    const diaSemana = document.getElementById('diaSemana').value;
    const valores = [1, 2, 3, 4].map(i => parseFloat(document.getElementById(`campo${i}`).value));

    if (valores.some(isNaN) || !diaSemana) {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    const media = valores.reduce((a, b) => a + b, 0) / valores.length;

    document.getElementById('resultSimulador').innerHTML = `
        <p><strong>Dia da Semana:</strong> ${diaSemana}</p>
        <p><strong>Média:</strong> ${media.toFixed(2)}</p>
        <p><strong>Previsão Estimada de Volume:</strong> ${Math.ceil(media).toFixed(0)} peças</p>
    `;
}

function mostrarPainel(painel) {
    document.querySelector('.menu').style.display = 'none';
    document.getElementById('previsao').style.display = 'none';
    document.getElementById('simulador').style.display = 'none';
    document.getElementById(painel).style.display = 'block';
}

function voltarMenu() {
    document.querySelector('.menu').style.display = 'block';
    document.getElementById('previsao').style.display = 'none';
    document.getElementById('simulador').style.display = 'none';
}
    