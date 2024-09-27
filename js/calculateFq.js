const pi = 3.14159265358979;

//共通の値を取得する関数
function getValues() {
  // 実験回路の選択を取得(getLは関数リテラル)
  let getL = () => {
    let circuit = document.getElementById("circuit-select").value;
    return circuit == "A" ? 29.4 : 30.0;
  };
  // //突然Str型としてrlが認識される事があったため、parseFloat()してる。
  const l = getL() * Math.pow(10, -3);
  // //抵抗r1の値を取得
  const r1 = parseFloat(document.getElementById("r1Value").value);
  // //抵抗rlの値を取得
  const rl = parseFloat(document.getElementById("rlValue").value);
  // //コンデンサ容量を取得
  const c = parseFloat(document.getElementById("cValue").value) * Math.pow(10, -9);
  // //可変抵抗の値を取得
  const r2 = parseFloat(document.getElementById("r2Value").value);
  //リストで返す
  return [l, r1, rl, r2, c];
}

//小数の演算時の誤差を修正するために小数点の位置を探索するメソッド
//参考:https://qiita.com/k_moto/items/0b576a3351b77fb0aa98
function getDotPosition(value) {
  //一度数値を文字列化
  const strValue = String(value);
  //小数点の位置の初期化
  let dotPosition = 0;
  //小数点の位置を取得(ない場合-1)
  const whereDot = strValue.lastIndexOf('.');
  //小数点が存在する時位置を取得
  if (whereDot != -1) {
    dotPosition = (strValue.length - 1) - whereDot;
  }
  //小数点の位置を返す
  return dotPosition;
}

//加算(小数の計算の誤差を修正したもの)
function addValue(value1, value2) {
  //それぞれの値の小数点の位置を取得
  const dotPosition1 = getDotPosition(value1);
  const dotPosition2 = getDotPosition(value2);
  //小数点以下の位が大きい方の位置を取得
  const maxPosition = Math.max(dotPosition1, dotPosition2);

  //大きい方に小数の桁を合わせて文字列化し、小数点を除いて整数にする
  const intValue1 = parseInt((value1.toFixed(maxPosition) + '').replace('.', ''));
  const intValue2 = parseInt((value2.toFixed(maxPosition) + '').replace('.', ''));

  //最後に割る値を計算
  const div = Math.pow(10, maxPosition);

  //整数値で足し算した後、10^Nで割る
  return (intValue1 + intValue2) / div;
}


function calculateSeriesFq() {
  //共通の値を取得
  const [l, r1, rl, r2, c] = getValues();
  //直列回路の共振周波数を計算する
  const seriesFq = 1 / (2 * pi * Math.sqrt(l * c));
  //innerTextでHTMLに表示する
  target = document.getElementById("seriesResult");
  target.innerText = seriesFq.toPrecision(7) + "Hz";
}

function calculateParallelFq() {
  //共通の値を取得
  const [l, r1, rl, r2, c] = getValues();
  //Rの計算
  const R = addValue(rl, r2);
  //f0の計算
  const parallelf0 = Math.sqrt(1 / (l * c) - (R * R) / (l * l)) / (2 * pi);
  const parallelfmin =
    Math.sqrt(
      Math.sqrt(1 + (2 * c * R * R) / l) / (l * c) - (R * R) / (l * l)
    ) /
    (2 * pi);
  /*出力 */
  target1 = document.getElementById("parallelF0Result");
  target2 = document.getElementById("parallelFminResult");
  target1.innerText = parallelf0.toPrecision(7) + "Hz";
  target2.innerText = parallelfmin.toPrecision(7) + "Hz";
}
