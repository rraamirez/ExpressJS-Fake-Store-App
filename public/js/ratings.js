document.addEventListener("DOMContentLoaded", async () => {
  console.log("Iniciando fetch ...");
  const ele_stars = document.getElementsByClassName("stars");

  for (const ele of ele_stars) {
    const ide = ele.dataset._id;
    try {
      const response = await fetch(`/api/ratings/${ide}`);
      if (!response.ok) {
        console.error(`Error fetching rating to ${ide}: ${response.status}`);
        continue;
      }

      const { rating } = await response.json();
      const html_nuevo_con_las_estrellas = generarHTMLConEstrellas(rating);
      ele.innerHTML = html_nuevo_con_las_estrellas;

      for (const ele_hijo of ele.children) {      // ele.children es un iterable
        // elemento con estrella
        ele_hijo.addEventListener('click', Vota)
        console.log(ele_hijo)
      } 
    
    } catch (error) {
      console.error(`Error processing rating for ${ide}:`, error);
    }
  }
});

function generarHTMLConEstrellas(rating) {
  const stars = Math.round(rating.rate);
  let html = "";

  for (let i = 0; i < stars; i++) {
    html += '<span class="fa fa-star checked"></span>';
  }

  for (let i = stars; i < 5; i++) {
    html += '<span class="fa fa-star"></span>';
  }

  html += ` <span>(${rating.count} Opinions)</span>`;
  return html;
}

async function Vota(evt) {
  const ide = evt.target.dataset._id;
  const pun = evt.target.dataset.star;
  console.log(ide);
  console.log(pun);

  try {
    const response = await fetch(`/api/ratings/${ide}`);
    if (!response.ok) {
        console.error(`Error fetching rating to ${ide}: ${response.status}`);
    }
    const { rating } = await response.json();
    const count = rating.count + 1;
    
    
    await fetch(`/api/ratings/${ide}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pun, count }),
    });
  } catch (error) {
    console.error(error);
  }
}


