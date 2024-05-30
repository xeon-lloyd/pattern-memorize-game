/* 필요 변수 설정 */
//constants
const buttonEnum = ['A', 'B', 'C', 'D']

//variables
let pattern = []; //현재 게임의 버튼 순서
let userInputStep = 0; //유저가 버튼을 누르는 현재 위치
let isShowing = true; //버튼 순서(정답)을 보여주고 있음을 알리는 flag
let currentLevel = 1; //현재 단계
let topRecord = 0; //최고 기록

//html elements
const $startCover = document.querySelector('#startCover')
const $currentStep = document.querySelector('#currentStep')
const $topRecord = document.querySelector('#topRecord')
const $tiles = document.querySelector('#tiles')
const $buttonA = document.querySelector('#tiles > #A')
const $buttonB = document.querySelector('#tiles > #B')
const $buttonC = document.querySelector('#tiles > #C')
const $buttonD = document.querySelector('#tiles > #D')
const $userInput = document.querySelector('#userInput')


/* // 함수: utils // */
/* wait async 함수 */
async function wait(ms){
    return new Promise((resolve, reject)=>{
        setTimeout(resolve, ms)
    })
}


/* // 함수: 로직 함수 // */
/* 패턴 추가 함수 */
function addPattern(){
    /* random으로 무작위로 추출해서 패턴배열에 추가 */
    let rand = Math.floor(Math.random()*4)
    pattern.push(buttonEnum[rand])
}

/* 패턴 보여주는 함수 */
async function showPattern(){
    /* "보여주고 있음" 설정 */
    isShowing = true
    $tiles.classList.add('showing')

    for(let i=0;i<pattern.length;i++){
        await wait(250)

        /* 버튼 선택 효과 적용 */
        let target = document.querySelector(`#tiles > #${pattern[i]}`)
        target.classList.add('selected')

        /* beep음 재생 */
        const clickBeep = new Audio('./resource/click.mp3')
        clickBeep.play()
        
        /* 버튼 선택 효과 해제 */
        await wait(500)
        target.classList.remove('selected')
    }

    /* "보여주고 있음" 해제 */
    isShowing = false
    $tiles.classList.remove('showing')
}

/* 버튼 클릭 핸들러 */
async function buttonClickHandler(e){
    /* 패턴을 보여주고 있으면 무효화 */
    if(isShowing) return;

    /* beep음 재생 */
    const clickBeep = new Audio('./resource/click.mp3')
    clickBeep.play()

    /* 유저 입력에 클릭한 버튼 추가 */
    $userInput.innerHTML += `<div id="${e.target.id}"></div>`

    /* 해당 순서에 맞는 버튼을 눌렀는지 확인 */
    if(pattern[userInputStep]==e.target.id){
        /* 클릭 target을 다음으로 변경 */
        userInputStep++;

        /* 최고점수보다 현재 점수가 높으면 업데이트 */
        if(topRecord < userInputStep){
            topRecord = userInputStep
            $topRecord.innerHTML = `최고기록 ${topRecord} 단계`
        }
    }else{
        /* 틀리면 관련 변수 초기화 */
        pattern = [];
        userInputStep = 0;
        currentLevel = 0;

        /* fail음 재생 */
        const failBeep = new Audio('./resource/fail.mp3')
        failBeep.play()

        /* 틀림 효과 재생(css animation) */
        document.body.classList.add('fail')
        await wait(300)
        document.body.classList.remove('fail')
    }

    /* 만약 유저 입력과 패턴 저장 길이가 같다면(모두 맞게 누른경우) */
    if(pattern.length==userInputStep){
        /* 새로운 버튼 하나 추가해서 보여주기 */
        addPattern()
        showPattern()

        /* 유저 버튼 입력 화면 초기화 */
        await wait(300)
        userInputStep = 0
        $userInput.innerHTML = ''

        /* 현재 단계 1 올리기 */
        currentLevel++
        $currentStep.innerHTML = `현재 ${currentLevel} 단계`
        
    }
}
/* 버튼에 이벤트 리스너 추가 */
$buttonA.addEventListener('click', buttonClickHandler)
$buttonB.addEventListener('click', buttonClickHandler)
$buttonC.addEventListener('click', buttonClickHandler)
$buttonD.addEventListener('click', buttonClickHandler)

/* 게임 시작 함수 */
async function startGame(){
    /* 게임 시작 커버 제거 */
    $startCover.style.display = 'none'

    await wait(500)

    /* 첫번째 패턴 추가하고 보여주기 */
    addPattern()
    showPattern()
}
/* 게임 시작 커버 이벤트 리스너 적용 */
$startCover.addEventListener('click', startGame)