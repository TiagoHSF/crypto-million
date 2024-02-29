import TelegramBot, { CallbackQuery, InlineKeyboardMarkup, ReplyKeyboardMarkup } from 'node-telegram-bot-api';
import { Client, MessageMedia } from 'whatsapp-web.js';
import { environmentDev, environmentProd } from './environment';
import * as functions from 'firebase-functions';

//bot para tratar as mensagens
const bot = new TelegramBot(environmentProd.botId, { polling: true });
const groupId = environmentProd.telegramGroupId;
const whatsappGroup = environmentProd.whatsappGroupId;


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCVJMwwYZFFFHk0AMa3fTKySqrn5loCVLg",
    authDomain: "cryptomillion-208d3.firebaseapp.com",
    projectId: "cryptomillion-208d3",
    storageBucket: "cryptomillion-208d3.appspot.com",
    messagingSenderId: "635527319270",
    appId: "1:635527319270:web:af735fe575b1bb8006b527"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const telegramBot = functions.https.onRequest((req: any, res: any) => {
    // Verifica se é uma solicitação POST e se tem um corpo válido
    if (req.method === 'POST' && req.body) {
        // Processa a atualização do Telegram recebida no corpo da solicitação
        bot.processUpdate(req.body);
        res.status(200).send('OK');
    } else {
        // Retorna um erro se a solicitação não for POST ou se o corpo não for válido
        res.status(400).send('Bad Request');
    }
});


const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
const mentionRegex = /@[\w.-]+/g;

const { exec } = require('child_process');
const client = new Client({
    puppeteer: {
        headless: true, // Define se o navegador deve ser visível ou não
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    },
    restartOnAuthFail: true, // Reiniciar automaticamente em caso de falha na autenticação
});

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
        .catch((error) => {
            console.error('Erro ao enviar mensagem:', error);
        });
}

function sendMessageToWhatsappGroup(msg: string) {
    console.log(client);
    client.on('ready', async () => {
        const groupName = 'CONTAS DO MÊS';

        try {
            const chats = await client.getChats();
            console.log(chats);
            const group = chats.find(chat => chat.isGroup && chat.name === groupName);

            if (group) {
                // Envie a mensagem para o grupo
                await group.sendMessage('Sua mensagem aqui');
                console.log('Mensagem enviada com sucesso para o grupo!');
            } else {
                console.error(`Grupo '${groupName}' não encontrado.`);
            }
        } catch (error) {
            console.error('Erro ao enviar mensagem para o grupo:', error);
        }
    });
}

client.initialize();

bot.on('polling_error', (error) => {
    exec('cd src && npx ts-node index.ts', (err: any, stdout: any, stderr: any) => {
        if (err) {
            console.error(`Erro ao recompilar o projeto: ${err}`);
            return;
        }
        console.log(`Projeto recompilado com sucesso!.`);
    });

    console.error(error);
});

console.log('O bot está em execução...');

setInterval(() => {
    console.log("is alive...");
}, 3 * 60 * 1000);

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