function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, (c) => {
    const map = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'};
    return map[c] || c;
  });
}

const STUDENT_NAME_MAP = {
  A: {
    '鈴木ももか': '劉恩裴',
    'SMISKI': '蕭霆蕾',
    '伏黑惠': '盧應心',
    'QQ蛋黃史萊姆軟軟': '翁霈恩',
    '齊藤ゆきみ': '曹凱棻',
    'Noah': '徐佑琪',
    'juhoon': '王沛容',
    '青海透真': '湯鎧榳',
    '詭異生物': '陳泳旭',
    '紅色小丸子': '陳星潔',
    '跳舞沒牙': '李羿愷'
  },
  B: {
    '皮卡秋': '蔡忠諺',
    '艾德加': '蔡行一',
    'Lee Wonhee': '吳晨暄',
    '星野露比': '張允薰',
    'emoji guy': '程澈',
    'dio': '賴雋曄',
    '貓貓蟲咖波': '朱恩圻',
    '白小杏': '高可芩',
    '無牙': '姜宜辰',
    '雲寶寶（woonhak)': '林至誼'
  },
  C: {
    '多拉多夢': '俞鴻彥',
    '帥哥機器人': '翁翊扉',
    '咪咪貓貓': '賴宸安',
    '吳柏毅': '張哲語',
    '貓貓': '黃詠甯',
    '藿藿': '吳祈宣',
    '遊戲人偶': '陳郁筌',
    'jo極掃地機': '程紫茵',
    '麻糬小白熊': '林宥鈊',
    '凱特西': '李耘瑍'
  }
};

const IMAGE_EXT_OVERRIDES = {
  A: {
    '蕭霆蕾': 'jpeg'
  },
  C: {
    '賴宸安': 'jpg'
  }
};

function getStudentName(student, className){
  const map = STUDENT_NAME_MAP[className] || {};
  return map[student.avatarName] || student.name || student.avatarName || '學生';
}

function getStudentImageSrc(studentName, className){
  const extMap = IMAGE_EXT_OVERRIDES[className] || {};
  const ext = extMap[studentName] || 'png';
  const folder = `${className}class`;
  return `assets/images/${folder}/${studentName}.${ext}`;
}

async function loadStudents(){
  try{
    const res = await fetch('data/students.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }catch(e){
    // Preview fallback if JSON isn't ready yet
    return {
      A: [
        { id:'a1', name:'學生甲', avatarName:'分身甲', notionUrl:'#' },
        { id:'a2', name:'學生乙', avatarName:'分身乙', notionUrl:'#' },
        { id:'a3', name:'學生丙', avatarName:'分身丙', notionUrl:'#' },
      ],
      B: [
        { id:'b1', name:'學生丁', avatarName:'分身丁', notionUrl:'#' },
        { id:'b2', name:'學生戊', avatarName:'分身戊', notionUrl:'#' },
      ],
      C: [
        { id:'c1', name:'學生己', avatarName:'分身己', notionUrl:'#' },
        { id:'c2', name:'學生庚', avatarName:'分身庚', notionUrl:'#' },
        { id:'c3', name:'學生辛', avatarName:'分身辛', notionUrl:'#' },
      ]
    };
  }
}

function renderStudentCards(students, className){
  const grid = document.getElementById('studentGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!students || students.length === 0){
    grid.innerHTML = `<div class="panel" style="text-align:center; color: var(--muted2); font-weight:900;">${className} 班：尚未載入學生資料</div>`;
    return;
  }

  students.forEach((s) => {
    const studentName = getStudentName(s, className);
    const displayName = s.avatarName || s.name || '分身';
    const safeName = escapeHtml(displayName);
    const imageSrc = getStudentImageSrc(studentName, className);
    const safeImageSrc = escapeHtml(imageSrc);
    const notionUrl = String(s.notionUrl || '').trim();
    const safeNotionUrl = escapeHtml(notionUrl);
    const hasNotion = notionUrl && notionUrl !== '#';

    const card = document.createElement('div');
    card.className = 'studentCard';
    card.innerHTML = `
      <div class="studentTop">
        <div>
          <p class="studentName">${safeName}</p>
        </div>
        <div class="pill">${className} 班</div>
      </div>
      <div class="studentVideoWrap">
        ${hasNotion
          ? `<a class="studentThumbLink" href="${safeNotionUrl}" target="_blank" rel="noopener noreferrer">
              <img class="studentThumb" data-student-id="${escapeHtml(s.id || '')}" src="${safeImageSrc}" alt="${safeName}" loading="lazy" />
            </a>`
          : `<div class="studentNoVideo">尚未提供 Notion 連結</div>`
        }
      </div>
    `;

    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const className = document.body.getAttribute('data-class') || 'A';
  const students = await loadStudents();
  renderStudentCards(students[className] || [], className);
});

