"use strict";

const getRickAndMory = id => `https://rickandmortyapi.com/api/character/${id}`;

const btnPlay = document.querySelector(".btnPlay");
const inputJogador = document.querySelector("#nameJogador");
const root = document.querySelector(".root");

const boxCards = document.querySelector(".box-cards");
const formLogin = document.querySelector(".login-form");
const name_jogador = document.querySelectorAll(".id_jogador");
const timePartida = document.querySelectorAll(".time");
const recarregar = document.querySelector(".reload-gamer");

const windowModal = document.querySelector("#box-modal");

let tempo = 0;
let cardsClosed = 20;
let cro;

let arrPersonagem = [];
let posicaoCard = [];
let arrayEmbaralhado = [];
let arrayEmbaralhado02 = [];
let loop = 0,index = 0;

const buscarDadosPromises = () => Array(20)
    .fill()
    .map(async (_, index) => {
        const retorno = await fetch(getRickAndMory(index + 1));
        return await retorno.json();
    })

const rickAndMoryPromisses = buscarDadosPromises();

const printIdGamer = () =>{
    let gamer = inputJogador.value;

    name_jogador.forEach(jogador => jogador.textContent = gamer);
}

const tempoTotalDaPartida = () =>{
    tempo++;
    tempo = tempo < 10 ? `0${tempo}` : tempo;

    timePartida.forEach(time => time.textContent = tempo);
}

const gerarNumeroAleatorio = (min,max) =>{
    return Math.floor(Math.random() * (max - min  + 1)) + min;
}

const checkResolvedPromises = async () => {
    let allPrimiseResolved = await Promise.all(rickAndMoryPromisses);

    while(loop !== 20){
        let numGerado = gerarNumeroAleatorio(0,allPrimiseResolved.length - 1);
    
        while(!(arrayEmbaralhado.includes(allPrimiseResolved[numGerado]))){
            loop++;
            arrayEmbaralhado.push(allPrimiseResolved[numGerado]);
        };
    }

    while(index !== 20){
        let numGerado = gerarNumeroAleatorio(0,allPrimiseResolved.length - 1);
    
        while(!(arrayEmbaralhado02.includes(allPrimiseResolved[numGerado]))){
            index++;
            arrayEmbaralhado02.push(allPrimiseResolved[numGerado]);
        };
    }

    let newArray = [...arrayEmbaralhado,...arrayEmbaralhado02];

    let cards = newArray.reduce((acc, { image, name }) => {
        acc += `
        <div class="card" data-img="${name}">
            <div class="front">
                <img src="image/rick-and-morty.jpg" alt="imagem-front">
            </div>
            <div class="back">
                <img src="${image}" alt="${name}">
            </div>
        </div>
        `

        return acc
    }, " ");

    boxCards.innerHTML = cards;
}


const verificarCards = () =>{
    const front = document.querySelectorAll(".front");
    const back = document.querySelectorAll(".back");

    let posicao1 = posicaoCard[0];
    let posicao2 = posicaoCard[1];

    if(!(arrPersonagem[0] === arrPersonagem[1])){
        setTimeout(() => {
            front[posicao1].classList.remove("ativo");
            back[posicao1].classList.remove("ativo");
            front[posicao2].classList.remove("ativo");
            back[posicao2].classList.remove("ativo");
        }, 1200);
    }else{
        let acertosCards = cardsClosed--;

        if(acertosCards === 1){
            clearInterval(cro);

            setTimeout(() => {
                windowModal.classList.add("active");
                root.classList.remove("active");
            }, 2000);
        }
    }

    arrPersonagem.length = 0;
    posicaoCard.length = 0;
}

const compararCards = () =>{
    const allcard = [...document.querySelectorAll(".card")];
    
    allcard.map((card,index) =>{
        card.addEventListener("click", () =>{
            const front = document.querySelectorAll(".front");
            const back = document.querySelectorAll(".back");
            
            let personagem = card.getAttribute("data-img");

            let elementoJaClicado = 
                front[index].classList.contains("ativo") || 
                back[index].classList.contains("ativo")

            if(elementoJaClicado) return;

            if(arrPersonagem.length <= 1  && posicaoCard.length <= 1){
                arrPersonagem.push(personagem);
                posicaoCard.push(index)
            }

            front[index].classList.add("ativo");
            back[index].classList.add("ativo");

            if(arrPersonagem.length === 2) verificarCards();
        })
    })
}

btnPlay.addEventListener("click", e => {
    e.preventDefault();

    const nomeGamer = inputJogador.value;

    if (nomeGamer === "" || nomeGamer.length <= 3 || nomeGamer.length >= 15) {
        alert("Jogador Invalido tente novamente");
        inputJogador.focus();
        return
    }

    checkResolvedPromises();
    printIdGamer();

    setTimeout(() => {
        root.classList.add("active");
        formLogin.classList.add("active");

        compararCards();
    }, 800);

    cro = setInterval(() => tempoTotalDaPartida(),1000);
});

recarregar.addEventListener("click",() => document.location.reload());




