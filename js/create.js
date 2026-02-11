/* ============================================
   Valentine Wrapped 2026 — Create Flow Logic
   ============================================ */

(function () {
    'use strict';

    // State
    let currentStep = 1;
    const totalSteps = 7;
    let selectedVibe = null;
    let selectedMemory = null;
    let selectedTrait = null;
    let photoData = null;

    // DOM Elements
    const progressFill = document.getElementById('progress-fill');
    const stepIndicator = document.getElementById('step-indicator');
    const backBtn = document.getElementById('back-btn');
    const stepsWrapper = document.getElementById('steps-wrapper');

    // Input fields
    const name1Input = document.getElementById('name1');
    const name2Input = document.getElementById('name2');
    const startDateInput = document.getElementById('start-date');
    const photoInput = document.getElementById('photo-input');

    // ============================================
    // Date max = today
    // ============================================
    const today = new Date().toISOString().split('T')[0];
    if (startDateInput) startDateInput.max = today;

    // ============================================
    // Navigation
    // ============================================
    function goToStep(nextStep, direction) {
        if (nextStep < 1 || nextStep > totalSteps) return;

        const currentEl = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
        const nextEl = document.querySelector(`.wizard-step[data-step="${nextStep}"]`);

        if (!currentEl || !nextEl) return;

        // Remove previous animation classes
        document.querySelectorAll('.wizard-step').forEach(el => {
            el.classList.remove('active', 'slide-in-right', 'slide-out-left', 'slide-in-left', 'slide-out-right');
        });

        if (direction === 'forward') {
            currentEl.classList.add('slide-out-left');
            nextEl.classList.add('slide-in-right');
        } else {
            currentEl.classList.add('slide-out-right');
            nextEl.classList.add('slide-in-left');
        }

        currentStep = nextStep;
        updateProgress();
        updateBackButton();

        // Focus input on text steps
        setTimeout(() => {
            if (currentStep === 1) name1Input?.focus();
            if (currentStep === 2) name2Input?.focus();
        }, 400);
    }

    function updateProgress() {
        const percent = (currentStep / totalSteps) * 100;
        progressFill.style.width = percent + '%';
        stepIndicator.textContent = `Step ${currentStep} of ${totalSteps}`;
    }

    function updateBackButton() {
        backBtn.onclick = (e) => {
            e.preventDefault();
            if (currentStep === 1) {
                window.location.href = 'index.html';
            } else {
                goToStep(currentStep - 1, 'backward');
            }
        };
    }

    // ============================================
    // Next Buttons
    // ============================================
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStep = parseInt(btn.dataset.next);
            if (!btn.disabled) {
                goToStep(nextStep, 'forward');
            }
        });
    });

    // ============================================
    // Input Validation — Step 1 (Name 1)
    // ============================================
    const btnStep1 = document.getElementById('btn-step1');
    name1Input.addEventListener('input', () => {
        btnStep1.disabled = name1Input.value.trim().length === 0;
    });

    // Allow Enter key
    name1Input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !btnStep1.disabled) {
            btnStep1.click();
        }
    });

    // ============================================
    // Input Validation — Step 2 (Name 2)
    // ============================================
    const btnStep2 = document.getElementById('btn-step2');
    name2Input.addEventListener('input', () => {
        btnStep2.disabled = name2Input.value.trim().length === 0;
    });

    name2Input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !btnStep2.disabled) {
            btnStep2.click();
        }
    });

    // ============================================
    // Input Validation — Step 3 (Date)
    // ============================================
    const btnStep3 = document.getElementById('btn-step3');
    startDateInput.addEventListener('change', () => {
        btnStep3.disabled = !startDateInput.value;
    });

    // ============================================
    // MCQ Logic — Step 4 (Vibe)
    // ============================================
    const btnStep4 = document.getElementById('btn-step4');
    document.getElementById('vibe-options').addEventListener('click', (e) => {
        const option = e.target.closest('.mcq-option');
        if (!option) return;

        // Deselect all
        document.querySelectorAll('#vibe-options .mcq-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedVibe = option.dataset.value;
        btnStep4.disabled = false;
    });

    // ============================================
    // MCQ Logic — Step 5 (Memory)
    // ============================================
    const btnStep5 = document.getElementById('btn-step5');
    document.getElementById('memory-options').addEventListener('click', (e) => {
        const option = e.target.closest('.mcq-option');
        if (!option) return;

        document.querySelectorAll('#memory-options .mcq-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedMemory = option.dataset.value;
        btnStep5.disabled = false;
    });

    // ============================================
    // MCQ Logic — Step 6 (Trait)
    // ============================================
    const btnStep6 = document.getElementById('btn-step6');
    document.getElementById('trait-options').addEventListener('click', (e) => {
        const option = e.target.closest('.mcq-option');
        if (!option) return;

        document.querySelectorAll('#trait-options .mcq-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedTrait = option.dataset.value;
        btnStep6.disabled = false;
    });

    // ============================================
    // Photo Upload — Step 7
    // ============================================
    const uploadArea = document.getElementById('upload-area');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const uploadPreview = document.getElementById('upload-preview');
    const previewImg = document.getElementById('preview-img');
    const removePhotoBtn = document.getElementById('remove-photo');
    const btnGenerate = document.getElementById('btn-generate');
    const btnSkip = document.getElementById('btn-skip');

    uploadPlaceholder.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Photo size should be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            photoData = ev.target.result;
            previewImg.src = photoData;
            uploadPlaceholder.style.display = 'none';
            uploadPreview.style.display = 'block';
            btnSkip.style.display = 'none';
        };
        reader.readAsDataURL(file);
    });

    removePhotoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        photoData = null;
        photoInput.value = '';
        previewImg.src = '';
        uploadPlaceholder.style.display = 'flex';
        uploadPreview.style.display = 'none';
        btnSkip.style.display = '';
    });

    // ============================================
    // Generate Wrapped
    // ============================================
    window.generateWrapped = function () {
        // Collect all data
        const data = {
            name1: name1Input.value.trim(),
            name2: name2Input.value.trim(),
            startDate: startDateInput.value,
            vibe: selectedVibe,
            memory: selectedMemory,
            trait: selectedTrait,
            photo: photoData,
            createdAt: new Date().toISOString()
        };

        // Save to localStorage
        ValStorage.save(data);

        // Show loading
        showLoading(() => {
            window.location.href = 'result.html';
        });
    };

    // ============================================
    // Loading Animation
    // ============================================
    function showLoading(callback) {
        const overlay = document.getElementById('loading-overlay');
        const barFill = document.getElementById('loading-bar-fill');
        const loadingText = document.getElementById('loading-text');
        overlay.style.display = 'flex';

        const messages = [
            'Counting your love days... 💕',
            'Analyzing your couple vibe... 🎭',
            'Crafting your love letter... 💌',
            'Making it Instagram-perfect... 📸',
            'Almost there... ✨'
        ];

        let progress = 0;
        let msgIndex = 0;

        const timer = setInterval(() => {
            progress += Math.random() * 20 + 5;
            if (progress > 100) progress = 100;
            barFill.style.width = progress + '%';

            if (progress > (msgIndex + 1) * 20 && msgIndex < messages.length - 1) {
                msgIndex++;
                loadingText.textContent = messages[msgIndex];
            }

            if (progress >= 100) {
                clearInterval(timer);
                setTimeout(callback, 400);
            }
        }, 300);
    }

    // ============================================
    // Init
    // ============================================
    updateBackButton();

    // Focus first input
    setTimeout(() => name1Input?.focus(), 500);

})();
