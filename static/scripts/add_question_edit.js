class Question{
    constructor(title, answers, type){
        this.title = title
        this.answers = answers
        this.type = type
    }
}

window.addEventListener('load', init);

function init() {
    let all_questions = document.getElementsByClassName('edit-question')
    console.log(all_questions)
}

