// Access DOM Elements

const gridContainer = document.querySelector(".grid-container");
const chooseSizeHeader = document.querySelector(".choose-size");
const buttonContainer = document.querySelector(".button-container");
const mxnInputContainer = document.querySelector(".mxn-input"); // m x n short for (row x col)
const mxnRowInput = document.querySelector(".mxn-input .mxnRow input");
const mxnColInput = document.querySelector(".mxn-input .mxnCol input");
const mxnRowText = document.querySelector(".mxn-input .mxnRow span");
const mxnColText = document.querySelector(".mxn-input .mxnCol span");
const rrefContainer = document.querySelector(".rref-matrix-container");
const rrefDiv = document.querySelector(".rref-matrix");

// Click "Make" button

buttonContainer.firstElementChild.addEventListener("click", () => {
  //Converts user input to integer value

  rows = parseInt(mxnRowInput.value);
  columns = parseInt(mxnColInput.value);

  // Row and Column input restrictions

  if (!(mxnRowInput.value == "") && !(mxnColInput.value == "")) {
    if (Number.isInteger(rows) && Number.isInteger(columns)) {
      if (rows <= 7 && rows >= 1 && (columns <= 7 && columns >= 1)) {
        // removes "Choose Size" text, hidden class, and the "Make" button container

        gridContainer.removeChild(chooseSizeHeader);
        const bothMatricesContainer = document.createElement("div");
        const matrix = document.createElement("div");
        const matrixContainer = document.createElement("div");
        const yourMatrix = document.createElement("span");
        const submitContainer = document.createElement("div");
        gridContainer.replaceChild(submitContainer, buttonContainer);
        yourMatrix.className = "your-matrix";
        bothMatricesContainer.className = "item";
        matrix.className = "matrix";
        matrixContainer.className = "matrix-container";
        bothMatricesContainer.appendChild(matrix);
        matrix.appendChild(matrixContainer);
        gridContainer.insertBefore(bothMatricesContainer, submitContainer);
        yourMatrix.innerHTML = "Populate your Matrix:";
        matrix.insertBefore(yourMatrix, matrixContainer);

        // Adds what the user specifies for rows and column to the existing text

        mxnRowText.innerHTML += `${mxnRowInput.value}`;
        mxnColText.innerHTML += `${mxnColInput.value}`;

        //Removes the Row and Column input boxes

        mxnInputContainer.children[0].removeChild(mxnRowInput);
        mxnInputContainer.children[1].removeChild(mxnColInput);
        mxnInputContainer.className = "item";

        //display the matrix to screen

        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            const div = document.createElement("div");
            const input = document.createElement("input");

            div.className = "cell";
            input.className = "inputs";
            input.setAttribute("type", "text");
            input.setAttribute("maxlength", "3");
            div.appendChild(input);
            matrixContainer.appendChild(div);

            //starts a new row every time the column amount is reached by adding an html "br" element

            if (j === columns - 1) {
              const br = document.createElement("br");
              div.appendChild(br);
            }
          }
        }

        //Create the button that can reload the page

        const refreshButtonContainer = document.createElement("div");
        const refreshButton = document.createElement("button");
        refreshButtonContainer.className = "refresh-container item";
        refreshButton.className = "refresh";
        refreshButton.setAttribute("onclick", "window.location.reload();");
        refreshButton.innerHTML = "restart";
        refreshButtonContainer.appendChild(refreshButton);
        gridContainer.appendChild(refreshButtonContainer);

        //Create a submit button

        const submit = document.createElement("button");
        submitContainer.className = "item button-submit-container";
        submit.className = "button-submit";
        submit.innerHTML = "submit";
        submitContainer.appendChild(submit);
        gridContainer.insertBefore(submitContainer, refreshButtonContainer);
        const btnSubmit = document.querySelector(".button-submit");

        //////////////////////////////// When the SUBMIT button is clicked.. ///////////////////////////////////

        btnSubmit.addEventListener("click", () => {
          const cellNodeList = document.querySelectorAll(
            ".matrix-container .cell .inputs"
          );

          //Make sure they are integers b/w -99 and 99, blanks will become 0

          var count = 0;

          for (let i = 0; i < rows * columns; i++) {
            if (cellNodeList[i].value == "") {
              cellNodeList[i].value = 0;
            }

            if (parseInt(cellNodeList[i].value) == NaN) {
              count += 1;
            }
            if (
              !(
                parseInt(cellNodeList[i].value) <= 99 &&
                parseInt(cellNodeList[i].value) >= -99
              )
            ) {
              count += 1;
            }
          }
          if (count > 0) {
            //  if at least 1 error was counted, outputs error message

            alert("Make sure you entered numbers between -99 and 99");
          }

          if (count === 0) {
            //if no errors detected, code runs

            const rrefSpan = document.createElement("span");
            const rrefMatrix = document.createElement("div");
            const rrefContainer = document.createElement("div");
            rrefMatrix.className = "rref-matrix";
            rrefContainer.className = "rref-matrix-container";
            rrefSpan.className = "rref-title";
            bothMatricesContainer.appendChild(rrefMatrix);
            rrefMatrix.appendChild(rrefContainer);
            gridContainer.removeChild(submitContainer);
            rrefSpan.innerHTML = "Answer:";
            yourMatrix.innerHTML = "Your Matrix:";
            rrefMatrix.insertBefore(rrefSpan, rrefContainer);

            //create empty array, populate it with input values

            const arr = [];
            for (let i = 0; i < rows * columns; i++) {
              arr.push(cellNodeList[i].value);
              cellNodeList[i].setAttribute("disabled", "");
            }

            //create empty array, populate it with sub arrays from the arr variable created above

            const matrix = [];
            while (arr.length) {
              matrix.push(arr.splice(0, columns));
            }

            //transforms the matrix(2d array) into RREF

            function reducedRowEchelonForm() {
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

            reducedRowEchelonForm(arr);

            //Outputs the new rref matrix to the screen

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

                rrefContainer.appendChild(div);
                input.value = matrix[i][j];

                input.setAttribute("title", input.value);

                if (j === columns - 1) {
                  const br = document.createElement("br");
                  div.appendChild(br);
                } //if ends
              } // inner for loop ends
            } // outer for loop ends
          } // "if count is 0" ends
        }); // click Submit button event listener ends

        //Outputs if the conditions are broken
      } else {
        alert("The number you entered is not between 1 and 7");
      }
    } else {
      alert(
        "The value you entered is not a number, please specify positive numbers from 1 to 7."
      );
    }
  } else {
    alert("You left a blank! Please specify positive numbers from 1 to 7.");
  }
}); // click Make button event listener ends
