const fetch = require("node-fetch");

const API = "https://booking.communitytest.gov.hk/_status/tc.json";

/**
 *
 *
 * @returns {Promise<[{
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

module.exports = {
  fetchCommunityTestingCenters,
};
