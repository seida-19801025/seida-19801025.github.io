const seCorrect = new Audio('mp3/correct.mp3');
seCorrect.play();

/**
 * キーが押されたときのイベント
 * @param {*} e 
 * @returns 
 */
function eventKeyPress(e) {
  se_off();
  seCorrect.play();
}

/**
 * 正解音を止める
 * @returns 
 */
function seOff() {
	// seCorrect.pause();
	// seCorrect.currentTime = 0;
	seCorrect.pause();
	seCorrect.currentTime = 0;
	return false;
}



document.addEventListener('keypress', eventKeyPress);
