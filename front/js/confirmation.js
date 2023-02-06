displayOrderId();

function displayOrderId() {
  document.querySelector("#orderId").innerText =
    localStorage.getItem("orderId");

  // On vide le localStorage pour recommencer plus tard le processus d'achat
  localStorage.clear();
}
