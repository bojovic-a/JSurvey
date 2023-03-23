// TODO:
// -Save single answer option to its question in ss, When <select> state is 
// changed, input is prompted, when input is clicked, the save button apprears,
// clicking the save button will add answer to sessionStorage and will add
// an element to the page

// -Alerts for changing question type(if type is changed, answers are lost)



class Question{
    constructor(id, title, answers, type){
        this._id = id
        this.title = title
        this.answers = answers
        this.type = type
    }
}

window.addEventListener('load', init);
window.addEventListener("beforeunload", remove)

function remove() {
    sessionStorage.clear()
}

function init() {        
    surveyId = document.getElementsByClassName("survey-title")[0].getAttribute("name")    
    
    let fetchUrl = "http://localhost:3000/jsurvey/get-survey-data?survey=" + surveyId            
    
    fetch(fetchUrl)
        .then(response=>response.json())
        .then(data => {  
            d = console.log("d" + JSON.stringify(data))
            sessionStorage.setItem("questions", JSON.stringify(data))                        
        })    
        .then(() =>{
            get_all_quesitons()
            get_title()
            }
        )
    
    saveAllButton = document.querySelector("#save-survey")
    saveAllButton.addEventListener("click", save_all)
    var add_question_button = document.getElementById("add-question-button")
    var question_type = document.getElementById("question-type")
        
    add_question_button.addEventListener('click', add_question)
    question_type.addEventListener("change", render_question_type)
        
}

function get_title() {
    let surveyLs = JSON.parse(sessionStorage.getItem("questions"))
    let titleTag = document.querySelector(".survey-title")
    titleTag.innerText += surveyLs.survey.title
}

function get_all_quesitons() {
    let surveyLs = JSON.parse(sessionStorage.getItem("questions"))
    // let titleTag = document.querySelector(".survey-title")
    // titleTag.innerText += surveyLs.survey.title    

    let allQuestionsArea = document.querySelector('.question-boxes-edit')
    allQuestionsArea.innerHTML = ""
    surveyLs.survey.questions.forEach(element => {    
                            
            answersHtml = '<div class="answers-edit">'
            for (const ans of element.answers) {
                answersHtml += '<p class="answer">' + ans + '</p>'
            }
            answersHtml += "</div>"                    
            html = `<div class="question-box-edit" name="` + element._id + `">
                        <div class="question-box-edit-bottom">
                            <div class="question-box-edit-left">
                                <span class="question-title-edit">` + element.title + `</span>
                                ` + answersHtml + `
                            </div>
                            <div class="question-box-edit-right">
                                <select class="select-type">
                                    <option name="question-type" value=""> 
                                    <option name="question-type" value="text"> Text
                                    <option name="question-type" value="radio"> Radio
                                    <option name="question-type" value="checkbox"> Checkbox
                                </select>
                            </div>
                        </div>
                    </div>`
            allQuestionsArea.innerHTML += html            
    });        
    
    let questionTitles = document.querySelectorAll('.question-title-edit')
    questionTitles.forEach(element => {
        element.addEventListener('click', make_it_editable)
    });
    
    let answers = document.querySelectorAll('.answer')
    answers.forEach(element => {
        element.addEventListener('click', make_it_editable)
    });        

    var question_type_current = document.querySelectorAll(".select-type")
    question_type_current.forEach(element => {
        element.addEventListener("change", render_question_type_current)
        console.log(element)
    });
}

function render_question_type_current(event) {
    el = event.target
    lookup = el.parentNode.previousSibling.previousSibling
    console.log(lookup)

    ans = document.createElement('div')
    ans.classList.add("checkbox_item")
    ans.innerHTML = `
                        <p class="new-option-button">Add option</p>
                        <input type="text" name="new-option">        
                        <div class="answers-edit">
                        
                        </div>            
                    `

    lookup.appendChild(ans)
    but = document.getElementsByClassName("new-option-button")[0]
    but.addEventListener("click", add_option_curr)
    lookup.addEventListener("click", make_it_editable)
}

function make_it_editable(event) {
    if (document.querySelector(".save-button")) {
        document.querySelector(".save-button").remove()
    }
    element = event.target;
    
    element.setAttribute("contentEditable", "true");
    parentDiv = element.parentElement
    saveButton = document.createElement("button")
    saveButton.classList.add("save-button")
    saveButton.innerText = "Save"
    saveButton.setAttribute("id", element.closest('.question-box-edit').id)
    parentDiv.appendChild(saveButton)
    saveButton.addEventListener("click", save_one)
}

function save_one(event) {

    element = event.target
    questionId = event.target.closest('.question-box-edit').getAttribute("name")
    console.log(questionId)
    let allQuestionsLSRaw = JSON.parse(sessionStorage.getItem("questions"))
    let allQuestionsLSEdit = allQuestionsLSRaw.survey.questions
    
    questionTitle = element.parentNode.querySelector(".question-title-edit").innerText

    let questionAnswers = element.parentNode.querySelectorAll(".answer")
    answersListHtml = []

    for (let i = 0;i < questionAnswers.length;i++) {
        answerText = questionAnswers[i].innerText
        answersListHtml.push(answerText)
    }

    questionType = element.closest(".question-box-edit-bottom").querySelector(".question-box-edit-right .question-type-edit").innerText    
        
    for (let i = 0;i < allQuestionsLSEdit.length;i++) { 
        console.log(questionId + allQuestionsLSEdit[i].id)         
        if (allQuestionsLSEdit[i]._id == questionId){
            console.log("nj")
            let q = new Question(questionId, questionTitle, answersListHtml, questionType)
            console.log(q.title)
            allQuestionsLSEdit[i] = q                        
        }
    }    
    allQuestionsLSRaw.questions = allQuestionsLSEdit    
    sessionStorage.setItem("questions", JSON.stringify(allQuestionsLSRaw))
    element.remove()
}

function save_all() {
    // get all questions from session storage    
    get_all_quesitons()
    let allQuestionsLS = JSON.parse(sessionStorage.getItem("questions"));
    surveyData = {
        "surveyId": sessionStorage.getItem("survey-id"),
        "survey": allQuestionsLS
    }

    fetch('/jsurvey/edit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(surveyData)
        })
      .then(response => {
        // Redirect to another page
        window.location.href = 'http://sessionhost:3000/jsurvey/survey_saved';
      })
      .catch(error => {
        console.error('Error:', error);
      });    
}


function fill_current_questions(){
    var current_questions =  JSON.parse(sessionStorage.getItem("questions")) || []
    var current_question_area = document.getElementsByClassName("current-questions")[0]

    for(let i=0;i < current_questions.length;i++) {
        single_question = document.createElement("div")
        single_question.classList.add("current-questions-item")
        single_question.innerHTML = `<h3>Question: ` + current_questions[i].title + `</h3><p>Options: ` + current_questions[i].answers +  `</p><button class="delete-button" id="question_` + i + `">Delete</button>`
        current_question_area.appendChild(single_question)
    }
}

function render_question_type(event) {
    console.log("nj")
    options_area = document.getElementsByClassName("option-area")[0]
    options_area.innerHTML = ""
    var dropdown = event.target
    question_type = dropdown.options[dropdown.selectedIndex].value
    console.log(question_type)
    if (question_type == 'checkbox' || question_type == 'radio'){
        generate_checboxes()
    }    

    
}

function generate_checboxes() {
    checkbox_area = document.getElementsByClassName("option-area")[0]
    checkbox = document.createElement("div")
    checkbox.innerHTML = 
    `
        <div class="checkbox_item">
            <p class="new-option-button">Add option</p>
            <input type="text" name="new-option">        
            <div class="option-div">
            
            </div>            
        </div>
    `
    checkbox_area.appendChild(checkbox)
    new_option = document.getElementsByClassName("new-option-button")[0]
    new_option.addEventListener('click', add_option)
}

function add_option(){
    new_option_area = document.querySelector(".option-div:nth-child(n-1)")
    option_value = document.getElementsByName("new-option")[0]
    new_option = document.createElement("input")
    new_option.classList.add("single-option")
    new_option.value = option_value.value    
    new_option_area.appendChild(new_option)
    
    option_value.value = ""
    option_value.focus()
}

function add_option_curr(){
    new_option_area = document.querySelector(".answers-edit")

    console.log(new_option_area)
    option_value = document.getElementsByName("new-option")[0]
    console.log(option_value.value)
    new_option = document.createElement("p")
    new_option.classList.add("answer")
    new_option.innerText = option_value.value    
    new_option_area.appendChild(new_option)
    
    option_value.value = ""
    option_value.focus()
}

// function add_option_curr(){
//     new_option_area = document.querySelector(".option-div:nth-child(n-1)")
//     option_value = document.getElementsByName("new-option")[0]
//     new_option = document.createElement("input")
//     new_option.classList.add("single-option")
//     new_option.value = option_value.value    
//     new_option_area.appendChild(new_option)
    
//     option_value.value = ""
//     option_value.focus()
// }

function add_question() {
    dropdown = document.getElementById("question-type")
    question_type = question_type = dropdown.options[dropdown.selectedIndex].value
    question_text = document.getElementsByName("question-text-input")[0].value
    question_options_elements = document.getElementsByClassName("single-option")
    question_options = question_options_elements
    let surveyLs = JSON.parse(sessionStorage.getItem("questions"))
    console.log(surveyLs.survey.questions)
    let curr_questions = surveyLs.survey.questions

    this_question_options = []
    for(const opt of question_options){this_question_options.push(opt.value)}
    lastId = curr_questions[curr_questions.length-1].id
    console.log(typeof lastId)
    question = new Question(lastId+1, question_text, this_question_options, question_type)
    curr_questions.push(question)
    surveyLs.survey.questions = curr_questions
    console.log(curr_questions)
    
    sessionStorage.setItem("questions", JSON.stringify(surveyLs))

    get_all_quesitons()
}
