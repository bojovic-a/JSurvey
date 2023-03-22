class Question{
    constructor(id, title, answers, type){
        this._id = id
        this.title = title
        this.answers = answers
        this.type = type
    }
}

window.addEventListener('load', init);

function init() {        
    surveyId = document.getElementsByClassName("survey-title")[0].getAttribute("name")
    
    if (!localStorage.getItem("questions")){
        let fetchUrl = "http://localhost:3000/jsurvey/get-survey-data?survey=" + surveyId            
        fetch(fetchUrl)
            .then(response=>response.json())
            .then(data => {                
                localStorage.setItem("questions", JSON.stringify(data))                        
            })    
        }
    get_all_quesitons()
    // if (JSON.parse(localStorage.getItem("questions")).length <1){
    //     // localStorage.setItem("questions", JSON.stringify([]))
    //     get_all_quesitons()
    //     console.log("nj")
    // }
    saveAllButton = document.querySelector("#save-survey")
    saveAllButton.addEventListener("click", save_all)
    var add_question_button = document.getElementById("add-question-button")
    var question_type = document.getElementById("question-type")
    add_question_button.addEventListener('click', add_question)
    question_type.addEventListener("change", render_question_type)
}

// function get_all_quesitons(){
//     question_divs = document.getElementsByClassName("question-box-edit")
//     surveyId = document.getElementsByClassName("survey-title")[0].getAttribute('name')
//     localStorage.setItem("survey-id", JSON.stringify(surveyId))
//     all_questions = JSON.parse(localStorage.getItem("questions"))
    
//     for(let i = 0;i < question_divs.length;i++) {
//         question_divs[i].setAttribute("id", i)
//         let question_title = document.getElementsByClassName("question-title-edit")[i]
//         question_title.addEventListener('click', make_it_editable)

//         let question_type = document.getElementsByClassName("question-type-edit")[i]
//         question_type.addEventListener('click', make_it_editable)
        
//         query = "answer_"+ question_divs[i].getAttribute('name')

//         let answersToThis = document.getElementsByClassName(query)      

//         answersList = []

//         if (answersToThis){         
//             for (const ans of answersToThis) {
//                 answersList.push(ans.innerText)
//                 console.log(ans)
//                 ans.setAttribute("contentEditable", "true")
//                 ans.addEventListener('click', make_it_editable)
//             }
//         }        

//         let q = new Question(i, question_title.innerText, answersList, question_type.innerText)
        
//         all_questions.push(q)
//     }
//     localStorage.setItem("questions", JSON.stringify(all_questions))
// }

function get_all_quesitons() {
    // Title
    let surveyLs = JSON.parse(localStorage.getItem("questions"))
    let titleTag = document.querySelector(".survey-title")
    titleTag.innerText += surveyLs.survey.title    
    // Questions
    let allQuestionsArea = document.querySelector('.question-boxes-edit')
    

    surveyLs.survey.questions.forEach(element => {    
                
        // answersHtml = document.createElement('div')
        // answersHtml.innerHTML = `<div class="answers-edit">`
        // for (const ans of question.answers) {
        //     let singleAnswerHtml = document.createElement("p")
        //     singleAnswerHtml.classList.add("answer")
        //     singleAnswerHtml.innerHTML = 
        //     `
        //         <p class="answer ` + ans.id + `">aaa` + ans + `</p>
        //     `
        //     answersHtml.appendChild()
        // }
            console.log(element)
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
                                <p class="question-type-edit">` + element.type + `</p>
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
    let allQuestionsLSRaw = JSON.parse(localStorage.getItem("questions"))
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
    localStorage.setItem("questions", JSON.stringify(allQuestionsLSRaw))
    element.remove()
}

function save_all() {
    // get all questions from local storage
    localStorage.setItem("questions", JSON.stringify([]))
    get_all_quesitons()
    let allQuestionsLS = JSON.parse(localStorage.getItem("questions"));
    surveyData = {
        "surveyId": localStorage.getItem("survey-id"),
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
        window.location.href = 'http://localhost:3000/jsurvey/survey_saved';
      })
      .catch(error => {
        console.error('Error:', error);
      });
    localStorage.setItem("questions", JSON.stringify([]));
}


function fill_current_questions(){
    var current_questions =  JSON.parse(localStorage.getItem("questions")) || []
    var current_question_area = document.getElementsByClassName("current-questions")[0]

    for(let i=0;i < current_questions.length;i++) {
        single_question = document.createElement("div")
        single_question.classList.add("current-questions-item")
        single_question.innerHTML = `<h3>Question: ` + current_questions[i].title + `</h3><p>Options: ` + current_questions[i].answers +  `</p><button class="delete-button" id="question_` + i + `">Delete</button>`
        current_question_area.appendChild(single_question)
    }
}

function render_question_type(event) {
    options_area = document.getElementsByClassName("option-area")[0]
    options_area.innerHTML = ""
    var dropdown = event.target
    question_type = dropdown.options[dropdown.selectedIndex].value

    if (question_type == 'checkbox'){
        generate_checboxes()
    }

    if (question_type == 'radio') {
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

function add_question() {
    dropdown = document.getElementById("question-type")
    question_type = question_type = dropdown.options[dropdown.selectedIndex].value
    question_text = document.getElementsByName("question-text-input")[0].value
    question_options_elements = document.getElementsByClassName("single-option")
    question_options = question_options_elements
    let surveyLs = JSON.parse(localStorage.getItem("questions"))
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
    
    localStorage.setItem("questions", JSON.stringify(surveyLs))
    // location.reload()   
}
