import { createArtGen, PseudoRandom } from "@stakeordie/emprops-core";

const artGen = createArtGen({
    debug: false,
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

artGen.onNewToken(async (token, api) => {
    const rng = new PseudoRandom(token.seed);
    const seed = rng.pseudorandomInteger(1933648831, 4294967295);
    const myImage = await api.loadImage("./src/assets/yuta.jpeg");
    let image = await api.runSd({
        image: myImage,
        api: "img2img",
        prompt: `A photorealistic image of a person, studio lights`,
        negativePrompt: "((letters)), ((numbers)), ((text)), ((symbols)), ((sentences)), ((paragraphs)), ((web interface)), ((gui)), ((web app)), ((desktop app))",
        seed,
        samplerIndex: "Euler a"
    });
    image = await api.runSdUpscaler({
        image,
        upscaler1: "R-ESRGAN 4x+"
    });

    return image;
});

artGen.start(2);