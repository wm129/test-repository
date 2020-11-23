'use strict';

(() => {
    //手の種類を数に置き換え　html buttonタグのvalue属性で定義
    const HAND_FORMS = [
        0,//value="1" => グーvalue="2" => チョキvalue="0" => パー
        1,
        2
    ];

    //image/script.png(画像)を切り取って使う
    // それぞれの手のx座標を指定
    const HAND_X = [
        0,
        380,
        750
    ];
    // images/sprite.png(グーチョキパーの画像)を切り取って使う際に
    // それぞれの手のwidth(横幅)を指定している。
    const HAND_WIDTH = [
        360,
        340,
        430
    ];
    const IMAGE_PATH = './images/sprite.png';
    // 1秒間で60コマ（フレーム）のアニメーションを行う
    // ここの値が大きいほど手の切り替わりスピードが早くなる
    // 例:
    // - FPSの値が1: 1秒に1回手が切り替わる
    // - FPSの値が10: 1秒に10回手が切り替わる
    // - FPSの値が60: 1秒に60回手が切り替わる
    const FPS = 10;
    // loop関数内で呼び出しているdraw関数の実行をするかしないかを切り分けているフラグ
    // グー・チョキ・パーのいずれかのボタンが押された時にtrueになる。(onClick関数を参照)
    let isPause = false;
    // draw関数が実行されるたびに1増える(インクリメント)
    // currentFrameの値を剰余算演算子(%)を使い出たあまりを使うことで、
    // 表示される手の形を決める。
    // 今回の場合は手の形は3つ(HAND_FORMS.length)なので
    // 値は必ず0, 1, 2のいずれかとなる。
    // 例:
    // currentFrameが30のとき: 30 % 3 => 0 => HAND_FORMS[0] => グー
    // currentFrameが31のとき: 30 % 3 => 1 => HAND_FORMS[1] => チョキ
    // currentFrameが32のとき: 30 % 3 => 2 => HAND_FORMS[2] => パー
    let currentFrame = 0;

    /**
   * 実際にアニメーションを開始させる処理
        */
    function main() {
        const canvas = document.getElementById('screen');
        const context = canvas.getContext('2d');
        const imageObj = new Image();
        currentFrame = 0;
        //画像の読み込みが完了したら
        //loop関数の無限ループを実行
        imageObj.onload = function () {
            function loop() {
                if (!isPause) {
                    draw(canvas, context, imageObj, currentFrame++);
                }
                // 指定した時間が経過したらloop関数を呼び出す。
                // 関数自身を呼び出す関数のことを再帰関数という。
                //
                // 例: FPSの値に応じてloop関数が実行される時間間隔が変わる
                // FPSが60 => 1000/60 => 16.666 => 0.016秒後にloop関数を実行 => 0.016秒毎に1回手が切り替わる
                // FPSが10 => 1000/10 => 100 => 0.1秒後にloop関数を実行 => 0.1秒毎に1回手が切り替わる
                // FPSが1 => 1000/1 => 1000 => 1秒後にloop関数を実行 => 1秒毎に1回手が切り替わる
                setTimeout(loop, 1000 / FPS);
            }
            loop();
        };
        imageObj.src = IMAGE_PATH;
    }
    /*グー・チョキ・パー画像から手の形を切り取る
       *@param {*} canvas HTMLのcanvas要素
       * @param {*} context canvasから取得した値。この値を使うことでcanvasに画像や図形を描画することが出来る
       * @param {*} imageObject 画像データ。
       * @param {*} frame 現在のフレーム数(コマ数)。フレーム % HAND_FORMS.lengthによって0(グー), 1(チョキ), 2(パー)を決める
       */
    function draw(canvas, context, imageObject, frame) {
        /* canvas をJavaScriptを使って画像の切り替えをおこなう
        最初にcanvasをまっさらな状態にする
        クリア作業を行い以前に描写した画像を残さないようにする*/
        context.clearRect(0, 0, canvas.width, canvas.height);
        //0: グー　1: チョキ　2: パー
        const handIndex = frame % HAND_FORMS.length;
        const sx = HAND_X[handIndex];
        const swidth = HAND_WIDTH[handIndex];

        //画像のｘ座標sxと指定した手の横幅を使って
        //グーチョキパーの画像から特定の手の形を切り取る
        context.drawImage(
            imageObject,
            sx,
            0,
            swidth,
            imageObject.height,
            0,
            0,
            swidth,
            canvas.height
        );
    }
    /*
    ボタンクリック時の処理の定義をまとめて行う関数
    */
    function setButtonAction() {
        const rock = document.getElementById('rock');
        const scissors = document.getElementById('scissors');
        const paper = document.getElementById('paper');
        const restart = document.getElementById('restart');
        function onClick(event) {
            const myHandType = parseInt(event.target.value, 10);
            const enemyHandType = parseInt(currentFrame % HAND_FORMS.length, 10);
            isPause = true;
            judge(myHandType, enemyHandType);
        }
        // グー・チョキ・パーボタンを押したときの処理をonClick関数で共通化
        rock.addEventListener('click', onClick);
        scissors.addEventListener('click', onClick);
        paper.addEventListener('click', onClick);
        //再開ボタンをおしたときブラウザをリロードする
        restart.addEventListener('click', function () {
            window.location.reload();
        });
    }
    // 自分の手の値(0~2のいずれか)と相手の手の値(0~2のいずれか)を使って計算を行い
    // 値に応じて勝ち・負け・引き分けを判断して、アラートに結果を表示する。
    function judge(myHandType, enemyHandType) {
        // 0: 引き分け, 1: 負け, 2: 勝ち
        // じゃんけんの勝敗判定のアルゴリズム: https://qiita.com/mpyw/items/3ffaac0f1b4a7713c869
        const result = (myHandType - Math.abs(enemyHandType) + 3) % HAND_FORMS.length;

        if (result === 0) {
            alert('引き分けです!');
        } else if (result === 1) {
            alert('あなたの負けです!');
        } else {
            alert('あなたの勝ちです!');
        }
    }

    // ボタンクリック時の処理の定義を行ってから、アニメーションを開始する
    setButtonAction();
    main();
})();
