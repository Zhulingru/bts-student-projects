function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, (c) => {
    const map = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'};
    return map[c] || c;
  });
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
    const safeName = escapeHtml(s.name || '');
    const safeVideoUrl = escapeHtml(s.videoUrl || '');
    const hasVideo = !!(s.videoUrl && s.videoUrl !== '#');

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
        ${hasVideo
          ? `<video class="studentVideo" src="${safeVideoUrl}" preload="metadata" controls playsinline crossorigin="anonymous"></video>`
          : `<div class="studentNoVideo">尚未提供影片</div>`
        }
      </div>
    `;

    if (hasVideo) {
      card.setAttribute('role', 'button');
      card.tabIndex = 0;

      const videoEl = card.querySelector('video');
      const start = () => {
        // Must be triggered by a user gesture; click/keyboard handlers satisfy this.
        if (videoEl && videoEl.paused) videoEl.play().catch(() => {});
      };

      card.addEventListener('click', start);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          start();
        }
      });
    }

    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const className = document.body.getAttribute('data-class') || 'A';
  const students = await loadStudents();
  renderStudentCards(students[className] || [], className);
});

