kaboom({
    width: 800,
    height: 400,
    background: [135, 206, 235], // আকাশী রঙ
});

// ১. ছবি এবং সাউন্ড লোড করা
loadSprite("runnerBody", "assets/runner-body.png");
loadSprite("runnerFace", "assets/runner-face.png");
loadSprite("chaserBody", "assets/chaser-body.png");
loadSprite("chaserFace", "assets/chaser-face.png");
loadSound("dhorSound", "assets/dhor-re.mp3");

// গেম শুরু করার মেইন ফাংশন
scene("game", () => {
    let score = 0;
    const SPEED = 350;

    // মাটি তৈরি
    add([
        rect(width(), 48),
        pos(0, height() - 48),
        area(),
        body({ isStatic: true }),
        color(34, 139, 34)
    ]);

    // রানার (শরীরের অংশ)
    const runner = add([
        sprite("runnerBody"),
        pos(200, height() - 120),
        area(),
        body(),
        "player"
    ]);

    // রানারের মাথা (মুখের অংশ)
    const runnerHead = add([
        sprite("runnerFace"),
        pos(runner.pos.x, runner.pos.y),
        scale(0.4), // মুখ ছোট বা বড় করার জন্য
        anchor("center")
    ]);

    // চেইজার (শরীরের অংশ)
    const chaser = add([
        sprite("chaserBody"),
        pos(50, height() - 120),
    ]);

    // চেইজারের মাথা
    const chaserHead = add([
        sprite("chaserFace"),
        pos(chaser.pos.x, chaser.pos.y),
        scale(0.4),
        anchor("center")
    ]);

    // স্কোরবোর্ড
    const scoreLabel = add([
        text("স্কোর: 0"),
        pos(24, 24),
    ]);

    // জাম্প কন্ট্রোল
    onKeyPress("space", () => {
        if (runner.isGrounded()) runner.jump(750);
    });
    onClick(() => {
        if (runner.isGrounded()) runner.jump(750);
    });

    // প্রতি মুহূর্তে মাথাকে বডির সাথে মুভ করানো
    onUpdate(() => {
        score++;
        scoreLabel.text = "স্কোর: " + score;

        // মাথাগুলো বডির ঘাড়ের পজিশন অনুযায়ী বসানো
        // +20 বা -20 করে পজিশন ঠিক করে নিবেন
        runnerHead.pos.x = runner.pos.x + 30; 
        runnerHead.pos.y = runner.pos.y - 10;

        chaserHead.pos.x = chaser.pos.x + 30;
        chaserHead.pos.y = chaser.pos.y - 10;
    });

    // বাধা (Obstacles)
    loop(1.8, () => {
        add([
            rect(40, rand(40, 80)),
            area(),
            pos(width(), height() - 48),
            anchor("botleft"),
            color(150, 75, 0),
            move(LEFT, SPEED),
            "obstacle"
        ]);
    });

    // সাউন্ড প্লে করা
    loop(5, () => {
        play("dhorSound", { volume: 0.5 });
    });

    // গেম ওভার
    runner.onCollide("obstacle", () => {
        shake();
        go("lose", score);
    });
});

// হারার পরের সিন
scene("lose", (s) => {
    add([
        text(`ধরা খাইছেন!\nস্কোর: ${s}`, { size: 40 }),
        pos(center()),
        anchor("center")
    ]);
    add([
        text("আবার খেলতে ক্লিক করুন", { size: 20 }),
        pos(width()/2, height()/2 + 100),
        anchor("center")
    ]);
    onClick(() => go("game"));
});

// শুরুতেই গেম লোড করা
go("game");
