export const actionGifs = {
    hug: [
        "https://media.tenor.com/kCZjTqCKiggAAAAC/hug.gif",
        "https://media.tenor.com/J7e9ukTPs1sAAAAC/anime-hug.gif",
        "https://media.tenor.com/9e1aE_xRLz0AAAAC/anime-hug.gif",
        "https://media.tenor.com/wUQH5CF2DJ4AAAAC/hug-anime.gif"
    ],
    kiss: [
        "https://media.tenor.com/F02Ep3b2jJgAAAAC/cute-kawai.gif",
        "https://media.tenor.com/dn_KuO215W0AAAAC/kiss-anime.gif",
        "https://media.tenor.com/WoT0wJ3A1xQAAAAC/kiss-anime.gif"
    ],
    slap: [
        "https://media.tenor.com/XiYuU9h44-AAAAAC/anime-slap-mad.gif",
        "https://media.tenor.com/Ws6Dm1ZW_vMAAAAC/girl-slap.gif",
        "https://media.tenor.com/ra17G61QRQQAAAAC/slap.gif"
    ],
    pat: [
        "https://media.tenor.com/Y7B6npa9mXcAAAAC/pat.gif",
        "https://media.tenor.com/E6fMkQRZBdIAAAAC/anime-pat.gif",
        "https://media.tenor.com/dmYhPDHbbI4AAAAC/pat-head.gif"
    ],
    cuddle: [
        "https://media.tenor.com/AslEAmk_hvoAAAAC/cuddle-anime.gif",
        "https://media.tenor.com/7jK8GkX8aX4AAAAC/anime-cuddle.gif"
    ],
    poke: [
        "https://media.tenor.com/y4R6FhrWlswAAAAC/poke-anime.gif",
        "https://media.tenor.com/1YQy8yQy8yQAAAAC/poke-anime.gif"
    ],
    kill: [
        "https://media.tenor.com/G_0W8j0W8j0AAAAC/kill-anime.gif",
        "https://media.tenor.com/1YQy8yQy8yQAAAAC/kill-anime.gif"
    ],
    dance: [
        "https://media.tenor.com/1YQy8yQy8yQAAAAC/dance-anime.gif",
        "https://media.tenor.com/1YQy8yQy8yQAAAAC/dance-anime.gif"
    ],
    cry: [
        "https://media.tenor.com/1YQy8yQy8yQAAAAC/cry-anime.gif",
        "https://media.tenor.com/1YQy8yQy8yQAAAAC/cry-anime.gif"
    ]
};

export const getRandomGif = (action) => {
    const gifs = actionGifs[action];
    if (!gifs) return null;
    return gifs[Math.floor(Math.random() * gifs.length)];
};
