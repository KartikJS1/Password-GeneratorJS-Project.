document.addEventListener("DOMContentLoaded", () => {
    const inputSlider = document.querySelector("[data-lengthSlider]");
    const lengthDisplay = document.querySelector("[data-lengthNumber]");
    const passwordDisplay = document.querySelector("[data-passwordDisplay]");
    const copyBtn = document.querySelector("[data-copy]");
    const copyMsg = document.querySelector("[data-copyMsg]");
    const uppercaseCheck = document.querySelector("#uppercase");
    const lowercaseCheck = document.querySelector("#lowercase");
    const numbersCheck = document.querySelector("#numbers");
    const symbolsCheck = document.querySelector("#symbols");
    const indicator = document.querySelector("[data-indicator]");
    const generateBtn = document.querySelector(".generateButton");
    const allCheckBoxes = document.querySelectorAll(".checkbox-input");
    const symbols = '~`!@#$%^&*()_-+={}[]\|;:"",<>.?/';
    let password = "";
    let passwordLength = 10;
    let checkCount = 0;
    handleSlider();
    setIndicator("#ccc");
    console.log(indicator);
    // Rest of your existing JavaScript code...
    //Set passwordLength
    // function handleSlider() {
    //     inputSlider.value = passwordLength;
    //     lengthDisplay.innerText = passwordLength;
    //     const min = inputSlider.min;
    //     const max = inputSlider.max;
    //     inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";

    //     console.log(inputSlider.style.backgroundSize);
    // }

    function handleSlider() {
        inputSlider.value = passwordLength;
        lengthDisplay.innerText = passwordLength;

        const min = inputSlider.min;
        const max = inputSlider.max;
        const color = `linear-gradient(to right, purple 0%, violet   ${((passwordLength - min) * 100) / (max - min)}%, #ccc ${((passwordLength - min) * 100) / (max - min)}%, #ccc 100%)`;
        inputSlider.style.background = color;
    }

    function setIndicator(color) {
        indicator.style.backgroundColor = color;
        indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
    }

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function generateRandomNumber() {
        return getRndInteger(0, 9);
    }

    function generateLowercase() {
        return String.fromCharCode(getRndInteger(97, 123));
    }

    function generateUppercase() {
        return String.fromCharCode(getRndInteger(65, 91));
    }

    function generateSymbol() {
        const randNum = getRndInteger(0, symbols.length);
        return symbols.charAt(randNum);
    }

    function calcStrength() {
        let hasUpper = false;
        let hasLower = false;
        let hasNum = false;
        let hasSym = false;

        if (uppercaseCheck.checked) hasUpper = true;
        if (lowercaseCheck.checked) hasLower = true;
        if (numbersCheck.checked) hasNum = true;
        if (symbolsCheck.checked) hasSym = true;

        if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
            setIndicator("#0f0"); //color
        } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
            setIndicator("#ff0"); //color
        } else {
            setIndicator("#f00"); //color
        }
    }

    async function copyContent() {
        try {
            await navigator.clipboard.writeText(passwordDisplay.value);
            copyMsg.innerText = "Copied";
        } catch (e) {
            copyMsg.innerText = "Failed";
        }
        // to make copy span visible
        copyMsg.classList.add("active");

        setTimeout(() => {
            copyMsg.classList.remove("active");
        }, 2000);
    }

    function shufflePassword(array) {
        // Fisher Yates Method
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

    function handleCheckBoxChange() {
        checkCount = 0;
        allCheckBoxes.forEach((checkbox) => {
            if (checkbox.checked)
                checkCount++;
        });

        // special condition
        if (passwordLength < checkCount) {
            passwordLength = checkCount;
            handleSlider();
        }
    }

    // function handleCheckBoxChange() {
    //     checkCount = 0;
    //     allCheckBox.forEach((checkbox) => {
    //         if (checkbox.checked)
    //             checkCount++;
    //     });

    //     // special condition
    //     if (passwordLength < checkCount) {
    //         passwordLength = checkCount;
    //         handleSlider();
    //     }
    // }

    allCheckBoxes.forEach((checkbox) => {
        checkbox.addEventListener('change', handleCheckBoxChange);
    })

    // console.log("what is");

    // console.log(checkbox);


    inputSlider.addEventListener('input', (e) => {
        passwordLength = e.target.value;
        handleSlider();
    });

    copyBtn.addEventListener('click', () => {
        if (passwordDisplay.value) {
            copyContent();
        }
    });


    generateBtn.addEventListener('click', () => {
        // none of the checkbox are selected
        if (checkCount <= 0) return;

        if (passwordLength < checkCount) {
            passwordLength = checkCount;
            handleSlider();
        }

        // Let's start the journey to find new password
        console.log("starting ");
        // remove old password
        password = "";

        // Let's put the stuff mentioned by checkboxes

        // if (uppercaseCheck.checked) {
        //     password += generateUppercase();
        // }

        // if (lowercaseCheck.checked) {
        //     password += generateLowercase();
        // }

        // if (numbersCheck.checked) {
        //     password += generateRandomNumber();
        // }

        // if (symbols.checked) {
        //     password += generateSymbol();
        // }


        let funcArr = [];

        if (uppercaseCheck.checked) {
            funcArr.push(generateUppercase);
        }
        if (lowercaseCheck.checked) {
            funcArr.push(generateLowercase);
        }
        if (numbersCheck.checked) {
            funcArr.push(generateRandomNumber);
        }
        if (symbolsCheck.checked) {
            funcArr.push(generateSymbol);
        }

        // compulsory addition
        for (let i = 0; i < funcArr.length; i++) {
            password += funcArr[i]();
        }

        console.log("compulsory done ");


        // remaining addition
        for (let i = 0; i < passwordLength - funcArr.length; i++) {
            let randIndex = getRndInteger(0, funcArr.length); // Corrected line
            password += funcArr[randIndex]();
        }
        console.log("remaining done ");


        // shuffle the password
        password = shufflePassword(Array.from(password));
        console.log("shuffling done ");

        // show in UI
        passwordDisplay.value = password;
        console.log("ui done ");

        // calculate strength
        calcStrength();

    });



});



