window.addEventListener('load', init);

empty_options = []

if (!localStorage.getItem("radio-options")){
    localStorage.setItem('radio-options', JSON.stringify(empty_options))
}


function init(){
    var question_text = document.getElementById("question-text");
    var question_radio = document.getElementById("question-radio");
    var question_checkbox = document.getElementById("question-checkbox");
    
    question_text.addEventListener("click", show_form_text);
    question_radio.addEventListener("click", show_form_radio);
    question_checkbox.addEventListener("click", show_form_checkbox)
}

function show_form_text(event){
    form_area = document.getElementById("form-area");

    form_html = document.createElement("div")

    form_html.innerHTML = `
        <form action="/post_question_text" method="POST">
            <div class="form-pair-area">
                <label for="question-text">Question text: </label>
                <input type="textarea" name="question-text" />            
            </div>
            <div class="submit-area">
                <input type="submit" value="Add question">
            </div>
        </form>
    `

    form_area.appendChild(form_html)
}

function show_form_radio(event){
    form_area = document.getElementById("form-area");

    form_html = document.createElement("div")

    form_html.innerHTML = `
        <form id="radio-question-form" action="/post_question_text" method="POST">            
            <div class="form-pair-area">
                <label for="new-option-value"> Option text: </label>
                <input name="new-option-value">
                <a id="add-radio-option">Add option</a>
            </div>            
        </form>
    `
        
    all_radio_options = JSON.parse(localStorage.getItem('radio-options'));

    radio_options_div = document.createElement("div");
    current_radio_inputs = ``;

    for (const option of all_radio_options){
        console.log(option)
        current_radio_inputs += "<input value='"+option+"' /><br>";   
        console.log(current_radio_inputs)     
    }

    radio_options_div.innerHTML = current_radio_inputs;
    
    form_area.appendChild(form_html);
    form_to_insert_into = document.getElementById('radio-question-form')
    form_to_insert_into.appendChild(radio_options_div)
    form_html.appendChild(form_to_insert_into)    
    add_radio_option_a = document.getElementById("add-radio-option");
    add_radio_option_a.addEventListener('click', add_radio_option);
}

function add_radio_option(){
    new_option_radio = document.getElementsByName("new-option-value")[0];
    all_radio_options = JSON.parse(localStorage.getItem("radio-options"));
    console.log(typeof(all_radio_options))
    all_radio_options.push(new_option_radio.value)

    localStorage.setItem('radio-options', JSON.stringify(all_radio_options));      
    var radio_form = document.getElementById('form-area');
    radio_form.innerHTML = ''
    show_form_radio()
}

function reload_element(element){
    content = element.innerHTML
    element.innerHTML = content
}

function show_form_checkbox(){
    pass
}