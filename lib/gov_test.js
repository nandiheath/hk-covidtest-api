const { fetchCommunityTestingCenters } = require("./gov");

fetchCommunityTestingCenters("tc")
  .then((data) => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch((err) => {
    console.error(err);
  });
