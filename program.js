const seCorrect = new Audio("https://seida-19801025.github.io/mp3/correct.mp3");
const seWrong = new Audio("https://seida-19801025.github.io/mp3/wrong.mp3");
const seFinish = new Audio("https://seida-19801025.github.io/mp3/finish.mp3");
const txtFile = "https://seida-19801025.github.io/" + "LV" + "10" + ".txt"

//levelに対応したテキストファイルを配列で取得
let arrayTestWord = getTxt(txtFile);

/**
 * キーが押されたときのイベント
 * @param {*} e 
 */
function eventKeyPress(e) {
//  document.getElementById("targetFont").innerHTML = e.key;
  document.getElementById("targetFont").innerHTML = arrayTextWord[1];

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
 * ex) se(seCorrect);
 */
function se(audio) {
	audio.pause();
	audio.currentTime = 0;
	audio.play();
}

/**
 * テキストファイル取得
 * @param {string} txtFile -textFilePath 
 * @returns {string} -TextData 
 */
function getTxt(txtFile) {
	let req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
	let result = [];
	console.log(txtFile);
	req.open("get", txtFile, false); // アクセスするファイルを指定
	req.send(null); // HTTPリクエストの発行

	// レスポンスが返ってきたらconvertTXTtoArray()を呼ぶ	
	result = convertTXTtoArray(req.responseText); // 渡されるのは読み込んだTXTデータ
	return result;
}

/**
 * TextString to Array
 * @param {string} str -CRLFを含んだ文字列 
 * @returns 
 */
function convertTXTtoArray(str) { // 読み込んだTXTデータが文字列として渡される
	let result = str.split("\r\n"); // CRLFを区切り文字として行を要素とした配列を生成
	return result;
}



document.addEventListener("keypress", eventKeyPress);
