import $ from 'jquery';
import 'jquery';
import 'bootstrap';
import 'popper.js';
import './app.scss';

const permutator = (inputArr) => {
  let result = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next))
     }
   }
 }

 permute(inputArr)

 return result;
}
var getPermutations = function(list, maxLen) {
  // Copy initial values as arrays
  var perm = list.map(function(val) {
      return [val];
  });
  // Our permutation generator
  var generate = function(perm, maxLen, currLen) {
      // Reached desired length
      if (currLen === maxLen) {
          return perm;
      }
      // For each existing permutation
      for (var i = 0, len = perm.length; i < len; i++) {
          var currPerm = perm.shift();
          // Create new permutation
          for (var k = 0; k < list.length; k++) {
              perm.push(currPerm.concat(list[k]));
          }
      }
      // Recurse
      return generate(perm, maxLen, currLen + 1);
  };
  // Start with size 1 because of initial values
  return generate(perm, maxLen, 1);
};

// Attatch handler to the submit button
$('#submit').on("click", function() {
  // Get the starting number and the ending number from the form
  let start = $('#start-num').val();
  let goal = $('#goal-num').val();

  // Get the cards (1-5) from the form
  let cards = [];
  for (let i = 1; i <= 5; i++) {
    cards.push($('#card' + i).val());
  }

  // Get the allowed operators from the form
  let availableOperators = ["add", "subtract", "multiply", "divide"];
  let operators = [];

  for (let i = 0; i < availableOperators.length; i++) {
    if ($('#' + availableOperators[i]).is(':checked')) {
      operators.push(availableOperators[i]);
    }
  }

  console.log(cards);
  console.log(operators);
  console.log(start);
  console.log(goal);

  let solutions = [];
  let tries = [];
  let currentSolution = `${start}+`;
  // Try every possible combination of cards and operators to achieve the goal number when starting with the starting number

  // Convert operators to their corresponding symbol
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === "add") {
      operators[i] = "+";
    } else if (operators[i] === "subtract") {
      operators[i] = "-";
    } else if (operators[i] === "multiply") {
      operators[i] = "*";
    } else if (operators[i] === "divide") {
      operators[i] = "/";
    }
  }

  var permutations = [];
  for (let i = 1; i < cards.length + 1; i++) {
    permutations = permutations.concat(getPermutations(cards, i));
  }
  
  console.log(permutations);
  let skip = false;
  // Loop through all the operators
  for (let o = 0; o < operators.length; o++) {
    // Loop through all the permutations
    for (let i = 0; i < permutations.length; i++) {
      // Loop through all the numbers in the individual permutation

      for (let j = 0; j < permutations[i].length; j++) {
        // Check the number of times the current number appears in the card array
        var cardOccurrences = { };
        for (var c = 0, b = cards.length; c < b; c++) {
          cardOccurrences[cards[c]] = (cardOccurrences[cards[c]] || 0) + 1;
        }

        var permutationOccurrences = { };
        for (var c = 0, b = permutations[i].length; c < b; c++) {
          permutationOccurrences[permutations[i][c]] = (permutationOccurrences[permutations[i][c]] || 0) + 1;
        }

        // If the number of times the current number appears in the card array is the same as the number of times it appears in the permutation, then we can use it
        if (cardOccurrences[permutations[i][j]] >= permutationOccurrences[permutations[i][j]]) {
          // If the current number is negative, add parasesis
          if (permutations[i][j].startsWith("-")) {
            currentSolution += "(" + permutations[i][j] + ")" + operators[o];
          } else {
            currentSolution += permutations[i][j] + operators[o];
          }
        } else {
          // If the number of times the current number appears in the card array is less than the number of times it appears in the permutation, then we can't use it
          skip = true;
        }
      }

      // Remove the last operator
      currentSolution = currentSolution.slice(0, -1);
      
      // Check if the current solution is the goal number
      if (eval(currentSolution) == goal && !skip) {
        solutions.push(currentSolution.replaceAll(operators[o], ` ${operators[o]} `));
      }
      // Add the current solution to the solutions array
      // tries.push(currentSolution);
      currentSolution = `${start}+`;
      skip = false;
    }
  }

  
  
  // Remove duplicates from the solutions array
  solutions = solutions.filter((v, i, a) => a.indexOf(v) === i);
  console.log(solutions);

  // Display the solutions using a bootstrap table
  // Remove the table if it already exists
  $('tr').remove();
  // Create a new tr under tbody
  let table = $('tbody');
  // Add the solutions to the table
  for (let i = 0; i < solutions.length; i++) {
    let tr = $('<tr>');
    let id_td = $('<td>');
    id_td.text(i);
    tr.append(id_td);
    let td = $('<td>');
    td.text(solutions[i]);
    tr.append(td);
    table.append(tr);
  }

  // Remove the d-none class from the table
  $('#table-row').removeClass('d-none');


});

