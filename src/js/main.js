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
let q;
 

// ------ READY FUNCT ------ //

$(document).ready(function () {
    generateQuestion();
    renderClue();
    boxTyping();
    numClicked();

    showInstruction();
});

// ********************** //
// ------ FUNCTION ------ //
// ********************** //

function generateQuestion() {
    let question = [];
    let num = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let operator = ["-", "+", "*", "/"];
    let op_restrict = [0, 5];
    
    let finish = false;
    while (!finish) {
        key = Math.floor(Math.random() * 3);
        let i = question.length;
        switch (key) {
            case 0:
                let num_index = Math.floor(Math.random() * 10);
                if (num[num_index] == 0) {
                    question.length < 1 ? "" : operator.includes(question[question.length - 1]) ? "" : question.push(num[num_index]);
                } else {
                    question.push(num[num_index]);
                }
                break;

            case 1:
                if (question.length > 1 && question.length < 5) {
                    // console.log(question.length);
                    // console.log(op_restrict);
                    if (!op_restrict.includes(question.length)) {
                        let op_index = Math.floor(Math.random() * 4);
                        question.push(operator[op_index]);
                        let op_new_restric = [question.length, question.length - 1, question.length + 1];
                        op_restrict = op_restrict.concat(op_new_restric);
                    }
                }
                break;

            case 2:
                if (question.length > 1 && question.length < 5) {
                    // console.log(question.length);
                    // console.log(op_restrict);
                    if (!op_restrict.includes(question.length)) {
                        let op_index = Math.floor(Math.random() * 4);
                        question.push(operator[op_index]);
                        let op_new_restric = [question.length, question.length - 1, question.length - 2];
                        op_restrict = op_restrict.concat(op_new_restric);
                    }
                }
                break;
            
            default:
                break;
        }

        question.length === 6 ? finish = true : finish = false;
    }

    let q_validate = questionValidator(question);
    q_validate ? q = question : generateQuestion();

    // console.log(question);
}

function questionValidator(question) {
    let q_num = concatNum(question);
    let q_total = calculateInput(q_num);

    return parseInt(q_total) === q_total && q_total > 0 && q_total < 1000;
}   

function renderClue() {
    let temp_q = [...q];
    let input_num = concatNum(temp_q)
    q_total = calculateInput(input_num)
    $('.clue').html(q_total);
}

function boxTyping() {
    let allow_key = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "+", "*", "/"];

    $(document).keypress( (event) => {
        if (row > 0 && row <= 6) {
            let key = event.key;

            if (allow_key.includes(key)) {
                boxWrite(key);
            }
        }
    });

    $(document).on("keyup", (event) => {
        let key_code = event.which;
        
        if (row > 0 && row <= 6) {
            if (key_code === 8) {
                boxDeleting();
            }
        }
    });

    $(document).keypress( (event) => {
        let key_code = event.which;

        if (row > 0 && row <= 6) {
            if (key_code === 13) {
                boxSumbiting();
            }
        }
    });
}

function numClicked() {
    let operator = {"multipli" : "*", "divide" : "/", "sum" : "+", "sub" : "-"};

    $('.num').click((e) => {
        let key_value = $(e.currentTarget).attr('key-value'); 
        boxWrite(key_value);
    });

    $('.op').click((e) => {
        let key_value = $(e.currentTarget).attr('key-value'); 

        if (key_value == "del") {
            boxDeleting();
        } else if (key_value == "en") {
            boxSumbiting();
        } else {
            let key = operator[key_value];
            boxWrite(key);
        }
    });
}

function boxDeleting() {
    
    input_row[row].pop();
    let target_el = input_row[row].length + 1;
    let el = $(`[row=${row.toString()}] [col=${target_el.toString()}]`);
    el.removeClass('filled');
    el.html("");
}

function boxSumbiting() {
    if (input_row[row].length === 6) {
        let checker = validationChecker();

        if (checker) {
            let answer = showInputClue();

            if (answer) {
                row = 0;
                alert("YEY YOUR ANSWER IS RIGHT");
            } else {
                row++;
            }
        }
    } else {
        alert("Fill all box first");
    }
}

function boxWrite(key) {
    if (input_row[row].length < 6) {
        input_row[row].push(key);
        let input_length = input_row[row].length;
    
        let el = $(`[row=${row.toString()}] [col=${input_length.toString()}]`);
        el.addClass('filled');
        el.addClass('fill-animate');
        el.html(key);

        setTimeout(() => {
            el.removeClass('fill-animate');
        }, 100);
    }
}

function validationChecker() {
    let input = input_row[row];
    let input_num = concatNum(input);
    
    let total = calculateInput(input_num);
    if (total != q_total) {
        alert("beda hasil");
    } else {
        return true
    }
}

function concatNum(arr) {
    let num = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    let input_num = [];
    let v_num = "";

    arr.forEach((v, i) => {
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

    return input_num;
}

function calculateInput(input_num) {
    let num = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let list_operator = input_num.filter(v => !num.includes(v));
    let _input_num = [...input_num];
    
    list_operator.forEach(v => {
        switch (v) {
            case "/":
                _input_num = divide(_input_num);
                break;

            case "*":
                _input_num = multipli(_input_num);
                break;
        
            default:
                break;
        }    
    });

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
        let divide_total = Number(input_num[divide_index - 1]) / Number(input_num[divide_index + 1]);
        input_num.splice(divide_index - 1, 3, divide_total);
    }
    return input_num;
}

function multipli(input_num) {
    let multipli_index = input_num.indexOf("*");

    if (multipli_index >= 0) {
        let multipli_total = Number(input_num[multipli_index - 1]) * Number(input_num[multipli_index + 1]);
        input_num.splice(multipli_index - 1, 3,  multipli_total);
    }
    return input_num;
}

function sum(input_num) {
    let sum_index = input_num.indexOf("+");

    if (sum_index >= 0) {
        let sum_total = Number(input_num[sum_index - 1]) + Number(input_num[sum_index + 1]);
        input_num.splice(sum_index - 1, 3, sum_total);
    }
    return input_num;
}

function sub(input_num) {
    let sub_index = input_num.indexOf("-");

    if (sub_index >= 0) {
        let sub_total = Number(input_num[sub_index - 1]) - Number(input_num[sub_index + 1]);
        input_num.splice(sub_index - 1, 3, sub_total);
    }
    return input_num;
}

function showInputClue() {
    let input = [...input_row[row]];

    let right_num = [];
    let miss_num = [];
    let wrong_num = [];

    let op_object = {"/" : "divide", "*" : "multipli", "+" : "sum", "-" : "sub"};
    let operator = ["-", "+", "*", "/"];

    input.forEach((v, i) => v == q[i] ? $(`[row=${row.toString()}] [col=${i + 1}]`).addClass("right")  : q.includes(v) ? $(`[row=${row.toString()}] [col=${i + 1}]`).addClass("miss") : $(`[row=${row.toString()}] [col=${i + 1}]`).addClass("wrong"));
    input.forEach((v, i) => v == q[i] ? right_num.push(v) : q.includes(v) ? miss_num.push(v) : wrong_num.push(v));
    input = input.map((v, i) => v == q[i] ? true : false);

    right_num.forEach((v, i) => operator.includes(v) ? $(`[key-value=${op_object[v]}]`).addClass("right") : $(`[key-value=${v}]`).addClass("right"))
    miss_num.forEach((v, i) => operator.includes(v) ? $(`[key-value=${op_object[v]}]`).addClass("miss") : $(`[key-value=${v}]`).addClass("miss"))
    wrong_num.forEach((v, i) => operator.includes(v) ? $(`[key-value=${op_object[v]}]`).addClass("wrong") : $(`[key-value=${v}]`).addClass("wrong"))

    return !input.includes(false);
}

function showInstruction() {
    $('.icon').click(() => {
        $('.how-to-play').addClass('active');
    });

    $('.close-btn').click(() => {
        $('.how-to-play').removeClass('active');
    });

    $('.how-to-play').click(() => {
        $('.how-to-play').removeClass('active');
    });
}