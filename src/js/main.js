// ------ VARIABLE ------ //
let $window = $(window);
let $page = $("html, body");
let $menu = $(".menu");
let row = 1
let input_row = {
    "1" : [],
    "2" : [],
    "3" : [],
    "4" : [],
    "5" : [],
    "6" : [],
};

let q_total;
const q = ["12", "+", "9", "*", "8"];
 

// ------ READY FUNCT ------ //

$(document).ready(function () {
    boxTyping();
    boxDeleting();
    boxSumbiting();
    renderClue();
});

// ********************** //
// ------ FUNCTION ------ //
// ********************** //

function renderClue() {
    let temp_q = q;
    q_total = calculateInput(["12", "+", "9", "*", "8"])
    $('.clue').html(q_total);
}

function boxTyping() {
    let allow_key = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "+", "*", "/"];

    $(document).keypress( (event) => {
        let key = event.key;
        if (allow_key.includes(key)) {
            boxWrite(key);
        }
    });
}

function boxDeleting() {
    $(document).on("keyup", (event) => {
        let key_code = event.which;

        if (key_code === 8) {
            input_row[row].pop();
            let target_el = input_row[row].length + 1;
            let el = $(`[row=${row.toString()}] [col=${target_el.toString()}]`);
            el.html("");
        }
        
    });
}

function boxSumbiting() {
    $(document).keypress( (event) => {
        let key_code = event.which;
        
        if (key_code === 13) {
            if (input_row[row].length === 6) {
                let checker = validationChecker();
                if (checker) {
                    showInputClue();
                    row++;
                }
            } else {
                alert("Fill all box first");
            }
        }
    });
}

function boxWrite(key) {
    if (input_row[row].length < 6) {
        input_row[row].push(key);
        let input_length = input_row[row].length;
    
        let el = $(`[row=${row.toString()}] [col=${input_length.toString()}]`);
        el.html(key);
    }
}

function validationChecker() {
    let num = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    let input = input_row[row];

    let input_num = [];
    
    let v_num = "";
    input.forEach((v, i) => {
        if(num.includes(v)) {
            v_num += v 
            if (i === 5) {
                input_num.push(v_num);
            }
        } else {
            input_num.push(v_num);
            input_num.push(v);
            v_num = "";
        }
    });
    
    let total = calculateInput(input_num);
    if (total != q_total) {
        alert("beda hasil");
        console.log(total);
    } else {
        return true
    }
}

function calculateInput(input_num) {
    let num = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let list_operator = input_num.filter(v => !num.includes(v) && v != "/" && v != "*");
    let _input_num = input_num;
    
    _input_num = divide(_input_num);
    _input_num = multipli(_input_num);

    
    list_operator.forEach(v => {
        switch (v) {
            case "-":
                _input_num = sub(_input_num);
                break;

            case "+":
                _input_num = sum(_input_num);
                break;
        
            default:
                break;
        }    
    });

    return _input_num[0];
}

function divide(input_num) {
    let divide_index = input_num.indexOf("/");
    
    if (divide_index >= 0) {
        let divide_total = parseInt(input_num[divide_index - 1]) / parseInt(input_num[divide_index + 1]);
        input_num.splice(divide_index - 1, 3, divide_total);
    }
    return input_num;
}

function multipli(input_num) {
    let multipli_index = input_num.indexOf("*");

    if (multipli_index >= 0) {
        let multipli_total = parseInt(input_num[multipli_index - 1]) * parseInt(input_num[multipli_index + 1]);
        input_num.splice(multipli_index - 1, 3,  multipli_total);
    }
    return input_num;
}

function sum(input_num) {
    let sum_index = input_num.indexOf("+");

    if (sum_index >= 0) {
        let sum_total = parseInt(input_num[sum_index - 1]) + parseInt(input_num[sum_index + 1]);
        input_num.splice(sum_index - 1, 3, sum_total);
    }
    return input_num;
}

function sub(input_num) {
    let sub_index = input_num.indexOf("-");

    if (sub_index >= 0) {
        let sub_total = parseInt(input_num[sub_index - 1]) - parseInt(input_num[sub_index + 1]);
        input_num.splice(sub_index - 1, 3, sub_total);
    }
    return input_num;
}

function showInputClue() {
    let input = input_row[row];
    console.log(input);
    console.log(q);
    input.forEach((v, i) => v == q[i] ? $(`[row=${row.toString()}] [col=${i + 1}]`).addClass("right")  : q.includes(v) ? $(`[row=${row.toString()}] [col=${i + 1}]`).addClass("miss") : $(`[row=${row.toString()}] [col=${i + 1}]`).addClass("wrong"));
}


