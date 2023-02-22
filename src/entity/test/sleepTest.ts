let count = 0;

(async function () {
    for (let i = 0; i < 5; i++) {
        run();
    }
})();

async function run() {
    const index = count++;
    console.log('run' + index);
    await sleep(2000);
    console.log(index + 'finish');
}

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
