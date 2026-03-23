/* ============================================
   CHIẾN DỊCH ĐIỆN BIÊN PHỦ — SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Hero Animations ──
    const heroElements = document.querySelectorAll('.hero-content .animate-in');
    setTimeout(() => {
        heroElements.forEach(el => el.classList.add('visible'));
    }, 300);

    // ── Particles ──
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (4 + Math.random() * 4) + 's';
            particle.style.width = (2 + Math.random() * 3) + 'px';
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }

    // ── Navbar Scroll ──
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-links a');

    function onScroll() {
        // Navbar background
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── Mobile Nav Toggle ──
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('open');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('open');
            });
        });
    }

    // ── Scroll Reveal (IntersectionObserver) ──
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger delay for grid items
                const parent = entry.target.parentElement;
                const siblings = parent ? parent.querySelectorAll('.reveal-left, .reveal-right, .reveal-up') : [];
                let childIndex = 0;
                siblings.forEach((sib, i) => {
                    if (sib === entry.target) childIndex = i;
                });

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, childIndex * 120);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ── Animated Counters ──
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function formatNumber(num) {
            if (num >= 1000) {
                return num.toLocaleString('vi-VN');
            }
            return num.toString();
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.round(target * easedProgress);

            el.textContent = formatNumber(current);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    // ── Gauge Ring Animation ──
    const gaugeFills = document.querySelectorAll('.gauge-fill');
    const GAUGE_CIRCUMFERENCE = 2 * Math.PI * 68; // matches SVG r=68

    const gaugeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const percent = parseFloat(entry.target.getAttribute('data-percent'));
                const offset = GAUGE_CIRCUMFERENCE * (1 - percent / 100);
                entry.target.style.strokeDashoffset = offset;
                gaugeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    gaugeFills.forEach(el => gaugeObserver.observe(el));

    // ── Battle Meter Animation ──
    const meterFills = document.querySelectorAll('.meter-fill');
    const meterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                setTimeout(() => {
                    entry.target.style.width = progress + '%';
                }, 400);
                meterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    meterFills.forEach(el => meterObserver.observe(el));

    // ── War Timeline Progress Animation ──
    const wtProgressBars = document.querySelectorAll('.wt-progress');
    const wtObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = document.querySelectorAll('.wt-progress');
                bars.forEach((bar, i) => {
                    const progress = bar.getAttribute('data-progress');
                    setTimeout(() => {
                        bar.style.width = progress + '%';
                    }, i * 600);
                });
                wtObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    if (wtProgressBars.length > 0) {
        wtObserver.observe(wtProgressBars[0]);
    }

    // ── Hero Day Counter Animation ──
    const dayNums = document.querySelectorAll('.day-num[data-target]');
    dayNums.forEach(el => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(el);
    });

    // ── 3D Tilt on Hover ──
    const tiltTargets = document.querySelectorAll('.story-chapter, .stat-card, .impact-item, .hex-member, .battle-chapter, .pipe-node');
    tiltTargets.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            card.style.transition = 'transform 0.1s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.4s ease';
        });
    });

    // ── Parallax Hero ──
    const hero = document.querySelector('.hero');

    function parallax() {
        if (!hero) return;
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            hero.style.backgroundPositionY = scrolled * 0.4 + 'px';
        }
    }

    window.addEventListener('scroll', parallax, { passive: true });

    // ── Animated Siege Trench Rings ──
    const trenchRings = document.querySelectorAll('.trench-ring');
    if (trenchRings.length > 0) {
        const siegeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trenchRings.forEach((ring, i) => {
                        setTimeout(() => {
                            ring.classList.add('visible');
                        }, i * 600);
                    });
                    siegeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        siegeObserver.observe(trenchRings[0].closest('.siege-diagram') || trenchRings[0]);
    }

    // ── Force Comparison Bar Animation ──
    const forceBars = document.querySelectorAll('.force-bar[data-width]');
    if (forceBars.length > 0) {
        const forceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bars = entry.target.querySelectorAll('.force-bar[data-width]');
                    bars.forEach((bar, i) => {
                        setTimeout(() => {
                            bar.style.width = bar.getAttribute('data-width') + '%';
                        }, i * 200);
                    });
                    forceObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        const forceComp = document.querySelector('.force-comparison');
        if (forceComp) forceObserver.observe(forceComp);
    }

    // ── Territory Donut Animation ──
    const tdFills = document.querySelectorAll('.td-fill[data-percent]');
    const TD_CIRCUMFERENCE = 2 * Math.PI * 60; // r=60

    const tdObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const percent = parseFloat(entry.target.getAttribute('data-percent'));
                const offset = TD_CIRCUMFERENCE * (1 - percent / 100);
                entry.target.style.strokeDashoffset = offset;
                tdObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    tdFills.forEach(el => tdObserver.observe(el));

    // ── Flag Scene Animation ──
    const flagScene = document.querySelector('.flag-scene');
    if (flagScene) {
        const flagObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    flagScene.classList.add('visible');
                    flagObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        flagObserver.observe(flagScene);
    }

    // ── Smooth anchor scrolling ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetEl = document.querySelector(this.getAttribute('href'));
            if (targetEl) {
                const offset = 70;
                const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ═══════════════════════════════════════════
    //  CHATBOT — Gemini API
    // ═══════════════════════════════════════════

    const GEMINI_API_KEY = 'AIzaSyBvzvafOjh8Tv63Y5_6iUfO-NCBCquBYv4';
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const SYSTEM_PROMPT = `Bạn là một trợ lý AI chuyên gia về Chiến dịch Điện Biên Phủ (1954). Hãy trả lời các câu hỏi dựa trên kiến thức sau đây. Trả lời bằng tiếng Việt, ngắn gọn, chính xác và dễ hiểu. Sử dụng markdown đơn giản (bold, list) khi cần thiết.

KIẾN THỨC VỀ CHIẾN DỊCH ĐIỆN BIÊN PHỦ:

BỐI CẢNH:
- Cuối năm 1953, sau 8 năm chiến tranh tái chiếm thuộc địa, thực dân Pháp ngày càng sa lầy tại Đông Dương.
- Mỹ viện trợ ~80% chi phí chiến tranh cho Pháp đến năm 1954.
- Tướng Henri Navarre đề ra "Kế hoạch Navarre" — hy vọng xoay chuyển cục diện trong 18 tháng.
- Pháp chọn thung lũng Điện Biên Phủ (~16km², Tây Bắc Việt Nam) xây tập đoàn cứ điểm mạnh nhất Đông Dương.
- 49 cứ điểm liên hoàn, 8 cụm có mật danh phụ nữ: Béatrice, Gabrielle, Anne-Marie, Dominique, Huguette, Claudine, Éliane, Isabelle.
- Quân số Pháp: ban đầu ~10.800, đỉnh điểm ~16.200 binh lính (Lê Dương, dù, pháo binh, thiết giáp).
- Sân bay Mường Thanh: 100 lượt bay/ngày. Pháp gọi đây là "pháo đài bất khả xâm phạm."

NHÂN VẬT:
- Đại tướng Võ Nguyên Giáp: Tổng Tư lệnh QĐNDVN, trực tiếp chỉ huy chiến dịch. Quyết định lịch sử chuyển từ "đánh nhanh thắng nhanh" sang "đánh chắc tiến chắc." Được mệnh danh "Napoleon Đỏ."
- Chủ tịch Hồ Chí Minh: Căn dặn "Trận này rất quan trọng, phải đánh cho thắng. Chắc thắng mới đánh, không chắc thắng không đánh."
- Christian de Castries: Chuẩn tướng Pháp, chỉ huy trực tiếp tại Điện Biên Phủ. Bị bắt sống lúc 17h30 ngày 7/5/1954.
- Charles Piroth: Đại tá chỉ huy pháo binh Pháp, tự sát vì bất lực.

SỨC MẠNH NHÂN DÂN:
- ~260.000 dân công vận chuyển vũ khí, lương thực hàng trăm km đường rừng núi.
- Xe đạp thồ mang 200-300 kg/chiếc — biểu tượng hậu cần.
- Tinh thần "tất cả cho tiền tuyến."

DIỄN BIẾN (56 ngày đêm, 13/3 – 7/5/1954):

Giai đoạn chuẩn bị (11/1953 – 3/1954):
- 20/11/1953: Pháp đổ 6 tiểu đoàn dù xuống.
- Việt Nam kéo pháo bằng sức người lên sườn núi, đặt trong hầm đào sâu vào vách núi (bắn trực tiếp xuống).
- Đào hệ thống giao thông hào dài hàng trăm km.

Đợt 1 (13/3 – 17/3/1954): Tiêu diệt cứ điểm vòng ngoài
- 17h 13/3/1954: Pháo khai hỏa vào Him Lam (Béatrice), mở màn chiến dịch.
- 5 ngày tiêu diệt Him Lam, Độc Lập (Gabrielle), bức hàng Bản Kéo (Anne-Marie).
- >2.000 lính Pháp bị loại, 25 máy bay phá hủy.
- Đại tá Piroth tự sát.

Đợt 2 (30/3 – 30/4/1954): Đánh chiếm dãy đồi phía Đông & vây lấn
- Tấn công đồi A1, C1, D1, E — khống chế khu trung tâm Mường Thanh.
- Đồi A1 (Éliane 2): 39 ngày đêm giằng co, biểu tượng hy sinh.
- Chiến thuật "vây lấn": giao thông hào siết chặt.
- Từ 28/3: không máy bay hạ cánh được, tiếp tế thả dù rơi vào trận địa ta.
- Phong trào "săn Tây bắn tỉa."

Đợt 3 (1/5 – 7/5/1954): Tổng công kích — Chiến thắng
- Đêm 6/5: nạp ~1 tấn thuốc nổ vào đường hầm dưới đồi A1, cho nổ tung.
- 17h30 ngày 7/5/1954: Quân đội NDVN đánh chiếm Sở chỉ huy. De Castries + toàn bộ bộ tham mưu bị bắt sống.
- Lá cờ "Quyết chiến — Quyết thắng" tung bay trên nóc hầm.

KẾT QUẢ:
- 56 ngày đêm chiến đấu
- 16.200 quân địch bị loại (tiêu diệt + bắt sống)
- 62 máy bay bị bắn rơi
- 260.000 dân công phục vụ
- 49 cứ điểm bị tiêu diệt
- 64 xe cơ giới thu giữ

Ý NGHĨA:
- Đối với Việt Nam: Chấm dứt ~100 năm đô hộ Pháp. Dẫn đến Hiệp định Genève (21/7/1954). Giải phóng miền Bắc.
- Đối với thế giới: Cột mốc sụp đổ chủ nghĩa thực dân cũ. Lần đầu dân tộc thuộc địa thắng cường quốc phương Tây trong trận quyết chiến lớn. Cổ vũ phong trào giải phóng dân tộc Á-Phi-Mỹ Latinh.

Hiệp định Genève (21/7/1954): Pháp công nhận độc lập, chủ quyền VN, Lào, Campuchia. Pháp rút toàn bộ quân viễn chinh.

QUY TẮC TRẢ LỜI:
- Chỉ trả lời về chiến dịch Điện Biên Phủ và các chủ đề liên quan.
- Nếu câu hỏi ngoài phạm vi, lịch sự từ chối và gợi ý hỏi về chiến dịch.
- Giữ câu trả lời ngắn gọn (tối đa 200 từ) trừ khi được yêu cầu chi tiết hơn.
- Dùng emoji phù hợp để tăng tính sinh động.`;

    const avatarToggle = document.getElementById('avatarToggle');
    const qaModal = document.getElementById('qaModal');
    const qaClose = document.getElementById('qaClose');
    const qaWelcome = document.getElementById('qaWelcome');
    const qaActive = document.getElementById('qaActive');
    const qaQuestionText = document.getElementById('qaQuestionText');
    const qaAnswerText = document.getElementById('qaAnswerText');
    const qaInput = document.getElementById('qaInput');
    const qaSend = document.getElementById('qaSend');
    const avatar3d = document.getElementById('avatar3d');
    const avatarMouth = document.getElementById('avatarMouth');

    let chatHistory = [];
    let isWaiting = false;

    // Toggle modal
    avatarToggle.addEventListener('click', () => {
        qaModal.classList.toggle('open');
        avatarToggle.classList.toggle('active');
        if (qaModal.classList.contains('open')) {
            setTimeout(() => qaInput.focus(), 300);
        }
    });

    qaClose.addEventListener('click', () => {
        qaModal.classList.remove('open');
        avatarToggle.classList.remove('active');
        stopAvatarTalking();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && qaModal.classList.contains('open')) {
            qaModal.classList.remove('open');
            avatarToggle.classList.remove('active');
            stopAvatarTalking();
        }
    });

    // Send message
    async function sendQuestion(text) {
        text = text.trim();
        if (!text || isWaiting) return;
        isWaiting = true;
        qaInput.value = '';
        qaSend.disabled = true;

        // Show question
        qaWelcome.style.display = 'none';
        qaActive.style.display = 'block';
        qaQuestionText.textContent = text;
        qaAnswerText.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';

        chatHistory.push({ role: 'user', parts: [{ text }] });
        startAvatarThinking();

        try {
            const answer = await callGeminiAPI();
            chatHistory.push({ role: 'model', parts: [{ text: answer }] });
            stopAvatarThinking();
            startAvatarTalking();
            await typewriterAnswer(answer);
        } catch (err) {
            console.error('Gemini error:', err);
            qaAnswerText.innerHTML = '❌ Lỗi khi gọi AI. Vui lòng thử lại sau vài giây.';
            stopAvatarThinking();
            stopAvatarTalking();
            chatHistory.pop();
        }

        isWaiting = false;
        qaSend.disabled = false;
        qaInput.focus();
    }

    // Input listeners
    qaSend.addEventListener('click', () => sendQuestion(qaInput.value));
    qaInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendQuestion(qaInput.value);
        }
    });

    // Suggestion chips
    document.querySelectorAll('.qa-chip').forEach(chip => {
        chip.addEventListener('click', () => sendQuestion(chip.getAttribute('data-q')));
    });

    // Avatar animations
    function startAvatarThinking() {
        avatar3d.classList.add('thinking');
    }

    function stopAvatarThinking() {
        avatar3d.classList.remove('thinking');
    }

    function startAvatarTalking() {
        avatar3d.classList.add('talking');
        avatarMouth.classList.add('talking');
    }

    function stopAvatarTalking() {
        avatar3d.classList.remove('talking');
        avatarMouth.classList.remove('talking');
    }

    // Typewriter answer
    async function typewriterAnswer(text) {
        const parsed = parseMarkdown(text);
        qaAnswerText.innerHTML = '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = parsed;
        const fullText = tempDiv.textContent;
        let displayed = '';

        for (let i = 0; i < fullText.length; i++) {
            displayed += fullText[i];
            qaAnswerText.textContent = displayed;
            await delay(20);
        }

        qaAnswerText.innerHTML = parsed;
        stopAvatarTalking();
    }

    // Helper: delay
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Call Gemini API with retry for 429/503
    async function callGeminiAPI(retries = 3) {
        const body = {
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: chatHistory,
            generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 1024 }
        };

        for (let attempt = 0; attempt <= retries; attempt++) {
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if ((response.status === 429 || response.status === 503) && attempt < retries) {
                const waitTime = [10000, 20000, 40000][attempt];
                console.log(`API error (${response.status}). Retrying in ${waitTime / 1000}s... (attempt ${attempt + 1}/${retries})`);
                await delay(waitTime);
                continue;
            }

            if (!response.ok) throw new Error(`API returned ${response.status}`);

            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            }
            throw new Error('Invalid API response');
        }
        throw new Error('API returned error after all retries');
    }

    // Markdown parser
    function parseMarkdown(text) {
        let html = escapeHtml(text);
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        html = html.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>');
        html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
        html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');
        html = html.replace(/\n/g, '<br>');
        html = html.replace(/<\/ul><br>/g, '</ul>');
        html = html.replace(/<ul><br>/g, '<ul>');
        html = html.replace(/<br><li>/g, '<li>');
        return html;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

});

// ── Prompt Toggle & Copy (global functions) ──
function togglePrompt(btn) {
    const promptItem = btn.closest('.prompt-item');
    const preview = promptItem.querySelector('.prompt-preview');
    const full = promptItem.querySelector('.prompt-full');

    if (full.style.display === 'none') {
        full.style.display = 'block';
        preview.style.display = 'none';
        btn.textContent = '▲ Thu gọn';
    } else {
        full.style.display = 'none';
        preview.style.display = 'block';
        btn.textContent = '▼ Xem chi tiết';
    }
}

function copyPrompt(btn) {
    const promptItem = btn.closest('.prompt-item');
    const code = promptItem.querySelector('.prompt-code');
    if (!code) return;

    navigator.clipboard.writeText(code.textContent).then(() => {
        const original = btn.textContent;
        btn.textContent = '✅ Đã sao chép!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = original;
            btn.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        // Fallback
        const range = document.createRange();
        range.selectNodeContents(code);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand('copy');
        sel.removeAllRanges();
        const original = btn.textContent;
        btn.textContent = '✅ Đã sao chép!';
        setTimeout(() => { btn.textContent = original; }, 2000);
    });
}