import TelegramBot, { CallbackQuery, InlineKeyboardMarkup, ReplyKeyboardMarkup } from 'node-telegram-bot-api';
// import { Client, MessageMedia } from 'whatsapp-web.js';
import { environmentProd } from './environment';

//bot para tratar as mensagens
const bot = new TelegramBot(environmentProd.botId, { polling: true });
const groupId = environmentProd.telegramGroupId;
// const whatsappGroup = environmentProd.whatsappGroupId;


const urlRegex = /(\b(?!t\.me\/)(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
const mentionRegex = /@[\w.-]+/g;

// const { exec } = require('child_process');
// const client = new Client({
//     puppeteer: {
//         headless: true, // Define se o navegador deve ser visível ou não
//         args: [
//             '--no-sandbox',
//             '--disable-setuid-sandbox'
//         ]
//     },
//     restartOnAuthFail: true, // Reiniciar automaticamente em caso de falha na autenticação
// });

import { Message } from 'node-telegram-bot-api';

console.log('O bot está sendo iniciado... ');
bot.on('message', (msg: Message) => {
    if (msg && msg.text) {
        console.log('Mensagem recebida!')
        let textMessage = msg.text || "";
        textMessage = textMessage.replace(urlRegex, '');
        textMessage = textMessage.replace(mentionRegex, '');
        sendMessageToTelegramGroup(textMessage);
    }
});

function sendMessageToTelegramGroup(msg: string) {
    bot.sendMessage(groupId, msg)
        .then(() => {
            console.log('Mensagem enviada com sucesso!');
        })
        .catch((error: any) => {
            console.error('Erro ao enviar mensagem:', error);
        });
}

// function sendMessageToWhatsappGroup(msg: string) {
//     console.log(client);
//     client.on('ready', async () => {
//         const groupName = 'CONTAS DO MÊS';

//         try {
//             const chats = await client.getChats();
//             console.log(chats);
//             const group = chats.find(chat => chat.isGroup && chat.name === groupName);

//             if (group) {
//                 // Envie a mensagem para o grupo
//                 await group.sendMessage('Sua mensagem aqui');
//                 console.log('Mensagem enviada com sucesso para o grupo!');
//             } else {
//                 console.error(`Grupo '${groupName}' não encontrado.`);
//             }
//         } catch (error) {
//             console.error('Erro ao enviar mensagem para o grupo:', error);
//         }
//     });
// }

// client.initialize();

// bot.on('polling_error', (error: any) => {
//     exec('cd src && npx ts-node index.ts', (err: any, stdout: any, stderr: any) => {
//         if (err) {
//             console.error(`Erro ao recompilar o projeto: ${err}`);
//             return;
//         }
//         console.log(`Projeto recompilado com sucesso!.`);
//     });

//     console.error(error);
// });

console.log('O bot está em execução...');

setInterval(() => {
    console.log("is alive...");
}, 30000);

// const puppeteer = require('puppeteer');

// (async () => {function initializeWhatsApp(){
//     const browser = await puppeteer.launch({ headless: false }); // Abre o navegador com a interface gráfica visível
//     const page = await browser.newPage();

//     await page.goto('https://web.whatsapp.com');

//     // Espere até que o QR Code de login esteja disponível
//     await page.waitForSelector('canvas');

//     // Agora o usuário deve escanear o QR Code manualmente

//     // Aqui você poderia inserir uma pausa ou um código para esperar que o usuário escaneie o QR Code

//     // Agora, espera até que a mensagem de chat esteja disponível
//     await page.waitForSelector('div[contenteditable="true"]');
// }})

// (async () => {


//   // Agora o elemento está disponível, então você pode digitar uma mensagem
//   await page.type('div[contenteditable="true"]', 'SIGNALS!');
//   await page.keyboard.press('Enter');
//   await page.type('div[contenteditable="true"]', 'Sua mensagem aqui');
//   await page.keyboard.press('Enter');

//   // Encerra o navegador após a execução do script
//   // await browser.close();
// })();