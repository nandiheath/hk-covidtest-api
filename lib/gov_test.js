const { fetchCommunityTestingCenters } = require("./gov");

fetchCommunityTestingCenters()
  .then((data) => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch((err) => {
    console.error(err);
  });
