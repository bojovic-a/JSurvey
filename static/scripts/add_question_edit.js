class Question{
    constructor(title, answers, type){
        this.title = title
        this.answers = answers
        this.type = type
    }
}

window.addEventListener('load', init);

function init() {
    get_all_quesitons()
}

function get_all_quesitons(){
    question_divs = document.getElementsByClassName("question-box-edit")
    all_questions = JSON.parse(localStorage.getItem("questions")) || [] 
    
    for(let i = 0;i < question_divs.length;i++) {
    
        let question_title = document.getElementsByClassName("question-title-edit")[i]
        question_title.addEventListener('click', make_it_editable)

        let question_type = document.getElementsByClassName("question-type-edit")[i]
        question_type.addEventListener('click', make_it_editable)
        
        let divAnswersToThis = document.querySelector('.answers-edit')
        let answersToThis = divAnswersToThis.childNodes
        
        answersList = []
        for (const ans of answersToThis) {
            answersList.push(ans.innerText)
            ans.setAttribute("contentEditable", "true")
        }
        
        let q = new Question(question_title.innerText, answersList, question_type)
        all_questions.push(q)
    }
    localStorage.setItem("questions", JSON.stringify(all_questions))
}

function make_it_editable(event) {
    element = event.target
    element.setAttribute("contentEditable", "true")
    
}