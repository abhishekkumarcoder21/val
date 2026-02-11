/* ============================================
   Valentine Wrapped 2026 — Animated Video Card
   Canvas animation + MediaRecorder video export
   ============================================ */

(function () {
    'use strict';

    // Load data
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

    // Canvas
    const canvas = document.getElementById('video-canvas');
    const ctx = canvas.getContext('2d');
    const W = 1080;
    const H = 1920;

    // Animation state
    let animFrame = null;
    let startTime = 0;
    let isPlaying = false;
    const DURATION = 14000; // 14 seconds (extended for photo section)

    // ============================================
    // Load Photo Image
    // ============================================
    let photoImg = null;
    let photoLoaded = false;

    if (photo) {
        photoImg = new Image();
        photoImg.crossOrigin = 'anonymous';
        photoImg.onload = () => { photoLoaded = true; drawStaticPreview(); };
        photoImg.onerror = () => { photoLoaded = false; photoImg = null; };
        photoImg.src = photo;
    }

    // ============================================
    // Floating Particles (Hearts & Gifts)
    // ============================================
    const PARTICLE_EMOJIS = ['❤️', '💕', '💖', '🌹', '💗', '🎁', '✨', '💝', '🫶', '💐', '🎀', '💌', '🥰', '💘'];
    const particles = [];

    function initParticles() {
        particles.length = 0;
        for (let i = 0; i < 30; i++) {
            particles.push(createParticle(true));
        }
    }

    function createParticle(randomY) {
        return {
            x: Math.random() * W,
            y: randomY ? Math.random() * H : H + 40 + Math.random() * 200,
            size: 20 + Math.random() * 30,
            speed: 0.5 + Math.random() * 1.5,
            wobbleSpeed: 0.002 + Math.random() * 0.003,
            wobbleAmp: 20 + Math.random() * 40,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.02,
            opacity: 0.15 + Math.random() * 0.35,
            emoji: PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)],
            phase: Math.random() * Math.PI * 2
        };
    }

    function updateParticles(elapsed) {
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.y -= p.speed;
            p.x += Math.sin(elapsed * p.wobbleSpeed + p.phase) * 0.5;
            p.rotation += p.rotSpeed;

            // Respawn at bottom when goes above top
            if (p.y < -60) {
                particles[i] = createParticle(false);
            }
        }
    }

    function drawParticles() {
        for (const p of particles) {
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.font = `${p.size}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.emoji, 0, 0);
            ctx.restore();
        }
    }

    // ============================================
    // Background
    // ============================================
    function drawBackground() {
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#0a0612');
        grad.addColorStop(0.25, '#140a22');
        grad.addColorStop(0.5, '#1f0d35');
        grad.addColorStop(0.75, '#2d1045');
        grad.addColorStop(1, '#0a0612');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Ambient glow orbs
        drawGlowOrb(850, 300, 200, 'rgba(232, 67, 106, 0.12)');
        drawGlowOrb(200, 1200, 180, 'rgba(107, 92, 231, 0.1)');
        drawGlowOrb(700, 1600, 150, 'rgba(255, 158, 205, 0.08)');
    }

    function drawGlowOrb(x, y, radius, color) {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // ============================================
    // Text Helpers
    // ============================================
    function drawText(text, x, y, font, color, alpha, align) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = align || 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    function drawTextGradient(text, x, y, font, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const m = ctx.measureText(text);
        const grad = ctx.createLinearGradient(x - m.width / 2, y, x + m.width / 2, y);
        grad.addColorStop(0, '#e8436a');
        grad.addColorStop(0.5, '#ff6b8a');
        grad.addColorStop(1, '#ff9ecd');
        ctx.fillStyle = grad;
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    function wrapText(text, x, y, maxWidth, lineHeight, font, color, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const words = text.split(' ');
        let line = '';
        let currentY = y;
        const lines = [];

        for (const word of words) {
            const testLine = line + word + ' ';
            if (ctx.measureText(testLine).width > maxWidth && line) {
                lines.push(line.trim());
                line = word + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line.trim());

        // Center vertically
        const totalHeight = lines.length * lineHeight;
        currentY = y - totalHeight / 2 + lineHeight / 2;

        for (const l of lines) {
            ctx.fillText(l, x, currentY);
            currentY += lineHeight;
        }
        ctx.restore();
    }

    // ============================================
    // Easing Functions
    // ============================================
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    function clamp01(t) {
        return Math.max(0, Math.min(1, t));
    }

    // Fade in from startMs over durationMs
    function fadeIn(elapsed, startMs, durationMs) {
        return easeOutCubic(clamp01((elapsed - startMs) / durationMs));
    }

    // Slide up + fade in
    function slideUp(elapsed, startMs, durationMs, distance) {
        const t = easeOutCubic(clamp01((elapsed - startMs) / durationMs));
        return {
            alpha: t,
            offsetY: (1 - t) * (distance || 50)
        };
    }

    // ============================================
    // Counter Animation Helper
    // ============================================
    function animateValue(elapsed, startMs, durationMs, endVal) {
        const t = easeOutCubic(clamp01((elapsed - startMs) / durationMs));
        return Math.floor(t * endVal);
    }

    // ============================================
    // Draw Divider Line
    // ============================================
    function drawDivider(x, y, width, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        const grad = ctx.createLinearGradient(x - width / 2, y, x + width / 2, y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.2, '#e8436a');
        grad.addColorStop(0.5, '#ff6b8a');
        grad.addColorStop(0.8, '#e8436a');
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - width / 2, y);
        ctx.lineTo(x + width / 2, y);
        ctx.stroke();
        ctx.restore();
    }

    // ============================================
    // Draw Photo with Animated Love Border
    // ============================================
    function drawPhotoFrame(cx, cy, size, elapsed, alpha, animStartMs) {
        if (!photoImg || !photoLoaded) return;

        const halfSize = size / 2;
        const cornerR = 24;
        const t = (elapsed - animStartMs) / 1000; // time in seconds since photo appeared

        ctx.save();
        ctx.globalAlpha = alpha;

        // === Outer glow (pulsing) ===
        const glowPulse = 0.5 + 0.3 * Math.sin(t * 2.5);
        const glowSize = size + 40;
        const glowGrad = ctx.createRadialGradient(cx, cy, size * 0.3, cx, cy, glowSize);
        glowGrad.addColorStop(0, `rgba(232, 67, 106, ${0.15 * glowPulse})`);
        glowGrad.addColorStop(0.5, `rgba(255, 107, 138, ${0.08 * glowPulse})`);
        glowGrad.addColorStop(1, 'rgba(232, 67, 106, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // === Love border frame (gradient border) ===
        const borderW = 6;
        const borderGrad = ctx.createLinearGradient(cx - halfSize, cy - halfSize, cx + halfSize, cy + halfSize);
        borderGrad.addColorStop(0, '#e8436a');
        borderGrad.addColorStop(0.3, '#ff6b8a');
        borderGrad.addColorStop(0.6, '#ff9ecd');
        borderGrad.addColorStop(1, '#e8436a');
        ctx.strokeStyle = borderGrad;
        ctx.lineWidth = borderW;
        ctx.beginPath();
        ctx.roundRect(cx - halfSize - borderW, cy - halfSize - borderW,
            size + borderW * 2, size + borderW * 2, cornerR + 4);
        ctx.stroke();

        // === Draw the photo (clipped to rounded rect) ===
        ctx.beginPath();
        ctx.roundRect(cx - halfSize, cy - halfSize, size, size, cornerR);
        ctx.clip();

        // Scale & center-crop the photo
        const imgW = photoImg.naturalWidth;
        const imgH = photoImg.naturalHeight;
        const scale = Math.max(size / imgW, size / imgH);
        const drawW = imgW * scale;
        const drawH = imgH * scale;
        ctx.drawImage(photoImg,
            cx - drawW / 2, cy - drawH / 2,
            drawW, drawH
        );

        ctx.restore();

        // === Rotating heart ring around the photo ===
        const heartEmojis = ['❤️', '💕', '💖', '💗', '💝', '🩷'];
        const numHearts = 8;
        const orbitRadius = halfSize + 35;
        const rotAngle = t * 0.4; // Slow rotation

        for (let i = 0; i < numHearts; i++) {
            const angle = (i / numHearts) * Math.PI * 2 + rotAngle;
            const hx = cx + Math.cos(angle) * orbitRadius;
            const hy = cy + Math.sin(angle) * orbitRadius;

            // Each heart has a subtle float
            const floatY = Math.sin(t * 2 + i * 0.8) * 4;
            const heartScale = 0.8 + 0.2 * Math.sin(t * 3 + i * 1.2);

            ctx.save();
            ctx.globalAlpha = alpha * (0.6 + 0.4 * Math.sin(t * 2 + i));
            ctx.translate(hx, hy + floatY);
            ctx.scale(heartScale, heartScale);
            ctx.font = '28px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(heartEmojis[i % heartEmojis.length], 0, 0);
            ctx.restore();
        }

        // === Corner sparkle hearts (pulsing) ===
        const cornerOffset = halfSize + 8;
        const corners = [
            { x: cx - cornerOffset, y: cy - cornerOffset, emoji: '💖' },
            { x: cx + cornerOffset, y: cy - cornerOffset, emoji: '💕' },
            { x: cx - cornerOffset, y: cy + cornerOffset, emoji: '💗' },
            { x: cx + cornerOffset, y: cy + cornerOffset, emoji: '💝' }
        ];

        corners.forEach((c, i) => {
            const pulseScale = 0.9 + 0.3 * Math.sin(t * 3.5 + i * 1.5);
            ctx.save();
            ctx.globalAlpha = alpha * 0.85;
            ctx.translate(c.x, c.y);
            ctx.scale(pulseScale, pulseScale);
            ctx.font = '34px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(c.emoji, 0, 0);
            ctx.restore();
        });
    }

    // ============================================
    // Main Animation Frame
    // ============================================
    // Timeline (14 seconds — extended for photo):
    //  0.0s - 0.5s  : Background fades in
    //  0.3s - 1.2s  : "Valentine Wrapped 2026" badge
    //  0.8s - 2.0s  : Names slide in + "&" swoops
    //  2.0s - 3.5s  : Photo with love border (animated)
    //  3.5s - 4.0s  : Divider line
    //  4.0s - 6.5s  : Stats count up (days, hours, sunsets)
    //  6.5s - 8.0s  : Couple Vibe badge
    //  8.0s - 10.5s : Love Letter text
    // 10.5s - 11.5s : Memory label
    // 11.5s - 14.0s : CTA (valentinewrapped.in)
    // 0.0s - 14.0s  : Particles float throughout

    function renderFrame(elapsed) {
        // Clear
        ctx.clearRect(0, 0, W, H);

        // Background
        drawBackground();

        // Particles (always visible)
        updateParticles(elapsed);
        drawParticles();

        const cx = W / 2;

        // ---- Badge: "Valentine Wrapped 2026" ----
        {
            const s = slideUp(elapsed, 300, 700, 30);
            if (s.alpha > 0) {
                const y = 200 - s.offsetY;
                // Pill background
                ctx.save();
                ctx.globalAlpha = s.alpha * 0.7;
                ctx.fillStyle = 'rgba(232, 67, 106, 0.15)';
                ctx.strokeStyle = 'rgba(232, 67, 106, 0.3)';
                ctx.lineWidth = 2;
                const pillW = 460, pillH = 56, pillR = 28;
                ctx.beginPath();
                ctx.roundRect(cx - pillW / 2, y - pillH / 2, pillW, pillH, pillR);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
                drawText('💕  Valentine Wrapped 2026', cx, y, '600 26px Inter, sans-serif', '#ff6b8a', s.alpha);
            }
        }

        // ---- Name 1 ----
        {
            const s = slideUp(elapsed, 800, 600, 40);
            if (s.alpha > 0) {
                drawTextGradient(name1, cx, 380 - s.offsetY, 'bold 90px "Playfair Display", Georgia, serif', s.alpha);
            }
        }

        // ---- "&" symbol ----
        {
            const s = slideUp(elapsed, 1300, 500, 30);
            if (s.alpha > 0) {
                ctx.save();
                ctx.globalAlpha = s.alpha;
                const scl = easeOutBack(clamp01((elapsed - 1300) / 500));
                ctx.translate(cx, 470 - s.offsetY);
                ctx.scale(scl, scl);
                ctx.font = '80px "Dancing Script", cursive';
                ctx.fillStyle = '#ff9ecd';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('&', 0, 0);
                ctx.restore();
            }
        }

        // ---- Name 2 ----
        {
            const s = slideUp(elapsed, 1600, 600, 40);
            if (s.alpha > 0) {
                drawTextGradient(name2, cx, 560 - s.offsetY, 'bold 90px "Playfair Display", Georgia, serif', s.alpha);
            }
        }

        // ---- Photo with Love Border (NEW!) ----
        if (photoImg && photoLoaded) {
            const photoStart = 2000;
            const s = slideUp(elapsed, photoStart, 800, 60);
            if (s.alpha > 0) {
                const scl = easeOutBack(clamp01((elapsed - photoStart) / 800));
                const photoY = 800 - s.offsetY;
                const photoSize = 320;

                ctx.save();
                ctx.translate(cx, photoY);
                ctx.scale(scl, scl);
                ctx.translate(-cx, -photoY);
                drawPhotoFrame(cx, photoY, photoSize, elapsed, s.alpha, photoStart);
                ctx.restore();

                // Memory label below photo
                if (elapsed > photoStart + 500) {
                    const memAlpha = fadeIn(elapsed, photoStart + 500, 400);
                    drawText(memoryLabel, cx, photoY + photoSize / 2 + 55, '500 28px Inter, sans-serif', '#ff9ecd', memAlpha * s.alpha);
                }
            }
        }

        // ---- Divider ----
        {
            const dividerY = photoImg && photoLoaded ? 1020 : 820;
            const a = fadeIn(elapsed, 3500, 500);
            if (a > 0) {
                drawDivider(cx, dividerY, 300 * a, a);
            }
        }

        // ---- Stats Section ----
        {
            const statsBaseY = photoImg && photoLoaded ? 1060 : 890;
            const sectionAlpha = fadeIn(elapsed, 3800, 400);
            if (sectionAlpha > 0) {
                drawText('YOUR LOVE IN NUMBERS', cx, statsBaseY, '600 24px Inter, sans-serif', 'rgba(255,255,255,0.4)', sectionAlpha);
            }

            // Days
            const s1 = slideUp(elapsed, 4000, 600, 30);
            if (s1.alpha > 0) {
                const val = animateValue(elapsed, 4000, 1500, stats.days);
                drawTextGradient(val.toLocaleString(), cx, statsBaseY + 90 - s1.offsetY, 'bold 100px "Playfair Display", serif', s1.alpha);
                drawText('Days of Love', cx, statsBaseY + 150 - s1.offsetY, '400 28px Inter, sans-serif', 'rgba(255,255,255,0.6)', s1.alpha);
            }

            // Hours
            const s2 = slideUp(elapsed, 4500, 600, 30);
            if (s2.alpha > 0) {
                const val = animateValue(elapsed, 4500, 1500, stats.hours);
                drawTextGradient(val.toLocaleString(), cx, statsBaseY + 250 - s2.offsetY, 'bold 80px "Playfair Display", serif', s2.alpha);
                drawText('Hours Together', cx, statsBaseY + 305 - s2.offsetY, '400 26px Inter, sans-serif', 'rgba(255,255,255,0.6)', s2.alpha);
            }

            // Sunsets
            const s3 = slideUp(elapsed, 5000, 600, 30);
            if (s3.alpha > 0) {
                const val = animateValue(elapsed, 5000, 1500, stats.sunsets);
                drawTextGradient(val.toLocaleString(), cx, statsBaseY + 400 - s3.offsetY, 'bold 80px "Playfair Display", serif', s3.alpha);
                drawText('Sunsets Shared', cx, statsBaseY + 455 - s3.offsetY, '400 26px Inter, sans-serif', 'rgba(255,255,255,0.6)', s3.alpha);
            }
        }

        // ---- Couple Vibe ----
        {
            const s = slideUp(elapsed, 6500, 700, 40);
            if (s.alpha > 0) {
                const vy = 1580 - s.offsetY;
                // Emoji
                ctx.save();
                ctx.globalAlpha = s.alpha;
                const scl = easeOutBack(clamp01((elapsed - 6500) / 700));
                ctx.translate(cx, vy);
                ctx.scale(scl, scl);
                ctx.font = '70px serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(vibeInfo.emoji, 0, 0);
                ctx.restore();

                drawText(vibeInfo.title, cx, vy + 65, 'bold 42px "Playfair Display", serif', vibeInfo.color, s.alpha);
            }
        }

        // ---- Love Letter ----
        {
            const s = slideUp(elapsed, 8000, 800, 30);
            if (s.alpha > 0) {
                // Quote mark
                drawText('"', cx - 320, 1720 - s.offsetY, '150px "Playfair Display", serif', 'rgba(232, 67, 106, 0.15)', s.alpha);
                // Letter
                wrapText(loveLetter.letter, cx, 1760 - s.offsetY, 800, 52,
                    '42px "Dancing Script", cursive', '#ffffff', s.alpha);
                // From
                drawText(`— ${loveLetter.from} 💕`, cx, 1860 - s.offsetY, 'italic 28px Inter, sans-serif', '#ff6b8a', s.alpha);
            }
        }

        // ---- Watermark / CTA ----
        {
            const a = fadeIn(elapsed, 11500, 600);
            if (a > 0) {
                drawText('valentinewrapped.in', cx, H - 60, '500 24px Inter, sans-serif', 'rgba(255,255,255,0.25)', a);
            }
        }
    }

    // ============================================
    // Animation Loop
    // ============================================
    function startAnimation(onFrame) {
        initParticles();
        startTime = performance.now();
        isPlaying = true;

        function loop(now) {
            if (!isPlaying) return;

            const elapsed = now - startTime;
            renderFrame(elapsed);

            if (onFrame) onFrame(elapsed);

            if (elapsed < DURATION) {
                animFrame = requestAnimationFrame(loop);
            } else {
                isPlaying = false;
                // Render final frame
                renderFrame(DURATION);
            }
        }

        animFrame = requestAnimationFrame(loop);
    }

    function stopAnimation() {
        isPlaying = false;
        if (animFrame) {
            cancelAnimationFrame(animFrame);
            animFrame = null;
        }
    }

    // ============================================
    // Draw Initial Static Frame
    // ============================================
    function drawStaticPreview() {
        // Draw a nice static preview showing the first part
        ctx.clearRect(0, 0, W, H);
        drawBackground();

        // Draw some particles statically
        initParticles();
        drawParticles();

        // Badge
        drawText('💕  Valentine Wrapped 2026', W / 2, 200, '600 26px Inter, sans-serif', '#ff6b8a', 0.7);

        // Show names
        drawTextGradient(name1, W / 2, 380, 'bold 90px "Playfair Display", Georgia, serif', 0.9);
        ctx.save();
        ctx.font = '80px "Dancing Script", cursive';
        ctx.fillStyle = '#ff9ecd';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('&', W / 2, 470);
        ctx.restore();
        drawTextGradient(name2, W / 2, 560, 'bold 90px "Playfair Display", Georgia, serif', 0.9);

        // Show photo if available
        if (photoImg && photoLoaded) {
            drawPhotoFrame(W / 2, 800, 320, 2000, 0.9, 0);
        }

        // Watermark
        drawText('valentinewrapped.in', W / 2, H - 60, '500 24px Inter, sans-serif', 'rgba(255,255,255,0.2)', 1);
    }

    // Draw initial static preview
    drawStaticPreview();

    // ============================================
    // Play Button
    // ============================================
    const overlay = document.getElementById('canvas-overlay');
    const playBtn = document.getElementById('btn-play');

    playBtn.addEventListener('click', () => {
        overlay.classList.add('hidden');
        stopAnimation();
        startAnimation(() => { });

        // Re-show overlay after animation ends
        setTimeout(() => {
            overlay.classList.remove('hidden');
            playBtn.querySelector('span:last-child').textContent = 'Replay';
        }, DURATION + 500);
    });

    // ============================================
    // Record & Download Video
    // ============================================
    const recordBtn = document.getElementById('btn-record');
    const recordingIndicator = document.getElementById('recording-indicator');
    const recordTime = document.getElementById('record-time');
    const recordProgress = document.getElementById('record-progress');
    const recordHint = document.getElementById('record-hint');
    const shareStoryBtn = document.getElementById('btn-share-story');
    const shareActionsRow = document.getElementById('share-actions') || document.getElementById('share-row');

    // Store the last recorded video blob for sharing
    let lastVideoBlob = null;
    let lastVideoFileName = '';

    recordBtn.addEventListener('click', () => {
        recordVideo();
    });

    async function recordVideo() {
        // Disable button
        recordBtn.disabled = true;
        recordBtn.textContent = '⏳ Preparing...';
        overlay.classList.add('hidden');

        // Hide share buttons during recording
        shareStoryBtn.style.display = 'none';
        shareActionsRow.style.display = 'none';

        // Set up recording
        const stream = canvas.captureStream(30); // 30 FPS
        const chunks = [];

        // MIME type selection: Prioritize MP4 (H.264) for Instagram compatibility
        // Instagram ONLY accepts MP4/H.264 — WebM will NOT work!
        const mp4Types = [
            'video/mp4;codecs=avc1.42E01E,mp4a.40.2',  // H.264 Baseline + AAC
            'video/mp4;codecs=avc1.4D401E,mp4a.40.2',  // H.264 Main + AAC
            'video/mp4;codecs=avc1.42E01E',              // H.264 Baseline (no audio)
            'video/mp4;codecs=avc1,opus',                // H.264 + Opus audio
            'video/mp4;codecs=avc1',                     // H.264 generic
            'video/mp4',                                  // MP4 generic
        ];

        const webmTypes = [
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm',
        ];

        // Try MP4 first (required for Instagram), then fall back to WebM
        let mimeType = '';
        for (const type of [...mp4Types, ...webmTypes]) {
            if (MediaRecorder.isTypeSupported(type)) {
                mimeType = type;
                break;
            }
        }

        if (!mimeType) {
            // Last resort fallback
            mimeType = 'video/webm';
        }

        const isMP4 = mimeType.includes('mp4');
        console.log('Recording with MIME type:', mimeType, '(MP4:', isMP4, ')');

        const recorder = new MediaRecorder(stream, {
            mimeType: mimeType,
            videoBitsPerSecond: 5000000 // 5 Mbps for good quality
        });

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: mimeType });
            const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
            lastVideoFileName = `valentine-wrapped-${name1}-${name2}.${ext}`;
            lastVideoBlob = blob;

            // Auto-download
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = lastVideoFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Reset UI
            recordBtn.disabled = false;
            recordBtn.textContent = '🎬 Record & Download Video';
            recordingIndicator.style.display = 'none';
            recordHint.style.display = '';
            overlay.classList.remove('hidden');
            playBtn.querySelector('span:last-child').textContent = 'Replay';

            // Show share buttons with animation
            shareStoryBtn.style.display = '';
            shareActionsRow.style.display = '';
            shareStoryBtn.style.animation = 'fadeInUp 0.4s ease-out forwards';
            shareActionsRow.style.animation = 'fadeInUp 0.5s ease-out 0.1s forwards';

            const formatNote = isMP4 ? '' : ' (⚠️ WebM format — may not work on Instagram)';
            showToast(`✅ Video ready!${formatNote} Share it to your Story 🎉`);
        };

        // Start recording
        recorder.start();
        recordingIndicator.style.display = '';
        recordHint.style.display = 'none';
        recordBtn.textContent = '🔴 Recording...';

        // Timer display
        let timerMs = 0;
        const timerInterval = setInterval(() => {
            timerMs += 100;
            const sec = Math.floor(timerMs / 1000);
            recordTime.textContent = sec;
            recordProgress.style.width = (timerMs / DURATION * 100) + '%';
        }, 100);

        // Start animation
        stopAnimation();
        startAnimation((elapsed) => {
            // Nothing extra needed — canvas is being captured
        });

        // Stop recording after animation completes
        setTimeout(() => {
            clearInterval(timerInterval);
            recorder.stop();
            stopAnimation();
        }, DURATION + 500); // Small buffer
    }

    // ============================================
    // Share Video Functions
    // ============================================

    /**
     * Detect if user is on mobile
     */
    function isMobile() {
        return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    /**
     * Detect if user is on Android
     */
    function isAndroid() {
        return /Android/i.test(navigator.userAgent);
    }

    /**
     * Detect if user is on iOS
     */
    function isIOS() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    /**
     * Convert blob to base64 data URL
     */
    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    /**
     * Share video file using Web Share API (works on mobile).
     * Falls back to download on desktop.
     */
    async function shareVideoFile(title) {
        if (!lastVideoBlob) {
            showToast('🎬 Record a video first!');
            return false;
        }

        const file = new File([lastVideoBlob], lastVideoFileName, {
            type: lastVideoBlob.type
        });

        // Check if Web Share API supports file sharing
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title: title || 'Valentine Wrapped 2026 💕',
                    text: `Our love, wrapped 💕✨ ${stats.days} days of love together!\nCreate yours → valentinewrapped.in`,
                    files: [file]
                });
                showToast('✅ Shared successfully!');
                return true;
            } catch (err) {
                if (err.name === 'AbortError') {
                    return false;
                }
                console.error('Share failed:', err);
            }
        }

        // Fallback: download the file
        downloadVideoBlob();
        showToast('📥 Downloaded! Open Instagram → Add to Story');
        return false;
    }

    /**
     * Download the video blob as a file
     */
    function downloadVideoBlob() {
        if (!lastVideoBlob) return;
        const url = URL.createObjectURL(lastVideoBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = lastVideoFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Share directly to Instagram Story.
     * 
     * The ONLY way to pass an actual video file to Instagram Stories
     * from a mobile browser is via the Web Share API with just the file.
     * Deep links (instagram://story-camera) open the camera but can't
     * pass the video, so we don't use them.
     * 
     * Strategy:
     * 1. On mobile: Use navigator.share() with ONLY the video file
     *    (no title, no text). This gives a clean share sheet where
     *    "Instagram Stories" appears. Tapping it loads the video
     *    directly into the story editor — one tap to post!
     * 2. On desktop: Download + guidance toast.
     */
    async function shareToInstagramStory() {
        if (!lastVideoBlob) {
            showToast('🎬 Record a video first!');
            return;
        }

        // Always present the file as MP4 to Instagram
        // Instagram only accepts MP4/H.264 files
        const isActuallyMP4 = lastVideoBlob.type.includes('mp4');
        const shareFileName = lastVideoFileName.replace(/\.webm$/, '.mp4');
        const shareMimeType = 'video/mp4';

        const file = new File([lastVideoBlob], shareFileName, {
            type: shareMimeType
        });

        // Mobile — use Web Share API with file only
        if (isMobile() && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({ files: [file] });
                showToast('✅ Shared to Instagram Story!');
                return;
            } catch (err) {
                if (err.name === 'AbortError') {
                    return;
                }
                console.error('Web Share failed:', err);

                // If share failed and video is WebM, it might be format issue
                if (!isActuallyMP4) {
                    showToast('⚠️ Your browser recorded in WebM format. Instagram needs MP4. Try updating Chrome.');
                    return;
                }
            }
        }

        // Fallback: download and guide
        downloadVideoBlob();
        if (isMobile()) {
            showToast('📥 Video saved! Open Instagram → Your Story → Select video');
        } else {
            showToast('📥 Video downloaded! Send it to your phone and share on Instagram');
        }
    }

    /**
     * Share to Instagram Story button handler
     */
    shareStoryBtn.addEventListener('click', async () => {
        await shareToInstagramStory();
    });

    // Instagram share pill (only on video.html)
    const shareIgBtn = document.getElementById('btn-share-ig');
    if (shareIgBtn) {
        shareIgBtn.addEventListener('click', async () => {
            await shareToInstagramStory();
        });
    }

    // WhatsApp share pill
    const shareWaBtn = document.getElementById('btn-share-wa');
    if (shareWaBtn) {
        shareWaBtn.addEventListener('click', async () => {
            if (!lastVideoBlob) {
                showToast('🎬 Record a video first!');
                return;
            }

            const file = new File([lastVideoBlob], lastVideoFileName, {
                type: lastVideoBlob.type
            });

            // Try Web Share API with file for WhatsApp
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: 'Valentine Wrapped 💕',
                        text: `Hey! Check out our Valentine Wrapped 💕\n${stats.days} days of love together ✨\n\nCreate yours too → valentinewrapped.in`,
                        files: [file]
                    });
                    return;
                } catch (err) {
                    if (err.name === 'AbortError') return;
                }
            }

            // Fallback: open WhatsApp with text (no file)
            const text = encodeURIComponent(`Hey! Check out our Valentine Wrapped 💕\n${stats.days} days of love together ✨\n\nCreate yours too → valentinewrapped.in\n\n#ValentineWrapped2026`);
            window.open(`https://wa.me/?text=${text}`, '_blank');
            showToast('📥 Download the video first, then attach in WhatsApp');
        });
    }

    // Generic share / More options
    const shareMoreBtn = document.getElementById('btn-share-more');
    if (shareMoreBtn) {
        shareMoreBtn.addEventListener('click', async () => {
            if (!lastVideoBlob) {
                showToast('🎬 Record a video first!');
                return;
            }

            const file = new File([lastVideoBlob], lastVideoFileName, {
                type: lastVideoBlob.type
            });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: 'Valentine Wrapped 2026 💕',
                        text: `Our Valentine Wrapped 💕 Create yours → valentinewrapped.in`,
                        files: [file]
                    });
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        showToast('❌ Sharing failed. Try downloading instead.');
                    }
                }
            } else if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Valentine Wrapped 2026 💕',
                        text: `Check out our Valentine Wrapped! 💕 Create yours → valentinewrapped.in`,
                        url: 'https://valentinewrapped.in'
                    });
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        showToast('❌ Sharing failed.');
                    }
                }
            } else {
                navigator.clipboard.writeText('https://valentinewrapped.in').then(() => {
                    showToast('🔗 Link copied! Share it manually');
                }).catch(() => {
                    showToast('🔗 valentinewrapped.in — Share this link!');
                });
            }
        });
    }

    // ============================================
    // Toast
    // ============================================
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-message');
        toastMsg.textContent = message;
        toast.style.display = 'block';
        toast.style.animation = 'none';
        toast.offsetHeight;
        toast.style.animation = 'fadeInUp 0.3s ease-out forwards';
        setTimeout(() => { toast.style.display = 'none'; }, 3000);
    }

})();
