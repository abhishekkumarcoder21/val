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

    const { name1, name2, startDate, vibe, memory, trait } = data;
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
    const DURATION = 12000; // 12 seconds

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
    // Main Animation Frame
    // ============================================
    // Timeline (12 seconds):
    //  0.0s - 0.5s  : Background fades in
    //  0.3s - 1.2s  : "Valentine Wrapped 2026" badge
    //  0.8s - 2.0s  : Names slide in
    //  2.0s - 2.5s  : "&" swoops in
    //  2.5s - 3.5s  : Divider line
    //  3.0s - 5.5s  : Stats count up (days, hours, sunsets)
    //  5.5s - 7.0s  : Couple Vibe badge
    //  7.0s - 9.5s  : Love Letter text
    //  9.5s - 10.5s : Memory label
    // 10.5s - 12.0s : CTA (valentinewrapped.in)
    // 0.0s - 12.0s  : Particles float throughout

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
                const y = 280 - s.offsetY;
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
                drawTextGradient(name1, cx, 520 - s.offsetY, 'bold 90px "Playfair Display", Georgia, serif', s.alpha);
            }
        }

        // ---- "&" symbol ----
        {
            const s = slideUp(elapsed, 1300, 500, 30);
            if (s.alpha > 0) {
                ctx.save();
                ctx.globalAlpha = s.alpha;
                const scl = easeOutBack(clamp01((elapsed - 1300) / 500));
                ctx.translate(cx, 620 - s.offsetY);
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
                drawTextGradient(name2, cx, 720 - s.offsetY, 'bold 90px "Playfair Display", Georgia, serif', s.alpha);
            }
        }

        // ---- Divider ----
        {
            const a = fadeIn(elapsed, 2500, 500);
            if (a > 0) {
                drawDivider(cx, 820, 300 * a, a);
            }
        }

        // ---- Stats Section ----
        {
            const sectionAlpha = fadeIn(elapsed, 2800, 400);
            if (sectionAlpha > 0) {
                drawText('YOUR LOVE IN NUMBERS', cx, 890, '600 24px Inter, sans-serif', 'rgba(255,255,255,0.4)', sectionAlpha);
            }

            // Days
            const s1 = slideUp(elapsed, 3000, 600, 30);
            if (s1.alpha > 0) {
                const val = animateValue(elapsed, 3000, 1500, stats.days);
                drawTextGradient(val.toLocaleString(), cx, 980 - s1.offsetY, 'bold 100px "Playfair Display", serif', s1.alpha);
                drawText('Days of Love', cx, 1040 - s1.offsetY, '400 28px Inter, sans-serif', 'rgba(255,255,255,0.6)', s1.alpha);
            }

            // Hours
            const s2 = slideUp(elapsed, 3500, 600, 30);
            if (s2.alpha > 0) {
                const val = animateValue(elapsed, 3500, 1500, stats.hours);
                drawTextGradient(val.toLocaleString(), cx, 1140 - s2.offsetY, 'bold 80px "Playfair Display", serif', s2.alpha);
                drawText('Hours Together', cx, 1195 - s2.offsetY, '400 26px Inter, sans-serif', 'rgba(255,255,255,0.6)', s2.alpha);
            }

            // Sunsets
            const s3 = slideUp(elapsed, 4000, 600, 30);
            if (s3.alpha > 0) {
                const val = animateValue(elapsed, 4000, 1500, stats.sunsets);
                drawTextGradient(val.toLocaleString(), cx, 1290 - s3.offsetY, 'bold 80px "Playfair Display", serif', s3.alpha);
                drawText('Sunsets Shared', cx, 1345 - s3.offsetY, '400 26px Inter, sans-serif', 'rgba(255,255,255,0.6)', s3.alpha);
            }
        }

        // ---- Couple Vibe ----
        {
            const s = slideUp(elapsed, 5500, 700, 40);
            if (s.alpha > 0) {
                const vy = 1460 - s.offsetY;
                // Emoji
                ctx.save();
                ctx.globalAlpha = s.alpha;
                const scl = easeOutBack(clamp01((elapsed - 5500) / 700));
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
            const s = slideUp(elapsed, 7000, 800, 30);
            if (s.alpha > 0) {
                // Quote mark
                drawText('"', cx - 320, 1620 - s.offsetY, '150px "Playfair Display", serif', 'rgba(232, 67, 106, 0.15)', s.alpha);
                // Letter
                wrapText(loveLetter.letter, cx, 1680 - s.offsetY, 800, 52,
                    '42px "Dancing Script", cursive', '#ffffff', s.alpha);
                // From
                drawText(`— ${loveLetter.from} 💕`, cx, 1810 - s.offsetY, 'italic 28px Inter, sans-serif', '#ff6b8a', s.alpha);
            }
        }

        // ---- Watermark / CTA ----
        {
            const a = fadeIn(elapsed, 10500, 600);
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

        // Show names
        drawTextGradient(name1, W / 2, 520, 'bold 90px "Playfair Display", Georgia, serif', 0.9);
        ctx.save();
        ctx.font = '80px "Dancing Script", cursive';
        ctx.fillStyle = '#ff9ecd';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('&', W / 2, 620);
        ctx.restore();
        drawTextGradient(name2, W / 2, 720, 'bold 90px "Playfair Display", Georgia, serif', 0.9);

        // Badge
        drawText('💕  Valentine Wrapped 2026', W / 2, 280, '600 26px Inter, sans-serif', '#ff6b8a', 0.7);

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

    recordBtn.addEventListener('click', () => {
        recordVideo();
    });

    async function recordVideo() {
        // Disable button
        recordBtn.disabled = true;
        recordBtn.textContent = '⏳ Preparing...';
        overlay.classList.add('hidden');

        // Set up recording
        const stream = canvas.captureStream(30); // 30 FPS
        const chunks = [];

        // Try video/webm with vp9 first, then vp8, then any
        let mimeType = 'video/webm;codecs=vp9';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/webm;codecs=vp8';
        }
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/webm';
        }

        const recorder = new MediaRecorder(stream, {
            mimeType: mimeType,
            videoBitsPerSecond: 5000000 // 5 Mbps for good quality
        });

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `valentine-wrapped-${name1}-${name2}.webm`;
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

            showToast('✅ Video downloaded! Share on Instagram Stories 🎉');
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
