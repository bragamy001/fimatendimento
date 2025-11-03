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
    totalHoras += 2;

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
    esconderTodosOsPaineis();
    document.getElementById(painel).style.display = 'block';
}


function voltarMenu() {
    esconderTodosOsPaineis();
    document.querySelector('.menu').style.display = 'block';
}
    
// Função auxiliar para obter os limites de turno
function obterLimitesTurno(diaDaSemana, flagFimSemana) {
    // getDay(): 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    
    // Regra principal: Segunda a Sexta (dia normal)
    if (diaDaSemana >= 1 && diaDaSemana <= 5 || flagFimSemana === 'Normal') {
        return [
            { turno: '1° TURNO', inicio: 6, fim: 14 },   // 06:00 - 14:00
            { turno: '2° TURNO', inicio: 14, fim: 22 },  // 14:00 - 22:00
            { turno: '3° TURNO', inicio: 22, fim: 6, diaSeguinte: true } // 22:00 - 06:00 (dia seguinte)
        ];
    } 
    // Regras de Sábado
    else if (diaDaSemana === 6) { // Sábado
        if (flagFimSemana === 'SabadoNormal') {
            return [
                { turno: '1° TURNO', inicio: 6, fim: 11.75 }, // 06:00 até 11:45 (11.75h)
                { turno: '2° TURNO', inicio: 12, fim: 17.75 }, // 12:00 até 17:45 (17.75h)
                { turno: '3° TURNO', folga: true } // Folga
            ];
        } else if (flagFimSemana === 'SabadoEstendido') {
            return [
                { turno: '1° TURNO', inicio: 5.75, fim: 14 }, // 05:45 (5.75h) até 14:00
                { turno: '2° TURNO', inicio: 13.75, fim: 22 }, // 13:45 (13.75h) até 22:00
                { turno: '3° TURNO', folga: true } // Folga
            ];
        }
    } 
    // Regras de Domingo
    else if (diaDaSemana === 0) { // Domingo
        if (flagFimSemana === 'DomingoNaoTrabalha') {
            // Se for domingo e não trabalha, o trabalho só inicia na segunda às 06:00
            return [
                { folga: true, reinicio: { dia: 1, hora: 6 } } // Reinicia Segunda (1) às 06:00
            ];
        } else { // Domingo Normal (o único turno é o 3° que começa às 22:45)
            return [
                { turno: '1° TURNO', folga: true },
                { turno: '2° TURNO', folga: true },
                { turno: '3° TURNO', inicio: 22.75, fim: 6, diaSeguinte: true } // 22:45 (22.75h) até 06:00
            ];
        }
    }
    
    // Padrão para dias que caem fora das regras de sábado/domingo mas usam a flag 'Normal'
    return [
        { turno: '1° TURNO', inicio: 6, fim: 14 },
        { turno: '2° TURNO', inicio: 14, fim: 22 },
        { turno: '3° TURNO', inicio: 22, fim: 6, diaSeguinte: true }
    ];
}

// Função principal de cálculo com as novas regras de turno/folga
function calcularPrevisaoComHorario() {
    const dataInicioStr = document.getElementById('dataInicio').value;
    const horaInicioStr = document.getElementById('horaInicio').value;
    const flagFimSemana = document.getElementById('flagFimSemana').value; // Novo campo
    const caixasFaltando = parseFloat(document.getElementById('caixasFaltandoHorario').value);
    const capacidade = parseFloat(document.getElementById('capacidadeHorario').value);

    if (!dataInicioStr || !horaInicioStr || isNaN(caixasFaltando) || isNaN(capacidade) || capacidade <= 0) {
        alert('Por favor, preencha todos os campos corretamente e selecione a Flag de Fim de Semana.');
        return;
    }

    // 1. Cálculo do tempo total necessário (em minutos, incluindo refeição)
    const horasNecessariasBrutas = caixasFaltando / capacidade;
    let horasCalculo = horasNecessariasBrutas;
    
    // Adiciona 1 hora de refeição a cada 7 horas trabalhadas
    const horasExtras = Math.floor(horasNecessariasBrutas / 7);
    horasCalculo += horasExtras;

    // Converte para minutos e arredonda para cima
    let minutosRestantes = Math.ceil(horasCalculo * 60);

    // Cria data inicial
    let dataHoraAtual = new Date(`${dataInicioStr}T${horaInicioStr}`);
    
    let turnoFinal = '';
    
    // 2. Itera o tempo de trabalho
    while (minutosRestantes > 0) {
        const diaDaSemana = dataHoraAtual.getDay(); // 0=Dom, 1=Seg, ..., 6=Sab
        // CORREÇÃO: diaDaSemera mudou para diaDaSemana
        const limitesTurno = obterLimitesTurno(diaDaSemana, flagFimSemana); 
        
        // Verifica a folga de Domingo Não Trabalha
        if (diaDaSemana === 0 && flagFimSemana === 'DomingoNaoTrabalha') {
            // Pula para Segunda-feira às 06:00
            const hoje = dataHoraAtual.getDate();
            dataHoraAtual.setDate(hoje + 1); // Avança um dia
            dataHoraAtual.setHours(6, 0, 0, 0); // Define 06:00
            continue; // Recomeça o loop com a nova data
        }

        let minutoTrabalhado = false;
        
        // Loop por turno
        for (const limite of limitesTurno) {
            if (limite.folga) {
                continue; // Pula turnos de folga
            }

            const horaInicioTurno = limite.inicio;
            const horaFimTurno = limite.fim;
            
            let dataInicioTurno = new Date(dataHoraAtual);
            let dataFimTurno = new Date(dataHoraAtual);
            
            // Define o horário de início do turno no dia atual
            dataInicioTurno.setHours(Math.floor(horaInicioTurno), (horaInicioTurno % 1) * 60, 0, 0);
            
            // Define o horário de fim do turno (avançando o dia se virar a meia-noite)
            if (limite.diaSeguinte || horaFimTurno < horaInicioTurno) {
                dataFimTurno.setDate(dataFimTurno.getDate() + 1);
            }
            dataFimTurno.setHours(Math.floor(horaFimTurno), (horaFimTurno % 1) * 60, 0, 0);

            // Se o horário atual está antes do início do turno, avança para o início do turno
            if (dataHoraAtual < dataInicioTurno) {
                dataHoraAtual = dataInicioTurno;
            }

            // Se o horário atual já passou do fim do turno, pula para o próximo turno/dia
            if (dataHoraAtual >= dataFimTurno) {
                continue;
            }
            
            // Tempo restante para trabalhar neste turno (em milissegundos, convertido para minutos)
            let tempoRestanteTurno = dataFimTurno.getTime() - dataHoraAtual.getTime();
            let minutosRestantesNoTurno = Math.floor(tempoRestanteTurno / (1000 * 60));
            
            // Tempo a ser consumido (o menor entre o restante no turno e o total de minutos a trabalhar)
            const minutosAConsumir = Math.min(minutosRestantes, minutosRestantesNoTurno);
            
            // Avança o tempo
            dataHoraAtual.setMinutes(dataHoraAtual.getMinutes() + minutosAConsumir);
            minutosRestantes -= minutosAConsumir;
            minutoTrabalhado = true;
            turnoFinal = limite.turno || '';
            
            if (minutosRestantes <= 0) {
                break; // Sai do loop de turnos
            }
        }
        
        // Se ainda há minutos a trabalhar mas não consumiu nada neste loop (está em uma folga), avança 1 minuto
        if (minutosRestantes > 0 && !minutoTrabalhado) {
             dataHoraAtual.setMinutes(dataHoraAtual.getMinutes() + 1);
        }

        // Limite de segurança contra loop infinito
        const diffDias = Math.floor((dataHoraAtual.getTime() - new Date(`${dataInicioStr}T${horaInicioStr}`).getTime()) / (1000 * 60 * 60 * 24));
        if (diffDias > 30) {
            alert('Erro: O cálculo excedeu 30 dias. Verifique as entradas.');
            break;
        }
    }
    
    // 3. Verifica Ceia (após o cálculo total)
    const horaFinalizacaoCeia = dataHoraAtual.getHours();
    if (horaFinalizacaoCeia >= 1 && horaFinalizacaoCeia < 2) {
        dataHoraAtual.setHours(dataHoraAtual.getHours() + 1); // Adiciona 1 hora por conta da ceia
    }

    // 4. Formatação e Exibição
    const dataFinalizacao = dataHoraAtual.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const horasNecessariasArredondadas = Math.ceil(horasNecessariasBrutas);

    // Determina o turno final, se não foi determinado pelo loop
    if (!turnoFinal) {
        const horaFinal = dataHoraAtual.getHours();
        if (horaFinal >= 6 && horaFinal < 14) {
            turnoFinal = '1° TURNO';
        } else if (horaFinal >= 14 && horaFinal < 22) {
            turnoFinal = '2° TURNO';
        } else {
            turnoFinal = '3° TURNO';
        }
    }


    // Mostra resultado
    document.getElementById('resultPrevisaoComHorario').innerHTML = `
        <p><strong>HORAS NECESSÁRIAS:</strong> ${horasNecessariasArredondadas.toFixed(0)}</p>
        <p><strong>PREVISÃO DE FINALIZAÇÃO:</strong> ${dataFinalizacao}</p>
        <p><strong>TURNO:</strong> ${turnoFinal}</p>
        
    `;
}

function esconderTodosOsPaineis() {
    document.querySelector('.menu').style.display = 'none';
    document.getElementById('previsao').style.display = 'none';
    document.getElementById('simulador').style.display = 'none';
    document.getElementById('previsaoComHorario').style.display = 'none';
}