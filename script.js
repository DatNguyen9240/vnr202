/* ============================================
   CHIẾN DỊCH ĐIỆN BIÊN PHỦ — SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ══════════════════════════════════════════
    //  LEAFLET TACTICAL MAP — Điện Biên Phủ
    // ══════════════════════════════════════════
    const mapContainer = document.getElementById('leaflet-tactical-map');
    if (mapContainer && typeof L !== 'undefined') {
        // Initialize map centered on Dien Bien Phu valley
        const dbpMap = L.map('leaflet-tactical-map', {
            center: [21.386, 103.013],
            zoom: 14,
            minZoom: 13,
            maxZoom: 17,
            zoomControl: true,
            attributionControl: true,
            scrollWheelZoom: true,
            dragging: true
        });

        // Satellite terrain tile layer (Esri World Imagery)
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
            maxZoom: 18
        }).addTo(dbpMap);

        // ── Helper: Create French position marker ──
        function createFrenchMarker(lat, lng, name, subName, isHQ) {
            const dotClass = isHQ ? 'french-marker-dot hq' : 'french-marker-dot';
            const size = isHQ ? [22, 22] : [16, 16];
            const icon = L.divIcon({
                className: 'french-marker',
                html: `<div class="${dotClass}"></div>`,
                iconSize: size,
                iconAnchor: [size[0] / 2, size[1] / 2]
            });

            const marker = L.marker([lat, lng], { icon }).addTo(dbpMap);

            // Name label
            marker.bindTooltip(name, {
                permanent: true,
                direction: isHQ ? 'bottom' : 'top',
                offset: isHQ ? [0, 16] : [0, -12],
                className: isHQ ? 'french-label' : 'french-label'
            });

            // Sub-name label (Vietnamese name)
            if (subName) {
                const subMarker = L.marker([lat, lng], {
                    icon: L.divIcon({ className: 'hidden-anchor', iconSize: [0, 0] })
                }).addTo(dbpMap);
                subMarker.bindTooltip(subName, {
                    permanent: true,
                    direction: 'bottom',
                    offset: isHQ ? [0, 30] : [0, 8],
                    className: 'french-sub-label'
                });
            }

            // Popup with info
            marker.bindPopup(`
                <div style="font-family: 'Inter', sans-serif; min-width: 150px;">
                    <strong style="color: #e74c3c; font-size: 14px;">${name}</strong>
                    ${subName ? `<br><em style="color: #999; font-size: 11px;">${subName}</em>` : ''}
                    ${isHQ ? '<br><span style="color: #e74c3c; font-weight: 700; font-size: 10px;">SỞ CHỈ HUY</span>' : ''}
                </div>
            `);

            return marker;
        }

        // ── Helper: Create VM Division marker ──
        function createDivisionMarker(lat, lng, name, subName) {
            const icon = L.divIcon({
                className: 'vm-division-marker',
                html: '<div class="vm-division-star">⭐</div>',
                iconSize: [28, 28],
                iconAnchor: [14, 14]
            });

            const marker = L.marker([lat, lng], { icon }).addTo(dbpMap);
            marker.bindTooltip(name, {
                permanent: true,
                direction: 'bottom',
                offset: [0, 14],
                className: 'vm-label'
            });

            if (subName) {
                const subMarker = L.marker([lat, lng], {
                    icon: L.divIcon({ className: 'hidden-anchor', iconSize: [0, 0] })
                }).addTo(dbpMap);
                subMarker.bindTooltip(subName, {
                    permanent: true,
                    direction: 'bottom',
                    offset: [0, 28],
                    className: 'french-sub-label'
                });
            }

            return marker;
        }

        // ── French Positions ──
        // HQ: Claudine / Mường Thanh
        createFrenchMarker(21.3845, 103.0135, 'Mường Thanh', '(Claudine)', true);

        // Add HQ badge separately
        const hqBadge = L.marker([21.3845, 103.0135], {
            icon: L.divIcon({ className: 'hidden-anchor', iconSize: [0, 0] })
        }).addTo(dbpMap);
        hqBadge.bindTooltip('SỞ CHỈ HUY', {
            permanent: true,
            direction: 'top',
            offset: [0, -16],
            className: 'hq-label'
        });

        // Béatrice / Him Lam (NE)
        createFrenchMarker(21.3965, 103.0305, 'Béatrice', 'Him Lam', false);

        // Gabrielle / Độc Lập (N)
        createFrenchMarker(21.4060, 103.0085, 'Gabrielle', 'Độc Lập', false);

        // Anne-Marie / Bản Kéo (NW)
        createFrenchMarker(21.3960, 102.9985, 'Anne-Marie', 'Bản Kéo', false);

        // Huguette (W)
        createFrenchMarker(21.3880, 103.0040, 'Huguette', null, false);

        // Dominique (E)
        createFrenchMarker(21.3905, 103.0225, 'Dominique', null, false);

        // Éliane / Đồi A1 (E-SE)
        createFrenchMarker(21.3830, 103.0235, 'Éliane', '(Đồi A1)', false);

        // Isabelle (S, isolated)
        createFrenchMarker(21.3520, 103.0130, 'Isabelle', 'Cô lập', false);

        // ── French Perimeter (dashed ellipse approximation) ──
        const perimeterPoints = [];
        const cx = 21.3855, cy = 103.013;
        const rx = 0.012, ry = 0.016;
        for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * 2 * Math.PI;
            perimeterPoints.push([
                cx + ry * Math.sin(angle),
                cy + rx * Math.cos(angle)
            ]);
        }
        L.polyline(perimeterPoints, {
            color: '#e74c3c',
            weight: 1.5,
            opacity: 0.2,
            dashArray: '8 5'
        }).addTo(dbpMap);

        // ── Airstrip ──
        L.polyline([
            [21.3895, 103.0065],
            [21.3805, 103.0185]
        ], {
            color: 'rgba(255,255,255,0.25)',
            weight: 8,
            opacity: 0.5
        }).addTo(dbpMap);

        L.polyline([
            [21.3895, 103.0065],
            [21.3805, 103.0185]
        ], {
            color: 'rgba(255,255,255,0.4)',
            weight: 2,
            dashArray: '6 8'
        }).addTo(dbpMap);

        // ── Vietnamese Division Positions & Attack Arrows ──
        const goldColor = '#f1c40f';
        const arrowOpts = {
            color: goldColor,
            weight: 2.5,
            opacity: 0.7,
            dashArray: '10 6'
        };

        // SĐ 308 → Gabrielle (from NW)
        createDivisionMarker(21.4200, 102.9800, 'SĐ 308', null);
        L.polyline([[21.4200, 102.9800], [21.4060, 103.0085]], arrowOpts).addTo(dbpMap);

        // SĐ 312 → Béatrice (from NE)
        createDivisionMarker(21.4180, 103.0500, 'SĐ 312', null);
        L.polyline([[21.4180, 103.0500], [21.3965, 103.0305]], arrowOpts).addTo(dbpMap);

        // SĐ 316 → Dominique/Éliane (from E)
        createDivisionMarker(21.3850, 103.0500, 'SĐ 316', null);
        L.polyline([[21.3850, 103.0500], [21.3905, 103.0225]], arrowOpts).addTo(dbpMap);

        // SĐ 304 → Isabelle (from S)
        createDivisionMarker(21.3300, 103.0130, 'SĐ 304', null);
        L.polyline([[21.3300, 103.0130], [21.3520, 103.0130]], arrowOpts).addTo(dbpMap);

        // PB 351 - Pháo binh (from W)
        createDivisionMarker(21.3860, 102.9780, 'PB 351', 'Pháo binh');
        L.polyline([[21.3860, 102.9780], [21.3880, 103.0040]], arrowOpts).addTo(dbpMap);

        // ── Connection line from HQ to Isabelle (dotted, showing isolation) ──
        L.polyline([
            [21.3700, 103.0135],
            [21.3520, 103.0130]
        ], {
            color: '#e74c3c',
            weight: 1,
            opacity: 0.15,
            dashArray: '4 8'
        }).addTo(dbpMap);

        // Invalidate size when map becomes visible
        const mapObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    dbpMap.invalidateSize();
                    mapObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        mapObs.observe(mapContainer);
        setTimeout(() => { dbpMap.invalidateSize(); }, 1000);
    }

    // ══════════════════════════════════════════
    //  LEAFLET SIEGE MAP — Vây Lấn Diagram
    // ══════════════════════════════════════════
    const siegeContainer = document.getElementById('leaflet-siege-map');
    if (siegeContainer && typeof L !== 'undefined') {
        const siegeMap = L.map('leaflet-siege-map', {
            center: [21.385, 103.013],
            zoom: 14,
            minZoom: 13,
            maxZoom: 17,
            zoomControl: true,
            scrollWheelZoom: true
        });

        // Satellite tiles
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri',
            maxZoom: 18
        }).addTo(siegeMap);

        // ── French Positions ──
        const siegePositions = [
            { lat: 21.3845, lng: 103.0135, name: 'Claudine', isHQ: true },
            { lat: 21.3965, lng: 103.0305, name: 'Béatrice', explosion: true },
            { lat: 21.4060, lng: 103.0085, name: 'Gabrielle', explosion: true },
            { lat: 21.3960, lng: 102.9985, name: 'Anne-Marie' },
            { lat: 21.3880, lng: 103.0040, name: 'Huguette' },
            { lat: 21.3905, lng: 103.0225, name: 'Dominique' },
            { lat: 21.3830, lng: 103.0235, name: 'Éliane (A1)', explosion: true },
            { lat: 21.3520, lng: 103.0130, name: 'Isabelle', isolated: true }
        ];

        siegePositions.forEach(pos => {
            const dotClass = pos.isHQ ? 'french-marker-dot hq' : 'french-marker-dot';
            const size = pos.isHQ ? [22, 22] : [16, 16];
            const icon = L.divIcon({
                className: 'french-marker',
                html: `<div class="${dotClass}"></div>`,
                iconSize: size,
                iconAnchor: [size[0] / 2, size[1] / 2]
            });

            const marker = L.marker([pos.lat, pos.lng], { icon }).addTo(siegeMap);
            marker.bindTooltip(pos.name, {
                permanent: true,
                direction: pos.isHQ ? 'center' : 'top',
                offset: pos.isHQ ? [0, 0] : [0, -12],
                className: pos.isHQ ? 'hq-label' : 'french-label'
            });

            // Explosion effect marker
            if (pos.explosion) {
                const expIcon = L.divIcon({
                    className: 'french-marker',
                    html: '<div class="explosion-marker-dot"></div>',
                    iconSize: [10, 10],
                    iconAnchor: [5, 5]
                });
                L.marker([pos.lat, pos.lng], { icon: expIcon }).addTo(siegeMap);
            }

            // Isolated label for Isabelle
            if (pos.isolated) {
                const isoMarker = L.marker([pos.lat, pos.lng], {
                    icon: L.divIcon({ className: 'hidden-anchor', iconSize: [0, 0] })
                }).addTo(siegeMap);
                isoMarker.bindTooltip('cô lập', {
                    permanent: true,
                    direction: 'bottom',
                    offset: [0, 14],
                    className: 'french-sub-label'
                });
            }
        });

        // ── Trench Rings (concentric circles) ──
        const trenchCenter = [21.385, 103.013];
        L.circle(trenchCenter, {
            radius: 1800,
            color: '#f1c40f',
            weight: 1.5,
            opacity: 0.4,
            fillColor: 'transparent',
            fill: false,
            dashArray: '8 5'
        }).addTo(siegeMap);

        L.circle(trenchCenter, {
            radius: 1400,
            color: '#f1c40f',
            weight: 2,
            opacity: 0.5,
            fillColor: 'transparent',
            fill: false,
            dashArray: '6 4'
        }).addTo(siegeMap);

        L.circle(trenchCenter, {
            radius: 1000,
            color: '#f1c40f',
            weight: 2.5,
            opacity: 0.7,
            fillColor: 'transparent',
            fill: false,
            dashArray: '5 3'
        }).addTo(siegeMap);

        // ── French Perimeter ──
        const perimeterPts = [];
        for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * 2 * Math.PI;
            perimeterPts.push([
                21.3855 + 0.016 * Math.sin(angle),
                103.013 + 0.012 * Math.cos(angle)
            ]);
        }
        L.polyline(perimeterPts, {
            color: '#e74c3c',
            weight: 1.5,
            opacity: 0.15,
            dashArray: '5 4'
        }).addTo(siegeMap);

        // ── VM Division Positions & Attack Arrows ──
        const goldOpts = { color: '#f1c40f', weight: 2.5, opacity: 0.7, dashArray: '10 6' };

        const divisions = [
            { lat: 21.4200, lng: 102.9800, name: 'SĐ 308', target: [21.4060, 103.0085] },
            { lat: 21.4180, lng: 103.0500, name: 'SĐ 312', target: [21.3965, 103.0305] },
            { lat: 21.3850, lng: 103.0500, name: 'SĐ 316', target: [21.3905, 103.0225] },
            { lat: 21.3300, lng: 103.0130, name: 'SĐ 304', target: [21.3520, 103.0130] },
            { lat: 21.3860, lng: 102.9780, name: 'PB 351', target: [21.3880, 103.0040] }
        ];

        divisions.forEach(div => {
            const icon = L.divIcon({
                className: 'vm-division-marker',
                html: '<div class="vm-division-star">⭐</div>',
                iconSize: [28, 28],
                iconAnchor: [14, 14]
            });

            const marker = L.marker([div.lat, div.lng], { icon }).addTo(siegeMap);
            marker.bindTooltip(div.name, {
                permanent: true,
                direction: 'bottom',
                offset: [0, 14],
                className: 'vm-label'
            });

            L.polyline([[div.lat, div.lng], div.target], goldOpts).addTo(siegeMap);
        });

        // ── Isolation line HQ → Isabelle ──
        L.polyline([[21.3700, 103.0135], [21.3520, 103.0130]], {
            color: '#e74c3c',
            weight: 1,
            opacity: 0.15,
            dashArray: '4 8'
        }).addTo(siegeMap);
        // Invalidate size when map becomes visible
        const siegeObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    siegeMap.invalidateSize();
                    siegeObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        siegeObs.observe(siegeContainer);
        setTimeout(() => { siegeMap.invalidateSize(); }, 1000);
    }

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

    const GEMINI_API_KEY = 'AIzaSyCnvJolLrA9Xl502CyMLq5htLQEElOcXco';
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