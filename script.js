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

    // Cálculo da previsão de finalização
    const agora = new Date();
    agora.setHours(agora.getHours() + totalHoras);
    
    // Verifica se a finalização passa pelo intervalo da ceia
    const horaFinalizacao = agora.getHours();
    if (horaFinalizacao >= 1 && horaFinalizacao < 2) {
        totalHoras += 1; // Adiciona 1 hora por conta da ceia
    }

    // Atualiza a previsão de finalização considerando a ceia
    agora.setHours(agora.getHours() + 1);

    // Formatação da data e hora
    const dataFinalizacao = agora.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Cálculo do turno com base na hora da previsão de finalização
    const horaFinalizacaoFinal = agora.getHours();
    let turno;

    if (horaFinalizacaoFinal >= 6 && horaFinalizacaoFinal < 14) {
        turno = '1° TURNO';
    } else if (horaFinalizacaoFinal >= 14 && horaFinalizacaoFinal < 22) {
        turno = '2° TURNO';
    } else {
        turno = '3° TURNO';
    }

    document.getElementById('result').innerHTML = `
        <p><strong>HORAS NECESSÁRIAS:</strong> ${Math.ceil(horasNecessarias).toFixed(0)}</p>
        <p><strong>TOTAL HORAS (incluindo refeição):</strong> ${totalHoras.toFixed(0)}</p>
        <p><strong>PREVISÃO DE FINALIZAÇÃO:</strong> ${dataFinalizacao}</p>
        <p><strong>TURNO:</strong> ${turno}</p>
    `;
}
