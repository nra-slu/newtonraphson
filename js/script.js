var variable = "x";
// Add keyboards
var mq = window.matchMedia( "(max-width: 768px)" );
if (mq.matches) {
    addKeyboard("function", "onfocus");
    addKeyboard("initial-value", "onfocus");
}else {
    addKeyboard("function", "manual");
    addKeyboard("initial-value", "manual");
}
var button = document.getElementById('calculate')

button.addEventListener('click', calculate);        // add event listener to calculate
var iterations = [];                                
// generateAnswerTable(iterations);
var tableHeaders = [`${variable}<sub>i</sub>`, `f(${variable}<sub>i-1</sub>)`, `ε<sub>a</sub>`];
var results = $("#results");
var hr = $('<tr></tr>');
tableHeaders.forEach(e => {
    hr.append($(`<th>${e}</th>`));
});
results.append(hr);

function calculate(){
    let finalResult = $("#final-result");           //clear contents
    finalResult.empty();
    let steps = $("#steps-wrapper");                        
    steps.empty();
    let fx = $("#function").val();
    let variable = findVariable(fx);            
    let x1 = $("#initial-value").val();
    var ea = $("#error-percent").val() /100;

    if(fx == 0 || isNaN(x1) || ea == 0|| isNaN(ea)){        //input validation
        return;
    }
    
    $("#results").empty();
    let iterations = [];
    document.getElementById("results").innerHTML = '';
    
    let pe = 1;                                         //Percent Error
    let derivative = math.derivative(fx,variable).toString();                //get the 1st derivative
    
    index = 0;
    iterations.push([index, x1,pe]);
    index ++;
    steps.append(`
    <h2>Step-by-Step Solution</h2>
    <dl>
        <dt>Problem:</dt>
        <dd>&nbsp<math-field read-only>f(${variable}) = ${fx}</math-field></dd>
        <dd>&nbsp<math-field read-only>f'(${variable}) = ${derivative}</math-field></dd>
        <dd>&nbspInitial Value = ${x1}</dd>
        <dd>&nbspPercent of error = ${ea}</dd> 
    </dl> <br>  
    `);
    const parser = math.parser();

    while(pe > ea){
       
        parser.evaluate(`${variable} = ${x1}`);
        let fxValue = Math.round((parser.evaluate(fx) + Number.EPSILON) * 1000000) / 1000000;
        let dxValue = Math.round((parser.evaluate(derivative) + Number.EPSILON) * 1000000) / 1000000;
        let x2 = Math.round(((x1 - (fxValue/dxValue)) + Number.EPSILON) * 1000000) / 1000000; 
        pe= Math.round(((Math.abs((x2-x1)/x2)*100) + Number.EPSILON) * 1000000) / 1000000; 

        let fts = fx.toString().replace(/x/gi, `(${x1})`);      //convert function to string
        let fds = derivative.toString().replace(/x/gi, `(${x1})`); 
        x1 = x2;

        if(index > 100 || pe < ea){
            break;
        }
        steps.append(`
        <dl>
            <dt>Iteration ${index}:</dt>
            <dd>&nbsp<math-field read-only>f(${variable}) = ${fts} = ${fxValue}</math-field></dd>
            <dd>&nbsp<math-field read-only>f'(${variable}) = ${fds} = ${dxValue}</math-field></dd>
            <dd>&nbsp<math-field read-only>${variable} \\scriptstyle{${index+1}} \\displaystyle = ${x1} - \\frac{${fxValue}}{${dxValue}}  =  ${x2}</math-field></dd>
            <dd>&nbsp<math-field read-only>ε \\scriptstyle{a} \\displaystyle = \\frac{${x2}-${x1}}{${x2}} \\times 100 = ${pe} </math-field><span>&nbsp%</span></dd> 
         </dl> <br>  
        `);
        
        
        iterations.push([index, x1,pe]);
        index ++;
    }

    generateAnswerTable(iterations);    
    finalResult.append(variable+ " = " + Number(x1).toFixed(4));
}


function findVariable(fx) {         //returns the variable used in the function
    let alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    
    for (i = 0; i < fx.length; i++) {
        for (j = 0; j < alpha.length; j++) {
            if (fx[i].toLowerCase() == alpha[j]) {
                variable = fx[i];
                break;
            }
        }
        if (variable == fx[i]) {
            break;
        }
    }
    return variable;
}

function generateAnswerTable(iterations){
    
    results = $("#results");
    hr = $('<tr></tr>');
    tableHeaders.forEach(e => {
        hr.append($(`<th>${e}</th>`));
    });
    results.append(hr);
    for (let i = 0; i < iterations.length; i++) {
        let tr = $('<tr class="table-data"></tr>');
        // console.log(iterations);
        iterations[i].forEach(e => {
            let th = $(`<td>${e}</td>`);
            tr.append(th);
        })
        results.append(tr);
    }
}

function addKeyboard(id, mode){
    document.getElementById(id).setOptions({
        virtualKeyboardMode: mode,
        virtualKeyboards: "numeric roman symbols functions ",
    });
}