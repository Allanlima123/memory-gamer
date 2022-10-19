"use strict";

const getRickAndMory = id => `https://rickandmortyapi.com/api/character/${id}`;

const btnPlay = document.querySelector(".btnPlay");
const inputJogador = document.querySelector("#nameJogador");
const root = document.querySelector(".root");

const boxCards = document.querySelector(".box-cards");
const formLogin = document.querySelector(".login-form");
const id_jogador = document.querySelector("#id_jogador");
const timePartida = document.querySelector("#time");

let tempo = 0;
let cardsClosed = 10;
let cro;

let arrPersonagem = [];
let posicaoCard = [];

const buscarDadosPromises = () => Array(10)
    .fill()
    .map(async (_, index) => {
        const retorno = await fetch(getRickAndMory(index + 1));
        return await retorno.json();
    })

const rickAndMoryPromisses = buscarDadosPromises();

const printIdGamer = () =>{
    let gamer = inputJogador.value;

    id_jogador.textContent = gamer;
}

const tempoTotalDaPartida = () =>{
    tempo++;
    tempo = tempo < 10 ? `0${tempo}` : tempo;

    timePartida.textContent = tempo;
}

const checkResolvedPromises = async () => {
    let allPrimiseResolved = await Promise.all(rickAndMoryPromisses);

    let cards = allPrimiseResolved.reduce((acc, {id, image, name }) => {
        acc += `
        <div class="card" data-img="${name}">
            <div class="front">
                <img src="image/rick-and-morty.jpg" alt="imagem-front">
            </div>
            <div class="back">
                <img src="${image}" alt="${name}">
            </div>
        </div>
        
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
    let front = document.querySelectorAll(".front");
    let back = document.querySelectorAll(".back");

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
        let tempoPartida = cardsClosed--;
        console.log(tempoPartida)

        if(tempoPartida === 1){
            clearInterval(cro);
        }
    }

    arrPersonagem.length = 0;
    posicaoCard.length = 0;
}

const compararCards = () =>{
    const allcard = [...document.querySelectorAll(".card")];
    
    allcard.map((card,index) =>{
        card.addEventListener("click", () =>{
            let front = document.querySelectorAll(".front");
            let back = document.querySelectorAll(".back");
            
            let personagem = card.getAttribute("data-img");

            let elementoJaClicado = 
                front[index].classList.contains("ativo") || 
                back[index].classList.contains("ativo")

            if(elementoJaClicado) return

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

btnPlay.addEventListener("click", (e) => {
    e.preventDefault();

    const nomeGamer = inputJogador.value;

    if (nomeGamer === "" || inputJogador.lenght <= 3) {
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




