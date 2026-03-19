// 1. 建立一個圖片元素
const pet = document.createElement("img");
// pet.src = chrome.runtime.getURL("images/pet.gif"); // 這裡可以換成任何透明背景的 GIF
pet.src = chrome.runtime.getURL("images/pet.gif"); // 這裡可以換成任何透明背景的 GIF
pet.style.cssText = `
  position: fixed;
  width: 80px;
  z-index: 999999;
  transition: all 0.5s ease-out;
  pointer-events: auto;
  cursor: pointer;
  top: 50%;
  left: 50%;
`;
document.body.appendChild(pet);

let nowX = Math.random() * (window.innerWidth - 30);
let nowY = Math.random() * (window.innerHeight - 30);
let dx = (Math.random() - 0.5) * 5;
let dy = (Math.random() - 0.5) * 5;

// 設定正常走路的最大速度
const normalMaxSpeed = 3;
// 設定逃跑時的最大速度
const escapeMaxSpeed = 25;
// 目前的速限（會動態變化）
let currentMaxSpeed = normalMaxSpeed;

function movePet() {
  // 1. 隨機晃動
  dx += (Math.random() - 0.5) * 2;
  dy += (Math.random() - 0.5) * 2;

  // 2. 【核心修改】阻力機制：如果現在跑很快，就讓速度慢慢降下來
  if (currentMaxSpeed > normalMaxSpeed) {
    currentMaxSpeed *= 0.95; // 每次執行減慢 5%
  } else {
    currentMaxSpeed = normalMaxSpeed;
  }

  // 3. 根據當前的速限來限制 dx, dy
  dx = Math.max(Math.min(dx, currentMaxSpeed), -currentMaxSpeed);
  dy = Math.max(Math.min(dy, currentMaxSpeed), -currentMaxSpeed);

  nowX += dx;
  nowY += dy;

  // 4. 邊界檢查 (維持原樣)
  const maxX = window.innerWidth - 100;
  const maxY = window.innerHeight - 100;
  if (nowX <= 0) {
    nowX = 0;
    dx *= -1;
  }
  if (nowX >= maxX) {
    nowX = maxX;
    dx *= -1;
  }
  if (nowY <= 0) {
    nowY = 0;
    dy *= -1;
  }
  if (nowY >= maxY) {
    nowY = maxY;
    dy *= -1;
  }

  // 5. 更新位置與旋轉
  pet.style.left = `${nowX}px`;
  pet.style.top = `${nowY}px`;

  // 速度越快，轉得越誇張
  const rotation = (Math.random() - 0.5) * (currentMaxSpeed * 10);
  pet.style.transform = `rotate(${rotation}deg)`;
}

// 頻率維持 50ms 左右比較流暢
setInterval(movePet, 50);

// 6. 逃跑邏輯：瞬間提高速限與速度
pet.addEventListener("mouseover", () => {
  // 提高速限上限
  currentMaxSpeed = escapeMaxSpeed;

  // 給予一個爆發衝力 (朝滑鼠相反方向)
  // 這裡簡單判定：在左半邊就往右噴，在右半邊就往左噴
  dx = (nowX < window.innerWidth / 2 ? 1 : -1) * escapeMaxSpeed;
  dy = (nowY < window.innerHeight / 2 ? 1 : -1) * escapeMaxSpeed;
});
