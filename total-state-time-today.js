#!/usr/bin/env node

var _ = require('lodash');
var humanizeDuration = require('humanize-duration');
var data = require(require('expand-tilde')('~/Dropbox/Apps/gtracker/data.json')).events;

var chosenState = process.argv[2];

var today = _.takeRightWhile(data, function(e) { return e.name != 'Sleeping'; });

var acc = _.reduceRight(today, function(acc, event) {
  if (event.name == chosenState) {
    if (event.type == 'StartState') {
      var startTime = new Date(event.date);
      return {
        total: acc.total + (acc.endTime - startTime),
        endTime: null
      };
    } else if (event.type == 'EndState') {
      return {
        total: acc.total,
        endTime: new Date(event.date)
      };
    }
  }
  return acc;
}, {total: 0, endTime: new Date()});

console.log(humanizeDuration(acc.total));

