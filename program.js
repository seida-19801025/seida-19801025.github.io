const seCorrect = new Audio("https://seida-19801025.github.io/mp3/correct.mp3");
const seWrong = new Audio('https://seida-19801025.github.io/mp3/wrong.mp3');
const seFinish = new Audio('https://seida-19801025.github.io/mp3/finish.mp3');

/**
 * キーが押されたときのイベント
 * @param {*} e 
 */
function eventKeyPress(e) {
  document.getElementById("targetFont").innerHTML = e.key;
  if (e.key === "a"){
	se(seFinish);
  }else if (e.key === "s"){
	se(seWrong);
  }else{
  	se(seCorrect);
  }
}

/**
 * 効果音を鳴らす
 * @returns 
 */
function se(audio) {
//	seCorrect.pause();
//	seWrong.pause();
//	seFinish.pause();
//	seCorrect.currentTime = 0;
//	seWrong.currentTime = 0;
//	seFinish.currentTime = 0;

	audio.pause();
	audio.currentTime = 0;
	audio.play();
}

document.addEventListener("keypress", eventKeyPress);
