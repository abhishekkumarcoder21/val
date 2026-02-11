/* ============================================
   Valentine Wrapped 2026 — Partner Quiz Logic
   ============================================ */

(function () {
    'use strict';

    // Load user data
    const data = ValStorage.load();
    if (!data || !data.name1) {
        window.location.href = 'create.html';
        return;
    }

    const { name1, name2, vibe, memory, trait } = data;

    // Set partner name
    const partnerNameEl = document.getElementById('quiz-partner-name');
    if (partnerNameEl) partnerNameEl.textContent = name2;

    // ============================================
    // Quiz Questions
    // ============================================
    const questions = [
        {
            question: `What's ${name1}'s couple vibe?`,
            options: [
                { label: '🌍 Adventurous Duo', value: 'adventurous' },
                { label: '🛋️ Cozy Soulmates', value: 'cozy' },
                { label: '🎪 Beautiful Chaos', value: 'chaotic' },
                { label: '🌹 Timeless Romance', value: 'classic' }
            ],
            answer: vibe
        },
        {
            question: `What's ${name1}'s favorite memory with you?`,
            options: [
                { label: '🥰 Our First Date', value: 'firstdate' },
                { label: '🛫 A Trip Together', value: 'trip' },
                { label: '🌙 Late Night Talks', value: 'latenight' },
                { label: '🎁 A Special Surprise', value: 'surprise' }
            ],
            answer: memory
        },
        {
            question: `What does ${name1} love most about you?`,
            options: [
                { label: '😂 My Humor', value: 'humor' },
                { label: '🤗 How I Care', value: 'care' },
                { label: '👀 My Eyes', value: 'eyes' },
                { label: '🎵 My Voice', value: 'voice' }
            ],
            answer: trait
        },
        {
            question: `How would ${name1} describe a perfect date?`,
            options: [
                { label: '🏔️ An outdoor adventure', value: vibe === 'adventurous' ? 'correct' : 'wrong1' },
                { label: '🎬 Movie night at home', value: vibe === 'cozy' ? 'correct' : 'wrong2' },
                { label: '🍽️ Fancy dinner out', value: vibe === 'classic' ? 'correct' : 'wrong3' },
                { label: '📞 Long video call', value: vibe === 'longdistance' ? 'correct' : 'wrong4' }
            ],
            answer: 'correct'
        },
        {
            question: `What emoji best represents ${name1}'s love for you?`,
            options: [
                { label: '🔥 Fire — intense!', value: vibe === 'chaotic' ? 'correct' : 'opt1' },
                { label: '🥰 Pure adoration', value: (trait === 'care' || trait === 'everything') ? 'correct' : 'opt2' },
                { label: '💕 Soft and sweet', value: (vibe === 'cozy' || vibe === 'classic') ? 'correct' : 'opt3' },
                { label: '✨ Magical', value: (trait === 'eyes' || trait === 'voice') ? 'correct' : 'opt4' }
            ],
            answer: 'correct'
        }
    ];

    // State
    let currentQ = 0;
    let score = 0;
    let answered = false;

    // ============================================
    // Start Quiz
    // ============================================
    document.getElementById('btn-start-quiz').addEventListener('click', () => {
        document.getElementById('quiz-intro').style.display = 'none';
        document.getElementById('quiz-questions').style.display = 'flex';
        showQuestion(0);
    });

    // ============================================
    // Show Question
    // ============================================
    function showQuestion(index) {
        const q = questions[index];
        answered = false;

        // Update progress
        document.getElementById('quiz-progress-fill').style.width = ((index + 1) / questions.length * 100) + '%';
        document.getElementById('quiz-q-counter').textContent = `${index + 1} / ${questions.length}`;

        // Update question text
        document.getElementById('quiz-question-text').textContent = q.question;

        // Build options
        const optionsContainer = document.getElementById('quiz-options');
        optionsContainer.innerHTML = '';

        // Shuffle options
        const shuffled = [...q.options].sort(() => Math.random() - 0.5);

        shuffled.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.dataset.value = opt.value;
            btn.innerHTML = `<span>${opt.label}</span>`;
            btn.addEventListener('click', () => handleAnswer(btn, opt.value, q.answer));
            optionsContainer.appendChild(btn);
        });

        // Animate card
        const card = document.getElementById('quiz-question-card');
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = 'fadeInUp 0.4s ease-out';
    }

    // ============================================
    // Handle Answer
    // ============================================
    function handleAnswer(btn, selected, correct) {
        if (answered) return;
        answered = true;

        const isCorrect = selected === correct;
        if (isCorrect) score++;

        // Disable all options
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.add('disabled');
            if (opt.dataset.value === correct) {
                opt.classList.add('correct');
            }
        });

        if (!isCorrect) {
            btn.classList.add('wrong');
        }

        // Next question or results after delay
        setTimeout(() => {
            currentQ++;
            if (currentQ < questions.length) {
                showQuestion(currentQ);
            } else {
                showResults();
            }
        }, 1200);
    }

    // ============================================
    // Show Results
    // ============================================
    function showResults() {
        document.getElementById('quiz-questions').style.display = 'none';
        document.getElementById('quiz-results').style.display = 'flex';

        // Score
        document.getElementById('score-number').textContent = score;
        document.getElementById('sc-score').textContent = `${score}/5`;

        // Names
        document.getElementById('sc-name1').textContent = name1;
        document.getElementById('sc-name2').textContent = name2;

        // Title & Description based on score
        const resultTitle = document.getElementById('quiz-result-title');
        const resultDesc = document.getElementById('quiz-result-desc');
        const badge = document.getElementById('sc-badge');

        if (score === 5) {
            resultTitle.textContent = 'Perfect Score! 🏆';
            resultDesc.textContent = `${name2} knows ${name1} inside out! This is TRUE love. You two are literally made for each other!`;
            badge.textContent = '🏆';
        } else if (score >= 4) {
            resultTitle.textContent = 'Almost Perfect! 🥈';
            resultDesc.textContent = `So close! ${name2} really knows ${name1} well. Just one more surprise to discover!`;
            badge.textContent = '🥈';
        } else if (score >= 3) {
            resultTitle.textContent = 'Not Bad! 😊';
            resultDesc.textContent = `${name2} knows the basics, but there's so much more to explore together!`;
            badge.textContent = '🥉';
        } else if (score >= 2) {
            resultTitle.textContent = 'Room to Grow 🌱';
            resultDesc.textContent = `Time for more deep conversations! ${name2} has some learning to do about ${name1}.`;
            badge.textContent = '🌱';
        } else {
            resultTitle.textContent = 'Oops! 😅';
            resultDesc.textContent = `Looks like ${name2} needs to spend more quality time with ${name1}! Start talking more!`;
            badge.textContent = '😅';
        }

        // Animate score
        const scoreCircle = document.getElementById('quiz-score-circle');
        scoreCircle.style.animation = 'none';
        scoreCircle.offsetHeight;
        scoreCircle.style.animation = 'scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
    }

    // ============================================
    // Download Score Card
    // ============================================
    window.downloadScoreCard = function () {
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');

        // Background
        const grad = ctx.createLinearGradient(0, 0, 0, 1080);
        grad.addColorStop(0, '#1a0a2e');
        grad.addColorStop(0.5, '#2d1045');
        grad.addColorStop(1, '#1a0a2e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1080);

        // Sparkles
        ctx.font = '40px serif';
        ctx.fillText('✨', 80, 120);
        ctx.fillText('💕', 950, 100);
        ctx.fillText('✨', 60, 960);
        ctx.fillText('💖', 970, 940);

        // Label
        ctx.textAlign = 'center';
        ctx.font = '24px "Inter", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.letterSpacing = '4px';
        ctx.fillText('COUPLE QUIZ SCORE', 540, 200);

        // Names
        ctx.font = 'bold 52px "Playfair Display", Georgia, serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${name1}  💕  ${name2}`, 540, 340);

        // Score
        ctx.font = 'bold 180px "Playfair Display", Georgia, serif';
        ctx.fillStyle = '#e8436a';
        ctx.fillText(`${score}/5`, 540, 580);

        // Badge
        const badges = { 5: '🏆', 4: '🥈', 3: '🥉', 2: '🌱', 1: '😅', 0: '😅' };
        ctx.font = '100px serif';
        ctx.fillText(badges[score] || '💕', 540, 730);

        // Result text
        const resultTexts = {
            5: 'Perfect Score! Made for each other!',
            4: 'Almost perfect! So close!',
            3: 'Not bad! Keep exploring!',
            2: 'Room to grow together!',
            1: 'Time for more quality time!',
            0: 'A fresh start awaits!'
        };
        ctx.font = '32px "Inter", sans-serif';
        ctx.fillStyle = '#ff9ecd';
        ctx.fillText(resultTexts[score] || '', 540, 840);

        // CTA
        ctx.font = '22px "Inter", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fillText('valentinewrapped.in', 540, 1020);

        // Download
        const link = document.createElement('a');
        link.download = `couple-quiz-score-${score}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast('📥 Score card downloaded!');
    };

    // ============================================
    // Share Score
    // ============================================
    window.shareScoreWhatsApp = function () {
        const text = encodeURIComponent(
            `${name2} scored ${score}/5 on the couple quiz! 🎯💕\n\nHow well does YOUR partner know you?\nCreate yours → valentinewrapped.in\n\n#ValentineWrapped2026 #CoupleQuiz`
        );
        window.open(`https://wa.me/?text=${text}`, '_blank');
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
        toast.offsetHeight;
        toast.style.animation = 'fadeInUp 0.3s ease-out forwards';
        setTimeout(() => { toast.style.display = 'none'; }, 2500);
    }

})();
