document.addEventListener("DOMContentLoaded", async () => {
  console.log("Iniciando fetch ...");
  const ele_stars = document.getElementsByClassName("stars");

  for (const ele of ele_stars) {
    const ide = ele.dataset._id;
    try {
      const response = await fetch(`/api/ratings/${ide}`);
      if (!response.ok) {
        console.error(`Error llamando a la api para ${ide}: ${response.status}`);
        continue;
      }

      const { rating } = await response.json();
      const html_nuevo_con_las_estrellas = generarHTMLConEstrellas(rating, ide);
      ele.innerHTML = html_nuevo_con_las_estrellas;

      for (const ele_hijo of ele.children) {
        // ele.children es un iterable
        // elemento con estrella
        ele_hijo.addEventListener("click", Vota);
        console.log(ele_hijo);
      }
    } catch (error) {
      console.error(`Error en el domcontentloadded para:  ${ide}:`, error);
    }
  }
});

function generarHTMLConEstrellas(rating, ide) {
  //Evidentemente esto no es realista porque lo ideal sería
  //hacer media, pero a modo de demostración de ver cómo se ha hecho el frontend 
  //el rating rate actualizará con un sólo voto
  const stars = Math.round(rating.rate); 
  let html = "";

  /*
  ES MUY IMPORTANTE AÑADIR EL ID EN LOS SPAN, SINO NO PODREMOS HACER LA LLAMADA A LA API BIEN
  */

  for (let i = 1; i <= stars; i++) {
    html += `<span class="fa fa-star checked" data-star="${i}" data-_id="${ide}"></span>`;
  }

  for (let i = stars + 1; i <= 5; i++) {
    html += `<span class="fa fa-star" data-star="${i}" data-_id="${ide}"></span>`;
  }

  html += ` <span>(${rating.count} Opinions)</span>`;
  return html;
}

async function Vota(evt) {
  const ide = evt.target.dataset._id;
  const pun = parseInt(evt.target.dataset.star, 10);

  try {
    const response = await fetch(`/api/ratings/${ide}`);
    if (!response.ok) {
      console.error(`Error en la llamada a la api para:  ${ide}: ${response.status}`);
      return;
    }
    const { rating } = await response.json();
    const count = rating.count + 1;

    const vote = await fetch(`/api/ratings/${ide}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ // importante pasar a int para poder hacer la petición
        rating: parseInt(pun, 10),
        count: parseInt(count, 10),
      }),
    });

    vote.ok ? location.reload() : console.error("No se pudo votar o al menos la api no responde :(");
  
  } catch (error) {
    console.error(error);
  }
}
