function operate (a, b, operator) {
  operations = {"+" : () => a + b,
                "-" : () => a - b,
                "x" : () => a * b,
                "÷" : () => {return (b == 0) ? "Infinity" : a / b;},
                "^" : () => a ** b,
                "√" : () => b ** (1/a)};
  
  return operations[operator]();
}

function setupButtons() {
  var numpad = document.querySelector(".numpad");
  var screenText = document.querySelector(".screen .text");
  var otherButtons = document.querySelector(".other-buttons");
  var button;
  var expr = []; // expression
  
  /* Create numpad */
  var buttonValues = ["7", "8", "9", "4", "5", "6", "1", "2", "3"];
  for (var i = 0; i < buttonValues.length; i++) {
    button = createButton(`button${buttonValues[i]}`, buttonValues[i]);
    button.addEventListener("click", e => {expr.push(e.target.textContent); 
    updateScreen(expr, screenText);});
    numpad.appendChild(button);
  } 

  var clearButton = createButton("clear", "C");
  clearButton.addEventListener("click", e => {expr = []; screenText.textContent = "";});
  numpad.appendChild(clearButton);
  var zeroButton = createButton("num0", "0");
  zeroButton.addEventListener("click", e => {expr.push(e.target.textContent);
    updateScreen(expr, screenText);});
  numpad.appendChild(zeroButton);
  //numpad.appendChild(createButton("dec-point", "."));
  
  
  /* Create other buttons */
  var backspaceButton = createButton("backspace", "<");
  backspaceButton.style.gridColumnStart = "1";
  backspaceButton.style.gridColumnEnd = "4";
  backspaceButton.addEventListener("click", e => {expr.pop(); updateScreen(expr, screenText);});

  otherButtons.appendChild(backspaceButton);
  
  buttonValues = ["+", "-", "^", "x", "÷", "√"];
  for (var i = 0; i < buttonValues.length; i++) {
    button = createButton(`button${buttonValues[i]}`, buttonValues[i]);
    button.addEventListener("click", e => {expr.push(" " + e.target.textContent + " "); 
      updateScreen(expr, screenText)});
    otherButtons.appendChild(button);
  } 

  var equalsButton = createButton("equals", "=");
  equalsButton.style.gridColumnStart = "1";
  equalsButton.style.gridColumnEnd = "4";
  equalsButton.addEventListener("click", e => {
    var infix = screenText.textContent.split(" ");
    console.log(infix);
    var postfix = infixToPostfix(infix);
    expr = [postfixCalculation(postfix)];
    updateScreen(expr, screenText);
    });
  otherButtons.appendChild(equalsButton);
  
  
}

function createButton(id = "ID", content = "CONTENT") {
  var button = document.createElement("div");
  button.setAttribute("class", "button");
  button.style.padding = "20px";
  button.style.backgroundColor = "grey";
  button.style.border = "1px solid black";
  button.style.textAlign = "center";
  button.id = id;
  button.textContent = content;
  
  return button;
}

function updateScreen(expression, screenText) {
  screenText.textContent = "";
  for (var i = 0; i < expression.length; i++) {
    screenText.textContent += expression[i];
  }
  //screen.textContent = expression.toString();
}

function infixToPostfix(infix) {
  var postfix = [];
  var stack = [];
  var operators = ["+", "-", "x", "÷", "^", "√"];
  var precedence = {"+" : 0, "-" : 0, "x" : 1, "÷" : 1};
  
  for (var i = 0; i < infix.length; i++) {
    if (!(operators.includes(infix[i]))) {
      postfix.push(parseInt(infix[i]));
    } else {
      if (stack.length == 0) {
        stack.push(infix[i]);
      } else if (precedence[infix[i]] > precedence[stack[stack.length-1]]) {
        stack.push(infix[i]);
      } else {
        postfix.push(stack.pop());
        stack.push(infix[i]);
      }
    }
  }
  
  while (stack.length > 0) {
    postfix.push(stack.pop());
  }

  return postfix;
}

function postfixCalculation(postfix) {
  var operand1, operand2, result;
  var stack = [];
  var operators = ["+", "-", "x", "÷", "^", "√"];
  for (var i = 0; i < postfix.length; i++) {
    if (operators.includes(postfix[i])) {
      operand2 = stack.pop();
      operand1 = stack.pop();
      result = operate(operand1, operand2, postfix[i]);
      stack.push(result);
    } else {
      stack.push(postfix[i]);
    }
  }
  result = stack.pop();
  
  return result;
}

setupButtons();
