document.addEventListener("DOMContentLoaded", () => {
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const inviteCard = document.getElementById("inviteCard");
    const successCard = document.getElementById("successCard");
    const heartsBg = document.getElementById("heartsBg");

    // CallMeBot WhatsApp API Key config
    // Send "I allow callmebot to send me messages" on WhatsApp to CallMeBot (+34 623 78 64 49) to get your API key.
    const CALLMEBOT_API_KEY = "YOUR_API_KEY_HERE"; 

    let evasionCount = 0;
    let yesScale = 1.0;
    let noScale = 1.0;

    const phrases = [
        "Are you sure? 🤔",
        "Think again! 🤨",
        "Please? 🥺",
        "No way! 😜",
        "You can't click me! 🏃‍♂️",
        "Just say yes! ❤️",
        "Click the other button! 👉",
        "Nice try! 😹",
        "Give up! 😉",
        "Nope! 🚫"
    ];

    // Create floating hearts in background
    function createFloatingHeart() {
        const heart = document.createElement("div");
        heart.classList.add("floating-heart");
        heart.innerText = Math.random() > 0.5 ? "❤️" : "💖";
        
        // Random style settings
        const startX = Math.random() * window.innerWidth;
        const duration = 5 + Math.random() * 5; // 5 to 10 seconds
        const size = 12 + Math.random() * 24; // 12px to 36px
        
        heart.style.left = `${startX}px`;
        heart.style.fontSize = `${size}px`;
        heart.style.animationDuration = `${duration}s`;
        
        heartsBg.appendChild(heart);
        
        // Clean up heart after animation ends
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    // Spawn initial hearts and set interval
    for (let i = 0; i < 15; i++) {
        setTimeout(createFloatingHeart, Math.random() * 3000);
    }
    setInterval(createFloatingHeart, 600);

    // Interaction logic for No button (stands still but shakes and shrinks)
    function handleNoClick(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        evasionCount++;

        // Add shake animation class (triggering reflow to restart it)
        noBtn.classList.remove("shake");
        void noBtn.offsetWidth; 
        noBtn.classList.add("shake");

        // Grow Yes button, Shrink No button
        if (yesScale < 2.5) {
            yesScale += 0.15;
            yesBtn.style.transform = `scale(${yesScale})`;
        }
        if (noScale > 0.4) {
            noScale -= 0.08;
            noBtn.style.transform = `scale(${noScale})`;
            noBtn.style.setProperty('--no-scale', noScale);
        }

        // Update No button text based on clicks
        const phraseIndex = Math.min(evasionCount - 1, phrases.length - 1);
        noBtn.innerText = phrases[phraseIndex];

        // CallMeBot Integration: notify you on WhatsApp silently
        if (CALLMEBOT_API_KEY && CALLMEBOT_API_KEY !== "YOUR_API_KEY_HERE") {
            const formattedMsg = encodeURIComponent(`Sharlene tried to click "No"! 😜 (Attempt #${evasionCount})`);
            const url = `https://api.callmebot.com/whatsapp.php?phone=254711490732&text=${formattedMsg}&apikey=${CALLMEBOT_API_KEY}`;
            fetch(url, { mode: 'no-cors' }).catch(() => {});
        }

        // Cute bubble warnings
        const warningMessages = [
            "Nice try! 😉 Choose YES!",
            "Error: Choice invalid! ❌",
            "That button is broken! 🛠️",
            "Access Denied! 😜",
            "Try the big pink one! 👉",
            "Nope, still doesn't work! 🚫",
            "Give up already! 😂"
        ];
        
        const bubble = document.createElement("div");
        const warningIndex = Math.min(evasionCount - 1, warningMessages.length - 1);
        bubble.innerText = warningMessages[warningIndex];
        bubble.style.position = "fixed";
        bubble.style.background = "#ff6b8b";
        bubble.style.color = "#fff";
        bubble.style.padding = "10px 20px";
        bubble.style.borderRadius = "20px";
        
        // Position it right above the card
        const cardRect = inviteCard.getBoundingClientRect();
        bubble.style.top = `${cardRect.top - 50}px`;
        bubble.style.left = "50%";
        bubble.style.transform = "translateX(-50%)";
        bubble.style.zIndex = "999";
        bubble.style.boxShadow = "0 4px 15px rgba(0,0,0,0.15)";
        bubble.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        document.body.appendChild(bubble);

        // Fade out and remove warning bubble
        setTimeout(() => {
            bubble.style.opacity = "0";
            bubble.style.transform = "translateX(-50%) translateY(-10px)";
            setTimeout(() => bubble.remove(), 300);
        }, 1500);
    }

    // Clean up shake class after animation completes
    noBtn.addEventListener("animationend", () => {
        noBtn.classList.remove("shake");
    });

    noBtn.addEventListener("click", handleNoClick);
    noBtn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        handleNoClick(e);
    });

    // Yes button action
    yesBtn.addEventListener("click", () => {
        // Trigger Canvas Confetti
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#ff6b8b', '#ff477e', '#ffd0e3', '#ffffff', '#ff9ebe']
        });

        // Trigger side bursts for a spectacular feel
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
        }, 250);
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });
        }, 400);

        // Animate out invite card and animate in success card
        inviteCard.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        inviteCard.style.opacity = "0";
        inviteCard.style.transform = "scale(0.8) translateY(-30px)";

        setTimeout(() => {
            inviteCard.style.display = "none";
            
            // Setup success card entry state
            successCard.style.display = "block";
            successCard.style.opacity = "0";
            successCard.style.transform = "scale(0.8) translateY(30px)";
            
            // Force reflow
            successCard.offsetHeight;
            
            // Animate success card in
            successCard.style.transition = "opacity 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
            successCard.style.opacity = "1";
            successCard.style.transform = "scale(1) translateY(0)";

            // Loop a gentle confetti stream
            const end = Date.now() + (6 * 1000); // 6 seconds of confetti
            (function frame() {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#ff6b8b', '#ffd0e3']
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#ff6b8b', '#ffd0e3']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }, 400);
    });
});
