/////////////////////////////////////////////////
//grabbing elements and declaring key variables//
/////////////////////////////////////////////////

const companyName = document.querySelector("#companyName");
const address = document.querySelector("#address");
const cityStateZIP = document.querySelector("#cityStateZIP");
const phone = document.querySelector("#phone");
const billTo = document.querySelector("#billTo");
const descriptionContainer = document.querySelector("#description-container");
const addWorkLineButton = document.querySelector("#addLineButton")
const tax = document.querySelector("#tax");
const total = document.querySelector("#total");
const otherComments = document.querySelector("#otherComments")
const preview = document.querySelector("#preview");
const docType = document.querySelector("#docType");
const saveInfo = document.querySelector("#saveInfo")
const storeBtn = document.querySelector("#storeBtn")
//const saveAlert = document.querySelector("#saveAlert");
//const removeAlert = document.querySelector("#removeAlert");

let workLine = document.querySelectorAll(".workLine");
let workLineAmounts = document.querySelectorAll(".workLineAmount");

let docTypeHeading = "INVOICE";



//////////////////////////////////////////
//personal info to storage functionality//
//////////////////////////////////////////

storeBtn.addEventListener("click", savePersonalInfo)

if(localStorage.length === 0) {
  storeBtn.textContent = "+"
  saveInfo.title = "Click plus sign to save your personal information!"
  saveInfo.textContent = "Save My Info?"
} else if(localStorage.length !== 0) {
  storeBtn.textContent = "-"
  saveInfo.title = "Click minus sign to remove your personal information!"
  saveInfo.textContent = "Remove My Info?"
}

function savePersonalInfo() {
  
  if(localStorage.length === 0){
    localStorage["companyName"] = companyName.value;
    localStorage["address"] = address.value;
    localStorage["cityStateZIP"] = cityStateZIP.value;
    localStorage["phone"] = phone.value;
    
    storeBtn.textContent = "-"
    saveInfo.title = "Click minus sign to remove your personal information!"
    saveInfo.textContent = "Remove My Info?"
    
    alert("Your information has been saved!")
  } else if(localStorage.length !== 0) {
    localStorage.clear();

    storeBtn.textContent = "+"
    saveInfo.title = "Click plus sign to save your personal information!"
    saveInfo.textContent = "Save My Info?"

    alert("You information has been removed!")
  }

}

if(localStorage.companyName !== undefined) {
  companyName.value = localStorage.companyName;
}
if(localStorage.address !== undefined) {
  address.value = localStorage.address;
}
if(localStorage.cityStateZIP !== undefined) {
  cityStateZIP.value = localStorage.cityStateZIP;
}
if(localStorage.phone !== undefined) {
  phone.value = localStorage.phone;
}
// companyName.value = localStorage.companyName;
// address.value = localStorage.address;
// cityStateZIP.value = localStorage.cityStateZIP;
// phone.value = localStorage.phone;


//////////////////////////////////////////
//add new description line functionality//
//////////////////////////////////////////

docType.addEventListener("click", docTypeSelect);

function docTypeSelect(event) {
  const docTypeDropdown = document.querySelector("#docTypeDropdown");
  const invocieOption = document.querySelector("#invoice");
  const statementOption = document.querySelector("#statement");

  const option = event.target;
  const optionType = option.id;
  
  if(optionType === "invoice") {
    docTypeDropdown.textContent = option.textContent + " ";
    invocieOption.style.display = "none";
    statementOption.style.display = "";
    docTypeHeading = option.textContent.toUpperCase();
  } else if (optionType === "statement") {
    docTypeDropdown.textContent = option.textContent + " ";
    invocieOption.style.display = "";
    statementOption.style.display = "none";
    docTypeHeading = option.textContent.toUpperCase();
  }
  
}



//////////////////////////////////////////
//add new description line functionality//
//////////////////////////////////////////

addWorkLineButton.addEventListener("click", createDescriptionLine);

function createDescriptionLine() {

  function createLinePart(labelForId, icon, inputClass, inputPlaceholder) {
    lineNum = lastIndex;
    lineNum++;
    
    const newLineLabel = document.createElement("label");
    newLineLabel.htmlFor = labelForId + lineNum.toString();
    
    const newLineIcon = document.createElement("i");
    newLineIcon.className = "material-icons";
    newLineIcon.innerHTML = icon;

    const newLineInput = document.createElement("input");
    newLineInput.className = inputClass;
    newLineInput.type = "text";
    newLineInput.id = labelForId + lineNum.toString();
    newLineInput.placeholder = inputPlaceholder;

    newWorkLine.appendChild(document.createTextNode(" "));
    newLineLabel.appendChild(newLineIcon);
    newWorkLine.appendChild(newLineLabel);
    newWorkLine.appendChild(document.createTextNode(" "));
    newWorkLine.appendChild(newLineInput);
  }
  
  workLine = document.querySelectorAll(".workLine");
  const newWorkLine = document.createElement("div");

  const lastIndex = workLine.length - 1;
  const lastWorkLine = workLine[lastIndex].parentNode;

  createLinePart("WorkLine", "work", "workLine", "...");
  createLinePart("amount", "attach_money", "workLineAmount", "0.00");

  lastWorkLine.parentNode.insertBefore(newWorkLine, lastWorkLine.nextSibling);
}



////////////////////////////
//total math functionality//
////////////////////////////

document.addEventListener("keyup", findTotal);
descriptionContainer.addEventListener("focusout", autoFormatNumbers)

function findTotal(event){

  workLineAmounts = document.querySelectorAll(".workLineAmount");

  let workLineTotal = 0;
  
  for(let i = 0; i < workLineAmounts.length; i++){
    let amount = workLineAmounts[i].value
    workLineTotal += Number(amount)
  }

  workLineTotal = workLineTotal.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  total.value = workLineTotal
}

function autoFormatNumbers(event){
  const selectedInput = event.target;
  const inputCheck = selectedInput.className;

  if(inputCheck === "workLineAmount") {  
    let value = event.target.value;
    num = Number(value);
    num = num.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    selectedInput.value = num;
  }


}

// var num = '$' + value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"); convert number to currency value



////////////////////////////
//create PDF functionality//
////////////////////////////

preview.addEventListener("click", genPDF)

function genPDF() {

  workLineAmounts = document.querySelectorAll(".workLineAmount");

  var doc = new jsPDF();
  
  

  ///////////\\\\\\\\//
  //--DRAW ELEMENTS--//
  /////////////////////

  //bill to heading bar
  doc.setFillColor(3, 97, 160);
  doc.rect(17, 61, 70, 5, 'F');

  //work/services desc bar
  doc.setFillColor(3, 97, 160);
  doc.rect(17, 101, 176, 5, 'F');

  //total info lines and shading214, 229, 255
  doc.setFillColor(214, 229, 255);
  doc.rect(167, 206, 25.7, 5, 'F');
  doc.setFillColor(0);
  doc.rect(147, 206, 45.3, .1, 'F');


  //table show shading
  doc.setFillColor(236);
  doc.rect(17.4, 106.2, 175.3, 5, 'F');
  doc.rect(17.4, 116.2, 175.3, 5, 'F');
  doc.rect(17.4, 126.2, 175.3, 5, 'F');
  doc.rect(17.4, 136.2, 175.3, 5, 'F');
  doc.rect(17.4, 146.2, 175.3, 5, 'F');
  doc.rect(17.4, 156.2, 175.3, 5, 'F');
  doc.rect(17.4, 166.2, 175.3, 5, 'F');
  doc.rect(17.4, 176.2, 175.3, 5, 'F');

  //table border lines
  doc.setFillColor(0);
  doc.rect(17, 106, 0.3, 75.3, 'F');
  doc.rect(147, 106, 0.3, 75.3, 'F');
  doc.rect(167, 106, 0.3, 75.3, 'F');
  doc.rect(192.7, 106, 0.3, 75.3, 'F');
  doc.rect(17, 181.3, 176, 0.3, 'F');

  //other comments box bar
  doc.setFillColor(3, 97, 160);
  doc.rect(17, 196, 90, 5, 'F');

  //other comments box border lines
  doc.setFillColor(0);
  doc.rect(17, 201, 0.3, 40.3, 'F');
  doc.rect(106.7, 201, 0.3, 40.3, 'F');
  doc.rect(17, 241.3, 90, 0.3, 'F');



  ////////////
  //--TEXT--//
  ////////////

  //company heading title
  doc.setFontSize(20);
  doc.text(companyName.value, 20, 30);
  
  //document type heading
  doc.text(docTypeHeading, 150, 30);

  //company address
  doc.setFontSize(10);
  doc.text(address.value, 20, 35);
  doc.text(cityStateZIP.value, 20, 40);
  doc.text("Phone:" + phone.value, 20, 45);

  //bill to info
  doc.setTextColor(255); //text color to white
  doc.setFontStyle('bold');
  doc.text("BILL TO", 20, 65);//bill to heading

  doc.setTextColor(0); //text color to black
  doc.setFontStyle('normal');
  doc.text(billTo.value, 20, 70);

  //work/services table
  doc.setTextColor(255); //text color to white
  doc.setFontStyle('bold');
  doc.text("DESCRIPTION", 20, 105);//description heading
  doc.text("TAXED", 150, 105);//taxed heading
  doc.text("AMOUNT", 170, 105);//amount heading

  //description column
  doc.setTextColor(0); //text color to black
  doc.setFontStyle('normal');

  for(let i = 0; i < workLine.length; i++) {
    let position = 110;
    position += i * 5;
    doc.text(String(workLine[i].value), 20, position);
    //console.log(String(workLine[i].value))
  }

  // doc.text("first row work done information", 20, 110);
  // doc.text("first row work done information", 20, 115);
  // doc.text("first row work done information", 20, 120);
  // doc.text("first row work done information", 20, 125);
  // doc.text("first row work done information", 20, 130);

  //tax column
  // doc.text("123", 150, 110);

  //amount column
  for(let i = 0; i < workLineAmounts.length; i++) {
    let position = 110;
    position += i * 5;
    doc.text(workLineAmounts[i].value, 170, position);
  }

  // doc.text("123", 170, 110);
  // doc.text("123", 170, 115);
  // doc.text("123", 170, 120);
  // doc.text("123", 170, 125);
  // doc.text("123", 170, 130);

  //total info
  doc.text("Subtotal", 150, 185);
  doc.text("--", 150, 190);
  doc.text("--", 150, 195);
  doc.text("Tax", 150, 200);
  doc.text("Other", 150, 205);

  doc.text(total.value, 170, 185);
  doc.text("-", 170, 190);
  doc.text("-", 170, 195);
  doc.text("-", 170, 200);
  doc.text("-", 170, 205);

  //final total bold
  doc.setFontStyle('bold');
  doc.text("TOTAL", 150, 210);
  doc.text("$", 168, 210);
  doc.text(total.value, 170, 210);

  //checks payable to info
  //doc.setFontStyle('italics');
  doc.text("Make all checks payable to", 150, 220);

  doc.text("Arturo Medina", 150, 225);

  //other comments box heading
  doc.setTextColor(255);
  doc.setFontStyle('bold');
  doc.text("OTHER COMMENTS", 20, 200);

  doc.setTextColor(0); //text color to black
  doc.setFontStyle('normal');

  //other comments box content
  doc.text(otherComments.value, 20, 205);

  //create pdf
  doc.save()
}