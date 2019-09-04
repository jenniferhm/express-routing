const express = require("express");

const app = express();

const ExpressError = require("./expressError");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/mean", function (req, res, next) {
  // Route to calculate mean from a query string
  let str = (req.query.numbers);
  let convertedToNums = _convertParamsToArr(str);
  let mean = _calculateMean(convertedToNums);
  return res.json({
    response: {
      operation: "mean",
      value: `${mean}`
    }
  });
})

function _calculateMean(arr) {
  // Helper function to calculate mean of an array of numbers
  let sum = arr.reduce((total, num) => total + num);
  let mean = sum / arr.length;
  return +mean.toFixed(2);
}


app.get('/median', function (req, res, next) {
  // Route to get median of numbers in query string
  let str = (req.query.numbers);
  let convertedToNums = _convertParamsToArr(str);
  let median = _calculateMedian(convertedToNums);
  return res.json({
    response: {
      operation: "median",
      value: `${median}`
    }
  });
});

function _calculateMedian(arr) {
  // Helper function to calculate median
  let sortedArr = arr.sort((a, b) => a - b);

  // If odd number array, return middle number
  if (sortedArr.length % 2 !== 0) {
    let i = Math.floor(sortedArr.length / 2);
    return sortedArr[i];
  } else {
    // if even number array, return average of two middle numbers
    let left = Math.floor((sortedArr.length - 1) / 2);
    let right = left + 1;
    let avg = (sortedArr[left] + sortedArr[right]) / 2;
    return avg;
  }
}


app.get('/mode', function(req, res, next) {
  // Route for getting the mode of numbers, returns JSON
  let str = (req.query.numbers);
  let convertedToNums = _convertParamsToArr(str);
  let mode = _calculateMode(convertedToNums);
  return res.json({
    response: {
      operation: 'mode',
      value: `${mode}`
    }
  });
});

function _calculateMode(arr) {
  // Helper function to find the mode of an array of numbers
  let counts = _frequencyCounter(arr);
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
  // Frequency counter for an array
  let count = {};
  for (let num of arr) {
    count[num] = (count[num] || 0) + 1;
  }
  return count;
}

function _convertParamsToArr(str) {
  let numsArr = (str).split(",");
  let convertedToNumsArr = numsArr.map(strNum => {
    if (isNaN(+strNum)) {
      throw new ExpressError("Invalid entry, please enter a valid number", 400);
    }
    return +strNum;
  });
  return convertedToNumsArr;
}

app.use(function (req, res, next) {
  const notFoundError = new ExpressError("Not Found", 404);
  return next(notFoundError);
});

app.use(function (err, req, res, next) {
  let status = err.status || 500;
  let message = err.message;

  return res.status(status).json({
    error: { message, status }
  });
});

app.listen(3000, function () {
  console.log("App on port 3000.");
});