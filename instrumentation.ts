export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("NigStar platform started");
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
  }
}
