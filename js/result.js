/* ============================================
   Valentine Wrapped 2026 — Result Page Logic
   ============================================ */

(function () {
  'use strict';

  // Load user data
  const data = ValStorage.load();
  if (!data || !data.name1) {
    window.location.href = 'create.html';
    return;
  }

  const { name1, name2, startDate, vibe, memory, trait, photo } = data;
  const stats = calculateStats(startDate);
  const vibeInfo = VIBE_DESCRIPTIONS[vibe] || VIBE_DESCRIPTIONS['classic'];
  const loveLetter = generateLoveLetter(name1, name2, trait);
  const memoryLabel = MEMORY_DESCRIPTIONS[memory] || 'Our Special Moment ✨';

  // All features are free for everyone!

  // ============================================
  // Build Cards
  // ============================================
  const cards = [];

  // Slide 1: Title Card
  cards.push({
    id: 'title',
    free: true,
    html: `
      <div class="wrapped-card card-bg-title">
        <div class="wrapped-card-inner">
          <span class="card-sparkle card-sparkle-1">✨</span>
          <span class="card-sparkle card-sparkle-2">💕</span>
          <span class="card-sparkle card-sparkle-3">✨</span>
          <span class="card-sparkle card-sparkle-4">💖</span>
          <div class="card-title-names">
            <span class="text-gradient">${escapeHtml(name1)}</span>
            <span class="card-title-and">&</span>
            <span class="text-gradient">${escapeHtml(name2)}</span>
          </div>
          <div class="card-title-badge">
            <span>💕</span> Valentine Wrapped 2026
          </div>
          <div class="card-watermark">valentinewrapped.in</div>
        </div>
      </div>
    `
  });

  // Slide 2: Stats Card
  cards.push({
    id: 'stats',
    free: true,
    html: `
      <div class="wrapped-card card-bg-stats">
        <div class="wrapped-card-inner">
          <span class="card-sparkle card-sparkle-1">💫</span>
          <span class="card-sparkle card-sparkle-2">✨</span>
          <p style="font-size:0.75rem; color:var(--text-muted); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:var(--space-xl);">YOUR LOVE IN NUMBERS</p>
          <div class="card-stats-items">
            <div class="stat-item">
              <div class="stat-value text-gradient">${stats.days.toLocaleString()}</div>
              <div class="stat-label">Days of Love</div>
            </div>
            <div class="stats-divider"></div>
            <div class="stat-item">
              <div class="stat-value text-gradient">${stats.hours.toLocaleString()}</div>
              <div class="stat-label">Hours Together</div>
            </div>
            <div class="stats-divider"></div>
            <div class="stat-item">
              <div class="stat-value text-gradient">${stats.sunsets.toLocaleString()}</div>
              <div class="stat-label">Sunsets Shared</div>
            </div>
          </div>
          <div class="card-watermark">valentinewrapped.in</div>
        </div>
      </div>
    `
  });

  // Slide 3: Vibe Card
  cards.push({
    id: 'vibe',
    free: true,
    html: `
      <div class="wrapped-card card-bg-vibe">
        <div class="wrapped-card-inner">
          <span class="card-sparkle card-sparkle-1">✨</span>
          <span class="card-sparkle card-sparkle-4">💫</span>
          <p style="font-size:0.75rem; color:var(--text-muted); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:var(--space-xl);">YOUR COUPLE VIBE</p>
          <div class="card-vibe-emoji">${vibeInfo.emoji}</div>
          <div class="card-vibe-title" style="color:${vibeInfo.color}">${vibeInfo.title}</div>
          <div class="card-vibe-desc">${vibeInfo.desc}</div>
          <div class="card-watermark">valentinewrapped.in</div>
        </div>
      </div>
    `
  });

  // Slide 4: Love Letter
  cards.push({
    id: 'letter',
    free: true,
    html: `
      <div class="wrapped-card card-bg-letter">
        <div class="wrapped-card-inner">
          <span class="card-sparkle card-sparkle-1">💌</span>
          <span class="card-sparkle card-sparkle-2">✨</span>
          <p style="font-size:0.75rem; color:var(--text-muted); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:var(--space-xl);">A LETTER FOR YOU</p>
          <div class="card-letter-quote">
            ${escapeHtml(loveLetter.letter)}
          </div>
          <div class="card-letter-from">— With love, ${escapeHtml(loveLetter.from)} 💕</div>
          <div class="card-watermark">valentinewrapped.in</div>
        </div>
      </div>
    `
  });

  // Slide 5: Photo Card (only if photo exists)
  if (photo) {
    cards.push({
      id: 'photo',
      free: true,
      html: `
        <div class="wrapped-card card-bg-photo">
          <div class="wrapped-card-inner">
            <span class="card-sparkle card-sparkle-1">📸</span>
            <span class="card-sparkle card-sparkle-2">✨</span>
            <p style="font-size:0.75rem; color:var(--text-muted); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:var(--space-lg);">OUR FAVORITE MEMORY</p>
            <div class="card-photo-frame">
              <img src="${photo}" alt="Couple photo">
            </div>
            <div class="card-photo-memory">${memoryLabel}</div>
            <div class="card-watermark">valentinewrapped.in</div>
          </div>
        </div>
      `
    });
  }

  // Slide 6: CTA Card (Always included, free)
  cards.push({
    id: 'cta',
    free: true,
    html: `
      <div class="wrapped-card card-bg-cta">
        <div class="wrapped-card-inner">
          <span class="card-sparkle card-sparkle-1">💕</span>
          <span class="card-sparkle card-sparkle-2">✨</span>
          <span class="card-sparkle card-sparkle-3">💖</span>
          <span class="card-sparkle card-sparkle-4">💫</span>
          <div class="card-cta-heart heartbeat">💕</div>
          <div class="card-cta-text">
            Unwrap Your<br>Love Story Too
          </div>
          <div class="card-cta-site">valentinewrapped.in</div>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:var(--space-xl);">Create yours in 60 seconds ✨</p>
          <div class="card-watermark">Valentine Wrapped 2026 💕</div>
        </div>
      </div>
    `
  });

  // ============================================
  // Render Cards
  // ============================================
  const cardsTrack = document.getElementById('cards-track');
  const dotsContainer = document.getElementById('carousel-dots');

  cards.forEach((card, index) => {
    // Create card slide
    const slide = document.createElement('div');
    slide.className = 'card-slide';
    slide.dataset.cardId = card.id;

    let cardHtml = card.html;

    slide.innerHTML = cardHtml;
    cardsTrack.appendChild(slide);

    // Create dot
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
    dot.dataset.index = index;
    dot.addEventListener('click', () => goToCard(index));
    dotsContainer.appendChild(dot);
  });

  // ============================================
  // Carousel Logic
  // ============================================
  let currentCard = 0;
  const totalCards = cards.length;
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  function goToCard(index) {
    if (index < 0) index = 0;
    if (index >= totalCards) index = totalCards - 1;

    currentCard = index;
    cardsTrack.style.transform = `translateX(-${index * 100}%)`;

    // Update dots
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    // Update arrows visibility
    prevBtn.style.opacity = index === 0 ? '0.3' : '1';
    nextBtn.style.opacity = index === totalCards - 1 ? '0.3' : '1';
  }

  prevBtn.addEventListener('click', () => goToCard(currentCard - 1));
  nextBtn.addEventListener('click', () => goToCard(currentCard + 1));

  // Touch/Swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  cardsTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  cardsTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToCard(currentCard + 1); // Swipe left → next
      else goToCard(currentCard - 1); // Swipe right → prev
    }
  }, { passive: true });

  // Init
  goToCard(0);

  // Set partner name in quiz CTA
  const partnerNameQuiz = document.getElementById('partner-name-quiz');
  if (partnerNameQuiz) partnerNameQuiz.textContent = name2;

  // ============================================
  // Download Card as PNG
  // ============================================
  window.downloadCurrentCard = async function () {
    const cardSlide = document.querySelectorAll('.card-slide')[currentCard];
    const card = cardSlide.querySelector('.wrapped-card');
    if (!card) return;



    showToast('📥 Preparing download...');

    try {
      const canvas = await htmlToCanvas(card);
      downloadCanvas(canvas, `valentine-wrapped-${cards[currentCard].id}.png`);
      showToast('✅ Downloaded!');
    } catch (err) {
      console.error('Download error:', err);
      showToast('❌ Download failed. Try screenshot instead.');
    }
  };

  window.downloadAllCards = async function () {
    showToast('📦 Preparing all cards...');

    for (let i = 0; i < cards.length; i++) {


      const cardSlide = document.querySelectorAll('.card-slide')[i];
      const card = cardSlide.querySelector('.wrapped-card');
      if (!card) continue;

      try {
        const canvas = await htmlToCanvas(card);
        downloadCanvas(canvas, `valentine-wrapped-${i + 1}-${cards[i].id}.png`);
        // Small delay between downloads
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        console.error(`Error downloading card ${i}:`, err);
      }
    }

    showToast('✅ All cards downloaded!');
  };

  // ============================================
  // HTML to Canvas (Simple Implementation)
  // ============================================
  async function htmlToCanvas(element) {
    // Use manual canvas drawing at proper 1080x1920 Instagram Story resolution
    // (html2canvas captures the narrow mobile DOM layout, producing bad output)
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    // Find which card this element belongs to
    let cardIndex = currentCard;
    const allSlides = document.querySelectorAll('.card-slide');
    for (let i = 0; i < allSlides.length; i++) {
      if (allSlides[i].contains(element)) {
        cardIndex = i;
        break;
      }
    }

    await drawCardManually(ctx, cards[cardIndex]);
    return canvas;
  }

  // ============================================
  // Manual Canvas Drawing (Fallback)
  // ============================================
  async function drawCardManually(ctx, cardData) {
    const w = 1080;
    const h = 1920;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0a0612');
    grad.addColorStop(0.4, '#1a0a2e');
    grad.addColorStop(0.7, '#2d1045');
    grad.addColorStop(1, '#0a0612');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Sparkles
    ctx.font = '40px serif';
    ctx.textAlign = 'left';
    ctx.fillText('✨', 120, 200);
    ctx.fillText('💕', 900, 180);
    ctx.fillText('✨', 100, 1700);
    ctx.fillText('💖', 930, 1680);

    if (cardData.id === 'title') {
      ctx.textAlign = 'center';

      // Names
      ctx.font = 'bold 80px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#e8436a';
      ctx.fillText(name1, w / 2, h / 2 - 120);

      ctx.font = '70px "Dancing Script", cursive';
      ctx.fillStyle = '#ff6b8a';
      ctx.fillText('&', w / 2, h / 2 - 30);

      ctx.font = 'bold 80px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#e8436a';
      ctx.fillText(name2, w / 2, h / 2 + 70);

      // Badge
      ctx.font = '30px "Inter", sans-serif';
      ctx.fillStyle = '#ff6b8a';
      ctx.fillText('💕 Valentine Wrapped 2026', w / 2, h / 2 + 200);

    } else if (cardData.id === 'stats') {
      ctx.textAlign = 'center';
      ctx.font = '28px "Inter", sans-serif';
      ctx.fillStyle = '#666';
      ctx.fillText('YOUR LOVE IN NUMBERS', w / 2, 400);

      ctx.font = 'bold 120px "Playfair Display", serif';
      ctx.fillStyle = '#e8436a';
      ctx.fillText(stats.days.toLocaleString(), w / 2, 700);
      ctx.font = '32px "Inter", sans-serif';
      ctx.fillStyle = '#aaa';
      ctx.fillText('Days of Love', w / 2, 760);

      ctx.font = 'bold 100px "Playfair Display", serif';
      ctx.fillStyle = '#ff6b8a';
      ctx.fillText(stats.hours.toLocaleString(), w / 2, 1050);
      ctx.font = '32px "Inter", sans-serif';
      ctx.fillStyle = '#aaa';
      ctx.fillText('Hours Together', w / 2, 1110);

      ctx.font = 'bold 100px "Playfair Display", serif';
      ctx.fillStyle = '#ff9ecd';
      ctx.fillText(stats.sunsets.toLocaleString(), w / 2, 1400);
      ctx.font = '32px "Inter", sans-serif';
      ctx.fillStyle = '#aaa';
      ctx.fillText('Sunsets Shared', w / 2, 1460);

    } else if (cardData.id === 'vibe') {
      ctx.textAlign = 'center';
      ctx.font = '28px "Inter", sans-serif';
      ctx.fillStyle = '#666';
      ctx.fillText('YOUR COUPLE VIBE', w / 2, 450);

      ctx.font = '160px serif';
      ctx.fillText(vibeInfo.emoji, w / 2, 750);

      ctx.font = 'bold 60px "Playfair Display", serif';
      ctx.fillStyle = vibeInfo.color;
      ctx.fillText(vibeInfo.title, w / 2, 920);

      ctx.font = '32px "Inter", sans-serif';
      ctx.fillStyle = '#ccc';
      wrapText(ctx, vibeInfo.desc, w / 2, 1020, 800, 46);

    } else if (cardData.id === 'letter') {
      ctx.textAlign = 'center';
      ctx.font = '28px "Inter", sans-serif';
      ctx.fillStyle = '#666';
      ctx.fillText('A LETTER FOR YOU', w / 2, 450);

      // Quote mark
      ctx.textAlign = 'left';
      ctx.font = '200px "Playfair Display", serif';
      ctx.fillStyle = 'rgba(232, 67, 106, 0.2)';
      ctx.fillText('"', 200, 700);

      // Letter text with wrapping
      ctx.textAlign = 'center';
      ctx.font = '48px "Dancing Script", cursive';
      ctx.fillStyle = '#ffffff';
      wrapText(ctx, loveLetter.letter, w / 2, 800, 800, 65);

      // From
      ctx.font = 'italic 34px "Inter", sans-serif';
      ctx.fillStyle = '#ff6b8a';
      ctx.fillText(`— With love, ${name1} 💕`, w / 2, 1400);

    } else if (cardData.id === 'photo' && photo) {
      ctx.textAlign = 'center';
      ctx.font = '28px "Inter", sans-serif';
      ctx.fillStyle = '#666';
      ctx.fillText('OUR FAVORITE MEMORY', w / 2, 450);

      // Load and draw photo
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = photo;
        });

        // Draw photo centered with rounded border effect
        const photoSize = 500;
        const photoX = (w - photoSize) / 2;
        const photoY = 550;
        const cornerR = 30;

        // Photo border glow
        ctx.save();
        ctx.shadowColor = 'rgba(232, 67, 106, 0.4)';
        ctx.shadowBlur = 40;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.roundRect(photoX - 6, photoY - 6, photoSize + 12, photoSize * 1.2 + 12, cornerR + 4);
        ctx.fill();
        ctx.restore();

        // Clip and draw photo
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(photoX, photoY, photoSize, photoSize * 1.2, cornerR);
        ctx.clip();
        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;
        const scale = Math.max(photoSize / imgW, (photoSize * 1.2) / imgH);
        const drawW = imgW * scale;
        const drawH = imgH * scale;
        ctx.drawImage(img,
          photoX + (photoSize - drawW) / 2,
          photoY + (photoSize * 1.2 - drawH) / 2,
          drawW, drawH);
        ctx.restore();

        // Border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(photoX, photoY, photoSize, photoSize * 1.2, cornerR);
        ctx.stroke();
      } catch (e) {
        // Photo failed to load, show placeholder
        ctx.font = '80px serif';
        ctx.fillText('📸', w / 2, 800);
      }

      // Memory label
      ctx.font = '40px "Dancing Script", cursive';
      ctx.fillStyle = '#ff9ecd';
      ctx.fillText(memoryLabel, w / 2, 1250);

    } else if (cardData.id === 'cta') {
      ctx.textAlign = 'center';

      // Heart
      ctx.font = '120px serif';
      ctx.fillText('💕', w / 2, h / 2 - 200);

      // CTA text
      ctx.font = 'bold 64px "Playfair Display", serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Unwrap Your', w / 2, h / 2 - 40);
      ctx.fillText('Love Story Too', w / 2, h / 2 + 40);

      // Site
      ctx.font = '34px "Inter", sans-serif';
      ctx.fillStyle = '#ff6b8a';
      ctx.fillText('valentinewrapped.in', w / 2, h / 2 + 160);

      // Sub text
      ctx.font = '26px "Inter", sans-serif';
      ctx.fillStyle = '#888';
      ctx.fillText('Create yours in 60 seconds ✨', w / 2, h / 2 + 240);

    } else {
      // Generic fallback
      ctx.textAlign = 'center';
      ctx.font = 'bold 60px "Playfair Display", serif';
      ctx.fillStyle = '#e8436a';
      ctx.fillText('Valentine Wrapped', w / 2, h / 2 - 40);
      ctx.font = '36px "Inter", sans-serif';
      ctx.fillStyle = '#ff6b8a';
      ctx.fillText('2026', w / 2, h / 2 + 30);
    }

    // Watermark
    ctx.font = '24px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.textAlign = 'center';
    ctx.fillText('valentinewrapped.in', w / 2, h - 60);
  }

  // ============================================
  // Text Wrapping Helper
  // ============================================
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[i] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
  }

  // ============================================
  // Download Canvas as PNG
  // ============================================
  function downloadCanvas(canvas, filename) {
    // Use toBlob instead of toDataURL — works reliably on mobile
    // (toDataURL creates huge strings that can crash mobile browsers)
    canvas.toBlob(function (blob) {
      if (!blob) {
        showToast('❌ Download failed. Try screenshot instead.');
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Revoke after a delay to ensure download starts
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }, 'image/png', 1.0);
  }

  // ============================================
  // Share Functions
  // ============================================
  const INSTAGRAM_CAPTION = `Our love, wrapped 💕✨

${stats.days} days of love, ${stats.hours.toLocaleString()} hours together.
We are ${vibeInfo.title}

Create yours → valentinewrapped.in

#ValentineWrapped #ValentineWrapped2026 #Valentine2026 #CoupleGoals #LoveStory`;

  window.copyCaption = function () {
    navigator.clipboard.writeText(INSTAGRAM_CAPTION).then(() => {
      showToast('📋 Caption copied! Paste on Instagram');
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = INSTAGRAM_CAPTION;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('📋 Caption copied!');
    });
  };

  window.shareWhatsApp = function () {
    const text = encodeURIComponent(`Hey! Check out our Valentine Wrapped 💕\n${stats.days} days of love together ✨\n\nCreate yours too → valentinewrapped.in\n\n#ValentineWrapped2026`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  window.shareInstagram = async function () {

    const cardSlide = document.querySelectorAll('.card-slide')[currentCard];
    const card = cardSlide.querySelector('.wrapped-card');
    if (!card) return;

    showToast('📸 Preparing for Instagram...');

    try {
      const canvas = await htmlToCanvas(card);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
      const file = new File([blob], `valentine-wrapped-${cards[currentCard].id}.png`, {
        type: 'image/png'
      });

      const isMob = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      // Web Share API with only the file — this lets user pick Instagram Stories
      if (isMob && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file] });
          showToast('✅ Shared to Instagram!');
          return;
        } catch (err) {
          if (err.name === 'AbortError') return;
        }
      }

      // Fallback: download
      downloadCanvas(canvas, `valentine-wrapped-${cards[currentCard].id}.png`);
      if (isMob) {
        showToast('📥 Card saved! Open Instagram → Your Story → Select image');
      } else {
        showToast('📥 Card downloaded! Open Instagram on your phone to share');
      }
    } catch (err) {
      console.error('Share error:', err);
      showToast('❌ Failed. Try downloading the card instead.');
    }
  };

  window.copyLink = function () {
    navigator.clipboard.writeText('https://valentinewrapped.in').then(() => {
      showToast('🔗 Link copied!');
    }).catch(() => {
      showToast('🔗 valentinewrapped.in');
    });
  };



  // ============================================
  // Toast
  // ============================================
  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    toastMsg.textContent = message;
    toast.style.display = 'block';
    toast.style.animation = 'none';
    toast.offsetHeight; // Force reflow
    toast.style.animation = 'fadeInUp 0.3s ease-out forwards';

    setTimeout(() => {
      toast.style.display = 'none';
    }, 2500);
  }

  // ============================================
  // Escape HTML
  // ============================================
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

})();
