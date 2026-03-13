import { build } from 'vite';

async function run() {
  try {
    await build();
    console.log("Build successful");
  } catch (err) {
    console.error("BUILD ERROR DETAILS:");
    console.error(err);
    if (err.errors) console.error(JSON.stringify(err.errors, null, 2));
    if (err.message) console.error(err.message);
  }
}
run();
