const async = require("async");
const fetch = require("node-fetch");
const path = require("path");
const moment = require("moment-timezone");
const mkdirp = require("mkdirp");
const fs = require("fs");

const { fetchCommunityTestingCenters } = require("./lib/gov");

const OUTPUT_DIR = "./publish";

const main = async () => {
  const now = moment().tz("Asia/Hong_Kong");
  const date = now.format("YYYY-MM-DD");
  const time = now.format("HHmm");
  try {
    const data = await fetchCommunityTestingCenters();
    const dir = path.join(OUTPUT_DIR, date, "gov");
    const file = path.join(dir, `${time}.json`);
    await mkdirp(dir);

    const output = {
      metadata: {
        updated_at: now.format("YYYY-MM-DDTHH:mm:ss"),
      },
      data,
    };
    fs.writeFileSync(file, JSON.stringify(output, null, 2));
    const symlinkPath = path.join(OUTPUT_DIR, "gov.json");
    if (fs.existsSync(symlinkPath)) {
      fs.unlinkSync(symlinkPath);
    }
    fs.symlinkSync(path.join(date, "gov", `${time}.json`), symlinkPath);
  } catch (error) {
    console.error("unable to fetch community testing centers from gov API");
    console.error(error);
  }
};

main()
  .then()
  .catch((error) => {
    console.error(error);
  });
