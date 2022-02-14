const fetch = require("node-fetch");
const { testingCentres } = require("./common");

const API = "https://booking.communitytest.gov.hk/_status/tc.json";

/**
 *  @api {get} /:lang/gov.json Request official testing centre data information
 *  @apiName GetGovTestingCentres
 *  @apiGroup TestingCentreInfo
 *  @apiParam {string="en","tc"} lang Locale
 *  @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "metadata": {
 *         "updated_at": "2022-02-14T08:12:25"
 *      },
 *      "data": [{
 *          "centre_id": 1,
 *          "name": "灣仔禮頓山社區會堂",
 *          "linkname": "< 預約 >",
 *          "linkhref": "https://booking.communitytest.gov.hk/form/index_tc.jsp",
 *          "region": "",
 *          "district": "灣仔區",
 *          "availabilities": [
 *            {
 *              "date": "14/02",
 *              "is_available": false,
 *              "text": "預約名額已滿"
 *            },
 *      }]
 *    }
 *   }
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
