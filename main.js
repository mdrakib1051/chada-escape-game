const startBtn = document.getElementById("startBtn");
const ui = document.getElementById("ui");

let runnerImgData = null;
let chaserImgData = null;

// ইমেজ আপলোড হ্যান্ডলিং
document.getElementById("runnerFace").onchange = (e) => {
    const reader = new FileReader();
    reader.onload = () => runnerImgData = reader.result;
    reader.readAsDataURL(e.target.files[0]);
};

document.getElementById("chaserFace").onchange = (e) => {
    const reader = new FileReader();
    reader.onload = () => chaserImgData = reader.result;
    reader.readAsDataURL(e.target.files[0]);
};

startBtn.onclick = () => {
    if (!runnerImgData || !chaserImgData) {
        alert("দয়া করে দুটি ফেসই আপলোড করুন!");
        return;
    }
    ui.style.display = "none";
    startGame();
};

function startGame() {
    kaboom({
        width: 800,
        height: 400,
        background: [135, 206, 235],
    });

    // ফেসগুলো লোড করা
    loadSprite("runnerFace", runnerImgData);
    loadSprite("chaserFace", chaserImgData);
    
    // সাউন্ড লোড (আপনার assets ফোল্ডারে এই ফাইলটি থাকতে হবে)
    loadSound("dhor", "assets/dhor-re.mp3");

    let score = 0;
    const SPEED = 320;

    // মাটি
    const floor = add([
        rect(width(), 48),
        pos(0, height() - 48),
        outline(4),
        area(),
        body({ isStatic: true }),
        color(127, 255, 0)
    ]);

    // রানার বডি (কার্টুন)
    const runner = add([
        rect(40, 60), // বডি
        pos(200, height() - 100),
        area(),
        body(),
        color(0, 100, 255),
        "player"
    ]);

    // রানারের বড় মাথা
    const runnerHead = add([
        sprite("runnerFace"),
        pos(runner.pos.x, runner.pos.y),
        scale(0.3), // মাথা বড় দেখানোর জন্য স্কেল
        anchor("center")
    ]);

    // চেইজার বডি
    const chaser = add([
        rect(40, 60),
        pos(40, height() - 100),
        color(255, 50, 50)
    ]);

    // চেইজারের মাথা
    const chaserHead = add([
        sprite("chaserFace"),
        pos(chaser.pos.x, chaser.pos.y),
        scale(0.35),
        anchor("center")
    ]);

    // মাথাগুলো বডির সাথে মুভ করার লজিক
    onUpdate(() => {
        runnerHead.pos.x = runner.pos.x + 20;
        runnerHead.pos.y = runner.pos.y - 10;
        
        chaserHead.pos.x = chaser.pos.x + 20;
        chaserHead.pos.y = chaser.pos.y - 10;
        
        // স্কোর বাড়ানো
        score++;
    });

    // জাম্প
    onKeyPress("space", () => {
        if (runner.isGrounded()) runner.jump(700);
    });
    onClick(() => {
        if (runner.isGrounded()) runner.jump(700);
    });

    // বাধা তৈরি করা
    loop(1.5, () => {
        add([
            rect(30, rand(30, 70)),
            area(),
            pos(width(), height() - 48),
            anchor("botleft"),
            color(139, 69, 19),
            move(LEFT, SPEED),
            "obstacle"
        ]);
    });

    // সাউন্ড লুপ
    loop(4, () => {
        play("dhor", { volume: 0.6 });
    });

    // ধাক্কা খেলে গেম ওভার
    runner.onCollide("obstacle", () => {
        shake();
        go("lose", score);
    });

    // গেম ওভার স্ক্রিন
    scene("lose", (s) => {
        add([
            text(`ধরা খাইছেন!\nস্কোর: ${s}`, { size: 40 }),
            pos(center()),
            anchor("center"),
            color(255, 255, 255)
        ]);
        add([
            text("আবার খেলতে ক্লিক করুন", { size: 20 }),
            pos(width()/2, height()/2 + 80),
            anchor("center")
        ]);
        onClick(() => location.reload());
    });
}

