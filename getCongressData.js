'use strict';

let YAML = require('yamljs');

let rawDataAsJSON = YAML.load('legislators-current.yaml');

function findByStateAndDistrict(data, stateCode, district) {
  let reps = data.filter(rep => {
    if (
        rep.terms[rep.terms.length - 1].state == stateCode
        && rep.terms[rep.terms.length -1].district == district
      ) {
      return true;
    }
    return false;
  });
  return reps;
}

function getRepNameAndFaxNumber(rep) {
  return {
    name: rep.name.official_full,
    fax: rep.terms[rep.terms.length - 1].fax
  }
}

module.exports = {
  findByStateAndDistrict,
  getRepNameAndFaxNumber,
  rawDataAsJSON
}
