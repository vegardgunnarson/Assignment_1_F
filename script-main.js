const computersElement = document.getElementById("computers");
const featuresElement = document.getElementById("features");
const titleElement = document.getElementById("title");
const descriptionElement = document.getElementById("description");
const priceElement = document.getElementById("price");
const imageElement = document.getElementById("computerImage")
const imageURL = "https://noroff-komputer-store-api.herokuapp.com/"
let computers = [];
let features = []; 
let price=20;
let selectedComputer;
var ul = "";

/**
 * Fetching json response from Noroff api
 */
fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
    .then(response => response.json())
    .then(data => computers = data)
    .then(computers => addComputersToList(computers));

const addComputersToList = (computers) => {
    computers.forEach(c => addComputerToList(c));
}
/**
 * Adds computer in selection meny and sets cumputer[0] as default
 * Stores price and selectedcomputer to be used in other functions
 * @param {computer} computer 
 */
const addComputerToList = (computer) => {
    const computerElement = document.createElement("option");
    computerElement.value = computer.id;
    computerElement.appendChild(document.createTextNode(computer.title));
    computersElement.appendChild(computerElement);
    selectedComputer = computers[0];
    addFestures(selectedComputer.specs);
    imageElement.src=imageURL+selectedComputer.image;
    priceElement.innerText = selectedComputer.price+" kr";
    price=selectedComputer.price;
    titleElement.innerText = selectedComputer.title;
    descriptionElement.innerText = selectedComputer.description;
}

/**
 * Takes in features as string and returns as unorded list
 * @param {features} array 
 */
function addFestures (array) {
    document.getElementById("features").innerHTML="";
    for (let i of array){
        let li = document.createElement("li");
        li.innerHTML = i;
        document.getElementById("features").appendChild(li);
    }
}

/**
 * Handles changes in selection meny, sets all elements to selected computer values
 * @param {eventlistener} e 
 */
const handleComputerChange = e => {
    selectedComputer = computers[e.target.selectedIndex];
    addFestures(selectedComputer.specs);
    priceElement.innerText = selectedComputer.price;
    descriptionElement.innerText = selectedComputer.description;
    titleElement.innerText = selectedComputer.title;
    priceElement.innerText = selectedComputer.price+" kr";
    price=selectedComputer.price;
    imageElement.src=imageURL+selectedComputer.image;
}
computersElement.addEventListener("change",handleComputerChange)

/**
 * Sets initial values of bank
 */
let bank = new Bank(0,0,0);
updateFields();

/**
 * Cunstructor for bank
 * @param {number} balance 
 * @param {number} loan 
 */
function Bank(balance,loan,pay){
    this.balance=balance;
    this.loan=loan;
    this.pay=pay;
}
/**
 * Returns current balance
 * @returns number
 */
function getBalance(){
    return bank.balance;
}
/**
 * Adds more money to balance
 * @param {number} b 
 */
function addBalance(b){
    bank.balance+=b;
}
/**
 * Boolean for checking if there is an existing loan
 * @returns true||false
 */
function hasLoan(){
    if (bank.loan==0){
        return false;
    }return true;
}
/**
 * Return current pay balance
 * @returns number
 */
function getPay(){
    return bank.pay;
}
/**
 * Increase pay balance with 100kr
 */
function work(){
    bank.pay+=100;
    updateFields();
}
/**
 * Returns current loan
 * @returns number
 */
function getLoan(){
    return bank.loan;
}
/**
 * Checks if user has sufficient funds and buys computer if that is the case
 */
function buy(){
    if (price<=getBalance()){
        bank.balance-=price;
        alert("Thank you for your order, you are now the proud owner of a "+selectedComputer.title+".\nYour account will be charged shortly.");
        updateFields();
    }
    else{
        alert("Insufficient funds, you need to work harder")
    }
}
/**
 * Sends all pay to loan, any left overs will be sent to balance
 */
function repay(){
    if (getPay()==0){
        alert("You do not have any untransfered pay, you need to work in order to gain pay");
    }
    if (getPay()==getLoan()){
        bank.loan = 0;
        bank.pay = 0;
        updateFields();
    }
    if (getLoan()>getPay()){
        bank.loan = bank.loan-bank.pay;
        bank.pay = 0;
        updateFields();
    } if (getLoan()<getPay()){
        let rest = bank.pay-bank.loan;
        bank.loan = 0;
        bank.pay=0;
        bank.balance+=rest;
        updateFields();
    }
}
/**
 * Transfer 90% to balance and 10% to loan, if any
 */
function pay() {
    if (getPay()==0){
        alert("You do not have any untransfered pay, you need to work in order to gain pay");
    }
    if (getPay()*0.1==getLoan()){
        bank.balance+=(getPay()*0.9);
        bank.pay=0;
        bank.loan=0;
        updateFields();
    }
    if ((getPay()*0.1)>getLoan()){
        repay();
        bank.balance+=bank.pay;
        bank.pay=0;
        updateFields();
    }
    if (getPay()>0){
        let payslip=0.9*getPay();
        bank.balance+=payslip;
        bank.pay-=payslip;
        repay();
        updateFields(); 
    }
}

/**
 * Lets user type inn wanted loan and checks if user is eligeble 
 */
function loan(){
    let l = prompt("Your maximum loan amount is set to "+getBalance()*2+" kr\nRemember that you can only have one loan at any given time\nEnter amount");                    
    let amount = parseInt(l);
    if(isNaN(amount)){amount=0;}
    if (hasLoan()){
        alert("You can only have one loan at any given time, please pay back your current loan...");
    } else if (amount>(getBalance()*2)){
        alert("Your maximum loan amount is "+getBalance()*2+" kr..");
    }else {

        bank.loan=amount;
        bank.balance+=bank.loan;
        document.getElementById('loanDiv').style.visibility='visible';
        document.getElementById('loanButton').style.visibility='visible';
        updateFields();
    }
}

/**
 * Updated fields that change throughout the program
 */
function updateFields(){
    if(isNaN(bank.loan)){bank.loan=0;}
    if(!hasLoan()){document.getElementById('loanDiv').style.visibility='hidden';}
    if(!hasLoan()){document.getElementById('loanButton').style.visibility='hidden';}
    document.getElementById('balance_id').textContent = getBalance()+" kr";
    document.getElementById('loan_id').textContent = getLoan()+" kr";
    document.getElementById('pay_id').textContent = getPay()+" kr";
    document.getElementById('buyErrors').style.visibility='hidden';
}


