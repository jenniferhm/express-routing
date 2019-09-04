const express = require("express");

const app = express();

const ExpressError = require("./expressError");

app.use(express.json());

app.use(express.urlencoded({ extended: true}));

app.get("/mean", function(req, res, next) {
  let numsArr = (req.query.numbers).split(",");
  let convertedToNums = numsArr.map(strNum => {
    if (isNaN(+strNum)) return console.log("Please only enter numbers!");
    return +strNum;
  });
  console.log(_calculateMean(convertedToNums));
})

function _calculateMean(arr) {
  let sum = arr.reduce((total, num) => total + num);
  let mean = sum/arr.length;
  return +mean.toFixed(2);
}

function _calculateMedian(arr) {
  let sortedArr = arr.sort((a, b) => a-b);

  if (sortedArr.length % 2 !== 0) {
    let i = Math.floor(sortedArr.length / 2);
    return sortedArr[i];
  } else {
    let left = Math.floor(sortedArr.length / 2);
    let right = left + 1;
    let avg = (sortedArr[left] + sortedArr[right]) / 2;
    return avg;
  }
}

function _calculateMode(arr) {
  let counts = frequencyCounter(arr);
  let max = -Infinity;
  let maxCount = -Infinity;

  for (let n in counts) {
    if (counts[n] > maxCount) {
      max = n;
      maxCount = counts[n];
    }
  }
  return max;
}

function _frequencyCounter(arr) {
  let count = {};

  for (let num of arr) {
    count[num] = (count[num] || 0) + 1;
  }
  return count;
}

app.use(function(req, res, next) {
  const notFoundError = new ExpressError("Not Found", 404);
  return next(notFoundError);
});

app.use(function(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message;

  return res.status(status).json({
    error: {message, status}
  });
});

app.listen(3000, function() {
  console.log("App on port 3000.");
});