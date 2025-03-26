document.addEventListener("DOMContentLoaded", function () {
  const salutareFunc = function () {
    const spanSalutare = document.getElementById("salutare");
    const now = new Date();
    const hours = now.getHours();
    console.log(hours);

    if (hours < 14) {
      spanSalutare.innerText = "Buongiorno";
    } else {
      spanSalutare.innerText = "Buonasera";
    }
  };

  salutareFunc();
});

const dateFooter = function () {
  const span = document.getElementById("date-year");
  span.innerText = new Date().getFullYear();
};

dateFooter();
