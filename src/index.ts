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
    const animal = rng.pseudorandomPick(["dog", "cat", "bird", "fish", "lions", "lizards"]);
    let image = await api.runSd({
        api: "txt2img",
        prompt: `The full body of a ${animal}, Unity rendering, Pixar style`,
        negative_prompt: "((letters)), ((numbers)), ((text)), ((symbols)), ((sentences)), ((paragraphs)), ((web interface)), ((gui)), ((web app)), ((desktop app))",
        seed,
        sampler_index: "PLMS"
    });
    image = await api.runSdUpscaler({
        image,
        upscaler_1: "R-ESRGAN 4x+"
    });

    return image;
});

artGen.start(10);