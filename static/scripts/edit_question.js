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
            if (allQuestions[i].type != 'text'){
                answersHtml += '<input type="text" class="new-answer-value" name="new-answer-value" placeholder="Add new option"><br><button class="add-option-button"> + </button>'
            }

        let questionDiv = document.createElement("div")
        console.log(allQuestions[i].id)
        questionDiv.classList.add("question-edit") 
        questionDiv.setAttribute("id", allQuestions[i].id)
        console.log(allQuestions[i])
        questionDivHtml = `
                <div class="question-left"> 
                    <label>Question</label>
                    <input class="question-title-input" value="${allQuestions[i].title}"><br>
                    <div class="answers-to-this">
                        ${allQuestions[i].type != "text" ? '' : '<label>Answers</label>'}
                        ${answersHtml}
                    </div>
                </div> 
                <div class="question-right">

                </div> 
        `
        questionDiv.innerHTML = questionDivHtml  
        currentQuestions.appendChild(questionDiv)
    }
    let plusBtn = document.querySelector('.add-option-button')
    plusBtn.addEventListener("click", add_new_option)

    var inputs = document.getElementsByClassName("question-left")
    for (let i = 0;i < inputs.length;i++) {
        inputs[i].addEventListener("click", make_editable)
    }
    
}

function make_editable(event) {
    let saveButtonBox = event.target.closest(".question-edit")
    
    if (!saveButtonBox.querySelector(".save-changes-button")){
        let saveButton = document.createElement("button")
        saveButton.classList.add("save-changes-button")
        saveButton.innerText = "Save question"
        saveButton.setAttribute("id", saveButtonBox.id)
        saveButtonBox.appendChild(saveButton)  
        saveButton.addEventListener("click", save_changes_one) 
    }
}

function add_new_option(event) {
    let plusBtn = event.target;
    let newOptionInput = plusBtn.parentNode.querySelector(".new-answer-value");
    let newOptionValue = newOptionInput.value
    let questionToChange = parseInt(plusBtn.parentNode.parentNode.parentNode.id);
    newOptionInput.value = newOptionValue

    allQuestionsSession = JSON.parse(sessionStorage.getItem("questions"));
    allQuestionsSession.survey.questions[questionToChange].answers.push(newOptionValue)
    console.log(allQuestionsSession)
    sessionStorage.setItem("questions", JSON.stringify(allQuestionsSession))
    
    let optionsDiv = document.getElementsByClassName("answers-to-this")[questionToChange]
    let newOption = document.createElement("input")
    // optionsDiv.innerHTML += `<input class="answer-input" vlaue="${newOptionValue}" placeholder="${newOptionValue}"><br></br>`
    newOption.classList.add("answer-input");
    newOption.value = newOptionValue;
    newOption.placeholder = newOptionValue;

    optionsDiv.insertBefore(newOption, optionsDiv.firstChild)
    newOptionInput.value = ""
    newOptionInput.focus()
}

function save_changes_one(event) {
    let questionId = event.target.parentNode.id
    let questionDataDiv = document.getElementsByClassName("question-left")[questionId]
    let questionTitle = questionDataDiv.querySelector(".question-title-input").value

    let allQuestionsSession = JSON.parse(sessionStorage.getItem("questions"))
    allQuestionsSession.survey.questions[questionId].title = questionTitle;

    sessionStorage.setItem("questions", JSON.stringify(allQuestionsSession))

    event.target.remove()
}

function save_changes() {
    // Send sessionStorage to node
    dataToServer = JSON.parse(sessionStorage.getItem("questions"))
    
    fetch('/jsurvey/edit-survey', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(dataToServer),
    })
    // .then(response=> response.json())
    .then(response=> {
        window.location.href = 'http://localhost:3000/jsurvey/survey_saved'
    })
    .catch(error => {
        console.log("Error: " + error)
    })

}