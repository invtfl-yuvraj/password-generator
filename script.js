const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMessage = document.querySelector("[data-copyMessage]");
const copyButton = document.querySelector("[data-copy]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const checkUppercase = document.querySelector("#uppercase");
const checkLowercase = document.querySelector("#lowercase");
const checkNumbers = document.querySelector("#numeric");
const checkSymbols = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateButton = document.querySelector("#generate-btn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]")

let symbols = "!@#$%^&*()-+/{}[]_?~':;|<>,.";

let password = "";
let passwordLength = 6;

let checkCount = 0;


// updating and displaying password length
function handleSlider() {
    if(passwordLength < checkCount){
        passwordLength = checkCount;
    }
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;

    console.log(min);
    console.log(max);

    let bgSize = "";

    if (inputSlider.value <= 2){
        bgSize = ((passwordLength - min)*100/(max - min) + 10) + "% 100%";
    }
    else if (inputSlider.value >= 24){
        bgSize = ((passwordLength - min)*100/(max - min) - 10) + "% 100%";
    }
    else {
        bgSize = ((passwordLength - min)*100/(max - min)) + "% 100%";
    }

    inputSlider.style.backgroundSize = bgSize;

}
handleSlider(); // setting default length


// funtion to copy content to clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMessage.innerText = "Copied";
        copyMessage.classList.add("bg-green-400", "text-green-950", "after:bg-green-400");
    }
    catch (e) {
        copyMessage.innerText = "Failed";
        copyMessage.classList.add("bg-red-300", "text-red-950", "after:bg-red-300");
    }

    copyMessage.classList.remove("hidden");

    setTimeout(() => {
        copyMessage.classList.add("hidden");
    }, 2000);

}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandomInteger(0, 9);
}

function generateRandomUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateRandomLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123))
}

function generateRandomSymbol() {
    const randNum = getRandomInteger(0, symbols.length);
    return symbols[randNum];
}

function setIndicator(currState = 0){
    const state = ["white", "red-600", "orange-500", "yellow-500","lime-500","green-600"];
    const msg = ["", "Too Weak!!", "Weak!!", "Moderate!!", "Strong!!", "Too Strong!!"];
    
    state.forEach((color) => {
        if (indicator.classList.contains("bg-" + color) != ("bg-" + state[currState])){
            indicator.classList.remove("bg-" + color);
            indicator.classList.add("bg-" + state[currState]);
            indicator.firstChild.classList.remove("text-" + color);
            indicator.firstChild.classList.add("text-" + state[currState]);
            indicator.firstChild.innerText = msg[currState];
        }
    }); 
}



// function to handle the color of include button when clicked
function handleIncludeClick(clickedBtn) {
    const labelFor = clickedBtn.getAttribute('id');
    const labelElement = document.querySelector(`label[for='${labelFor}']`);
    const targetDiv = labelElement.querySelector('div');

    if (clickedBtn.checked) {
        targetDiv.classList.remove("bg-cyan-300");
        targetDiv.classList.add("bg-yellow-300");
    }
    else {
        targetDiv.classList.remove("bg-yellow-300");
        targetDiv.classList.add("bg-cyan-300");
    }
}


function handleCheckCount(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    // making default pass len;
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}


allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', (e) => {
        handleIncludeClick(e.target);
        handleCheckCount();
        // setIndicator(strengthCalculate());
    });
});


inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
    // setIndicator(strengthCalculate());
});

function strengthCalculate() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;
    if (checkUppercase.checked) hasUpper = true;
    if (checkLowercase.checked) hasLower = true;
    if (checkNumbers.checked) hasNumber = true;
    if (checkSymbols.checked) hasSymbol = true;

    if(!hasUpper && !hasLower && !hasNumber && !hasSymbol){
        return 0;
    }
    else if (hasUpper && hasLower && hasNumber && hasSymbol && passwordLength >= 8) {
      return 5;
    }
    else if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 6){
        return 4;
    }
    else if ((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordLength >= 6) {
      return 3;
    }
    else if ((hasLower || hasUpper || hasNumber || hasSymbol) && passwordLength >= 4) {
        return 2;
    }
    else {
        return 1;
    }
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

copyButton.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})


generateButton.addEventListener("click", (event)=>{
    event.preventDefault();

    if (checkCount == 0){
        return;
    }

    password = "";
    let includedItemsArr = [];    

    if (checkUppercase.checked){
        includedItemsArr.push(generateRandomUpperCase);
    }
    if (checkLowercase.checked){
        includedItemsArr.push(generateRandomLowerCase);
    }
    if (checkNumbers.checked){
        includedItemsArr.push(generateRandomNumber);
    }
    if (checkSymbols.checked){
        includedItemsArr.push(generateRandomSymbol);
    }

    let size = includedItemsArr.length;

    // if(size ==)

    // compulsory letters
    for(let i = 0; i< size; i++){
        password += includedItemsArr[i]();
    }

    for (let i = 0; i < passwordLength - size; i++){
        let randIndex = getRandomInteger(0 , size);
        password += includedItemsArr[randIndex]();
        // console.log("randomIndex" + randIndex);
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;
    setIndicator(strengthCalculate());

    console.log("Password Generated !!!");

});