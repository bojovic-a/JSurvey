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
            sessionStorage.setItem("questions", JSON.stringify(data))                        
        })    
        .then(() =>{        
            print_title()
            print_questions()
            }
        )

    saveChangesButton = document.querySelector("#save-changes-button")
    saveChangesButton.addEventListener("click", save_changes)
        
}

function print_title(){
    title = JSON.parse(sessionStorage.getItem("questions")).survey.title
    titleBox = document.querySelector(".survey-title")
    titleBox.innerText += title
}

function print_questions() {
    allQuestions = JSON.parse(sessionStorage.getItem("questions")).survey.questions
    currentQuestions = document.querySelector(".current-questions")

    for (let i=0;i < allQuestions.length;i++) {
        let answersHtml=""

        if (allQuestions[i].answers.length > 0) {
            for (let j=0;j < allQuestions[i].answers.length;j++) {
                answersHtml += `
                    <input class="answer-input" vlaue="${allQuestions[i].answers[j]}" placeholder="${allQuestions[i].answers[j]}"><br>
                `
            }
        }
        else {
            answersHtml = ""
        }
        answersHtml += '<button class="add-option-button"> + </button>'

        let questionDiv = document.createElement("div")

        questionDiv.classList.add("question-edit") 
        questionDiv.setAttribute("id", allQuestions[i]._id)
        console.log(allQuestions[i])
        questionDivHtml = `
                <div class="question-left"> 
                    <label>Question</label>
                    <input class="question-title-input" value="${allQuestions[i].title}"><br>
                    <label>Answers<label>
                    ${answersHtml}
                </div> 
                <div class="question-right">

                </div> 
        `
        questionDiv.innerHTML = questionDivHtml  
        currentQuestions.appendChild(questionDiv)
    }

    var inputs = document.getElementsByClassName("question-left")
    for (let i = 0;i < inputs.length;i++) {
        inputs[i].addEventListener("click", make_editable)
    }
    
}

function make_editable(event) {
    let saveButtonBox = event.target.closest(".question-edit")
    console.log(saveButtonBox.querySelector(".add-option-button"))
    if (!saveButtonBox.querySelector(".save-changes-button")){
        let saveButton = document.createElement("button")
        saveButton.classList.add("save-changes-button")
        saveButton.innerText = "Save question"
        saveButton.setAttribute("id", saveButtonBox.id)
        saveButtonBox.appendChild(saveButton)  
        saveButton.addEventListener("click", save_changes_one) 
    }
}


function save_changes_one(event) {
    event.target.remove()
}

function save_changes() {
    pass
}