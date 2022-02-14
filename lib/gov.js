const fetch = require("node-fetch");
const { testingCentres } = require("./common");

const API = "https://booking.communitytest.gov.hk/_status/tc.json";

/**
 *
 *
 * @returns {Promise<[{
 *     centre_id: # -1 when centre id not found
 *     name:
 *     linkname:
 *     linkhref:
 *     district:
 *     region:
 *     availabilities: [{
 *         date:
 *         is_available:
 *         text:
 *     }]
 * }]>}
 */
const fetchCommunityTestingCenters = async () => {
  const res = await fetch(API);
  const data = await res.json();

  return data.centres.map((c) => {
    const obj = {
      centre_id: lookupCentreId(c.name),
      name: c.name,
      linkname: c.linkname,
      linkhref: c.linkhref,
      region: c.region,
      district: c.district,
    };

    obj.availabilities = Object.keys(c)
      .filter((k) => k.startsWith("date"))
      .map((key) => {
        const k = key.replace("date", "");
        return {
          date: c[key],
          is_available: c[`symbol${k}`] === "●",
          text: c[`text${k}`],
        };
      });

    return obj;
  });
};

const lookupCentreId = (name) => {
  const c = testingCentres.find((c) => c.gov_name_tc === name);
  if (c === null) {
    console.error(`unable to lookup gov centre by name :${name}`);
  }
  return c ? c.id : "0";
};

module.exports = {
  fetchCommunityTestingCenters,
};
