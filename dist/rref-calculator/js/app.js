const mainContainer = document.querySelector(".main-container");
const menuContainer = document.querySelector(".menu-container");
const matrixContainer = document.querySelector(".matrix-container");
const inputMatrix = document.querySelector(".input-matrix");
const outputMatrix = document.querySelector(".output-matrix");
const chooseRowSize = document.querySelector(".row-size");
const chooseColSize = document.querySelector(".col-size");
const calculateButton = document.querySelector(".calculate");
const rowSliderValue = document.querySelector(".row-slider-value");
const colSliderValue = document.querySelector(".col-slider-value");

function readRowColValues() {
  rows = parseInt(chooseRowSize.value);
  columns = parseInt(chooseColSize.value);
}

function resetMatrices() {
  outputMatrix.parentNode.style.display = "none";
  inputMatrix.innerHTML = "";
}

function setSizeFromSliderValue(sliderValue, chooseSize) {
  sliderValue.textContent = chooseSize.value;
}

function resetOutputMatrix() {
  outputMatrix.style.display = "none";
  outputMatrix.parentNode.style.display = "none";
}

function preventCompounding() {
  inputMatrix.innerHTML = "";
  outputMatrix.innerHTML = "";
}

function slideChangeListen(chooseSize, sliderValue) {
  chooseSize.addEventListener("input", () => {
    resetMatrices();
    setSizeFromSliderValue(sliderValue, chooseSize);
    readRowColValues();
    createMatrix(rows, columns);
  });
}

// RREF Calculation function
function reducedRowEchelonForm(matrix) {
  let lead = 0;
  for (let r = 0; r < rows; r++) {
    if (columns <= lead) {
      return;
    }
    let i = r;
    while (matrix[i][lead] == 0) {
      i++;
      if (rows == i) {
        i = r;
        lead++;
        if (columns == lead) {
          return;
        }
      }
    }
    let tmp = matrix[i];
    matrix[i] = matrix[r];
    matrix[r] = tmp;
    let val = matrix[r][lead];
    for (let j = 0; j < columns; j++) {
      matrix[r][j] /= val;
    }
    for (let i = 0; i < rows; i++) {
      if (i == r) continue;
      val = matrix[i][lead];
      for (let j = 0; j < columns; j++) {
        matrix[i][j] -= val * matrix[r][j];
      }
    }
    lead++;
  }
  return matrix;
}

function calculateButtonListen(chooseSize) {
  chooseSize.addEventListener("change", () => {
    preventCompounding();
    readRowColValues();
    createMatrix(rows, columns);
    resetOutputMatrix();
  });
}

//Edit Matrix function
function createMatrix(rows, columns) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const div = document.createElement("div");
      const input = document.createElement("input");

      div.className = "cell";
      input.className = "inputs";
      input.setAttribute("type", "text");
      input.setAttribute("maxlength", "3");
      div.appendChild(input);
      inputMatrix.appendChild(div);

      //starts a new row every time the column amount is reached by adding an html "br" element

      if (j === columns - 1) {
        const br = document.createElement("br");
        div.appendChild(br);
      }
    }
  }
}

function outputOutputMatrix() {
  readRowColValues();
  const cellNodeList = document.querySelectorAll(".input-matrix .cell .inputs");
  // Blank inputs will become zeroes
  for (let i = 0; i < rows * columns; i++) {
    if (cellNodeList[i].value == "") {
      cellNodeList[i].value = 0;
    }
  }
  //create empty array, populate it with input values
  const arr = [];

  for (let i = 0; i < rows * columns; i++) {
    arr.push(cellNodeList[i].value);
  }

  //create empty array, populate it with sub arrays from the arr variable created above
  const matrix = [];

  while (arr.length) {
    matrix.push(arr.splice(0, columns));
  }

  reducedRowEchelonForm(matrix);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const div = document.createElement("div");
      const input = document.createElement("input");

      div.className = "cell";
      input.setAttribute("type", "text");
      input.setAttribute("disabled", "");
      div.appendChild(input);

      // Test if value is a long decimal

      if (matrix[i][j].toString().length > 3) {
        input.className = "longInput";
      } else {
        input.className = "inputs";
      }

      outputMatrix.appendChild(div);
      input.value = matrix[i][j];

      input.setAttribute("title", input.value);

      if (j === columns - 1) {
        const br = document.createElement("br");
        div.appendChild(br);
      }
    } // inner for loop ends
    outputMatrix.style.display = "block";
    outputMatrix.parentElement.style.display = "flex";
  }
}

//Create initial matrix when loading page

window.onload = function () {
  readRowColValues();
  setSizeFromSliderValue(rowSliderValue, chooseRowSize);
  setSizeFromSliderValue(colSliderValue, chooseColSize);
  createMatrix(rows, columns);
};

//Listen for dropwdown menu changes
slideChangeListen(chooseRowSize, rowSliderValue);
slideChangeListen(chooseColSize, colSliderValue);

//When you click the calculate button
calculateButton.addEventListener("click", () => {
  outputMatrix.innerHTML = "";
  outputOutputMatrix();
  calculateButtonListen(chooseRowSize);
  calculateButtonListen(chooseColSize);
});
