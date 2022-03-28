// const seCorrect = new Audio("https://seida-19801025.github.io/mp3/correct.mp3");
// const seWrong = new Audio("https://seida-19801025.github.io/mp3/wrong.mp3");
// const seFinish = new Audio("https://seida-19801025.github.io/mp3/finish.mp3");
const seCorrect = new Audio("./mp3/correct.mp3");
const seWrong = new Audio("./mp3/wrong.mp3");
const seFinish = new Audio("./mp3/finish.mp3");
const level = 10;
const txtFile = "https://seida-19801025.github.io/txt/" + "LV" + level + ".txt"


const arrayTestWord = getTxt(txtFile); //levelに対応したテキストファイルを配列で取得

let testWord = ""; //arrayTestWordから1つのデータを受け取り出題する
let testWordCount = 0;

let testChar = ""; //次に入力する文字
let testCharCount = 0;
let beforeStart = true;
let startTime
/**
 * キーが押されたときのイベント
 * @param {*} e 
 */
function eventKeyPress(e) {
//  document.getElementById("targetFont").innerHTML = e.key;
//  document.getElementById("targetFont").innerHTML = arrayTestWord[1];
if (beforeStart === true){ 
  	if(e.key === " "){//スペースでスタート
	  	console.log("Start!!");
		setInterval("timerUpdate()",1000);//カウントダウンスタート
		
		startTime = new Date().getTime(); //開始時間		
	  	nextWord();
		beforeStart = false;
  	}
} else {	
  	if(e.key === testChar){
    		correctType();
  	} else {
    		wrongType();
 		}
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
	console.log(`str : ${str}`)
	let result = str.split("\r\n"); // CRLFを区切り文字として行を要素とした配列を生成
	console.log(`result : ${result}`);
	// ■■■■■■■■■■■■■■■■■■■■　暫定対応（１つ多く要素ができる）■■■■■■■■■■■■■■■■■■■■
	result.pop();
	return result;
}


/**
 * 乱数(0-num)
 * @param {number} num -乱数の上限値
 * @returns {number} - 0～numの乱数
 */
function rand(num) {
	console.log(`randmax = ${num}`);
	result = Math.floor(Math.random() * (num + 1));
	return result;
}

function nextWord(){
	testWordCount++;
	testCharCount = 0;
	console.log(`arrayTestWord.length : ${arrayTestWord.length}`);
	testWord = arrayTestWord[rand(arrayTestWord.length - 1)];
	document.getElementById('targetFont').innerHTML = testWord;
	testChar = testWord.slice(testCharCount, testCharCount + 1);
}

function correctType(){
	se(seCorrect);
	testCharCount++;

	//単語完了時
	if (testWord.length <= testCharCount) {
		se(seFinish);
		nextWord();
	}else{ //未完なら
		document.getElementById('targetFont').innerHTML = testWord.slice(0, testCharCount).fontcolor("blue") + testWord.slice(testCharCount);
		testChar = testWord.slice(testCharCount, testCharCount + 1);
	}	
}

function wrongType(){
	se(seWrong);
	document.getElementById('targetFont').innerHTML = testWord.slice(0, testCharCount).fontcolor("blue")
		+ testWord.slice(testCharCount,testCharCount + 1).fontcolor("red")
		+ testWord.slice(testCharCount + 1);
}

function timerUpdate(){
	document.getElementById("timerUpdate").innerHTML = (startTime + 60000)-new Date();
}



document.addEventListener("keypress", eventKeyPress);
