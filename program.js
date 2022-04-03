/*memo
ChromeのBlinkは以下の4フェーズからなる処理によってWebページを表示する。
Loading > Scripting > Rendering > Painting
*/
// 効果音用AudioElement
const seCorrect = new Audio("./mp3/correct.mp3");
const seWrong = new Audio("./mp3/wrong.mp3");
const seFinish = new Audio("./mp3/finish.mp3");
// ピアノAudioElement
const piano1 = new Audio("./mp3/piano/1C.mp3");
const piano2 = new Audio("./mp3/piano/2D.mp3");
const piano3 = new Audio("./mp3/piano/3E.mp3");
const piano4 = new Audio("./mp3/piano/4F.mp3");
const piano5 = new Audio("./mp3/piano/5G.mp3");
const piano6 = new Audio("./mp3/piano/6A.mp3");
const piano7 = new Audio("./mp3/piano/7B.mp3");
const piano8 = new Audio("./mp3/piano/8C.mp3");
const piano = ["", piano1, piano2, piano3, piano4, piano5, piano6, piano7, piano8]
//

let music = [1, 0, 1, 0, 5, 0, 5, 0, 6, 0, 6, 0, 5, 0, 0, 4, 4, 0, 3, 0, 3, 0, 2, 0, 2, 0, 1, 0, 0, 5, 0, 5, 0, 4, 0, 4, 0, 3, 0, 3, 0, 2, 0, 0, 5, 0, 5, 0, 4, 0, 4, 0, 3, 0, 3, 0, 2, 0, 0, 1, 0, 1, 0, 5, 0, 5, 0, 6, 0, 6, 0, 5, 0, 0, 4, 4, 0, 3, 0, 3, 0, 2, 0, 2, 0, 1, 0];
const testTime = 30000; //ms

let txtFile = "";//"./txt/LV" + level + ".txt"

let arrayTestWord = [];//getTxt(txtFile); //levelに対応したテキストファイルを配列で取得
let testWord = ""; //arrayTestWordから1つのデータを受け取り出題する
let testWordCount = 0;

let testChar = ""; //次に入力する文字
let testCharCount = 0;
let isStart = false; //テストが開始されたか？
let isEnd = false; //テストが終了したか？
let totalValidType = 0; //有効タイプ数をカウント
let startTime;
let timerId; //タイマー

let decoratedKey = []; //装飾中のキーオブジェクト 0:objKey 1:objKey.style
let isCapsLock = false; //CapsLock ON?
let isShift = false; //shift押下？

let kirakiraCount = 0;
let isKirakira = false;
const arrayKeyId1 = ["keyQ", "keyW", "keyE", "keyR", "keyT", "keyY", "keyU", "keyI", "keyO", "keyP", "keyA", "keyS", "keyD", "keyF", "keyG", "keyH", "keyJ", "keyK", "keyL", "keyZ", "keyX", "keyC", "keyV", "keyB", "keyN", "keyM"];
const arrayKeyId2 = ["key;", "key,", "key.", "key/"];

/**
 * キーが押されたときのイベント
 * @param {*} e 
 * @returns {null} 
 */
function eventKeyPress(e) {
	//スタートしてなくてスペース押下でスタート
	if (!isStart && (e.key === " ")) {
		//レベル未選択時
		if (getLevel() === 99) {
			if (kirakiraCount <= 4) {
				window.alert("レベルを選択してください。");
				kirakiraCount += 1;
				return null;
			} else {
				isKirakira = true;
			}
		}

		console.log("Start!!");
		txtFile = "./txt/LV" + getLevel() + ".txt"

		arrayTestWord = getTxt(txtFile); //levelに対応したテキストファイルを配列で取得

		timerId = setInterval("timerUpdate()", 250);//カウントダウンスタート

		startTime = new Date().getTime(); //開始時間		
		nextWord();
		isStart = true;
		return null;
	}

	//テスト終了時、スペース押下でリセット
	if (isEnd && (e.key === " ")) {
		console.log("Reset!");
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

/**
 * 選択しているレベルを取得する
 * 未選択時は99
 * @returns {number} -選択レベル
 */
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
 * 文字列を改行で区切って配列化する
 * @param {string} str -CRLFを含んだ文字列 
 * @returns 
 */
function convertTXTtoArray(str) { // 読み込んだTXTデータが文字列として渡される
	let result = str.split("\r\n"); // CRLFを区切り文字として行を要素とした配列を生成
	// console.log(`result : ${result}`);
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
 * 出題
 */
function nextWord() {
	testWordCount++;
	testCharCount = 0;
	testWord = arrayTestWord[rand(arrayTestWord.length - 1)];

	document.getElementById('targetFont').innerHTML = "<span style=\"border-bottom: solid 2px black;\">" + testWord.slice(0, 1) + "</span>"
		+ testWord.slice(1);
	testChar = testWord.slice(testCharCount, testCharCount + 1);
	decorateCorrectKey(testChar);
}

/**
 * 正解タイプ時の動作
 * ・正解効果音を鳴らす
 * ・文字カウントをインクリメント
 * 
*/
function correctType() {
	totalValidType++;
	if (isKirakira) {//■■■きらきらモード■■■
		kirakira();
	} else {
		se(seCorrect);
	}
	testCharCount++;

	//単語完了時
	if (testWord.length <= testCharCount) {
		// ■■■きらきらモード■■■
		if (isKirakira) {
			clearInterval(timerId);
			isEnd = true;
			kirakiraCount = 0;
			music = [1, 0, 1, 0, 5, 0, 5, 0, 6, 0, 6, 0, 5, 0, 0, 4, 4, 0, 3, 0, 3, 0, 2, 0, 2, 0, 1, 0, 0, 5, 0, 5, 0, 4, 0, 4, 0, 3, 0, 3, 0, 2, 0, 0, 5, 0, 5, 0, 4, 0, 4, 0, 3, 0, 3, 0, 2, 0, 0, 1, 0, 1, 0, 5, 0, 5, 0, 6, 0, 6, 0, 5, 0, 0, 4, 4, 0, 3, 0, 3, 0, 2, 0, 2, 0, 1, 0];
			document.getElementById('targetFont').innerHTML = "ナイスきらきら☆彡"
			isStart = false;
			isEnd = false;
			isKirakira = false;
			totalValidType = 0;
			return null;
		}
		se(seFinish);
		nextWord();
	} else { //未完なら
		document.getElementById('targetFont').innerHTML = "<span style=\"color: blue;\">" + testWord.slice(0, testCharCount) + "</span>"//.fontcolor("blue") 
			+ "<span style=\"border-bottom: solid 2px black;\">" + testWord.slice(testCharCount, testCharCount + 1) + "</span>"
			+ testWord.slice(testCharCount + 1);

		testChar = testWord.slice(testCharCount, testCharCount + 1);
		decorateCorrectKey(testChar);
	}
}

/**
 * 不正タイプ時の動作
 */
function wrongType() {
	se(seWrong);
	document.getElementById('targetFont').innerHTML = "<span style=\"color: blue;\">" + testWord.slice(0, testCharCount) + "</span>" //.fontcolor("blue")
		+ "<span style=\"border-bottom: solid 2px black;\">" + testWord.slice(testCharCount, testCharCount + 1).fontcolor("red") + "</span>"
		+ testWord.slice(testCharCount + 1);
}
/**
 * 正解キーを装飾する
 * @param {*} key 
 */
function decorateCorrectKey(key) {

	if (decoratedKey[0] !== undefined) {
		decoratedKey[0].style = decoratedKey[1];
	}

	const upperKey = key.toUpperCase();
	const obj = document.getElementById("key" + upperKey);
	//装飾するキーとそのスタイルを記録しておく
	decoratedKey[0] = obj;
	decoratedKey[1] = obj.style;

	obj.style.outline = "solid blue";//"solid 5px blue"
	// console.log(typeof obj.style);
	// console.log(typeof obj.style.outline);
}

/**
 * インターバルタイマからコールバックされる
 */
function timerUpdate() {
	let time = Math.floor(((startTime + testTime) - new Date()) / 1000);
	document.getElementById("ClockArea").innerHTML = time;
	if (time <= 0) {
		clearInterval(timerId);
		isEnd = true;
		document.getElementById("targetFont").innerHTML = "Time up!<br>Spaceキーでリセット"
		//■■■きらきらリセット■■■
		kirakiraCount = 0;
		music = [1, 0, 1, 0, 5, 0, 5, 0, 6, 0, 6, 0, 5, 0, 0, 4, 4, 0, 3, 0, 3, 0, 2, 0, 2, 0, 1, 0, 0, 5, 0, 5, 0, 4, 0, 4, 0, 3, 0, 3, 0, 2, 0, 0, 5, 0, 5, 0, 4, 0, 4, 0, 3, 0, 3, 0, 2, 0, 0, 1, 0, 1, 0, 5, 0, 5, 0, 6, 0, 6, 0, 5, 0, 0, 4, 4, 0, 3, 0, 3, 0, 2, 0, 2, 0, 1, 0];
		isKirakira = false;
		totalValidType = 0;
		window.alert(`有効タイピング速度[type/min] : ${(totalValidType * 60000) / testTime}`);
	}
}
/**
 * CapsLockやShift押下時に合わせてキーボードの表示を変更する
 * @param {string} e -キー入力 
 */
function changeKeyCase(e) {
	if (e.getModifierState("CapsLock") === true) {
		isCapsLock = true;
	} else {
		isCapsLock = false;
	}
	isShift = e.shiftKey;

	if (isCapsLock ^ isShift) {
		arrayKeyId1.map(function (id) {
			document.getElementById(id).textContent = id.slice(-1);
		})
	} else {
		arrayKeyId1.map(function (id) {
			document.getElementById(id).textContent = (id.slice(-1)).toLowerCase();
		})
	}

	if (isShift) {
		let i = 0;
		let arraySpKeyContent = ["+", "<", ">", "?"];
		for (const id of arrayKeyId2) {
			document.getElementById(id).textContent = arraySpKeyContent[i];
			i++;
		}
	} else {
		arrayKeyId2.map(function (id) {
			document.getElementById(id).textContent = id.slice(-1);
		}
		)
	}
}

/**
 * きらきらモード時にピアノ音を鳴らす
 */
function kirakira() {
	let num = music.shift();
	if (num !== 0) {
		se(piano[num]);
	}
}

document.addEventListener("keypress", eventKeyPress);
document.addEventListener("keyup", changeKeyCase);
document.addEventListener("keydown", changeKeyCase);
