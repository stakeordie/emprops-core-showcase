import { createArtGen, PseudoRandom } from "emprops.js";

const artGen = createArtGen({
    debug: true,
    storage: {
        path: "./outputs"
    },
    sd: {
        url: "https://sd-webui-pu.emprops.io",
        credentials: {
            username: "santiago",
            password: "Trlp1n3Prav"
        }
    }
});

artGen.onNewToken(async ({ seed: tokenSeed }, api) => {
    const rng = new PseudoRandom(tokenSeed);
    const seed = rng.pseudorandomInteger(1933648831, 4294967295);
    const nationality = rng.pseudorandomPick(["mexican", "american", "chinese", "japanese"])
    const myImage = await api.loadImage("./src/assets/yuta.jpeg");
    let image = await api.runSd({
        init_images: [myImage.content],
        api: "img2img",
        prompt: `A photorealistic image of a ${nationality} person`,
        negative_prompt: "((letters)), ((numbers)), ((text)), ((symbols)), ((sentences)), ((paragraphs)), ((web interface)), ((gui)), ((web app)), ((desktop app))",
        seed,
        sampler_index: "Euler a"
    });
    image = await api.runSdUpscaler({
        image,
        upscaler_1: "R-ESRGAN 4x+"
    });

    return image;
});

artGen.start(2);