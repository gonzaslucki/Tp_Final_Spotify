window.onload = function() {
    const content = document.getElementById('ascii-content');
    const background = document.getElementById('ascii-background');
    const numRows = 50; // Number of rows in the background
    const numColumns = 230; // Number of columns in the background
    let frameIndex = 0;
    let frames = [
        `       _______________________________________________________________________
       |                                                                      |
       |      .d8888. d8888b.  .d88b.  d888888b d888888b d88888b db    db     | 
       |      88'  YP 88  '8D .8P  Y8. '~~88~~'   '88'   88'     '8b  d8'     |
       |      '8bo.   88oodD' 88    88    88       88    88ooo    '8bd8'      |
       |        'Y8b. 88~~~   88    88    88       88    88~~~      88        |
       |      db   8D 88      '8b  d8'    88      .88.   88         88        |
       |      '8888Y' 88       'Y88P'     YP    Y888888P YP         YP        |
       |                                                                      |
       _______________________________________________________________________`,
    ];

    setInterval(playFrames, 1000 / 6); // This will play 2 frames per second

    function playFrames() {
        if (frames.length > 0) {
            const backgroundFrame = generateBackgroundFrame();
            background.innerText = backgroundFrame;
            // content.innerText = frames[frameIndex];
            // frameIndex = (frameIndex + 1) % frames.length;
        }
    }

    function generateBackgroundFrame() {
        const characters = ['-', '|', '/', '\\', '*', ' ','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o'];
        let backgroundFrame = '';
        for (let row = 0; row < numRows; row++) {
            for (let column = 0; column < numColumns; column++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                backgroundFrame += characters[randomIndex];
            }
            backgroundFrame += '\n'; // Add a line break after each row
        }
        return backgroundFrame;
    }
};
