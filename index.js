// Importa a classe Telegraf da biblioteca telegraf
require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

// Função auxiliar para escapar caracteres especiais em MarkdownV2
function escapeMarkdown(text) {
    return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
}

// Substitua 'SEU_TOKEN_AQUI' pelo token que você recebeu do BotFather
const BOT_TOKEN = process.env.BOT_TOKEN;

// Verifica se o token foi fornecido
if (!BOT_TOKEN) {
    console.error('Erro: O token do bot não foi fornecido! Por favor, adicione seu token no arquivo bot.js');
    process.exit(1); // Encerra o processo se o token estiver ausente
}

// Cria uma nova instância do bot Telegraf
const bot = new Telegraf(BOT_TOKEN);

// Middleware para logar cada requisição recebida (opcional, mas útil para debug)
bot.use(async (ctx, next) => {
    const start = new Date();
    await next(); // Chama o próximo middleware ou handler
    const ms = new Date() - start;
    console.log('Resposta para %s em %sms', ctx.updateType, ms);
});



// Handler para o comando /start
// O comando /start é frequentemente usado para uma mensagem de boas-vindas.
bot.command('start', (ctx) => {
    const nomeUsuario = ctx.message.from.first_name;
    ctx.replyWithHTML(
        `Olá, <b>${nomeUsuario}</b>! Bem-vindo(a) ao nosso bot de exemplo.

Eu sou um bot simples construído com Telegraf.js.

Você pode tentar:
➡️ Enviar qualquer mensagem de texto para mim.
➡️ Usar o comando /ajuda para ver esta mensagem novamente.
➡️ Usar o comando /tempo para uma (simulada) previsão do tempo.

Divirta-se explorando! ✨`
    );
});

// Handler para o comando /ajuda
bot.command('ajuda', (ctx) => {
    ctx.replyWithHTML(
        `<b>Central de Ajuda do Bot</b> 🤖

Aqui estão algumas coisas que posso fazer:
    
    • Responder às suas mensagens de texto.
    • Mostrar esta mensagem de ajuda com o comando /ajuda.
    • Simular uma previsão do tempo com /tempo.

<i>Fique à vontade para experimentar!</i>`
    );
});

// Handler para um comando fictício /tempo
bot.command('tempo', (ctx) => {
    // Em um bot real, você poderia integrar com uma API de previsão do tempo.
    const cidades = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Salvador'];
    const condicoes = ['Ensolarado ☀️', 'Nublado 🌥️', 'Chuvoso 🌧️', 'Tempestade ⛈️', 'Neve ❄️ (improvável no Brasil!)'];
    const cidadeAleatoria = cidades[Math.floor(Math.random() * cidades.length)];
    const condicaoAleatoria = condicoes[Math.floor(Math.random() * condicoes.length)];

    ctx.reply(`Previsão do tempo para ${cidadeAleatoria}: ${condicaoAleatoria}`);
});

// Exemplo de teclado personalizado
bot.command('menu', (ctx) => {
    ctx.reply('Escolha uma opção:', Markup.keyboard([
        ['Opção 1', 'Opção 2'], // Linha 1
        ['Opção 3'],             // Linha 2
        ['/fecharmenu']          // Comando para fechar o teclado
    ]).resize()); // .resize() ajusta o tamanho do teclado
});

bot.hears('Opção 1', ctx => ctx.reply('Você escolheu a Opção 1!'));
bot.command('fecharmenu', ctx => ctx.reply('Menu fechado.', Markup.removeKeyboard()));

// Exemplo de botões inline
bot.command('inline', (ctx) => {
    ctx.reply('Clique em um botão:', Markup.inlineKeyboard([
        Markup.button.callback('Botão A', 'acao_A'),
        Markup.button.callback('Botão B', 'acao_B')
    ]));
});

// Handlers para as ações dos botões inline
bot.action('acao_A', ctx => {
    ctx.answerCbQuery('Você clicou no Botão A!'); // Resposta para o clique (feedback visual)
    ctx.editMessageText('Você clicou no Botão A. A mensagem foi editada!'); // Edita a mensagem original
});
bot.action('acao_B', ctx => {
    ctx.answerCbQuery('Você clicou no Botão B!');
    ctx.reply('Você clicou no Botão B! Uma nova mensagem foi enviada.');
});


// Handler para qualquer mensagem de texto recebida
bot.on('text', (ctx) => {
    // ctx (context) contém informações sobre a mensagem recebida
    const textoRecebido = ctx.message.text;
    console.log(`Texto recebido: ${textoRecebido}`);

    // Responde ao usuário com uma mensagem ecoando o que foi recebido
    // ctx.reply() envia uma mensagem de volta para o mesmo chat
    ctx.reply(`Você disse: "${textoRecebido}"`);

    // Você pode adicionar lógicas mais complexas aqui.
    // Por exemplo, verificar o conteúdo da mensagem:
    if (textoRecebido.toLowerCase().includes('olá') || textoRecebido.toLowerCase().includes('oi')) {
        ctx.reply('Olá! Como posso te ajudar hoje? 😊');
    } else if (textoRecebido.toLowerCase() === 'qual o seu nome?') {
        // botInfo é preenchido automaticamente pelo Telegraf com informações do bot
        ctx.reply(`Meu nome é ${ctx.botInfo.first_name}!`);
    }
});

// Inicia o bot e o faz escutar por atualizações
bot.launch(() => {
    console.log('Bot iniciado com sucesso!');
    console.log('Envie mensagens ou comandos para interagir.');
});

// Tratamento de erros para garantir que o bot não pare inesperadamente
bot.catch((err, ctx) => {
    console.error(`Ooops, ocorreu um erro para ${ctx.updateType}`, err);
    // Você pode adicionar aqui uma lógica para notificar o usuário sobre o erro, se desejar.
    // ctx.reply('Desculpe, algo deu errado. Tente novamente mais tarde.');
});

// Permite que o bot pare de forma graciosa ao receber sinais de interrupção (Ctrl+C)
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('Iniciando o bot...');
