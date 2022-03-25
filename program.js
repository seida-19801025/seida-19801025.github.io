const seCorrect = new Audio("https://seida-19801025.github.io/mp3/correct.mp3");
const seWrong = new Audio('https://seida-19801025.github.io/mp3/wrong.mp3');
const seFinish = new Audio('https://seida-19801025.github.io/mp3/finish.mp3');

/**
 * キーが押されたときのイベント
 * @param {*} e 
 */
function eventKeyPress(e) {
  document.getElementById("targetFont").innerHTML = e.key;
	
  //se_off();
	
  //seCorrect.pause();
  //seCorrect.currentTime = 0;
  seCorrect.play();
  audio.play(seFinish);
}

/**
 * 音を止める
 * @returns 
 */
function se(audio) {
	seCorrect.pause();
	seWrong.pause();
	seFinish.pause();
	seCorrect.currentTime = 0;
	seWrong.currentTime = 0;
	seFinish.currentTime = 0;
	audio.play();
}

document.addEventListener("keypress", eventKeyPress);
