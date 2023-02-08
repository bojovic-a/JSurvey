window.addEventListener('load', init);

empty_options = []

// if (!localStorage.getItem("radio-options")){
localStorage.setItem('radio-options', JSON.stringify(empty_options))
// }

// if (!localStorage.getItem("checkbox-options")){
localStorage.setItem('checkbox-options', JSON.stringify(empty_options))
// }


function init(){    
    var question_radio = document.getElementById("question-radio");
    var question_checkbox = document.getElementById("question-checkbox");
    
    // question_text.addEventListener("click", show_form_text);
    question_radio.addEventListener("click", show_form_radio);
    question_checkbox.addEventListener("click", show_form_checkbox)
}

// function show_form_text(event){
//     select_option_html = document.getElementById("form-area");
    
//     select_option_html.innerHTML = ""
//     form_area = document.getElementById("form-area");
//     form_html = document.createElement("div");

//     form_html.innerHTML = `
//         <form action="/post_question_text" method="POST">
//             <div class="form-pair-area">
//                 <label for="question-text">Question text: </label>
//                 <input type="textarea" name="question-text" />            
//             </div>
//             <div class="submit-area">
//                 <input type="submit" value="Add question">
//             </div>
//         </form>
//     `

//     form_area.appendChild(form_html)
// }

function show_form_radio(event){
    form_area = document.getElementById("form-area");
    form_area.innerHTML = ""
    form_html = document.createElement("div")

    form_html.innerHTML = `
        <div id="radio-question-form">            
            <div class="form-pair-area">
                <label for="new-option-value"> Radio button option text: </label>
                <input name="new-option-value" autofocus>
                <a id="add-radio-option">Add option</a>
            </div>            
        </div>
    `
        
    all_radio_options = JSON.parse(localStorage.getItem('radio-options'));

    radio_options_div = document.createElement("div");
    current_radio_inputs = ``;
    radio_options_div.classList.add("selected-options")

    for (let i = 0;i < all_radio_options.length;i++){
        
        current_radio_inputs += `
        <input name="radio-option" value='`+all_radio_options[i] + `' />
        <a class='delete_a' id="delete_` + i + `">X</a>
        `;           
    }

    radio_options_div.innerHTML = current_radio_inputs;
    
    form_area.appendChild(form_html);
    form_to_insert_into = document.getElementById('radio-question-form')
    form_to_insert_into.appendChild(radio_options_div)
    form_html.appendChild(form_to_insert_into)    

    if (options_delete = document.getElementsByClassName("delete_a")){
        for (const option of options_delete){
            option.addEventListener("click", delete_radio_option)
        }
    }

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

function show_form_checkbox(){
    form_area = document.getElementById("form-area");
    form_area.innerHTML = ""
    form_html = document.createElement("div")

    form_html.innerHTML = `
        <div id="checkbox-question-form">            
            <div class="form-pair-area">
                <label for="new-option-value"> Checkbox option text: </label>
                <input name="new-option-value" autofocus>
                <a id="add-checkbox-option">Add option</a>
            </div>            
        </div>
    `
        
    all_checkbox_options = JSON.parse(localStorage.getItem('checkbox-options'));

    checkbox_options_span = document.createElement("div");
    current_checkbox_inputs = ``;
    checkbox_options_span.classList.add("selected-options")
    for (let i = 0;i < all_checkbox_options.length;i++){
        console.log(all_checkbox_options[i])
        current_checkbox_inputs += `
        <input name='checkbox-option' value='`+all_checkbox_options[i] + `' />
        <a class='delete_a' id="delete_` + i + `">X</a>
        `;           
    }

    checkbox_options_span.innerHTML = current_checkbox_inputs;
    
    form_area.appendChild(form_html);
    form_to_insert_into = document.getElementById('checkbox-question-form')
    form_to_insert_into.appendChild(checkbox_options_span)
    form_html.appendChild(form_to_insert_into)    

    
    if (options_delete = document.getElementsByClassName("delete_a")){
        for (const option of options_delete){
            option.addEventListener("click", delete_checkbox_option)
        }
    }

    add_checkbox_option_a = document.getElementById("add-checkbox-option");
    add_checkbox_option_a.addEventListener('click', add_checkbox_option); 
}

function add_checkbox_option(){
    new_option_checkbox = document.getElementsByName("new-option-value")[0];
    all_checkbox_options = JSON.parse(localStorage.getItem("checkbox-options"));
    
    all_checkbox_options.push(new_option_checkbox.value)

    localStorage.setItem('checkbox-options', JSON.stringify(all_checkbox_options));      
    var checkbox_form = document.getElementById('form-area');
    checkbox_form.innerHTML = ''
    show_form_checkbox()
}

function delete_checkbox_option(event) {
    element_to_delete = event.target;
    
    option_id = element_to_delete.id.split("_")
    all_options = JSON.parse(localStorage.getItem("checkbox-options"));
    console.log(option_id)
    all_options.splice(parseInt(option_id[1]), 1)
    localStorage.setItem("checkbox-options", JSON.stringify(all_options));
    show_form_checkbox()
}

function delete_radio_option(event) {
    element_to_delete = event.target;
    
    option_id = element_to_delete.id.split("_")
    all_options = JSON.parse(localStorage.getItem("radio-options"));
    console.log(option_id)
    all_options.splice(parseInt(option_id[1]), 1)
    localStorage.setItem("radio-options", JSON.stringify(all_options));
    show_form_radio()
}