// プラグイン登録
gsap.registerPlugin(ScrollTrigger);

const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobile-nav");

hamburger.addEventListener('click', function(){
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
});

document.querySelectorAll('.nav__item').forEach(item => {
    item.addEventListener('click', function() {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
    });
});



// 全ての読み込み完了後に実行
window.addEventListener("load", function() {
  
  // ------------------------------------------
  // 1. ヒーローエリア（変更なし）
  // ------------------------------------------
  const tl = gsap.timeline();
  tl.from(".hero-container", {
    opacity: 0,
    duration: 2.0,
    ease: "power2.out"
  })
  .from(".hero__title", {
    opacity: 0,
    y: 30,
    duration: 1.5,
    ease: "power2.out"
  }, "-=1.0");


  // ------------------------------------------
  // 2. 商品ラインナップ（書き方を変えました！）・・・ただお手本のほうが上手かも。
  // ------------------------------------------
  
  // ① まず、JSで強制的に「透明＆少し下」の状態にする（セットアップ）
  gsap.set(".product-link", { 
    opacity: 0, 
    y: 40 
  });

  // ② 「今の状態（透明）」から「本来の状態（不透明）」へアニメーションさせる
  gsap.to(".product-link", {
    scrollTrigger: {
      trigger: ".product-list", // リスト全体が
      start: "top bottom",      // 画面の下端に入ってきたら
      toggleActions: "play none none none", // 一度再生したら、戻っても何もしない（出しっぱなし）
      // markers: true,         // テスト用（確認できたら削除）
    },
    opacity: 1,        // 見えるようにする
    y: 0,              // 本来の位置に戻す
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.15       // 順番に
  });
  
  // 最後に位置計算をリフレッシュ
  ScrollTrigger.refresh();
});

// ------------------------------------------
  // 3. 私たちの家具（About） - ストーリーテリングアニメーション
  // ------------------------------------------

  // 【準備】テキストを一文字ずつ span タグで囲む関数
  const wrapCharSpan = function(element) {
    // 元のHTML（<br>などが含まれる）を取得
    const text = element.innerHTML;
    
    // <br>タグで一度分割し、行ごとに処理する（改行を維持するため）
    const lines = text.split(/<br\s*\/?>/i);
    
    // 各行を一文字ずつspanで囲んで再構築
    const newHtml = lines.map(line => {
      return line.split('').map(char => {
        // 空白文字の場合はそのまま、文字の場合はspanで囲む
        return (char.trim() === '') ? char : `<span class="char">${char}</span>`;
      }).join('');
    }).join('<br>'); // <br>で再びつなぐ

    element.innerHTML = newHtml;
  }

  // 対象となるテキスト要素（見出しと本文）を取得
  const textElements = document.querySelectorAll(".about__headline, .about__text");

  // それぞれの要素に対して処理を実行
  textElements.forEach(element => {
    // 1. 関数を実行して、文字をバラバラにする
    wrapCharSpan(element);

    // 2. バラバラになった文字たち（.char）を取得
    const chars = element.querySelectorAll(".char");

    // 3. アニメーション設定（定石の set -> to パターン）
    
    // 初期状態：透明にして、少しぼかしを入れる（回想シーンのような演出）
    gsap.set(chars, { 
      opacity: 0, 
      filter: "blur(4px)" // ぼかしを入れると、より「物語」っぽくなります
    });

    // アニメーション実行
    gsap.to(chars, {
      scrollTrigger: {
        trigger: element,      // その文章が見えたら
        start: "top 80%",      // 画面の下の方に来たら開始
        toggleActions: "play none none none",
      },
      opacity: 1,
      filter: "blur(0px)",     // ぼかしをなくしてくっきりさせる
      duration: 1.0,           // 1文字にかかる時間
      ease: "power2.out",
      stagger: 0.05            // 0.08秒ごとに次の文字を表示（語るような速度）
    });
  });