// const seCorrect = new Audio("https://seida-19801025.github.io/mp3/correct.mp3");
// const seWrong = new Audio("https://seida-19801025.github.io/mp3/wrong.mp3");
// const seFinish = new Audio("https://seida-19801025.github.io/mp3/finish.mp3");
const seCorrect = new Audio("./mp3/correct.mp3");
const seWrong = new Audio("./mp3/wrong.mp3");
const seFinish = new Audio("./mp3/finish.mp3");
//const level = 10;
const testTime = 6000; //ms
//const txtFile = "https://seida-19801025.github.io/txt/" + "LV" + level + ".txt"
let txtFile = ""//"./txt/LV" + level + ".txt"
let arrayTestWord = [];//getTxt(txtFile); //levelに対応したテキストファイルを配列で取得

let testWord = ""; //arrayTestWordから1つのデータを受け取り出題する
let testWordCount = 0;

let testChar = ""; //次に入力する文字
let testCharCount = 0;
let isStart = false; //テストが開始されたか？
let isEnd = false; //テストが終了したか？
let startTime
let timerId;

/**
 * キーが押されたときのイベント
 * @param {*} e 
 * @returns {null} 
 */
function eventKeyPress(e) {
	//スタートしてなくてスペース押下でスタート
	if (!isStart && (e.key === " ")) {
		console.log("Start!!");
		//window.alert(getLevel());
		txtFile = "./txt/LV" + getLevel() + ".txt"
		window.alert(txtFile);
		arrayTestWord = getTxt(txtFile); //levelに対応したテキストファイルを配列で取得




		timerId = setInterval("timerUpdate()", 250);//カウントダウンスタート

		startTime = new Date().getTime(); //開始時間		
		nextWord();
		isStart = true;
		return null;
	}

	//テスト終了時、スペース押下でリセット
	if (isEnd && (e.key === " ")) {
		console.log("Reset!!");
		document.getElementById('targetFont').innerHTML = "レベル選択 & <br> Spaceキーでスタート";
		isStart = false;
		isEnd = false;
		return null;
	}

	//テスト中、正解キーをタイプor不正解キーをタイプの関数を発火
	if (isStart && !isEnd) {
		if (e.key === testChar) {
			correctType();
		} else {
			wrongType();
		}
		return null;
	}
}

function getLevel() {
	const elements = document.getElementsByName("level");
	for (const element of elements) {
		if (element.checked) {
			return element.value;
		}
	}
	return 99;

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
	req.open("get", txtFile, false); // アクセスするファイルを指定
	req.send(null); // HTTPリクエストの発行

	// レスポンスが返ってきたらconvertTXTtoArray()を呼ぶ	
	result = convertTXTtoArray(req.responseText); // 渡されるのは読み込んだTXTデータ
	return result;
}

/**
 * 文字列を改行で区切って配列化
 * @param {string} str -CRLFを含んだ文字列 
 * @returns 
 */
function convertTXTtoArray(str) { // 読み込んだTXTデータが文字列として渡される
	let result = str.split("\r\n"); // CRLFを区切り文字として行を要素とした配列を生成
	console.log(`result : ${result}`);
	return result;
}


/**
 * 乱数(0-num)
 * @param {number} num -乱数の上限値
 * @returns {number} - 0～numの乱数
 */
function rand(num) {
	// console.log(`randmax = ${num}`);
	result = Math.floor(Math.random() * (num + 1));
	return result;
}

/**
 * 出題関数
 */
function nextWord() {
	testWordCount++;
	testCharCount = 0;
	testWord = arrayTestWord[rand(arrayTestWord.length - 1)];
	document.getElementById('targetFont').innerHTML = "<span style=\"border-bottom: solid 2px black;\">" + testWord.slice(0, 1) + "</span>"
		+ testWord.slice(1);

	testChar = testWord.slice(testCharCount, testCharCount + 1);
}

/**
 * 正解キーをタイプした時
 * ・正解効果音を鳴らす
 * ・文字カウントをインクリメント
 * 
*/
function correctType() {
	se(seCorrect);
	testCharCount++;

	//単語完了時
	if (testWord.length <= testCharCount) {
		se(seFinish);
		nextWord();
	} else { //未完なら
		document.getElementById('targetFont').innerHTML = "<span style=\"color: blue;\">" + testWord.slice(0, testCharCount) + "</span>"//.fontcolor("blue") 
			+ "<span style=\"border-bottom: solid 2px black;\">" + testWord.slice(testCharCount, testCharCount + 1) + "</span>"
			+ testWord.slice(testCharCount + 1);

		testChar = testWord.slice(testCharCount, testCharCount + 1);
	}
}

/**
 * 不正解キーをタイプ
 */
function wrongType() {
	se(seWrong);
	document.getElementById('targetFont').innerHTML = "<span style=\"color: blue;\">" + testWord.slice(0, testCharCount) + "</span>" //.fontcolor("blue")
		+ "<span style=\"border-bottom: solid 2px black;\">" + testWord.slice(testCharCount, testCharCount + 1).fontcolor("red") + "</span>"
		+ testWord.slice(testCharCount + 1);
}

/**
 * インターバルタイマからコールバックされる関数
 */
function timerUpdate() {
	let time = Math.floor(((startTime + testTime) - new Date()) / 1000);
	document.getElementById("ClockArea").innerHTML = time;
	if (time === 0) {
		clearInterval(timerId);
		isEnd = true;
		document.getElementById('targetFont').innerHTML = "Time up!<br>Spaceキーでリセット"
	}
}

document.addEventListener("keypress", eventKeyPress);
