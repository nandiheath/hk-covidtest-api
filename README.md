# hk-covidtest-api
Scrape data from different source and publish to GH Pages as API

## API Doc

- https://nandiheath.github.io/hk-covidtest-api

## Development

```shell
# testing with gov API
node lib/gov_test.js

# testing with gulu API
node lib/gulu_test.js
```

##  Runbook

### `centre_id` is -1

Run GET `https://event.thegulu.com/thegulu-rest/web/queue/getFolder/TESTING_CENTER` and check what is the missing centre.
Add the centre to `lib/common.js`

## TODO

Throws error at the end of the program when API failure, and add "continue if error" to Github Action.
This allows email notification fired when API abnormal.
