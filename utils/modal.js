const modal = document.getElementById("modal");
const modalText = document.querySelector("p");

const showModal = (text) => {
  modal.style.display = "flex";
  modalText.innerText = text;
};

const removeModal = () => {
  modal.style.display = "none";
};

export { showModal, removeModal };
