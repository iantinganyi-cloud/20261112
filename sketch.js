// 宣告全域變數，分別存放「待機」與「走路」的圖片精靈圖檔
let stopSprite;
let walkSprite;

// 定義角色動畫狀態常數與圖片精靈規格物件
const ANIMATIONS = {
  // 待機狀態規格 (10張影格，總寬 1395，高 196)
  stop: {
    frames: 10,
    width: 1395,
    height: 196
  },
  // 走路狀態規格 (9張影格，總寬 1246，高 198)
  walk: {
    frames: 9,
    width: 1246,
    height: 198
  }
};

// 宣告變數記錄目前處於哪種狀態 ('stop' 或 'walk')，預設為 'stop'
let currentState = 'stop';
// 宣告變數記錄角色面對的方向 (1 代表朝右，-1 代表朝左)，預設朝右
let facingDirection = 1;
// 宣告變數記錄角色中心點的 X 座標
let charX;
// 宣告變數記錄目前播放到第幾張影格，初始值為 0
let currentFrame = 0;

// preload 函式會在 setup 之前執行，確保所有圖片資源完全載入後才開始繪製
function preload() {
  // 從指定路徑載入角色 1 的待機圖片精靈檔案
  stopSprite = loadImage('1/stop/stop.png');
  // 從指定路徑載入角色 1 的走路圖片精靈檔案
  walkSprite = loadImage('1/walk/walk.png');
}

// setup 函式在程式開始時執行一次，用來初始化畫布與角色初始位置
function setup() {
  // 建立一個符合瀏覽器視窗寬高的全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 設定動畫播放的幀率為每秒 12 格，讓角色動作呈現流暢的速度
  frameRate(12);
  // 初始化角色 1 的 X 軸中心點位置在整個畫布寬度的 2/3 處
  charX = width * (2 / 3);
}

// draw 函式會不斷重複執行，負責處理鍵盤偵測、位置更新與畫面繪製
function draw() {
  // 設定畫布背景顏色為天空藍色 (RGB 色碼: 135, 206, 235)
  background(135, 206, 235);

  // 依據目前狀態取得對應的圖片精靈物件與規格數據
  let activeSheet = (currentState === 'walk') ? walkSprite : stopSprite;
  let animData = ANIMATIONS[currentState];

  // 計算單張影格的原始寬度 (總寬度除以總張數)
  let frameWidth = animData.width / animData.frames;
  // 取得單張影格的原始高度
  let frameHeight = animData.height;

  // 計算角色 1 在畫布上顯示的目標高度，設定為整個畫布高度的 1/3
  let targetHeight = height / 3;
  // 計算縮放比例：目標顯示高度除以單張原圖高度
  let scaleRatio = targetHeight / frameHeight;
  // 依照縮放比例等比例計算出角色顯示的目標寬度
  let targetWidth = frameWidth * scaleRatio;

  // 設定角色每次更新的移動速度 (依據畫布寬度做響應式比例調整)
  let moveSpeed = width * 0.012;

  // 偵測鍵盤是否持續按住「右方向鍵」
  if (keyIsDown(RIGHT_ARROW)) {
    // 若先前不是走路狀態，切換狀態並將影格歸零避免索引超出範圍
    if (currentState !== 'walk') {
      currentState = 'walk';
      currentFrame = 0;
    }
    // 設定角色面對方向為右邊 (1)
    facingDirection = 1;
    // 將角色 X 座標往右增加
    charX += moveSpeed;

    // 計算角色中心點可到達的最右端邊界 (畫布總寬度減去角色一半寬度)
    let maxRightX = width - (targetWidth / 2);
    // 若角色到達或超過畫布最右端，將其 X 座標固定在最右端 (停止移動，但狀態仍為 walk 繼續播放動畫)
    if (charX > maxRightX) {
      charX = maxRightX;
    }
  } 
  // 偵測鍵盤是否持續按住「左方向鍵」
  else if (keyIsDown(LEFT_ARROW)) {
    // 若先前不是走路狀態，切換狀態並將影格歸零避免索引超出範圍
    if (currentState !== 'walk') {
      currentState = 'walk';
      currentFrame = 0;
    }
    // 設定角色面對方向為左邊 (-1)
    facingDirection = -1;
    // 將角色 X 座標往左減少
    charX -= moveSpeed;

    // 計算角色中心點可到達的最左端邊界 (角色一半寬度)
    let minLeftX = targetWidth / 2;
    // 若角色到達或超過畫布最左端，將其 X 座標固定在最左端 (停止移動，但狀態仍為 walk 繼續播放動畫)
    if (charX < minLeftX) {
      charX = minLeftX;
    }
  } 
  // 若左右鍵皆未按下，則恢復為待機狀態
  else {
    // 若先前不是待機狀態，切換為待機狀態並將影格歸零
    if (currentState !== 'stop') {
      currentState = 'stop';
      currentFrame = 0;
    }
  }

  // 重新取得切換狀態後的最新圖片精靈與規格，確保渲染尺寸精準
  activeSheet = (currentState === 'walk') ? walkSprite : stopSprite;
  animData = ANIMATIONS[currentState];
  frameWidth = animData.width / animData.frames;
  frameHeight = animData.height;
  targetHeight = height / 3;
  scaleRatio = targetHeight / frameHeight;
  targetWidth = frameWidth * scaleRatio;

  // 計算角色 1 左上角的繪製 Y 座標 (畫布總高度減去角色顯示高度，讓角色最底端精準落在畫布最底端)
  let drawY = height - targetHeight;

  // 確保 currentFrame 不會超過當前動畫的總影格數
  currentFrame = currentFrame % animData.frames;
  // 計算目前影格在原始圖片精靈中的 X 軸裁切起點
  let srcX = currentFrame * frameWidth;
  // 原始圖片精靈只有一列，因此 Y 軸裁切起點固定為 0
  let srcY = 0;

  // 使用 push() 保存當前的畫布座標系統設定，避免翻轉影響後續繪圖
  push();
  // 將畫布原點平移到角色 1 的水平中心點 (charX) 與頂端位置 (drawY)
  translate(charX, drawY);
  // 依照面對方向進行水平翻轉 (facingDirection 為 1 時正常顯示，為 -1 時水平鏡像翻轉)
  scale(facingDirection, 1);

  // 因為原點已平移至角色的水平中心，繪製時 X 座標設為 -targetWidth / 2 即可讓圖片水平置中
  image(
    activeSheet,
    -targetWidth / 2,
    0,
    targetWidth,
    targetHeight,
    srcX,
    srcY,
    frameWidth,
    frameHeight
  );
  // 使用 pop() 恢復原本的畫布座標系統設定
  pop();

  // 更新影格索引值，每次加 1 並透過取餘數 (%) 讓動畫持續循環播放
  currentFrame = (currentFrame + 1) % animData.frames;
}

// 當瀏覽器視窗大小改變時自動觸發此函式，實現跨載具的響應式自適應效果
function windowResized() {
  // 記錄視窗縮放前角色在畫布上的相對 X 軸比例 (0.0 ~ 1.0)
  let ratioX = charX / width;
  // 將畫布尺寸重新調整為當前的瀏覽器視窗寬度與高度
  resizeCanvas(windowWidth, windowHeight);
  // 依照原本的相對比例重新計算角色在新視窗中的 X 座標，避免跑出畫面外
  charX = width * ratioX;
}