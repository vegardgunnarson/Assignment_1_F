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

fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
    .then(response => response.json())
    .then(data => computers = data)
    .then(computers => addComputersToList(computers));

const addComputersToList = (computers) => {
    computers.forEach(c => addComputerToList(c));
}

const addComputerToList = (computer) => {
    const computerElement = document.createElement("option");
    computerElement.value = computer.id;
    computerElement.appendChild(document.createTextNode(computer.title));
    computersElement.appendChild(computerElement);
    selectedComputer = computers[0];
    featuresElement.innerHTML = computers[0].specs;
    imageElement.src=imageURL+computers[0].image;
    priceElement.innerText = computers[0].price+" kr";
    price=computers[0].price;
    titleElement.innerText = computers[0].title;
    descriptionElement.innerText = computers[0].description;
}

const handleComputerChange = e => {
    selectedComputer = computers[e.target.selectedIndex];
    featuresElement.innerHTML =selectedComputer.specs;
    priceElement.innerText = selectedComputer.price;
    descriptionElement.innerText = selectedComputer.description;
    titleElement.innerText = selectedComputer.title;
    priceElement.innerText = selectedComputer.price+" kr";
    price=selectedComputer.price;
    imageElement.src=imageURL+selectedComputer.image;
}
computersElement.addEventListener("change",handleComputerChange)

let joe = new bank(0,0,0);
updateFields();

/**
 * Cunstructor for bank
 * @param {number} balance 
 * @param {number} loan 
 */
function bank(balance,loan,pay){
    this.balance=balance;
    this.loan=loan;
    this.pay=pay;
}
/**
 * Returns current balance
 * @returns number
 */
function getBalance(){
    return joe.balance;
}
/**
 * Adds more money to balance
 * @param {number} b 
 */
function addBalance(b){
    joe.balance+=b;
}
/**
 * Boolean for checking if there is an existing loan
 * @returns true||false
 */
function hasLoan(){
    if (joe.loan==0){
        return false;
    }return true;
}
/**
 * Return current pay balance
 * @returns number
 */
function getPay(){
    return joe.pay;
}
/**
 * Increase pay balance with 100kr
 */
function work(){
    joe.pay+=100;
    updateFields();
}
/**
 * Returns current loan
 * @returns number
 */
function getLoan(){
    return joe.loan;
}
/**
 * Checks if user has sufficient funds
 */
function buy(){
    if (price<=getBalance()){
        joe.balance-=price;
        alert("Thank you for your order, your "+selectedComputer.title+" is now beeing prepered for shipment.\nYour account will be charged shortly.");
        updateFields();
        document.getElementById('buyErrors').style.visibility='hidden';
    }
    else{
        document.getElementById('buyErrors').style.visibility='visible';
    }

}
function repay(){
    if (getPay()==getLoan()){
        joe.loan = 0;
        joe.pay = 0;
        updateFields();
    }
    if (getLoan()>getPay()){
        joe.loan = joe.loan-joe.pay;
        joe.pay = 0;
        updateFields();
    } if (getLoan()<getPay()){
        let rest = joe.pay-joe.loan;
        joe.loan = 0;
        joe.pay=0;
        joe.balance+=rest;
        updateFields();
    }
}
function pay() {
    if (getPay()*0.1==getLoan()){
        joe.balance+=(getPay()*0.9);
        joe.pay=0;
        joe.loan=0;
        updateFields();
    }
    if ((getPay()*0.1)>getLoan()){
        repay();
        joe.balance+=joe.pay;
        joe.pay=0;
        updateFields();
    }
    if (getPay()>0){
        let payslip=0.9*getPay();
        joe.balance+=payslip;
        joe.pay-=payslip;
        repay();
        updateFields(); 
    }
}

function loan(){
    
    let l = prompt("Your maximum loan amount is set to "+getBalance()*2+" kr\nRemember that you can only have one loan at any given time\nEnter amount");                    
    let amount = parseInt(l);
    if (hasLoan()){
        alert("You can only have one loan at any given time, please pay back your current loan...");
    } else if (amount>(getBalance()*2)){
        alert("Your maximum loan amount is "+getBalance()*2+" kr..");
    }else{
        joe.loan=amount;
        joe.balance+=joe.loan;
        document.getElementById('loanDiv').style.visibility='visible';
        document.getElementById('loanButton').style.visibility='visible';
        updateFields();
    }
}

function updateFields(){
    if(isNaN(joe.loan)){joe.loan=0;}
    if(isNaN(joe.balance)){joe.balance=0;}
    if(!hasLoan()){document.getElementById('loanDiv').style.visibility='hidden';}
    if(!hasLoan()){document.getElementById('loanButton').style.visibility='hidden';}
    document.getElementById('balance_id').textContent = getBalance()+" kr";
    document.getElementById('loan_id').textContent = getLoan()+" kr";
    document.getElementById('pay_id').textContent = getPay()+" kr";
    document.getElementById('buyErrors').style.visibility='hidden';
}


