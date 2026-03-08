document.addEventListener("DOMContentLoaded",()=>{

// Câmbio
fetch("https://api.exchangerate.host/latest?base=USD&symbols=AOA,EUR")
.then(res=>res.json())
.then(data=>{
document.getElementById("dolar").innerText=`1 USD = ${data.rates.AOA} Kz`;
document.getElementById("euro").innerText=`1 EUR = ${data.rates.AOA} Kz`;
}).catch(()=>{document.getElementById("dolar").innerText="Erro";document.getElementById("euro").innerText="Erro";});

// Combustível
document.getElementById("precoCombustivel").innerText="Gasolina: 550 Kz/L, Diesel: 450 Kz/L";

// Vagas
const vagas=["Vaga de Contador – Luanda","Concurso Público – Ministério da Educação","Desenvolvedor Web – Empresa Privada"];
const listaVagas=document.getElementById("listaVagas");
vagas.forEach(v=>{const li=document.createElement("li");li.textContent=v;listaVagas.appendChild(li);});

// Notícias
fetch(`https://newsapi.org/v2/top-headlines?country=ao&apiKey=${newsApiKey}`)
.then(res=>res.json())
.then(data=>{const listaNoticias=document.getElementById("listaNoticias");listaNoticias.innerHTML="";data.articles.forEach(a=>{const li=document.createElement("li");li.textContent=a.title;listaNoticias.appendChild(li);});})
.catch(err=>console.log("Erro notícias"));

// Alertas pagos
document.getElementById("btnAlertas").addEventListener("click",()=>{
  const email=document.getElementById("emailUsuario").value;
  const tipo=document.getElementById("tipoAlerta").value;
  if(!email){document.getElementById("statusAlerta").innerText="Digite um e-mail válido";return;}

  if(tipo==="gratis"){
    document.getElementById("statusAlerta").innerText=`Alerta gratuito cadastrado: ${email}`;
    // Aqui pode salvar em Google Sheets / Firebase
  } else {
    // Stripe Checkout
    const stripe = Stripe(stripePublicKey);
    fetch("/create-checkout-session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})})
    .then(res=>res.json())
    .then(session=>stripe.redirectToCheckout({sessionId:session.id}))
    .catch(err=>console.log(err));
  }
});

// PDF Premium
document.getElementById("btnPDF").addEventListener("click",()=>{
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF();
  doc.text("Relatório Premium Angola Hoje",10,10);
  doc.text(document.getElementById("dolar").innerText,10,20);
  doc.text(document.getElementById("euro").innerText,10,30);
  doc.text(document.getElementById("precoCombustivel").innerText,10,40);
  doc.save("relatorio_angola_hoje_premium.pdf");
});
