const fetch = require("node-fetch");
const { testingCentres, LANG_EN, LANG_TC } = require("./common");
const _ = require("lodash");
const async = require("async");

const LIST_CENTRES_API =
  "https://event.thegulu.com/thegulu-rest/web/queue/getFolder/TESTING_CENTER";
const GET_CENTRE_DETAIL_API =
  "https://event.thegulu.com/thegulu-rest/web/queue/getSiteDetail/";

/**
 *  @api {get} :lang/ticket.json Request ticket information for testing centres
 *  @apiName GetTicketInfo
 *  @apiGroup TCInfo
 *  @apiParam {string="en","tc"} lang Language
 *  @apiVersion 0.0.1
 *  @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "metadata": {
 *         "updated_at": "2022-02-14T08:12:25"
 *      },
 *      "data": [{
 *        "centre_id": 3,
 *        "name": "南區利東社區會堂",
 *        "ticket_start": 266,
 *        "ticket_end": 315,
 *        "ticket_now": 420,
 *        "ticket_update": 1644813066276,
 *        "updated_at": 1644813005235
 *     },]
 *    }
 */
const fetchTicketInfoFromGulu = async (lang) => {
  const res = await fetch(LIST_CENTRES_API, {
    headers: {
      "Accept-Language": lang.toUpperCase(),
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
      Referer: "https://event.thegulu.com/site_list/TESTING_CENTER",
    },
  });
  const data = await res.json();

  const regions = data.payload.subFolderList;

  const centres = _.flatten(regions.map((r) => r.siteList));

  let results = await async.parallelLimit(
    centres.map((centre) => fetchCentreInfoFunc(centre, lang)),
    5
  );
  return results.map((c) => ({
    centre_id: lookupCentreId(c.siteId),
    name: lookupCentreName(c.siteId, lang) || c.name,
    code: c.siteId,
    ticket_start: c.start,
    ticket_end: c.end,
    ticket_now: c.ticketSequence,
    ticket_update: c.ticketUpdateTimestamp,
    updated_at: c.updateTimestamp,
  }));
};

const fetchCentreInfoFunc =
  ({ siteId }, lang) =>
  async () => {
    const res = await fetch(GET_CENTRE_DETAIL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": lang.toUpperCase(),
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
      },
      body: JSON.stringify({
        siteId,
      }),
    });

    const data = await res.json();
    return {
      siteId,
      name: data.payload.name,
      ...data.payload.tagList[0],
    };
  };

const lookupCentreId = (code) => {
  const c = testingCentres.find((c) => c.gulu_code === code);
  if (c === null) {
    console.error(`unable to lookup gov centre by name :${code}`);
  }
  return c ? c.id : -1;
};

const lookupCentreName = (code, lang) => {
  const c = testingCentres.find((c) => c.gulu_code === code);
  if (c === null) {
    console.error(`unable to lookup gov centre by name :${code}`);
  }
  return c ? c[`gov_name_${lang}`] || "" : "";
};

module.exports = {
  fetchTicketInfoFromGulu,
};
