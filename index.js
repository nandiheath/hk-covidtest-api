const path = require("path");
const moment = require("moment-timezone");
const mkdirp = require("mkdirp");
const fs = require("fs");

const { fetchCommunityTestingCenters } = require("./lib/gov");
const { LANG_TC, LANG_EN } = require("./lib/common");
const {fetchTicketInfoFromGulu} = require("./lib/gulu");

const OUTPUT_DIR = "./publish";

const main = async () => {
  const now = moment().tz("Asia/Hong_Kong");
  const date = now.format("YYYY-MM-DD");
  const time = now.format("HHmm");
  for (const lang of [LANG_TC, LANG_EN]) {
    try {
      const data = await fetchCommunityTestingCenters(lang);
      const dir = path.join(OUTPUT_DIR, date, lang, "gov");
      const file = path.join(dir, `${time}.json`);
      await mkdirp(dir);

      const output = {
        metadata: {
          updated_at: now.format("YYYY-MM-DDTHH:mm:ss"),
        },
        data,
      };
      fs.writeFileSync(file, JSON.stringify(output, null, 2));
      const symlinkPath = path.join(OUTPUT_DIR, lang, "booking.json");
      await mkdirp(path.join(OUTPUT_DIR, lang));
      if (fs.existsSync(symlinkPath)) {
        fs.unlinkSync(symlinkPath);
      }
      fs.symlinkSync(
        path.join("..", date, lang, "gov", `${time}.json`),
        symlinkPath
      );
    } catch (error) {
      console.error("unable to fetch community testing centers from gov API");
      console.error(error);
    }


    try {
      const data = await fetchTicketInfoFromGulu(lang);
      const dir = path.join(OUTPUT_DIR, date, lang, "gulu");
      const file = path.join(dir, `${time}.json`);
      await mkdirp(dir);

      const output = {
        metadata: {
          updated_at: now.format("YYYY-MM-DDTHH:mm:ss"),
        },
        data,
      };
      fs.writeFileSync(file, JSON.stringify(output, null, 2));
      const symlinkPath = path.join(OUTPUT_DIR, lang, "ticket.json");
      await mkdirp(path.join(OUTPUT_DIR, lang));
      if (fs.existsSync(symlinkPath)) {
        fs.unlinkSync(symlinkPath);
      }
      fs.symlinkSync(
          path.join("..", date, lang, "gulu", `${time}.json`),
          symlinkPath
      );
    } catch (error) {
      console.error("unable to fetch community testing centers from gulu API");
      console.error(error);
    }
  }
};

main()
  .then()
  .catch((error) => {
    console.error(error);
  });
