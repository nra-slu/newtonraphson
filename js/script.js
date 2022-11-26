// Add keyboards
addKeyboard("function");
addKeyboard("initial-value");

var button = document.getElementById('calculate')

button.addEventListener('click', calculate);
var iterations = [];
generateAnswerTable(iterations);

function calculate(){
    let steps = $("#steps-wrapper");
    steps.empty();

    let fx = new Polynomial($("#function").val());
    let x1 = $("#initial-value").val();
    var ea = $("#error-percent").val() /100;

    if(fx == 0 || isNaN(x1) || ea == 0|| isNaN(ea)){ 
        return;
    }
    
    $("#results").empty();
    let iterations = [];
    document.getElementById("results").innerHTML = '';
    
    let pe = 1;                                     //Percent Error
    let derivative = fx.derive(1);                  //get the 1st derivative
    index = 0;
    iterations.push([index, x1,pe]);
    index ++;
    steps.append(`
    <h2>Step-by-Step Solution</h2>
    <dl>
        <dt>Problem:</dt>
        <dd>&nbsp<math-field read-only>f(x) = ${fx}</math-field></dd>
        <dd>&nbsp<math-field read-only>f'(x) = ${derivative}</math-field></dd>
        <dd>&nbspInitial Value = ${x1}</dd>
        <dd>&nbspPercent of error = ${ea}</dd> 
    </dl> <br>  
    `);

    while(pe > ea){
        let fxValue = Math.round(((fx.eval(x1)) + Number.EPSILON) * 1000000) / 1000000;
        let dxValue = Math.round(((derivative.eval(x1)) + Number.EPSILON) * 1000000) / 1000000;
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
            <dd>&nbsp<math-field read-only>f(x) = ${fts} = ${fxValue}</math-field></dd>
            <dd>&nbsp<math-field read-only>f'(x) = ${fds} = ${dxValue}</math-field></dd>
            <dd>&nbsp<math-field read-only>X \\scriptstyle{${index+1}} \\displaystyle = ${x1} - \\frac{${fxValue}}{${dxValue}}  =  ${x2}</math-field></dd>
            <dd>&nbsp<math-field read-only>ε \\scriptstyle{a} \\displaystyle = \\frac{${x2}-${x1}}{${x2}} \\times 100 = ${pe} </math-field><span>&nbsp%</span></dd> 
         </dl> <br>  
        `);
        
        
        iterations.push([index, x1,pe]);
        index ++;
    }

    generateAnswerTable(iterations);    
    let finalResult = $("#final-result");
    finalResult.empty();
    finalResult.append("x = " + Number(x1).toFixed(4));
}

function generateAnswerTable(iterations){
    let tableHeaders = ['x<sub>i</sub>', 'f(x<sub>i-1</sub>)', 'ε<sub>a</sub>'];
    var results = $("#results");
    let hr = $('<tr></tr>');
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

function addKeyboard(id){
    document.getElementById(id).setOptions({
        virtualKeyboardMode: "manual",
        virtualKeyboards: "numeric symbols functions",
    });
}