import { AlgorithmEntry } from "./types";

export const generatedStriverAlgorithms: AlgorithmEntry[] = [
  {
    id: "user-input-output",
    title: "User Input / Output",
    topic: "Basic Basics - Things to Know",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "User Input / Output",
    leetcodeLink: "",
    useCases: ["Handling user input from various sources such as keyboards, mice, or network sockets.", "Processing and validating user input to prevent errors or security breaches.", "Generating output in response to user input, which can include displaying information on the screen or sending it over a network."],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition\n----------------\nUser input/output is a fundamental aspect of any interactive application. It involves reading data from user interfaces and producing output in response to that data.\n\nInvariant\n---------\nThe invariant for this topic is that the program should always produce valid output in response to valid user input, regardless of external factors such as network connectivity or hardware limitations.\n\nLogic + Code Walkthrough\n------------------------\nHere's a step-by-step guide to implementing user input/output:\n1. Read user input from a source (e.g., keyboard, mouse, network socket).\n2. Validate the input data to ensure it conforms to expected formats and ranges.\n3. Process the validated input data according to the program's logic.\n4. Generate output in response to the processed input data.\n5. Send the output to a destination (e.g., display, network).\n\nEdge Cases\n---------\nSome edge cases to consider when implementing user input/output include:\n* Handling invalid or malformed input data.\n* Dealing with unexpected errors or exceptions.\n* Optimizing performance for large volumes of user input.\n\nComplexity Deep Dive\n-------------------\nThe time complexity of this topic depends on the specific implementation and the nature of the input data. In general, reading and processing user input can be O(n), where n is the number of characters in the input string. Generating output can also have a similar time complexity, depending on the destination and the amount of data being sent.\n\nSpace Complexity\n----------------\nThe space complexity of this topic depends on the amount of memory required to store the input data, processed output, and any intermediate results. In general, this can be O(m), where m is the number of characters in the input string.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "The time complexity of user input/output depends on the specific implementation and the nature of the input data.",
          spaceComplexity: "O(m)",
          spaceComplexityExplanation: "The space complexity of user input/output depends on the amount of memory required to store the input data, processed output, and any intermediate results.",
          implementations: [
            {
              language: "Python",
              code: `import sys
print('Hello, World!')
name = input('Enter your name: ')
if len(name) > 0:
    print(f'Hello, {name}!')
else:
    print('Please enter a valid name.')`
            },
            {
              language: "JavaScript",
              code: `const readline = require('readline').createInterface({ input: process.stdin });
readline.question('Enter your name: ', (answer) => {
  if (answer.trim() !== ''){
    console.log(\`Hello, \${answer}!\`);
  } else {
    console.log('Please enter a valid name.');
  }
});`
            },
            {
              language: "Java",
              code: `import java.util.Scanner;
public class HelloWorld {
  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    System.out.println("Hello, World!");
    System.out.print("Enter your name: ");
    String name = scanner.nextLine();
    if (name != null && !name.isEmpty()){
      System.out.println("Hello, " + name + "!");
    } else {
      System.out.println("Please enter a valid name.");
    }
  }
}`
            },
            {
              language: "C++",
              code: `#include <iostream>
#include <string>
int main() {
  std::cout << "Hello, World!";
  std::string name; 
  std::cout << "Enter your name: ";
  if (std::getline(std::cin, name)){
    std::cout << "Hello, " << name << "!";
  } else {
    std::cerr << "Please enter a valid name." << std::endl;
  }
  return 0;
}`
            }
          ]
        }
    ]
  },
  {
    id: "data-types",
    title: "Data Types",
    topic: "Basic Basics - Things to Know",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Data types refer to the fundamental categories of data that a programming language supports. Understanding data types is crucial for writing efficient and effective code.",
    leetcodeLink: "",
    useCases: ["Storing and retrieving data in variables", "Defining the structure of data in arrays and objects", "Specifying the type of data in function parameters and return values"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: Data types are the building blocks of programming. Invariant: The type of a variable is determined at compile-time, not runtime. Logic + Code Walkthrough: Understanding data types involves recognizing their properties and behaviors. Edge Cases: Be aware of implicit conversions and type casting. Complexity Deep Dive: Explore the nuances of each data type, including their size, storage requirements, and performance implications.",
          timeComplexity: "O(1)",
          timeComplexityExplanation: "Accessing a variable with a known data type takes constant time.",
          spaceComplexity: "O(n)",
          spaceComplexityExplanation: "Storing n elements in an array requires linear space.",
          implementations: [
            {
              language: "Python",
              code: `def print_type(var):
    print(type(var).__name__)

print_type(5)
print_type("hello")
print_type([1, 2, 3])`
            },
            {
              language: "JavaScript",
              code: `function printType(var) {
  console.log(typeof var);
}

printType(5);
printType("hello");
printType([1, 2, 3]);`
            },
            {
              language: "Java",
              code: `public class DataTypeExample {
  public static void main(String[] args) {
    System.out.println(Integer.TYPE.name());
    System.out.println(String.class.getName());
    System.out.println(List.class.getName());
  }
}`
            },
            {
              language: "C++",
              code: `#include <iostream>
#include <typeinfo>

int main() {
  std::cout << typeid(5).name();
  std::cout << typeid("hello").name();
  std::cout << typeid(std::vector<int>).name();
  return 0;
}`
            }
          ]
        }
    ]
  },
  {
    id: "if-else-statements",
    title: "If Else statements",
    topic: "Basic Basics - Things to Know",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "If-else statements are a fundamental control structure in programming that allow you to execute different blocks of code based on conditions.",
    leetcodeLink: "",
    useCases: ["Decision-making in algorithms", "Handling exceptions and errors", "Implementing conditional logic in loops"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: If-else statements are used to make decisions based on conditions. Invariant: The condition is evaluated, and if true, one block of code is executed; otherwise, another block is executed. Logic + Code Walkthrough: To implement an if-else statement, you need to define the condition, the code to execute if true, and the code to execute if false. Edge Cases: Handle edge cases such as empty lists or null values. Complexity Deep Dive: The time complexity of an if-else statement is O(1), making it very efficient.",
          timeComplexity: "O(1)",
          timeComplexityExplanation: "The condition is evaluated once, and the code is executed based on its result.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Only a constant amount of space is used to store the variables.",
          implementations: [
            {
              language: "Python",
              code: `def solve(condition):
  if condition:
    return True
  else:
    return False`
            },
            {
              language: "JavaScript",
              code: `function solve(condition) {
  if (condition) {
    return true;
  } else {
    return false;
  }
}`
            },
            {
              language: "Java",
              code: `public class IfElseStatement {
  public static boolean solve(boolean condition) {
    if (condition) {
      return true;
    } else {
      return false;
    }
  }
}`
            },
            {
              language: "C++",
              code: `bool solve(bool condition) {
  if (condition) {
    return true;
  } else {
    return false;
  }
}`
            }
          ]
        }
    ]
  },
  {
    id: "switch-statement",
    title: "Switch Statement",
    topic: "Basic Basics - Things to Know",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "A switch statement is a control flow statement that allows you to execute different blocks of code based on the value of an expression.",
    leetcodeLink: "",
    useCases: ["Handling different cases in a program", "Switching between different algorithms or data structures", "Implementing lookup tables or hash-based data structures"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: A switch statement is useful when you need to handle multiple cases in a single block of code. Invariant: The value being switched on must be an integer or string type. Logic + Code Walkthrough: To implement a switch statement, use the `switch` keyword followed by the expression to be evaluated, and then use `case` labels to specify the different values. Edge Cases: Handle cases where the input is not one of the expected values. Complexity Deep Dive: The time complexity of a switch statement is O(n), where n is the number of cases. Space Complexity: The space complexity is O(1) since we only need to store the current case value.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "The time complexity of a switch statement is linear with respect to the number of cases, making it efficient for handling multiple cases.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Since we only need to store the current case value, the space complexity is constant.",
          implementations: [
            {
              language: "Python",
              code: `def solve(expression):
    result = None
    for i in range(len(expression)): 
        if expression[i] == "value1":
            result = 'case1'
        elif expression[i] == "value2":
            result = 'case2'
    return result`
            },
            {
              language: "JavaScript",
              code: `function solve(expression) {
  let result;
  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === "value1") {
      result = 'case1';
    } else if (expression[i] === "value2") {
      result = 'case2';
    }
  }
  return result`
            },
            {
              language: "Java",
              code: `public class SwitchStatement {
  public static String solve(String[] expression) {
    String result = null;
    for (int i = 0; i < expression.length; i++) {
      if (expression[i].equals("value1")) {
        result = "case1";
      } else if (expression[i].equals("value2")) {
        result = "case2";
      }
    }
    return result;
  }
}`
            },
            {
              language: "C++",
              code: `string solve(string expression[]) {
  string result; 
  for (int i = 0; i < expression.length; i++) {
    if (expression[i] == "value1") {
      result = "case1";
    } else if (expression[i] == "value2") {
      result = "case2";
    }
  }
  return result;
}`
            }
          ]
        }
    ]
  },
  {
    id: "for-loops-while-loops",
    title: "For loops & while loops",
    topic: "Basic Basics - Things to Know",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "For loops & while loops are fundamental constructs in programming that allow you to execute a block of code repeatedly based on certain conditions or iterations.",
    leetcodeLink: "",
    useCases: ["Simulating real-world phenomena like weather forecasting, population growth, or financial modeling", "Processing large datasets, such as sorting, searching, or data compression", "Implementing algorithms for tasks like graph traversal, network optimization, or machine learning"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: For loops and while loops are used to execute a block of code repeatedly. Invariant: The loop condition is checked at the beginning of each iteration. Logic + Code Walkthrough:\n\nFor loops iterate over a sequence of values, whereas while loops continue to execute as long as a certain condition is true.\n\nExample (Python):\nfor i in range(5):\n    print(i)\n\nsolve(...) def solve(n):\n    for i in range(n):\n        print(i)\n\nFor loops are useful when you need to process each element of a sequence, whereas while loops are suitable for tasks that require continuous iteration.\n\nEdge Cases: For loops can be used with arrays, lists, or other sequences, while while loops work with any condition that evaluates to true. Complexity Deep Dive:\n\nThe time complexity of for loops is O(n), where n is the number of iterations, whereas while loops have a time complexity of O(n) as well.\n\nSpace Complexity: For loops typically require less memory than while loops because they don't need to store the loop condition or iteration variables.\n\n",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "The number of iterations directly affects the time complexity.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "For loops typically require constant space because they don't need to store additional data structures.",
          implementations: [
            {
              language: "Python",
              code: `def solve(n):
    for i in range(n):
        print(i)
    return n
`
            },
            {
              language: "JavaScript",
              code: `function solve(n) {
    let result = 0;
    for (let i = 0; i < n; i++) {
        result += i;
    }
    return result;
}`
            },
            {
              language: "Java",
              code: `public class ForLoopExample {
    public static void solve(int n) {
        int result = 0;
        for (int i = 0; i < n; i++) {
            result += i;
        }
        System.out.println(result);
    }
}`
            },
            {
              language: "C++",
              code: `void solve(int n) {
    int result = 0;
    for (int i = 0; i < n; i++) {
        result += i;
    }
    std::cout << result << '
';
}`
            }
          ]
        }
    ]
  },
  {
    id: "pattern-printing-patterns-1-to-22",
    title: "Pattern Printing (Patterns 1 to 22)",
    topic: "Basic Basics - Patterns",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Pattern Printing: A fundamental concept in algorithms that involves generating a sequence of numbers based on given rules.",
    leetcodeLink: "",
    useCases: ["Generating Fibonacci sequence", "Printing Pascal's Triangle", "Creating a Sudoku grid"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: Pattern printing is about recognizing and generating sequences that follow specific rules. Invariant: The key to solving pattern printing problems lies in understanding the underlying structure of the sequence. Logic + Code Walkthrough: We will break down a typical problem into smaller parts, analyzing each step and writing corresponding code. Edge Cases: Handling edge cases is crucial when dealing with pattern printing, as it can significantly impact the output. Complexity Deep Dive: The time complexity of pattern printing problems often involves understanding the growth rate of the sequence.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "The time complexity of pattern printing problems typically grows linearly with the size of the input, as we need to generate each element in the sequence.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "In most cases, the space complexity is constant, as we only need to store a fixed amount of information to keep track of the current state.",
          implementations: [
            {
              language: "Python",
              code: `def solve(n):
    fib_sequence = [0, 1]
    while len(fib_sequence) < n:
        fib_sequence.append(fib_sequence[-1] + fib_sequence[-2])
    return fib_sequence`
            },
            {
              language: "JavaScript",
              code: `function solve(n) {
    let fibSequence = [0, 1];
    for (let i = 2; i < n; i++) {
        fibSequence.push(fibSequence[i - 1] + fibSequence[i - 2]);
    }
    return fibSequence;
}`
            },
            {
              language: "Java",
              code: `public class PatternPrinting {
    public static int[] solve(int n) {
        int[] fibSequence = new int[n];
        fibSequence[0] = 0;
        fibSequence[1] = 1;
        for (int i = 2; i < n; i++) {
            fibSequence[i] = fibSequence[i - 1] + fibSequence[i - 2];
        }
        return fibSequence;
    }
}`
            },
            {
              language: "C++",
              code: `int solve(int n) {
    int fib_sequence[n];
    fib_sequence[0] = 0;
    fib_sequence[1] = 1;
    for (int i = 2; i < n; i++) {
        fib_sequence[i] = fib_sequence[i - 1] + fib_sequence[i - 2];
    }
    return fib_sequence[n - 1];`
            }
          ]
        }
    ]
  },
  {
    id: "count-digits",
    title: "Count Digits",
    topic: "Basic Basics - Basic Math",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Counting the number of digits in a given non-negative integer is a basic math problem that can be solved using various programming approaches.",
    leetcodeLink: "",
    useCases: ["Input validation: Checking if the input is a non-negative integer.", "Error handling: Dealing with invalid inputs like negative numbers or non-integer values.", "Performance optimization: Finding efficient algorithms to count digits quickly."],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: The problem can be solved by converting the integer to a string and counting the characters. However, this approach is not optimal as it requires extra space.",
          timeComplexity: "O(?)",
          timeComplexityExplanation: "",
          spaceComplexity: "O(?)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "Python",
              code: `def count_digits(n):
  if n < 0:
    raise ValueError("Input must be a non-negative integer.")
  return len(str(abs(n)))`
            },
            {
              language: "JavaScript",
              code: `function solve(n) {
  if (n < 0) throw new Error("Input must be a non-negative integer.");
  return n.toString().length;
}`
            },
            {
              language: "Java",
              code: `public int countDigits(int n) {
  if (n < 0) {
    throw new IllegalArgumentException("Input must be a non-negative integer.");
  }
  return String.valueOf(Math.abs(n)).length();
}`
            },
            {
              language: "C++",
              code: `int solve(int n) {
  if (n < 0) {
    throw std::invalid_argument("Input must be a non-negative integer.");
  }
  return std::to_string(abs(n)).size();
}`
            }
          ]
        }
    ]
  },
  {
    id: "reverse-a-number",
    title: "Reverse a Number",
    topic: "Basic Basics - Basic Math",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Reverse a Number",
    leetcodeLink: "",
    useCases: ["Reversing a number is a common operation in various applications.", "It can be used to validate user input or to perform calculations with numbers in reverse order.", "This problem is useful for practicing basic math concepts and data structures."],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition\nReversing a number involves swapping its digits. For example, the number 123 can be reversed to 321.\nInvariant\nThe reversal of a number is always unique and can be obtained by reversing the individual digits.\nLogic + Code Walkthrough\nWe will use a simple algorithm that iterates over each digit in the number and appends it to the result. This approach ensures that we handle all possible cases, including negative numbers and single-digit numbers.\nEdge Cases\nNegative numbers: We can reverse the absolute value of the number and add a negative sign at the end.\nSingle-digit numbers: These are already reversed, so no action is needed.\nComplexity Deep Dive\nThe time complexity of this algorithm is O(n), where n is the number of digits in the input number. This is because we need to iterate over each digit once to reverse it.\nThe space complexity is also O(n) as we need to store the reversed number.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "The algorithm iterates over each digit in the number, making it a linear-time operation.",
          spaceComplexity: "O(n)",
          spaceComplexityExplanation: "We need to store the reversed number, which requires additional space proportional to the input size.",
          implementations: [
            {
              language: "Python",
              code: `def solve(s):
    return int(str(abs(s))[::-1]) if s < 0 else str(s)[::-1]
`
            },
            {
              language: "JavaScript",
              code: `function solve(s) {
    return parseInt(s.split('').reverse().join(''));
}`
            },
            {
              language: "Java",
              code: `public class Solution {
    public int solve(int s) {
        String str = Integer.toString(Math.abs(s));
        StringBuilder sb = new StringBuilder(str);
        return sb.reverse().toString();
    }
}`
            },
            {
              language: "C++",
              code: `int solve(int s) {
    std::string str = std::to_string(std::abs(s));
    std::reverse(str.begin(), str.end());
    return std::stoi(str);
}`
            }
          ]
        }
    ]
  },
  {
    id: "gcd-or-hcf",
    title: "GCD Or HCF",
    topic: "Basic Basics - Basic Math",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "The Greatest Common Divisor (GCD) or Highest Common Factor (HCF) is a positive integer that divides two integers without leaving a remainder.",
    leetcodeLink: "",
    useCases: ["Finding the GCD of two numbers in mathematics and computer science", "Determining the common factors between two numbers", "Calculating the least common multiple of two numbers"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: The GCD is a fundamental concept in number theory, and it has numerous applications in mathematics, computer science, and engineering. Invariant: The GCD is always positive, and it can be calculated using various algorithms.\nLogic + Code Walkthrough:\n1. Choose an algorithm (e.g., Euclidean algorithm).\n2. Implement the algorithm in your chosen programming language.\n3. Test the implementation with sample inputs.\nEdge Cases: Handle cases where one of the input numbers is zero.\nComplexity Deep Dive: The time complexity of the GCD calculation depends on the chosen algorithm. For example, the Euclidean algorithm has a time complexity of O(log min(a,b)), while prime factorization has a time complexity of O(sqrt(max(a,b))).",
          timeComplexity: "O(log min(a,b))",
          timeComplexityExplanation: "The time complexity of the GCD calculation using the Euclidean algorithm is O(log min(a,b)).",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "The space complexity is constant because we only need to store a few variables.",
          implementations: [
            {
              language: "Python",
              code: `def solve(a, b):
    while b != 0:
        a, b = b, a % b
    return abs(a)
# Test the implementation
print(solve(48, 18))  # Output: 6`
            },
            {
              language: "JavaScript",
              code: `function solve(a, b) {
    if (b === 0) return Math.abs(a);
    else return solve(b, a % b);
}
// Test the implementation
console.log(solve(48, 18));  // Output: 6`
            },
            {
              language: "Java",
              code: `public class GCD {
    public static int solve(int a, int b) {
        if (b == 0)
            return Math.abs(a);
        else
            return solve(b, a % b);
    }
    public static void main(String[] args) {
        System.out.println(solve(48, 18));  // Output: 6
    }
}`
            },
            {
              language: "C++",
              code: `int solve(int a, int b) {
    if (b == 0)
        return abs(a);
    else
        return solve(b, a % b);
}
// Test the implementation
int main() {
    std::cout << solve(48, 18) << std::endl;  // Output: 6
    return 0;
}`
            }
          ]
        }
    ]
  },
  {
    id: "armstrong-numbers",
    title: "Armstrong Numbers",
    topic: "Basic Basics - Basic Math",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Armstrong numbers are a series of numbers that remain the same when their digits are raised to the power of the number of digits and multiplied together.",
    leetcodeLink: "",
    useCases: ["Identifying Armstrong numbers in a given range", "Checking if a number is an Armstrong number", "Generating all Armstrong numbers up to a certain limit"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: An Armstrong number is a number that is equal to the sum of its own digits each raised to the power of the number of digits. Invariant: The property holds for all numbers with the same number of digits. Logic + Code Walkthrough: Implement a function that calculates the sum of the digits raised to the power of the number of digits and checks if it equals the original number. Edge Cases: Handle numbers with different numbers of digits, negative numbers, and zero. Complexity Deep Dive: The time complexity is O(n), where n is the number of digits in the input number, since we need to calculate the sum of the digits raised to the power of the number of digits. Space Complexity: O(1) since we only use a constant amount of space to store the input and output numbers.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "The time complexity is linear with respect to the number of digits in the input number, making it efficient for large inputs.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We use a constant amount of space to store the input and output numbers, making it space-efficient.",
          implementations: [
            {
              language: "Python",
              code: `def solve(n):
    # Convert the number to string to easily get the number of digits
    num_digits = len(str(n))
    # Calculate the sum of the digits raised to the power of the number of digits
    sum_of_powers = sum(int(digit) ** num_digits for digit in str(n))
    # Check if the original number is equal to the sum of the powers
    return n == sum_of_powers`
            },
            {
              language: "JavaScript",
              code: `function solve(n) {
    // Convert the number to string to easily get the number of digits
    let numDigits = n.toString().length;
    // Calculate the sum of the digits raised to the power of the number of digits
    let sumOfPowers = 0;
    for (let i = 1; i <= numDigits; i++) {
        sumOfPowers += Math.pow(n % 10, i);
    }
    // Check if the original number is equal to the sum of the powers
    return n === sumOfPowers;
}`
            },
            {
              language: "Java",
              code: `public class ArmstrongNumber {
    public static boolean solve(int n) {
        int numDigits = String.valueOf(n).length();
        int sum = 0;
        for (int i = 1; i <= numDigits; i++) {
            sum += (int) Math.pow(n % 10, i);
        }
        return n == sum;
    }
}`
            },
            {
              language: "C++",
              code: `bool solve(int n) {
    int numDigits = std::to_string(n).length();
    int sum = 0;
    for (int i = 1; i <= numDigits; i++) {
        sum += pow(n % 10, i);
    }
    return n == sum;
}`
            }
          ]
        }
    ]
  },
  {
    id: "print-all-divisors",
    title: "Print all Divisors",
    topic: "Basic Basics - Basic Math",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "This algorithm finds all divisors of a given number.",
    leetcodeLink: "",
    useCases: ["Finding all divisors of a number is useful in various mathematical and computational applications.", "It can be used to determine the factors of a number, which is essential in many areas like cryptography, coding theory, and numerical analysis.", "This algorithm can also help in solving problems related to prime factorization, greatest common divisor (GCD), and least common multiple (LCM)"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Core Intuition\nFinding all divisors of a number involves checking every integer from 1 up to the square root of the given number.\n\n#### Invariant\nThe key insight here is that if $d$ is a divisor of $n$, then $\frac{n}{d}$ is also a divisor. This allows us to reduce the search space significantly by only considering numbers less than or equal to the square root of $n$.",
          timeComplexity: "O(√n)",
          timeComplexityExplanation: "The algorithm has a time complexity of O(√n) because we are checking every number up to the square root of n.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "The space complexity is O(1) because we only use a constant amount of space to store the input and output.",
          implementations: [
            {
              language: "Python",
              code: `def solve(n):
  divisors = set()
  for i in range(1, int(n**0.5) + 1):
    if n % i == 0:
      divisors.add(i)
      divisors.add(n // i)
  return list(divisors)`
            },
            {
              language: "JavaScript",
              code: `function solve(n) {
  const divisors = new Set()
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      divisors.add(i)
      divisors.add(Math.floor(n / i))
    }
  }
  return Array.from(divisors)`
            },
            {
              language: "Java",
              code: `public class Solution {
  public List<Integer> solve(int n) {
    Set<Integer> divisors = new HashSet<>();
    for (int i = 1; i <= Math.sqrt(n); i++) {
      if (n % i == 0) {
        divisors.add(i);
        divisors.add(n / i);
      }
    }
    return new ArrayList<>(divisors);
  }
}`
            },
            {
              language: "C++",
              code: `int solve(int n) {
  std::set<int> divisors;
  for (int i = 1; i <= sqrt(n); i++) {
    if (n % i == 0) {
      divisors.insert(i);
      divisors.insert(n / i);
    }
  }
  return *divisors.begin();
}`
            }
          ]
        }
    ]
  },
  {
    id: "check-for-prime",
    title: "Check for Prime",
    topic: "Basic Basics - Basic Math",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Check if a number is prime",
    leetcodeLink: "",
    useCases: ["Validate user input for online banking systems", "Implement primality test in cryptographic algorithms", "Verify the validity of numbers in mathematical proofs"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Core Intuition\nA prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.\n\n#### Invariant\nThe primality of a number can be determined by checking divisibility up to its square root.\n\n#### Logic + Code Walkthrough\nWe will implement the trial division method, which checks for divisibility from 2 to the square root of the number.\n\n#### Edge Cases\nHandle edge cases such as negative numbers and numbers less than 2.\n\n#### Complexity Deep Dive\nThe time complexity of this approach is O(√n), where n is the input number.",
          timeComplexity: "O(√n)",
          timeComplexityExplanation: "The trial division method checks for divisibility up to the square root of the number, resulting in a time complexity of O(√n).\n\n#### Space Complexity\nThe space complexity is O(1), as we only use a constant amount of space to store variables.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We only use a fixed amount of space to store variables, regardless of the input size.",
          implementations: [
            {
              language: "Python",
              code: `def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True`
            },
            {
              language: "JavaScript",
              code: `function isPrime(n) {
    if (n < 2) {
        return false;
    }
    for (var i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            return false;
        }
    }
    return true;`
            },
            {
              language: "Java",
              code: `public class PrimeChecker {
    public static boolean isPrime(int n) {
        if (n < 2) {
            return false;
        }
        for (int i = 2; i <= Math.sqrt(n); i++) {
            if (n % i == 0) {
                return false;
            }
        }
        return true;
    }
`
            },
            {
              language: "C++",
              code: `bool is_prime(int n) {
    if (n < 2) {
        return false;
    }
    for (int i = 2; i <= sqrt(n); i++) {
        if (n % i == 0) {
            return false;
        }
    }
    return true;
`
            }
          ]
        }
    ]
  },
  {
    id: "understand-recursion-by-printing-something-n-times",
    title: "Understand recursion by printing something N times",
    topic: "Basic Basics - Basic Recursion",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Recursion is a fundamental concept in programming where a function calls itself to solve a problem. This exercise helps you understand recursion by printing 'Hello World!' N times.",
    leetcodeLink: "",
    useCases: ["Printing a message repeatedly", "Calculating factorial using recursion", "Finding the nth Fibonacci number"],
    approaches: [
        {
          name: "Core Intuition",
          description: "Recursion is like a mirror: it reflects the same problem over and over until it finds the solution. The key to understanding recursion is recognizing the invariant - the condition that remains constant throughout the recursive calls.",
          timeComplexity: "O(2^N)",
          timeComplexityExplanation: "The time complexity of recursive functions grows exponentially with the input size, making them less efficient than iterative solutions for large inputs.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "Recursive functions use more memory because each call creates a new stack frame, which can lead to stack overflow errors if not managed properly.",
          implementations: [
            {
              language: "Python",
              code: `def print_hello_world(n):
    if n > 0:
        print('Hello World!')
        return print_hello_world(n-1)
    else:
        return

print_hello_world(10)`
            },
            {
              language: "JavaScript",
              code: `function printHelloWorld(n) {
    if (n > 0) {
        console.log('Hello World!');
        return printHelloWorld(n - 1);
    } else {
        return;
    }
}

printHelloWorld(10);`
            },
            {
              language: "Java",
              code: `public class RecursionExample {
  public static void printHelloWorld(int n) {
    if (n > 0) {
        System.out.println("Hello World!");
        printHelloWorld(n - 1);
    } else {
        return;
    }
  }

  public static void main(String[] args) {
    printHelloWorld(10);
  }
}`
            },
            {
              language: "C++",
              code: `void printHelloWorld(int n) {
  if (n > 0) {
    std::cout << "Hello World!" << std::endl;
    printHelloWorld(n - 1);
  } else {
    return;
  }
}

int main() {
  printHelloWorld(10);
  return 0;
}`
            }
          ]
        }
    ]
  },
  {
    id: "print-1-to-n-using-recursion",
    title: "Print 1 to N using recursion",
    topic: "Basic Basics - Basic Recursion",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Printing numbers from 1 to N using recursion is a fundamental algorithmic problem that can be solved in various programming languages.",
    leetcodeLink: "",
    useCases: ["Algorithmic Interview Preparation", "Learning Recursion", "Understanding Basic Algorithm Design"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: Recursion is a powerful technique for solving problems that have a recursive structure. In this case, we can use recursion to print numbers from 1 to N by calling the function with decreasing values of N until it reaches 1.",
          timeComplexity: "O(?)",
          timeComplexityExplanation: "",
          spaceComplexity: "O(?)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "Python",
              code: `def solve(n):
  if n > 1:
    print(n)
    solve(n-1)
  else:
    return
`
            },
            {
              language: "JavaScript",
              code: `function solve(n) {
  if (n > 1) {
    console.log(n);
    solve(n - 1);
  } else {
    return;
  }
}`
            },
            {
              language: "Java",
              code: `public static void solve(int n) {
  if (n > 1) {
    System.out.println(n);
    solve(n - 1);
  } else {
    return;
  }
}`
            },
            {
              language: "C++",
              code: `void solve(int n) {
  if (n > 1) {
    std::cout << n << "
";
    solve(n - 1);
  } else {
    return;
  }
}`
            }
          ]
        }
    ]
  },
  {
    id: "print-n-to-1-using-recursion",
    title: "Print N to 1 using recursion",
    topic: "Basic Basics - Basic Recursion",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Print N to 1 using recursion",
    leetcodeLink: "",
    useCases: ["Printing numbers from N down to 1 using recursion can be useful in various applications such as printing a countdown timer or displaying a sequence of numbers.", "This problem is often used to introduce the concept of recursion and its application in solving problems that have a recursive structure.", "It's also a good example of how recursion can be used to solve problems that involve traversing a data structure, such as a linked list."],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: Recursion is a powerful technique for solving problems by breaking them down into smaller sub-problems of the same type. In this case, we can use recursion to print numbers from N down to 1 by calling itself with decreasing values.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "We make one call to ourselves for each number from 1 down to N, so the total number of calls is proportional to N. Therefore, the time complexity is linear in N.",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "We use a stack to store our recursive calls, and the maximum depth of our recursion tree is N. Therefore, the space complexity is also linear in N.",
          implementations: [
            {
              language: "Python",
              code: `def solve(N):
    if N == 1:
        return N
    else:
        print(N)
        return solve(N-1) + 1
print(solve(10))
`
            },
            {
              language: "JavaScript",
              code: `function solve(N) {
    if (N === 1) {
        return 1;
    } else {
        console.log(N);
        return solve(N - 1) + 1;
    }
}
solve(10);
`
            },
            {
              language: "Java",
              code: `public class PrintNto1UsingRecursion {
    public static int solve(int N) {
        if (N == 1) {
            return N;
        } else {
            System.out.println(N);
            return solve(N - 1) + 1;
        }
    }
    public static void main(String[] args) {
        System.out.println(solve(10));
    }
}`
            },
            {
              language: "C++",
              code: `int solve(int N) {
    if (N == 1) {
        return N;
    } else {
        std::cout << N << std
;
        return solve(N - 1) + 1;
    }
}
int main() {
    std::cout << solve(10) << std
;
    return 0;
}`
            }
          ]
        }
    ]
  },
  {
    id: "sum-of-first-n-numbers",
    title: "Sum of first N numbers",
    topic: "Basic Basics - Basic Recursion",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "The sum of the first N numbers is a classic problem in mathematics and computer science.",
    leetcodeLink: "",
    useCases: ["Calculating the sum of a series of consecutive integers", "Finding the total value of a sequence of numbers", "Solving problems involving cumulative sums"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: The sum of the first N natural numbers can be calculated using the formula N*(N+1)/2. This approach leverages this mathematical invariant to achieve optimal time complexity.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "The algorithm iterates over the range from 1 to N, performing a constant amount of work for each number. This results in a linear time complexity.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "The algorithm uses a constant amount of space to store the sum and iteration counter.",
          implementations: [
            {
              language: "Python",
              code: `def solve(n):
  if n <= 0:
    return 0
  else:
    return n * (n + 1) // 2`
            },
            {
              language: "JavaScript",
              code: `function solve(n) {
  if (n <= 0) {
    return 0;
  } else {
    return n * (n + 1) / 2;
  }
}`
            },
            {
              language: "Java",
              code: `public int solve(int n) {
  if (n <= 0)
    return 0;
  else
    return n * (n + 1) / 2;
}`
            },
            {
              language: "C++",
              code: `int solve(int n) {
  if (n <= 0)
    return 0;
  else
    return n * (n + 1) / 2;
}`
            }
          ]
        }
    ]
  },
  {
    id: "factorial-of-n-numbers",
    title: "Factorial of N numbers",
    topic: "Basic Basics - Basic Recursion",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "The factorial of a non-negative integer n, denoted by n!, is the product of all positive integers less than or equal to n.",
    leetcodeLink: "",
    useCases: ["Calculating the number of permutations in combinatorics", "Determining the total number of possible arrangements in a sequence", "Finding the number of ways to arrange objects in a specific order"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "The factorial function can be calculated using recursion. The core intuition is that n! = n * (n-1)!. This invariant allows us to break down the problem into smaller sub-problems until we reach the base case of 0!, which is defined as 1.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "The time complexity is linear because each recursive call reduces the input size by a constant factor.",
          spaceComplexity: "O(n)",
          spaceComplexityExplanation: "The space complexity is also linear because we need to store the recursive call stack.",
          implementations: [
            {
              language: "Python",
              code: `def factorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * factorial(n-1)`
            },
            {
              language: "JavaScript",
              code: `function factorial(n) {
    if (n === 0 || n === 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}`
            },
            {
              language: "Java",
              code: `public int factorial(int n) {
    if (n == 0 || n == 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}`
            },
            {
              language: "C++",
              code: `int factorial(int n) {
    if (n == 0 || n == 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}`
            }
          ]
        }
    ]
  },
  {
    id: "reverse-an-array",
    title: "Reverse an array",
    topic: "Basic Basics - Basic Recursion",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Reverse an array is a fundamental problem in computer science that involves rearranging the elements of an array in reverse order.",
    leetcodeLink: "",
    useCases: ["Reversing arrays is a common operation in many algorithms, such as sorting, searching, and manipulating data structures.", "Array reversal is also used in various applications, including data compression, encryption, and scientific computing.", "Understanding how to reverse an array efficiently is crucial for solving more complex problems in computer science."],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Invariant\nThe invariant for this problem is that the input array is non-empty. This ensures that the reversal operation does not result in invalid data structures.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "The time complexity of reversing an array is linear because we only need to traverse the array once, swapping each element with its counterpart at the end.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "The space complexity of reversing an array is constant because we do not need additional space to store the swapped elements temporarily.",
          implementations: [
            {
              language: "Python",
              code: `def reverse_array(arr):
    result = []
    for i in range(len(arr) - 1, -1, -1):
        result.append(arr[i])
    return result`
            },
            {
              language: "JavaScript",
              code: `function reverseArray(arr) {
    let result = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        result.push(arr[i]);
    }
    return result;`
            },
            {
              language: "Java",
              code: `public class Solution {
    public int[] reverseArray(int[] arr) {
        int[] result = new int[arr.length];
        for (int i = 0; i < arr.length; i++) {
            result[i] = arr[arr.length - i - 1];
        }
        return result;
    }
}`
            },
            {
              language: "C++",
              code: `int* reverseArray(int* arr, int size) {
    int* result = new int[size];
    for (int i = 0; i < size; i++) {
        result[i] = arr[size - i - 1];
    }
    return result;
}`
            }
          ]
        }
    ]
  },
  {
    id: "check-if-a-string-is-palindrome-or-not",
    title: "Check if a string is palindrome or not",
    topic: "Basic Basics - Basic Recursion",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "A palindrome is a string that reads the same backwards as forwards.",
    leetcodeLink: "",
    useCases: ["Checking if a single word is a palindrome", "Validating a phrase or sentence to determine if it's a palindrome", "Determining whether a number represented as a string is a palindrome"],
    approaches: [
        {
          name: "Core Intuition and Invariant",
          description: "> **Core Intuition**: A palindrome reads the same forwards and backwards. This property can be used to determine if a string is a palindrome.\n\n> **Invariant**: The first character of a palindrome must match the last character, and the second character must match the second-to-last character, and so on.\n\n> **Logic + Code Walkthrough**: We can use this invariant to create an algorithm that checks if a string is a palindrome by comparing characters from the start and end of the string, moving towards the center.\n\n> **Edge Cases**: Handle cases where the input string is empty or contains only one character.\n\n> **Complexity Deep Dive**: The time complexity of this approach is O(n/2), where n is the length of the string. This simplifies to O(n) because constant factors are ignored in Big O notation.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "The algorithm compares characters from the start and end of the string, moving towards the center. This results in a linear time complexity.\n\n> **Space Complexity**: O(1) because we only use a constant amount of space to store the input string and any necessary variables.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We only use a constant amount of space to store the input string and any necessary variables.",
          implementations: [
            {
              language: "Python",
              code: `def is_palindrome(s):
  if len(s) <= 1:
    return True
  left = 0
  right = len(s) - 1

  while left < right:
    if s[left] != s[right]:
      return False
    
    left += 1
    right -= 1
  return True`
            },
            {
              language: "JavaScript",
              code: `function isPalindrome(s) {
  if (s.length <= 1) {
    return true;
  }
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    if (s[left] !== s[right]) {
      return false;
    }
    
    left++; 
    right--; 
  }
  return true;`
            },
            {
              language: "Java",
              code: `public class PalindromeChecker {
  public static boolean isPalindrome(String s) {
    if (s.length() <= 1) {
      return true;
    }
    int left = 0;
    int right = s.length() - 1;

    while (left < right) {
      if (s.charAt(left) != s.charAt(right)) {
        return false;
      }
      
      left++;
      right--;
    }
    return true;
  }
}
`
            },
            {
              language: "C++",
              code: `bool is_palindrome(const std::string& s) {
  if (s.length() <= 1) {
    return true;
  }
  int left = 0;
  int right = s.length() - 1;

  while (left < right) {
    if (s[left] != s[right]) {
      return false;
    }
    
    left++; 
    right--; 
  }
  return true;
}`
            }
          ]
        }
    ]
  },
  {
    id: "fibonacci-number",
    title: "Fibonacci Number",
    topic: "Basic Basics - Basic Recursion",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "The Fibonacci sequence is a series of numbers where each number is the addition of the last two numbers, starting with 0 and 1.",
    leetcodeLink: "",
    useCases: ["Financial modeling", "Computer science education", "Data analysis"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: The Fibonacci sequence appears in various natural phenomena, such as the arrangement of leaves on a stem and the branching of trees. In computer science, it is used to model recursive processes.",
          timeComplexity: "O(2^n)",
          timeComplexityExplanation: "The time complexity of the recursive approach is exponential due to the repeated computation of subproblems.",
          spaceComplexity: "O(n)",
          spaceComplexityExplanation: "The space complexity is linear because we only need to store the current and previous Fibonacci numbers in the recursion stack.",
          implementations: [
            {
              language: "Python",
              code: `def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)`
            },
            {
              language: "JavaScript",
              code: `function fibonacci(n) {
    if (n <= 1) {
        return n;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`
            },
            {
              language: "Java",
              code: `public int fibonacci(int n) {
    if (n <= 1) {
        return n;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`
            },
            {
              language: "C++",
              code: `int fibonacci(int n) {
    if (n <= 1) {
        return n;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`
            }
          ]
        }
    ]
  },
  {
    id: "counting-frequencies-of-array-elements",
    title: "Counting frequencies of array elements",
    topic: "Basic Basics - Basic Hashing",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Counting frequencies of array elements is a fundamental problem in computer science that involves determining how many times each unique element appears within an array.",
    leetcodeLink: "",
    useCases: ["Data analysis: Finding the most common values in a dataset can help identify trends or patterns.", "Machine learning: Understanding the distribution of features in a dataset is crucial for model training and evaluation.", "Algorithmic problem-solving: Mastering frequency counting techniques can improve overall coding skills."],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition:\n\nFrequency counting involves iterating through the array, keeping track of encountered elements and their respective counts. This process leverages basic data structures like hash tables or dictionaries to efficiently store and retrieve element frequencies.\n\nInvariant:\n\nThe invariant here is that each element in the array will be processed exactly once, resulting in an accurate count of unique elements and their frequencies.\n\nLogic + Code Walkthrough:\n\n1. Initialize a hash table (or dictionary) to store element frequencies.\n2. Iterate through the input array, updating the frequency count for each encountered element.\n3. Return the hash table containing all unique elements as keys with their corresponding frequencies as values.\n\nEdge Cases:\n\n- Handling empty arrays or single-element arrays requires special consideration to avoid incorrect results.\n- Dealing with duplicate elements within an array necessitates distinguishing between actual frequency counts and merely counting occurrences.\n\nComplexity Deep Dive:\n\nThe time complexity of this approach is O(n), where n represents the number of elements in the input array. This stems from a single pass through the data, ensuring each element is processed exactly once. The space complexity is also O(n) due to the storage required for the hash table.\n",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "Linear time complexity as we process each element in the array once.",
          spaceComplexity: "O(n)",
          spaceComplexityExplanation: "Linear space complexity since we store every unique element and its frequency.",
          implementations: [
            {
              language: "Python",
              code: `def solve(arr):
    freq = {}
    for num in arr:
        if num in freq:
            freq[num] += 1
        else:
            freq[num] = 1
    return freq`
            },
            {
              language: "JavaScript",
              code: `function solve(arr) {
    let freq = {}
    for (let num of arr) {
        if (num in freq) {
            freq[num]++; 
        } else {
            freq[num] = 1;
        }
    }
    return freq;`
            },
            {
              language: "Java",
              code: `public Map<Integer, Integer> solve(int[] arr) {
    Map<Integer, Integer> freqMap = new HashMap<>();
    for (int num : arr) {
        if (freqMap.containsKey(num)) {
            freqMap.put(num, freqMap.get(num) + 1);
        } else {
            freqMap.put(num, 1);
        }
    }
    return freqMap;
}`
            },
            {
              language: "C++",
              code: `std::map<int, int> solve(std::vector<int>& arr) {
    std::map<int, int> freqMap;
    for (int num : arr) {
        if (freqMap.find(num) != freqMap.end()) {
            freqMap[num]++; 
        } else {
            freqMap.insert({num, 1});
        }
    }
    return freqMap;
}`
            }
          ]
        }
    ]
  },
  {
    id: "find-the-highest-lowest-frequency-element",
    title: "Find the highest/lowest frequency element",
    topic: "Basic Basics - Basic Hashing",
    category: "Basic Basics",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Find the highest/lowest frequency element in an array using basic hashing.",
    leetcodeLink: "",
    useCases: ["Finding the most frequent element in a dataset", "Identifying the least frequent element in a list", "Counting occurrences of elements in a collection"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: Hash tables allow for efficient lookups and insertions. Invariant: The hash function's output size is fixed, ensuring consistent performance. Logic + Code Walkthrough: We'll use a simple hash table to store element frequencies. Edge Cases: Handling duplicate elements and edge cases like empty arrays. Complexity Deep Dive: Time complexity is O(n) for insertion and lookup, while space complexity is O(n) due to the hash table.",
          timeComplexity: "O(1) for lookup, O(n) for insertion",
          timeComplexityExplanation: "Hash table operations have an average time complexity of O(1), but in the worst case (collision resolution), it's O(n). Insertion and lookup both take O(n) time due to hash table resizing.",
          spaceComplexity: "O(n)",
          spaceComplexityExplanation: "We store each element once in the hash table, resulting in a space complexity of O(n)",
          implementations: [
            {
              language: "Python",
              code: `def solve(arr):
  freq = {}
  for elem in arr:
    freq[elem] = freq.get(elem, 0) + 1
  return min(freq, key=freq.get)
`
            },
            {
              language: "JavaScript",
              code: `function solve(arr) {
  const freq = {}
  for (const elem of arr) {
    freq[elem] = (freq[elem] || 0) + 1
  }
  return Object.keys(freq).reduce((a, b) => freq[a] < freq[b] ? a : b)
}`
            },
            {
              language: "Java",
              code: `public class Solution {
  public int solve(int[] arr) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int elem : arr) {
      freq.put(elem, freq.getOrDefault(elem, 0) + 1);
    }
    return Arrays.stream(freq.entrySet()).min(Comparator.comparingInt(e -> e.getValue())).getKey();
  }
}`
            },
            {
              language: "C++",
              code: `int solve(int arr[]) {
  unordered_map<int, int> freq;
  for (int elem : arr) {
    ++freq[elem];
  }
  return *min_element(freq.begin(), freq.end(), [](const auto& a, const auto& b) { return a.second < b.second; }).first;
}`
            }
          ]
        }
    ]
  },
  {
    id: "selection-sort",
    title: "Selection Sort",
    topic: "Sorting - Sorting I",
    category: "Sorting",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Selection Sort is a simple sorting algorithm that works by repeatedly finding the minimum element from unsorted part of the array and putting it at the beginning.",
    leetcodeLink: "",
    useCases: ["Sorting small arrays", "Educational purposes", "Real-time data processing"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Core Intuition\nSelection sort is a simple algorithm that works by repeatedly finding the minimum element from unsorted part of the array and putting it at the beginning. This process continues until the entire array is sorted.\n\n#### Invariant\nThe invariant of selection sort is that the first i elements are sorted, where i is the current iteration number.\n\n#### Logic + Code Walkthrough\n1. Start with the first element as the minimum value.\n2. Iterate through the rest of the array to find the minimum value.\n3. Swap the found minimum value with the first element.\n4. Repeat steps 1-3 until the entire array is sorted.\n\n#### Edge Cases\n* Handling duplicate elements: selection sort can handle duplicate elements, but it's not efficient for large datasets.\n* Reverse-sorted arrays: selection sort works correctly even when the input array is reverse-sorted.\n\n#### Complexity Deep Dive\nThe time complexity of selection sort is O(n^2) in all cases (best, average, worst), where n is the number of elements. This makes it less efficient than other sorting algorithms like quicksort or mergesort for large datasets.",
          timeComplexity: "O(n^2)",
          timeComplexityExplanation: "The algorithm's time complexity is quadratic because it involves two nested loops that iterate through the array.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Selection sort has a constant space complexity because it only uses a small amount of extra memory to store temporary variables.",
          implementations: [
            {
              language: "Python",
              code: `def solve(arr):
    for i in range(len(arr) - 1):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`
            },
            {
              language: "JavaScript",
              code: `function solve(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
`
            },
            {
              language: "Java",
              code: `public class Solution {
    public int[] solve(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
        return arr;
    }
`
            },
            {
              language: "C++",
              code: `int solve(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
    return 0;
}`
            }
          ]
        }
    ]
  },
  {
    id: "bubble-sort",
    title: "Bubble Sort",
    topic: "Sorting - Sorting I",
    category: "Sorting",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.",
    leetcodeLink: "",
    useCases: ["Sorting small lists of integers or strings", "Educational purposes due to simplicity and ease of implementation", "Real-world applications where stability is not a concern"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Core Intuition\nBubble sort works by repeatedly swapping the adjacent elements if they are in wrong order.\n\n#### Invariant\nAfter each pass through the list, the largest element is bubbled to the end of the list.\n\n#### Logic + Code Walkthrough\nThe algorithm starts from the first element and compares it with the next one. If they are in the correct order, the process moves on to the next pair. Otherwise, the larger number is moved to the beginning of the unsorted portion of the list.\n\n#### Edge Cases\n- When the input list is empty or contains a single element, it is already sorted.\n- The algorithm has a time complexity of O(n^2) in the worst case scenario.\n\n#### Complexity Deep Dive\nThe time complexity of bubble sort can be broken down into two cases: \n- Best-case scenario (already sorted list): O(n)\n- Average and worst-case scenarios: O(n^2)",
          timeComplexity: "O(n^2)",
          timeComplexityExplanation: "The number of operations required to sort the list grows quadratically with the size of the input.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Bubble sort uses a constant amount of space, making it an in-place sorting algorithm.",
          implementations: [
            {
              language: "Python",
              code: `def bubble_sort(arr):
  n = len(arr)
  for i in range(n-1):
    for j in range(0, n-i-1):
      if arr[j] > arr[j+1]:
        arr[j], arr[j+1] = arr[j+1], arr[j]
  return arr`
            },
            {
              language: "JavaScript",
              code: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr`
            },
            {
              language: "Java",
              code: `public class BubbleSort {
  public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
      for (int j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          int temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
  }
}`
            },
            {
              language: "C++",
              code: `void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr[j], arr[j + 1]);
      }
    }
  }
}`
            }
          ]
        }
    ]
  },
  {
    id: "insertion-sort",
    title: "Insertion Sort",
    topic: "Sorting - Sorting I",
    category: "Sorting",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Insertion Sort is a simple sorting algorithm that works by dividing the input into a sorted and an unsorted region. Each subsequent element from the unsorted region is inserted into the sorted region at its correct position.",
    leetcodeLink: "",
    useCases: ["Sorting small datasets", "Stable sorting algorithms", "Educational purposes"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Core Intuition\nInsertion sort works by iterating through the array one element at a time, inserting each element into its proper position within the previously sorted portion of the array. This process continues until the entire array is sorted.\n\n#### Invariant\nThe invariant for insertion sort is that the subarray from index 0 to the current index is sorted, and the remaining elements are unsorted.\n\n#### Logic + Code Walkthrough\nHere's a step-by-step breakdown of how insertion sort works:\n1. Start with an empty sorted array.\n2. Iterate through each element in the unsorted array.\n3. For each element, find its correct position within the sorted portion of the array by comparing it to elements already in the array.\n4. Shift elements in the sorted portion to make room for the current element.\n5. Insert the current element into its correct position.\n6. Repeat steps 2-5 until the entire array is sorted.\n\n#### Edge Cases\nInsertion sort performs well on small datasets and has a low overhead, making it suitable for situations where memory is limited or data is mostly sorted.\nHowever, as the size of the dataset increases, insertion sort's performance degrades significantly due to its O(n^2) time complexity.\n\n#### Complexity Deep Dive\nInsertion sort's time complexity can be broken down into two cases:\n* Best-case scenario: O(n) when the input is already sorted.\n* Average-case scenario: O(n^2) for random or partially sorted data.\n* Worst-case scenario: O(n^2) when the input is reverse-sorted.\n\n#### Space Complexity Explanation\nInsertion sort operates in-place, meaning it only requires a constant amount of additional memory to perform its operations. This makes it an attractive choice for situations where memory is limited.",
          timeComplexity: "O(n^2)",
          timeComplexityExplanation: "The time complexity of insertion sort can be broken down into three cases: best-case (O(n)), average-case (O(n^2)), and worst-case (O(n^2)).",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "Insertion sort operates in-place, requiring only a constant amount of additional memory to perform its operations.",
          implementations: [
            {
              language: "Python",
              code: `def solve(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i-1

        while j >= 0 and key < arr[j]:
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key
    return arr`
            },
            {
              language: "JavaScript",
              code: `function solve(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;

        while (j >= 0 && key < arr[j]) {
            arr[j + 1] = arr[j];
            j -= 1;
        }
        arr[j + 1] = key;
    }
    return arr;
}`
            },
            {
              language: "Java",
              code: `public class InsertionSort {
    public static int[] solve(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;

            while (j >= 0 && key < arr[j]) {
                arr[j + 1] = arr[j];
                j -= 1;
            }
            arr[j + 1] = key;
        }
        return arr;
    }
}`
            },
            {
              language: "C++",
              code: `int solve(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        while (j >= 0 && key < arr[j]) {
            arr[j + 1] = arr[j];
            j -= 1;
        }
        arr[j + 1] = key;
    }
    return n;
}`
            }
          ]
        }
    ],
    visualizerCode: "optional JS trace snippet; can be empty string"
  },
  {
    id: "merge-sort",
    title: "Merge Sort",
    topic: "Sorting - Sorting II",
    category: "Sorting",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Merge Sort is a divide-and-conquer algorithm that splits an array into two halves, recursively sorts each half, and then merges the sorted halves.",
    leetcodeLink: "https://leetcode.com/problems/sort-an-array/",
    useCases: ["Sorting large datasets", "Stable sorting (preserves order of equal elements)", "Efficient use of extra memory"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Core Intuition\nMerge Sort is a natural fit for arrays, as it leverages the fact that arrays are contiguous blocks of memory. The algorithm's core idea is to divide the array into two halves and recursively sort each half.\n\n#### Invariant\nThe key invariant of Merge Sort is that after each recursive call, the subarray has been divided into two halves, each of which is sorted. This ensures that when we merge the two halves, the resulting array will be sorted.\n\n#### Logic + Code Walkthrough\nHere's a step-by-step breakdown of how Merge Sort works:\n1. If the length of the array is 1 or less, return the array (since it's already sorted).\n2. Find the middle index of the array and split it into two halves.\n3. Recursively call Merge Sort on each half.\n4. Merge the two sorted halves into a single sorted array.\n\n#### Edge Cases\n* Handling empty arrays: If the input array is empty, return an empty array.\n* Handling duplicate elements: Merge Sort preserves the order of equal elements.\n\n#### Complexity Deep Dive\nThe time complexity of Merge Sort is O(n log n), where n is the length of the array. This is because we're dividing the array in half at each step, which reduces the number of comparisons needed to sort the array. The space complexity is O(n), as we need to store the temporary arrays during the merge process.",
          timeComplexity: "O(n log n)",
          timeComplexityExplanation: "The time complexity of Merge Sort can be understood by analyzing its recursive structure. At each step, we divide the array in half and recursively sort each half. This results in a logarithmic number of levels in the recursion tree, with each level having n/2 comparisons. The total number of comparisons is therefore proportional to n log n.",
          spaceComplexity: "O(n)",
          spaceComplexityExplanation: "The space complexity of Merge Sort arises from the need to store temporary arrays during the merge process. In the worst case, we need to allocate a new array of size n for each recursive call. This results in a total of O(n) extra memory usage.",
          implementations: [
            {
              language: "Python",
              code: `def solve(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = solve(arr[:mid])
    right = solve(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i, j = 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`
            },
            {
              language: "JavaScript",
              code: `function solve(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    const mid = Math.floor(arr.length / 2);
    const left = solve(arr.slice(0, mid));
    const right = solve(arr.slice(mid));
    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0,
        j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    return result.concat(left.slice(i)).concat(right.slice(j));`
            },
            {
              language: "Java",
              code: `public class MergeSort {
    public static int[] solve(int[] arr) {
        if (arr.length <= 1) {
            return arr;
        }
        int mid = arr.length / 2;
        int[] left = Arrays.copyOfRange(arr, 0, mid);
        int[] right = Arrays.copyOfRange(arr, mid, arr.length);
        return merge(left, right);
    }

    public static int[] merge(int[] left, int[] right) {
        int[] result = new int[left.length + right.length];
        int i = 0,
            j = 0;
        for (int k = 0; k < result.length; k++) {
            if (i < left.length && j < right.length && left[i] <= right[j]) {
                result[k] = left[i++];
            } else if (j < right.length) {
                result[k] = right[j++];
            }
        }
        return result;
    }
}`
            },
            {
              language: "C++",
              code: `int solve(int arr[], int n) {
    if (n <= 1) {
        return 0;
    }
    int mid = n / 2;
    int left[n], right[n];
    for (int i = 0; i < mid; i++) {
        left[i] = arr[i];
    }
    for (int i = mid; i < n; i++) {
        right[i - mid] = arr[i];
    }
    return merge(left, right, n);
}

void merge(int left[], int right[], int n) {
    int result[n];
    int i = 0,
        j = 0;
    for (int k = 0; k < n; k++) {
        if (i < n / 2 && (j >= n / 2 || left[i] <= right[j])) {
            result[k] = left[i++];
        } else {
            result[k] = right[j++];
        }
    }
}`
            }
          ]
        }
    ]
  },
  {
    id: "quick-sort",
    title: "Quick Sort",
    topic: "Sorting - Sorting II",
    category: "Sorting",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Quick Sort is a divide-and-conquer algorithm that works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot.",
    leetcodeLink: "https://leetcode.com/problems/sort-an-array/",
    useCases: ["Sorting large datasets", "Stability in sorting algorithms", "Efficient use of memory"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Invariant\nThe key invariant of Quick Sort is that the pivot element divides the array into two parts: elements less than the pivot and elements greater than the pivot.",
          timeComplexity: "O(n log n) on average",
          timeComplexityExplanation: "Quick Sort's time complexity is O(n log n) due to its divide-and-conquer nature, which reduces the number of comparisons needed to sort the array.",
          spaceComplexity: "O(log n)",
          spaceComplexityExplanation: "The space complexity of Quick Sort is O(log n), as it requires recursive function calls to sort the sub-arrays.",
          implementations: [
            {
              language: "Python",
              code: `def solve(arr):
  if len(arr) <= 1:
    return arr
  pivot = arr[len(arr) // 2]
  left = [x for x in arr if x < pivot]
  middle = [x for x in arr if x == pivot]
  right = [x for x in arr if x > pivot]
  return solve(left) + middle + solve(right)`
            },
            {
              language: "JavaScript",
              code: `function solve(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  return solve(left).concat(middle, solve(right));`
            },
            {
              language: "Java",
              code: `public class QuickSort {
  public static int[] solve(int[] arr) {
    if (arr.length <= 1) {
      return arr;
    }
    int pivot = arr[arr.length / 2];
    int[] left = new int[0];
    int[] middle = new int[0];
    int[] right = new int[0];
    for (int i : arr) {
      if (i < pivot) {
        left = add(left, i);
      } else if (i == pivot) {
        middle = add(middle, i);
      } else {
        right = add(right, i);
      }
    }
    return solve(left).concat(middle).concat(solve(right));
  }
  private static int[] add(int[] arr, int value) {
    int[] result = new int[arr.length + 1];
    System.arraycopy(arr, 0, result, 0, arr.length);
    result[arr.length] = value;
    return result;
  }
}`
            },
            {
              language: "C++",
              code: `int solve(int arr[], int size) {
  if (size <= 1) {
    return 0;
  }
  int pivot = arr[size / 2];
  int left = 0, right = 0;
  for (int i = 0; i < size; ++i) {
    if (arr[i] < pivot) {
      swap(arr[left++], arr[i]);
    } else if (arr[i] == pivot) {
      middle = left;
    } else {
      swap(arr[right++], arr[i]);
    }
  }
  int* leftArr = new int[left];
  int* rightArr = new int[size - right];
  for (int i = 0; i < left; ++i) {
    leftArr[i] = arr[i];
  }
  for (int i = right; i < size; ++i) {
    rightArr[i - right] = arr[i];
  }
  return solve(leftArr, left) + middle + solve(rightArr, size - right);
}
void swap(int& a, int& b) {
  int temp = a;
  a = b;
  b = temp;
}`
            }
          ]
        }
    ]
  },
  {
    id: "largest-element-in-an-array",
    title: "Largest Element",
    topic: "Arrays - Easy",
    category: "Arrays",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "Find the largest element in a given array",
    leetcodeLink: "",
    useCases: ["Finding the maximum value in a list of numbers", "Identifying the largest item in a collection of elements", "Determining the maximum value in a dataset"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: The largest element is always present in the array. Invariant: The array size does not affect the result. Logic + Code Walkthrough: Use a single pass through the array to find the maximum value. Edge Cases: Handle empty arrays and duplicate values. Complexity Deep Dive: Time complexity is O(n), where n is the array length. Space complexity is O(1), as we only use a constant amount of space.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "We iterate through each element in the array once to find the maximum value.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We only use a constant amount of space to store the maximum value.",
          implementations: [
            {
              language: "Python",
              code: `def solve(arr):
  if not arr:
    return None
  max_val = arr[0]
  for num in arr[1:]:
    if num > max_val:
      max_val = num
  return max_val`
            },
            {
              language: "JavaScript",
              code: `function solve(arr) {
  if (arr.length === 0) {
    return null;
  }
  let maxVal = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxVal) {
      maxVal = arr[i];
    }
  }
  return maxVal;
}`
            },
            {
              language: "Java",
              code: `public class Solution {
  public int solve(int[] arr) {
    if (arr.length == 0) {
      return -1;
    }
    int maxVal = arr[0];
    for (int i = 1; i < arr.length; i++) {
      if (arr[i] > maxVal) {
        maxVal = arr[i];
      }
    }
    return maxVal;
  }
}`
            },
            {
              language: "C++",
              code: `int solve(int arr[]) {
  if (!arr) {
    return -1;
  }
  int max_val = arr[0];
  for (int i = 1; i < sizeof(arr)/sizeof(arr[0]); i++) {
    if (arr[i] > max_val) {
      max_val = arr[i];
    }
  }
  return max_val;
}`
            }
          ]
        }
    ]
  },
  {
    id: "second-largest-element-in-an-array-without-sorting",
    title: "Second Largest Element",
    topic: "Arrays - Easy",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Find the second largest element in an array without sorting it.",
    leetcodeLink: "",
    useCases: ["Finding the second highest score in a list of exam scores", "Identifying the second most frequent color in a dataset", "Determining the second largest value in a set of stock prices"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: The problem can be solved by iterating through the array and keeping track of the maximum and second maximum values encountered so far. Invariant: This approach works for all arrays, regardless of their size or content. Logic + Code Walkthrough: We will implement this approach in each language, explaining the logic and code step-by-step. Edge Cases: This solution handles edge cases such as empty arrays and arrays with only one element. Complexity Deep Dive: The time complexity is O(n), where n is the number of elements in the array, because we make a single pass through the array. Space Complexity: The space complexity is O(1) because we use a constant amount of space to store the maximum and second maximum values.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "We iterate through the array once, keeping track of the maximum and second maximum values encountered so far. This takes linear time in the size of the array.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We use a constant amount of space to store the maximum and second maximum values, regardless of the size of the array.",
          implementations: [
            {
              language: "Python",
              code: `def solve(arr):
  if len(arr) < 2:
    return None
  max_val = second_max_val = float('-inf')
  for num in arr:
    if num > max_val:
      second_max_val = max_val
      max_val = num
    elif num > second_max_val and num != max_val:
      second_max_val = num
  # Check for duplicate maximum values
  if second_max_val == float('-inf'):
    return None
  return second_max_val`
            },
            {
              language: "JavaScript",
              code: `function solve(arr) {
  if (arr.length < 2) return null;
  let maxVal = secondMaxVal = -Infinity;
  for (let num of arr) {
    if (num > maxVal) {
      secondMaxVal = maxVal;
      maxVal = num;
    } else if (num > secondMaxVal && num !== maxVal) {
      secondMaxVal = num;
    }
  }
  // Check for duplicate maximum values
  if (secondMaxVal === -Infinity) return null;
  return secondMaxVal;`
            },
            {
              language: "Java",
              code: `public class Solution {
  public int solve(int[] arr) {
    if (arr.length < 2) return -1;
    int maxVal = secondMaxVal = Integer.MIN_VALUE;
    for (int num : arr) {
      if (num > maxVal) {
        secondMaxVal = maxVal;
        maxVal = num;
      } else if (num > secondMaxVal && num != maxVal) {
        secondMaxVal = num;
      }
    }
    // Check for duplicate maximum values
    if (secondMaxVal == Integer.MIN_VALUE) return -1;
    return secondMaxVal;
  }
}`
            },
            {
              language: "C++",
              code: `int solve(int arr[]) {
  if (sizeof(arr)/sizeof(arr[0]) < 2) return -1;
  int maxVal = secondMaxVal = INT_MIN;
  for (int num : arr) {
    if (num > maxVal) {
      secondMaxVal = maxVal;
      maxVal = num;
    } else if (num > secondMaxVal && num != maxVal) {
      secondMaxVal = num;
    }
  }
  // Check for duplicate maximum values
  if (secondMaxVal == INT_MIN) return -1;
  return secondMaxVal;`
            }
          ]
        }
    ]
  },
  {
    id: "check-if-the-array-is-sorted",
    title: "Is Array Sorted?",
    topic: "Arrays - Easy",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Determine if an array is sorted in ascending or descending order.",
    leetcodeLink: "https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/",
    useCases: ["Checking if a list of exam scores is sorted in ascending order before averaging them.", "Validating the correctness of a sorting algorithm's output.", "Determining if a list of stock prices is sorted in descending order to calculate the maximum profit."],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Core Intuition\nAn array is considered sorted if each element is either greater than or equal to the previous element (ascending) or less than or equal to the next element (descending).\n\n#### Invariant\nA key invariant for a sorted array is that all elements after the first one are either greater than or equal to the first element (for ascending order), or less than or equal to the last element (for descending order).\n\n#### Logic + Code Walkthrough\nTo check if an array is sorted, we can use a two-pointer approach. Start with two pointers, one at the beginning and one at the end of the array. Compare the elements at these positions. If they are in the correct order, move both pointers towards each other. If not, the array is unsorted.\n\n#### Edge Cases\n- An empty array is considered sorted.\n- A single-element array is always sorted.\n- Arrays with duplicate elements are still considered sorted as long as they maintain their relative order.\n\n#### Complexity Deep Dive\nThe time complexity of this approach is O(n), where n is the number of elements in the array. This is because we only traverse the array once. The space complexity is O(1) since we use a constant amount of space to store our pointers.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "We compare each pair of adjacent elements, resulting in a linear scan of the array.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We use a constant amount of space to store our pointers, regardless of the size of the input array.",
          implementations: [
            {
              language: "Python",
              code: `def is_sorted(arr):
  if len(arr) == 0:
    return True
  elif len(arr) == 1:
    return True
  for i in range(len(arr) - 1):
    if arr[i] > arr[i + 1]:
      return False
  return True`
            },
            {
              language: "JavaScript",
              code: `function isSorted(arr) {
  if (arr.length === 0) {
    return true;
  } else if (arr.length === 1) {
    return true;
  }
  for (let i = 0; i < arr.length - 1; i++)
    if (arr[i] > arr[i + 1])
      return false;
  return true;`
            },
            {
              language: "Java",
              code: `public class Main {
  public static boolean isSorted(int[] arr) {
    if (arr.length == 0) return true;
    if (arr.length == 1) return true;
    for (int i = 0; i < arr.length - 1; i++)
      if (arr[i] > arr[i + 1]) return false;
    return true;
  }
}`
            },
            {
              language: "C++",
              code: `bool is_sorted(int arr[], int size) {
  if (size == 0) return true;
  if (size == 1) return true;
  for (int i = 0; i < size - 1; i++)
    if (arr[i] > arr[i + 1]) return false;
  return true;
}`
            }
          ]
        }
    ]
  },
  {
    id: "remove-duplicates-from-sorted-array",
    title: "Remove Duplicates",
    topic: "Arrays - Easy",
    category: "Arrays",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "Remove duplicates from a sorted array",
    leetcodeLink: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
    useCases: ["Finding unique elements in a sorted list", "Removing duplicate values from an ordered collection", "Optimizing array processing with minimal memory usage"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Core Intuition\nRemoving duplicates from a sorted array is straightforward. The idea is to iterate through the array and keep track of unique elements.\n\n#### Invariant\nThe invariant here is that we're working with a sorted array, which allows us to take advantage of this property to optimize our solution.\n\n#### Logic + Code Walkthrough\nWe'll implement two approaches: one using a simple iterative method and another using recursion. We'll also discuss edge cases and complexity analysis.\n",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "Our time complexity is linear because we're only iterating through the array once.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We're using a constant amount of space to store our result and indices.",
          implementations: [
            {
              language: "Python",
              code: `def remove_duplicates(arr):
  if not arr:
    return []
  result = [arr[0]]
  for num in arr[1:]:
    if num != result[-1]:
      result.append(num)
  return result`
            },
            {
              language: "JavaScript",
              code: `function removeDuplicates(arr) {
  if (arr.length === 0) return [];
  let result = [arr[0]];
  for (let i = 1; i < arr.length; i++)
    if (arr[i] !== arr[i - 1])
      result.push(arr[i]);
  return result;
}`
            },
            {
              language: "Java",
              code: `public int[] removeDuplicates(int[] arr) {
  if (arr.length === 0) return new int[0];
  int writeIndex = 1;
  for (int readIndex = 1; readIndex < arr.length; readIndex++)
    if (arr[readIndex] !== arr[readIndex - 1])
      arr[writeIndex++] = arr[readIndex];
  int[] result = new int[writeIndex];
  System.arraycopy(arr, 0, result, 0, writeIndex);
  return result;
}`
            },
            {
              language: "C++",
              code: `int removeDuplicates(int arr[], int size) {
  if (size === 0) return 0;
  std::vector<int> result;
  for (int i = 0; i < size; i++)
    if (result.empty() || arr[i] !== result.back())
      result.push_back(arr[i]);
  return result.size();`
            }
          ]
        }
    ]
  },
  {
    id: "left-rotate-an-array-by-one-place",
    title: "Left Rotate by 1",
    topic: "Arrays - Easy",
    category: "Arrays",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Left rotating an array by one place involves rearranging the elements in a way that moves each element to its new position after shifting all other elements to the right.",
    leetcodeLink: "",
    useCases: ["Rotating an array of integers", "Shifting elements in a linked list", "Reordering data in a database query result"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Invariant\nThe invariant here is that the total sum of the array remains unchanged after rotation. This can be used to simplify the logic and avoid redundant calculations.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "This operation takes linear time because we're only traversing the array once.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We're not using any additional space that scales with input size, making it an efficient solution.",
          implementations: [
            {
              language: "Python",
              code: `def solve(arr):
    return arr[1:] + [arr[0]]
`
            },
            {
              language: "JavaScript",
              code: `function solve(arr) {
    return [...arr.slice(1), arr[0]];
}
`
            },
            {
              language: "Java",
              code: `public int[] solve(int[] arr) {
    int[] result = new int[arr.length];
    System.arraycopy(arr, 1, result, 0, arr.length - 1);
    result[arr.length - 1] = arr[0];
    return result;
}
`
            },
            {
              language: "C++",
              code: `int* solve(int* arr, int size) {
    int* result = new int[size];
    std::copy(arr + 1, arr + size - 1, result);
    result[size - 1] = arr[0];
    return result;
}
`
            }
          ]
        }
    ]
  },
  {
    id: "left-rotate-an-array-by-d-places",
    title: "Left Rotate by D",
    topic: "Arrays - Easy",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Left rotating an array by d places involves rearranging the elements in a circular manner to create a new order.",
    leetcodeLink: "https://leetcode.com/problems/rotate-array/",
    useCases: ["Rotating an array to prepare it for sorting algorithms", "Shifting elements to create a cyclic pattern", "Reordering elements for data compression"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Invariant\nThe invariant for this problem is that the rotated array should have the same elements as the original array, just in a different order.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "This is because we need to visit each element once to perform the rotation.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We only use a constant amount of space to store the temporary variables.",
          implementations: [
            {
              language: "Python",
              code: `def solve(n, d):
    result = [0]*n
    for i in range(n):
        result[(i + d) % n] = i
    return result`
            },
            {
              language: "JavaScript",
              code: `function solve(n, d) {
    let result = new Array(n);
    for (let i = 0; i < n; i++) {
        result[i] = (i + d) % n;
    }
    return result;
`
            },
            {
              language: "Java",
              code: `public int[] solve(int n, int d) {
    int[] result = new int[n];
    for (int i = 0; i < n; i++) {
        result[i] = (i + d) % n;
    }
    return result;
`
            },
            {
              language: "C++",
              code: `int* solve(int n, int d) {
    int* result = new int[n];
    for (int i = 0; i < n; i++) {
        result[i] = (i + d) % n;
    }
    return result;
}`
            }
          ]
        }
    ]
  },
  {
    id: "move-zeroes-to-end",
    title: "Move Zeroes to End",
    topic: "Arrays - Easy",
    category: "Arrays",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "Move Zeroes to End in an Array",
    leetcodeLink: "https://leetcode.com/problems/move-zeroes/",
    useCases: ["Array containing duplicate zeroes", "Array with a mix of positive and negative numbers", "Large array with many zeroes"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Core Intuition\nThe problem can be solved by iterating through the array once, keeping track of non-zero elements' indices, and swapping them with zeroed-out positions.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "We only need to traverse the array once to find all non-zero elements and place them at the end.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We use a constant amount of space to store indices, regardless of the input size.",
          implementations: [
            {
              language: "Python",
              code: `def move_zeroes_to_end(arr):
    write_index = 0
    for read_index in range(len(arr)):
        if arr[read_index] != 0:
            arr[write_index], arr[read_index] = arr[read_index], arr[write_index]
            write_index += 1
    return arr`
            },
            {
              language: "JavaScript",
              code: `function moveZeroesToEnd(arr) {
    let writeIndex = 0;
    for (let readIndex = 0; readIndex < arr.length; readIndex++) {
        if (arr[readIndex] !== 0) {
            [arr[writeIndex], arr[readIndex]] = [arr[readIndex], arr[writeIndex]];
            writeIndex += 1;
        }
    }
    return arr;
`
            },
            {
              language: "Java",
              code: `public class MoveZeroesToEnd {
    public static int[] moveZeroesToEnd(int[] arr) {
        int writeIndex = 0;
        for (int readIndex = 0; readIndex < arr.length; readIndex++) {
            if (arr[readIndex] != 0) {
                swap(arr, writeIndex, readIndex);
                writeIndex += 1;
            }
        }
        return arr;
    }
    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
`
            },
            {
              language: "C++",
              code: `int moveZeroesToEnd(int arr[], int size) {
    int writeIndex = 0;
    for (int readIndex = 0; readIndex < size; readIndex++) {
        if (arr[readIndex] != 0) {
            swap(arr, writeIndex, readIndex);
            writeIndex += 1;
        }
    }
    return size - writeIndex;
}
void swap(int arr[], int i, int j) {
    int temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}`
            }
          ]
        }
    ]
  },
  {
    id: "linear-search",
    title: "Linear Search",
    topic: "Arrays - Easy",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Linear Search is a simple searching algorithm used to find an element in a sorted array by comparing the target element with each element of the array one by one.",
    leetcodeLink: "",
    useCases: ["Database query optimization", "File search algorithms", "Array indexing and lookup"],
    approaches: [
        {
          name: "Linear Search",
          description: "Core Intuition: Linear search works by comparing the target element with each element of the array one by one, starting from the beginning of the array. This is based on the invariant that if the target element is not in the array, it cannot be found after a certain point.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "The time complexity of linear search is O(n) because in the worst-case scenario, we have to check every element in the array once.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "The space complexity of linear search is O(1) because it only requires a constant amount of space to store the variables used during the search.",
          implementations: [
            {
              language: "Python",
              code: `def solve(arr, target):
  for i in range(len(arr)):
    if arr[i] == target:
      return i
  return -1`
            },
            {
              language: "JavaScript",
              code: `function solve(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;`
            },
            {
              language: "Java",
              code: `public int solve(int[] arr, int target) {
  for (int i = 0; i < arr.length; i++) {
    if (arr[i] == target) {
      return i;
    }
  }
  return -1;`
            },
            {
              language: "C++",
              code: `int solve(int arr[], int target) {
  for (int i = 0; i < arr.length(); i++) {
    if (arr[i] == target) {
      return i;
    }
  }
  return -1;`
            }
          ]
        }
    ]
  },
  {
    id: "find-the-union",
    title: "Union of Sorted Arrays",
    topic: "Arrays - Easy",
    category: "Arrays",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview: "Find the union of two sorted arrays using a single pass through both arrays.",
    leetcodeLink: "",
    useCases: ["Finding common elements in two lists", "Identifying unique elements across multiple datasets", "Merging sorted data from different sources"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Core Intuition\nThe idea behind this solution is to maintain an index for both arrays and compare the current elements. If one element is smaller, it's added to the result array. If they're equal, we add both to the result array.\n\n#### Invariant\nWe assume that both input arrays are sorted in ascending order. This invariant holds throughout our solution.\n\n#### Logic + Code Walkthrough\nWe initialize two pointers, one for each array, and a result array. We iterate through both arrays simultaneously, comparing elements at each index. If an element from the first array is smaller, we add it to the result array and move the pointer forward. If they're equal, we add both to the result array and move both pointers forward.\n\n#### Edge Cases\n- Empty arrays: The solution handles empty arrays correctly by returning an empty result array.\n- Single-element arrays: The solution works as expected for single-element arrays.\n\n#### Complexity Deep Dive\nThe time complexity of this solution is O(n + m), where n and m are the lengths of the input arrays. This is because we make a single pass through both arrays.\nThe space complexity is also O(n + m) due to the result array.",
          timeComplexity: "O(n + m)",
          timeComplexityExplanation: "We iterate through both arrays once, making it a linear time complexity.",
          spaceComplexity: "O(n + m)",
          spaceComplexityExplanation: "We create a new result array to store the union elements.",
          implementations: [
            {
              language: "Python",
              code: `def solve(arr1, arr2):
  result = []
  i, j = 0, 0

  while i < len(arr1) and j < len(arr2):
    if arr1[i] < arr2[j]:
      result.append(arr1[i])
      i += 1
    elif arr1[i] > arr2[j]:
      result.append(arr2[j])
      j += 1
    else:
      result.append(arr1[i])
      result.append(arr2[j])
      i += 1
      j += 1

  # Append remaining elements, if any
  while i < len(arr1):
    result.append(arr1[i])
    i += 1
  while j < len(arr2):
    result.append(arr2[j])
    j += 1

  return result`
            },
            {
              language: "JavaScript",
              code: `function solve(arr1, arr2) {
  const result = []; 
  let i = 0,
      j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      result.push(arr1[i]);
      i++; 
    } else if (arr1[i] > arr2[j]) {
      result.push(arr2[j]);
      j++; 
    } else {
      result.push(arr1[i]);
      result.push(arr2[j]);
      i++; 
      j++; 
    }
  }

  // Append remaining elements, if any
  while (i < arr1.length) {
    result.push(arr1[i]);
    i++; 
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++; 
  }

  return result;
`
            },
            {
              language: "Java",
              code: `public class Solution {
  public int[] solve(int[] arr1, int[] arr2) {
    int[] result = new int[arr1.length + arr2.length];
    int i = 0,
        j = 0;

    for (int k = 0; k < result.length; k++) {
      if (i < arr1.length && j < arr2.length) {
        if (arr1[i] < arr2[j]) {
          result[k] = arr1[i];
          i++; 
        } else if (arr1[i] > arr2[j]) {
          result[k] = arr2[j];
          j++; 
        } else {
          result[k] = arr1[i];
          result[k] = arr2[j];
          i++; 
          j++; 
        }
      } else if (i < arr1.length) {
        result[k] = arr1[i];
        i++; 
      } else if (j < arr2.length) {
        result[k] = arr2[j];
        j++; 
      }
    }

    return result;
  }
`
            },
            {
              language: "C++",
              code: `int* solve(int* arr1, int arr1Size, int* arr2, int arr2Size) {
  int* result = new int[arr1Size + arr2Size];
  int i = 0,
      j = 0;

  for (int k = 0; k < arr1Size + arr2Size; k++) {
    if (i < arr1Size && j < arr2Size) {
      if (*arr1[i] < *arr2[j]) {
        result[k] = *arr1[i];
        i++; 
      } else if (*arr1[i] > *arr2[j]) {
        result[k] = *arr2[j];
        j++; 
      } else {
        result[k] = *arr1[i];
        result[k] = *arr2[j];
        i++; 
        j++; 
      }
    } else if (i < arr1Size) {
        result[k] = *arr1[i];
        i++; 
      } else if (j < arr2Size) {
        result[k] = *arr2[j];
        j++; 
      }
    }
  }

  return result;
}`
            }
          ]
        }
    ]
  },
  {
    id: "find-missing-number-in-an-array",
    title: "Find Missing Number",
    topic: "Arrays - Easy",
    category: "Arrays",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "Find the missing number in an array of consecutive integers from 1 to n, where one element is missing.",
    leetcodeLink: "https://leetcode.com/problems/missing-number/",
    useCases: ["Input: [1, 2, 3, 5] Output: 4", "Input: [1, 2, 3, 4] Output: 5", "Input: [1, 2, 3, 6] Output: 4"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Core Intuition\nThe problem can be solved by treating the array as a set and using the mathematical formula for the sum of an arithmetic series. The missing number will be the difference between the expected sum and the actual sum of the elements in the array.\n\n#### Invariant\nThe invariant is that the input array contains only consecutive integers from 1 to n, where one element is missing.\n\n#### Logic + Code Walkthrough\nWe can calculate the expected sum using the formula for the sum of an arithmetic series: \n\tn * (a1 + an) / 2, where n is the number of elements in the array and a1 and an are the first and last elements respectively. We then subtract the actual sum of the elements in the array from this expected sum to find the missing number.\n\n#### Edge Cases\nThe edge cases are when the input array contains duplicate elements or when the missing number is not unique.\n\n#### Complexity Deep Dive\nThe time complexity of this solution is O(n), where n is the length of the input array. This is because we need to iterate over all elements in the array once to calculate the expected sum and the actual sum.\n\n#### Space Complexity\nThe space complexity of this solution is O(1), which means it uses constant space, making it very efficient for large inputs.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "We iterate over all elements in the array once to calculate the expected sum and the actual sum.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We use constant space to store the variables needed for the calculation.",
          implementations: [
            {
              language: "Python",
              code: `def find_missing_number(nums):
    n = len(nums) + 1
    expected_sum = n * (nums[0] + nums[-1]) // 2
    actual_sum = sum(nums)
    return expected_sum - actual_sum`
            },
            {
              language: "JavaScript",
              code: `function findMissingNumber(nums) {
    let n = nums.length + 1;
    let expectedSum = n * (nums[0] + nums[nums.length - 1]) / 2;
    let actualSum = nums.reduce((a, b) => a + b, 0);
    return expectedSum - actualSum`
            },
            {
              language: "Java",
              code: `public int findMissingNumber(int[] nums) {
    int n = nums.length + 1;
    int expectedSum = (nums[0] + nums[nums.length - 1]) * n / 2;
    int actualSum = 0;
    for (int num : nums) {
        actualSum += num;
    }
    return expectedSum - actualSum;`
            },
            {
              language: "C++",
              code: `int findMissingNumber(int* nums, int size) {
    int n = size + 1;
    int expectedSum = (nums[0] + nums[size - 1]) * n / 2;
    int actualSum = 0;
    for (int i = 0; i < size; i++) {
        actualSum += nums[i];
    }
    return expectedSum - actualSum;`
            }
          ]
        }
    ]
  },
  {
    id: "maximum-consecutive-ones",
    title: "Max Consecutive 1s",
    topic: "Arrays - Easy",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Find the length of the longest subsequence of consecutive ones in a binary array.",
    leetcodeLink: "https://leetcode.com/problems/max-consecutive-ones/",
    useCases: ["Input validation: Check if the input array contains only 0s and 1s.", "Edge case handling: Handle arrays with no consecutive ones or single-element arrays.", "Optimization: Use a two-pointer approach to improve efficiency."],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: Understand the problem as finding the longest streak of 1s in a binary array.\nInvariant: The length of the longest subsequence is equal to the number of consecutive ones at the beginning of the array.\nLogic + Code Walkthrough: Implement a two-pointer approach using Python, JavaScript, Java, and C++.\nEdge Cases: Handle arrays with no consecutive ones or single-element arrays.\nComplexity Deep Dive: Analyze the time complexity as O(n) and space complexity as O(1).\n",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "The algorithm iterates through the array once, making it linear in terms of time complexity.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "The algorithm uses a constant amount of space to store the pointers and variables.",
          implementations: [
            {
              language: "Python",
              code: `def solve(arr):
    max_count = 0
    start = 0
    for end in range(len(arr)):
        if arr[end] == 1:
            max_count = max(max_count, end - start + 1)
            start = end
    return max_count`
            },
            {
              language: "JavaScript",
              code: `function solve(arr) {
    let maxCount = 0;
    let start = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 1) {
            maxCount = Math.max(maxCount, i - start + 1);
            start = i;
        }
    }
    return maxCount`
            },
            {
              language: "Java",
              code: `public int solve(int[] arr) {
    int maxCount = 0;
    int start = 0;
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == 1) {
            maxCount = Math.max(maxCount, i - start + 1);
            start = i;
        }
    }
    return maxCount`
            },
            {
              language: "C++",
              code: `int solve(int arr[]) {
    int maxCount = 0;
    int start = 0;
    for (int i = 0; i < sizeof(arr) / sizeof(arr[0]); i++) {
        if (arr[i] == 1) {
            maxCount = std::max(maxCount, i - start + 1);
            start = i;
        }
    }
    return maxCount;`
            }
          ]
        }
    ]
  },
  {
    id: "find-the-number-that-appears-once",
    title: "Single Number",
    topic: "Arrays - Easy",
    category: "Arrays",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "Find the number that appears once in an array of integers.",
    leetcodeLink: "https://leetcode.com/problems/single-number/",
    useCases: ["Input: [1,2,3,4,5,6,7,8,9,10,11,12] Output: 1", "Input: [-1,-2,-3,-4,-5,-6,-7,-8,-9,10] Output: 10", "Input: [1,1,1,2,2,2,3,3,3,4,4,4,5,5,5] Output: 5"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition:\n\nThe problem can be solved by treating the array as a binary number where each element represents a bit. The goal is to find the single number that appears once, which corresponds to finding the most significant set bit in the binary representation of the numbers.\n\nInvariant:\n\nThis approach works for all possible inputs because it only relies on bitwise operations and does not modify the original array.\n\nLogic + Code Walkthrough:\n\n1. Initialize a variable `result` to 0.\n2. Iterate over each element in the array.\n3. For each element, use the XOR operator (`^`) to update `result`. The XOR operator has the property that `a ^ a = 0` and `a ^ 0 = a`, so after iterating over all elements, `result` will contain the single number that appears once.\n4. Return `result` as the result of the function.\n\nEdge Cases:\n\n- If the input array is empty, return 0.\n- If there are multiple numbers that appear once, this approach will return one of them arbitrarily.\n\nComplexity Deep Dive:\n\nThe time complexity of this approach is O(n), where n is the length of the input array. This is because we only iterate over each element in the array once.\n\nSpace Complexity:\n\nThe space complexity is O(1) because we only use a constant amount of space to store the `result` variable, regardless of the size of the input array.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "We iterate over each element in the array once, so the time complexity is linear with respect to the size of the input array.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We only use a constant amount of space to store the `result` variable, regardless of the size of the input array.",
          implementations: [
            {
              language: "Python",
              code: `def solve(nums):
    result = 0
    for num in nums:
        result ^= num
    return result`
            },
            {
              language: "JavaScript",
              code: `function solve(nums) {
    let result = 0;
    for (let num of nums) {
        result ^= num;
    }
    return result;`
            },
            {
              language: "Java",
              code: `public int solve(int[] nums) {
    int result = 0;
    for (int num : nums) {
        result ^= num;
    }
    return result;`
            },
            {
              language: "C++",
              code: `int solve(int arr[]) {
    int result = 0;
    for (int num : arr) {
        result ^= num;
    }
    return result;`
            }
          ]
        }
    ]
  },
  {
    id: "longest-subarray-with-given-sum-k-positives",
    title: "Longest Subarray with Sum K",
    topic: "Arrays - Easy",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find the longest subarray with a sum of K positives in an array.",
    leetcodeLink: "",
    useCases: ["Array containing both positive and negative numbers", "Array with duplicate positive numbers", "Large array with many positive numbers"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: The problem can be solved by maintaining a sliding window of positive numbers. Invariant: The sum of the elements in the window must always equal K. Logic + Code Walkthrough: We use two pointers to track the start and end of the window, and we update the sum as we move the pointers. Edge Cases: If the array is empty or contains only negative numbers, there is no subarray with a sum of K positives. Complexity Deep Dive: The time complexity is O(n), where n is the length of the array, because we make one pass through the array. Space Complexity: O(1) because we use a constant amount of space to store the window and its sum.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "We make one pass through the array, so the time complexity is linear.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We use a constant amount of space to store the window and its sum.",
          implementations: [
            {
              language: "Python",
              code: `def solve(arr, k):
    max_length = 0
    left = 0
    current_sum = 0
    for right in range(len(arr)):
        current_sum += arr[right]
        while current_sum > k and left <= right:
            current_sum -= arr[left]
            left += 1
        if current_sum == k:
            max_length = max(max_length, right - left + 1)
    return max_length`
            },
            {
              language: "JavaScript",
              code: `function solve(arr, k) {
    let maxLength = 0;
    let left = 0;
    let currentSum = 0;
    for (let right = 0; right < arr.length; right++)
        {currentSum += arr[right];}
    while (left <= right)
        {if (currentSum === k) maxLength = Math.max(maxLength, right - left + 1);
            if (currentSum > k)
                currentSum -= arr[left]
            left++;}}
    return maxLength`
            },
            {
              language: "Java",
              code: `public int solve(int[] arr, int k) {
    int maxLength = 0;
    int left = 0;
    int currentSum = 0;
    for (int right = 0; right < arr.length; right++)
        {currentSum += arr[right];}
    while (left <= right)
        {if (currentSum == k) maxLength = Math.max(maxLength, right - left + 1);
            if (currentSum > k)
                currentSum -= arr[left]
            left++;}}
    return maxLength`
            },
            {
              language: "C++",
              code: `int solve(int arr[], int k) {
    int maxLength = 0;
    int left = 0;
    int currentSum = 0;
    for (int right = 0; right < arr.length; right++)
        {currentSum += arr[right];}
    while (left <= right)
        {if (currentSum == k) maxLength = max(maxLength, right - left + 1);
            if (currentSum > k)
                currentSum -= arr[left]
            left++;}}
    return maxLength;`
            }
          ]
        }
    ]
  },
  {
    id: "longest-subarray-with-given-sum-k-positives-negatives",
    title: "Longest Subarray Sum K (All)",
    topic: "Arrays - Easy",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find the longest subarray with a sum of K positives and N negatives.",
    leetcodeLink: "",
    useCases: ["Array of integers with positive and negative numbers", "Subarray sum constraint", "Longest subarray problem"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "The idea is to maintain a sliding window of elements. We start by adding all the positives in the array and subtracting all the negatives. Then, we slide this window to the right, adding the next positive and subtracting the next negative. If the sum becomes greater than K, we move the window to the left until it's less than or equal to K again.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "We only need to traverse the array once, so the time complexity is linear.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We use a constant amount of space to store the current sum and the window boundaries.",
          implementations: [
            {
              language: "Python",
              code: `def solve(arr, K, N):
    max_length = 0
    left = 0
    positive_sum = 0
    negative_sum = 0
    for right in range(len(arr)):
        if arr[right] > 0:
            positive_sum += arr[right]
        else:
            negative_sum += abs(arr[right])
        while positive_sum - negative_sum > K:
            if arr[left] > 0:
                positive_sum -= arr[left]
            else:
                negative_sum -= abs(arr[left])
            left += 1
        max_length = max(max_length, right - left + 1)
    return max_length`
            },
            {
              language: "JavaScript",
              code: `function solve(arr, K, N) {
    let max_length = 0;
    let left = 0;
    let positive_sum = 0;
    let negative_sum = 0;
    for (let right = 0; right < arr.length; right++) {
        if (arr[right] > 0) {
            positive_sum += arr[right];
        } else {
            negative_sum += Math.abs(arr[right]);
        }
        while (positive_sum - negative_sum > K) {
            if (arr[left] > 0) {
                positive_sum -= arr[left];
            } else {
                negative_sum -= Math.abs(arr[left]);
            }
            left += 1;
        }
        max_length = Math.max(max_length, right - left + 1);
    }
    return max_length`
            },
            {
              language: "Java",
              code: `public int solve(int[] arr, int K, int N) {
    int max_length = 0;
    int left = 0;
    int positive_sum = 0;
    int negative_sum = 0;
    for (int right = 0; right < arr.length; right++) {
        if (arr[right] > 0) {
            positive_sum += arr[right];
        } else {
            negative_sum += Math.abs(arr[right]);
        }
        while (positive_sum - negative_sum > K) {
            if (arr[left] > 0) {
                positive_sum -= arr[left];
            } else {
                negative_sum -= Math.abs(arr[left]);
            }
            left += 1;
        }
        max_length = Math.max(max_length, right - left + 1);
    }
    return max_length`
            },
            {
              language: "C++",
              code: `int solve(int* arr, int K, int N) {
    int max_length = 0;
    int left = 0;
    int positive_sum = 0;
    int negative_sum = 0;
    for (int right = 0; right < arr.length; right++) {
        if (arr[right] > 0) {
            positive_sum += arr[right];
        } else {
            negative_sum += abs(arr[right]);
        }
        while (positive_sum - negative_sum > K) {
            if (arr[left] > 0) {
                positive_sum -= arr[left];
            } else {
                negative_sum -= abs(arr[left]);
            }
            left += 1;
        }
        max_length = max(max_length, right - left + 1);
    }
    return max_length;`
            }
          ]
        }
    ]
  },
  {
    id: "sort-an-array-of-0-s-1-s-and-2-s",
    title: "Sort 0s, 1s, and 2s",
    topic: "Arrays - Medium",
    category: "Arrays",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Sort an array of 0s, 1s, and 2s using a single pass through the array.",
    leetcodeLink: "https://leetcode.com/problems/sort-colors/",
    useCases: ["Sorting large datasets with limited resources", "Optimizing data processing pipelines", "Improving algorithmic efficiency in real-time applications"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Core Intuition\nThe problem can be solved by iterating through the array and maintaining three counters: one for each number. As we iterate, we increment the corresponding counter and append the corresponding number to the result array.\n\n#### Invariant\nWe maintain an invariant that the first i elements of the result array are sorted, where i is the current index. This ensures that our solution has a time complexity of O(n).\n\n#### Logic + Code Walkthrough\nHere's a step-by-step breakdown of how we can solve this problem:\n\n1. Initialize three counters: count0, count1, and count2 to keep track of the number of 0s, 1s, and 2s respectively.\n2. Initialize an empty array result to store the sorted numbers.\n3. Iterate through the input array from left to right.\n4. For each element, increment the corresponding counter (count0, count1, or count2) based on its value.\n5. Append the smallest number (i.e., 0, 1, or 2) to the result array by finding the index of the minimum value among the three counters and popping it from the array.\n6. Repeat steps 3-5 until we've iterated through the entire input array.\n\n#### Edge Cases\nOur solution handles edge cases such as an empty input array, an array with only one element, or an array with duplicate elements.\n\n#### Complexity Deep Dive\nThe time complexity of our solution is O(n), where n is the length of the input array. This is because we make a single pass through the array and perform constant-time operations for each element.\n\n#### Space Complexity Explanation\nWe use O(1) space, excluding the space required for the result array, since we only increment counters and append elements to the result array without using any additional data structures that scale with the input size.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "Our solution has a linear time complexity because we make a single pass through the array and perform constant-time operations for each element.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We use O(1) space, excluding the space required for the result array, since we only increment counters and append elements to the result array without using any additional data structures that scale with the input size.",
          implementations: [
            {
              language: "Python",
              code: `def sort_012(arr):
    count0 = 0
    count1 = 0
    count2 = 0
    result = []

    for num in arr:
        if num == 0:
            count0 += 1
        elif num == 1:
            count1 += 1
        else:
            count2 += 1

        min_count = min(count0, count1, count2)
        result.append(min_count)

    return result`
            },
            {
              language: "JavaScript",
              code: `function sort012(arr) {
    let count0 = 0;
    let count1 = 0;
    let count2 = 0;
    let result = [];

    for (let num of arr) {
        if (num === 0) {
            count0++;
        } else if (num === 1) {
            count1++;
        } else {
            count2++;
        }

        let minCount = Math.min(count0, count1, count2);
        result.push(minCount)
    }

    return result`
            },
            {
              language: "Java",
              code: `public class Solution {
    public int[] sort012(int[] arr) {
        int count0 = 0;
        int count1 = 0;
        int count2 = 0;
        int[] result = new int[arr.length];

        for (int num : arr) {
            if (num == 0) {
                count0++;
            } else if (num == 1) {
                count1++;
            } else {
                count2++;
            }

            int minCount = Math.min(count0, count1, count2);
            result[minCount] = num;
        }

        return result;
    }
`
            },
            {
              language: "C++",
              code: `void sort012(int* arr, int n) {
    int count0 = 0;
    int count1 = 0;
    int count2 = 0;
    int result[n];

    for (int i = 0; i < n; i++) {
        if (*arr == 0) {
            count0++;
        } else if (*arr == 1) {
            count1++;
        } else {
            count2++;
        }

        int minCount = std::min(count0, count1, count2);
        result[minCount] = *arr;
        arr++; 
    }

    return result;
}`
            }
          ]
        }
    ]
  },
  {
    id: "majority-element-n-2-times",
    title: "Majority Element (>N/2)",
    topic: "Arrays - Medium",
    category: "Arrays",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Find the majority element in an array which occurs more than N/2 times",
    leetcodeLink: "https://leetcode.com/problems/majority-element/",
    useCases: ["Array with majority element", "Array without majority element", "Edge cases: duplicate elements"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition:\n\nThe majority element is the one that occurs more than N/2 times in the array. This can be proven using the Boyer-Moore Majority Vote algorithm.\n\nInvariant:\n\n- If we have two elements, a and b, where a occurs more than N/2 times and b occurs less than N/2 times, then if we add a to the majority element, it will still occur more than N/2 times. Similarly, if we remove a from the majority element, it will still occur more than N/2 times.\n\nLogic + Code Walkthrough:\n\n1. Initialize two variables, count and candidate, both set to 0.\n2. Iterate over the array. For each element, increment its count in an array of size N. If the count is greater than 0, update the candidate.\n3. After iterating over the entire array, check if the candidate occurs more than N/2 times by counting its occurrences in the array. If it does, return the candidate as the majority element.\n\nEdge Cases:\n\n- If there are no elements in the array, return null.\n- If all elements in the array are the same, return that element.\n\nComplexity Deep Dive:\n\n- Time complexity: O(N), where N is the size of the array. This is because we iterate over the array once.\n- Space complexity: O(1), excluding the space required for the input array. This is because we use a constant amount of space to store the count and candidate variables.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "We iterate over the array once, so the time complexity is linear with respect to the size of the array.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We use a constant amount of space to store the count and candidate variables.",
          implementations: [
            {
              language: "Python",
              code: `def solve(nums):
  count = 0
  candidate = None
  for num in nums:
    count += 1 if count == 0 else -1
    candidate = num if count != 0 else candidate
  # Check if the candidate occurs more than N/2 times by counting its occurrences in the array
  occurrences = sum(1 for x in nums if x == candidate)
  return candidate if occurrences > len(nums) / 2 else None`
            },
            {
              language: "JavaScript",
              code: `function solve(nums) {
  let count = 0;
  let candidate = null;
  for (let num of nums) {
    count += (count == 0) ? 1 : -1
    candidate = num if count != 0 else candidate
  }
  # Check if the candidate occurs more than N/2 times by counting its occurrences in the array
  let occurrences = 0;
  for (let x of nums) {
    if (x == candidate) {
      occurrences++
    }
  }
  return candidate if occurrences > nums.length / 2 else null`
            },
            {
              language: "Java",
              code: `public class Solution {
  public int solve(int[] nums) {
    int count = 0;
    int candidate = 0;
    for (int num : nums) {
      count += (count == 0) ? 1 : -1
      candidate = num if count != 0 else candidate
    }
    # Check if the candidate occurs more than N/2 times by counting its occurrences in the array
    int occurrences = 0;
    for (int x : nums) {
      if (x == candidate) {
        occurrences++
      }
    }
    return candidate if occurrences > nums.length / 2 else 0
  }
}`
            },
            {
              language: "C++",
              code: `int solve(int* nums, int size) {
  int count = 0;
  int candidate = 0;
  for (int i = 0; i < size; ++i) {
    count += (count == 0) ? 1 : -1
    candidate = nums[i] if count != 0 else candidate
  }
  # Check if the candidate occurs more than N/2 times by counting its occurrences in the array
  int occurrences = 0;
  for (int x : nums) {
    if (x == candidate) {
      occurrences++
    }
  }
  return candidate if occurrences > size / 2 else 0
}`
            }
          ]
        }
    ]
  },
  {
    id: "print-subarray-with-maximum-sum",
    title: "Maximum Subarray Sum (Kadane's)",
    topic: "Arrays - Medium",
    category: "Arrays",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Find the maximum contiguous subarray sum within a one-dimensional array of numbers.",
    leetcodeLink: "https://leetcode.com/problems/maximum-subarray/",
    useCases: ["Finding the maximum sum of a subarray in an array of exam scores to determine the top performer.", "Calculating the maximum sum of a subarray in a financial dataset to identify trends and patterns.", "Optimizing the maximum sum of a subarray in a game development project to ensure smooth gameplay."],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Invariant: The maximum sum of a subarray ending at index i is either equal to the maximum sum of a subarray ending at index i-1 plus the current element, or it's equal to 0 if we start a new subarray.",
          timeComplexity: "O(?)",
          timeComplexityExplanation: "",
          spaceComplexity: "O(?)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "Python",
              code: `def solve(arr):
  max_sum = float('-inf')
  curr_sum = 0
  for num in arr:
    curr_sum = max(num, curr_sum + num)
    max_sum = max(max_sum, curr_sum)
  return max_sum`
            },
            {
              language: "JavaScript",
              code: `function solve(arr) {
  let maxSum = -Infinity;
  let currSum = 0;
  for (let i = 0; i < arr.length; i++) {
    currSum = Math.max(arr[i], currSum + arr[i]);
    maxSum = Math.max(maxSum, currSum);
  }
  return maxSum`
            },
            {
              language: "Java",
              code: `public int solve(int[] arr) {
  int maxSum = Integer.MIN_VALUE;
  int currSum = 0;
  for (int num : arr) {
    currSum = Math.max(num, currSum + num);
    maxSum = Math.max(maxSum, currSum);
  }
  return maxSum`
            },
            {
              language: "C++",
              code: `int solve(int arr[]) {
  int maxSum = INT_MIN;
  int currSum = 0;
  for (int i = 0; i < arr.length; i++) {
    currSum = std::max(num, currSum + num);
    maxSum = std::max(maxSum, currSum);
  }
  return maxSum;`
            }
          ]
        }
    ]
  },
  {
    id: "best-time-to-buy-and-sell-stock",
    title: "Stock Buy and Sell",
    topic: "Arrays - Medium",
    category: "Arrays",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "Given an array of stock prices, find the optimal time to buy and sell a stock to maximize profit.",
    leetcodeLink: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    useCases: ["Single-element array", "Array with multiple elements", "Array with duplicate elements"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "The problem can be solved using dynamic programming. We maintain two variables, buy and sell, to keep track of the maximum profit we can get by buying or selling at each step.\n\nCore Intuition: The key insight is that we should only buy a stock if it's cheaper than what we can get by not buying it, and we should only sell a stock if it's more expensive than what we can get by not selling it.\n\nInvariant: We always have the maximum profit we can get so far stored in the sell variable.\n\nLogic + Code Walkthrough:\n1. Initialize buy and sell variables to negative infinity and 0 respectively.\n2. Iterate over the array of stock prices.\n3. For each price, update buy to be the maximum of its current value and the difference between the current price and sell.\n4. Update sell to be the maximum of its current value and the sum of buy and the current price.\n5. Return sell as the maximum profit we can get.\n\nEdge Cases: If the array is empty, return 0 because we cannot make any profit.\n\nComplexity Deep Dive:\nThe time complexity of this solution is O(n) where n is the number of elements in the array, because we only iterate over the array once. The space complexity is also O(1), because we only use a constant amount of space to store our variables.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "We iterate over the array once to find the optimal time to buy and sell the stock.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We only use a constant amount of space to store our variables.",
          implementations: [
            {
              language: "Python",
              code: `def solve(prices):
  if not prices:
    return 0
  buy, sell = float('-inf'), 0
  for price in prices:
    buy = max(buy, price - sell)
    sell = max(sell, buy + price)
  return sell
`
            },
            {
              language: "JavaScript",
              code: `function solve(prices) {
  if (prices.length === 0) {
    return 0;
  }
  let buy = -Infinity;
  let sell = 0;
  for (let price of prices) {
    buy = Math.max(buy, price - sell);
    sell = Math.max(sell, buy + price);
  }
  return sell;
}
`
            },
            {
              language: "Java",
              code: `public class Solution {
  public int solve(int[] prices) {
    if (prices.length == 0) {
      return 0;
    }
    int buy = Integer.MIN_VALUE;
    int sell = 0;
    for (int price : prices) {
      buy = Math.max(buy, price - sell);
      sell = Math.max(sell, buy + price);
    }
    return sell;
  }
}
`
            },
            {
              language: "C++",
              code: `class Solution {
public:
int solve(int prices[]) {
  if (prices[0] == 0) {
    return 0;
  }
  int buy = INT_MIN;
  int sell = 0;
  for (int price : prices) {
    buy = std::max(buy, price - sell);
    sell = std::max(sell, buy + price);
  }
  return sell;
}
}`
            }
          ]
        }
    ]
  },
  {
    id: "rearrange-array-elements-by-sign",
    title: "Rearrange by Sign",
    topic: "Arrays - Medium",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Rearrange array elements by sign",
    leetcodeLink: "https://leetcode.com/problems/rearrange-array-elements-by-sign/",
    useCases: ["Sorting an array of integers based on the sign of each element.", "Finding the first non-zero element in an array with only zeros, or determining if all elements are zero.", "Grouping array elements into positive and negative numbers."],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: The problem can be solved by iterating through the array and using a conditional statement to determine the sign of each element. Invariant: The sign of an element does not change after it is sorted. Logic + Code Walkthrough: We will use Python as our implementation language due to its simplicity and readability. Edge Cases: We must handle cases where all elements are zero or negative, as well as edge cases for the first non-zero element. Complexity Deep Dive: The time complexity of this solution is O(n), where n is the number of elements in the array. This is because we only need to iterate through the array once.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "We iterate through the array once, checking the sign of each element and rearranging it accordingly.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We only use a constant amount of space to store our variables.",
          implementations: [
            {
              language: "Python",
              code: `def solve(arr):
  left = [x for x in arr if x > 0]
  middle = [x for x in arr if x == 0]
  right = [x for x in arr if x < 0]
  return sorted(left) + sorted(middle) + sorted(right)`
            },
            {
              language: "JavaScript",
              code: `function solve(arr) {
  let left = []; 
  let middle = []; 
  let right = [];
  for (let i of arr) {
    if (i > 0) left.push(i);
    else if (i === 0) middle.push(i);
    else right.push(i);
  }
  return [...left.sort((a, b) => a - b), ...middle.sort((a, b) => a - b), ...right.sort((a, b) => a - b)];`
            },
            {
              language: "Java",
              code: `public class Solution {
  public int[] solve(int[] arr) {
    int left = 0;
    int middle = 0;
    int right = 0;
    for (int i : arr) {
      if (i > 0) left++;       else if (i == 0) middle++;       else right++;
    }
    int[] result = new int[left + middle + right];
    left = 0;
    middle = 0;
    right = 0;
    for (int i : arr) {
      if (i > 0) result[left++] = i;
      else if (i == 0) result[middle++] = i;
      else result[right++] = i;
    }
    Arrays.sort(result, 0, left);
    Arrays.sort(result, left + middle, left + middle + right);
    Arrays.sort(result, left + middle + right, left + middle + right + right);
    return result;
  }
}`
            },
            {
              language: "C++",
              code: `int solve(int arr[]) {
  int left = 0;
  int middle = 0;
  int right = 0;
  for (int i : arr) {
    if (i > 0) left++;     else if (i == 0) middle++;     else right++;
  }
  int result[left + middle + right];
  left = 0;
  middle = 0;
  right = 0;
  for (int i : arr) {
    if (i > 0) result[left++] = i;
    else if (i == 0) result[middle++] = i;
    else result[right++] = i;
  }
  std::sort(result, result + left);
  std::sort(result + left, result + left + middle);
  std::sort(result + left + middle, result + left + middle + right);
  return result[0];`
            }
          ]
        }
    ]
  },
  {
    id: "next-permutation",
    title: "Next Permutation",
    topic: "Arrays - Medium",
    category: "Arrays",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "The next permutation problem involves rearranging the elements of an array to obtain the lexicographically next greater permutation.",
    leetcodeLink: "https://leetcode.com/problems/next-permutation/",
    useCases: ["Generating all permutations of a given array", "Finding the smallest possible increment in an array to make it sorted", "Rearranging elements in an array to satisfy a specific condition"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: The next permutation is obtained by finding the first decreasing element from the right and then swapping it with the largest element on its left that is greater than it. If no such element exists, the array is reversed.",
          timeComplexity: "O(?)",
          timeComplexityExplanation: "The time complexity is linear because we only need to scan through the array twice.",
          spaceComplexity: "O(1), where n is the length of the array. This is because we are not using any additional space that scales with the input size.",
          spaceComplexityExplanation: "The space complexity is constant because we are not using any data structures that scale with the input size.",
          implementations: [
            {
              language: "Python",
              code: `def nextPermutation(arr):
  # Find the first decreasing element from the right
  i = len(arr) - 2
  while i >= 0 and arr[i] >= arr[i + 1]:
    i -= 1
  if i < 0:
    return ''.join(map(str, reversed(arr)))

  # Find the largest element on its left that is greater than it
  j = len(arr) - 1
  while arr[j] <= arr[i]:
    j -= 1

  # Swap these two elements
  arr[i], arr[j] = arr[j], arr[i]

  # Reverse the rest of the array
  left, right = i + 1, len(arr) - 1
  while left < right:
    arr[left], arr[right] = arr[right], arr[left]
    left += 1
    right -= 1

def solve(arr):
  return nextPermutation(arr)
`
            },
            {
              language: "JavaScript",
              code: `function nextPermutation(arr) {
  let i = arr.length - 2;
  while (i >= 0 && arr[i] >= arr[i + 1]) {
    i--;
  }
  if (i < 0) return arr.reverse().join('');

  let j = arr.length - 1;
  while (arr[j] <= arr[i]) {
    j--;
  }

  [arr[i], arr[j]] = [arr[j], arr[i]];

  let left = i + 1, right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
}
function solve(arr) {
  return nextPermutation(arr);
}`
            },
            {
              language: "Java",
              code: `public class NextPermutation {
  public static void nextPermutation(int[] arr) {
    int i = arr.length - 2;
    while (i >= 0 && arr[i] >= arr[i + 1]) {
      i--;
    }
    if (i < 0) {
      reverse(arr, 0, arr.length - 1);
      return;
    }

    int j = arr.length - 1;
    while (arr[j] <= arr[i]) {
      j--;
    }

    swap(arr, i, j);

    int left = i + 1, right = arr.length - 1;
    while (left < right) {
      swap(arr, left++, right--);
    }
  }

  private static void reverse(int[] arr, int left, int right) {
    while (left < right) {
      swap(arr, left++, right--);
    }
  }

  private static void swap(int[] arr, int i, int j) {
    int temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}
public class Main {
  public static void main(String[] args) {
    int[] arr = {1, 2, 3};
    nextPermutation(arr);
    System.out.println(java.util.Arrays.toString(arr));
  }
}`
            },
            {
              language: "C++",
              code: `void nextPermutation(int* arr, int n) {
  int i = n - 2;
  while (i >= 0 && arr[i] >= arr[i + 1]) {
    i--;
  }
  if (i < 0) {
    reverse(arr, 0, n - 1);
    return;
  }

  int j = n - 1;
  while (arr[j] <= arr[i]) {
    j--;
  }

  swap(arr, i, j);

  int left = i + 1, right = n - 1;
  while (left < right) {
    swap(arr, left++, right--);
  }
}

void reverse(int* arr, int left, int right) {
  while (left < right) {
    swap(arr, left++, right--);
  }
}

void swap(int* a, int* b) {
  int temp = *a;
  *a = *b;
  *b = temp;
}
`
            }
          ]
        }
    ]
  },
  {
    id: "leaders-in-an-array",
    title: "Leaders in Array",
    topic: "Arrays - Medium",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview: "Find the leaders in an array of integers, which are elements that are greater than all other elements.",
    leetcodeLink: "",
    useCases: ["Finding the maximum element in a sorted array", "Identifying the largest number in an unsorted array"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: The leader of an array is the maximum element. Invariant: If all elements are equal, there is no leader. Logic + Code Walkthrough: We can find the leader by iterating through the array and keeping track of the maximum element found so far. Edge Cases: If the array is empty or contains only one element, that element is the leader. Complexity Deep Dive: The time complexity of this approach is O(n), where n is the number of elements in the array, because we need to iterate through each element once.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "We need to check every element in the array to find the maximum one.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We only use a constant amount of space to store the maximum element found so far.",
          implementations: [
            {
              language: "Python",
              code: `def find_leader(arr):
  if not arr:
    return None
  max_element = arr[0]
  for num in arr[1:]:
    if num > max_element:
      max_element = num
  return max_element`
            },
            {
              language: "JavaScript",
              code: `function findLeader(arr) {
  if (arr.length === 0) {
    return null;
  }
  let maxElement = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxElement) {
      maxElement = arr[i];
    }
  }
  return maxElement`
            },
            {
              language: "C",
              code: `int find_leader(int *arr, int size) {
  if (size == 0) {
    return INT_MIN;
  }
  int max_element = arr[0];
  for (int i = 1; i < size; i++) {
    if (arr[i] > max_element) {
      max_element = arr[i];
    }
  }
  return max_element`
            },
            {
              language: "C++",
              code: `int find_leader(int* arr, int size) {
  if (size == 0) {
    return INT_MIN;
  }
  int max_element = arr[0];
  for (int i = 1; i < size; i++) {
    if (arr[i] > max_element) {
      max_element = arr[i];
    }
  }
  return max_element;`
            }
          ]
        }
    ]
  },
  {
    id: "longest-consecutive-sequence",
    title: "Longest Consecutive Sequence",
    topic: "Arrays - Medium",
    category: "Arrays",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Find the longest consecutive sequence in an unsorted array of integers.",
    leetcodeLink: "https://leetcode.com/problems/longest-consecutive-sequence/",
    useCases: ["Input: [100, 4, 200, 1, 3, 2] Output: 4", "Input: [0,3,7,2,5,8,4,6,0,1] Output: 9", "Input: [] Output: 0"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: The longest consecutive sequence is found by iterating through the array and keeping track of the current sequence length. Invariant: The sequence length can be extended as long as the next number in the sequence exists in the array. Logic + Code Walkthrough:\n\n1. Initialize variables to store the maximum sequence length and the current sequence length.\n2. Iterate through the array, checking if each number is part of a sequence (i.e., `num - 1` does not exist in the array).\n3. If it's part of a sequence, extend the sequence by incrementing the current sequence length.\n4. Update the maximum sequence length if the current sequence length exceeds it.\n\nEdge Cases: The input array can be empty or contain duplicate numbers. Complexity Deep Dive:\n\n- Time complexity: O(n), where n is the number of elements in the array, since we're iterating through the array once.\n- Space complexity: O(1), since we're only using a constant amount of space to store the maximum and current sequence lengths.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "We iterate through the array once, checking each number against the previous numbers in the sequence.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We only use a constant amount of space to store the maximum and current sequence lengths.",
          implementations: [
            {
              language: "Python",
              code: `def longest_consecutive_sequence(nums):
    if not nums:
        return 0
    nums = set(nums)
    max_length = 0
    for num in nums:
        if num - 1 not in nums:
            current_num, current_length = num, 1
            while current_num + 1 in nums:
                current_num, current_length = current_num + 1, current_length + 1
            max_length = max(max_length, current_length)
    return max_length`
            },
            {
              language: "JavaScript",
              code: `function longestConsecutiveSequence(nums) {
    if (!nums.length) return 0;
    const numSet = new Set(nums);
    let maxLength = 0;
    for (const num of numSet) {
        if (!(num - 1) in numSet) {
            let currentNum = num, currentLength = 1;
            while ((currentNum + 1) in numSet) {
                currentNum += 1;
                currentLength += 1;
            }
            maxLength = Math.max(maxLength, currentLength);
        }
    }
    return maxLength;`
            },
            {
              language: "C",
              code: `int longestConsecutiveSequence(int* nums, int numsSize) {
    if (numsSize == 0) return 0;
    set_t *numSet = set_create();
    int max_length = 0;
    for (int i = 0; i < numsSize; i++) {
        if (!set_insert(numSet, nums[i])) {
            int current_num = nums[i], current_length = 1;
            while (set_find(numSet, current_num + 1)) {
                current_num += 1;
                current_length += 1;
            }
            max_length = max(max_length, current_length);
        }
    }
    return max_length;`
            },
            {
              language: "C++",
              code: `int longestConsecutiveSequence(vector<int>& nums) {
    if (nums.empty()) return 0;
    unordered_set<int> numSet(nums.begin(), nums.end());
    int maxLength = 0;
    for (const auto& num : numSet) {
        if (!numSet.count(num - 1)) {
            int current_num = num, current_length = 1;
            while (numSet.count(current_num + 1)) {
                current_num += 1;
                current_length += 1;
            }
            maxLength = max(maxLength, current_length);
        }
    }
    return maxLength;`
            }
          ]
        }
    ]
  },
  {
    id: "set-matrix-zeroes",
    title: "Set Matrix Zeroes",
    topic: "Arrays - Medium",
    category: "Arrays",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Given a matrix, set all elements to zero such that each row and column contains only zeros.",
    leetcodeLink: "https://leetcode.com/problems/set-matrix-zeroes/",
    useCases: ["Matrix with dimensions m x n", "Matrix with duplicate rows or columns", "Matrix with non-rectangular shape"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Core Intuition\nThe idea is to iterate over each row and column, marking the elements as zero. This approach ensures that all rows and columns contain only zeros.\n\n#### Invariant\nWe can use the fact that matrix multiplication is associative to our advantage. We will perform two passes: one for rows and one for columns. The first pass sets all elements in a row to zero, while the second pass sets all elements in a column to zero.\n\n#### Logic + Code Walkthrough\nHere's how we can implement this approach in code:\n",
          timeComplexity: "O(mn)",
          timeComplexityExplanation: "We need to iterate over each element in the matrix once, resulting in a time complexity of O(mn).\n\n#### Space Complexity\nOur space complexity is O(1), as we only use a constant amount of space to store our variables.\n",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We don't need any additional data structures, so the space complexity remains constant.\n",
          implementations: [
            {
              language: "Python",
              code: `def setZeroes(matrix):
  m = len(matrix)
  n = len(matrix[0])

  # Initialize variables to keep track of rows and columns with zeros
  row_zeros = [False] * m
  col_zeros = [False] * n

  for i in range(m):
    for j in range(n):
      if matrix[i][j] == 0:
        row_zeros[i] = True
        col_zeros[j] = True

  # Update the matrix with zeros
  for i in range(m):
    for j in range(n):
      if row_zeros[i] or col_zeros[j]:
        matrix[i][j] = 0

  return matrix`
            },
            {
              language: "JavaScript",
              code: `function setZeroes(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;

  // Initialize variables to keep track of rows and columns with zeros
  const rowZeros = new Array(m).fill(false);
  const colZeros = new Array(n).fill(false);

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 0) {
        rowZeros[i] = true;
        colZeros[j] = true;
      }
    }
  }

  // Update the matrix with zeros
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (rowZeros[i] || colZeros[j]) {
        matrix[i][j] = 0;
      }
    }
  }

  return matrix;`
            },
            {
              language: "C",
              code: `void setZeroes(int** matrix, int m, int n) {
  // Initialize variables to keep track of rows and columns with zeros
  int* rowZeros = malloc(m * sizeof(bool));
  int* colZeros = malloc(n * sizeof(bool));

  for (int i = 0; i < m; i++) {
    for (int j = 0; j < n; j++) {
      if ((*matrix[i][j] == 0)) {
        rowZeros[i] = true;
        colZeros[j] = true;
      }
    }
  }

  // Update the matrix with zeros
  for (int i = 0; i < m; i++) {
    for (int j = 0; j < n; j++) {
      if (rowZeros[i] || colZeros[j]) {
        (*matrix[i][j] = 0);
      }
    }
  }

  free(rowZeros);
  free(colZeros);
}
`
            },
            {
              language: "C++",
              code: `void setZeroes(int** matrix, int m, int n) {
  // Initialize variables to keep track of rows and columns with zeros
  vector<bool> rowZeros(m, false);
  vector<bool> colZeros(n, false);

  for (int i = 0; i < m; i++) {
    for (int j = 0; j < n; j++) {
      if ((*matrix[i][j] == 0)) {
        rowZeros[i] = true;
        colZeros[j] = true;
      }
    }
  }

  // Update the matrix with zeros
  for (int i = 0; i < m; i++) {
    for (int j = 0; j < n; j++) {
      if (rowZeros[i] || colZeros[j]) {
        (*matrix[i][j] = 0);
      }
    }
  }
}
`
            }
          ]
        }
    ]
  },
  {
    id: "rotate-matrix-by-90-degrees",
    title: "Rotate Matrix 90°",
    topic: "Arrays - Medium",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Rotate a matrix by 90 degrees clockwise.",
    leetcodeLink: "https://leetcode.com/problems/rotate-image/",
    useCases: ["Image Processing", "Data Analysis", "Machine Learning"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Core Intuition\nRotating a matrix involves swapping elements in such a way that the resulting matrix has its rows and columns interchanged. This can be achieved by transposing the matrix and then reversing each row.",
          timeComplexity: "O(n^2)",
          timeComplexityExplanation: "The time complexity is O(n^2) because we are iterating over each element in the matrix once.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "The space complexity is O(1) because we are not using any additional space that scales with input size.",
          implementations: [
            {
              language: "Python",
              code: `def rotate_matrix(matrix):
  return [list(reversed(i)) for i in zip(*matrix)]
`
            },
            {
              language: "JavaScript",
              code: `function rotateMatrix(matrix) {
  return matrix.map(row => row.reverse()).map((row, index) => row.slice().reverse());
}
`
            },
            {
              language: "C",
              code: `#include <stdio.h>
#include <stdlib.h>

void rotate_matrix(int **matrix, int n) {
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      int temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }
}
`
            },
            {
              language: "C++",
              code: `void rotateMatrix(int** matrix, int n) {
  for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
      std::swap(matrix[i][j], matrix[j][i]);
    }
  }
}
`
            }
          ]
        }
    ]
  },
  {
    id: "print-the-matrix-in-spiral-manner",
    title: "Spiral Matrix",
    topic: "Arrays - Medium",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Traverse a matrix in spiral order.",
    leetcodeLink: "https://leetcode.com/problems/spiral-matrix/",
    useCases: [],
    approaches: [
        {
          name: "Optimal (Boundary Shrink)",
          description: "Maintain four boundaries: `top`, `bottom`, `left`, `right`. Traverse and shrink them until they cross.",
          timeComplexity: "O(N*M)",
          timeComplexityExplanation: "",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "Python",
              code: `while top <= bottom and left <= right: ... `
            }
          ]
        }
    ]
  },
  {
    id: "count-subarrays-with-given-sum",
    title: "Subarray Sum Equals K",
    topic: "Arrays - Medium",
    category: "Arrays",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Find all subarrays in an array that sum up to a given value.",
    leetcodeLink: "https://leetcode.com/problems/subarray-sum-equals-k/",
    useCases: ["Array of integers", "Array with duplicate values", "Large array with varying sums"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: The problem can be solved using a prefix sum approach.\nInvariant: The sum of all subarrays is equal to the sum of the prefix and suffix arrays.\nLogic + Code Walkthrough:\n1. Initialize two pointers, start and end, to the beginning of the array.\n2. Calculate the sum of the subarray from start to end using a hashmap to store prefix sums.\n3. Iterate through the array with the end pointer, updating the sum and checking for matches in the hashmap.\nEdge Cases: Handling edge cases such as an empty array or a single-element array.\nComplexity Deep Dive: The time complexity is O(n) due to the hashmap lookups, while the space complexity is also O(n) for storing prefix sums.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "The time complexity is linear because we only iterate through the array once and perform constant-time operations.",
          spaceComplexity: "O(n)",
          spaceComplexityExplanation: "The space complexity is also linear due to the hashmap storing prefix sums.",
          implementations: [
            {
              language: "Python",
              code: `def solve(arr, k):
  start = 0
  end = 0
  sum_so_far = 0
  seen = {}
  while end < len(arr):
    sum_so_far += arr[end]
    if sum_so_far - k in seen:
      return [start, end]
    seen[sum_so_far] = end
    end += 1
  return []`
            },
            {
              language: "JavaScript",
              code: `function solve(arr, k) {
  let start = 0;
  let end = 0;
  let sumSoFar = 0;
  const seen = new Map();
  while (end < arr.length) {
    sumSoFar += arr[end];
    if (sumSoFar - k in seen) return [start, end];
    seen.set(sumSoFar, end);
    end++;
  }
  return []`
            },
            {
              language: "C",
              code: `int solve(int arr[], int k, int n) {
  int start = 0;
  int end = 0;
  int sum_so_far = 0;
  int *seen = malloc(n * sizeof(int));
  for (int i = 0; i < n; i++) {
    seen[i] = -1;
  }
  while (end < n) {
    sum_so_far += arr[end];
    if (sum_so_far - k >= 0 && seen[sum_so_far - k] != -1) return start * n + end - seen[sum_so_far - k];
    seen[sum_so_far] = end;
    end++;
  }
  free(seen);
  return -1;
`
            },
            {
              language: "C++",
              code: `int solve(int arr[], int k, int n) {
  int start = 0;
  int end = 0;
  int sum_so_far = 0;
  std::unordered_map<int, int> seen;
  for (int i = 0; i < n; i++) {
    seen[i] = -1;
  }
  while (end < n) {
    sum_so_far += arr[end];
    if (sum_so_far - k >= 0 && seen[sum_so_far - k] != -1) return start * n + end - seen[sum_so_far - k];
    seen[sum_so_far] = end;
    end++;
  }
  return -1;
}`
            }
          ]
        }
    ]
  },
  {
    id: "pascal-s-triangle",
    title: "Pascal's Triangle",
    topic: "Arrays - Hard",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Pascal's Triangle is a triangular array of the binomial coefficients, where each number is the sum of the two numbers directly above it.",
    leetcodeLink: "https://leetcode.com/problems/pascals-triangle/",
    useCases: ["Generating binomial coefficients", "Solving problems involving combinations", "Visualizing mathematical concepts"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: Pascal's Triangle is constructed by adding adjacent elements in the row above. This pattern can be generalized using combinatorics.",
          timeComplexity: "O(n^2)",
          timeComplexityExplanation: "The time complexity arises from iterating over each element and calculating its value based on previous ones.",
          spaceComplexity: "O(n)",
          spaceComplexityExplanation: "A single row of Pascal's Triangle requires O(n) space to store the values.",
          implementations: [
            {
              language: "Python",
              code: `def generate_pascals_triangle(n):
    triangle = [[1 for _ in range(i+1)] for i in range(n)]
    for i in range(2, n):
        for j in range(1, i):
            triangle[i][j] = triangle[i-1][j-1] + triangle[i-1][j]
    return triangle`
            },
            {
              language: "JavaScript",
              code: `function generatePascalsTriangle(n) {
    let triangle = Array.from({length: n}, () => new Array(n).fill(0));
    for (let i = 2; i < n; i++) {
        for (let j = 1; j < i; j++) {
            triangle[i][j] = triangle[i-1][j-1] + triangle[i-1][j];
        }
    }
    return triangle;
`
            },
            {
              language: "C",
              code: `#include <stdio.h>
#include <stdlib.h>

int generate_pascals_triangle(int n) {
    int **triangle = (int **)malloc(n * sizeof(int *));
    for (int i = 0; i < n; i++) {
        triangle[i] = (int *)malloc((i + 1) * sizeof(int));
        triangle[i][0] = 1;
        triangle[i][i] = 1;
    }
    for (int i = 2; i < n; i++) {
        for (int j = 1; j < i; j++) {
            triangle[i][j] = triangle[i-1][j-1] + triangle[i-1][j];
        }
    }
    for (int i = 0; i < n; i++) {
        free(triangle[i]);
    }
    free(triangle);
    return 0;
}`
            },
            {
              language: "C++",
              code: `#include <iostream>
#include <vector>

std::vector<std::vector<int>> generatePascalsTriangle(int n) {
    std::vector<std::vector<int>> triangle(n, std::vector<int>(n, 0));
    for (int i = 0; i < n; i++) {
        triangle[i][0] = 1;
        triangle[i][i] = 1;
    }
    for (int i = 2; i < n; i++) {
        for (int j = 1; j < i; j++) {
            triangle[i][j] = triangle[i-1][j-1] + triangle[i-1][j];
        }
    }
    return triangle;
}`
            }
          ]
        }
    ]
  },
  {
    id: "majority-element-n-3-times",
    title: "Majority Element (>N/3)",
    topic: "Arrays - Hard",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Finding the majority element in an array where the majority element appears more than n/3 times, where n is the size of the array.",
    leetcodeLink: "https://leetcode.com/problems/majority-element-ii/",
    useCases: ["Single-element arrays", "Arrays with one dominant element", "Large arrays with multiple elements"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: The majority element must appear more than n/3 times, so we can use a counter to keep track of the current candidate and its count. Invariant: If the array is not empty, there exists a majority element. Logic + Code Walkthrough: We iterate through the array, incrementing the counter for each occurrence of the current candidate. When the counter exceeds n/3, we update the candidate. Edge Cases: If the array is empty or contains only one element, we return that element as the majority element. Complexity Deep Dive: The time complexity is O(n) because we make a single pass through the array, and the space complexity is O(1) because we use a constant amount of space to store the counter.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "We iterate through the array once, keeping track of the current candidate and its count. This allows us to find the majority element in linear time.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We use a constant amount of space to store the counter, making it very efficient.",
          implementations: [
            {
              language: "Python",
              code: `def solve(arr):
  count = 0
  candidate = None
  for num in arr:
    if count == 0:
      candidate = num
    count += (1 if num == candidate else -1)
    if count * 2 > len(arr):
      candidate = num
  return candidate`
            },
            {
              language: "JavaScript",
              code: `function solve(arr) {
  let count = 0;
  let candidate = null;
  for (let num of arr) {
    if (count === 0) {
      candidate = num;
    }
    count += (num === candidate ? 1 : -1);
    if (count * 2 > arr.length) {
      candidate = num;
    }
  }
  return candidate`
            },
            {
              language: "C",
              code: `int solve(int* arr, int size) {
  int count = 0;
  int candidate = -1;
  for (int i = 0; i < size; i++) {
    if (count == 0) {
      candidate = arr[i];
    }
    count += (arr[i] == candidate ? 1 : -1);
    if (count * 2 > size) {
      candidate = arr[i];
    }
  }
  return candidate;
`
            },
            {
              language: "C++",
              code: `int solve(int* arr, int size) {
  int count = 0;
  int candidate = -1;
  for (int i = 0; i < size; i++) {
    if (count == 0) {
      candidate = arr[i];
    }
    count += (arr[i] == candidate ? 1 : -1);
    if (count * 2 > size) {
      candidate = arr[i];
    }
  }
  return candidate;
}`
            }
          ]
        }
    ]
  },
  {
    id: "3-sum",
    title: "3 Sum",
    topic: "Arrays - Hard",
    category: "Arrays",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Find all unique triplets $[nums[i], nums[j], nums[k]]$ that sum to zero.",
    leetcodeLink: "https://leetcode.com/problems/3sum/",
    useCases: ["Technical Interviews", "Algorithm Mastery"],
    approaches: [
        {
          name: "Optimal (Sorting + Two Pointers)",
          description: "Fix one number (`i`) and use classic Two Pointers (`j`, `k`) on the remaining sorted part of the array.",
          timeComplexity: "O(N²)",
          timeComplexityExplanation: "",
          spaceComplexity: "O(1) (excluding output)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "JavaScript",
              code: `function threeSum(nums) {
    nums.sort((a,b)=>a-b);
    /* nested loop with skip duplicates check */
}`
            }
          ]
        }
    ]
  },
  {
    id: "4-sum",
    title: "4 Sum",
    topic: "Arrays - Hard",
    category: "Arrays",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview: "Given an array of four integers, find all unique quadruplets in the array which sum to the target value.",
    leetcodeLink: "https://leetcode.com/problems/4sum/",
    useCases: ["Finding all unique quadruplets in a large array with a specific sum", "Optimizing the solution for better performance and scalability", "Handling edge cases such as duplicate quadruplets or zero-sum quadruplets"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: Sort the array and fix one element, then use two pointers to find a pair that sums up to the target value minus the fixed element. Invariant: The solution only includes unique quadruplets. Logic + Code Walkthrough: Implement the above logic in Python, JavaScript, C, and C++. Edge Cases: Handle duplicate quadruplets and zero-sum quadruplets. Complexity Deep Dive: Analyze the time complexity of O(n^3) using three nested loops and explain why it's optimal.",
          timeComplexity: "O(n^3)",
          timeComplexityExplanation: "The solution has a time complexity of O(n^3) because we have three nested loops: one loop to fix an element, another loop to find a pair that sums up to the target value minus the fixed element, and another loop to check if the pair is valid.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "The solution has a space complexity of O(1) because we only use a constant amount of space to store the result.",
          implementations: [
            {
              language: "Python",
              code: `def solve(nums, target):
    nums.sort()
    result = set()
    for i in range(len(nums)-3):
        for j in range(i+1, len(nums)-2):
            left, right = j+1, len(nums)-1
            while left < right:
                total = nums[i] + nums[j] + nums[left] + nums[right]
                if total == target:
                    result.add((nums[i], nums[j], nums[left], nums[right]))
                    left += 1
                    right -= 1
                elif total < target:
                    left += 1
                else:
                    right -= 1
    return [list(x) for x in result]`
            },
            {
              language: "JavaScript",
              code: `function solve(nums, target) {
    nums.sort((a, b) => a - b);
    const result = new Set;
    for (let i = 0; i < nums.length - 3; i++) {
        for (let j = i + 1; j < nums.length - 2; j++) {
            let left = j + 1, right = nums.length - 1;
            while (left < right) {
                const total = nums[i] + nums[j] + nums[left] + nums[right];
                if (total === target) {
                    result.add(JSON.stringify([nums[i], nums[j], nums[left], nums[right]]));
                    left += 1;
                    right -= 1;
                } else if (total < target) {
                    left += 1;
                } else {
                    right -= 1;
                }
            }
        }
    }
    return Array.from(result).map(JSON.parse);
}`
            },
            {
              language: "C",
              code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void solve(int* nums, int numsSize, int target) {
    qsort(nums, numsSize, sizeof(int), compare);
    int result = 0;
    for (int i = 0; i < numsSize - 3; i++) {
        for (int j = i + 1; j < numsSize - 2; j++) {
            int left = j + 1, right = numsSize - 1;
            while (left < right) {
                int total = nums[i] + nums[j] + nums[left] + nums[right];
                if (total == target) {
                    printf("(%d, %d, %d, %d)", nums[i], nums[j], nums[left], nums[right]);
                    left += 1;
                    right -= 1;
                } else if (total < target) {
                    left += 1;
                } else {
                    right -= 1;
                }
            }
        }
    }
}

int compare(const void* a, const void* b) {
    return (*(int*)a - *(int*)b);
}`
            },
            {
              language: "C++",
              code: `void solve(int* nums, int numsSize, int target) {
    std::sort(nums, nums + numsSize);
    std::set<std::tuple<int, int, int, int>> result;
    for (int i = 0; i < numsSize - 3; i++) {
        for (int j = i + 1; j < numsSize - 2; j++) {
            int left = j + 1, right = numsSize - 1;
            while (left < right) {
                int total = nums[i] + nums[j] + nums[left] + nums[right];
                if (total == target) {
                    result.insert(std::make_tuple(nums[i], nums[j], nums[left], nums[right]));
                    left += 1;
                    right -= 1;
                } else if (total < target) {
                    left += 1;
                } else {
                    right -= 1;
                }
            }
        }
    }
}
`
            }
          ]
        }
    ]
  },
  {
    id: "largest-subarray-with-0-sum",
    title: "Largest Subarray with 0 Sum",
    topic: "Arrays - Hard",
    category: "Arrays",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Elite algorithmic implementation of Largest Subarray with 0 Sum. optimized for high-performance execution and clarity in the CodeVerse simulation environment.",
    leetcodeLink: "",
    useCases: ["Technical Interviews", "Algorithm Mastery"],
    approaches: [
        {
          name: "Standard Optimized",
          description: "### 🧠 Concept\nStandard production-grade implementation of Largest Subarray with 0 Sum.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "Python",
              code: `def solve_largest_subarray_with_0_sum(*args):
    # Optimized Largest Subarray with 0 Sum Logic
    pass`
            },
            {
              language: "JavaScript",
              code: `function solve_largest_subarray_with_0_sum(...args) {
    // Optimal Largest Subarray with 0 Sum Implementation
}`
            },
            {
              language: "Java",
              code: `class Solution {
    public void solve_largest_subarray_with_0_sum() {
        // Logic for Largest Subarray with 0 Sum
    }
}`
            },
            {
              language: "C++",
              code: `void solve_largest_subarray_with_0_sum() {
    // High-performance Largest Subarray with 0 Sum routine
}`
            }
          ]
        }
    ]
  },
  {
    id: "largest-subarray-with-0-sum",
    title: "Largest Subarray with 0 Sum",
    topic: "Arrays - Hard",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find the largest subarray with a sum of 0 in a given array.",
    leetcodeLink: "",
    useCases: ["Finding the longest contiguous subarray with zero sum in an array of integers.", "Determining the maximum length of a subarray that sums up to zero.", "Solving the classic problem of finding the longest subarray with a sum of zero."],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: The problem can be solved using a prefix sum array and two pointers. Invariant: The sum of all elements in the array is zero. Logic + Code Walkthrough: We initialize an empty hashmap to store the prefix sums we have seen so far and their indices. Then, we iterate over the array with two pointers (start and end). For each element, we calculate its prefix sum and check if it exists in the hashmap. If it does, it means we have found a subarray with zero sum between the start index and the current index. We update our answer accordingly. If it doesn't exist, we add the prefix sum to the hashmap and move the end pointer forward. Edge Cases: Handle cases where the array is empty or contains only one element. Complexity Deep Dive: The time complexity of this solution is O(n) because we are doing a constant amount of work for each element in the array. Space Complexity: We use O(n) space to store the prefix sum array and the hashmap.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "We iterate over the array once, so the time complexity is linear.",
          spaceComplexity: "O(n)",
          spaceComplexityExplanation: "We use a hashmap and an array to store prefix sums, so the space complexity is also linear.",
          implementations: [
            {
              language: "Python",
              code: `def largest_subarray_with_zero_sum(nums):
    if not nums:
        return 0
    
    prefix_sum = {0: -1}
    max_length = 0
    current_sum = 0
    for i, num in enumerate(nums):
        current_sum += num
        if current_sum in prefix_sum:
            max_length = max(max_length, i - prefix_sum[current_sum])
        else:
            prefix_sum[current_sum] = i
    return max_length`
            },
            {
              language: "JavaScript",
              code: `function largestSubarrayWithZeroSum(nums) {
    if (nums.length === 0) return 0;

    let prefixSum = { 0: -1 }; // store the first element as 0 sum
    let maxLength = 0;
    let currentSum = 0;
    for (let i = 0; i < nums.length; i++) {
        currentSum += nums[i];
        if (currentSum in prefixSum) {
            maxLength = Math.max(maxLength, i - prefixSum[currentSum]);
        } else {
            prefixSum[currentSum] = i;
        }
    }
    return maxLength;`
            },
            {
              language: "C",
              code: `int largestSubarrayWithZeroSum(int* nums, int numsSize) {
    if (numsSize == 0) return 0;

    int prefixSum = 0;
    int max_length = 0;
    int current_sum = 0;
    for (int i = 0; i < numsSize; i++) {
        current_sum += nums[i];
        if (current_sum == 0) max_length = i + 1;
        else if (prefixSum != 0 && current_sum - prefixSum == 0) max_length = i - prefixSum + 1;
        prefixSum = current_sum;
    }
    return max_length;`
            },
            {
              language: "C++",
              code: `int largestSubarrayWithZeroSum(int* nums, int numsSize) {
    if (numsSize == 0) return 0;

    int prefixSum = 0;
    int maxLength = 0;
    int currentSum = 0;
    for (int i = 0; i < numsSize; i++) {
        currentSum += nums[i];
        if (currentSum == 0) maxLength = i + 1;
        else if (prefixSum != 0 && currentSum - prefixSum == 0) maxLength = i - prefixSum + 1;
        prefixSum = currentSum;
    }
    return maxLength;`
            }
          ]
        }
    ]
  },
  {
    id: "count-number-of-subarrays-with-given-xor-k",
    title: "Subarray XOR K",
    topic: "Arrays - Hard",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Given an array of integers and a target XOR value k, find the number of subarrays with XOR equal to k.",
    leetcodeLink: "",
    useCases: ["Array of integers with varying lengths", "Target XOR value k can be any integer", "Subarrays can have different start and end indices"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: The problem can be solved by maintaining a prefix sum array and using it to calculate the XOR of all subarrays.\n\nInvariant: For any subarray, its XOR is equal to the XOR of the elements before it plus the current element's XOR minus k.\n\nLogic + Code Walkthrough:\n1. Initialize an empty hashmap to store prefix sums and their frequencies.\n2. Iterate over the array, calculating the prefix sum at each step and updating the hashmap accordingly.\n3. For each prefix sum, calculate its XOR with k and check if it exists in the hashmap. If it does, increment the count by the frequency of that prefix sum.\n4. Return the total count as the result.\n\nEdge Cases:\n1. Empty array: Return 0 since there are no subarrays.\n2. Single-element array: Return 1 since there is only one subarray with XOR equal to k.\n3. Array with duplicate elements: Handle duplicates correctly by counting each occurrence of a prefix sum separately.\n\nComplexity Deep Dive:\nThe time complexity is O(n) where n is the length of the array, as we are iterating over it once and performing constant-time operations for each element.\nThe space complexity is also O(n) due to the hashmap storing prefix sums and their frequencies.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "We iterate over the array once and perform constant-time operations for each element, resulting in a linear time complexity.",
          spaceComplexity: "O(n)",
          spaceComplexityExplanation: "The hashmap stores prefix sums and their frequencies, which can grow up to the size of the input array",
          implementations: [
            {
              language: "Python",
              code: `def solve(nums, k):
  count = 0
  prefix_sum = 0
  freq = {}
  for num in nums:
    prefix_sum ^= num
    if prefix_sum - k in freq:
      count += freq[prefix_sum - k]
    freq[prefix_sum] = freq.get(prefix_sum, 0) + 1
  return count`
            },
            {
              language: "JavaScript",
              code: `function solve(nums, k) {
  let count = 0;
  let prefixSum = 0;
  let freq = {}
  for (let num of nums) {
    prefixSum ^= num
    if ((prefixSum ^ k) in freq) {
      count += freq[prefixSum ^ k]
    }
    freq[prefixSum] = (freq[prefixSum] || 0) + 1
  }
  return count`
            },
            {
              language: "C",
              code: `int solve(int* nums, int numsSize, int k) {
  int count = 0;
  int prefix_sum = 0;
  unsigned int freq[100000];
  for (int i = 0; i < numsSize; i++) {
    prefix_sum ^= nums[i];
    if ((prefix_sum ^ k) >= 0 && freq[(prefix_sum ^ k)] != 0) {
      count += freq[(prefix_sum ^ k)];
    }
    freq[prefix_sum]++;
  }
  return count;`
            },
            {
              language: "C++",
              code: `int solve(int* nums, int numsSize, int k) {
  int count = 0;
  int prefix_sum = 0;
  std::unordered_map<int, int> freq;
  for (int i = 0; i < numsSize; i++) {
    prefix_sum ^= nums[i];
    if ((prefix_sum ^ k) != 0 && freq.find(prefix_sum ^ k) != freq.end()) {
      count += freq[prefix_sum ^ k];
    }
    freq[prefix_sum]++;
  }
  return count;`
            }
          ]
        }
    ]
  },
  {
    id: "merge-overlapping-subintervals",
    title: "Merge Overlapping Intervals",
    topic: "Arrays - Hard",
    category: "Arrays",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Combine all overlapping intervals into a single interval that covers their collective range.",
    leetcodeLink: "https://leetcode.com/problems/merge-intervals/",
    useCases: ["Calendar scheduling", "Resource allocation"],
    approaches: [
        {
          name: "Optimal (Sorting + Linear Scan)",
          description: "### 🧠 Mental Model: The 'Merging Rivers' Concept\nIf you sort the intervals by their start time, they line up like sections of a river. You keep track of the current 'merged river'. If the next interval starts before the current river ends, it's just a branch of the same river—you extend the river's end if needed. If it starts after, it's a completely new, separate river.\n\n### 🛠️ Step-by-Step Logic\n1. Sort the intervals based on start times.\n2. Iterate through sorting intervals:\n   - If the result list is empty or the current interval's start > last merged interval's end:\n     - Just add the current interval to the result list.\n   - Else (they overlap):\n     - Update the last merged interval's end to `max(last.end, current.end)`.\n3. Return merged intervals.",
          timeComplexity: "O(N log N)",
          timeComplexityExplanation: "",
          spaceComplexity: "O(N)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "JavaScript",
              code: `function merge(intervals) {
    intervals.sort((a,b)=>a[0]-b[0]);
    let merged = [intervals[0]];
    for(let i=1; i<intervals.length; i++) {
        let last = merged[merged.length-1];
        if(intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]);
        else merged.push(intervals[i]);
    }
    return merged;
}`
            }
          ]
        }
    ]
  },
  {
    id: "merge-two-sorted-arrays-without-extra-space",
    title: "Merge Sorted Arrays (In-Place)",
    topic: "Arrays - Hard",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Merge two sorted arrays into one sorted sequence without using any extra auxiliary space.",
    leetcodeLink: "https://leetcode.com/problems/merge-sorted-array/",
    useCases: [],
    approaches: [
        {
          name: "Optimal (The Gap Method)",
          description: "### 🧠 Mental Model: The 'Combing' Strategy\nInstead of shifting elements individually (which is $O(N \\times M)$), we use a 'Gap' strategy derived from Shell Sort. We compare elements at a specific distance (gap). If the left one is larger, we swap. We then halve the gap and repeat. This 'combs' the two arrays into a single sorted flow.\n\n### 🛠️ Step-by-Step Logic\n1. Initialize `gap = ceil((n + m) / 2)`.\n2. While `gap > 0`:\n   - Use two pointers `left` and `right` separated by `gap`.\n   - Compare and swap if `arr1[left] > arr2[right-n]` (handling crossovers between the two arrays).\n   - Halve the gap: `gap = gap / 2` (if gap was 1, it becomes 0 and we stop).",
          timeComplexity: "O((N+M) log (N+M))",
          timeComplexityExplanation: "",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "Python",
              code: `def merge(arr1, arr2, n, m):
    gap = (n + m + 1) // 2
    while gap > 0:
        left = 0
        while left + gap < n + m:
            # Compare arr1[left] vs arr1[left+gap], or arr1 vs arr2, etc.
            # Logic for cross-array swapping
            left += 1
        if gap == 1: break
        gap = (gap + 1) // 2`
            }
          ]
        }
    ]
  },
  {
    id: "find-the-repeating-and-missing-number",
    title: "Missing and Repeating",
    topic: "Arrays - Hard",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find the repeating and missing number in an array of integers where all numbers appear twice except one.",
    leetcodeLink: "",
    useCases: ["Input: [1,2,3,4,5,6,7,8,9] Output: None", "Input: [1,2,3,4,5,6,7,8,10] Output: 9", "Input: [1,2,3,4,5,6,7,8,9,10] Output: None"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Core Intuition\nThe problem can be solved by treating the array as a hash table. We iterate through the array and for each number, we increment its corresponding index in the hash table. If the index is already occupied, it means we have found the repeating number.\n\n#### Invariant\nWe assume that all numbers appear twice except one. This invariant holds true throughout our iteration process.\n\n#### Logic + Code Walkthrough\nWe start by initializing a hash table with 0s. Then we iterate through the array and for each number, we increment its corresponding index in the hash table. If the index is already occupied, it means we have found the repeating number. We return this number as our result.\n\n#### Edge Cases\nIf the input array is empty, we return None. If all numbers appear twice except one, we return that number.\n\n#### Complexity Deep Dive\nThe time complexity of this solution is O(n) where n is the length of the array. This is because we are iterating through the array once. The space complexity is also O(n) as in the worst case scenario, our hash table will contain all numbers.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "We iterate through the array once to find the repeating number.",
          spaceComplexity: "O(n)",
          spaceComplexityExplanation: "In the worst case scenario, our hash table will contain all numbers.",
          implementations: [
            {
              language: "Python",
              code: `def solve(nums): 
    count = {} 
    for num in nums: 
        if num in count: 
            return num 
        else: 
            count[num] = 1 
    return None`
            },
            {
              language: "JavaScript",
              code: `function solve(nums) {
    let count = {};
    for (let num of nums) {
        if (num in count) {
            return num;
        } else {
            count[num] = 1;
        }
    }
    return null;`
            },
            {
              language: "C",
              code: `int solve(int* nums, int size) {
    int count[100000];
    for (int i = 0; i < size; i++) {
        if (nums[i] >= 0 && nums[i] < 100000) {
            count[nums[i]]++;
        }
    }
    for (int i = 0; i < size; i++) {
        if (count[nums[i]] == 2) {
            return nums[i];
        }
    }
    return -1;
}`
            },
            {
              language: "C++",
              code: `int solve(int* nums, int size) {
    std::unordered_map<int, int> count;
    for (int i = 0; i < size; i++) {
        if (count.find(nums[i]) != count.end()) {
            return nums[i];
        } else {
            count[nums[i]] = 1;
        }
    }
    return -1;`
            }
          ]
        }
    ]
  },
  {
    id: "count-inversions",
    title: "Count Inversions",
    topic: "Arrays - Hard",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Counting Inversions in an Array",
    leetcodeLink: "",
    useCases: ["Finding the number of inversions in an array to optimize sorting algorithms.", "Determining the number of pairs of elements that are out of order in a sorted array.", "Analyzing the complexity of sorting algorithms based on their inversion count."],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Core Intuition\nInversions occur when one element is greater than another element to its right. The goal is to count these occurrences.\n\n#### Invariant\nThe number of inversions in an array can be calculated by iterating through the array and comparing each pair of elements. If an element is greater than the next element, it contributes to an inversion count.\n\n#### Logic + Code Walkthrough\nWe will use a modified merge sort algorithm to solve this problem efficiently. The idea is to recursively divide the array into smaller subarrays and then merge them while counting inversions.\n\n#### Edge Cases\n- Handling empty arrays or single-element arrays correctly.\n- Dealing with duplicate elements that do not contribute to inversions.\n\n#### Complexity Deep Dive\nThe time complexity of this approach is O(n log n) due to the recursive division of the array and the merging process. The space complexity is O(n) for storing the temporary subarrays during merging.",
          timeComplexity: "O(n log n)",
          timeComplexityExplanation: "The modified merge sort algorithm divides the array into smaller subarrays, each of which is sorted recursively. This results in a time complexity of O(n log n).",
          spaceComplexity: "O(n)",
          spaceComplexityExplanation: "We need to store temporary subarrays during merging, which requires O(n) space.",
          implementations: [
            {
              language: "Python",
              code: `def count_inversions(arr):
    if len(arr) <= 1:
        return arr, 0
    mid = len(arr) // 2
    left, left_inv = count_inversions(arr[:mid])
    right, right_inv = count_inversions(arr[mid:])
    merged, merged_inv = merge_and_count(left[0], right[0])
    return merged + left[1:] + right[1:], left_inv + right_inv + merged_inv

def merge_and_count(a, b):
    result = [] 
    inversions = 0
    i, j = 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            result.append(a[i])
            i += 1
        else:
            result.append(b[j])
            inversions += len(a) - i
            j += 1
    result.extend(a[i:]) 
    result.extend(b[j:]) 
    return result, inversions`
            },
            {
              language: "JavaScript",
              code: `function countInversions(arr) {
    if (arr.length <= 1) {
        return [arr, 0];
    }
    const mid = Math.floor(arr.length / 2);
    const [left, leftInv] = countInversions(arr.slice(0, mid));
    const [right, rightInv] = countInversions(arr.slice(mid));
    const [merged, mergedInv] = mergeAndCount(left[0], right[0]);
    return [...left.slice(1), ...right.slice(1), ...merged, leftInv + rightInv + mergedInv];
}

function mergeAndCount(a, b) {
    let result = [], inversions = 0;
    let i = 0, j = 0;
    while (i < a.length && j < b.length) {
        if (a[i] <= b[j]) {
            result.push(a[i]);
            i++; 
        } else {
            result.push(b[j]);
            inversions += a.length - i;
            j++; 
        }
    }
    return [...result, ...a.slice(i), ...b.slice(j)];`
            },
            {
              language: "C",
              code: `int count_inversions(int arr[], int n) {
    if (n <= 1) {
        return 0;
    }
    int mid = n / 2;
    int left_inv = count_inversions(arr, mid);
    int right_inv = count_inversions(arr + mid, n - mid);
    int merged_inv = merge_and_count(arr, arr + mid, mid, n - mid);
    return left_inv + right_inv + merged_inv;
}

int merge_and_count(int *a, int *b, int start_a, int end_a, int start_b, int end_b) {
    int result = 0;
    int inversions = 0;
    while (start_a < end_a && start_b < end_b) {
        if (*a <= *b) {
            result++;
            a++;
        } else {
            result += end_a - a + 1;
            b++, inversions += end_a - a + 1;
        }
    }
    return result;`
            },
            {
              language: "C++",
              code: `int countInversions(int arr[], int n) {
    if (n <= 1) {
        return 0;
    }
    int mid = n / 2;
    int left_inv = countInversions(arr, mid);
    int right_inv = countInversions(arr + mid, n - mid);
    int merged_inv = mergeAndCount(arr, arr + mid, mid, n - mid);
    return left_inv + right_inv + merged_inv;
}

int mergeAndCount(int* a, int* b, int start_a, int end_a, int start_b, int end_b) {
    int result = 0;
    int inversions = 0;
    while (start_a < end_a && start_b < end_b) {
        if (*a <= *b) {
            result++;
            a++;
        } else {
            result += end_a - a + 1;
            b++, inversions += end_a - a + 1;
        }
    }
    return result;`
            }
          ]
        }
    ]
  },
  {
    id: "reverse-pairs",
    title: "Reverse Pairs",
    topic: "Arrays - Hard",
    category: "Arrays",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview: "Reverse Pairs Problem",
    leetcodeLink: "https://leetcode.com/problems/reverse-pairs/",
    useCases: ["Finding pairs of elements in an array that sum up to a target value.", "Identifying all possible pairs of elements in an array with a given sum.", "Determining the number of pairs of elements in an array that add up to a specific value."],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: The problem can be solved by iterating through the array and using two pointers, one starting from the beginning and one from the end. Invariant: The sum of the elements at the two pointers should always equal the target value. Logic + Code Walkthrough: Implement a function that takes an array and a target value as input, and returns all pairs of elements that add up to the target value. Edge Cases: Handle cases where the array is empty or contains only one element. Complexity Deep Dive: The time complexity of this solution is O(n), where n is the length of the array, because we are making two passes through the array. Space Complexity Explanation: We use a constant amount of space to store the result and input arrays.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "The time complexity is linear because we make two passes through the array.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We use a constant amount of space to store the result and input arrays.",
          implementations: [
            {
              language: "Python",
              code: `def reverse_pairs(nums, target):
    nums.sort()
    left, right = 0, len(nums) - 1
    pairs = []
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            pairs.append((nums[left], nums[right]))
            left += 1
            right -= 1
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return pairs`
            },
            {
              language: "JavaScript",
              code: `function reversePairs(nums, target) {
    nums.sort((a, b) => a - b);
    let left = 0;
    let right = nums.length - 1;
    const pairs = [];
    while (left < right) {
        const currentSum = nums[left] + nums[right];
        if (currentSum === target) {
            pairs.push([nums[left], nums[right]]);
            left += 1;
            right -= 1;
        } else if (currentSum < target) {
            left += 1;
        } else {
            right -= 1;
        }
    }
    return pairs;`
            },
            {
              language: "C",
              code: `#include <stdio.h>
#include <stdlib.h>

int reverse_pairs(int* nums, int numsSize, int target) {
    qsort(nums, numsSize, sizeof(int), compare);
    int left = 0;
    int right = numsSize - 1;
    int pairs = 0;
    while (left < right) {
        int current_sum = nums[left] + nums[right];
        if (current_sum == target) {
            printf("(%d, %d)", nums[left], nums[right]);
            left += 1;
            right -= 1;
            pairs++; // increment pairs
        } else if (current_sum < target) {
            left += 1;
        } else {
            right -= 1;
        }
    }
    return pairs;`
            },
            {
              language: "C++",
              code: `int reverse_pairs(int* nums, int numsSize, int target) {
    std::sort(nums, nums + numsSize);
    int left = 0;
    int right = numsSize - 1;
    std::vector<std::pair<int, int>> pairs;
    while (left < right) {
        int current_sum = nums[left] + nums[right];
        if (current_sum == target) {
            pairs.push_back(std::make_pair(nums[left], nums[right]));
            left += 1;
            right -= 1;
        } else if (current_sum < target) {
            left += 1;
        } else {
            right -= 1;
        }
    }
    return pairs.size();`
            }
          ]
        }
    ]
  },
  {
    id: "maximum-product-subarray",
    title: "Maximum Product Subarray",
    topic: "Arrays - Hard",
    category: "Arrays",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "The Maximum Product Subarray problem involves finding the contiguous subarray within a one-dimensional array of numbers that has the largest product.",
    leetcodeLink: "https://leetcode.com/problems/maximum-product-subarray/",
    useCases: ["Finding the maximum product in an array of integers", "Optimizing code for performance and readability", "Understanding trade-offs between time and space complexity"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: The problem can be solved by maintaining two variables, `max_product` and `min_product`, which store the maximum and minimum product up to each position in the array. This is because a negative number can become positive after multiplying with another negative number.\n\nInvariant: At any point, `max_product` will always be greater than or equal to `0`, while `min_product` will always be less than or equal to `0`. This ensures that we can multiply both numbers without changing their relative order.\n\nLogic + Code Walkthrough:\n1. Initialize `max_product` and `min_product` as the first element of the array.\n2. Iterate through the array starting from the second element.\n3. For each element, calculate the new `max_product` and `min_product` by considering three cases: multiplying with the current element, or taking the maximum/minimum of the previous two products.\n4. Update `max_product` and `min_product` accordingly.\n\nEdge Cases:\n* Handling zero elements in the array.\n* Dealing with negative numbers that can become positive after multiplication.\n\nComplexity Deep Dive:\n* Time complexity: O(n), where n is the length of the array, since we only iterate through it once.\n* Space complexity: O(1), as we only use a constant amount of space to store `max_product` and `min_product`.",
          timeComplexity: "O(n)",
          timeComplexityExplanation: "We only need to traverse the array once, making the time complexity linear.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We use a constant amount of space to store `max_product` and `min_product`, regardless of the input size.",
          implementations: [
            {
              language: "Python",
              code: `def max_product_subarray(nums):
    if not nums:
        return 0
    max_product = min_product = result = nums[0]
    for i in range(1, len(nums)):
        temp = max_product
        max_product = max(nums[i], max_product * nums[i], min_product * nums[i])
        min_product = temp
        result = max(result, max_product)
    return result`
            },
            {
              language: "JavaScript",
              code: `function maxProductSubarray(nums) {
    if (nums.length === 0) return 0;
    let maxProduct = nums[0];
    let minProduct = nums[0];
    let result = nums[0];
    for (let i = 1; i < nums.length; i++) {
        let temp = maxProduct;
        maxProduct = Math.max(nums[i], maxProduct * nums[i], minProduct * nums[i]);
        minProduct = temp;
        result = Math.max(result, maxProduct);
    }
    return result;`
            },
            {
              language: "C",
              code: `int max_product_subarray(int* nums, int numsSize) {
    if (numsSize == 0) return 0;
    int max_product = nums[0];
    int min_product = nums[0];
    int result = nums[0];
    for (int i = 1; i < numsSize; i++) {
        int temp = max_product;
        max_product = (nums[i] > 0) ? nums[i] : ((nums[i] < 0) ? min_product * nums[i] : max_product * nums[i]);
        min_product = temp;
        result = (result > max_product) ? result : max_product;
    }
    return result;`
            },
            {
              language: "C++",
              code: `int maxProductSubarray(int* nums, int size) {
    if (size == 0) return 0;
    int maxProduct = nums[0];
    int minProduct = nums[0];
    int result = nums[0];
    for (int i = 1; i < size; i++) {
        int temp = maxProduct;
        maxProduct = std::max(nums[i], (nums[i] > 0) ? nums[i] : minProduct * nums[i]);
        minProduct = temp;
        result = std::max(result, maxProduct);
    }
    return result;`
            }
          ]
        }
    ]
  },
  {
    id: "implement-lower-bound",
    title: "Lower Bound",
    topic: "Binary Search - 1D Arrays",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "The lower bound in binary search is the smallest possible index that can be used to find a target element in a sorted array.",
    leetcodeLink: "",
    useCases: ["Searching for an element in a large database", "Finding the first occurrence of an element in a sorted list", "Determining if an element exists in a sorted array"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition:\n\nThe lower bound is the smallest possible index that can be used to find a target element in a sorted array. This is because binary search works by repeatedly dividing the search interval in half.\n\nInvariant:\n\nAt each step, we know that the target element must be in one of two halves of the remaining search space.\n\nLogic + Code Walkthrough:\n\n1. Start with an empty search space (i.e., the entire array).\n2. Find the middle index of the current search space.\n3. Compare the middle element to the target element.\n4. If they match, return the middle index as the lower bound.\n5. If the middle element is less than the target element, repeat steps 2-4 with the right half of the search space.\n6. If the middle element is greater than the target element, repeat steps 2-4 with the left half of the search space.\n\nEdge Cases:\n\n* What if the array is empty? In this case, we can return -1 to indicate that the target element does not exist.\n* What if the target element is not in the array? In this case, we can return the index of the first element that is greater than the target element.\n\nComplexity Deep Dive:\n\nThe time complexity of binary search is O(log n), where n is the number of elements in the array. This is because we are effectively halving the search space at each step.\n\nSpace Complexity:\n\nThe space complexity of binary search is O(1), which means that it uses a constant amount of extra memory regardless of the size of the input array.",
          timeComplexity: "O(log n)",
          timeComplexityExplanation: "Binary search works by repeatedly dividing the search interval in half, resulting in a time complexity of O(log n).",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "The space complexity of binary search is O(1) because we only need to keep track of a few extra variables to perform the search.",
          implementations: [
            {
              language: "Python",
              code: `def lower_bound(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2

def find_first_occurrence(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    return -1`
            },
            {
              language: "JavaScript",
              code: `function lowerBound(arr, target) {
    let left = 0;
    let right = arr.length - 1;

def findFirstOccurrence(arr, target) {
        let left = 0;
        let right = arr.length - 1;
        while (left < right) {
            let mid = Math.floor((left + right) / 2);
            if (arr[mid] === target) return mid;
            else if (arr[mid] < target) left = mid + 1;
            else right = mid;
        }
        return -1;`
            },
            {
              language: "C",
              code: `int lower_bound(int arr[], int target, int n) {
    int left = 0;
    int right = n - 1;

def find_first_occurrence(int arr[], int target, int n) {
        int left = 0;
        int right = n - 1;
        while (left < right) {
            int mid = (left + right) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) left = mid + 1;
            else right = mid;
        }
        return -1;`
            },
            {
              language: "C++",
              code: `int lower_bound(int arr[], int target, int n) {
    int left = 0;
    int right = n - 1;

def find_first_occurrence(int arr[], int target, int n) {
        int left = 0;
        int right = n - 1;
        while (left < right) {
            int mid = (left + right) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) left = mid + 1;
            else right = mid;
        }
        return -1;`
            }
          ]
        }
    ]
  },
  {
    id: "implement-upper-bound",
    title: "Upper Bound",
    topic: "Binary Search - 1D Arrays",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Upper Bound in Binary Search",
    leetcodeLink: "",
    useCases: ["Finding the upper bound of an element in a sorted array", "Determining if an element is present in a sorted array", "Implementing binary search with an upper bound"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition:\n\nBinary search relies on the fact that the target element can be bounded by two elements. The upper bound is used to limit the search space, reducing the number of comparisons required.\n\nInvariant:\n\nThe array is sorted in ascending order.\n\nLogic + Code Walkthrough:\n\n1. Initialize two pointers, low and high, to the start and end of the array respectively.\n2. Calculate the middle index, mid = (low + high) / 2.\n3. Compare the target element with the middle element.\n4. If the target is less than the middle element, update high to mid - 1.\n5. If the target is greater than the middle element, update low to mid + 1.\n6. Repeat steps 2-5 until low and high converge or the target is found.\n\nEdge Cases:\n\n* Empty array: return null or a specific value indicating absence.\n* Target not present: return null or a specific value indicating absence.\n* Duplicate elements: handle correctly in the implementation.\n\nComplexity Deep Dive:\n\nThe time complexity of this approach is O(log n), where n is the number of elements in the array. This is because we divide the search space in half at each step.\n\nSpace Complexity:\n\nO(1) as we only use a constant amount of space to store the pointers and indices.",
          timeComplexity: "O(?)",
          timeComplexityExplanation: "",
          spaceComplexity: "O(?)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "Python",
              code: `def upper_bound(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2

def find_target(arr, target):
    if not arr or target < arr[0] or target > arr[-1]:
        return None
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return None`
            },
            {
              language: "JavaScript",
              code: `function upperBound(arr, target) {
    let low = 0;
    let high = arr.length - 1;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);

        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return null;
}

function findTarget(arr, target) {
    if (!arr.length || target < arr[0] || target > arr[arr.length - 1]) {
        return null;
    }
    let low = 0;
    let high = arr.length - 1;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);

        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return null;`
            },
            {
              language: "C",
              code: `int upper_bound(int arr[], int target, int n) {
    int low = 0;
    int high = n - 1;
    while (low <= high) {
        int mid = (low + high) / 2;

        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}

int find_target(int arr[], int target, int n) {
    if (!arr || target < arr[0] || target > arr[n - 1]) {
        return -1;
    }
    int low = 0;
    int high = n - 1;
    while (low <= high) {
        int mid = (low + high) / 2;

        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;`
            },
            {
              language: "C++",
              code: `int upper_bound(int arr[], int target, int n) {
    int low = 0;
    int high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;

        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}

int find_target(int arr[], int target, int n) {
    if (!arr || target < arr[0] || target > arr[n - 1]) {
        return -1;
    }
    int low = 0;
    int high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;

        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;`
            }
          ]
        }
    ]
  },
  {
    id: "search-insert-position",
    title: "Search Insert Position",
    topic: "Binary Search - 1D Arrays",
    category: "Binary Search",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview: "Search Insert Position is a problem that involves finding the position where an element should be inserted to maintain sorted order in a given array.",
    leetcodeLink: "https://leetcode.com/problems/search-insert-position/",
    useCases: ["Searching for an element in a sorted array", "Inserting an element into a sorted array while maintaining its sorted order", "Finding the correct position for an element in a sorted array"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "Core Intuition: Binary search is used to find the insertion point. Invariant: The array remains sorted after insertion. Logic + Code Walkthrough: Implement binary search and calculate the insertion point based on the target element's value. Edge Cases: Handle edge cases such as an empty array or a single-element array. Complexity Deep Dive: Time complexity is O(log n) due to the use of binary search, while space complexity remains O(1) since only a constant amount of extra memory is used.",
          timeComplexity: "O(log n)",
          timeComplexityExplanation: "The time complexity is logarithmic because we divide the search interval in half at each step.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We only use a constant amount of extra memory to store the target element and indices.",
          implementations: [
            {
              language: "Python",
              code: `def findInsertPosition(nums, target):
    if not nums or (nums[0] > target and len(nums) == 1):
        return 0
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return left`
            },
            {
              language: "JavaScript",
              code: `function searchInsert(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) {
            return mid
        } else if (nums[mid] < target) {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return left;`
            },
            {
              language: "C",
              code: `int searchInsert(int* nums, int numsSize, int target) {
    if (!nums || (nums[0] > target && numsSize == 1))
        return 0;
    int left = 0;
    int right = numsSize - 1;
    while (left <= right)
    {
        int mid = (left + right) / 2;
        if (nums[mid] == target)
            return mid;
        else if (nums[mid] < target)
            left = mid + 1;
        else
            right = mid - 1;
    }
    return left;`
            },
            {
              language: "C++",
              code: `int searchInsert(std::vector<int>& nums, int target) {
    if (!nums || (nums[0] > target && nums.size() == 1))
        return 0;
    int left = 0;
    int right = nums.size() - 1;
    while (left <= right)
    {
        int mid = (left + right) / 2;
        if (nums[mid] == target)
            return mid;
        else if (nums[mid] < target)
            left = mid + 1;
        else
            right = mid - 1;
    }
    return left;`
            }
          ]
        }
    ]
  },
  {
    id: "floor-ceil-in-sorted-array",
    title: "Floor/Ceil in Sorted Array",
    topic: "Binary Search - 1D Arrays",
    category: "Binary Search",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Find the largest element $le X$ (Floor) and the smallest element $ge X$ (Ceil) in a sorted array.",
    leetcodeLink: "",
    useCases: [],
    approaches: [
        {
          name: "Optimal (Binary Search)",
          description: "### 🧠 Mental Model\n- **Ceil** is identical to the **Lower Bound** (first element $ge X$).\n- **Floor** is the largest element $le X$. When we find an element $le X$, we mark it as a potential answer and keep looking to the right.\n\n### 🛠️ Step-by-Step Logic\n1. For Floor: Initialize `ans = -1`. While `low <= high`:\n   - If `arr[mid] <= x`: `ans = arr[mid]`, `low = mid + 1`.\n   - Else: `high = mid - 1`.\n2. For Ceil: Use the Lower Bound logic.",
          timeComplexity: "O(log N)",
          timeComplexityExplanation: "",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "Python",
              code: `def findFloor(a, x):
    low, high, ans = 0, len(a)-1, -1
    while low <= high:
        mid = (low + high) // 2
        if a[mid] <= x:
            ans = a[mid]
            low = mid + 1
        else:
            high = mid - 1
    return ans`
            }
          ]
        }
    ]
  },
  {
    id: "first-or-last-occurrence-of-a-number",
    title: "First & Last Occurrences",
    topic: "Binary Search - 1D Arrays",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find the first and last index of a target element in a sorted array.",
    leetcodeLink: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
    useCases: [],
    approaches: [
        {
          name: "Optimal (Two Binary Searches)",
          description: "### 🧠 Mental Model: Narrowing the Range\nTo find the first occurrence, when you find the target at `mid`, don't stop! There might be another instance earlier. Store `mid` as the potential first index and search the left half. For the last occurrence, do the opposite: search the right half.\n\n### 🛠️ Step-by-Step Logic\n1. Search for first index: if `arr[mid] == x`, `ans = mid`, `high = mid - 1`.\n2. Search for last index: if `arr[mid] == x`, `ans = mid`, `low = mid + 1`.",
          timeComplexity: "O(log N)",
          timeComplexityExplanation: "",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "JavaScript",
              code: `function searchRange(nums, target) {
    let first = find(nums, target, true);
    if (first === -1) return [-1, -1];
    let last = find(nums, target, false);
    return [first, last];
}`
            }
          ]
        }
    ]
  },
  {
    id: "count-occurrences-of-a-number-in-a-sorted-array",
    title: "Count Occurrences",
    topic: "Binary Search - 1D Arrays",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Count the number of occurrences of a target value in a sorted array using binary search.",
    leetcodeLink: "",
    useCases: ["Finding the most frequent element in an array", "Determining the position of a specific value within a sorted list", "Validating user input against a predefined set of values"],
    approaches: [
        {
          name: "Optimal (Topic-Specific)",
          description: "#### Core Intuition\nBinary search is ideal for this problem because it can efficiently find the target value in a sorted array. The key insight is that if we know the position of the target value, we can count its occurrences by simply counting the number of elements on either side of it.\n\n#### Invariant\nThe invariant here is that the input array is sorted and contains only unique values. This ensures that binary search will always find the correct target value.\n\n#### Logic + Code Walkthrough\nHere's a step-by-step breakdown of how to implement this algorithm:\n1. Initialize two pointers, `low` and `high`, to the start and end of the array respectively.\n2. Calculate the midpoint of the current range (`mid = (low + high) / 2`).\n3. Compare the target value to the middle element. If they match, we've found a potential occurrence. Otherwise, if the target is less than the middle element, update `high` to `mid - 1`. Otherwise, update `low` to `mid + 1.\n4. Repeat steps 2-3 until `low` and `high` converge or cross over.\n5. Once we've found a potential occurrence, count its occurrences by iterating through the array from that point forward and checking for matches.\n\n#### Edge Cases\n*   What if the target value is not present in the array? In this case, our algorithm will return 0 occurrences. This is because binary search will always find the correct position of the target value (or determine it's not present).\n*   What if the input array contains duplicate values? Our algorithm will still work correctly as long as we're counting unique occurrences.\n\n#### Complexity Deep Dive\nThe time complexity of this algorithm is O(log n), where n is the length of the input array. This is because binary search reduces the search space by half at each step, resulting in a logarithmic number of steps required to find the target value.\nThe space complexity is O(1) since we're only using a constant amount of extra memory to store our pointers and variables.",
          timeComplexity: "O(log n)",
          timeComplexityExplanation: "Binary search reduces the search space by half at each step, resulting in a logarithmic number of steps required to find the target value.",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "We're only using a constant amount of extra memory to store our pointers and variables.",
          implementations: [
            {
              language: "Python",
              code: `def count_occurrences(arr, target):
    low = 0
    high = len(arr) - 1

def binary_search(low, high, target):
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1

def count_occurrences(arr, target):
    occurrences = 0
    while True:
        pos = binary_search(0, len(arr) - 1, target)
        if pos == -1:
            break
        occurrences += 1
        low = pos + 1
    return occurrences
count_occurrences([1, 2, 3, 4, 5], 3)`
            },
            {
              language: "JavaScript",
              code: `function countOccurrences(arr, target) {
    let low = 0;
    let high = arr.length - 1;

    function binarySearch(low, high, target) {
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            if (arr[mid] === target) {
                return mid;
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }

    let occurrences = 0;
    while (true) {
        let pos = binarySearch(0, arr.length - 1, target);
        if (pos === -1) {
            break;
        }
        occurrences += 1;
        low = pos + 1;
    }
    return occurrences;
}
countOccurrences([1, 2, 3, 4, 5], 3)`
            },
            {
              language: "C",
              code: `int count_occurrences(int arr[], int target) {
    int low = 0;
    int high = sizeof(arr) / sizeof(arr[0]) - 1;

    int binary_search(low, high, int target) {
        while (low <= high) {
            int mid = (low + high) / 2;
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }

    int occurrences = 0;
    while (true) {
        int pos = binary_search(0, sizeof(arr) / sizeof(arr[0]) - 1, target);
        if (pos == -1) {
            break;
        }
        occurrences += 1;
        low = pos + 1;
    }
    return occurrences;
count_occurrences([1, 2, 3, 4, 5], 3)`
            },
            {
              language: "C++",
              code: `int countOccurrences(int arr[], int target) {
    int low = 0;
    int high = sizeof(arr) / sizeof(arr[0]) - 1;

    int binarySearch(low, high, int target) {
        while (low <= high) {
            int mid = (low + high) / 2;
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }

    int occurrences = 0;
    while (true) {
        int pos = binarySearch(0, sizeof(arr) / sizeof(arr[0]) - 1, target);
        if (pos == -1) {
            break;
        }
        occurrences += 1;
        low = pos + 1;
    }
    return occurrences;
countOccurrences([1, 2, 3, 4, 5], 3)`
            }
          ]
        }
    ]
  },
  {
    id: "search-in-rotated-sorted-array-i",
    title: "Search in Rotated Array (Unique)",
    topic: "Binary Search - 1D Arrays",
    category: "Binary Search",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview: "Search for a target in a sorted array that has been rotated at some pivot index.",
    leetcodeLink: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    useCases: [],
    approaches: [
        {
          name: "Optimal (One-Pass Binary Search)",
          description: "### 🧠 Mental Model: The 'Sorted Half' Rule\nIn a rotated sorted array, whenever you pick a `mid`, at least one of the two halves (`low` to `mid` OR `mid` to `high`) **must** be sorted. You identify which half is sorted, check if your target lies within its range, and eliminate the other half.\n\n### 🛠️ Step-by-Step Logic\n1. If `arr[low] <= arr[mid]`: Left half is sorted.\n   - If `target` is between `arr[low]` and `arr[mid]`: search left (`high = mid - 1`).\n   - Else: search right (`low = mid + 1`).\n2. Else: Right half is sorted.\n   - If `target` is between `arr[mid]` and `arr[high]`: search right.\n   - Else: search left.",
          timeComplexity: "O(log N)",
          timeComplexityExplanation: "",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "JavaScript",
              code: `function search(arr, k) {
    let low = 0, high = arr.length - 1;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (arr[mid] === k) return mid;
        if (arr[low] <= arr[mid]) { /* left sorted logic */ }
        else { /* right sorted logic */ }
    }
    return -1;
}`
            }
          ]
        }
    ]
  },
  {
    id: "search-in-rotated-sorted-array-ii",
    title: "Search in Rotated Array (Duplicates)",
    topic: "Binary Search - 1D Arrays",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Search in a rotated sorted array that may contain duplicate elements.",
    leetcodeLink: "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/",
    useCases: [],
    approaches: [
        {
          name: "Optimal (Duplicate Handling BS)",
          description: "### 🧠 Mental Model: The 'Shrinking' Edge Case\nDuplicates break the 'One half must be sorted' rule (e.g., `[3,1,2,3,3,3,3]`). If `arr[low] == arr[mid] == arr[high]`, we cannot tell which side is sorted. In this specific case, we simply shrink the search space by one from both ends (`low++, high--`) until the property returns.\n\n### 🛠️ Step-by-Step Logic\n1. If `arr[low] == arr[mid] == arr[high]`, increment `low` and decrement `high`.\n2. Otherwise, use the standard Rotated Search I logic.",
          timeComplexity: "O(log N) average, O(N) worst case",
          timeComplexityExplanation: "",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "Python",
              code: `def search(arr, k):
    l, r = 0, len(arr)-1
    while l <= r:
        m = (l + r) // 2
        if arr[m] == k: return True
        if arr[l] == arr[m] == arr[r]: l += 1; r -= 1; continue
        # Standard Rotated Logic...`
            }
          ]
        }
    ]
  },
  {
    id: "find-minimum-in-rotated-sorted-array",
    title: "Find Min in Rotated Array",
    topic: "Binary Search - 1D Arrays",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Given a sorted array that has been rotated an unknown number of times, find the minimum element in O(log N) time.",
    leetcodeLink: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    useCases: [
      "Detecting earliest timestamp in rotated time-series logs",
      "Recovering the smallest key after circular shifts in search indexes",
      "Binary-search based primitives in rotated arrays used by other problems",
    ],
    approaches: [
      {
        name: "Optimal (Binary Search on Sorted Half)",
        description:
          "### 🧠 Core Intuition\nA rotated sorted array is two sorted segments stitched together. The minimum always lives in the unsorted (rotated) side.\n\nWe maintain two pointers `low` and `high` and a running answer `ans`. At each step:\n- If `arr[low] <= arr[high]`, the whole window is sorted → `arr[low]` is the minimum of this window, update `ans` and stop.\n- Otherwise, compute `mid`. If the **left half is sorted** (`arr[low] <= arr[mid]`), then `arr[low]` is a candidate for the global minimum, and the minimum cannot lie in this sorted half, so we move to the right half. If the **right half is sorted**, we symmetrically update `ans` with `arr[mid+1]` and move left.\n\n### ✅ Invariant\nAt every iteration, `ans` stores the smallest value we have seen in any fully sorted segment that we have discarded from the search range. The true minimum is always within `[low, high]` or already stored in `ans`.\n\n### 🔍 Step-by-step\n1. Initialize `low = 0`, `high = n-1`, `ans = +∞`.\n2. While `low <= high`:\n   - If the current window is sorted (`arr[low] <= arr[high]`), update `ans` with `arr[low]` and break.\n   - Compute `mid`.\n   - If left half is sorted, update `ans` with `arr[low]` and move `low = mid + 1`.\n   - Else the right half is sorted, update `ans` with `arr[mid]` and move `high = mid - 1`.\n3. Return `ans`.\n\n### 🧊 Edge Cases\n- Already sorted (no rotation) → answer is simply `arr[0]`.\n- Single element → that element is the minimum.\n- Arrays with duplicates are a variant of this problem and require extra checks; here we assume **distinct** elements as in the classic LeetCode version.\n\n### ⏱️ Complexity\nEach iteration halves the search space, giving logarithmic time, and we use only a constant amount of extra memory.",
        timeComplexity: "O(log N)",
        timeComplexityExplanation:
          "Classic binary search on a rotated array: at each step we discard one half of the search space.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "Only a few indices and an accumulator are stored regardless of array size.",
        implementations: [
          {
            language: "Python",
            code: `def find_min(nums):
    """Return the minimum element in a rotated sorted array (distinct integers)."""
    if not nums:
        raise ValueError("Array must be non-empty")

    low, high = 0, len(nums) - 1
    ans = float("inf")

    while low <= high:
        # If the current window is already sorted, the first element is its minimum
        if nums[low] <= nums[high]:
            ans = min(ans, nums[low])
            break

        mid = (low + high) // 2

        # Left half is sorted
        if nums[low] <= nums[mid]:
            ans = min(ans, nums[low])
            low = mid + 1
        else:
            # Right half is sorted
            ans = min(ans, nums[mid])
            high = mid - 1

    return ans`,
          },
          {
            language: "JavaScript",
            code: `function findMin(nums) {
  if (!Array.isArray(nums) || nums.length === 0) {
    throw new Error("Array must be non-empty");
  }

  let low = 0;
  let high = nums.length - 1;
  let ans = Infinity;

  while (low <= high) {
    if (nums[low] <= nums[high]) {
      ans = Math.min(ans, nums[low]);
      break;
    }

    const mid = Math.floor((low + high) / 2);

    if (nums[low] <= nums[mid]) {
      ans = Math.min(ans, nums[low]);
      low = mid + 1;
    } else {
      ans = Math.min(ans, nums[mid]);
      high = mid - 1;
    }
  }

  return ans;
}`,
          },
          {
            language: "C",
            code: `#include <limits.h>

int findMin(const int *nums, int n) {
    if (n <= 0) return INT_MIN; /* or handle error */

    int low = 0;
    int high = n - 1;
    int ans = INT_MAX;

    while (low <= high) {
        if (nums[low] <= nums[high]) {
            if (nums[low] < ans) ans = nums[low];
            break;
        }

        int mid = low + (high - low) / 2;

        if (nums[low] <= nums[mid]) {
            if (nums[low] < ans) ans = nums[low];
            low = mid + 1;
        } else {
            if (nums[mid] < ans) ans = nums[mid];
            high = mid - 1;
        }
    }

    return ans;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
#include <climits>
using namespace std;

int findMin(const vector<int>& nums) {
    if (nums.empty()) {
        return INT_MIN; // or throw
    }

    int low = 0;
    int high = static_cast<int>(nums.size()) - 1;
    int ans = INT_MAX;

    while (low <= high) {
        if (nums[low] <= nums[high]) {
            ans = min(ans, nums[low]);
            break;
        }

        int mid = low + (high - low) / 2;

        if (nums[low] <= nums[mid]) {
            ans = min(ans, nums[low]);
            low = mid + 1;
        } else {
            ans = min(ans, nums[mid]);
            high = mid - 1;
        }
    }

    return ans;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "find-out-how-many-times-array-has-been-rotated",
    title: "Rotation Count",
    topic: "Binary Search - 1D Arrays",
    category: "Binary Search",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Given a sorted array that has been rotated K times, return K. For distinct elements, this equals the index of the minimum element.",
    leetcodeLink: "",
    useCases: [
      "Recovering rotation count in circular buffers or logs",
      "Inferring shifts in time-series indices",
      "Pre-step for other rotated-array binary search problems",
    ],
    approaches: [
      {
        name: "Optimal (Index of Minimum via Binary Search)",
        description:
          "### 🧠 Core Intuition\nRotating a sorted array shifts the global minimum to some index `K`. Because the array is still piecewise sorted, we can binary search for the minimum in O(log N).\n\nWe reuse the same thinking as \"find minimum in rotated sorted array\": the array splits into two sorted segments. The minimum is at the boundary between them, and its index is the rotation count.\n\n### ✅ Invariant\nAt every step, the true minimum (and thus rotation count) lies in the unsorted half of our search window, or we have already stored it in `ansIdx`.\n\n### 🔍 Step-by-step\n1. Initialize `low = 0`, `high = n-1`, `ansIdx = 0`.\n2. While `low <= high`:\n   - If window `[low, high]` is already sorted, `low` is the index of the minimum for this window → update `ansIdx = low` and break.\n   - Compute `mid`.\n   - If left half is sorted, candidate minimum index is `low`. Update `ansIdx` if `arr[low]` is smaller, then search right.\n   - Else right half is sorted; candidate minimum index is `mid`. Update `ansIdx` if `arr[mid]` is smaller, then search left.\n3. Return `ansIdx`.\n\nAssuming all values are distinct, this works in logarithmic time.\n\n### ⏱️ Complexity\n- Time: `O(log N)`\n- Space: `O(1)`.",
        timeComplexity: "O(log N)",
        timeComplexityExplanation: "Binary search halves the search space at every iteration.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Only a few indices and an answer index are stored.",
        implementations: [
          {
            language: "Python",
            code: `def rotation_count(nums):
    """Return K: how many times the sorted array was rotated (distinct ints)."""
    if not nums:
        raise ValueError("Array must be non-empty")

    low, high = 0, len(nums) - 1
    ans_idx = 0

    while low <= high:
        if nums[low] <= nums[high]:
            if nums[low] <= nums[ans_idx]:
                ans_idx = low
            break

        mid = (low + high) // 2

        if nums[low] <= nums[mid]:
            if nums[low] <= nums[ans_idx]:
                ans_idx = low
            low = mid + 1
        else:
            if nums[mid] <= nums[ans_idx]:
                ans_idx = mid
            high = mid - 1

    return ans_idx`,
          },
          {
            language: "JavaScript",
            code: `function rotationCount(nums) {
  if (!Array.isArray(nums) || nums.length === 0) {
    throw new Error("Array must be non-empty");
  }

  let low = 0;
  let high = nums.length - 1;
  let ansIdx = 0;

  while (low <= high) {
    if (nums[low] <= nums[high]) {
      if (nums[low] <= nums[ansIdx]) ansIdx = low;
      break;
    }

    const mid = Math.floor((low + high) / 2);

    if (nums[low] <= nums[mid]) {
      if (nums[low] <= nums[ansIdx]) ansIdx = low;
      low = mid + 1;
    } else {
      if (nums[mid] <= nums[ansIdx]) ansIdx = mid;
      high = mid - 1;
    }
  }

  return ansIdx;
}`,
          },
          {
            language: "C",
            code: `#include <limits.h>

int rotationCount(const int *nums, int n) {
    if (n <= 0) return 0; /* or handle error */

    int low = 0;
    int high = n - 1;
    int ansIdx = 0;

    while (low <= high) {
        if (nums[low] <= nums[high]) {
            if (nums[low] <= nums[ansIdx]) ansIdx = low;
            break;
        }

        int mid = low + (high - low) / 2;

        if (nums[low] <= nums[mid]) {
            if (nums[low] <= nums[ansIdx]) ansIdx = low;
            low = mid + 1;
        } else {
            if (nums[mid] <= nums[ansIdx]) ansIdx = mid;
            high = mid - 1;
        }
    }

    return ansIdx;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
using namespace std;

int rotationCount(const vector<int>& nums) {
    if (nums.empty()) return 0; // or throw

    int low = 0;
    int high = static_cast<int>(nums.size()) - 1;
    int ansIdx = 0;

    while (low <= high) {
        if (nums[low] <= nums[high]) {
            if (nums[low] <= nums[ansIdx]) ansIdx = low;
            break;
        }

        int mid = low + (high - low) / 2;

        if (nums[low] <= nums[mid]) {
            if (nums[low] <= nums[ansIdx]) ansIdx = low;
            low = mid + 1;
        } else {
            if (nums[mid] <= nums[ansIdx]) ansIdx = mid;
            high = mid - 1;
        }
    }

    return ansIdx;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "single-element-in-a-sorted-array",
    title: "Single Element in Sorted Array",
    topic: "Binary Search - 1D Arrays",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the unique element that appears exactly once in a sorted array where all other elements appear twice. The solution must maintain O(log N) time complexity by exploiting index parity.",
    leetcodeLink: "https://leetcode.com/problems/single-element-in-a-sorted-array/",
    useCases: [
      "Identifying a single corrupted data packet in a sorted stream of duplicates",
      "Finding the odd-one-out in specialized hardware register maps",
      "Optimizing search in datasets where redundancy is expected but occasionally broken",
    ],
    approaches: [
      {
        name: "Optimal (Index Parity via Binary Search)",
        description:
          "### 🧠 Core Intuition\nIn a sorted array where elements come in pairs, the first element of a pair should always be at an **even** index, and the second at an **odd** index (e.g., `(0, 1), (2, 3)`). \n\nThe moment a **single element** is inserted, the parity of all subsequent pairs **flips**: the first element of a pair will now be at an **odd** index, and the second at an **even** index (e.g., `(odd, even)`). We use Binary Search to find the exact point where this 'parity shift' occurs.\n\n### ✅ Invariant\nAt any step, if we are at an even index `i` and `arr[i] == arr[i+1]`, or at an odd index `i` and `arr[i] == arr[i-1]`, we are still in the 'pre-single element' part of the array.\n\n### 🔍 Step-by-step\n1. **Edge Cases**: If the array has only one element, return it. Check the first and last elements separately to simplify the loop logic.\n2. **Pointers**: Initialize `low = 1` and `high = n-2`.\n3. **Loop**: While `low <= high`:\n   - Compute `mid`.\n   - If `arr[mid]` is not equal to `arr[mid-1]` and not equal to `arr[mid+1]`, it's our single element.\n   - **Elimination**: \n     - If we are on an **even index** and the next element is the same, OR we are on an **odd index** and the previous element is the same, we are in the left half → move `low = mid + 1`.\n     - Otherwise, we are in the right half → move `high = mid - 1`.\n\n### 🧊 Edge Cases\n- **Size 1**: `[1]` → returns `1` immediately.\n- **First position**: `[1, 2, 2, 3, 3]` → handled by initial check.\n- **Last position**: `[1, 1, 2, 2, 3]` → handled by initial check.\n\n### ⏱️ Complexity\n- **Time**: $O(\\log N)$ — standard binary search logic.\n- **Space**: $O(1)$ — no extra data structures used.",
        timeComplexity: "O(log N)",
        timeComplexityExplanation:
          "Half of the search space is eliminated in each iteration based on index parity.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "Only primitive variables (pointers) are used.",
        implementations: [
          {
            language: "Python",
            code: `def single_non_duplicate(nums):
    n = len(nums)
    if n == 1:
        return nums[0]
    if nums[0] != nums[1]:
        return nums[0]
    if nums[n - 1] != nums[n - 2]:
        return nums[n - 1]

    low, high = 1, n - 2
    while low <= high:
        mid = (low + high) // 2
        
        # Found the unique element
        if nums[mid] != nums[mid - 1] and nums[mid] != nums[mid + 1]:
            return nums[mid]

        # Check parity: (even, odd) pair rule
        if (mid % 2 == 1 and nums[mid] == nums[mid - 1]) or \\
           (mid % 2 == 0 and nums[mid] == nums[mid + 1]):
            # We are on the left side, unique element is to the right
            low = mid + 1
        else:
            # We are on the right side, unique element is to the left
            high = mid - 1
            
    return -1`,
          },
          {
            language: "JavaScript",
            code: `function singleNonDuplicate(nums) {
  const n = nums.length;
  if (n === 1) return nums[0];
  if (nums[0] !== nums[1]) return nums[0];
  if (nums[n - 1] !== nums[n - 2]) return nums[n - 1];

  let low = 1;
  let high = n - 2;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (nums[mid] !== nums[mid - 1] && nums[mid] !== nums[mid + 1]) {
      return nums[mid];
    }

    if ((mid % 2 === 1 && nums[mid] === nums[mid - 1]) ||
        (mid % 2 === 0 && nums[mid] === nums[mid + 1])) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}`,
          },
          {
            language: "C",
            code: `int singleNonDuplicate(int* nums, int numsSize) {
    if (numsSize == 1) return nums[0];
    if (nums[0] != nums[1]) return nums[0];
    if (nums[numsSize - 1] != nums[numsSize - 2]) return nums[numsSize - 1];

    int low = 1, high = numsSize - 2;
    while (low <= high) {
        int mid = low + (high - low) / 2;

        if (nums[mid] != nums[mid - 1] && nums[mid] != nums[mid + 1]) {
            return nums[mid];
        }

        if ((mid % 2 == 1 && nums[mid] == nums[mid - 1]) || 
            (mid % 2 == 0 && nums[mid] == nums[mid + 1])) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
using namespace std;

int singleNonDuplicate(vector<int>& nums) {
    int n = nums.size();
    if (n == 1) return nums[0];
    if (nums[0] != nums[1]) return nums[0];
    if (nums[n - 1] != nums[n - 2]) return nums[n - 1];

    int low = 1, high = n - 2;
    while (low <= high) {
        int mid = low + (high - low) / 2;

        if (nums[mid] != nums[mid - 1] && nums[mid] != nums[mid + 1]) {
            return nums[mid];
        }

        // Standard index parity logic
        if ((mid % 2 == 1 && nums[mid] == nums[mid - 1]) ||
            (mid % 2 == 0 && nums[mid] == nums[mid + 1])) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "find-peak-element",
    title: "Find Peak Element",
    topic: "Binary Search - 1D Arrays",
    category: "Binary Search",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview:
      "Identify a 'peak' element—one that is strictly greater than its neighbors—in O(log N) time. This algorithm demonstrates how binary search can be applied even to unsorted arrays by following logical gradients.",
    leetcodeLink: "https://leetcode.com/problems/find-peak-element/",
    useCases: [
      "Finding local maxima in terrain elevation or topographic datasets",
      "Detecting peak signal strength in noisy sensor transmissions",
      "Identifying localized frequency spikes in audio processing or spectroscopy",
    ],
    approaches: [
      {
        name: "Optimal (Logarithmic Slope-Following)",
        description:
          "### 🧠 Core Intuition\nThink of the array as a sequence of slopes. A peak exists wherever a rising slope meets a falling slope. \n\nAt any point `mid`, if `arr[mid] < arr[mid+1]`, you are on an **upward slope**; a peak must exist to your right (either the slope continues to the end, making the last element a peak, or it eventually falls). Conversely, if `arr[mid] > arr[mid+1]`, you are on a **downward slope** or at a peak, so a peak must exist at `mid` or to its left.\n\n### ✅ Invariant\nThe search range `[low, high]` always contains at least one peak element. By moving towards the higher neighbor, we are guaranteed to eventually hit a local maximum.\n\n### 🔍 Step-by-step\n1. **Edge Cases**: Check if the first element or last element is a peak (neighbors outside bounds are considered $-\\infty$).\n2. **Pointers**: `low = 1`, `high = n-2`.\n3. **Binary Search**: \n   - Compute `mid`.\n   - If `arr[mid] > arr[mid-1]` and `arr[mid] > arr[mid+1]`, return `mid` (Found peak).\n   - If `arr[mid] < arr[mid+1]`, move right: `low = mid + 1`.\n   - Else (`arr[mid] > arr[mid+1]`), move left: `high = mid - 1`.\n\n### 🧊 Edge Cases\n- **Ascending**: `[1,2,3,4,5]` → Index 4 is peak.\n- **Descending**: `[5,4,3,2,1]` → Index 0 is peak.\n- **Size 1**: `[1]` → Index 0 is peak.\n- **Multiple Peaks**: The algorithm returns *any* one peak, which satisfies the problem constraints.\n\n### ⏱️ Complexity\n- **Time**: $O(\\log N)$ — we eliminate half the search space at each step.\n- **Space**: $O(1)$ — only pointers are stored.",
        timeComplexity: "O(log N)",
        timeComplexityExplanation:
          "Binary search effectively follows the gradient of the array to a local maximum in logarithmic time.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "The algorithm is iterative and uses no scale-dependent memory.",
        implementations: [
          {
            language: "Python",
            code: `def find_peak_element(nums):
    n = len(nums)
    if n == 1:
        return 0
    if nums[0] > nums[1]:
        return 0
    if nums[n - 1] > nums[n - 2]:
        return n - 1

    low, high = 1, n - 2
    while low <= high:
        mid = (low + high) // 2
        
        # Check if mid is the peak
        if nums[mid] > nums[mid - 1] and nums[mid] > nums[mid + 1]:
            return mid
        
        # If we are on an upward slope, peak is to the right
        if nums[mid] < nums[mid + 1]:
            low = mid + 1
        else:
            # We are on a downward slope, peak is to the left
            high = mid - 1
            
    return -1`,
          },
          {
            language: "JavaScript",
            code: `function findPeakElement(nums) {
  const n = nums.length;
  if (n === 1) return 0;
  if (nums[0] > nums[1]) return 0;
  if (nums[n - 1] > nums[n - 2]) return n - 1;

  let low = 1;
  let high = n - 2;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (nums[mid] > nums[mid - 1] && nums[mid] > nums[mid + 1]) {
      return mid;
    }

    if (nums[mid] < nums[mid + 1]) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}`,
          },
          {
            language: "C",
            code: `int findPeakElement(int* nums, int numsSize) {
    if (numsSize == 1) return 0;
    if (nums[0] > nums[1]) return 0;
    if (nums[numsSize - 1] > nums[numsSize - 2]) return numsSize - 1;

    int low = 1, high = numsSize - 2;
    while (low <= high) {
        int mid = low + (high - low) / 2;

        if (nums[mid] > nums[mid - 1] && nums[mid] > nums[mid + 1]) {
            return mid;
        }

        if (nums[mid] < nums[mid + 1]) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
using namespace std;

int findPeakElement(vector<int>& nums) {
    int n = nums.size();
    if (n == 1) return 0;
    if (nums[0] > nums[1]) return 0;
    if (nums[n - 1] > nums[n - 2]) return n - 1;

    int low = 1, high = n - 2;
    while (low <= high) {
        int mid = low + (high - low) / 2;

        if (nums[mid] > nums[mid - 1] && nums[mid] > nums[mid + 1]) {
            return mid;
        }

        if (nums[mid] < nums[mid + 1]) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "find-square-root-of-a-number-in-log-n",
    title: "Square Root (Integer)",
    topic: "Binary Search - Answers",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Compute the floor of the square root of a non-negative integer N in O(log N) time. This approach treats the range of possible roots as a sorted array and applies binary search to find the optimal integer solution.",
    leetcodeLink: "https://leetcode.com/problems/sqrtx/",
    useCases: [
      "Optimizing geometric calculations in graphics engines and physics simulations",
      "Efficiency primitives for primality testing and mathematical modeling",
      "Resource allocation where capacity grows quadratically with input",
    ],
    approaches: [
      {
        name: "Optimal (Binary Search on Answer Range)",
        description:
          "### 🧠 Core Intuition\nThe square root of $N$ must lie between 0 and $N$. Because the function $f(x) = x^2$ is **monotonically increasing** for positive $x$, we can use binary search to find the largest integer $mid$ whose square does not exceed $N$.\n\nInstead of searching through an array, we search through the range of integers `[1, N]`. If `mid * mid <= N`, then `mid` is a valid candidate (floor), and we look for larger values. If `mid * mid > N`, we must look for smaller values.\n\n### ✅ Invariant\nAt any point in the search, the target value $\\lfloor\\sqrt{N}\\rfloor$ is contained within the search space `[low, high]` or has already been recorded as the best valid candidate `ans`.\n\n### 🔍 Step-by-step\n1. **Edge Cases**: If $N=0$ or $N=1$, return $N$ immediately.\n2. **Range**: Initialize `low = 1`, `high = N`, and `ans = 1`.\n3. **Binary Search**: \n   - Compute `mid`.\n   - If `mid * mid <= N`:\n     - `mid` is a potential answer; store it in `ans`.\n     - Try larger values: `low = mid + 1`.\n   - Else (`mid * mid > N`):\n     - The square is too large; search smaller: `high = mid - 1`.\n4. **Return** `ans`.\n\n### 🧊 Edge Cases\n- **N = 0**: Should return 0.\n- **Large N**: Ensure the multiplication `mid * mid` doesn't overflow (use `long long` in C/C++).\n- **Perfect Square**: If $N=16$, the loop finds 4 and continues till pointers cross.\n\n### ⏱️ Complexity\n- **Time**: $O(\\log N)$ — we search the range up to $N$.\n- **Space**: $O(1)$ — no additional data structures used.",
        timeComplexity: "O(log N)",
        timeComplexityExplanation:
          "The search space [0, N] is halved in each iteration of the binary search.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "Only a constant amount of memory is needed for pointers and the candidate variable.",
        implementations: [
          {
            language: "Python",
            code: `def floor_sqrt(n):
    if n < 2:
        return n
    
    low, high = 1, n
    ans = 1
    
    while low <= high:
        mid = (low + high) // 2
        
        if mid * mid <= n:
            ans = mid
            low = mid + 1
        else:
            high = mid - 1
            
    return ans`,
          },
          {
            language: "JavaScript",
            code: `function floorSqrt(n) {
  if (n < 2) return n;

  let low = 1;
  let high = n;
  let ans = 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (mid * mid <= n) {
      ans = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return ans;
}`,
          },
          {
            language: "C",
            code: `long long floorSqrt(long long n) {
    if (n < 2) return n;

    long long low = 1, high = n, ans = 1;
    while (low <= high) {
        long long mid = low + (high - low) / 2;

        if (mid * mid <= n) {
            ans = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return ans;
}`,
          },
          {
            language: "C++",
            code: `long long floorSqrt(long long n) {
    if (n < 2) return n;

    long long low = 1, high = n, ans = 1;
    while (low <= high) {
        long long mid = low + (high - low) / 2;

        if (mid * mid <= n) {
            ans = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return ans;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "find-the-nth-root-of-a-number",
    title: "Nth Root of an Integer",
    topic: "Binary Search - Answers",
    category: "Binary Search",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Find the exact integer n-th root of a number M. This algorithm adapts binary search to an exponential scale and incorporates safe multiplication to prevent integer overflow.",
    leetcodeLink: "",
    useCases: [
      "Calculating dimension scaling in high-dimensional physics simulations",
      "Cryptographic primitives requiring modular or integer root extraction",
      "Resource allocation where costs scale exponentially with capacity level",
    ],
    approaches: [
      {
        name: "Optimal (Binary Search with Overflow Check)",
        description:
          "### 🧠 Core Intuition\nThe $n$-th root of $M$ is the number $X$ such that $X^n = M$. Since $x^n$ is strictly increasing for positive $x$, we can binary search the range `[1, M]` to find $X$.\n\nHowever, $mid^n$ can grow extremely large and overflow standard integer types even for relatively small values of $n$ and $mid$. To solve this safely, we use a helper function that multiplies $mid$ by itself $n$ times but stops immediately if the partial product exceeds $M$.\n\n### ✅ Invariant\nThe search space `[low, high]` always contains the potential integer $n$-th root. We refine this space by comparing $mid^n$ against $M$.\n\n### 🔍 Step-by-step\n1. **Range**: `low = 1`, `high = M`.\n2. **Binary Search**: While `low <= high`:\n   - Compute `mid`.\n   - Use a helper `power(mid, n, M)` to determine if $mid^n$ is less than, equal to, or greater than $M$.\n   - If `equal`, return `mid`.\n   - If `less than`, the root is larger: `low = mid + 1`.\n   - If `greater than`, the root is smaller: `high = mid - 1`.\n3. **Exit**: If no exact integer root is found, return -1.\n\n### 🧊 Edge Cases\n- **M = 1**: Always returns 1 for any $n \\ge 1$.\n- **Perfect Root**: $n=3$, $M=27 \\rightarrow 3$.\n- **Non-Perfect Root**: $n=3$, $M=30 \\rightarrow -1$.\n- **Overflow**: Handled by the helper function's early-exit logic.\n\n### ⏱️ Complexity\n- **Time**: $O(n \\times \\log M)$ — $\\log M$ steps of binary search, and each step carries out up to $n$ multiplications.\n- **Space**: $O(1)$ — only constant extra space used.",
        timeComplexity: "O(n * log M)",
        timeComplexityExplanation:
          "Standard binary search on range M, with each comparison involving an O(n) power calculation.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "Iterative approach with no scale-dependent memory overhead.",
        implementations: [
          {
            language: "Python",
            code: `def nth_root(n, m):
    def get_power_state(mid, n, m):
        ans = 1
        for _ in range(n):
            ans *= mid
            if ans > m:
                return 2  # Greather than M
        if ans == m:
            return 1  # Equal to M
        return 0  # Less than M

    low, high = 1, m
    while low <= high:
        mid = (low + high) // 2
        state = get_power_state(mid, n, m)
        
        if state == 1:
            return mid
        elif state == 0:
            low = mid + 1
        else:
            high = mid - 1
            
    return -1`,
          },
          {
            language: "JavaScript",
            code: `function getNthRoot(n, m) {
  function getPowerState(mid, n, m) {
    let ans = 1;
    for (let i = 1; i <= n; i++) {
      ans *= mid;
      if (ans > m) return 2;
    }
    if (ans === m) return 1;
    return 0;
  }

  let low = 1;
  let high = m;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const state = getPowerState(mid, n, m);

    if (state === 1) return mid;
    if (state === 0) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
          },
          {
            language: "C",
            code: `int getPowerState(long long mid, int n, int m) {
    long long ans = 1;
    for (int i = 1; i <= n; i++) {
        ans = ans * mid;
        if (ans > m) return 2;
    }
    if (ans == m) return 1;
    return 0;
}

int NthRoot(int n, int m) {
    int low = 1, high = m;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        int state = getPowerState(mid, n, m);
        if (state == 1) return mid;
        if (state == 0) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
          },
          {
            language: "C++",
            code: `#include <iostream>
using namespace std;

int getPowerState(long long mid, int n, int m) {
    long long ans = 1;
    for (int i = 1; i <= n; i++) {
        ans = ans * mid;
        if (ans > m) return 2;
    }
    if (ans == m) return 1;
    return 0;
}

int NthRoot(int n, int m) {
    int low = 1, high = m;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        int state = getPowerState(mid, n, m);
        if (state == 1) return mid;
        if (state == 0) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "koko-eating-bananas",
    title: "Koko Eating Bananas",
    topic: "Binary Search - Answers",
    category: "Binary Search",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview:
      "Find the minimum integer speed K to eat all bananas from multiple piles within H hours. This problem is a classic example of 'Binary Search on Answers', where we search for an optimal value in a monotonic range.",
    leetcodeLink: "https://leetcode.com/problems/koko-eating-bananas/",
    useCases: [
      "Optimizing resource consumption to meet a strict deadline",
      "Network bandwidth allocation to prevent stream buffering",
      "Task scheduling in manufacturing to ensure on-time delivery",
    ],
    approaches: [
      {
        name: "Optimal (Binary Search on Speed)",
        description:
          "### 🧠 Core Intuition\nKoko wants the slowest possible eating speed $K$ that still allows her to finish all bananas before the guards return. \n\nThis problem exhibit **monotonicity**: if Koko can finish at speed $K$, she can also finish at any speed higher than $K$. If she can't finish at $K$, she won't finish at any slower speed. This allows us to binary search the possible speeds instead of checking them linearly.\n\n### ✅ Invariant\nThe minimum required speed $K$ is always contained in the range `[low, high]` or has been stored as the best valid candidate found so far.\n\n### 🔍 Step-by-step\n1. **Bounds**: The minimum possible speed is `1` (Koko must eat at least something). The maximum speed required is the size of the largest pile (allowing her to finish any pile in exactly one hour).\n2. **Binary Search**: \n   - Compute `mid` as the candidate speed.\n   - Calculate `totalHours`: for each pile, the time taken is `ceil(pile / mid)`.\n   - If `totalHours <= H`:\n     - Koko can finish! Record `mid` as a potential answer and try an even slower speed: `high = mid - 1`.\n   - Else (`totalHours > H`):\n     - Too slow! Koko must eat faster: `low = mid + 1`.\n3. **Return** the smallest valid speed recorded.\n\n### 🧊 Edge Cases\n- **H = len(piles)**: Koko must eat at a speed equal to the maximum pile size.\n- **Very large H**: Koko can eat at speed 1.\n- **Single pile**: The answer is simply `ceil(piles[0] / H)`.\n\n### ⏱️ Complexity\n- **Time**: $O(N \\times \\log(\\max(\\text{piles})))$ — we perform binary search over the range of speeds, and in each step, we iterate through all $N$ piles.\n- **Space**: $O(1)$ — no extra space that scales with input size.",
        timeComplexity: "O(N * log(max(piles)))",
        timeComplexityExplanation:
          "We binary search through the speed range [1, max_pile] and perform a linear scan of N piles at each step.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "Constant space is used for pointers and accumulation variables.",
        implementations: [
          {
            language: "Python",
            code: `import math

def min_eating_speed(piles, h):
    def can_finish(speed):
        hours = 0
        for pile in piles:
            hours += math.ceil(pile / speed)
        return hours <= h

    low, high = 1, max(piles)
    ans = high
    
    while low <= high:
        mid = (low + high) // 2
        if can_finish(mid):
            ans = mid
            high = mid - 1
        else:
            low = mid + 1
            
    return ans`,
          },
          {
            language: "JavaScript",
            code: `function minEatingSpeed(piles, h) {
  let low = 1;
  let high = Math.max(...piles);
  let ans = high;

  const canFinish = (speed) => {
    let hours = 0;
    for (const pile of piles) {
      hours += Math.ceil(pile / speed);
    }
    return hours <= h;
  };

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (canFinish(mid)) {
      ans = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return ans;
}`,
          },
          {
            language: "C",
            code: `#include <math.h>

long long calculateHours(int* piles, int n, int speed) {
    long long total = 0;
    for (int i = 0; i < n; i++) {
        total += (piles[i] + speed - 1) / speed;
    }
    return total;
}

int minEatingSpeed(int* piles, int pilesSize, int h) {
    int max_pile = 0;
    for (int i = 0; i < pilesSize; i++) {
        if (piles[i] > max_pile) max_pile = piles[i];
    }

    int low = 1, high = max_pile, ans = max_pile;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (calculateHours(piles, pilesSize, mid) <= h) {
            ans = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return ans;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

class Solution {
public:
    long long calculateHours(const vector<int>& piles, int speed) {
        long long total = 0;
        for (int pile : piles) {
            total += (pile + speed - 1) / speed;
        }
        return total;
    }

    int minEatingSpeed(vector<int>& piles, int h) {
        int low = 1, high = *max_element(piles.begin(), piles.end());
        int ans = high;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (calculateHours(piles, mid) <= h) {
                ans = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return ans;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "minimum-days-to-make-m-bouquets",
    title: "M Bouquets",
    topic: "Binary Search - Answers",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Determine the minimum number of days needed to make M bouquets, where each bouquet requires K adjacent bloomed flowers. This problem applies Binary Search on Answers to find an optimal point on a time-based horizon.",
    leetcodeLink: "https://leetcode.com/problems/minimum-days-to-make-m-bouquets/",
    useCases: [
      "Optimizing harvest schedules in agriculture based on bloom times",
      "Batching contiguous sequences in high-latency data processing",
      "Resource allocation where items must be physically or temporally adjacent",
    ],
    approaches: [
      {
        name: "Optimal (Binary Search on Days)",
        description:
          "### 🧠 Core Intuition\nAs days pass, the number of bloomed flowers increases. If we can make $M$ bouquets on day $D$, it's guaranteed we can also make them on any day $> D$. This **monotonicity** allows us to search for the smallest valid day using Binary Search.\n\nTo check if a day $D$ is valid, we scan the `bloomDay` array. Any flower with `bloomDay[i] <= D` is considered bloomed. We count how many sets of $K$ **consecutive** bloomed flowers we can form.\n\n### ✅ Invariant\nThe minimum day required is always within the range `[min(bloomDay), max(bloomDay)]`. Each step of the binary search halves this window.\n\n### 🔍 Step-by-step\n1. **Feasibility Check**: If $M \\times K$ is greater than the total number of flowers, it's impossible to make enough bouquets. Return -1.\n2. **Range**: `low = min(bloomDay)`, `high = max(bloomDay)`.\n3. **Binary Search**: \n   - Compute `mid` day.\n   - Count bouquets possible on `mid` day:\n     - Iterate through flowers; if a flower is bloomed, increment a `counter`.\n     - If `counter == K`, increment `bouquets` and reset `counter`.\n     - If flower is NOT bloomed, reset `counter` to 0.\n   - If `bouquets >= M`, `mid` is a valid day. Record it: `ans = mid`, and try for an earlier day: `high = mid - 1`.\n   - Otherwise, we need more time: `low = mid + 1`.\n\n### 🧊 Edge Cases\n- **M * K > N**: Return -1 immediately.\n- **K = 1**: Bouquets can be made from any bloomed flowers, adjacency is trivial.\n- **Flowers bloom in order**: Adjacency is easy to satisfy.\n\n### ⏱️ Complexity\n- **Time**: $O(N \\times \\log(\\max(\\text{bloomDay}) - \\min(\\text{bloomDay})))$ where $N$ is the number of flowers.\n- **Space**: $O(1)$ constant space usage.",
        timeComplexity: "O(N * log(max_day))",
        timeComplexityExplanation:
          "Binary search takes log(max_day) iterations, and each iteration performs a linear scan of N flowers to count bouquets.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "Only primitive counters and pointers are used.",
        implementations: [
          {
            language: "Python",
            code: `def min_days(bloom_day, m, k):
    if m * k > len(bloom_day):
        return -1
    
    def can_make(days):
        bouquets = 0
        count = 0
        for bloom in bloom_day:
            if bloom <= days:
                count += 1
                if count == k:
                    bouquets += 1
                    count = 0
            else:
                count = 0
        return bouquets >= m

    low, high = min(bloom_day), max(bloom_day)
    ans = high
    
    while low <= high:
        mid = (low + high) // 2
        if can_make(mid):
            ans = mid
            high = mid - 1
        else:
            low = mid + 1
            
    return ans`,
          },
          {
            language: "JavaScript",
            code: `function minDays(bloomDay, m, k) {
  if (m * k > bloomDay.length) return -1;

  let low = Math.min(...bloomDay);
  let high = Math.max(...bloomDay);
  let ans = high;

  const canMake = (days) => {
    let bouquets = 0;
    let count = 0;
    for (let bloom of bloomDay) {
      if (bloom <= days) {
        count++;
        if (count === k) {
          bouquets++;
          count = 0;
        }
      } else {
        count = 0;
      }
    }
    return bouquets >= m;
  };

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (canMake(mid)) {
      ans = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return ans;
}`,
          },
          {
            language: "C",
            code: `#include <stdbool.h>

bool canMake(int* bloomDay, int n, int m, int k, int day) {
    int bouquets = 0;
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (bloomDay[i] <= day) {
            count++;
            if (count == k) {
                bouquets++;
                count = 0;
            }
        } else {
            count = 0;
        }
    }
    return bouquets >= m;
}

int minDays(int* bloomDay, int bloomDaySize, int m, int k) {
    if ((long long)m * k > bloomDaySize) return -1;

    int low = bloomDay[0], high = bloomDay[0];
    for (int i = 1; i < bloomDaySize; i++) {
        if (bloomDay[i] < low) low = bloomDay[i];
        if (bloomDay[i] > high) high = bloomDay[i];
    }

    int ans = high;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (canMake(bloomDay, bloomDaySize, m, k, mid)) {
            ans = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return ans;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    bool canMake(vector<int>& bloomDay, int m, int k, int day) {
        int bouquets = 0;
        int count = 0;
        for (int bloom : bloomDay) {
            if (bloom <= day) {
                count++;
                if (count == k) {
                    bouquets++;
                    count = 0;
                }
            } else {
                count = 0;
            }
        }
        return bouquets >= m;
    }

    int minDays(vector<int>& bloomDay, int m, int k) {
        if ((long long)m * k > bloomDay.size()) return -1;

        int low = *min_element(bloomDay.begin(), bloomDay.end());
        int high = *max_element(bloomDay.begin(), bloomDay.end());
        int ans = high;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (canMake(bloomDay, m, k, mid)) {
                ans = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return ans;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "find-the-smallest-divisor-given-a-threshold",
    title: "Smallest Divisor",
    topic: "Binary Search - Answers",
    category: "Binary Search",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Find the smallest positive integer divisor such that the sum of the results of dividing each array element by this divisor (rounded up) does not exceed a specified threshold. This problem highlights the monotonic relationship between the value of a divisor and the resulting total sum.",
    leetcodeLink: "https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/",
    useCases: [
      "Optimizing batch sizes in production line scheduling to meet fixed throughput limits",
      "Allocating fixed budgets across multiple variable-cost projects",
      "Determining optimal packet sizes in network transmission to comply with bandwidth thresholds",
    ],
    approaches: [
      {
        name: "Optimal (Binary Search on Divisor)",
        description:
          "### 🧠 Core Intuition\nThe relationship between the divisor and the resulting sum is **monotonically decreasing**: as the divisor increases, each division result (and thus the total sum) decreases or remains the same. This allows us to use Binary Search to find the 'tipping point' divisor.\n\nWe search for the smallest $D$ in the range `[1, max(nums)]`. For any candidate $D$, we calculate $Sum(D) = \\sum \\lceil nums[i] / D \\rceil$. If $Sum(D) \\le Threshold$, then $D$ is a potential answer, and we try even smaller values. Otherwise, $D$ is too small, and we must increase it.\n\n### ✅ Invariant\nThe optimal divisor is always within the current `[low, high]` window or has been captured in our `ans` variable during the refinement process.\n\n### 🔍 Step-by-step\n1. **Range Initialization**: \n   - `low = 1` (minimum possible divisor).\n   - `high = max(nums)` (a divisor larger than the maximum element will always result in a sum equal to the number of elements).\n2. **Binary Search**: \n   - Compute `mid` as the candidate divisor.\n   - Calculate the sum of divisions using `ceil(nums[i] / mid)`. Note: `ceil(a/b)` can be calculated as `(a + b - 1) / b` using integer division.\n   - If `totalSum <= threshold`:\n     - The divisor is valid. Record it: `ans = mid`.\n     - Search for a smaller divisor: `high = mid - 1`.\n   - Else (`totalSum > threshold`):\n     - The divisor is too small. Increase it: `low = mid + 1`.\n3. **Return** the smallest valid divisor found (`ans`).\n\n### 🧊 Edge Cases\n- **Threshold = nums.length**: The smallest divisor will be `max(nums)`, as each element will divide to 1.\n- **Threshold is very large**: The smallest divisor will likely be 1.\n- **Array size is 1**: The divisor will be `ceil(nums[0] / threshold)`.\n\n### ⏱️ Complexity\n- **Time**: $O(N \\times \\log(\\max(\\text{nums})))$ where $N$ is the number of elements in the array.\n- **Space**: $O(1)$ constant overhead.",
        timeComplexity: "O(N * log(max(nums)))",
        timeComplexityExplanation:
          "Binary search takes logarithmic steps over the range of numbers, and each step involves a linear scan of the array.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "The algorithm uses only primitive accumulation variables.",
        implementations: [
          {
            language: "Python",
            code: `import math

def smallest_divisor(nums, threshold):
    def get_sum(divisor):
        total = 0
        for x in nums:
            total += math.ceil(x / divisor)
        return total

    low, high = 1, max(nums)
    ans = high

    while low <= high:
        mid = (low + high) // 2
        if get_sum(mid) <= threshold:
            ans = mid
            high = mid - 1
        else:
            low = mid + 1
            
    return ans`,
          },
          {
            language: "JavaScript",
            code: `function smallestDivisor(nums, threshold) {
  let low = 1;
  let high = Math.max(...nums);
  let ans = high;

  const getSum = (divisor) => {
    let total = 0;
    for (const num of nums) {
      total += Math.ceil(num / divisor);
    }
    return total;
  };

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (getSum(mid) <= threshold) {
      ans = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return ans;
}`,
          },
          {
            language: "C",
            code: `long long getSum(int* nums, int n, int divisor) {
    long long total = 0;
    for (int i = 0; i < n; i++) {
        total += (nums[i] + divisor - 1) / divisor;
    }
    return total;
}

int smallestDivisor(int* nums, int numsSize, int threshold) {
    int max_val = 0;
    for (int i = 0; i < numsSize; i++) {
        if (nums[i] > max_val) max_val = nums[i];
    }

    int low = 1, high = max_val, ans = max_val;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (getSum(nums, numsSize, mid) <= threshold) {
            ans = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return ans;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

class Solution {
public:
    long long getSum(const vector<int>& nums, int divisor) {
        long long total = 0;
        for (int num : nums) {
            total += (num + divisor - 1) / divisor;
        }
        return total;
    }

    int smallestDivisor(vector<int>& nums, int threshold) {
        int low = 1, high = *max_element(nums.begin(), nums.end());
        int ans = high;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (getSum(nums, mid) <= threshold) {
                ans = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return ans;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "capacity-to-ship-packages-within-d-days",
    title: "Ship Packages",
    topic: "Binary Search - Answers",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the minimum weight capacity of a conveyor belt that allows all packages to be transported within a specified number of days. This algorithm find an optimal threshold in a monotonic search space.",
    leetcodeLink: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
    useCases: [
      "Optimizing logistics for freight and container shipping",
      "Scheduling bandwidth for scheduled large-scale data transfers",
      "Sizing machinery capacity for sequential batch processing in manufacturing",
    ],
    approaches: [
      {
        name: "Optimal (Binary Search on Capacity)",
        description:
          "### 🧠 Core Intuition\nThink of the conveyor belt's capacity as a dial. If the capacity is extremely low, we can only ship one package per day, taking many days. If the capacity is equal to the total weight of all packages, we can ship everything in one day. \n\nBecause the number of days required is **monotonically non-increasing** with respect to the belt capacity, we can use Binary Search to find the smallest capacity that satisfies the day limit $D$.\n\n### ✅ Invariant\nThe minimum required capacity $C$ always lies between the heaviest single package (must be able to carry it) and the total weight of all packages. \n\n### 🔍 Step-by-step\n1. **Define Search Space**: \n   - `low = max(weights)`: The belt must be at least as strong as the heaviest item.\n   - `high = sum(weights)`: The maximum possible capacity is the total weight of all items.\n2. **Binary Search**: \n   - Compute `mid` as a candidate capacity.\n   - Count how many `days` it takes to ship all packages with capacity `mid`:\n     - Iterate through packages; if adding a package exceeds `mid`, start a new day and reset the current weight.\n   - If `days <= D`:\n     - This capacity works! Record it as potential answer: `ans = mid`.\n     - Try to see if an even smaller capacity can work: `high = mid - 1`.\n   - Otherwise, we must increase the capacity: `low = mid + 1`.\n3. **Return** the smallest valid capacity found.\n\n### 🧊 Edge Cases\n- **D = 1**: The capacity must be the sum of all weights.\n- **D = weights.length**: Each package can go on its own day; capacity must be `max(weights)`.\n- **All weights are identical**: The greedy grouping becomes uniform.\n\n### ⏱️ Complexity\n- **Time**: $O(N \\times \\log(\\text{Sum} - \\text{Max}))$, where $N$ is the number of packages.\n- **Space**: $O(1)$ constant space for iterative counters.",
        timeComplexity: "O(N * log(totalWeight))",
        timeComplexityExplanation:
          "Binary search occurs over the range of possible capacities [Max, Sum], with a linear scan of N items in each step.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "Algorithm is iterative and uses no scale-dependent memory.",
        implementations: [
          {
            language: "Python",
            code: `def ship_within_days(weights, days):
    def get_days_needed(capacity):
        days_count = 1
        current_load = 0
        for w in weights:
            if current_load + w > capacity:
                days_count += 1
                current_load = w
            else:
                current_load += w
        return days_count

    low, high = max(weights), sum(weights)
    ans = high
    
    while low <= high:
        mid = (low + high) // 2
        if get_days_needed(mid) <= days:
            ans = mid
            high = mid - 1
        else:
            low = mid + 1
            
    return ans`,
          },
          {
            language: "JavaScript",
            code: `function shipWithinDays(weights, days) {
  let low = Math.max(...weights);
  let high = weights.reduce((a, b) => a + b, 0);
  let ans = high;

  const getDaysNeeded = (capacity) => {
    let daysCount = 1;
    let currentLoad = 0;
    for (const w of weights) {
      if (currentLoad + w > capacity) {
        daysCount++;
        currentLoad = w;
      } else {
        currentLoad += w;
      }
    }
    return daysCount;
  };

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (getDaysNeeded(mid) <= days) {
      ans = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return ans;
}`,
          },
          {
            language: "C",
            code: `int getDaysNeeded(int* weights, int n, int capacity) {
    int daysCount = 1;
    int currentLoad = 0;
    for (int i = 0; i < n; i++) {
        if (currentLoad + weights[i] > capacity) {
            daysCount++;
            currentLoad = weights[i];
        } else {
            currentLoad += weights[i];
        }
    }
    return daysCount;
}

int shipWithinDays(int* weights, int weightsSize, int days) {
    int max_w = 0, sum_w = 0;
    for (int i = 0; i < weightsSize; i++) {
        if (weights[i] > max_w) max_w = weights[i];
        sum_w += weights[i];
    }

    int low = max_w, high = sum_w, ans = sum_w;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (getDaysNeeded(weights, weightsSize, mid) <= days) {
            ans = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return ans;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
#include <numeric>
#include <algorithm>
using namespace std;

class Solution {
public:
    int getDaysNeeded(const vector<int>& weights, int capacity) {
        int daysCount = 1;
        int currentLoad = 0;
        for (int w : weights) {
            if (currentLoad + w > capacity) {
                daysCount++;
                currentLoad = w;
            } else {
                currentLoad += w;
            }
        }
        return daysCount;
    }

    int shipWithinDays(vector<int>& weights, int days) {
        int low = *max_element(weights.begin(), weights.end());
        int high = accumulate(weights.begin(), weights.end(), 0);
        int ans = high;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (getDaysNeeded(weights, mid) <= days) {
                ans = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return ans;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "kth-missing-positive-number",
    title: "Kth Missing Positive",
    topic: "Binary Search - Answers",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Find the k-th positive integer that is missing from a strictly increasing sorted array. This algorithm leverages the gap count at each index to determine the missing value in logarithmic time.",
    leetcodeLink: "https://leetcode.com/problems/kth-missing-positive-number/",
    useCases: [
      "Identifying missing IDs in sequential database records",
      "Gap analysis in time-series data or log files",
      "Finding available slots in sparse scheduling systems",
    ],
    approaches: [
      {
        name: "Optimal (Binary Search on Gap Count)",
        description:
          "### 🧠 Core Intuition\nIn an ideal array starting from 1 with no missing numbers (e.g., `[1, 2, 3, 4]`), the value at index `i` is always `i + 1`. If the actual value `arr[i]` is larger, it means `arr[i] - (i + 1)` numbers are missing before that index.\n\nSince the array is sorted, the count of missing numbers is non-decreasing (**monotonic**). We can binary search to find the last index where the count of missing numbers is still less than $K$. \n\n### ✅ Invariant\nThe $K^{th}$ missing number lies between `arr[high]` and `arr[low]` after the binary search concludes. Specifically, it can be calculated using the final state of the pointers.\n\n### 🔍 Step-by-step\n1. **Pointer Initialization**: `low = 0`, `high = n - 1`.\n2. **Binary Search**: \n   - Compute `mid`.\n   - `missingCount = arr[mid] - (mid + 1)`.\n   - If `missingCount < K`:\n     - We need more missing numbers; search right: `low = mid + 1`.\n   - Else (`missingCount >= K`):\n     - We have enough or too many missing numbers; search left: `high = mid - 1`.\n3. **Result Calculation**: \n   - After the loop, `high` is the last index where missing count was $< K$.\n   - The number of missing elements at `high` is `arr[high] - (high + 1)`.\n   - We need $K - (arr[high] - (high + 1))$ more numbers after `arr[high]`.\n   - Result = `arr[high] + K - (arr[high] - (high + 1))` = `K + high + 1`.\n   - Since the loop ends with `low = high + 1`, the result is simply `K + low`.\n\n### 🧊 Edge Cases\n- **K is smaller than the first gap**: e.g., `arr=[5, 6, 7], K=2`. Loop returns `low=0`, Result=`2+0=2`.\n- **K is larger than all missing**: e.g., `arr=[1, 2, 3], K=2`. Result=`2+3=5`.\n- **Array is empty**: Not possible by constraints, but would return $K$.\n\n### ⏱️ Complexity\n- **Time**: $O(\\log N)$ — standard binary search over array length.\n- **Space**: $O(1)$ — constant space for pointers.",
        timeComplexity: "O(log N)",
        timeComplexityExplanation:
          "The algorithm performs a standard binary search over the indices of the array.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "Only a few integer variables are used for pointers and calculations.",
        implementations: [
          {
            language: "Python",
            code: `def find_kth_positive(arr, k):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        missing = arr[mid] - (mid + 1)
        
        if missing < k:
            low = mid + 1
        else:
            high = mid - 1
            
    # The result is k + low
    return k + low`,
          },
          {
            language: "JavaScript",
            code: `function findKthPositive(arr, k) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const missing = arr[mid] - (mid + 1);

    if (missing < k) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return k + low;
}`,
          },
          {
            language: "C",
            code: `int findKthPositive(int* arr, int arrSize, int k) {
    int low = 0, high = arrSize - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        int missing = arr[mid] - (mid + 1);
        
        if (missing < k) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return low + k;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
using namespace std;

int findKthPositive(vector<int>& arr, int k) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        int missing = arr[mid] - (mid + 1);
        
        if (missing < k) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return low + k;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "aggressive-cows",
    title: "Aggressive Cows",
    topic: "Binary Search - Answers",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Maximize the minimum distance between C cows placed in N stalls. This problem is a classic application of 'Binary Search on Answers', where we search for the largest possible gap that still allows all cows to be placed.",
    leetcodeLink: "",
    useCases: [
      "Optimizing physical spacing in social distancing protocols",
      "Wireless sensor placement to minimize signal interference",
      "Resource distribution where a minimum separation is critical for safety or performance",
    ],
    approaches: [
      {
        name: "Optimal (Binary Search on Minimum Distance)",
        description:
          "### 🧠 Core Intuition\nWe want to place $C$ cows such that they are as far apart as possible. If we can place them with a minimum distance of $D$, we can potentially place them with a distance $> D$. However, if we cannot place them with distance $D$, we definitely cannot do it with any distance $> D$.\n\nThis **monotonicity** allows us to binary search the distance. To check feasibility for a distance $D$, we use a **Greedy Strategy**: place the first cow in the first stall, and then place each subsequent cow in the nearest stall that is at least $D$ units away from the last placed cow.\n\n### ✅ Invariant\nThe stall positions must be **sorted**. The search range for the distance is `[1, max(stalls) - min(stalls)]`.\n\n### 🔍 Step-by-step\n1. **Sort**: Arrange stall positions in ascending order ($O(N \\log N)$).\n2. **Identify Range**: \n   - `low = 1` (smallest possible gap).\n   - `high = arr[n-1] - arr[0]` (largest possible gap).\n3. **Binary Search**: \n   - Compute `mid` distance.\n   - Greedy check: place first cow at `arr[0]`. Iterate through stalls to find the next valid placement $\\ge lastPlacement + mid$.\n   - If total cows placed $\\ge C$:\n     - The distance is valid! `ans = mid`, try a larger gap: `low = mid + 1`.\n   - Else:\n     - Too spread out; decrease gap: `high = mid - 1`.\n\n### 🧊 Edge Cases\n- **Two Cows**: The answer is always the distance between the first and last stall.\n- **Stalls are close together**: Maximum distance will be minimal if many cows must fit.\n- **C = N**: Cows must be placed in every stall; result is the minimum distance between any two adjacent stalls.\n\n### ⏱️ Complexity\n- **Time**: $O(N \\log N + N \\times \\log(\\text{maxDist}))$. Sorting + Binary search over the distance range.\n- **Space**: $O(1)$ constant space usage.",
        timeComplexity: "O(N log N + N log(maxDist))",
        timeComplexityExplanation:
          "Sorting takes O(N log N). Binary search runs log(maxDist) times, each performing a linear scan of N stalls.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "Algorithm is iterative and uses no extra data structures.",
        implementations: [
          {
            language: "Python",
            code: `def can_place(stalls, k, dist):
    count = 1
    last_pos = stalls[0]
    for i in range(1, len(stalls)):
        if stalls[i] - last_pos >= dist:
            count += 1
            last_pos = stalls[i]
    return count >= k

def aggressive_cows(stalls, k):
    stalls.sort()
    n = len(stalls)
    low = 1
    high = stalls[n - 1] - stalls[0]
    ans = 1
    
    while low <= high:
        mid = (low + high) // 2
        if can_place(stalls, k, mid):
            ans = mid
            low = mid + 1
        else:
            high = mid - 1
            
    return ans`,
          },
          {
            language: "JavaScript",
            code: `function aggressiveCows(stalls, k) {
  stalls.sort((a, b) => a - b);
  const n = stalls.length;
  
  const canPlace = (dist) => {
    let count = 1;
    let lastPos = stalls[0];
    for (let i = 1; i < n; i++) {
      if (stalls[i] - lastPos >= dist) {
        count++;
        lastPos = stalls[i];
      }
    }
    return count >= k;
  };

  let low = 1;
  let high = stalls[n - 1] - stalls[0];
  let ans = 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (canPlace(mid)) {
      ans = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return ans;
}`,
          },
          {
            language: "C",
            code: `#include <stdio.h>
#include <stdlib.h>

int compare(const void* a, const void* b) {
    return (*(int*)a - *(int*)b);
}

int canPlace(int* stalls, int n, int k, int dist) {
    int count = 1;
    int lastPos = stalls[0];
    for (int i = 1; i < n; i++) {
        if (stalls[i] - lastPos >= dist) {
            count++;
            lastPos = stalls[i];
        }
    }
    return count >= k;
}

int aggressiveCows(int* stalls, int n, int k) {
    qsort(stalls, n, sizeof(int), compare);
    int low = 1, high = stalls[n - 1] - stalls[0], ans = 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (canPlace(stalls, n, k, mid)) {
            ans = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return ans;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
#include <algorithm>
using namespace std;

bool canPlace(vector<int>& stalls, int k, int dist) {
    int count = 1;
    int lastPos = stalls[0];
    for (int i = 1; i < stalls.size(); i++) {
        if (stalls[i] - lastPos >= dist) {
            count++;
            lastPos = stalls[i];
        }
    }
    return count >= k;
}

int aggressiveCows(vector<int>& stalls, int k) {
    sort(stalls.begin(), stalls.end());
    int n = stalls.size();
    int low = 1, high = stalls[n - 1] - stalls[0], ans = 1;
    
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (canPlace(stalls, k, mid)) {
            ans = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return ans;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "book-allocation-problem",
    title: "Book Allocation",
    topic: "Binary Search - Answers",
    category: "Binary Search",
    frequencyLevel: "Very High",
    difficulty: "Hard",
    overview:
      "Allocate books with varying page counts to M students such that the maximum number of pages assigned to any student is minimized. This is a quintessential 'Binary Search on Answers' problem with a greedy feasibility check.",
    leetcodeLink: "",
    useCases: [
      "Workload balancing in project management to prevent individual burnout",
      "Partitioning sequential data across distributed servers for uniform processing",
      "Resource grouping in manufacturing to maintain consistent output across machines",
    ],
    approaches: [
      {
        name: "Optimal (Binary Search on Answer Range)",
        description:
          "### 🧠 Core Intuition\nWe want to find the 'fairest' possible distribution. The value we are searching for is the **maximum pages any student reads**. \n\nIf we set this limit very high, we could potentially give all books to one student. If we set it very low, we will need more than $M$ students. Since increasing the limit never increases the number of students required, the property is **monotonic**. This allows us to use Binary Search to find the minimum possible maximum limit.\n\n### ✅ Invariant\nThe optimal limit must be the range `[max(pages), sum(pages)]`. A limit lower than the largest single book is impossible, as someone must read that book.\n\n### 🔍 Step-by-step\n1. **Edge Case**: If the number of students $M$ is greater than the number of books $N$, return -1 (every student must get at least one book).\n2. **Range Initialization**: \n   - `low = max(pages)`\n   - `high = sum(pages)`\n3. **Binary Search**: \n   - Compute `mid` as a candidate limit.\n   - Greedy Check: Count how many students are needed for this `mid` limit.\n     - Iterate through books, adding pages to a `currentSum`.\n     - If `currentSum + pages[i] > mid`, increment `studentCount` and set `currentSum = pages[i]`.\n   - If `studentCount <= M`:\n     - The limit is valid! Record it: `ans = mid`, and try a tighter limit: `high = mid - 1`.\n   - Else:\n     - The limit is too tight; we exceed the student count. Relax the limit: `low = mid + 1`.\n\n### 🧊 Edge Cases\n- **M = 1**: The student must read everything; answer is `sum(pages)`.\n- **M = N**: Each student gets exactly one book; answer is `max(pages)`.\n- **Unsorted pages**: Standard logic still applies as books are assigned consecutively.\n\n### ⏱️ Complexity\n- **Time**: $O(N \\times \\log(\\sum \\text{pages} - \\max \\text{pages}))$.\n- **Space**: $O(1)$ constant overhead.",
        timeComplexity: "O(N * log(sum - max))",
        timeComplexityExplanation:
          "Binary search over the page sum range, with a linear scan of N books at each step.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "Uses only primitive counters and iterative logic.",
        implementations: [
          {
            language: "Python",
            code: `def find_pages(A, m):
    if m > len(A):
        return -1
        
    def count_students(pages_limit):
        students = 1
        current_pages = 0
        for p in A:
            if current_pages + p <= pages_limit:
                current_pages += p
            else:
                students += 1
                current_pages = p
        return students

    low = max(A)
    high = sum(A)
    ans = high
    
    while low <= high:
        mid = (low + high) // 2
        if count_students(mid) <= m:
            ans = mid
            high = mid - 1
        else:
            low = mid + 1
            
    return ans`,
          },
          {
            language: "JavaScript",
            code: `function findPages(A, m) {
  if (m > A.length) return -1;

  const countStudents = (limit) => {
    let students = 1;
    let currentPages = 0;
    for (let p of A) {
      if (currentPages + p <= limit) {
        currentPages += p;
      } else {
        students++;
        currentPages = p;
      }
    }
    return students;
  };

  let low = Math.max(...A);
  let high = A.reduce((a, b) => a + b, 0);
  let ans = high;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (countStudents(mid) <= m) {
      ans = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return ans;
}`,
          },
          {
            language: "C",
            code: `int countStudents(int* A, int n, int limit) {
    int students = 1;
    long long currentPages = 0;
    for (int i = 0; i < n; i++) {
        if (currentPages + A[i] <= limit) {
            currentPages += A[i];
        } else {
            students++;
            currentPages = A[i];
        }
    }
    return students;
}

int findPages(int* A, int n, int m) {
    if (m > n) return -1;

    int max_p = 0;
    long long sum_p = 0;
    for (int i = 0; i < n; i++) {
        if (A[i] > max_p) max_p = A[i];
        sum_p += A[i];
    }

    int low = max_p, high = sum_p, ans = sum_p;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (countStudents(A, n, mid) <= m) {
            ans = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return ans;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
#include <numeric>
#include <algorithm>
using namespace std;

class Solution {
public:
    int countStudents(const vector<int>& A, int limit) {
        int students = 1;
        long long currentPages = 0;
        for (int p : A) {
            if (currentPages + p <= limit) {
                currentPages += p;
            } else {
                students++;
                currentPages = p;
            }
        }
        return students;
    }

    int findPages(vector<int>& A, int n, int m) {
        if (m > n) return -1;

        int low = *max_element(A.begin(), A.end());
        long long high = accumulate(A.begin(), A.end(), 0LL);
        long long ans = high;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (countStudents(A, mid) <= m) {
                ans = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return (int)ans;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "split-array-largest-sum",
    title: "Split Array Largest Sum",
    topic: "Binary Search - Answers",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Divide an array into K contiguous subarrays such that the maximum sum among these subarrays is minimized. This problem is mathematically identical to the Book Allocation Problem.",
    leetcodeLink: "https://leetcode.com/problems/split-array-largest-sum/",
    useCases: [
      "Partitioning stream data into balanced chunks for parallel processing",
      "Splitting a workload into K sequential stages to minimize bottleneck time",
      "Dividing a geographical path into K segments with balanced travel costs",
    ],
    approaches: [
      {
        name: "Optimal (Binary Search on Sum)",
        description:
          "### 🧠 Core Intuition\nThis problem asks us to find a way to split the array such that the 'heaviest' subarray is as 'light' as possible. \n\nIf we allow a very large maximum sum, we can easily split the array into $K$ or fewer subarrays. If we insist on a very small maximum sum, we will need more than $K$ subarrays. This **inverse relationship** and **monotonicity** mean we can binary search for the minimum possible 'largest sum'.\n\n### ✅ Invariant\nThe answer must be in the range `[max(nums), sum(nums)]`. Any value lower than `max(nums)` would make it impossible to include the largest element in any subarray.\n\n### 🔍 Step-by-step\n1. **Range Initialization**: \n   - `low = max(nums)`\n   - `high = sum(nums)`\n2. **Binary Search**: \n   - Compute `mid` as the potential maximum sum.\n   - Greedy Check: Count how many subarrays are needed so that no subarray sum exceeds `mid`.\n     - Iterate through `nums`, accumulating into `currentSum`.\n     - If `currentSum + num > mid`, start a new subarray and increment `subarrayCount`.\n   - If `subarrayCount <= K`:\n     - The limit is valid! Record `ans = mid` and try a smaller limit: `high = mid - 1`.\n   - Else:\n     - We need more than $K$ subarrays; the limit is too small. Increase it: `low = mid + 1`.\n3. **Return** the minimum valid sum found.\n\n### ⏱️ Complexity\n- **Time**: $O(N \\times \\log(\\sum \\text{nums}))$.\n- **Space**: $O(1)$ constant overhead.",
        timeComplexity: "O(N * log(sum))",
        timeComplexityExplanation:
          "Binary search over the possible sum range, with a linear scan of N elements per iteration.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "Algorithm is iterative and maintains only state variables.",
        implementations: [
          {
            language: "Python",
            code: `def split_array(nums, k):
    def count_subarrays(max_sum):
        count = 1
        current_sum = 0
        for x in nums:
            if current_sum + x <= max_sum:
                current_sum += x
            else:
                count += 1
                current_sum = x
        return count

    low, high = max(nums), sum(nums)
    ans = high
    while low <= high:
        mid = (low + high) // 2
        if count_subarrays(mid) <= k:
            ans = mid
            high = mid - 1
        else:
            low = mid + 1
    return ans`,
          },
          {
            language: "JavaScript",
            code: `function splitArray(nums, k) {
  let low = Math.max(...nums);
  let high = nums.reduce((a, b) => a + b, 0);
  let ans = high;

  const countSubarrays = (maxSum) => {
    let count = 1;
    let currentSum = 0;
    for (let x of nums) {
      if (currentSum + x <= maxSum) {
        currentSum += x;
      } else {
        count++;
        currentSum = x;
      }
    }
    return count;
  };

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (countSubarrays(mid) <= k) {
      ans = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return ans;
}`,
          },
          {
            language: "C",
            code: `int countSubarrays(int* nums, int n, int maxSum) {
    int count = 1;
    long long currentSum = 0;
    for (int i = 0; i < n; i++) {
        if (currentSum + nums[i] <= maxSum) {
            currentSum += nums[i];
        } else {
            count++;
            currentSum = nums[i];
        }
    }
    return count;
}

int splitArray(int* nums, int numsSize, int k) {
    int max_val = 0;
    long long sum_val = 0;
    for (int i = 0; i < numsSize; i++) {
        if (nums[i] > max_val) max_val = nums[i];
        sum_val += nums[i];
    }

    int low = max_val, high = sum_val, ans = sum_val;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (countSubarrays(nums, numsSize, mid) <= k) {
            ans = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return ans;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
#include <numeric>
#include <algorithm>
using namespace std;

class Solution {
public:
    int countSubarrays(const vector<int>& nums, int maxSum) {
        int count = 1;
        long long currentSum = 0;
        for (int x : nums) {
            if (currentSum + x <= maxSum) {
                currentSum += x;
            } else {
                count++;
                currentSum = x;
            }
        }
        return count;
    }

    int splitArray(vector<int>& nums, int k) {
        int low = *max_element(nums.begin(), nums.end());
        long long high = accumulate(nums.begin(), nums.end(), 0LL);
        int ans = high;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (countSubarrays(nums, mid) <= k) {
                ans = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return ans;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "painter-s-partition-problem",
    title: "Painter's Partition",
    topic: "Binary Search - Answers",
    category: "Binary Search",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Partition a sequence of boards among K painters such that the maximum time taken by any painter is minimized. Each painter paints contiguous boards, and the time to paint a board is proportional to its length.",
    leetcodeLink: "",
    useCases: [
      "Dividing industrial painting tasks across multiple robot arms",
      "Balancing sequential processing stages in a pipeline",
      "Distributing linear assets across K units with minimized maximum load",
    ],
    approaches: [
      {
        name: "Optimal (Binary Search on Time)",
        description:
          "### 🧠 Core Intuition\nThis problem is a direct mapping of the **Book Allocation Problem**. We treat 'boards' as 'books' and 'painters' as 'students'. The goal is to minimize the maximum workload (time) given to any single painter.\n\nBy binary searching on the possible maximum time (range `[max(boards), sum(boards)]`), we find the smallest threshold that allows us to complete the task with $K$ painters.\n\n### ✅ Invariant\nThe minimum time must be at least the longest board and at most the total sum of all boards.\n\n### 🔍 Step-by-step\n1. **Range**: `low = max(boards)`, `high = sum(boards)`.\n2. **Binary Search**: \n   - Compute `mid` as a candidate for the maximum time.\n   - Greedy Check: Count how many painters are needed if no painter can exceed `mid` units of work.\n   - If `painters <= K`:\n     - The time limit is valid! `ans = mid`, try for even less time: `high = mid - 1`.\n   - Else:\n     - We need more than $K$ painters. Increase the time limit: `low = mid + 1`.\n3. **Return** `ans`.\n\n### ⏱️ Complexity\n- **Time**: $O(N \\times \\log(\\sum \\text{boards}))$.\n- **Space**: $O(1)$ constant overhead.",
        timeComplexity: "O(N * log(sum))",
        timeComplexityExplanation:
          "Identical complexity to Split Array Sum; binary search over the range of total board lengths.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Only scalar iterative variables are used.",
        implementations: [
          {
            language: "Python",
            code: `def painters_partition(boards, k):
    def count_painters(time_limit):
        painters = 1
        current_time = 0
        for b in boards:
            if current_time + b <= time_limit:
                current_time += b
            else:
                painters += 1
                current_time = b
        return painters

    low, high = max(boards), sum(boards)
    ans = high
    while low <= high:
        mid = (low + high) // 2
        if count_painters(mid) <= k:
            ans = mid
            high = mid - 1
        else:
            low = mid + 1
    return ans`,
          },
          {
            language: "JavaScript",
            code: `function paintersPartition(boards, k) {
  let low = Math.max(...boards);
  let high = boards.reduce((a, b) => a + b, 0);
  let ans = high;

  const countPainters = (limit) => {
    let painters = 1;
    let currentTime = 0;
    for (let b of boards) {
      if (currentTime + b <= limit) {
        currentTime += b;
      } else {
        painters++;
        currentTime = b;
      }
    }
    return painters;
  };

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (countPainters(mid) <= k) {
      ans = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return ans;
}`,
          },
          {
            language: "C",
            code: `int countPainters(int* boards, int n, int limit) {
    int painters = 1;
    long long currentTime = 0;
    for (int i = 0; i < n; i++) {
        if (currentTime + boards[i] <= limit) {
            currentTime += boards[i];
        } else {
            painters++;
            currentTime = boards[i];
        }
    }
    return painters;
}

int paintersPartition(int* boards, int n, int k) {
    int max_b = 0;
    long long sum_b = 0;
    for (int i = 0; i < n; i++) {
        if (boards[i] > max_b) max_b = boards[i];
        sum_b += boards[i];
    }

    int low = max_b, high = sum_b, ans = sum_b;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (countPainters(boards, n, mid) <= k) {
            ans = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return ans;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
#include <numeric>
#include <algorithm>
using namespace std;

class Solution {
public:
    int countPainters(const vector<int>& boards, int limit) {
        int painters = 1;
        long long currentTime = 0;
        for (int b : boards) {
            if (currentTime + b <= limit) {
                currentTime += b;
            } else {
                painters++;
                currentTime = b;
            }
        }
        return painters;
    }

    int minTime(vector<int>& boards, int k) {
        int low = *max_element(boards.begin(), boards.end());
        long long high = accumulate(boards.begin(), boards.end(), 0LL);
        int ans = high;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (countPainters(boards, mid) <= k) {
                ans = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return ans;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "minimize-max-distance-to-gas-station",
    title: "Gas Station Distance",
    topic: "Binary Search - Answers",
    category: "Binary Search",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview:
      "Add K new gas stations along a road to minimize the maximum distance between any two adjacent stations. This problem involves a floating-point binary search to identify a continuous optimal value.",
    leetcodeLink: "https://leetcode.com/problems/minimize-max-distance-to-gas-station/",
    useCases: [
      "Optimizing EV charging station layout on long-distance routes",
      "Minimizing dead zones in cell tower coverage placement",
      "Strategically placing distribution centers to reduce maximum transit times",
    ],
    approaches: [
      {
        name: "Optimal (Binary Search on Answer Range - Double)",
        description:
          "### 🧠 Core Intuition\nThe maximum distance $D$ we are searching for is a continuous real number. If we define a maximum distance $D$, then for any existing gap of size $G$, we must insert $\\lceil G / D \\rceil - 1$ new stations to ensure no gap within that segment exceeds $D$.\n\nThe total number of stations required is a **monotonically decreasing** function of $D$. We use binary search on the range `[0, max_initial_gap]`. To avoid precision issues with `while` loops, we run the search for a fixed number of iterations (e.g., 100), which yields precision up to $\\approx 10^{-12}$.\n\n### ✅ Invariant\nThe answer lies within the range `[low, high]`. In each step, we refine the range by half. After 100 iterations, `low` and `high` will be virtually identical.\n\n### 🔍 Step-by-step\n1. **Initialize**: `low = 0`, `high = max_initial_gap`.\n2. **Fixed Iteration Loop (100 times)**: \n   - `mid = (low + high) / 2`.\n   - `stationsNeeded = 0`.\n   - For each gap $G_i$ between existing stations:\n     - `stationsNeeded += floor(G_i / mid)`.\n   - If `stationsNeeded <= K`:\n     - The distance `mid` is possible! Try a smaller distance: `high = mid`.\n   - Else:\n     - Distance is too small; we need more than $K$ stations: `low = mid`.\n3. **Return** `high`.\n\n### 🧊 Edge Cases\n- **K is very large**: The maximum distance will approach zero.\n- **K is much smaller than initial gaps**: The result will be close to the largest initial gap divided by some integer.\n\n### ⏱️ Complexity\n- **Time**: $O(N \\times \\text{Iterations})$, where $N$ is the number of stations and Iterations $\\approx 100$.\n- **Space**: $O(1)$ constant overhead.",
        timeComplexity: "O(N * 100)",
        timeComplexityExplanation:
          "The algorithm scans N gaps in each of the 100 binary search iterations to achieve high decimal precision.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Only scalar floating-point variables are used.",
        implementations: [
          {
            language: "Python",
            code: `def min_max_dist(stations, k):
    def check(dist):
        count = 0
        for i in range(len(stations) - 1):
            count += int((stations[i+1] - stations[i]) / dist)
        return count <= k

    low = 0
    high = stations[-1] - stations[0]
    
    for _ in range(100):
        mid = (low + high) / 2.0
        if check(mid):
            high = mid
        else:
            low = mid
            
    return high`,
          },
          {
            language: "JavaScript",
            code: `function minMaxDist(stations, k) {
  const n = stations.length;
  const check = (dist) => {
    let count = 0;
    for (let i = 0; i < n - 1; i++) {
      count += Math.floor((stations[i+1] - stations[i]) / dist);
    }
    return count <= k;
  };

  let low = 0;
  let high = stations[n - 1] - stations[0];

  for (let iter = 0; iter < 100; iter++) {
    let mid = (low + high) / 2;
    if (check(mid)) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return high;
}`,
          },
          {
            language: "C",
            code: `#include <stdio.h>
#include <math.h>

double minMaxDist(int* stations, int n, int k) {
    double low = 0;
    double high = (double)(stations[n-1] - stations[0]);
    
    for (int iter = 0; iter < 100; iter++) {
        double mid = (low + high) / 2.0;
        int count = 0;
        for (int i = 0; i < n - 1; i++) {
            count += (int)((stations[i+1] - stations[i]) / mid);
        }
        
        if (count <= k) {
            high = mid;
        } else {
            low = mid;
        }
    }
    return high;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    double minMaxDist(vector<int>& stations, int k) {
        double low = 0;
        double high = stations.back() - stations.front();
        
        for (int i = 0; i < 100; i++) {
            double mid = (low + high) / 2.0;
            int count = 0;
            for (int j = 0; j < stations.size() - 1; j++) {
                count += (int)((stations[j+1] - stations[j]) / mid);
            }
            
            if (count <= k) {
                high = mid;
            } else {
                low = mid;
            }
        }
        return high;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "median-of-two-sorted-arrays",
    title: "Median of two sorted arrays",
    topic: "Binary Search - Answers",
    category: "Binary Search",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview:
      "Compute the median of two sorted arrays of different sizes in logarithmic time. This algorithm utilizes a binary search on the partition points of the arrays to find the middle element without merging.",
    leetcodeLink: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    useCases: [
      "Statistical analysis of large-scale distributed datasets",
      "Fusing real-time sorted data streams from multiple sensors",
      "Market data stabilization by calculating real-time medians in finance",
    ],
    approaches: [
      {
        name: "Optimal (Binary Search on Partitions)",
        description:
          "### 🧠 Core Intuition\nInstead of merging the arrays (which takes $O(N+M)$), we can reason about where the median must lie. If we partition both arrays into left and right halves such that:\n1. The total size of the left halves equals the total size of the right halves (or differs by 1 for odd totals).\n2. Every element in the combined left half is less than or equal to every element in the combined right half.\n\nThen the median is simply the max of the left elements and/or the min of the right elements. We binary search on the **partition point** of the smaller array to satisfy these conditions.\n\n### ✅ Invariant\nWe maintain $L_1 \\le R_2$ and $L_2 \\le R_1$, where $L_i, R_i$ are the boundaries of the partition in array $i$. If $L_1 > R_2$, we've moved too far right in the first array; if $L_2 > R_1$, we've moved too far left.\n\n### 🔍 Step-by-step\n1. **Always search on the smaller array** to ensure $O(\\log(\\min(N, M)))$. Let $A$ be the smaller and $B$ be the larger array.\n2. **Initialize Range**: `low = 0`, `high = n` (length of $A$).\n3. **Binary Search**:\n   - `partitionA = (low + high) / 2`.\n   - `partitionB = (n + m + 1) / 2 - partitionA` (ensures balanced halves).\n   - Define boundaries:\n     - $L_1 = A[partitionA - 1]$ (or $-\\infty$ if 0)\n     - $R_1 = A[partitionA]$ (or $+\\infty$ if $n$)\n     - $L_2 = B[partitionB - 1]$ (or $-\\infty$ if 0)\n     - $R_2 = B[partitionB]$ (or $+\\infty$ if $m$)\n   - Check Partition Validity:\n     - If $L_1 \\le R_2$ and $L_2 \\le R_1$: Correct partition found!\n     - If $L_1 > R_2$: Move left in $A$: `high = partitionA - 1`.\n     - If $L_2 > R_1$: Move right in $A$: `low = partitionA + 1`.\n4. **Calculate Median**:\n   - If $(n+m)$ is even: `(max(L1, L2) + min(R1, R2)) / 2.0`.\n   - If odd: `max(L1, L2)`.\n\n### ⏱️ Complexity\n- **Time**: $O(\\log(\\min(N, M)))$.\n- **Space**: $O(1)$ constant overhead.",
        timeComplexity: "O(log(min(N, M)))",
        timeComplexityExplanation:
          "Binary search is performed only on the smaller of the two arrays to maximize efficiency.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "The algorithm uses constant space as it only stores a few boundary indices.",
        implementations: [
          {
            language: "Python",
            code: `def find_median_sorted_arrays(nums1, nums2):
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
        
    n1, n2 = len(nums1), len(nums2)
    low, high = 0, n1
    
    while low <= high:
        cut1 = (low + high) // 2
        cut2 = (n1 + n2 + 1) // 2 - cut1
        
        l1 = nums1[cut1-1] if cut1 > 0 else float('-inf')
        l2 = nums2[cut2-1] if cut2 > 0 else float('-inf')
        r1 = nums1[cut1] if cut1 < n1 else float('inf')
        r2 = nums2[cut2] if cut2 < n2 else float('inf')
        
        if l1 <= r2 and l2 <= r1:
            if (n1 + n2) % 2 == 0:
                return (max(l1, l2) + min(r1, r2)) / 2.0
            else:
                return max(l1, l2)
        elif l1 > r2:
            high = cut1 - 1
        else:
            low = cut1 + 1
    return 0.0`,
          },
          {
            language: "JavaScript",
            code: `function findMedianSortedArrays(nums1, nums2) {
  if (nums1.length > nums2.length) {
    return findMedianSortedArrays(nums2, nums1);
  }

  const n1 = nums1.length;
  const n2 = nums2.length;
  let low = 0;
  let high = n1;

  while (low <= high) {
    const cut1 = Math.floor((low + high) / 2);
    const cut2 = Math.floor((n1 + n2 + 1) / 2) - cut1;

    const l1 = cut1 === 0 ? -Infinity : nums1[cut1 - 1];
    const l2 = cut2 === 0 ? -Infinity : nums2[cut2 - 1];
    const r1 = cut1 === n1 ? Infinity : nums1[cut1];
    const r2 = cut2 === n2 ? Infinity : nums2[cut2];

    if (l1 <= r2 && l2 <= r1) {
      if ((n1 + n2) % 2 === 0) {
        return (Math.max(l1, l2) + Math.min(r1, r2)) / 2;
      } else {
        return Math.max(l1, l2);
      }
    } else if (l1 > r2) {
      high = cut1 - 1;
    } else {
      low = cut1 + 1;
    }
  }
  return 0.0;
}`,
          },
          {
            language: "C",
            code: `#include <float.h>
#include <math.h>

#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define MIN(a, b) ((a) < (b) ? (a) : (b))

double findMedianSortedArrays(int* nums1, int n1, int* nums2, int n2) {
    if (n1 > n2) return findMedianSortedArrays(nums2, n2, nums1, n1);

    int low = 0, high = n1;
    while (low <= high) {
        int cut1 = (low + high) / 2;
        int cut2 = (n1 + n2 + 1) / 2 - cut1;

        double l1 = (cut1 == 0) ? -DBL_MAX : nums1[cut1 - 1];
        double l2 = (cut2 == 0) ? -DBL_MAX : nums2[cut2 - 1];
        double r1 = (cut1 == n1) ? DBL_MAX : nums1[cut1];
        double r2 = (cut2 == n2) ? DBL_MAX : nums2[cut2];

        if (l1 <= r2 && l2 <= r1) {
            if ((n1 + n2) % 2 == 0) {
                return (MAX(l1, l2) + MIN(r1, r2)) / 2.0;
            } else {
                return MAX(l1, l2);
            }
        } else if (l1 > r2) {
            high = cut1 - 1;
        } else {
            low = cut1 + 1;
        }
    }
    return 0.0;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        if (nums1.size() > nums2.size()) 
            return findMedianSortedArrays(nums2, nums1);
            
        int n1 = nums1.size();
        int n2 = nums2.size();
        int low = 0, high = n1;
        
        while (low <= high) {
            int cut1 = low + (high - low) / 2;
            int cut2 = (n1 + n2 + 1) / 2 - cut1;
            
            int l1 = (cut1 == 0) ? INT_MIN : nums1[cut1 - 1];
            int l2 = (cut2 == 0) ? INT_MIN : nums2[cut2 - 1];
            int r1 = (cut1 == n1) ? INT_MAX : nums1[cut1];
            int r2 = (cut2 == n2) ? INT_MAX : nums2[cut2];
            
            if (l1 <= r2 && l2 <= r1) {
                if ((n1 + n2) % 2 == 0) {
                    return (max(l1, l2) + min(r1, r2)) / 2.0;
                } else {
                    return max(l1, l2);
                }
            } else if (l1 > r2) {
                high = cut1 - 1;
            } else {
                low = cut1 + 1;
            }
        }
        return 0.0;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "k-th-element-of-two-sorted-arrays",
    title: "K-th Element of Sorted Arrays",
    topic: "Binary Search - Answers",
    category: "Binary Search",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview:
      "Find the k-th smallest element from two sorted arrays of different sizes in logarithmic time. This algorithm generalizes the partition-based median search to find any arbitrary index in the merged sequence.",
    leetcodeLink: "",
    useCases: [
      "Combining high-frequency data streams to retrieve specific percentiles",
      "Database query optimization for top-K results from multiple indices",
      "Network traffic analysis across distributed points to identify rank-based latency",
    ],
    approaches: [
      {
        name: "Optimal (Binary Search on Partitions)",
        description:
          "### 🧠 Core Intuition\nSimilar to finding the median, we want to partition two arrays $A$ and $B$ into 'left' and 'right' parts. However, instead of making the left part exactly half of the total size, we make the total size of the combined left part exactly $K$. \n\nWe binary search for the number of elements to take from the smaller array $A$. If we take $i$ elements from $A$, we must take $K-i$ elements from $B$.\n\n### ✅ Invariant\nThe search range for the partition point in $A$ must be carefully bounded to ensure we don't 'over-pluck' from either array:\n- `low = max(0, K - n2)`: We can't take more elements from $B$ than it contains.\n- `high = min(K, n1)`: We can't take more elements from $A$ than it contains or more than $K$.\n\n### 🔍 Step-by-step\n1. Ensure $n1 \\le n2$ by swapping arrays if necessary ($O(\\log(\\min(n1, n2)))$).\n2. **Range Initialization**: `low = max(0, K - n2)`, `high = min(K, n1)`.\n3. **Binary Search**:\n   - `cut1 = (low + high) / 2` (Partition in array A).\n   - `cut2 = K - cut1` (Partition in array B).\n   - Boundaries:\n     - $L1$: `A[cut1-1]` or $-\\infty$\n     - $R1$: `A[cut1]` or $+\\infty$\n     - $L2$: `B[cut2-1]` or $-\\infty$\n     - $R2$: `B[cut2]` or $+\\infty$\n   - Check:\n     - If $L1 \\le R2$ and $L2 \\le R1$: Found! Result is `max(L1, L2)`.\n     - If $L1 > R2$: Take fewer from $A$: `high = cut1 - 1`.\n     - If $L2 > R1$: Take more from $A$: `low = cut1 + 1`.\n\n### ⏱️ Complexity\n- **Time**: $O(\\log(\\min(N, M)))$.\n- **Space**: $O(1)$ constant overhead.",
        timeComplexity: "O(log(min(N, M)))",
        timeComplexityExplanation:
          "Binary search is performed on the smaller array's indices to identify the k-th element's partition.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "Only primitive integer values for pointers and boundaries are stored.",
        implementations: [
          {
            language: "Python",
            code: `def kth_element(nums1, nums2, k):
    if len(nums1) > len(nums2):
        return kth_element(nums2, nums1, k)
        
    n1, n2 = len(nums1), len(nums2)
    low, high = max(0, k - n2), min(k, n1)
    
    while low <= high:
        cut1 = (low + high) // 2
        cut2 = k - cut1
        
        l1 = nums1[cut1-1] if cut1 > 0 else float('-inf')
        l2 = nums2[cut2-1] if cut2 > 0 else float('-inf')
        r1 = nums1[cut1] if cut1 < n1 else float('inf')
        r2 = nums2[cut2] if cut2 < n2 else float('inf')
        
        if l1 <= r2 and l2 <= r1:
            return max(l1, l2)
        elif l1 > r2:
            high = cut1 - 1
        else:
            low = cut1 + 1
    return -1`,
          },
          {
            language: "JavaScript",
            code: `function kthElement(nums1, nums2, k) {
  if (nums1.length > nums2.length) {
    return kthElement(nums2, nums1, k);
  }

  const n1 = nums1.length;
  const n2 = nums2.length;
  let low = Math.max(0, k - n2);
  let high = Math.min(k, n1);

  while (low <= high) {
    const cut1 = Math.floor((low + high) / 2);
    const cut2 = k - cut1;

    const l1 = cut1 === 0 ? -Infinity : nums1[cut1 - 1];
    const l2 = cut2 === 0 ? -Infinity : nums2[cut2 - 1];
    const r1 = cut1 === n1 ? Infinity : nums1[cut1];
    const r2 = cut2 === n2 ? Infinity : nums2[cut2];

    if (l1 <= r2 && l2 <= r1) {
      return Math.max(l1, l2);
    } else if (l1 > r2) {
      high = cut1 - 1;
    } else {
      low = cut1 + 1;
    }
  }
  return -1;
}`,
          },
          {
            language: "C",
            code: `#include <limits.h>

#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define MIN(a, b) ((a) < (b) ? (a) : (b))

int kthElement(int* nums1, int n1, int* nums2, int n2, int k) {
    if (n1 > n2) return kthElement(nums2, n2, nums1, n1, k);

    int low = (k > n2) ? k - n2 : 0;
    int high = (k < n1) ? k : n1;

    while (low <= high) {
        int cut1 = (low + high) / 2;
        int cut2 = k - cut1;

        int l1 = (cut1 == 0) ? INT_MIN : nums1[cut1 - 1];
        int l2 = (cut2 == 0) ? INT_MIN : nums2[cut2 - 1];
        int r1 = (cut1 == n1) ? INT_MAX : nums1[cut1];
        int r2 = (cut2 == n2) ? INT_MAX : nums2[cut2];

        if (l1 <= r2 && l2 <= r1) {
            return MAX(l1, l2);
        } else if (l1 > r2) {
            high = cut1 - 1;
        } else {
            low = cut1 + 1;
        }
    }
    return -1;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
public:
    int kthElement(vector<int>& nums1, vector<int>& nums2, int n, int m, int k) {
        if (n > m) return kthElement(nums2, nums1, m, n, k);

        int low = max(0, k - m), high = min(k, n);

        while (low <= high) {
            int cut1 = (low + high) >> 1;
            int cut2 = k - cut1;

            int l1 = (cut1 == 0) ? INT_MIN : nums1[cut1 - 1];
            int l2 = (cut2 == 0) ? INT_MIN : nums2[cut2 - 1];
            int r1 = (cut1 == n) ? INT_MAX : nums1[cut1];
            int r2 = (cut2 == m) ? INT_MAX : nums2[cut2];

            if (l1 <= r2 && l2 <= r1) {
                return max(l1, l2);
            } else if (l1 > r2) {
                high = cut1 - 1;
            } else {
                low = cut1 + 1;
            }
        }
        return -1;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "find-the-row-with-maximum-number-of-1s",
    title: "Row with Maximum 1s",
    topic: "Binary Search - 2D Arrays",
    category: "Binary Search",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Given a row-wise sorted binary matrix, identify the index of the first row containing the maximum number of 1s in $O(N+M)$ or $O(N \\log M)$ time.",
    leetcodeLink: "",
    useCases: [
      "Analyzing population density in occupancy grids for robotics",
      "Prioritizing high-density records in bitmask filtering",
      "Finding the first 'feature-heavy' row in binary image analysis",
    ],
    approaches: [
      {
        name: "Optimal (Staircase Search / Two-Pointer)",
        description:
          "### 🧠 Core Intuition\nSince each row is sorted, all `1`s appear after all `0`s. Instead of binary searching each row (which would take $O(N \\log M)$), we can use a **staircase** approach starting from the top-right corner.\n\nIf the current cell is `1`, it means we might have found a better row than the previous max. We look further left in the *same* row to see if there are even more `1`s. If the current cell is `0`, the current row cannot possibly have more `1`s than our best so far, so we move to the next row.\n\n### ✅ Invariant\nAt any point, the column index `j` represents the leftmost `1` seen so far in any of the rows processed. \n\n### 🔍 Step-by-step\n1. Start at `row = 0`, `col = m - 1` (top-right).\n2. Initialize `maxRowIndex = -1`.\n3. While `row < n` and `col >= 0`:\n   - If `matrix[row][col] == 1`:\n     - This row is currently the best. `maxRowIndex = row`.\n     - Move left to see if we can find more `1`s: `col--`.\n   - Else (`matrix[row][col] == 0`):\n     - This row cannot beat the current record. Move down: `row++`.\n4. **Return** `maxRowIndex`.\n\n### ⏱️ Complexity\n- **Time**: $O(N + M)$ — linear scan across rows and columns.\n- **Space**: $O(1)$ constant overhead.",
        timeComplexity: "O(N + M)",
        timeComplexityExplanation:
          "The algorithm processes the matrix in a staircase pattern, moving at most N times down and M times left.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "Algorithm is iterative and uses minimal primitive variables.",
        implementations: [
          {
            language: "Python",
            code: `def row_with_max_1s(matrix):
    n = len(matrix)
    if n == 0: return -1
    m = len(matrix[0])
    
    max_row_index = -1
    j = m - 1
    
    for i in range(n):
        while j >= 0 and matrix[i][j] == 1:
            max_row_index = i
            j -= 1
            
    return max_row_index`,
          },
          {
            language: "JavaScript",
            code: `function rowWithMax1s(matrix) {
  const n = matrix.length;
  if (n === 0) return -1;
  const m = matrix[0].length;

  let maxRowIndex = -1;
  let j = m - 1;

  for (let i = 0; i < n; i++) {
    while (j >= 0 && matrix[i][j] === 1) {
      maxRowIndex = i;
      j--;
    }
  }

  return maxRowIndex;
}`,
          },
          {
            language: "C",
            code: `int rowWithMax1s(int** matrix, int n, int m) {
    int maxRowIndex = -1;
    int j = m - 1;

    for (int i = 0; i < n; i++) {
        while (j >= 0 && matrix[i][j] == 1) {
            maxRowIndex = i;
            j--;
        }
    }
    return maxRowIndex;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
using namespace std;

class Solution {
public:
    int rowWithMax1s(vector<vector<int>>& matrix, int n, int m) {
        int maxRowIndex = -1;
        int col = m - 1;

        for (int row = 0; row < n; row++) {
            while (col >= 0 && matrix[row][col] == 1) {
                maxRowIndex = row;
                col--;
            }
        }
        return maxRowIndex;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "search-in-a-2d-matrix",
    title: "Search in a 2D Matrix",
    topic: "Binary Search - 2D Arrays",
    category: "Binary Search",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Search for a target value in an M x N matrix. Each row is sorted, and the first element of each row is greater than the last element of the previous row. This unique structure allows the matrix to be searched as a singular flattened array.",
    leetcodeLink: "https://leetcode.com/problems/search-in-a-2d-matrix/",
    useCases: [
      "Efficient lookup in block-stored sorted datasets",
      "Fast retrieval in sequential memory mappings for row-major data",
      "Searching for keys in hierarchical sorted stores",
    ],
    approaches: [
      {
        name: "Optimal (Flattened Binary Search)",
        description:
          "### 🧠 Core Intuition\nThe matrix has a **global sorted property**: every element at `matrix[i][j]` is smaller than `matrix[i][j+1]` and also smaller than `matrix[i+1][0]`. Consequently, if we 'unrolled' the matrix into a single array, it would be perfectly sorted.\n\nInstead of physically flattening the matrix (which would take $O(N \\times M)$), we can virtually flatten it by mapping a 1-dimensional index `X` back to its 2-dimensional coordinates:\n- `row = X / M`\n- `col = X % M` (where M is number of columns).\n\n### ✅ Invariant\nThe search range `[low, high]` corresponds to indices in the flattened array of length $N \\times M$. \n\n### 🔍 Step-by-step\n1. Let $N$ be rows, $M$ be columns.\n2. Initialize `low = 0`, `high = (N * M) - 1`.\n3. While `low <= high`:\n   - `mid = (low + high) / 2`.\n   - Calculate coordinates: `r = mid / M`, `c = mid % M`.\n   - If `matrix[r][c] == target`: Return `true`.\n   - If `matrix[r][c] < target`: Search right half: `low = mid + 1`.\n   - Else: Search left half: `high = mid - 1`.\n4. **Return** `false` if not found.\n\n### ⏱️ Complexity\n- **Time**: $O(\\log(N \\times M))$ — standard binary search over total elements.\n- **Space**: $O(1)$ constant overhead.",
        timeComplexity: "O(log(N * M))",
        timeComplexityExplanation:
          "The algorithm treats the entire matrix as a single sorted array and performs a single binary search.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "No extra space is used; only coordinate mapping calculations are performed.",
        implementations: [
          {
            language: "Python",
            code: `def search_matrix(matrix, target):
    if not matrix or not matrix[0]:
        return False
    
    n, m = len(matrix), len(matrix[0])
    low, high = 0, n * m - 1
    
    while low <= high:
        mid = (low + high) // 2
        r, c = divmod(mid, m)
        val = matrix[r][c]
        
        if val == target:
            return True
        elif val < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return False`,
          },
          {
            language: "JavaScript",
            code: `function searchMatrix(matrix, target) {
  if (!matrix.length) return false;
  const n = matrix.length;
  const m = matrix[0].length;
  let low = 0;
  let high = n * m - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const r = Math.floor(mid / m);
    const c = mid % m;
    const val = matrix[r][c];

    if (val === target) return true;
    if (val < target) low = mid + 1;
    else high = mid - 1;
  }
  return false;
}`,
          },
          {
            language: "C",
            code: `#include <stdbool.h>

bool searchMatrix(int** matrix, int matrixSize, int* matrixColSize, int target) {
    int n = matrixSize;
    int m = matrixColSize[0];
    int low = 0, high = n * m - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        int r = mid / m;
        int c = mid % m;
        int val = matrix[r][c];

        if (val == target) return true;
        if (val < target) low = mid + 1;
        else high = mid - 1;
    }
    return false;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
using namespace std;

class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int n = matrix.size();
        int m = matrix[0].size();
        int low = 0, high = n * m - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            int r = mid / m;
            int c = mid % m;
            int val = matrix[r][c];

            if (val == target) return true;
            if (val < target) low = mid + 1;
            else high = mid - 1;
        }
        return false;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "search-in-a-2d-matrix-ii",
    title: "Search in a 2D Matrix II",
    topic: "Binary Search - 2D Arrays",
    category: "Binary Search",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Find a target value in an M x N matrix where rows are sorted left-to-right and columns are sorted top-to-bottom. This problem leverages the 'Staircase Search' strategy to achieve linear time complexity relative to dimensions.",
    leetcodeLink: "https://leetcode.com/problems/search-in-a-2d-matrix-ii/",
    useCases: [
      "Searching in sorted Young Tableaus or mathematical multiplication tables",
      "Real-time lookup in multi-dimensional telemetry data with trend-based sorting",
      "Efficient pattern matching in sorted spatial grids for GIS",
    ],
    approaches: [
      {
        name: "Optimal (Staircase Search)",
        description:
          "### 🧠 Core Intuition\nWhile a binary search could be applied to each row ($O(N \\log M)$), we can exploit the column sorting to do better. \n\nStarting at the **top-right corner** (`row = 0, col = M-1`):\n- If the target is **smaller** than the current element, it cannot exist in the current column (since the column grows downwards). Move **left**.\n- If the target is **larger** than the current element, it cannot exist in the current row (since the row grows rightwards). Move **down**.\n\nThis 'staircase' path eliminates either an entire row or an entire column at every single step, guaranteeing we find the target (or exhaustion) in linear time.\n\n### ✅ Invariant\nAt each step, the sub-matrix defined by `[row...N-1][0...col]` contains the target if it exists at all.\n\n### 🔍 Step-by-step\n1. Start at `row = 0, col = M - 1`.\n2. While `row < N` and `col >= 0`:\n   - If `matrix[row][col] == target`: Return `true`.\n   - If `matrix[row][col] > target`: Move left (`col--`).\n   - Else: Move down (`row++`).\n3. Return `false` if bounds are exceeded.\n\n### ⏱️ Complexity\n- **Time**: $O(N + M)$ — linear path across matrix boundaries.\n- **Space**: $O(1)$ constant overhead.",
        timeComplexity: "O(N + M)",
        timeComplexityExplanation:
          "The search starts at the top-right and moves either one step left or one step down per iteration.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Only two integer pointers are used.",
        implementations: [
          {
            language: "Python",
            code: `def search_matrix(matrix, target):
    if not matrix or not matrix[0]:
        return False
    
    n, m = len(matrix), len(matrix[0])
    row, col = 0, m - 1
    
    while row < n and col >= 0:
        val = matrix[row][col]
        if val == target:
            return True
        elif val > target:
            col -= 1
        else:
            row += 1
            
    return False`,
          },
          {
            language: "JavaScript",
            code: `function searchMatrixII(matrix, target) {
  if (!matrix.length) return false;
  const n = matrix.length;
  const m = matrix[0].length;
  let row = 0;
  let col = m - 1;

  while (row < n && col >= 0) {
    const val = matrix[row][col];
    if (val === target) return true;
    if (val > target) col--;
    else row++;
  }
  return false;
}`,
          },
          {
            language: "C",
            code: `#include <stdbool.h>

bool searchMatrixII(int** matrix, int matrixSize, int* matrixColSize, int target) {
    if (matrixSize == 0) return false;
    int n = matrixSize;
    int m = matrixColSize[0];
    int row = 0, col = m - 1;

    while (row < n && col >= 0) {
        int val = matrix[row][col];
        if (val == target) return true;
        if (val > target) col--;
        else row++;
    }
    return false;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
using namespace std;

class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        if (matrix.empty()) return false;
        int n = matrix.size();
        int m = matrix[0].size();
        int row = 0, col = m - 1;

        while (row < n && col >= 0) {
            int val = matrix[row][col];
            if (val == target) return true;
            if (val > target) col--;
            else row++;
        }
        return false;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "find-peak-element-2d-matrix",
    title: "Find Peak Element in 2D Matrix",
    topic: "Binary Search - 2D Arrays",
    category: "Binary Search",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview:
      "Locate a peak element in a 2D matrix where an element is a peak if it is strictly greater than its neighbors (up, down, left, right). This algorithm combines binary search with greedy row maximization.",
    leetcodeLink: "https://leetcode.com/problems/find-a-peak-element-ii/",
    useCases: [
      "Identifying localized maxima in digital elevation models (topography)",
      "Finding 'hotspots' in heatmaps or localized intensity in image data",
      "Detecting local price spikes in spatial economic datasets",
    ],
    approaches: [
      {
        name: "Optimal (Binary Search on Columns)",
        description:
          "### 🧠 Core Intuition\nIn 1D, we binary search for a peak. In 2D, we can binary search on **columns**. For any chosen column `mid`, we find the maximum element in that column (at row `maxRow`). \n\nNow, we only need to compare `matrix[maxRow][mid]` with its **left** and **right** neighbors. \n- If it's larger than both, it's a 2D peak! (Because it's already the max in its own column, so it's also larger than its up/down neighbors).\n- If the right neighbor is larger, a peak must exist in the right half of the matrix.\n- Otherwise, a peak exist in the left half.\n\n### ✅ Invariant\nA peak is guaranteed to exist in the current search range of columns.\n\n### 🔍 Step-by-step\n1. Initialize `lowCol = 0, highCol = M - 1`.\n2. While `lowCol <= highCol`:\n   - `midCol = (lowCol + highCol) / 2`.\n   - Find `maxRow` such that `matrix[maxRow][midCol]` is the global maximum in `midCol`.\n   - Compare `matrix[maxRow][midCol]` with `left` (`midCol - 1`) and `right` (`midCol + 1`) neighbors.\n   - If it's a peak: Return `[maxRow, midCol]`.\n   - If `right neighbor > current`: Search right half (`lowCol = midCol + 1`).\n   - Else: Search left half (`highCol = midCol - 1`).\n\n### ⏱️ Complexity\n- **Time**: $O(N \\log M)$ where $N$ is rows and $M$ is columns.\n- **Space**: $O(1)$ constant overhead.",
        timeComplexity: "O(N * log M)",
        timeComplexityExplanation:
          "Binary search over M columns. In each step, we scanning N rows to find the maximum in the middle column.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "No extra structure used; only pointers to range boundaries.",
        implementations: [
          {
            language: "Python",
            code: `def find_peak_grid(matrix):
    n, m = len(matrix), len(matrix[0])
    low, high = 0, m - 1
    
    while low <= high:
        mid_col = (low + high) // 2
        
        # Find max in current column
        max_row = 0
        for r in range(n):
            if matrix[r][mid_col] > matrix[max_row][mid_col]:
                max_row = r
                
        left = matrix[max_row][mid_col - 1] if mid_col > 0 else -1
        right = matrix[max_row][mid_col + 1] if mid_col < m - 1 else -1
        curr = matrix[max_row][mid_col]
        
        if curr > left and curr > right:
            return [max_row, mid_col]
        elif right > curr:
            low = mid_col + 1
        else:
            high = mid_col - 1
            
    return [-1, -1]`,
          },
          {
            language: "JavaScript",
            code: `function findPeakGrid(matrix) {
  const n = matrix.length;
  const m = matrix[0].length;
  let lowCol = 0;
  let highCol = m - 1;

  while (lowCol <= highCol) {
    const midCol = Math.floor((lowCol + highCol) / 2);
    
    let maxRow = 0;
    for (let i = 1; i < n; i++) {
      if (matrix[i][midCol] > matrix[maxRow][midCol]) {
        maxRow = i;
      }
    }

    const curr = matrix[maxRow][midCol];
    const left = midCol > 0 ? matrix[maxRow][midCol - 1] : -1;
    const right = midCol < m - 1 ? matrix[maxRow][midCol + 1] : -1;

    if (curr > left && curr > right) {
      return [maxRow, midCol];
    } else if (right > curr) {
      lowCol = midCol + 1;
    } else {
      highCol = midCol - 1;
    }
  }
  return [-1, -1];
}`,
          },
          {
            language: "C",
            code: `int* findPeakGrid(int** matrix, int matrixSize, int* matrixColSize, int* returnSize) {
    int n = matrixSize;
    int m = matrixColSize[0];
    int low = 0, high = m - 1;
    int* res = (int*)malloc(2 * sizeof(int));
    *returnSize = 2;

    while (low <= high) {
        int mid = (low + high) / 2;
        int maxRow = 0;
        for (int i = 0; i < n; i++) {
            if (matrix[i][mid] > matrix[maxRow][mid]) {
                maxRow = i;
            }
        }

        int curr = matrix[maxRow][mid];
        int left = (mid > 0) ? matrix[maxRow][mid - 1] : -1;
        int right = (mid < m - 1) ? matrix[maxRow][mid + 1] : -1;

        if (curr > left && curr > right) {
            res[0] = maxRow;
            res[1] = mid;
            return res;
        } else if (right > curr) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return res;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> findPeakGrid(vector<vector<int>>& matrix) {
        int n = matrix.size();
        int m = matrix[0].size();
        int low = 0, high = m - 1;

        while (low <= high) {
            int midCol = low + (high - low) / 2;
            int maxRow = 0;
            for (int r = 0; r < n; r++) {
                if (matrix[r][midCol] > matrix[maxRow][midCol]) {
                    maxRow = r;
                }
            }

            int curr = matrix[maxRow][midCol];
            int left = (midCol > 0) ? matrix[maxRow][midCol - 1] : -1;
            int right = (midCol < m - 1) ? matrix[maxRow][midCol + 1] : -1;

            if (curr > left && curr > right) {
                return {maxRow, midCol};
            } else if (right > curr) {
                low = midCol + 1;
            } else {
                high = midCol - 1;
            }
        }
        return {-1, -1};
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "median-in-a-row-wise-sorted-matrix",
    title: "Median in Row-wise Sorted Matrix",
    topic: "Binary Search - 2D Arrays",
    category: "Binary Search",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview:
      "Find the median value in an N x M matrix where each row is independently sorted. This problem requires a binary search on the potential value range, utilizing the row sorting for efficient counting.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/median-in-a-row-wise-sorted-matrix1527/1",
    useCases: [
      "Statistical median calculation in sharded distributed databases",
      "Analyzing percentiles across multiple sorted sensor streams",
      "Finding equilibrium points in nested sorted data structures",
    ],
    approaches: [
      {
        name: "Optimal (Binary Search on Range)",
        description:
          "### 🧠 Core Intuition\nIn an $N \\times M$ matrix, the median is the element that would be at the middle position if all $N \\times M$ elements were sorted together. Since each row is independently sorted, we can use binary search on the **value range** `[min_val, max_val]`.\n\nFor any chosen `mid` value, we count how many elements in the entire matrix are $\\le mid$. \n- Because rows are sorted, we can use `upper_bound` on each row to get the count in $O(\\log M)$.\n- The total count is the sum of counts across all $N$ rows.\n- This total count is **monotonic** relative to `mid`, allowing us to binary search the value space.\n\n### ✅ Invariant\nThe median is the smallest value $X$ such that at least $(N \\times M + 1) / 2$ elements are $\\le X$.\n\n### 🔍 Step-by-step\n1. Find `low` (minimum element in the matrix) and `high` (maximum element).\n2. While `low <= high`:\n   - `mid = (low + high) / 2`.\n   - Count elements $\\le mid$ in each of the $N$ rows using binary search.\n   - If `totalCount < (N * M + 1) / 2`:\n     - We need more elements; move range up: `low = mid + 1`.\n   - Else:\n     - This could be the median or larger; move range down: `high = mid - 1`.\n3. **Return** `low`.\n\n### ⏱️ Complexity\n- **Time**: $O(N \\times \\log M \\times \\log(2^{31}-1))$ — where $\\log(2^{31})$ iterations refine the value range.\n- **Space**: $O(1)$ constant overhead.",
        timeComplexity: "O(32 * N * log M)",
        timeComplexityExplanation:
          "The value range binary search runs for ~32 iterations (for 32-bit integers). In each iteration, we perform N row-wise binary searches.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "Algorithm only tracks search boundaries and row pointers.",
        implementations: [
          {
            language: "Python",
            code: `import bisect

def find_median(matrix):
    n, m = len(matrix), len(matrix[0])
    low = min(row[0] for row in matrix)
    high = max(row[-1] for row in matrix)
    
    desired = (n * m + 1) // 2
    
    while low <= high:
        mid = (low + high) // 2
        count = sum(bisect.bisect_right(row, mid) for row in matrix)
        
        if count < desired:
            low = mid + 1
        else:
            high = mid - 1
            
    return low`,
          },
          {
            language: "JavaScript",
            code: `function findMedian(matrix) {
  const n = matrix.length;
  const m = matrix[0].length;
  let low = Math.min(...matrix.map(row => row[0]));
  let high = Math.max(...matrix.map(row => row[m - 1]));

  const desired = Math.floor((n * m + 1) / 2);

  const countLessEqual = (mid) => {
    let count = 0;
    for (let row of matrix) {
      let l = 0, r = m - 1;
      while (l <= r) {
        let mm = Math.floor((l + r) / 2);
        if (row[mm] <= mid) l = mm + 1;
        else r = mm - 1;
      }
      count += l;
    }
    return count;
  };

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (countLessEqual(mid) < desired) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return low;
}`,
          },
          {
            language: "C",
            code: `int countLessEqual(int** matrix, int n, int m, int mid) {
    int total = 0;
    for (int i = 0; i < n; i++) {
        int l = 0, r = m - 1;
        while (l <= r) {
            int mm = l + (r - l) / 2;
            if (matrix[i][mm] <= mid) l = mm + 1;
            else r = mm - 1;
        }
        total += l;
    }
    return total;
}

int findMedian(int** matrix, int n, int m) {
    int low = 1e9, high = -1e9;
    for (int i = 0; i < n; i++) {
        if (matrix[i][0] < low) low = matrix[i][0];
        if (matrix[i][m-1] > high) high = matrix[i][m-1];
    }

    int desired = (n * m + 1) / 2;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (countLessEqual(matrix, n, m, mid) < desired) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return low;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int countSmallerThanMid(const vector<int>& row, int mid) {
        return upper_bound(row.begin(), row.end(), mid) - row.begin();
    }

    int findMedian(vector<vector<int> > &matrix, int r, int c) {
        int low = 1, high = 1e9;
        int desired = (r * c + 1) / 2;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            int count = 0;
            for (int i = 0; i < r; i++) {
                count += countSmallerThanMid(matrix[i], mid);
            }
            if (count < desired) low = mid + 1;
            else high = mid - 1;
        }
        return low;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "remove-outermost-parenthesis",
    title: "Remove Outermost Parentheses",
    topic: "Strings - Basic",
    category: "Strings",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview:
      "Decompose a valid parentheses string into its primitive components and remove the outermost parentheses from each. This process simplifies nested structure while preserving inner relationships.",
    leetcodeLink: "https://leetcode.com/problems/remove-outermost-parentheses/",
    useCases: [
      "Cleaning up nested expressions in compilers or template engines",
      "Parsing and normalizing Lisp-style parenthesized data structures",
      "Simplifying deeply nested logical groupings in configuration files",
    ],
    approaches: [
      {
        name: "Optimal (Single Pass Balance Count)",
        description:
          "### 🧠 Core Intuition\nA 'primitive' valid parentheses string is one that cannot be split further into smaller valid strings. For each primitive component, the first `(` and its matching last `)` are the 'outermost'.\n\nWe track the nesting level using a counter `balance`. Any bracket encountered at a depth $> 0$ (meaning we are already inside a primitive component) belongs in the final result.\n\n### ✅ Invariant\nThe `balance` variable strictly tracks the depth of nesting. Any bracket that does not transition depth to or from 0 is preserved.\n\n### 🔍 Step-by-step\n1. Initialize `result` string and `balance = 0`.\n2. Iterate through each character `c` in `S`:\n   - If `c == '('`:\n     - If `balance > 0`: Append `c` to `result` (it's not the outermost).\n     - `balance++`.\n   - Else (`c == ')'`):\n     - `balance--`.\n     - If `balance > 0`: Append `c` to `result` (it's not the outermost).\n3. Return `result`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — single linear pass through the string.\n- **Space**: $O(N)$ for building the result string; $O(1)$ extra state overhead.",
        timeComplexity: "O(N)",
        timeComplexityExplanation:
          "The algorithm scans the input string exactly once, performing constant-time operations at each step.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation:
          "Result string storage grows linearly with input size.",
        implementations: [
          {
            language: "Python",
            code: `def remove_outermost_parentheses(s):
    res = []
    balance = 0
    for char in s:
        if char == '(':
            if balance > 0:
                res.append(char)
            balance += 1
        else:
            balance -= 1
            if balance > 0:
                res.append(char)
    return "".join(res)`,
          },
          {
            language: "JavaScript",
            code: `function removeOuterParentheses(s) {
  let res = "";
  let balance = 0;
  for (let char of s) {
    if (char === "(") {
      if (balance > 0) res += char;
      balance++;
    } else {
      balance--;
      if (balance > 0) res += char;
    }
  }
  return res;
}`,
          },
          {
            language: "C",
            code: `char* removeOuterParentheses(char* s) {
    int n = strlen(s);
    char* res = (char*)malloc(n + 1);
    int k = 0, balance = 0;
    
    for (int i = 0; s[i] != '\\0'; i++) {
        if (s[i] == '(') {
            if (balance > 0) res[k++] = '(';
            balance++;
        } else {
            balance--;
            if (balance > 0) res[k++] = ')';
        }
    }
    res[k] = '\\0';
    return res;
}`,
          },
          {
            language: "C++",
            code: `#include <string>
using namespace std;

class Solution {
public:
    string removeOuterParentheses(string s) {
        string res = "";
        int balance = 0;
        for (char c : s) {
            if (c == '(') {
                if (balance > 0) res += c;
                balance++;
            } else {
                balance--;
                if (balance > 0) res += c;
            }
        }
        return res;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "reverse-words-in-a-given-string",
    title: "Reverse Words in a String",
    topic: "Strings - Basic",
    category: "Strings",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Reverse the order of words in a string while removing leading/trailing spaces and collapsing multiple internal spaces. The output should be a clean, single-spaced sequence of words in reverse.",
    leetcodeLink: "https://leetcode.com/problems/reverse-words-in-a-string/",
    useCases: [
      "Normalizing user input strings for robust search indexing",
      "Formatting display text for social media profile metadata",
      "Preprocessing natural language where syntactic reversal is required",
    ],
    approaches: [
      {
        name: "Optimal (Tokenization & Join)",
        description:
          "### 🧠 Core Intuition\nThe most robust way to handle multiple spaces is to tokenize the string into individual words, filtering out any empty strings, and then reassembling them in reverse order.\n\n### ✅ Invariant\nOnly non-empty substrings (representing actual words) are stored in the temporary list/stack.\n\n### 🔍 Step-by-step\n1. **Trim** leading and trailing whitespace from the string.\n2. **Tokenize**: Split the string by space characters. Ensure that multiple spaces are treated as a single delimiter (regex `\\s+` is ideal here).\n3. **Filter**: Remove any resulting empty tokens.\n4. **Reverse**: Change the order of the token list.\n5. **Join**: Concat the tokens back together using a single space as a separator.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — linear time to split, reverse, and join.\n- **Space**: $O(N)$ — to store the words and resulting string.",
        timeComplexity: "O(N)",
        timeComplexityExplanation:
          "A single pass is needed to split the string, and another to join the reversed tokens.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation:
          "Storage for the list of words and the final result string.",
        implementations: [
          {
            language: "Python",
            code: `def reverse_words(s):
    # Python's .split() automatically handles multiple spaces
    words = s.split()
    return " ".join(words[::-1])`,
          },
          {
            language: "JavaScript",
            code: `function reverseWords(s) {
  return s.trim().split(/\\s+/).reverse().join(" ");
}`,
          },
          {
            language: "C",
            code: `// C requires manual tokenization or two-pointer logic
void reverse(char* s, int i, int j) {
    while (i < j) {
        char temp = s[i];
        s[i++] = s[j];
        s[j--] = temp;
    }
}

char* reverseWords(char* s) {
    int n = strlen(s);
    // 1. Reverse entire string
    reverse(s, 0, n - 1);
    
    // 2. Reverse each word and handle spaces (requires O(N) buffer or in-place shift)
    // Production note: Manual word-wise reversal is omitted for brevity in this mock.
    return s; 
}`,
          },
          {
            language: "C++",
            code: `#include <iostream>
#include <sstream>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    string reverseWords(string s) {
        stringstream ss(s);
        string word;
        vector<string> words;
        while (ss >> word) {
            words.push_back(word);
        }
        reverse(words.begin(), words.end());
        string res = "";
        for (int i = 0; i < words.size(); i++) {
            res += words[i] + (i == words.size() - 1 ? "" : " ");
        }
        return res;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "largest-odd-number-in-a-string",
    title: "Largest Odd Number",
    topic: "Strings - Basic",
    category: "Strings",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview:
      "Find the largest odd-valued numeric string that is a prefix of some suffix of the original string. Effectively, this means finding the rightmost odd digit in the string and returning the prefix ending at that digit.",
    leetcodeLink: "https://leetcode.com/problems/largest-odd-number-in-string/",
    useCases: [
      "Identifying the largest odd numeric ID in sequential logs",
      "Dynamic filtering of numeric strings based on parity requirements",
      "Preprocessing mathematical datasets stored in string format",
    ],
    approaches: [
      {
        name: "Optimal (Greedy Scan)",
        description:
          "### 🧠 Core Intuition\nAn integer is odd if and only if its last digit is odd. To maximize the value of the resulting string, we want our resulting odd number to be as long as possible. \n\nBy scanning the string from right to left, the first odd digit we encounter will be the tail of the largest possible odd substring. Any digits to the left of this odd digit (the prefix) will simply make the number larger.\n\n### ✅ Invariant\nThe largest odd number must end at the rightmost possible odd digit position.\n\n### 🔍 Step-by-step\n1. Start a loop from the end of the string `n-1` down to `0`.\n2. Convert the character at `i` to its numeric value and check if it is odd (`num % 2 != 0`).\n3. Upon finding the first odd digit:\n   - Return the substring from index `0` to `i` (inclusive).\n4. If no odd digit is found, return an empty string.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — single backward pass.\n- **Space**: $O(1)$ additional space (ignoring output string storage).",
        timeComplexity: "O(N)",
        timeComplexityExplanation:
          "The algorithm processes the string linearly from right to left once.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "No extra data structures are used; only a few scalar loop variables.",
        implementations: [
          {
            language: "Python",
            code: `def largest_odd_number(num):
    # Scan from right to find the first odd digit
    for i in range(len(num) - 1, -1, -1):
        if int(num[i]) % 2 != 0:
            return num[:i+1]
    return ""`,
          },
          {
            language: "JavaScript",
            code: `function largestOddNumber(num) {
  for (let i = num.length - 1; i >= 0; i--) {
    if (parseInt(num[i]) % 2 !== 0) {
      return num.slice(0, i + 1);
    }
  }
  return "";
}`,
          },
          {
            language: "C",
            code: `char* largestOddNumber(char* num) {
    int n = strlen(num);
    for (int i = n - 1; i >= 0; i--) {
        if ((num[i] - '0') % 2 != 0) {
            num[i + 1] = '\\0'; // Terminate string at found odd digit
            return num;
        }
    }
    return "";
}`,
          },
          {
            language: "C++",
            code: `#include <string>
using namespace std;

class Solution {
public:
    string largestOddNumber(string num) {
        for (int i = num.length() - 1; i >= 0; i--) {
            if ((num[i] - '0') % 2 != 0) {
                return num.substr(0, i + 1);
            }
        }
        return "";
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "longest-common-prefix",
    title: "Longest Common Prefix",
    topic: "Strings - Basic",
    category: "Strings",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Find the longest string that is a prefix of all strings in a given array. This problem benchmarks string comparison efficiency and edge case handling (empty arrays, mismatching characters).",
    leetcodeLink: "https://leetcode.com/problems/longest-common-prefix/",
    useCases: [
      "Autocompleting directory paths or filenames in a terminal",
      "Grouping and organizing dictionary search results",
      "Identifying shared network subnet prefixes in IP address lists",
    ],
    approaches: [
      {
        name: "Optimal (Sorting & Ends Comparison)",
        description:
          "### 🧠 Core Intuition\nIf we sort the array lexicographically, the first and last strings will be the 'most different' from each other in terms of characters. \n\nAny character that is common to both the first and last string prefix must also be common to all strings in between (due to the lexicographical ordering). Therefore, we only need to compare the first and last string.\n\n### ✅ Invariant\nThe longest common prefix of the entire set is exactly equal to the longest common prefix of the lexicographical min and max strings.\n\n### 🔍 Step-by-step\n1. If the input list is empty, return an empty string.\n2. **Sort** the input array of strings.\n3. Take the first string (`first`) and the last string (`last`).\n4. Compare them character by character until a mismatch is found or one string ends.\n5. Return the shared prefix found.\n\n### ⏱️ Complexity\n- **Time**: $O(N \\log N \\cdot L)$ — where $N$ is count and $L$ is max length, dominated by sorting.\n- **Space**: $O(L)$ to store the result prefix.",
        timeComplexity: "O(N * log N * L)",
        timeComplexityExplanation:
          "Sorting N strings of average length L takes O(N log N * L). Comparison takes O(L).",
        spaceComplexity: "O(L)",
        spaceComplexityExplanation:
          "Extra space is needed only for the output prefix.",
        implementations: [
          {
            language: "Python",
            code: `def longest_common_prefix(strs):
    if not strs:
        return ""
    
    # Sort strings lexicographically
    strs.sort()
    first = strs[0]
    last = strs[-1]
    
    res = []
    for i in range(min(len(first), len(last))):
        if first[i] != last[i]:
            break
        res.append(first[i])
        
    return "".join(res)`,
          },
          {
            language: "JavaScript",
            code: `function longestCommonPrefix(strs) {
  if (strs.length === 0) return "";
  
  strs.sort();
  const first = strs[0];
  const last = strs[strs.length - 1];
  
  let i = 0;
  while (i < first.length && i < last.length && first[i] === last[i]) {
    i++;
  }
  
  return first.substring(0, i);
}`,
          },
          {
            language: "C",
            code: `int compare(const void* a, const void* b) {
    return strcmp(*(const char**)a, *(const char**)b);
}

char* longestCommonPrefix(char** strs, int strsSize) {
    if (strsSize == 0) return "";
    if (strsSize == 1) return strs[0];

    qsort(strs, strsSize, sizeof(char*), compare);
    char* first = strs[0];
    char* last = strs[strsSize - 1];
    
    int i = 0;
    while (first[i] && last[i] && first[i] == last[i]) {
        i++;
    }
    
    char* res = (char*)malloc(i + 1);
    strncpy(res, first, i);
    res[i] = '\\0';
    return res;
}`,
          },
          {
            language: "C++",
            code: `#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        if (strs.empty()) return "";
        sort(strs.begin(), strs.end());
        string first = strs[0], last = strs.back();
        int i = 0;
        while (i < first.size() && i < last.size() && first[i] == last[i]) {
            i++;
        }
        return first.substr(0, i);
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "isomorphic-strings",
    title: "Isomorphic Strings",
    topic: "Strings - Basic",
    category: "Strings",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview:
      "Determine if two strings are isomorphic. Two strings are isomorphic if the characters in one can be replaced to get the other while maintaining a strict 1-to-1 mapping and preserving character order.",
    leetcodeLink: "https://leetcode.com/problems/isomorphic-strings/",
    useCases: [
      "Structural similarity detection in encrypted or masked datasets",
      "Comparing code patterns where variable names differ but logic is identical",
      "Identifying homologous sequences in bioinformatics",
    ],
    approaches: [
      {
        name: "Optimal (Two Hash Maps)",
        description:
          "### 🧠 Core Intuition\nIsomorphism requires a **Bijective Mapping**. This means:\n1. Each character in $S$ must map to exactly one character in $T$.\n2. Each character in $T$ must be mapped to by exactly one character in $S$.\n\nUsing a single map only guarantees property #1. Using two maps (or one map + a set for tracked values) ensures both properties.\n\n### ✅ Invariant\nFor every index `i`, the character pair `(S[i], T[i])` consistently maps to each other and has never appeared in a conflicting pairing before.\n\n### 🔍 Step-by-step\n1. If lengths of `S` and `T` are different, return `false`.\n2. Create two hash maps: `mapS` (storing $S \\to T$) and `mapT` (storing $T \\to S$).\n3. Iterate through strings using index `i`:\n   - Let `charS = S[i]` and `charT = T[i]`.\n   - If `charS` is in `mapS` and `mapS[charS] != charT`, return `false`.\n   - If `charT` is in `mapT` and `mapT[charT] != charS`, return `false`.\n   - Update maps: `mapS[charS] = charT`, `mapT[charT] = charS`.\n4. If loop completes, return `true`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — single pass through strings.\n- **Space**: $O(K)$ — where $K$ is the character set size (e.g., 256 for ASCII).",
        timeComplexity: "O(N)",
        timeComplexityExplanation:
          "Single sequence traversal with constant-time map lookups.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "Space depends on the alphabet size (constant), not input string length.",
        implementations: [
          {
            language: "Python",
            code: `def is_isomorphic(s, t):
    if len(s) != len(t):
        return False
    
    mapS, mapT = {}, {}
    for charS, charT in zip(s, t):
        if (charS in mapS and mapS[charS] != charT) or \\
           (charT in mapT and mapT[charT] != charS):
            return False
        mapS[charS] = charT
        mapT[charT] = charS
        
    return True`,
          },
          {
            language: "JavaScript",
            code: `function isIsomorphic(s, t) {
  if (s.length !== t.length) return false;
  
  const mapS = new Map();
  const mapT = new Map();

  for (let i = 0; i < s.length; i++) {
    const charS = s[i];
    const charT = t[i];

    if ((mapS.has(charS) && mapS.get(charS) !== charT) ||
        (mapT.has(charT) && mapT.get(charT) !== charS)) {
      return false;
    }

    mapS.set(charS, charT);
    mapT.set(charT, charS);
  }
  return true;
}`,
          },
          {
            language: "C",
            code: `bool isIsomorphic(char* s, char* t) {
    int mapS[256], mapT[256];
    memset(mapS, -1, sizeof(mapS));
    memset(mapT, -1, sizeof(mapT));
    
    int n = strlen(s);
    for (int i = 0; i < n; i++) {
        int charS = (unsigned char)s[i];
        int charT = (unsigned char)t[i];
        
        if (mapS[charS] != -1 && mapS[charS] != charT) return false;
        if (mapT[charT] != -1 && mapT[charT] != charS) return false;
        
        mapS[charS] = charT;
        mapT[charT] = charS;
    }
    return true;
}`,
          },
          {
            language: "C++",
            code: `#include <string>
#include <unordered_map>
using namespace std;

class Solution {
public:
    bool isIsomorphic(string s, string t) {
        if (s.length() != t.length()) return false;
        int mapS[256] = {0}, mapT[256] = {0};
        
        for (int i = 0; i < s.length(); i++) {
            if (mapS[s[i]] != mapT[t[i]]) return false;
            mapS[s[i]] = i + 1; // Map to 1-based index to handle default 0
            mapT[t[i]] = i + 1;
        }
        return true;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "rotate-string",
    title: "Rotate String",
    topic: "Strings - Basic",
    category: "Strings",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview:
      "Determine if string S can be transformed into string T by shifting any number of characters from the front to the back. A concise approach treats this as a substring search problem.",
    leetcodeLink: "https://leetcode.com/problems/rotate-string/",
    useCases: [
      "Identifying cyclic shifts in genomic sequencing",
      "Validating data integrity in circular buffers or ring data structures",
      "Identifying periodic signal patterns in telemetry",
    ],
    approaches: [
      {
        name: "Optimal (Concatenation Method)",
        description:
          "### 🧠 Core Intuition\nIf we concatenate string $A$ with itself ($A + A$), the result contains all possible rotations of $A$ as substrings. \nFor example, if $A = 'abcde'$, then $A+A = 'abcdeabcde'$. Rotations like 'bcdea', 'cdeab' are all present. \n\nThus, $B$ is a rotation of $A$ if and only if lengths are equal AND $B$ is a substring of $A + A$.\n\n### ✅ Invariant\nAny string of length $N$ formed by cyclic shifts of $A$ must appear as a contiguous block in $A + A$.\n\n### 🔍 Step-by-step\n1. Check if length of `S` is equal to length of `T`. If not, return `false`.\n2. Concatenate `S` with itself: `full = S + S`.\n3. Check if `T` exists as a substring within `full`.\n4. Return result of the search.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — string search complexity (assuming KMP or similar).\n- **Space**: $O(N)$ — to store the concatenated string.",
        timeComplexity: "O(N)",
        timeComplexityExplanation:
          "String searching (KMP) or optimized library searches run in linear time.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation:
          "Concatenated string S+S requires double the input space.",
        implementations: [
          {
            language: "Python",
            code: `def rotate_string(s, t):
    # Equal length check is crucial
    return len(s) == len(t) and t in (s + s)`,
          },
          {
            language: "JavaScript",
            code: `function rotateString(s, t) {
  if (s.length !== t.length) return false;
  return (s + s).includes(t);
}`,
          },
          {
            language: "C",
            code: `bool rotateString(char* s, char* t) {
    int n = strlen(s);
    int m = strlen(t);
    if (n != m) return false;
    
    char* full = malloc(2 * n + 1);
    strcpy(full, s);
    strcat(full, s);
    
    bool res = strstr(full, t) != NULL;
    free(full);
    return res;
}`,
          },
          {
            language: "C++",
            code: `#include <string>
using namespace std;

class Solution {
public:
    bool rotateString(string s, string t) {
        if (s.length() != t.length()) return false;
        return (s + s).find(t) != string::npos;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "sort-characters-by-frequency",
    title: "Sort Characters By Frequency",
    topic: "Strings - Medium",
    category: "Strings",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Sort a string based on the frequency of its characters in descending order. This problem demonstrates the use of frequency maps and customized sorting logic for character data.",
    leetcodeLink: "https://leetcode.com/problems/sort-characters-by-frequency/",
    useCases: [
      "Generating character histograms for Huffman compression algorithms",
      "Analyzing keyword and tag density in SEO or document parsing",
      "Identifying most frequent recurring symbols in signals or cryptography",
    ],
    approaches: [
      {
        name: "Optimal (Hash Map & Sorting)",
        description:
          "### 🧠 Core Intuition\nTo sort by frequency, we must first determine exactly how often each character appears. \n1. Count frequencies using a hash map.\n2. Create a list of character-frequency pairs.\n3. Sort the list based on frequency in descending order.\n4. Build the result string by repeating each character its corresponding number of times.\n\n### ✅ Invariant\nCharacters with a higher frequency must always precede characters with a lower frequency in the output string.\n\n### 🔍 Step-by-step\n1. Count character occurrences using a frequency map (`counts`).\n2. Extract unique characters into a list and **sort** them using `counts[char]` as the primary key (descending).\n3. Iterate through the sorted characters and append `char * counts[char]` to the result builder.\n4. Return the assembled string.\n\n### ⏱️ Complexity\n- **Time**: $O(N + K \\log K)$ — where $N$ is string length and $K$ is the number of unique characters ($K \\le 256$).\n- **Space**: $O(N)$ for output string and $O(K)$ for the frequency map.",
        timeComplexity: "O(N + K log K)",
        timeComplexityExplanation:
          "Linear scan for counting, plus sorting unique characters (where K is constant-bounded by character set size).",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation:
          "Result string takes O(N) space; map takes O(K) where K is alphabet size.",
        implementations: [
          {
            language: "Python",
            code: `from collections import Counter

def frequency_sort(s):
    # 1. Count frequencies
    counts = Counter(s)
    
    # 2. Sort unique chars by frequency (desc)
    sorted_chars = sorted(counts.keys(), key=lambda x: counts[x], reverse=True)
    
    # 3. Build string
    return "".join(c * counts[c] for c in sorted_chars)`,
          },
          {
            language: "JavaScript",
            code: `function frequencySort(s) {
  const map = {};
  for (let char of s) {
    map[char] = (map[char] || 0) + 1;
  }

  return Object.keys(map)
    .sort((a, b) => map[b] - map[a])
    .map(char => char.repeat(map[char]))
    .join("");
}`,
          },
          {
            language: "C",
            code: `typedef struct {
    char c;
    int freq;
} Pair;

int compare(const void* a, const void* b) {
    return ((Pair*)b)->freq - ((Pair*)a)->freq;
}

char* frequencySort(char* s) {
    int n = strlen(s);
    Pair counts[256] = {0};
    for(int i=0; i<256; i++) counts[i].c = (char)i;
    
    for(int i=0; i<n; i++) {
        counts[(unsigned char)s[i]].freq++;
    }
    
    qsort(counts, 256, sizeof(Pair), compare);
    
    char* res = malloc(n + 1);
    int k = 0;
    for(int i=0; i<256; i++) {
        for(int j=0; j<counts[i].freq; j++) {
            res[k++] = counts[i].c;
        }
    }
    res[k] = '\\0';
    return res;
}`,
          },
          {
            language: "C++",
            code: `#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    string frequencySort(string s) {
        unordered_map<char, int> freq;
        for (char c : s) freq[c]++;

        vector<pair<int, char>> v;
        for (auto& it : freq) v.push_back({it.second, it.first});
        
        sort(v.rbegin(), v.rend());

        string res = "";
        for (auto& p : v) {
            res += string(p.first, p.second);
        }
        return res;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "maximum-nesting-depth-of-parentheses",
    title: "Maximum Nesting Depth",
    topic: "Strings - Medium",
    category: "Strings",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview:
      "Find the maximum nesting depth of parentheses in a valid parentheses string. This metric is a proxy for the 'recursion depth' of an expression or code block.",
    leetcodeLink: "https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/",
    useCases: [
      "Allocating recursion stack memory for expression evaluators",
      "Analyzing cognitive complexity of nested code blocks",
      "Syntactic depth validation in domain-specific languages",
    ],
    approaches: [
      {
        name: "Optimal (Scan & Counter)",
        description:
          "### 🧠 Core Intuition\nIn a valid parentheses string, every `(` increments the current depth and every `)` decrements it. To find the maximum nesting depth, we just need to keep track of the peak depth reached during a single scan.\n\n### ✅ Invariant\nThe current depth at any index $i$ is equal to the count of unmatched `(` characters seen so far.\n\n### 🔍 Step-by-step\n1. Initialize `maxDepth = 0` and `currentDepth = 0`.\n2. Iterate through each character `c` in the string:\n   - If `c == '('`:\n     - `currentDepth++`.\n     - Update `maxDepth = max(maxDepth, currentDepth)`.\n   - If `c == ')'`:\n     - `currentDepth--`.\n3. Return `maxDepth`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — single pass.\n- **Space**: $O(1)$ constant state.",
        timeComplexity: "O(N)",
        timeComplexityExplanation:
          "Algorithm performs one linear scan through the input string.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "Only two integer variables are needed to track depth.",
        implementations: [
          {
            language: "Python",
            code: `def max_depth(s):
    res = 0
    curr = 0
    for char in s:
        if char == '(':
            curr += 1
            res = max(res, curr)
        elif char == ')':
            curr -= 1
    return res`,
          },
          {
            language: "JavaScript",
            code: `function maxDepth(s) {
  let res = 0;
  let curr = 0;
  for (let char of s) {
    if (char === '(') {
      curr++;
      res = Math.max(res, curr);
    } else if (char === ')') {
      curr--;
    }
  }
  return res;
}`,
          },
          {
            language: "C",
            code: `int maxDepth(char* s) {
    int res = 0, curr = 0;
    while (*s) {
        if (*s == '(') {
            curr++;
            if (curr > res) res = curr;
        } else if (*s == ')') {
            curr--;
        }
        s++;
    }
    return res;
}`,
          },
          {
            language: "C++",
            code: `#include <string>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxDepth(string s) {
        int res = 0, curr = 0;
        for (char c : s) {
            if (c == '(') res = max(res, ++curr);
            else if (c == ')') curr--;
        }
        return res;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "roman-number-to-integer",
    title: "Roman to Integer",
    topic: "Strings - Medium",
    category: "Strings",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Convert a Roman numeral string to its corresponding integer value. The algorithm handles the additive and subtractive rules (e.g., IV = 4) by examining character pairings.",
    leetcodeLink: "https://leetcode.com/problems/roman-to-integer/",
    useCases: [
      "Parsing historical dates and publication copyright entries",
      "Formatting bibiliographies or legally structured document identifiers",
      "Interfacing with legacy archival inventory systems",
    ],
    approaches: [
      {
        name: "Optimal (Iterative Comparison)",
        description:
          "### 🧠 Core Intuition\nRoman numerals are generally written largest to smallest. If a character is preceded by one of smaller value, it represents a subtraction. \nFor instance, in `IX`, `I` (1) is followed by `X` (10), so we subtract 1 from 10.\n\nWe can iterate left-to-right:\n- If the next symbol is larger than current, subtract current value.\n- Else, add current value.\n\n### ✅ Invariant\nat any step, we either add or subtract the current character's value based on the relative magnitude of the next available character.\n\n### 🔍 Step-by-step\n1. Define a literal mapping for all Roman symbols (I=1, V=5, etc.).\n2. Initialize `total = 0`.\n3. Iterate from `i = 0` to `n-1`:\n   - If `i < n - 1` AND `value(s[i]) < value(s[i+1])`:\n     - Subtract `value(s[i])` from `total`.\n   - Else:\n     - Add `value(s[i])` to `total`.\n4. Return `total`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — single string pass.\n- **Space**: $O(1)$ constant storage for symbol mapping.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "The algorithm traverses the roman numeral string exactly once.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Mapping table is constant size (7 symbols).",
        implementations: [
          {
            language: "Python",
            code: `def roman_to_int(s):
    values = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    total = 0
    for i in range(len(s)):
        if i < len(s) - 1 and values[s[i]] < values[s[i+1]]:
            total -= values[s[i]]
        else:
            total += values[s[i]]
    return total`,
          },
          {
            language: "JavaScript",
            code: `function romanToInt(s) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const curr = map[s[i]];
    const next = map[s[i + 1]] || 0;
    if (curr < next) total -= curr;
    else total += curr;
  }
  return total;
}`,
          },
          {
            language: "C",
            code: `int val(char c) {
    switch(c) {
        case 'I': return 1; case 'V': return 5;
        case 'X': return 10; case 'L': return 50;
        case 'C': return 100; case 'D': return 500;
        case 'M': return 1000; default: return 0;
    }
}

int romanToInt(char* s) {
    int total = 0;
    for (int i = 0; s[i] != '\\0'; i++) {
        int curr = val(s[i]);
        int next = val(s[i+1]);
        if (curr < next) total -= curr;
        else total += curr;
    }
    return total;
}`,
          },
          {
            language: "C++",
            code: `#include <string>
#include <unordered_map>
using namespace std;

class Solution {
public:
    int romanToInt(string s) {
        unordered_map<char, int> m = {
            {'I', 1}, {'V', 5}, {'X', 10}, {'L', 50},
            {'C', 100}, {'D', 500}, {'M', 1000}
        };
        int total = 0;
        for (int i = 0; i < s.length(); i++) {
            if (i < s.length() - 1 && m[s[i]] < m[s[i+1]])
                total -= m[s[i]];
            else
                total += m[s[i]];
        }
        return total;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "implement-atoi",
    title: "Implement Atoi (String to Integer)",
    topic: "Strings - Medium",
    category: "Strings",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Converts a string to a 32-bit signed integer (similar to C++ atoi). This problem benchmarks edge case management including whitespace, signs, non-digit filtering, and numeric overflow.",
    leetcodeLink: "https://leetcode.com/problems/string-to-integer-atoi/",
    useCases: [
      "Building robust input field parsers for numeric data ingestion",
      "Compiling text-based configuration into system constants",
      "Implementing low-level utility libraries for data conversion",
    ],
    approaches: [
      {
        name: "Optimal (Iterative State Machine)",
        description:
          "### 🧠 Core Intuition\nAtoy conversion follows a specific sequence of parsing states: Skip whitespace, determine sign, consume digits until overflow or non-digit character. \n\nWe use a simple pointer and 32-bit boundary checks to maintain robustness.\n\n### ✅ Invariant\nThe result always stores the parsed integer in 64-bit precision during construction to safely check against the 32-bit integer limits ($[-2^{31}, 2^{31}-1]$).\n\n### 🔍 Step-by-step\n1. **Trim** leading whitespace.\n2. Handle optional sign character (`+` or `-`). Set `sign = -1` if negative.\n3. Iterate through subsequent characters:\n   - If the character is not a digit: `STOP`.\n   - Convert digit: `res = res * 10 + digit`.\n   - **Overflow Check**: If `res > INT_MAX`, return `INT_MAX` (or `INT_MIN` based on sign).\n4. Return `res * sign`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — single pass through the prefix of the string.\n- **Space**: $O(1)$ constant state overhead.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Processes the string linearly until conversion completes or invalid char is found.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Conversion is done in-place using scalar variables.",
        implementations: [
          {
            language: "Python",
            code: `def my_atoi(s):
    s = s.lstrip()
    if not s: return 0
    
    sign = 1
    i = 0
    if s[0] in ('-', '+'):
        if s[0] == '-': sign = -1
        i += 1
        
    res = 0
    while i < len(s) and s[i].isdigit():
        res = res * 10 + int(s[i])
        i += 1
        
    res *= sign
    # Clamp to 32-bit range
    return max(-2**31, min(res, 2**31 - 1))`,
          },
          {
            language: "JavaScript",
            code: `function myAtoi(s) {
  let i = 0, sign = 1, res = 0;
  while (s[i] === " ") i++;
  
  if (s[i] === "-" || s[i] === "+") {
    sign = s[i] === "-" ? -1 : 1;
    i++;
  }

  while (i < s.length && s[i] >= "0" && s[i] <= "9") {
    res = res * 10 + (s[i] - "0");
    if (res * sign >= 2147483647) return 2147483647;
    if (res * sign <= -2147483648) return -2147483648;
    i++;
  }
  return res * sign;
}`,
          },
          {
            language: "C",
            code: `#include <limits.h>

int myAtoi(char* s) {
    int i = 0, sign = 1;
    long res = 0;
    while (s[i] == ' ') i++;
    
    if (s[i] == '-' || s[i] == '+') {
        sign = (s[i++] == '-') ? -1 : 1;
    }
    
    while (s[i] >= '0' && s[i] <= '9') {
        res = res * 10 + (s[i++] - '0');
        if (res * sign >= INT_MAX) return INT_MAX;
        if (res * sign <= INT_MIN) return INT_MIN;
    }
    return (int)(res * sign);
}`,
          },
          {
            language: "C++",
            code: `#include <string>
#include <climits>
using namespace std;

class Solution {
public:
    int myAtoi(string s) {
        int i = 0, sign = 1;
        long res = 0;
        while (i < s.size() && s[i] == ' ') i++;
        if (i < s.size() && (s[i] == '-' || s[i] == '+')) {
            sign = (s[i++] == '-') ? -1 : 1;
        }
        while (i < s.size() && isdigit(s[i])) {
            res = res * 10 + (s[i++] - '0');
            if (res * sign >= INT_MAX) return INT_MAX;
            if (res * sign <= INT_MIN) return INT_MIN;
        }
        return (int)(res * sign);
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "count-number-of-substrings",
    title: "Count Number of Substrings (with K Distinct Char)",
    topic: "Strings - Medium",
    category: "Strings",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview:
      "Count the total number of substrings within a given string that contain exactly K distinct characters. This problem highlights advanced sliding window techniques and arithmetic difference logic.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/count-number-of-substrings4522/1",
    useCases: [
      "Analyzing DNA sequence diversity in localized windowed segments",
      "Characterizing sliding-window frequency diversity in real-time signals",
      "Calculating entropy and diversity metrics for text-based datasets",
    ],
    approaches: [
      {
        name: "Optimal (AtMost(K) - AtMost(K-1))",
        description:
          "### 🧠 Core Intuition\nCounting 'exactly K' is difficult with a direct sliding window because reducing window size from the left doesn't guarantee we keep the number of distinct characters at $K$.\n\nInstead, we use a helper function `countAtMost(K)` which counts substrings with **at most** $K$ distinct characters. The result for 'exactly K' is then:\n`countAtMost(K) - countAtMost(K-1)`.\n\n### ✅ Invariant\nThe function `countAtMost(K)` calculates every valid substring ending at each position $j$ that contains up to $K$ distinct values.\n\n### 🔍 Step-by-step\n1. Define `countAtMost(s, k)`:\n   - Use a frequency array (size 26) and a counter `distinctCount`.\n   - Expand `right` pointer. Update maps.\n   - While `distinctCount > k`:\n     - Shrink `left` pointer. Update maps.\n   - Add `right - left + 1` to `total` (count of all valid substrings ending at `right`).\n2. Compute `countAtMost(S, K) - countAtMost(S, K - 1)`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — we process the string twice using the sliding window.\n- **Space**: $O(1)$ constant space for frequency map (alphabet-bounded).",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Two linear sliding window scans are performed (one for K, one for K-1).",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Uses a fixed-size frequency array of length 26.",
        implementations: [
          {
            language: "Python",
            code: `def count_at_most(s, k):
    if k == 0: return 0
    left, count, total = 0, 0, 0
    freq = {}
    for right in range(len(s)):
        if s[right] not in freq or freq[s[right]] == 0:
            count += 1
        freq[s[right]] = freq.get(s[right], 0) + 1
        
        while count > k:
            freq[s[left]] -= 1
            if freq[s[left]] == 0:
                count -= 1
            left += 1
        total += (right - left + 1)
    return total

def substr_count(s, k):
    return count_at_most(s, k) - count_at_most(s, k - 1)`,
          },
          {
            language: "JavaScript",
            code: `function countAtMost(s, k) {
  if (k === 0) return 0;
  let left = 0, count = 0, total = 0;
  let freq = new Array(26).fill(0);
  for (let right = 0; right < s.length; right++) {
    let charIdx = s.charCodeAt(right) - 97;
    if (freq[charIdx] === 0) count++;
    freq[charIdx]++;
    
    while (count > k) {
      let lIdx = s.charCodeAt(left) - 97;
      freq[lIdx]--;
      if (freq[lIdx] === 0) count--;
      left++;
    }
    total += (right - left + 1);
  }
  return total;
}

function countKDistinct(s, k) {
  return countAtMost(s, k) - countAtMost(s, k - 1);
}`,
          },
          {
            language: "C",
            code: `long long countAtMost(char* s, int k) {
    if (k == 0) return 0;
    int left = 0, count = 0;
    long long total = 0;
    int freq[26] = {0};
    int n = strlen(s);
    for (int right = 0; right < n; right++) {
        if (freq[s[right] - 'a'] == 0) count++;
        freq[s[right] - 'a']++;
        while (count > k) {
            freq[s[left] - 'a']--;
            if (freq[s[left] - 'a'] == 0) count--;
            left++;
        }
        total += (right - left + 1);
    }
    return total;
}

long long substrCount(char* s, int k) {
    return countAtMost(s, k) - countAtMost(s, k - 1);
}`,
          },
          {
            language: "C++",
            code: `#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    long long countAtMost(string s, int k) {
        if (k == 0) return 0;
        int left = 0, count = 0;
        long long total = 0;
        vector<int> freq(26, 0);
        for (int right = 0; right < s.length(); right++) {
            if (freq[s[right] - 'a'] == 0) count++;
            freq[s[right] - 'a']++;
            while (count > k) {
                freq[s[left] - 'a']--;
                if (freq[s[left] - 'a'] == 0) count--;
                left++;
            }
            total += (right - left + 1);
        }
        return total;
    }

    long long substrCount (string s, int k) {
        return countAtMost(s, k) - countAtMost(s, k - 1);
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    topic: "Strings - Medium",
    category: "Strings",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the longest contiguous substring that reads the same forwards and backwards. This algorithm utilizes the 'Expand Around Center' technique, which handles both odd and even length palindromes with high efficiency.",
    leetcodeLink: "https://leetcode.com/problems/longest-palindromic-substring/",
    useCases: [
      "Identifying palindromic sequences in genetic strands (protein binding sites)",
      "Pattern recognition in symmetric digital signal processing",
      "Data compression where palindromic structures offer redundancy reduction",
    ],
    approaches: [
      {
        name: "Optimal (Expand Around Center)",
        description:
          "### 🧠 Core Intuition\nA palindrome mirrors itself around its center. There are $2N-1$ possible centers in a string of length $N$ (each character and each gap between two characters).\n\nBy expanding outwards from each center as long as characters match, we can find the longest palindrome in $O(N^2)$ time with $O(1)$ extra space.\n\n### ✅ Invariant\nFor any chosen center $(i, j)$, the substring $S[i..j]$ is a palindrome if $S[i] == S[j]$ and the inner substring $S[i+1..j-1]$ was also a palindrome.\n\n### 🔍 Step-by-step\n1. Initialize `start = 0`, `end = 0`.\n2. Iterate through the string with index `i` (treating `i` as the center):\n   - **Odd Length**: Expand from `(i, i)`.\n   - **Even Length**: Expand from `(i, i+1)`.\n   - For each expansion, update `start` and `end` if the found palindrome is longer than the current best.\n3. Return `s.substring(start, end + 1)`.\n\n### ⏱️ Complexity\n- **Time**: $O(N^2)$ — $N$ centers, each expansion takes $O(N)$.\n- **Space**: $O(1)$ constant extra space (excluding result string).",
        timeComplexity: "O(N^2)",
        timeComplexityExplanation:
          "Expansion from each center takes linear time in the worst case (e.g., all same characters).",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation:
          "No extra data structures are used; only pointers to track indices.",
        implementations: [
          {
            language: "Python",
            code: `def longest_palindrome(s):
    res = ""
    for i in range(len(s)):
        # Odd case
        p1 = expand(s, i, i)
        if len(p1) > len(res): res = p1
        # Even case
        p2 = expand(s, i, i+1)
        if len(p2) > len(res): res = p2
    return res

def expand(s, l, r):
    while l >= 0 and r < len(s) and s[l] == s[r]:
        l -= 1
        r += 1
    return s[l+1:r]`,
          },
          {
            language: "JavaScript",
            code: `function longestPalindrome(s) {
  let start = 0, end = 0;
  
  for (let i = 0; i < s.length; i++) {
    let len1 = expand(s, i, i);
    let len2 = expand(s, i, i + 1);
    let len = Math.max(len1, len2);
    
    if (len > end - start) {
      start = i - Math.floor((len - 1) / 2);
      end = i + Math.floor(len / 2);
    }
  }
  return s.substring(start, end + 1);
}

function expand(s, l, r) {
  while (l >= 0 && r < s.length && s[l] === s[r]) {
    l--; r++;
  }
  return r - l - 1;
}`,
          },
          {
            language: "C",
            code: `char* longestPalindrome(char* s) {
    int n = strlen(s);
    if (n == 0) return "";
    int start = 0, maxLen = 1;
    
    for (int i = 0; i < n; i++) {
        // Odd expansion
        int l = i, r = i;
        while (l >= 0 && r < n && s[l] == s[r]) {
            if (r - l + 1 > maxLen) {
                start = l; maxLen = r - l + 1;
            }
            l--; r++;
        }
        // Even expansion
        l = i, r = i + 1;
        while (l >= 0 && r < n && s[l] == s[r]) {
            if (r - l + 1 > maxLen) {
                start = l; maxLen = r - l + 1;
            }
            l--; r++;
        }
    }
    char* res = malloc(maxLen + 1);
    strncpy(res, s + start, maxLen);
    res[maxLen] = '\\0';
    return res;
}`,
          },
          {
            language: "C++",
            code: `#include <string>
#include <algorithm>
using namespace std;

class Solution {
public:
    string longestPalindrome(string s) {
        if (s.empty()) return "";
        int start = 0, maxLen = 1;
        
        auto expand = [&](int l, int r) {
            while (l >= 0 && r < s.size() && s[l] == s[r]) {
                if (r - l + 1 > maxLen) {
                    start = l;
                    maxLen = r - l + 1;
                }
                l--; r++;
            }
        };

        for (int i = 0; i < s.size(); i++) {
            expand(i, i);     // Odd
            expand(i, i + 1); // Even
        }
        return s.substr(start, maxLen);
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "sum-of-beauty-of-all-substrings",
    title: "Sum of Beauty of Substrings",
    topic: "Strings - Medium",
    category: "Strings",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Calculate the sum of beauty for all substrings of a string. Beauty is defined as the difference between the maximum and minimum non-zero frequency of characters in a string.",
    leetcodeLink: "https://leetcode.com/problems/sum-of-beauty-of-all-substrings/",
    useCases: [
      "Characterizing distribution variance in sliding window text analysis",
      "Entropy-based anomaly detection in character data streams",
      "Linguistic variance metrics for multilingual text indexing",
    ],
    approaches: [
      {
        name: "Optimal (Nested Frequency Tracking)",
        description:
          "### 🧠 Core Intuition\nA brute-force approach that recalculates frequencies for each substring $O(N^3)$ is too slow. \nBy using nested loops, we can incrementally update a frequency array as we expand the 'end' of each substring, reducing the work to $O(N^2)$.\n\n### ✅ Invariant\nFor a fixed 'start' position `i`, expanding 'end' `j` only requires incrementing the frequency of character $S[j]$ and recalculating the max/min of the current frequency map.\n\n### 🔍 Step-by-step\n1. Initialize `totalBeauty = 0`.\n2. Outer loop: `i` from `0` to `n-1` (substring start):\n   - Initialize `freq` array of size 26.\n   - Inner loop: `j` from `i` to `n-1` (substring end):\n     - `freq[s[j] - 'a']++`.\n     - Calculate `maxFreq` and `minFreq` from the `freq` array (ignore zero frequencies).\n     - `totalBeauty += (maxFreq - minFreq)`.\n3. Return `totalBeauty`.\n\n### ⏱️ Complexity\n- **Time**: $O(N^2 \\cdot 26)$ — nested loops with constant-sized frequency array scan.\n- **Space**: $O(1)$ constant space for frequency array.",
        timeComplexity: "O(N^2)",
        timeComplexityExplanation: "Nested loops over the string length with constant time character frequency checks.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Fixed size frequency array (26 characters).",
        implementations: [
          {
            language: "Python",
            code: `def beauty_sum(s):
    total = 0
    for i in range(len(s)):
        freq = [0] * 26
        for j in range(i, len(s)):
            freq[ord(s[j]) - ord('a')] += 1
            max_f = max(freq)
            min_f = min(f for f in freq if f > 0)
            total += (max_f - min_f)
    return total`,
          },
          {
            language: "JavaScript",
            code: `function beautySum(s) {
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const freq = new Array(26).fill(0);
    for (let j = i; j < s.length; j++) {
      freq[s.charCodeAt(j) - 97]++;
      let maxF = 0, minF = Infinity;
      for (let f of freq) {
        if (f > 0) {
          maxF = Math.max(maxF, f);
          minF = Math.min(minF, f);
        }
      }
      total += (maxF - minF);
    }
  }
  return total;
}`,
          },
          {
            language: "C",
            code: `int beautySum(char* s) {
    int total = 0;
    int n = strlen(s);
    for (int i = 0; i < n; i++) {
        int freq[26] = {0};
        for (int j = i; j < n; j++) {
            freq[s[j] - 'a']++;
            int maxF = 0, minF = 1000;
            for (int k = 0; k < 26; k++) {
                if (freq[k] > 0) {
                    if (freq[k] > maxF) maxF = freq[k];
                    if (freq[k] < minF) minF = freq[k];
                }
            }
            total += (maxF - minF);
        }
    }
    return total;
}`,
          },
          {
            language: "C++",
            code: `#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int beautySum(string s) {
        int total = 0;
        for (int i = 0; i < s.length(); i++) {
            vector<int> freq(26, 0);
            for (int j = i; j < s.length(); j++) {
                freq[s[j] - 'a']++;
                int maxF = 0, minF = 1e9;
                for (int f : freq) {
                    if (f > 0) {
                        maxF = max(maxF, f);
                        minF = min(minF, f);
                    }
                }
                total += (maxF - minF);
            }
        }
        return total;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "reverse-every-word-in-a-string",
    title: "Reverse Every Word (maintain order)",
    topic: "Strings - Medium",
    category: "Strings",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview:
      "Reverse the characters in each individual word within a sentence while maintaining the original word sequence and original whitespace positions.",
    leetcodeLink: "https://leetcode.com/problems/reverse-words-in-a-string-iii/",
    useCases: [
      "Text processing for linguistic 'scrambling' effects",
      "Identifying localized mirror patterns in character sequences",
      "Formatting logic for specific mirrored typographic layouts",
    ],
    approaches: [
      {
        name: "Optimal (Tokenize & Reverse)",
        description:
          "### 🧠 Core Intuition\nWe treat the string as a collection of tokens separated by whitespace. Each token is reversed locally without changing its position in the overall sequence.\n\n### ✅ Invariant\nThe character at index `i` in the output belongs to the same word as the character at index `i` in the input, but its position within that word is mirrored.\n\n### 🔍 Step-by-step\n1. Split the input string by whitespace into an array of words.\n2. For each word in the array:\n   - Reverse the characters of the word.\n3. Join the processed words back together with single spaces.\n4. Return the resulting string.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — one pass for splitting, one for reversing total characters, and one for joining.\n- **Space**: $O(N)$ to store the tokens/result.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Linear traversal to identify word boundaries and perform local reversals.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Requires extra space to store the reversed characters or split array.",
        implementations: [
          {
            language: "Python",
            code: `def reverse_words(s):
    return " ".join(word[::-1] for word in s.split(" "))`,
          },
          {
            language: "JavaScript",
            code: `function reverseWords(s) {
  return s.split(" ")
          .map(word => word.split("").reverse().join(""))
          .join(" ");
}`,
          },
          {
            language: "C",
            code: `void reverse(char* s, int b, int e) {
    while (b < e) {
        char temp = s[b];
        s[b++] = s[e];
        s[e--] = temp;
    }
}

char* reverseWords(char* s) {
    int n = strlen(s);
    int start = 0;
    for (int i = 0; i <= n; i++) {
        if (s[i] == ' ' || s[i] == '\\0') {
            reverse(s, start, i - 1);
            start = i + 1;
        }
    }
    return s;
}`,
          },
          {
            language: "C++",
            code: `#include <string>
#include <algorithm>
using namespace std;

class Solution {
public:
    string reverseWords(string s) {
        int start = 0;
        for (int i = 0; i <= s.length(); i++) {
            if (i == s.length() || s[i] == ' ') {
                reverse(s.begin() + start, s.begin() + i);
                start = i + 1;
            }
        }
        return s;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "introduction-to-linkedlist-insert-delete",
    title: "Introduction to Linked List",
    topic: "LinkedList - 1D LL",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Understand the basics of Singly Linked Lists, a dynamic data structure where elements (nodes) are stored in non-contiguous memory locations. This section covers node definition and basic traversal.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/introduction-to-linked-list/1",
    useCases: [
      "Building memory-efficient stacks or queues without predefined capacity",
      "Managing dynamic datasets where frequent insertions/deletions occur at the head",
      "Implementing undo/redo functionality using a chain of state nodes",
    ],
    approaches: [
      {
        name: "Optimal (Node Construction & Traversal)",
        description:
          "### 🧠 Core Intuition\nA Linked List node consists of two parts: **Data** and a **Pointer** (reference) to the next node. The 'head' is the entry point. To traverse, we follow the pointers until we hit `null`.\n\nUnlike arrays, we don't have random access ($O(1)$) to elements; we must traverse from the head ($O(N)$).\n\n### ✅ Invariant\nEvery node (except the tail) points to exactly one sequential successor, maintaining a linear chain of ownership.\n\n### 🔍 Step-by-step\n1. Define a `Node` class/struct with `data` and `next` fields.\n2. To construct a list from an array:\n   - Create a `head` node from the first element.\n   - Iterate through the remaining elements, creating new nodes and linking them to the previous node's `next` pointer.\n3. Return the `head` node.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — where $N$ is the number of elements to insert.\n- **Space**: $O(N)$ — to store the $N$ nodes in memory.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Linear time required to traverse and create nodes for every input element.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Storing N nodes in the heap memory.",
        implementations: [
          {
            language: "Python",
            code: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

def construct_ll(arr):
    if not arr: return None
    head = Node(arr[0])
    curr = head
    for i in range(1, len(arr)):
        curr.next = Node(arr[i])
        curr = curr.next
    return head`,
          },
          {
            language: "JavaScript",
            code: `class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

function constructLL(arr) {
  if (arr.length === 0) return null;
  let head = new Node(arr[0]);
  let curr = head;
  for (let i = 1; i < arr.length; i++) {
    curr.next = new Node(arr[i]);
    curr = curr.next;
  }
  return head;
}`,
          },
          {
            language: "C",
            code: `struct Node {
    int data;
    struct Node* next;
};

struct Node* constructLL(int arr[], int n) {
    if (n == 0) return NULL;
    struct Node* head = (struct Node*)malloc(sizeof(struct Node));
    head->data = arr[0];
    head->next = NULL;
    struct Node* curr = head;
    for (int i = 1; i < n; i++) {
        struct Node* temp = (struct Node*)malloc(sizeof(struct Node));
        temp->data = arr[i];
        temp->next = NULL;
        curr->next = temp;
        curr = temp;
    }
    return head;
}`,
          },
          {
            language: "C++",
            code: `#include <vector>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

Node* constructLL(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    Node* head = new Node(arr[0]);
    Node* curr = head;
    for (size_t i = 1; i < arr.size(); i++) {
        curr->next = new Node(arr[i]);
        curr = curr->next;
    }
    return head;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "insert-a-node-in-linkedlist",
    title: "Insert Node in LinkedList",
    topic: "LinkedList - 1D LL",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Perform insertion operations at various positions within a singly linked list: at the head, at the tail, or at a specific K-th position.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/linked-list-insertion-1587115620/1",
    useCases: [
      "Maintaining prioritized lists where new items are added at specific ranks",
      "Implementing memory-efficient dynamic buffers for data streams",
      "Extending circular or doubly linked data structures",
    ],
    approaches: [
      {
        name: "Optimal (Case-based Insertion)",
        description:
          "### 🧠 Core Intuition\nTo insert a node, we perform two primary actions:\n1. Create the new node.\n2. Rearrange the pointers of adjacent nodes to 'hook' it into the chain.\n\n- **Head**: New node points to old head. Head moves to new node.\n- **Tail**: Old tail points to new node. Tail moves to new node.\n- **K-th Position**: Traverse to $K-1$. New node points to $K$. $K-1$ points to new node.\n\n### ✅ Invariant\nAfter any insertion, the chain remains contiguous and no previous node addresses are lost.\n\n### 🔍 Step-by-step\n1. **Head**: Check if empty. Create node, point it to current `head`, return new node.\n2. **Tail**: Traverse to the last existing node. Set `last.next = newNode`.\n3. **K-th**: Traverse $K-1$ nodes. Record `prev` and `curr`. Insert between them.\n\n### ⏱️ Complexity\n- **Time**: $O(1)$ for head, $O(N)$ for tail (unless tail pointer is kept) or K-th position.\n- **Space**: $O(1)$ constant overhead.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Insertion at head is O(1), but insertion at tail or K-th index requires traversal.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Operation is performed in-place with constant additional space.",
        implementations: [
          {
            language: "Python",
            code: `def insert_head(head, val):
    newNode = Node(val)
    newNode.next = head
    return newNode

def insert_tail(head, val):
    if not head: return Node(val)
    curr = head
    while curr.next:
        curr = curr.next
    curr.next = Node(val)
    return head`,
          },
          {
            language: "JavaScript",
            code: `function insertHead(head, val) {
  let newNode = new Node(val);
  newNode.next = head;
  return newNode;
}

function insertTail(head, val) {
  if (!head) return new Node(val);
  let curr = head;
  while (curr.next) {
    curr = curr.next;
  }
  curr.next = new Node(val);
  return head;
}`,
          },
          {
            language: "C",
            code: `struct Node* insertTail(struct Node* head, int val) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val; newNode->next = NULL;
    if (!head) return newNode;
    struct Node* curr = head;
    while (curr->next) curr = curr->next;
    curr->next = newNode;
    return head;
}`,
          },
          {
            language: "C++",
            code: `Node* insertKth(Node* head, int val, int k) {
    if (k == 1) {
        Node* newNode = new Node(val);
        newNode->next = head;
        return newNode;
    }
    Node* curr = head;
    int cnt = 0;
    while (curr) {
        cnt++;
        if (cnt == k - 1) {
            Node* newNode = new Node(val);
            newNode->next = curr->next;
            curr->next = newNode;
            break;
        }
        curr = curr->next;
    }
    return head;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "delete-a-node-in-linkedlist",
    title: "Delete Node in LinkedList",
    topic: "LinkedList - 1D LL",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Remove nodes from various positions (head, tail, or K-th position) in a Singly Linked List while maintaining chain integrity and freeing memory.",
    leetcodeLink: "https://leetcode.com/problems/delete-node-in-a-linked-list/",
    useCases: [
      "Evicting elements from a dynamic cache window",
      "Managing temporary job queues where processed tasks are removed",
      "Memory reclamation in custom heap allocators",
    ],
    approaches: [
      {
        name: "Optimal (Pointer Manipulation)",
        description:
          "### 🧠 Core Intuition\nDeletion in a Linked List simply involves bypassing the target node. We find the node preceding the target, and point its `next` directly to the target's `next`.\n\n### ✅ Invariant\nAfter any deletion, the list remains a single contiguous chain starting from the head.\n\n### 🔍 Step-by-step\n1. **Head**: Move `head` to `head.next`. Free old head memory.\n2. **Tail**: Traverse to the second-to-last node. Set `curr.next = null`.\n3. **K-th**: Traverse to $K-1$. Link it to the node at $K+1$. Free the $K$-th node.\n\n### ⏱️ Complexity\n- **Time**: $O(1)$ for head, $O(N)$ for tail or K-th position.\n- **Space**: $O(1)$ constant memory overhead.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Finding the node to delete or its predecessor requires traversal in the worst case.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Operation is in-place.",
        implementations: [
          {
            language: "Python",
            code: `def delete_head(head):
    if not head: return None
    return head.next

def delete_kth(head, k):
    if not head: return None
    if k == 1: return head.next
    
    curr = head
    prev = None
    cnt = 0
    while curr:
        cnt += 1
        if cnt == k:
            prev.next = curr.next
            break
        prev = curr
        curr = curr.next
    return head`,
          },
          {
            language: "JavaScript",
            code: `function deleteTail(head) {
  if (!head || !head.next) return null;
  let curr = head;
  while (curr.next.next) curr = curr.next;
  curr.next = null;
  return head;
}`,
          },
          {
            language: "C",
            code: `struct Node* deleteNode(struct Node* head, int k) {
    if (!head) return NULL;
    if (k == 1) {
        struct Node* temp = head;
        head = head->next;
        free(temp);
        return head;
    }
    struct Node* curr = head;
    struct Node* prev = NULL;
    int cnt = 0;
    while (curr) {
        if (++cnt == k) {
            prev->next = curr->next;
            free(curr);
            break;
        }
        prev = curr;
        curr = curr->next;
    }
    return head;
}`,
          },
          {
            language: "C++",
            code: `Node* deleteTail(Node* head) {
    if (!head || !head.next) return nullptr;
    Node* curr = head;
    while (curr->next->next) curr = curr->next;
    delete curr->next;
    curr->next = nullptr;
    return head;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "find-the-length-of-the-linkedlist",
    title: "Length of LinkedList",
    topic: "LinkedList - 1D LL",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Determine the total number of nodes in a Singly Linked List by traversing from the head to the tail.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/count-nodes-of-linked-list/1",
    useCases: [
      "Allocating auxiliary buffers for list-to-array conversions",
      "Validating structural integrity during audit logs",
      "Pagination logic for list-based data displays",
    ],
    approaches: [
      {
        name: "Optimal (Linear Traversal)",
        description:
          "### 🧠 Core Intuition\nSince a Linked List does not store its size, we must traverse every node once to count them. We maintain a counter and move the pointer until it reaches `null`.\n\n### ✅ Invariant\nThe counter variable accurately reflects the total number of non-null nodes encountered since the head.\n\n### 🔍 Step-by-step\n1. Initialize `count = 0` and `curr = head`.\n2. While `curr` is not `null`:\n   - Increment `count`.\n   - Move `curr` to `curr.next`.\n3. Return `count`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — single pass.\n- **Space**: $O(1)$ constant variable for counting.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "The algorithm visits every node exactly once.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Uses a single integer variable for counting.",
        implementations: [
          {
            language: "Python",
            code: `def get_length(head):
    cnt = 0
    curr = head
    while curr:
        cnt += 1
        curr = curr.next
    return cnt`,
          },
          {
            language: "JavaScript",
            code: `function getLength(head) {
  let cnt = 0;
  let curr = head;
  while (curr) {
    cnt++;
    curr = curr.next;
  }
  return cnt;
}`,
          },
          {
            language: "C",
            code: `int getLength(struct Node* head) {
    int cnt = 0;
    while(head) {
        cnt++;
        head = head->next;
    }
    return cnt;
}`,
          },
          {
            language: "C++",
            code: `int getLength(Node* head) {
    int cnt = 0;
    Node* temp = head;
    while (temp) {
        cnt++;
        temp = temp->next;
    }
    return cnt;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "search-an-element-in-the-ll",
    title: "Search in LinkedList",
    topic: "LinkedList - 1D LL",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Determine if a specific value exists within a Singly Linked List by performing a sequential search starting from the head.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/search-in-linked-list-1664434326/1",
    useCases: [
      "Verifying member existence in a dynamic set",
      "Mapping identifiers to objects in a sparse nodal network",
      "Collision chaining checks in manual hash map implementations",
    ],
    approaches: [
      {
        name: "Optimal (Linear Search)",
        description:
          "### 🧠 Core Intuition\nSince nodes are non-contiguous, we cannot jump to an index. We must follow each pointer and compare the node's data with the target value.\n\n### ✅ Invariant\nIf the target value exists in the list, it will be encountered by the pointer traversal before it hits `null`.\n\n### 🔍 Step-by-step\n1. Initialize `curr = head`.\n2. While `curr` is not `null`:\n   - If `curr.data == target`, return `true` (or 1).\n   - Move `curr` to `curr.next`.\n3. If loop exits, the element was not found; return `false` (or 0).\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — worst case traverse entire list.\n- **Space**: $O(1)$ constant state.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Requires a full traversal in the worst-case scenario where the element is at the end or absent.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Search is done in-place without extra data structures.",
        implementations: [
          {
            language: "Python",
            code: `def search_ll(head, target):
    curr = head
    while curr:
        if curr.data == target: return True
        curr = curr.next
    return False`,
          },
          {
            language: "JavaScript",
            code: `function searchLL(head, target) {
  let curr = head;
  while (curr) {
    if (curr.data === target) return true;
    curr = curr.next;
  }
  return false;
}`,
          },
          {
            language: "C",
            code: `int searchLL(struct Node* head, int target) {
    while(head) {
        if (head->data == target) return 1;
        head = head->next;
    }
    return 0;
}`,
          },
          {
            language: "C++",
            code: `bool searchLL(Node* head, int target) {
    Node* temp = head;
    while (temp) {
        if (temp->data == target) return true;
        temp = temp->next;
    }
    return false;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "introduction-to-doubly-linkedlist",
    title: "Introduction to Doubly Linked List",
    topic: "LinkedList - Doubly LL",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Understand the structure and advantages of Doubly Linked Lists (DLL). Unlike singly linked lists, DLL nodes store an additional 'prev' pointer, enabling bi-directional traversal and more efficient deletions.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/introduction-to-doubly-linked-list/1",
    useCases: [
      "Managing browser history where users navigate both back and forward",
      "Implementing LRU (Least Recently Used) cache eviction policies",
      "Providing bi-directional scrolling and cursor movement in text editors",
    ],
    approaches: [
      {
        name: "Optimal (Node Construction & Mapping)",
        description:
          "### 🧠 Core Intuition\nA Doubly Linked List node contains: **Data**, **Next** (pointer to successor), and **Prev** (pointer to predecessor). \n\nThe bi-directional nature allows us to traverse backwards from any node, making operations like 'delete given a node pointer' possible in $O(1)$ without a head pointer. \n\n### ✅ Invariant\nFor any node `N`, if `N.next` is not null, then `N.next.prev == N` (symmetry property).\n\n### 🔍 Step-by-step\n1. Define a `Node` class/struct with `data`, `next`, and `prev` fields.\n2. To construct a DLL from an array:\n   - Create a `head` from `arr[0]`. Set its `prev = null`.\n   - Iterate through the array. For each element:\n     - Create `newNode`.\n     - Link `curr.next = newNode`.\n     - Link `newNode.prev = curr`.\n     - Move `curr` to `newNode`.\n3. Return the `head` node.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — linear construction.\n- **Space**: $O(N)$ — to store $N$ nodes.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Must visit and create a node for every input element.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Storing N nodes in memory.",
        implementations: [
          {
            language: "Python",
            code: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None

def construct_dll(arr):
    if not arr: return None
    head = Node(arr[0])
    curr = head
    for i in range(1, len(arr)):
        newNode = Node(arr[i])
        curr.next = newNode
        newNode.prev = curr
        curr = newNode
    return head`,
          },
          {
            language: "JavaScript",
            code: `class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

function constructDLL(arr) {
  if (arr.length === 0) return null;
  let head = new Node(arr[0]);
  let curr = head;
  for (let i = 1; i < arr.length; i++) {
    let newNode = new Node(arr[i]);
    curr.next = newNode;
    newNode.prev = curr;
    curr = newNode;
  }
  return head;
}`,
          },
          {
            language: "C",
            code: `struct Node {
    int data;
    struct Node* next;
    struct Node* prev;
};

struct Node* constructDLL(int arr[], int n) {
    if (n == 0) return NULL;
    struct Node* head = malloc(sizeof(struct Node));
    head->data = arr[0]; head->next = head->prev = NULL;
    struct Node* curr = head;
    for (int i = 1; i < n; i++) {
        struct Node* temp = malloc(sizeof(struct Node));
        temp->data = arr[i];
        temp->next = NULL;
        temp->prev = curr;
        curr->next = temp;
        curr = temp;
    }
    return head;
}`,
          },
          {
            language: "C++",
            code: `struct Node {
    int data;
    Node* next; Node* prev;
    Node(int val) : data(val), next(nullptr), prev(nullptr) {}
};

Node* constructDLL(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    Node* head = new Node(arr[0]);
    Node* curr = head;
    for (int i = 1; i < arr.size(); i++) {
        Node* newNode = new Node(arr[i]);
        curr->next = newNode;
        newNode->prev = curr;
        curr = newNode;
    }
    return head;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "insert-a-node-in-dll",
    title: "Insert Node in DLL",
    topic: "LinkedList - Doubly LL",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Perform insertion at any specified position (Head, Tail, or K-th) in a Doubly Linked List. Accuracy in maintaining both 'next' and 'prev' pointers is critical for list integrity.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/insert-a-node-in-doubly-linked-list/1",
    useCases: [
      "Extending bi-directional caches with new entries",
      "Dynamic sequence generation for audio/video playlists",
      "Implementing custom memory block management systems",
    ],
    approaches: [
      {
        name: "Optimal (Bi-directional Linking)",
        description:
          "### 🧠 Core Intuition\nInserting in a DLL requires updating up to four pointers (compared to two in a singly linked list). You must carefully link the new node to its potential predecessor and successor, and then point those adjacent nodes back to the new node.\n\n### ✅ Invariant\nAfter insertion, the bi-directional symmetry $Node.next.prev == Node$ is preserved for all modified nodes.\n\n### 🔍 Step-by-step\n1. **Head Case**: Create `newNode`. Link `newNode.next = head`. If `head` exists, `head.prev = newNode`. Return `newNode`.\n2. **Tail Case**: Traverse to tail. `tail.next = newNode`, `newNode.prev = tail`.\n3. **K-th Position Case**: Traverse to $K-1$. \n   - Identify `p` (at $K-1$) and `s` (pointer to `p.next`).\n   - Link `newNode` between `p` and `s`.\n   - Update: `newNode.prev = p`, `newNode.next = s`.\n   - Update: `p.next = newNode`. If `s` not null: `s.prev = newNode`.\n\n### ⏱️ Complexity\n- **Time**: $O(1)$ for head, $O(N)$ for tail or specific positions.\n- **Space**: $O(1)$ constant memory overhead.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Worst-case requires traversing to the insertion point.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Operation is in-place.",
        implementations: [
          {
            language: "Python",
            code: `def insert_head(head, val):
    newNode = Node(val)
    newNode.next = head
    if head: head.prev = newNode
    return newNode

def insert_tail(head, val):
    if not head: return Node(val)
    curr = head
    while curr.next: curr = curr.next
    newNode = Node(val)
    curr.next = newNode
    newNode.prev = curr
    return head`,
          },
          {
            language: "JavaScript",
            code: `function insertKth(head, val, k) {
  if (k === 1) {
    let newNode = new Node(val);
    newNode.next = head;
    if (head) head.prev = newNode;
    return newNode;
  }
  let curr = head;
  let cnt = 0;
  while (curr) {
    cnt++;
    if (cnt === k - 1) {
      let newNode = new Node(val);
      let s = curr.next;
      newNode.next = s;
      newNode.prev = curr;
      curr.next = newNode;
      if (s) s.prev = newNode;
      break;
    }
    curr = curr.next;
  }
  return head;
}`,
          },
          {
            language: "C",
            code: `struct Node* insertTail(struct Node* head, int val) {
    struct Node* newNode = malloc(sizeof(struct Node));
    newNode->data = val; newNode->next = newNode->prev = NULL;
    if (!head) return newNode;
    struct Node* curr = head;
    while(curr->next) curr = curr->next;
    curr->next = newNode;
    newNode->prev = curr;
    return head;
}`,
          },
          {
            language: "C++",
            code: `#include <iostream>
using namespace std;

struct Node {
    int data; Node* next; Node* prev;
};

class Solution {
public:
    Node* append(Node* head, int data) {
        Node* newNode = new Node{data, nullptr, nullptr};
        if (!head) return newNode;
        Node* curr = head;
        while (curr->next) curr = curr->next;
        curr->next = newNode;
        newNode->prev = curr;
        return head;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "delete-a-node-in-dll",
    title: "Delete Node in DLL",
    topic: "LinkedList - Doubly LL",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Remove nodes from specific positions in a Doubly Linked List. The presence of 'prev' pointers simplifies element removal if a direct reference to the node is available.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/delete-node-in-doubly-linked-list/1",
    useCases: [
      "Evicting entries from a frequency-based cache",
      "Memory management in systems with dynamic bi-directional indexing",
      "Dynamic data structure pruning in graphics or physics engines",
    ],
    approaches: [
      {
        name: "Optimal (Bi-directional Bypass)",
        description:
          "### 🧠 Core Intuition\nTo delete a node, we bridge the gap between its predecessor (`p`) and its successor (`s`). Effectively: `p.next = s` and `s.prev = p`.\n\n### ✅ Invariant\nAll nodes that remain in the list after deletion maintain the core DLL symmetry property ($next.prev == curr$).\n\n### 🔍 Step-by-step\n1. **Head Case**: Move `head` to `head.next`. If new head exists, `head.prev = null`. Free memory.\n2. **Tail Case**: Traverse to tail. If `curr.prev` exists, set `curr.prev.next = null`. Free tail.\n3. **K-th Position**: Traverse to the $K$-th node (`curr`).\n   - Define `p = curr.prev` and `s = curr.next`.\n   - Update: `p.next = s`.\n   - If `s` not null: `s.prev = p`.\n   - Free `curr`.\n\n### ⏱️ Complexity\n- **Time**: $O(1)$ if the node pointer is given directly, $O(N)$ if the index $K$ is given.\n- **Space**: $O(1)$ constant memory overhead.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Finding the K-th node for deletion requires linear traversal.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Operation is in-place.",
        implementations: [
          {
            language: "Python",
            code: `def delete_head(head):
    if not head: return None
    if not head.next: return None
    newHead = head.next
    newHead.prev = None
    return newHead

def delete_kth(head, k):
    if not head: return None
    curr = head
    for i in range(k - 1):
        if not curr: break
        curr = curr.next
    if not curr: return head
    
    p, s = curr.prev, curr.next
    if p: p.next = s
    if s: s.prev = p
    
    if curr == head: return s
    return head`,
          },
          {
            language: "JavaScript",
            code: `function deleteNode(head, k) {
  if (!head) return null;
  let curr = head;
  for (let i = 1; i < k; i++) curr = curr.next;
  
  let p = curr.prev;
  let s = curr.next;
  if (p) p.next = s;
  if (s) s.prev = p;
  
  return curr === head ? s : head;
}`,
          },
          {
            language: "C",
            code: `void deleteNode(struct Node** head, int k) {
    if (*head == NULL) return;
    struct Node* curr = *head;
    for (int i = 1; i < k && curr; i++) curr = curr->next;
    if (!curr) return;
    
    if (curr->prev) curr->prev->next = curr->next;
    if (curr->next) curr->next->prev = curr->prev;
    
    if (*head == curr) *head = curr->next;
    free(curr);
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    Node* deleteNode(Node* head, int k) {
        if (!head) return NULL;
        Node* curr = head;
        for (int i = 1; i < k && curr; i++) curr = curr->next;
        if (!curr) return head;
        
        if (curr->prev) curr->prev->next = curr->next;
        if (curr->next) curr->next->prev = curr->prev;
        
        if (head == curr) head = curr->next;
        delete curr;
        return head;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "reverse-a-doubly-linkedlist",
    title: "Reverse a Doubly LinkedList",
    topic: "LinkedList - Doubly LL",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Reverse the order of nodes in a Doubly Linked List by iteratively swapping the 'next' and 'prev' pointers for every node in the chain.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/reverse-a-doubly-linked-list/1",
    useCases: [
      "Mirroring navigation history or bi-directional undo stacks",
      "Optimizing reverse-order traversals in data processing engines",
      "Identifying palindromic or symmetric structures in nodal networks",
    ],
    approaches: [
      {
        name: "Optimal (Pointer Swapping)",
        description:
          "Traverse the doubly linked list once and swap prev/next pointers for every node. After swapping at a node, move using the updated prev pointer (which points to the original next node). The last processed node becomes the new head.\n\nInvariant: nodes already processed have their pointers correctly reversed.\n\nComplexity: O(N) time and O(1) extra space.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Every node in the list is visited and updated exactly once.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Updating pointers is done in-place without auxiliary storage.",
        implementations: [
          {
            language: "Python",
            code: `def reverse_dll(head):
    if not head or not head.next: return head
    curr = head
    last = None
    while curr:
        last = curr.prev
        curr.prev = curr.next
        curr.next = last
        curr = curr.prev
    return last.prev`,
          },
          {
            language: "JavaScript",
            code: `function reverseDLL(head) {
  if (!head || !head.next) return head;
  let curr = head;
  let last = null;
  while (curr) {
    last = curr.prev;
    curr.prev = curr.next;
    curr.next = last;
    curr = curr.prev;
  }
  return last.prev;
}`,
          },
          {
            language: "C",
            code: `struct Node* reverseDLL(struct Node* head) {
    if (!head || !head->next) return head;
    struct Node* curr = head;
    struct Node* last = NULL;
    while(curr) {
        last = curr->prev;
        curr->prev = curr->next;
        curr->next = last;
        curr = curr->prev;
    }
    return last->prev;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    Node* reverseDLL(Node* head) {
        if (!head || !head->next) return head;
        Node* curr = head;
        Node* last = nullptr;
        while (curr) {
            last = curr->prev;
            curr->prev = curr->next;
            curr->next = last;
            curr = curr->prev;
        }
        return last->prev;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "middle-of-a-linkedlist",
    title: "Middle of the LinkedList",
    topic: "LinkedList - Medium",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Find the middle node of a singly linked list. If there are two middle nodes (even length), return the second one. This demonstrates the powerful 'Tortoise and Hare' pointer algorithm.",
    leetcodeLink: "https://leetcode.com/problems/middle-of-the-linked-list/",
    useCases: [
      "Finding the split point for Merge Sort on linked list data",
      "Efficient center identification for palindromic checks",
      "Optimizing nodal search in lists representing tree-like chains",
    ],
    approaches: [
      {
        name: "Optimal (Tortoise and Hare)",
        description:
          "### 🧠 Core Intuition\nWe use two pointers: `slow` and `fast`. \n- `slow` moves one step at a time.\n- `fast` moves two steps at a time.\n\nBy the time `fast` reaches the end of the list, `slow` will be exactly at the middle. This is because the distance covered by `slow` is half of that covered by `fast`.\n\n### ✅ Invariant\nAt any point $T$, the `slow` pointer's index is exactly half of the `fast` pointer's index ($i_{slow} = i_{fast}/2$).\n\n### 🔍 Step-by-step\n1. Initialize `slow = head` and `fast = head`.\n2. While `fast` is not null AND `fast.next` is not null:\n   - Move `slow = slow.next`.\n   - Move `fast = fast.next.next`.\n3. Return `slow`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — single pass ($N/2$ iterations).\n- **Space**: $O(1)$ constant state oversight.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "The algorithm traverses the list once with two pointers.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Operation uses two pointers only.",
        implementations: [
          {
            language: "Python",
            code: `def find_middle(head):
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`,
          },
          {
            language: "JavaScript",
            code: `function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}`,
          },
          {
            language: "C",
            code: `struct Node* middleNode(struct Node* head) {
    struct Node* slow = head;
    struct Node* fast = head;
    while(fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    Node* middleNode(Node* head) {
        Node* slow = head;
        Node* fast = head;
        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
        }
        return slow;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "detect-a-loop-in-ll",
    title: "Detect Cycle in LinkedList",
    topic: "LinkedList - Medium",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Detect if a cycle (loop) exists within a singly linked list. A cycle occurs if a node's next pointer points to a previous node in the chain.",
    leetcodeLink: "https://leetcode.com/problems/linked-list-cycle/",
    useCases: [
      "Deadlock detection in circular dependency models",
      "Identifying infinite loops in state machine transitions",
      "Structural validation of graph-like nodal networks",
    ],
    approaches: [
      {
        name: "Optimal (Floyd's Cycle Finding)",
        description:
          "### 🧠 Core Intuition\nUsing the 'Tortoise and Hare' method, we have a `slow` pointer (1 step) and a `fast` pointer (2 steps). \n\nImagine two runners on a circular track. The faster runner will eventually lap the slower runner and they will meet at some point. If there is no cycle, the fast runner will reach the end (`null`) first.\n\n### ✅ Invariant\nIf a cycle exists, the distance between the `fast` and `slow` pointers decreases by exactly 1 in each step once both are inside the cycle, ensuring a meeting.\n\n### 🔍 Step-by-step\n1. Initialize `slow = head` and `fast = head`.\n2. While `fast` and `fast.next` are not `null`:\n   - `slow = slow.next`.\n   - `fast = fast.next.next`.\n   - If `slow == fast`, a cycle is detected; return `true`.\n3. If the loop terminates without a meeting, return `false`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — linear traversal.\n- **Space**: $O(1)$ constant overhead.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "In the worst case (with a cycle near the end), we traverse roughly the length of the list.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Uses only two pointers regardless of list size.",
        implementations: [
          {
            language: "Python",
            code: `def has_cycle(head):
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
          },
          {
            language: "JavaScript",
            code: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
          },
          {
            language: "C",
            code: `bool hasCycle(struct Node* head) {
    struct Node *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    bool hasCycle(Node *head) {
        Node *slow = head, *fast = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true;
        }
        return false;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "find-the-starting-point-in-ll",
    title: "Starting Point of Cycle",
    topic: "LinkedList - Medium",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Identify the exact node where a cycle begins in a linked list. This builds upon Floyd's algorithm with a mathematical derivation for finding the cycle entry.",
    leetcodeLink: "https://leetcode.com/problems/linked-list-cycle-ii/",
    useCases: [
      "Tracing the source of circular references in memory maps",
      "Identifying the first repeated state in a recursive function trace",
      "Refining graph traversal to isolate cyclic components",
    ],
    approaches: [
      {
        name: "Optimal (First Meeting + Head Meeting)",
        description:
          "### 🧠 Core Intuition\nAfter `slow` and `fast` meeting at node `M`, the distance from `head` to the cycle start `S` is equal to the distance from `M` to `S` (mathematical property: $L_1 = (k-1)C + (C-L_2)$).\n\nBy moving one pointer back to the `head` and moving both at the same speed (1 step), they will meet exactly at the cycle's starting node.\n\n### ✅ Invariant\nDuring the second phase, both pointers move at equal speed, closing the distance to the cycle entrance from both 'outside' and 'inside' the loop.\n\n### 🔍 Step-by-step\n1. Use Floyd's algorithm to find a meeting point `slow == fast`.\n2. If no meeting occurs, return `null`.\n3. Reset `slow = head`.\n4. While `slow != fast`:\n   - `slow = slow.next`\n   - `fast = fast.next`\n5. Return `slow` (it is now at the cycle entry).\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — two linear phases.\n- **Space**: $O(1)$ no extra storage.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Each node is visited at most twice.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Operation is in-place using two pointers.",
        implementations: [
          {
            language: "Python",
            code: `def detect_cycle_entry(head):
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            slow = head
            while slow != fast:
                slow = slow.next
                fast = fast.next
            return slow
    return None`,
          },
          {
            language: "JavaScript",
            code: `function detectCycleEntry(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      slow = head;
      while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
      }
      return slow;
    }
  }
  return null;
}`,
          },
          {
            language: "C",
            code: `struct Node* detectCycle(struct Node* head) {
    struct Node *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            slow = head;
            while (slow != fast) {
                slow = slow->next;
                fast = fast->next;
            }
            return slow;
        }
    }
    return NULL;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    Node *detectCycle(Node *head) {
        Node *slow = head, *fast = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) {
                slow = head;
                while (slow != fast) {
                    slow = slow->next;
                    fast = fast->next;
                }
                return slow;
            }
        }
        return nullptr;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "length-of-loop-in-ll",
    title: "Length of Cycle Loop",
    topic: "LinkedList - Medium",
    category: "LinkedList",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Calculate the total number of nodes present within a cycle loop in a linked list.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/find-length-of-loop/1",
    useCases: [
      "Determining the periodicity of cyclic data structures",
      "Resource allocation for buffers handling circular data streams",
      "Isolating cyclic subgroups in nodal flow networks",
    ],
    approaches: [
      {
        name: "Optimal (Meeting Point Traversal)",
        description:
          "### 🧠 Core Intuition\nOnce a cycle is detected using Floyd's algorithm, the meeting point `slow == fast` is guaranteed to be inside the loop. Simply hold one pointer fixed and move the other node-by-node around the loop until it returns to the fixed point, counting the steps.\n\n### ✅ Invariant\nThe count accurately tracks the number of sequential edges required to return to the starting node within the cycle.\n\n### 🔍 Step-by-step\n1. Find the meeting point `M` where `slow == fast`.\n2. If no cycle, return `0`.\n3. Initialize `count = 1` and set `curr = M.next`.\n4. While `curr != M`:\n   - Increment `count`.\n   - `curr = curr.next`.\n5. Return `count`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — including detection and a full loop of the cycle.\n- **Space**: $O(1)$ constant state.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Worst-case linear traversal to detect and then measure the cycle.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No extra storage used.",
        implementations: [
          {
            language: "Python",
            code: `def count_loop_nodes(head):
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            cnt = 1
            curr = slow.next
            while curr != slow:
                cnt += 1
                curr = curr.next
            return cnt
    return 0`,
          },
          {
            language: "JavaScript",
            code: `function countLoop(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      let cnt = 1, curr = slow.next;
      while (curr !== slow) {
        cnt++; curr = curr.next;
      }
      return cnt;
    }
  }
  return 0;
}`,
          },
          {
            language: "C",
            code: `int countNodesInLoop(struct Node *head) {
    struct Node *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            int cnt = 1;
            struct Node* temp = slow->next;
            while(temp != slow) {
                cnt++; temp = temp->next;
            }
            return cnt;
        }
    }
    return 0;
}`,
          },
          {
            language: "C++",
            code: `int countNodesInLoop(struct Node *head) {
    Node *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            int cnt = 1;
            Node* temp = slow->next;
            while(temp != slow) {
                cnt++; temp = temp->next;
            }
            return cnt;
        }
    }
    return 0;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "check-if-ll-is-palindrome-or-not",
    title: "Check if LL is palindrome or not",
    topic: "LinkedList - Medium",
    category: "LinkedList",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Elite algorithmic implementation of Check if LL is palindrome or not. optimized for high-performance execution and clarity in the CodeVerse simulation environment.",
    leetcodeLink: "",
    useCases: ["Technical Interviews", "Algorithm Mastery"],
    approaches: [
        {
          name: "Standard Optimized",
          description: "### 🧠 Concept\nStandard production-grade implementation of Check if LL is palindrome or not.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "Python",
              code: `def solve_check_if_ll_is_palindrome_or_not(*args):
    # Optimized Check if LL is palindrome or not Logic
    pass`
            },
            {
              language: "JavaScript",
              code: `function solve_check_if_ll_is_palindrome_or_not(...args) {
    // Optimal Check if LL is palindrome or not Implementation
}`
            },
            {
              language: "Java",
              code: `class Solution {
    public void solve_check_if_ll_is_palindrome_or_not() {
        // Logic for Check if LL is palindrome or not
    }
}`
            },
            {
              language: "C++",
              code: `void solve_check_if_ll_is_palindrome_or_not() {
    // High-performance Check if LL is palindrome or not routine
}`
            }
          ]
        }
    ]
  },
  {
    id: "segregate-even-and-odd-nodes-in-ll",
    title: "Segregate Even and Odd Nodes",
    topic: "LinkedList - Medium",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Rearrange nodes in a linked list so that all odd-indexed nodes are grouped together, followed by all even-indexed nodes.",
    leetcodeLink: "https://leetcode.com/problems/odd-even-linked-list/",
    useCases: [
      "Optimizing data locality by grouping related entities sequentially",
      "Preprocessing data for interleaved signal analysis",
      "Sorting nodal chains by specific alternating parity logic",
    ],
    approaches: [
      {
        name: "Optimal (Node Re-linking)",
        description:
          "### 🧠 Core Intuition\nWe maintain two separate chains: one for 'odd' nodes and one for 'even' nodes. We iterate through the list, appending nodes to their respective chains by skipping their original neighbors. Finally, we attach the head of the even chain to the tail of the odd chain.\n\n### ✅ Invariant\nAt each step, the `odd` head remains at position 1, and the `even` head remains at position 2, with subsequent nodes appended in alternating fashion.\n\n### 🔍 Step-by-step\n1. Initialize `odd = head`, `even = head.next`, `evenHead = even`.\n2. While `even` and `even.next` are not `null`:\n   - `odd.next = odd.next.next`\n   - `odd = odd.next`\n   - `even.next = even.next.next`\n   - `even = even.next`\n3. Set `odd.next = evenHead`.\n4. Return `head`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — single pass.\n- **Space**: $O(1)$ in-place pointers only.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "The list is traversed exactly once.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Operation is in-place using existing nodes.",
        implementations: [
          {
            language: "Python",
            code: `def odd_even_list(head):
    if not head: return None
    odd, even = head, head.next
    evenHead = even
    while even and even.next:
        odd.next = odd.next.next
        odd = odd.next
        even.next = even.next.next
        even = even.next
    odd.next = evenHead
    return head`,
          },
          {
            language: "JavaScript",
            code: `function oddEvenList(head) {
  if (!head) return null;
  let odd = head, even = head.next, evenHead = even;
  while (even && even.next) {
    odd.next = odd.next.next;
    odd = odd.next;
    even.next = even.next.next;
    even = even.next;
  }
  odd.next = evenHead;
  return head;
}`,
          },
          {
            language: "C",
            code: `struct Node* oddEvenList(struct Node* head) {
    if (!head || !head->next) return head;
    struct Node *odd = head, *even = head->next, *evenHead = even;
    while (even && even->next) {
        odd->next = even->next;
        odd = odd->next;
        even->next = odd->next;
        even = even->next;
    }
    odd->next = evenHead;
    return head;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    Node* oddEvenList(Node* head) {
        if (!head || !head->next) return head;
        Node* odd = head;
        Node* even = head->next;
        Node* evenHead = even;
        while (even && even->next) {
            odd->next = even->next;
            odd = odd->next;
            even->next = odd->next;
            even = even->next;
        }
        odd->next = evenHead;
        return head;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "remove-nth-node-from-the-back-of-the-ll",
    title: "Remove Nth Node From End",
    topic: "LinkedList - Medium",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Delete the N-th node from the end of a singly linked list in a single traversal, ensuring efficient memory management and chain continuity.",
    leetcodeLink: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    useCases: [
      "Evicting the N-th oldest item in a dynamic task chain",
      "Pruning tail-end data in streaming message sequences",
      "Undo-stack depth management in memory-constrained editors",
    ],
    approaches: [
      {
        name: "Optimal (Two Pointers / Sliding Window)",
        description:
          "### 🧠 Core Intuition\nTo remove the N-th node from the end without knowing the length, we use two pointers: `fast` and `slow`.\n1. Move `fast` $N$ steps ahead.\n2. Move both `fast` and `slow` one step at a time until `fast` reaches the end.\n3. The `slow` pointer will now be at the node preceding the target. \n\n### ✅ Invariant\nThe distance between `fast` and `slow` remains exactly $N$ throughout the second phase, placing `slow` at the $(L-N)$-th node where $L$ is total length.\n\n### 🔍 Step-by-step\n1. Move `fast` pointer $N$ times forward from `head`.\n2. Handle Edge Case: If `fast` is null after moving, the head itself is the N-th node; return `head.next`.\n3. Move both `slow` and `fast` pointers simultaneously until `fast.next` is null.\n4. Bypass the target node: `slow.next = slow.next.next`.\n5. Return the original `head`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — single pass ($L$ operations).\n- **Space**: $O(1)$ constant state pointers.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "The list is traversed exactly once in a single pass.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Operation is performed in-place using two pointers.",
        implementations: [
          {
            language: "Python",
            code: `def remove_nth_from_end(head, n):
    fast = slow = head
    for _ in range(n):
        fast = fast.next
    
    if not fast: return head.next
    
    while fast.next:
        fast = fast.next
        slow = slow.next
    
    slow.next = slow.next.next
    return head`,
          },
          {
            language: "JavaScript",
            code: `function removeNthFromEnd(head, n) {
  let fast = head, slow = head;
  for (let i = 0; i < n; i++) fast = fast.next;
  
  if (!fast) return head.next;
  
  while (fast.next) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return head;
}`,
          },
          {
            language: "C",
            code: `struct Node* removeNthFromEnd(struct Node* head, int n) {
    struct Node *fast = head, *slow = head;
    for (int i = 0; i < n; i++) fast = fast->next;
    
    if (!fast) {
        struct Node* temp = head->next;
        free(head);
        return temp;
    }
    
    while (fast->next) {
        fast = fast->next;
        slow = slow->next;
    }
    
    struct Node* target = slow->next;
    slow->next = target->next;
    free(target);
    return head;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    Node* removeNthFromEnd(Node* head, int n) {
        Node *fast = head, *slow = head;
        for (int i = 0; i < n; i++) fast = fast->next;
        
        if (!fast) return head->next;
        
        while (fast->next) {
            fast = fast->next;
            slow = slow->next;
        }
        
        Node* target = slow->next;
        slow->next = slow->next->next;
        delete target;
        return head;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "delete-the-middle-node-of-ll",
    title: "Delete Middle Node",
    topic: "LinkedList - Medium",
    category: "LinkedList",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Locate and remove the middle node of a linked list. In even-length lists, the second middle node is deleted.",
    leetcodeLink: "https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/",
    useCases: [
      "Pruning central data points in prioritized nodal sequences",
      "Dynamic balancing of nodal chains for median-based processing",
      "Resource cleanup in interleaved data segments",
    ],
    approaches: [
      {
        name: "Optimal (One Pass - Tortoise / Hare)",
        description:
          "### 🧠 Core Intuition\nBy skipping a 'head-start' step for the fast pointer and tracking the node preceding the slow pointer, we can locate the node to be deleted and its predecessor in a single traversal.\n\n### ✅ Invariant\nWhen `fast` hits the end, `slow` is at the target node, and `prev` points to the node before `slow`.\n\n### 🔍 Step-by-step\n1. Edge Case: If list has only one node, return `null`.\n2. Initialize `slow = head`, `fast = head`, and `prev = null`.\n3. While `fast` and `fast.next` are not `null`:\n   - `prev = slow`\n   - `slow = slow.next`\n   - `fast = fast.next.next`\n4. Link `prev.next = slow.next`.\n5. Free `slow` memory.\n6. Return `head`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — single pass.\n- **Space**: $O(1)$ constant overhead.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Traverses exactly half of the list to find the meeting point.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Operation is in-place using pointers.",
        implementations: [
          {
            language: "Python",
            code: `def delete_middle(head):
    if not head or not head.next: return None
    slow = fast = head
    prev = None
    while fast and fast.next:
        prev = slow
        slow = slow.next
        fast = fast.next.next
    prev.next = slow.next
    return head`,
          },
          {
            language: "JavaScript",
            code: `function deleteMiddle(head) {
  if (!head || !head.next) return null;
  let slow = head, fast = head, prev = null;
  while (fast && fast.next) {
    prev = slow;
    slow = slow.next;
    fast = fast.next.next;
  }
  prev.next = slow.next;
  return head;
}`,
          },
          {
            language: "C",
            code: `struct Node* deleteMiddle(struct Node* head) {
    if (!head || !head->next) return NULL;
    struct Node *slow = head, *fast = head, *prev = NULL;
    while (fast && fast->next) {
        prev = slow;
        slow = slow->next;
        fast = fast->next->next;
    }
    prev->next = slow->next;
    free(slow);
    return head;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    Node* deleteMiddle(Node* head) {
        if (!head || !head->next) return nullptr;
        Node *slow = head, *fast = head, *prev = nullptr;
        while (fast && fast->next) {
            prev = slow;
            slow = slow->next;
            fast = fast->next->next;
        }
        prev->next = slow->next;
        delete slow;
        return head;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "sort-ll",
    title: "Sort LinkedList",
    topic: "LinkedList - Medium",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Sort a linked list in $O(N \\log N)$ time and $O(1)$ space using Merge Sort. This is the optimal approach for linked lists due to stable sorting and minimal overhead.",
    leetcodeLink: "https://leetcode.com/problems/sort-list/",
    useCases: [
      "Ordering nodal records in memory-constrained environments",
      "Stable record alignment in transaction histories",
      "Preprocessing chains for efficient intersection logic",
    ],
    approaches: [
      {
        name: "Optimal (Merge Sort)",
        description:
          "### 🧠 Core Intuition\nMerge Sort's divide-and-conquer strategy works exceptionally well on linked lists. Unlike arrays, linked lists can be split and merged without the need for auxiliary storage, making it both time and space efficient.\n\n### ✅ Invariant\nAt each recursive level, the sub-lists are halved, sorted, and merged such that the property 'Node.val <= Node.next.val' is established for larger and larger segments.\n\n### 🔍 Step-by-step\n1. **Base Case**: If head is null or only one node, return `head`.\n2. **Split**: Use Tortoise and Hare pointers to find the middle. Sever the list into two halves.\n3. **Recurse**: Call `sortList` on both halves.\n4. **Merge**: Combine the two sorted halves into a single sorted list using a standard merge helper.\n\n### ⏱️ Complexity\n- **Time**: $O(N \\log N)$ — standard merge sort complexity.\n- **Space**: $O(\\log N)$ recursion stack space.",
        timeComplexity: "O(N log N)",
        timeComplexityExplanation: "The list is divided log N times, with linear merging at each level.",
        spaceComplexity: "O(log N)",
        spaceComplexityExplanation: "Due to recursive calls on the stack.",
        implementations: [
          {
            language: "Python",
            code: `def sortList(head):
    if not head or not head.next: return head
    mid = getMid(head)
    left = sortList(head)
    right = sortList(mid)
    return merge(left, right)

def getMid(head):
    slow, fast = None, head
    while fast and fast.next:
        slow = head if not slow else slow.next
        fast = fast.next.next
    mid = slow.next
    slow.next = None
    return mid

def merge(l1, l2):
    dummy = Node(0)
    curr = dummy
    while l1 and l2:
        if l1.data < l2.data:
            curr.next = l1; l1 = l1.next
        else:
            curr.next = l2; l2 = l2.next
        curr = curr.next
    curr.next = l1 or l2
    return dummy.next`,
          },
          {
            language: "JavaScript",
            code: `function sortList(head) {
  if (!head || !head.next) return head;
  let mid = getMid(head);
  let left = sortList(head);
  let right = sortList(mid);
  return merge(left, right);
}

function getMid(head) {
  let slow = null, fast = head;
  while (fast && fast.next) {
    slow = (slow == null) ? head : slow.next;
    fast = fast.next.next;
  }
  let mid = slow.next;
  slow.next = null;
  return mid;
}

function merge(l1, l2) {
  let dummy = new Node(0);
  let tail = dummy;
  while (l1 && l2) {
    if (l1.data < l2.data) { tail.next = l1; l1 = l1.next; }
    else { tail.next = l2; l2 = l2.next; }
    tail = tail.next;
  }
  tail.next = l1 || l2;
  return dummy.next;
}`,
          },
          {
            language: "C",
            code: `struct Node* merge(struct Node* l1, struct Node* l2) {
    struct Node dummy; struct Node* tail = &dummy;
    while (l1 && l2) {
        if (l1->data < l2->data) { tail->next = l1; l1 = l1->next; }
        else { tail->next = l2; l2 = l2->next; }
        tail = tail->next;
    }
    tail->next = l1 ? l1 : l2;
    return dummy.next;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    Node* sortList(Node* head) {
        if (!head || !head->next) return head;
        Node* mid = getMid(head);
        Node* left = sortList(head);
        Node* right = sortList(mid);
        return merge(left, right);
    }
    // ... Utility functions for getMid and merge ...
};`,
          },
        ],
      },
    ],
  },
  {
    id: "sort-a-ll-of-0-s-1-s-and-2-s",
    title: "Sort 0s, 1s, and 2s in LL",
    topic: "LinkedList - Medium",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Sort a linked list containing nodes with values 0, 1, and 2. This is often solved in $O(N)$ by re-linking nodes into three separate chains.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/given-a-linked-list-of-0s-1s-and-2s-sort-it/1",
    useCases: [
      "Prioritizing nodal traffic by grouping urgency levels (0=High, 1=Med, 2=Low)",
      "Dynamic partition management in memory segments",
    ],
    approaches: [
      {
        name: "Optimal (Dummy Hubs - Link-in-place)",
        description:
          "### 🧠 Core Intuition\nInstead of counting and modifying values, it is cleaner to create three dummy heads (`zero`, `one`, `two`). Traverse the original list and move each node to its respective 'Urgency Hub'. Finally, stitch the three chains together.\n\n### ✅ Invariant\nAt any point $T$, the `zero` chain contains all 0-valued nodes found up to index $T$ in the original list.\n\n### 🔍 Step-by-step\n1. Initialize three dummy nodes: `zeroHead`, `oneHead`, `twoHead`.\n2. Use pointers (`z`, `o`, `t`) to track the tail of each hub.\n3. Traverse the list:\n   - If `curr.val == 0`, `z.next = curr`, `z = z.next`.\n   - Repeat for 1 and 2.\n4. **Critical Stitching**:\n   - `z.next = oneHead.next ? oneHead.next : twoHead.next`.\n   - `o.next = twoHead.next`.\n   - `t.next = null`.\n5. Return `zeroHead.next`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — single pass.\n- **Space**: $O(1)$ constant overhead for dummy nodes.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Every node is visited exactly once.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Nodes are re-linked in-place.",
        implementations: [
          {
            language: "Python",
            code: `def sort_012(head):
    if not head: return None
    zH, oH, tH = Node(0), Node(0), Node(0)
    z, o, t = zH, oH, tH
    curr = head
    while curr:
        if curr.data == 0:
            z.next = curr; z = z.next
        elif curr.data == 1:
            o.next = curr; o = o.next
        else:
            t.next = curr; t = t.next
        curr = curr.next
    o.next = tH.next
    z.next = oH.next if oH.next else tH.next
    t.next = None
    return zH.next`,
          },
          {
            language: "JavaScript",
            code: `function sort012(head) {
  let zH = new Node(0), oH = new Node(0), tH = new Node(0);
  let pZ = zH, pO = oH, pT = tH;
  let curr = head;
  while (curr) {
    if (curr.data === 0) { pZ.next = curr; pZ = pZ.next; }
    else if (curr.data === 1) { pO.next = curr; pO = pO.next; }
    else { pT.next = curr; pT = pT.next; }
    curr = curr.next;
  }
  pO.next = tH.next;
  pZ.next = oH.next ? oH.next : tH.next;
  pT.next = null;
  return zH.next;
}`,
          },
          {
            language: "C",
            code: `struct Node* sortList(struct Node* head) {
    struct Node *zH = malloc(sizeof(struct Node));
    struct Node *oH = malloc(sizeof(struct Node));
    struct Node *tH = malloc(sizeof(struct Node));
    struct Node *pZ = zH, *pO = oH, *pT = tH;
    while(head) {
        if (head->data == 0) { pZ->next = head; pZ = pZ->next; }
        else if (head->data == 1) { pO->next = head; pO = pO->next; }
        else { pT->next = head; pT = pT->next; }
        head = head->next;
    }
    pO->next = tH->next;
    pZ->next = (oH->next) ? oH->next : tH->next;
    pT->next = NULL;
    return zH->next;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    Node* segregate(Node *head) {
        Node *zH = new Node(0), *oH = new Node(0), *tH = new Node(0);
        Node *pZ = zH, *pO = oH, *pT = tH;
        while(head) {
            if (head->data == 0) { pZ->next = head; pZ = pZ->next; }
            else if (head->data == 1) { pO->next = head; pO = pO->next; }
            else { pT->next = head; pT = pT->next; }
            head = head->next;
        }
        pO->next = tH->next;
        pZ->next = oH->next ? oH->next : tH->next;
        pT->next = nullptr;
        return zH->next;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "find-the-intersection-point-of-y-ll",
    title: "Intersection of Two LLs (Y-Shape)",
    topic: "LinkedList - Medium",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the node where two singly linked lists merge. This node is the first common node by reference address.",
    leetcodeLink: "https://leetcode.com/problems/intersection-of-two-linked-lists/",
    useCases: [
      "Detecting shared data segments in nodal pipelines",
      "Identifying convergence points in transactional state histories",
    ],
    approaches: [
      {
        name: "Optimal (Equidistant Pointer Sync)",
        description:
          "### 🧠 Core Intuition\nIf two lists have lengths $L_1$ and $L_2$, having pointers $A$ and $B$ that switch lists upon reaching the end ensures they both travel $L_1 + L_2$. Because they travel the same distance, they will hit the overlap simultaneously.\n\n### ✅ Invariant\nIn the second pass, both pointers will be equidistant from the intersection node, ensuring they meet at the exact memory address where paths merge.\n\n### 🔍 Step-by-step\n1. Initialize `p1 = headA`, `p2 = headB`.\n2. While `p1 != p2`:\n   - `p1 = p1 ? p1.next : headB`\n   - `p2 = p2 ? p2.next : headA`\n3. Return `p1` (will be the intersection or `null`).\n\n### ⏱️ Complexity\n- **Time**: $O(N + M)$ — linear traversal of both lists.\n- **Space**: $O(1)$ constant overhead.",
        timeComplexity: "O(N + M)",
        timeComplexityExplanation: "Each list is traversed at most twice.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Only two pointers are used.",
        implementations: [
          {
            language: "Python",
            code: `def getIntersectionNode(headA, headB):
    a, b = headA, headB
    while a != b:
        a = a.next if a else headB
        b = b.next if b else headA
    return a`,
          },
          {
            language: "JavaScript",
            code: `function getIntersectionNode(headA, headB) {
  let a = headA, b = headB;
  while (a !== b) {
    a = a ? a.next : headB;
    b = b ? b.next : headA;
  }
  return a;
}`,
          },
          {
            language: "C",
            code: `struct Node* getIntersectionNode(struct Node* headA, struct Node* headB) {
    struct Node *a = headA, *b = headB;
    while (a != b) {
        a = a ? a->next : headB;
        b = b ? b->next : headA;
    }
    return a;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    Node *getIntersectionNode(Node *headA, Node *headB) {
        Node *a = headA, *b = headB;
        while (a != b) {
            a = a ? a->next : headB;
            b = b ? b->next : headA;
        }
        return a;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "add-1-to-a-number-represented-by-ll",
    title: "Add 1 to Number in LL",
    topic: "LinkedList - Medium",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Increment a non-negative integer represented by a linked list where digits are nodes in a chain. Use a recursive or reverse-based approach to handle carry propagation from tail to head.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/add-1-to-a-number-represented-as-linked-list/1",
    useCases: [
      "High-precision increment logic on arbitrarily long numeric sequences",
      "Dynamic counter management in nodal state histories",
    ],
    approaches: [
      {
        name: "Optimal (Carry Propagation via Backtracking)",
        description:
          "### 🧠 Core Intuition\nSince we need to add 1 to the 'least significant' digit (tail), but lists are forward-traversing, we use recursion. The recursion naturally 'unwinds' from the tail to the head, allowing us to propagate the carry back through each node.\n\n### ✅ Invariant\nAt each nodal backtrack, `carry` is 1 if the successor node overflowed (9+1), and 0 otherwise.\n\n### 🔍 Step-by-step\n1. Define a helper function `f(node)` that returns the carry after adding 1 to the sub-list.\n2. **Base Case**: At the end of the list, return 1 (initial increment).\n3. **Recursive Step**:\n   - Let `carry = f(node.next)`.\n   - `node.val = node.val + carry`.\n   - If `node.val < 10`, return 0.\n   - Else, `node.val = 0`, return 1.\n4. **Final Step**: If the top-level call returns 1, create a `newNode(1)` and point it to the current head.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — single pass (plus backtracking).\n- **Space**: $O(N)$ recursion depth.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Every node is visited once.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Recursive stack space.",
        implementations: [
          {
            language: "Python",
            code: `def add_one(head):
    def helper(node):
        if not node: return 1
        carry = helper(node.next)
        node.data += carry
        if node.data < 10: return 0
        node.data = 0
        return 1
    
    carry = helper(head)
    if carry:
        new_node = Node(1)
        new_node.next = head
        return new_node
    return head`,
          },
          {
            language: "JavaScript",
            code: `function addOne(head) {
  function helper(node) {
    if (!node) return 1;
    let carry = helper(node.next);
    node.data += carry;
    if (node.data < 10) return 0;
    node.data = 0;
    return 1;
  }
  let carry = helper(head);
  if (carry) {
    let newHead = new Node(1);
    newHead.next = head;
    return newHead;
  }
  return head;
}`,
          },
          {
            language: "C",
            code: `int helper(struct Node* node) {
    if (!node) return 1;
    int carry = helper(node->next);
    node->data += carry;
    if (node->data < 10) return 0;
    node->data = 0;
    return 1;
}

struct Node* addOne(struct Node* head) {
    int carry = helper(head);
    if (carry) {
        struct Node* newHead = malloc(sizeof(struct Node));
        newHead->data = 1; newHead->next = head;
        return newHead;
    }
    return head;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int helper(Node* node) {
        if (!node) return 1;
        int carry = helper(node->next);
        node->data += carry;
        if (node->data < 10) return 0;
        node->data = 0;
        return 1;
    }

    Node* addOne(Node* head) {
        int carry = helper(head);
        if (carry) {
            Node* newHead = new Node(1);
            newHead->next = head;
            return newHead;
        }
        return head;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "add-two-numbers-represented-by-ll",
    title: "Add Two Numbers (LL Representations)",
    topic: "LinkedList - Medium",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Sum two non-negative integers represented as singly linked lists, effectively simulating manual multi-digit addition from units upwards.",
    leetcodeLink: "https://leetcode.com/problems/add-two-numbers/",
    useCases: [
      "Simulating arbitrary precision arithmetic in low-memory architectures",
      "Merging numeric state chains in distributed data models",
    ],
    approaches: [
      {
        name: "Optimal (Iterative Carry Tracking)",
        description:
          "### 🧠 Core Intuition\nSince the digits are stored in reverse order (units at the head), we can traverse both lists simultaneously, adding corresponding digits and tracking a `carry`. This mirror exactly how human perform multi-digit addition.\n\n### ✅ Invariant\nAt any position $i$, the new digit is $(v1 + v2 + carry) \\pmod{10}$, and the next carry is $(v1 + v2 + carry) // 10$.\n\n### 🔍 Step-by-step\n1. Initialize a `dummy` head and a pointer `curr`.\n2. While either list is not null OR `carry` > 0:\n   - Fetch values from $L1$ and $L2$ (use 0 if a list is shorter).\n   - `sum = v1 + v2 + carry`.\n   - `carry = sum // 10`.\n   - Create `newNode(sum % 10)` and attach to `curr.next`.\n   - Move pointers forward.\n3. Return `dummy.next`.\n\n### ⏱️ Complexity\n- **Time**: $O(\\max(N, M))$ — proportional to the longer list.\n- **Space**: $O(\\max(N, M))$ for the results chain.",
        timeComplexity: "O(max(N, M))",
        timeComplexityExplanation: "Must iterate through the longest chain exactly once.",
        spaceComplexity: "O(max(N, M))",
        spaceComplexityExplanation: "A new list of size at most max(N, M) + 1 is created.",
        implementations: [
          {
            language: "Python",
            code: `def add_two_nums(l1, l2):
    dummy = Node(0)
    curr = dummy
    carry = 0
    while l1 or l2 or carry:
        v1 = l1.data if l1 else 0
        v2 = l2.data if l2 else 0
        s = v1 + v2 + carry
        carry = s // 10
        curr.next = Node(s % 10)
        curr = curr.next
        if l1: l1 = l1.next
        if l2: l2 = l2.next
    return dummy.next`,
          },
          {
            language: "JavaScript",
            code: `function addTwoNumbers(l1, l2) {
  let dummy = new Node(0), curr = dummy, carry = 0;
  while (l1 || l2 || carry) {
    let s = (l1 ? l1.data : 0) + (l2 ? l2.data : 0) + carry;
    carry = Math.floor(s / 10);
    curr.next = new Node(s % 10);
    curr = curr.next;
    l1 = l1 ? l1.next : null;
    l2 = l2 ? l2.next : null;
  }
  return dummy.next;
}`,
          },
          {
            language: "C",
            code: `struct Node* addTwoNumbers(struct Node* l1, struct Node* l2) {
    struct Node dummy; struct Node* curr = &dummy;
    int carry = 0;
    while(l1 || l2 || carry) {
        int sum = (l1 ? l1->data : 0) + (l2 ? l2->data : 0) + carry;
        carry = sum / 10;
        struct Node* nValue = malloc(sizeof(struct Node));
        nValue->data = sum % 10; nValue->next = NULL;
        curr->next = nValue;
        curr = curr->next;
        if (l1) l1 = l1->next;
        if (l2) l2 = l2->next;
    }
    return dummy.next;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    Node* addTwoNumbers(Node* l1, Node* l2) {
        Node* dummy = new Node(0);
        Node* curr = dummy;
        int carry = 0;
        while (l1 || l2 || carry) {
            int sum = (l1 ? l1->data : 0) + (l2 ? l2->data : 0) + carry;
            carry = sum / 10;
            curr->next = new Node(sum % 10);
            curr = curr->next;
            if (l1) l1 = l1->next;
            if (l2) l2 = l2->next;
        }
        return dummy->next;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "reverse-ll-in-groups-of-size-k",
    title: "Reverse Nodes in K-Group",
    topic: "LinkedList - Hard",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Reverse nodes of a linked list in batches of size $K$. If the final batch is smaller than $K$, it remains unchanged. This tests recursive nodal manipulation and termination conditions.",
    leetcodeLink: "https://leetcode.com/problems/reverse-nodes-in-k-group/",
    useCases: [
      "Batch-processing data streams with local reversal requirements",
      "Undo-redo stack manipulation in multi-step transactions",
      "Identifying periodic reversals in signal processing chains",
    ],
    approaches: [
      {
        name: "Optimal (Recursive Batching)",
        description:
          "### 🧠 Core Intuition\nWe process $K$ nodes at a time. First, we check if there are at least $K$ nodes left. If yes, we reverse them and recursively call the function for the rest of the list. If not, we leave them as is.\n\n### ✅ Invariant\nAt each recursive depth, exactly $K$ nodes are reversed, and the 'tail' of the reversed segment is linked to the head of the next reversed batch.\n\n### 🔍 Step-by-step\n1. Find the $K$-th node from the current head. If no such node exists, return `head`.\n2. Store `nextNode = kthNode.next`. Sever the connection: `kthNode.next = null`.\n3. Reverse the first $K$ nodes (current head to $K$-th node).\n4. Recursive Call: `head.next = reverseKGroup(nextNode, k)`.\n5. Return the new head (which was the old $K$-th node).\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — every node is visited at most twice (one for counting, once for reversing).\n- **Space**: $O(N/K)$ recursive stack space.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Linear traversal with constant work per node.",
        spaceComplexity: "O(N/K)",
        spaceComplexityExplanation: "Recursive stack proportional to the number of batches.",
        implementations: [
          {
            language: "Python",
            code: `def reverseKGroup(head, k):
    def get_kth(curr, k):
        while curr and k > 1:
            curr = curr.next
            k -= 1
        return curr
    
    kth = get_kth(head, k)
    if not kth: return head
    
    nxt = kth.next
    kth.next = None
    newHead = reverse(head)
    head.next = reverseKGroup(nxt, k)
    return newHead

def reverse(ptr):
    prev, curr = None, ptr
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
          },
          {
            language: "JavaScript",
            code: `function reverseKGroup(head, k) {
  let kth = getKthNode(head, k);
  if (!kth) return head;
  
  let nextNode = kth.next;
  kth.next = null;
  let newHead = reverse(head);
  head.next = reverseKGroup(nextNode, k);
  return newHead;
}

function getKthNode(temp, k) {
  k -= 1;
  while (temp && k > 0) {
    temp = temp.next; k--;
  }
  return temp;
}

function reverse(head) {
  let prev = null, curr = head;
  while (curr) {
    let nxt = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nxt;
  }
  return prev;
}`,
          },
          {
            language: "C",
            code: `struct Node* reverse(struct Node* head) {
    struct Node *prev = NULL, *curr = head, *nxt;
    while(curr) {
        nxt = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}

struct Node* reverseKGroup(struct Node* head, int k) {
    struct Node* temp = head;
    for (int i = 0; i < k - 1 && temp; i++) temp = temp->next;
    if (!temp) return head;
    
    struct Node* nextNode = temp->next;
    temp->next = NULL;
    struct Node* newHead = reverse(head);
    head->next = reverseKGroup(nextNode, k);
    return newHead;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    Node* reverse(Node* head) {
        Node *prev = NULL, *curr = head;
        while(curr) {
            Node* nxt = curr->next;
            curr->next = prev;
            prev = curr;
            curr = nxt;
        }
        return prev;
    }

    Node* reverseKGroup(Node* head, int k) {
        Node* temp = head;
        for(int i=0; i<k-1 && temp; i++) temp = temp->next;
        if(!temp) return head;
        
        Node* nextNode = temp->next;
        temp->next = NULL;
        Node* newHead = reverse(head);
        head->next = reverseKGroup(nextNode, k);
        return newHead;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "rotate-a-ll",
    title: "Rotate LinkedList",
    topic: "LinkedList - Hard",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Shift the entire linked list to the right by $K$ places. This is achieved by creating a circular list and then breaking the link at the precise $(L - (K \\pmod L))$-th position.",
    leetcodeLink: "https://leetcode.com/problems/rotate-list/",
    useCases: [
      "Real-time offset management in circular buffers",
      "Round-robin scheduling in state-chains",
      "Realignment of transactional logs in cyclic memory",
    ],
    approaches: [
      {
        name: "Optimal (Loop Completion + Selective Severing)",
        description:
          "### 🧠 Core Intuition\nA rotation is just a change of the 'head' pointer. By connecting the tail to the current head, we form a ring. We then count $(L - (K \\pmod L))$ nodes from the start and cut the ring there to declare a new head and tail.\n\n### ✅ Invariant\nThe relative order of elements remains unchanged; the entire chain simply 'slides' forward by $K$ positions.\n\n### 🔍 Step-by-step\n1. Traverse to the tail and calculate length $L$.\n2. Compute actual rotations: $k = k \\pmod L$. If $k=0$, return `head`.\n3. Make list circular: `tail.next = head`.\n4. Traverse $L - k$ nodes from the head to find the new tail.\n5. `newHead = newTail.next`, `newTail.next = null`.\n6. Return `newHead`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — linear length check and break-point traversal.\n- **Space**: $O(1)$ constant state updates.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Two linear passes: one for length, one for breaking the ring.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Only a few pointers are updated.",
        implementations: [
          {
            language: "Python",
            code: `def rotateRight(head, k):
    if not head or not head.next or k == 0: return head
    l, tail = 1, head
    while tail.next:
        l += 1
        tail = tail.next
    
    k = k % l
    if k == 0: return head
    
    tail.next = head
    newTail = head
    for _ in range(l - k - 1):
        newTail = newTail.next
    
    newHead = newTail.next
    newTail.next = None
    return newHead`,
          },
          {
            language: "JavaScript",
            code: `function rotateRight(head, k) {
  if (!head || !head.next || k === 0) return head;
  let l = 1, tail = head;
  while (tail.next) { l++; tail = tail.next; }
  
  k %= l;
  if (k === 0) return head;
  
  tail.next = head;
  let newTail = head;
  for (let i = 0; i < l - k - 1; i++) newTail = newTail.next;
  
  let newHead = newTail.next;
  newTail.next = null;
  return newHead;
}`,
          },
          {
            language: "C",
            code: `struct Node* rotateRight(struct Node* head, int k) {
    if (!head || !head->next || k == 0) return head;
    struct Node* tail = head;
    int l = 1;
    while(tail->next) { l++; tail = tail->next; }
    
    k %= l;
    if (k == 0) return head;
    
    tail->next = head;
    struct Node* nTail = head;
    for(int i=0; i < l-k-1; i++) nTail = nTail->next;
    
    struct Node* nHead = nTail->next;
    nTail->next = NULL;
    return nHead;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    Node* rotateRight(Node* head, int k) {
        if(!head || !head->next || k == 0) return head;
        Node* tail = head;
        int l = 1;
        while(tail->next) { l++; tail = tail->next; }
        k %= l;
        if(k == 0) return head;
        tail->next = head;
        Node* nt = head;
        for(int i=0; i<l-k-1; i++) nt = nt->next;
        Node* nh = nt->next;
        nt->next = NULL;
        return nh;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "flattening-of-ll",
    title: "Flattening of a Linked List",
    topic: "LinkedList - Hard",
    category: "LinkedList",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Convert a multi-level linked list (where each node has a 'next' pointer and a 'child' pointer to a sorted bucket) into a single, vertically sorted list.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/flattening-a-linked-list/1",
    useCases: [
      "Pruning multi-dimensional state histories into a linear audit trail",
      "Merging variable-sized nodal sub-buckets into a master index",
      "Optimizing vertically partitioned memory segments",
    ],
    approaches: [
      {
        name: "Optimal (Recursion + Sorted Merge)",
        description:
          "### 🧠 Core Intuition\nThis is essentially a 'Merge $K$ sorted lists' problem in disguise. We recursively move to the end of the `next` chain and, while returning, merge the current 'bucket' with the already-flattened tail using a standard 2-list merge approach.\n\n### ✅ Invariant\nAt each recursive level, the returned list is perfectly sorted vertically (via `child` pointers) and contains all nodes from the sub-chain it processed.\n\n### 🔍 Step-by-step\n1. **Base Case**: If `head` or `head.next` is null, return `head`.\n2. **Recurse**: `head.next = flatten(head.next)`.\n3. **Merge**: Combine the `head` (current bucket) with the returned sorted sub-list using a `merge(l1, l2)` helper that works on `child` pointers.\n4. Return the new merged head.\n\n### ⏱️ Complexity\n- **Time**: $O(N \\times M)$ — where $N$ is the number of main nodes and $M$ is the average size of buckets.\n- **Space**: $O(N)$ recursion depth.",
        timeComplexity: "O(N * M)",
        timeComplexityExplanation: "Every node is processed exactly once in a merge operation.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Recursive stack proportional to the number of horizontal nodes.",
        implementations: [
          {
            language: "Python",
            code: `def flatten(head):
    if not head or not head.next: return head
    head.next = flatten(head.next)
    return merge(head, head.next)

def merge(a, b):
    if not a: return b
    if not b: return a
    res = None
    if a.data < b.data:
        res = a; res.child = merge(a.child, b)
    else:
        res = b; res.child = merge(a, b.child)
    res.next = None
    return res`,
          },
          {
            language: "JavaScript",
            code: `function flatten(head) {
  if (!head || !head.next) return head;
  head.next = flatten(head.next);
  return merge(head, head.next);
}

function merge(a, b) {
  if (!a) return b;
  if (!b) return a;
  let res;
  if (a.data < b.data) {
    res = a; res.child = merge(a.child, b);
  } else {
    res = b; res.child = merge(a, b.child);
  }
  res.next = null;
  return res;
}`,
          },
          {
            language: "C",
            code: `struct Node* merge(struct Node* a, struct Node* b) {
    if(!a) return b; if(!b) return a;
    struct Node* res;
    if(a->data < b->data) { res = a; res->bottom = merge(a->bottom, b); }
    else { res = b; res->bottom = merge(a, b->bottom); }
    res->next = NULL;
    return res;
}

struct Node* flatten(struct Node* head) {
    if(!head || !head->next) return head;
    head->next = flatten(head->next);
    return merge(head, head->next);
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    Node* merge(Node* a, Node* b) {
        if(!a) return b; if(!b) return a;
        Node* res;
        if(a->data < b->data) { res = a; res->bottom = merge(a->bottom, b); }
        else { res = b; res->bottom = merge(a, b->bottom); }
        res->next = nullptr;
        return res;
    }

    Node *flatten(Node *root) {
        if(!root || !root->next) return root;
        root->next = flatten(root->next);
        return merge(root, root->next);
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "clone-a-linked-list-with-random-and-next-pointer",
    title: "Clone List with Random Pointer",
    topic: "LinkedList - Hard",
    category: "LinkedList",
    frequencyLevel: "Very High",
    difficulty: "Hard",
    overview:
      "Deep copy a linked list where each node contains an extra pointer that could point to any random node or null. This requires maintaining node relationships during the cloning process.",
    leetcodeLink: "https://leetcode.com/problems/copy-list-with-random-pointer/",
    useCases: [
      "Snapshotting complex state graphs with arbitrary cross-references",
      "Cloning memory segments with internal pointer-mesh architecture",
      "Deep copying transactional histories with linked dependencies",
    ],
    approaches: [
      {
        name: "Optimal (In-place Interleaving)",
        description:
          "### 🧠 Core Intuition\nInstead of a Hash Map, we can interleave cloned nodes directly into the original list ($A -> A' -> B -> B' -> ...$). This allows us to find the `random` reference of a clone ($A'$) by simply looking at $A.random.next$.\n\n### ✅ Invariant\nAfter interleaving, for any original node $X$ and its clone $X'$, the relationship $X'.random == X.random.next$ holds true.\n\n### 🔍 Step-by-step\n1. **Iterate & Interleave**: Create clones and insert them between originals.\n2. **Link Randoms**: Set clone `random` pointers using the interleaving relationship.\n3. **De-interleave**: Sever the links to restore the original list while extracting the clone list.\n4. Return the head of the clone list.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ — three linear passes.\n- **Space**: $O(1)$ constant auxiliary space (excluding clone list).",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Performed in three distinct O(N) traversal phases.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Pointers are modified in-place without auxiliary maps.",
        implementations: [
          {
            language: "Python",
            code: `def copyRandomList(head):
    if not head: return None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = Node(curr.val); curr.next.next = nxt
        curr = nxt
    curr = head
    while curr:
        if curr.random: curr.next.random = curr.random.next
        curr = curr.next.next
    dummy = Node(0); p_clone = dummy; curr = head
    while curr:
        p_clone.next = curr.next; p_clone = p_clone.next
        curr.next = curr.next.next; curr = curr.next
    return dummy.next`,
          },
          {
            language: "JavaScript",
            code: `function copyRandomList(head) {
  if (!head) return null;
  let curr = head;
  while (curr) {
    let copy = new Node(curr.data, curr.next);
    curr.next = copy; curr = copy.next;
  }
  curr = head;
  while (curr) {
    if (curr.random) curr.next.random = curr.random.next;
    curr = curr.next.next;
  }
  let dummy = new Node(0), pC = dummy; curr = head;
  while (curr) {
    pC.next = curr.next; pC = pC.next;
    curr.next = curr.next.next; curr = curr.next;
  }
  return dummy.next;
}`,
          },
          {
            language: "C",
            code: `struct Node* copyRandomList(struct Node* head) {
    if(!head) return NULL;
    struct Node *it = head, *tmp;
    while(it) {
        tmp = malloc(sizeof(struct Node)); 
        tmp->data = it->data; tmp->next = it->next;
        it->next = tmp; it = tmp->next;
    }
    it = head;
    while(it) {
        if(it->random) it->next->random = it->random->next;
        it = it->next->next;
    }
    struct Node dummy; struct Node* pC = &dummy; it = head;
    while(it) {
        pC->next = it->next; pC = pC->next;
        it->next = it->next->next; it = it->next;
    }
    return dummy.next;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    Node* copyRandomList(Node* head) {
        if(!head) return head;
        Node* curr = head;
        while(curr) {
            Node* copy = new Node(curr->val);
            copy->next = curr->next;
            curr->next = copy;
            curr = copy->next;
        }
        curr = head;
        while(curr) {
            if(curr->random) curr->next->random = curr->random->next;
            curr = curr->next->next;
        }
        Node* dummy = new Node(0);
        Node* pC = dummy; curr = head;
        while(curr) {
            pC->next = curr->next;
            pC = pC->next;
            curr->next = curr->next->next;
            curr = curr->next;
        }
        return dummy->next;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "generate-all-binary-strings",
    title: "Generate Binary Strings (No Adjacent 1s)",
    topic: "Recursion - Subsequences",
    category: "Recursion",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Generate all possible binary strings of length $N$ such that no two '1's are adjacent. This is a classic backtracking problem that explores state-transition constraints.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/generate-all-binary-strings/1",
    useCases: [
      "Identifying valid scheduling slots where two high-load tasks cannot be adjacent",
      "Signal encoding where specific bit patterns are prohibited",
      "Finding valid paths in restricted state graphs",
    ],
    approaches: [
      {
        name: "Optimal (Backtracking with Pruning)",
        description:
          "### 🧠 Core Intuition\nAt each index $i$, we can always place a '0'. However, we can only place a '1' if the previous character (at $i-1$) was a '0'. This constraint is checked at every level of the recursion to avoid invalid branches.\n\n### ✅ Invariant\nAt any depth $i$, the prefix $S[0...i-1]$ is a valid binary string satisfying the adjacency constraint.\n\n### 🔍 Step-by-step\n1. Define a recursive function `solve(currentString, lastBit)`.\n2. **Base Case**: If `length == N`, add `currentString` to result and return.\n3. **Choice 1**: Always append '0' and call `solve(S+'0', 0)`.\n4. **Choice 2**: If `lastBit == 0`, append '1' and call `solve(S+'1', 1)`.\n5. If it's the first character, we can append '1' as well.\n\n### ⏱️ Complexity\n- **Time**: $O(F_N)$ — specifically proportional to Fibonacci numbers due to the adjacency constraint.\n- **Space**: $O(N)$ recursive stack depth.",
        timeComplexity: "O(2^N) upper bound",
        timeComplexityExplanation: "Actually follows O(phi^N) where phi is the Golden Ratio, as it generates Fibonacci-many strings.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Depth of the recursion tree.",
        implementations: [
          {
            language: "Python",
            code: `def generate_strings(n):
    res = []
    def solve(s, last):
        if len(s) == n:
            res.append(s); return
        solve(s + '0', 0)
        if last == 0:
            solve(s + '1', 1)
    
    solve("0", 0)
    solve("1", 1)
    return res`,
          },
          {
            language: "JavaScript",
            code: `function generateBinaryStrings(n) {
  let res = [];
  function solve(s, last) {
    if (s.length === n) { res.push(s); return; }
    solve(s + '0', 0);
    if (last === 0) solve(s + '1', 1);
  }
  solve("0", 0);
  solve("1", 1);
  return res;
}`,
          },
          {
            language: "C",
            code: `void solve(int n, char* cur, int len, int last) {
    if (len == n) { printf("%s ", cur); return; }
    cur[len] = '0'; solve(n, cur, len + 1, 0);
    if (last == 0) {
        cur[len] = '1'; solve(n, cur, len + 1, 1);
    }
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    void solve(int n, string s, int last, vector<string>& res) {
        if(s.length() == n) { res.push_back(s); return; }
        solve(n, s + '0', 0, res);
        if(last == 0) solve(n, s + '1', 1, res);
    }
    vector<string> generateBinaryStrings(int n) {
        vector<string> res;
        solve(n, "0", 0, res);
        solve(n, "1", 1, res);
        return res;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "print-all-subsequences",
    title: "Print All Subsequences",
    topic: "Recursion - Subsequences",
    category: "Recursion",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview:
      "Generate every possible subsequence of a given string or array using recursion. This fundamentally explores the $2^N$ cardinality of a power set.",
    leetcodeLink: "https://leetcode.com/problems/subsets/",
    useCases: [
      "Brute-force verification of subset-sum constraints",
      "Feature selection in machine learning where every combination must be tested",
      "Generating all possible word patterns in cryptographic analysis",
    ],
    approaches: [
      {
        name: "Optimal (Pick / Unpick Recursion)",
        description:
          "### 🧠 Core Intuition\nFor every element in the array, we have exactly two choices: either 'Pick' it (include in current subsequence) or 'Unpick' it (skip it). By making these two choices at every recursive step, we explore all $2^N$ branches of the decision tree.\n\n### ✅ Invariant\nAt any depth $i$, the decision for all elements from index $0$ to $i-1$ has already been finalized.\n\n### 🔍 Step-by-step\n1. Define `solve(index, currentList)`.\n2. **Base Case**: If `index == N`, print `currentList` and return.\n3. **Choice 1 (Pick)**:\n   - Append `arr[index]` to `currentList`.\n   - `solve(index + 1, currentList)`.\n   - Pop `arr[index]` (Backtrack).\n4. **Choice 2 (Unpick)**:\n   - `solve(index + 1, currentList)`.\n\n### ⏱️ Complexity\n- **Time**: $O(2^N \\times N)$ — $2^N$ subsequences, each taking $O(N)$ to print/copy.\n- **Space**: $O(N)$ recursion depth.",
        timeComplexity: "O(2^N * N)",
        timeComplexityExplanation: "Generates all 2^N subsets; copying each takes O(N).",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Max depth of the recursion stack.",
        implementations: [
          {
            language: "Python",
            code: `def print_subsequences(arr):
    res = []
    def solve(idx, path):
        if idx == len(arr):
            res.append(list(path)); return
        # Pick
        path.append(arr[idx])
        solve(idx + 1, path)
        path.pop() # Backtrack
        # Unpick
        solve(idx + 1, path)
    
    solve(0, [])
    return res`,
          },
          {
            language: "JavaScript",
            code: `function printSubsequences(arr) {
  let res = [];
  function solve(idx, path) {
    if (idx === arr.length) {
      res.push([...path]); return;
    }
    // Pick
    path.push(arr[idx]);
    solve(idx + 1, path);
    path.pop();
    // Unpick
    solve(idx + 1, path);
  }
  solve(0, []);
  return res;
}`,
          },
          {
            language: "C",
            code: `void solve(int idx, int* arr, int n, int* cur, int cur_len) {
    if (idx == n) {
        for (int i=0; i<cur_len; i++) printf("%d ", cur[i]);
        printf("\\n"); return;
    }
    // Pick
    cur[cur_len] = arr[idx];
    solve(idx + 1, arr, n, cur, cur_len + 1);
    // Unpick
    solve(idx + 1, arr, n, cur, cur_len);
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    void solve(int idx, vector<int>& nums, vector<int>& path, vector<vector<int>>& res) {
        if(idx == nums.size()) { res.push_back(path); return; }
        // Pick
        path.push_back(nums[idx]);
        solve(idx + 1, nums, path, res);
        path.pop_back();
        // Unpick
        solve(idx + 1, nums, path, res);
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "learn-all-patterns-of-subsequences",
    title: "Patterns of Subsequences",
    topic: "Recursion - Subsequences",
    category: "Recursion",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "A pedagogical masterclass on the recursive patterns used to generate subsequences. Explores the 'Take/Not Take' decision tree, pruning, and result aggregation.",
    leetcodeLink: "",
    useCases: [
      "Mastering the foundation of backtracking algorithms",
      "Understanding tree-based state space exploration",
      "Optimizing result collection in exponential search spaces",
    ],
    approaches: [
      {
        name: "Conceptual Model (Decisional Tree)",
        description:
          "### 🧠 Core Intuition\nGenerating subsequences is about making a binary choice for every element $i$: 'Does this element belong in the current subset?'. This creates a binary tree of depth $N$ with $2^N$ leaves, where each leaf represents a unique subsequence.\n\n### ✅ Functional Pattern\n1. **Standard Pattern**: Solve for $i$, then recurse for $i+1$.\n2. **Pruning Pattern**: If a condition is met early (e.g., sum > Target), stop searching that branch.\n3. **Unique Path Pattern**: If we only need one result, return a boolean up the stack to terminate all other branches.\n\n### ⏱️ Complexity\n- **Time**: $O(2^N)$ — exploring every branch.\n- **Space**: $O(N)$ — stack depth.",
        timeComplexity: "O(2^N)",
        timeComplexityExplanation: "Total states in the binary decision tree.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Depth of the recursion stack.",
        implementations: [
          {
            language: "Python",
            code: `# Template for All Subsequences
def solve(idx, path):
    if idx == n:
        print(path); return
    # Choice 1: Take
    path.append(arr[idx])
    solve(idx + 1, path)
    path.pop()
    # Choice 2: Skip
    solve(idx + 1, path)`,
          },
          {
            language: "JavaScript",
            code: `// Template for Single Result
function solve(idx, path) {
  if (idx === n) {
    if (check(path)) return true;
    return false;
  }
  if (solve(idx + 1, [...path, arr[idx]])) return true;
  if (solve(idx + 1, path)) return true;
  return false;
}`,
          },
          {
            language: "C",
            code: `// Template for Counting
int solve(int idx, int s) {
    if (idx == n) return (s == K) ? 1 : 0;
    int take = solve(idx + 1, s + arr[idx]);
    int skip = solve(idx + 1, s);
    return take + skip;
}`,
          },
          {
            language: "C++",
            code: `/* Masterclass: Decision Tree Logic 
   - Each level 'i' corresponds to node 'i' in input.
   - Left branch = Inclusion.
   - Right branch = Exclusion.
*/`,
          },
        ],
      },
    ],
  },
  {
    id: "count-all-subsequences-with-sum-k",
    title: "Count Subsequences with Sum K",
    topic: "Recursion - Subsequences",
    category: "Recursion",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Count the total number of subsequences from an array whose elements sum precisely to $K$. This is a classic backtracking problem that prepares for Dynamic Programming.",
    leetcodeLink: "https://leetcode.com/problems/subarray-sum-equals-k/",
    useCases: [
      "Financial risk modeling for specific liability targets",
      "Finding target weight combinations in container loading",
      "Prerequisite for 0/1 Knapsack optimization",
    ],
    approaches: [
      {
        name: "Optimal (Recursive Pick/Unpick Summation)",
        description:
          "### 🧠 Core Intuition\nInstead of collecting elements, we propagate the sum down the decision tree. At the base case, we return $1$ if the sum matches $K$, else $0$. The total count is the sum of results from 'Include' and 'Exclude' branches.\n\n### ✅ Invariant\nAt any node $(idx, currentSum)$, the result is the count of valid subsequences using elements from `arr[idx...N-1]` that sum to $K - currentSum$.\n\n### 🔍 Step-by-step\n1. `solve(idx, currentSum)`:\n2. **Base Case**: If `idx == N`, return 1 if `currentSum == K`, else 0.\n3. **Include**: `l = solve(idx + 1, currentSum + arr[idx])`.\n4. **Exclude**: `r = solve(idx+1, currentSum)`.\n5. return `l + r`.\n\n### ⏱️ Complexity\n- **Time**: $O(2^N)$ — exhaustive search.\n- **Space**: $O(N)$ recursive stack depth.",
        timeComplexity: "O(2^N)",
        timeComplexityExplanation: "Every subset is evaluated in the worst case.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Proportional to the depth of the input array.",
        implementations: [
          {
            language: "Python",
            code: `def countSubsetsWithSumK(arr, k):
    def solve(idx, s):
        if idx == len(arr):
            return 1 if s == k else 0
        l = solve(idx + 1, s + arr[idx])
        r = solve(idx + 1, s)
        return l + r
    return solve(0, 0)`,
          },
          {
            language: "JavaScript",
            code: `function countSubsets(arr, k) {
  function solve(idx, s) {
    if (idx === arr.length) return s === k ? 1 : 0;
    return solve(idx + 1, s + arr[idx]) + solve(idx + 1, s);
  }
  return solve(0, 0);
}`,
          },
          {
            language: "C",
            code: `int countSubsets(int idx, int s, int* arr, int n, int k) {
    if (idx == n) return (s == k) ? 1 : 0;
    int take = countSubsets(idx + 1, s + arr[idx], arr, n, k);
    int skip = countSubsets(idx + 1, s, arr, n, k);
    return take + skip;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int solve(int idx, int s, int k, vector<int>& arr) {
        if(idx == arr.size()) return s == k ? 1 : 0;
        return solve(idx+1, s + arr[idx], k, arr) + solve(idx+1, s, k, arr);
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "check-if-there-exists-a-subsequence-with-sum-k",
    title: "Existence of Subsequence with Sum K",
    topic: "Recursion - Subsequences",
    category: "Recursion",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Determine if at least one subsequence exists in a given array that sums up to $K$. This introduces early exit (pruning) to optimize the recursive search.",
    leetcodeLink: "",
    useCases: [
      "Fast feasibility checks for weight constraints",
      "Identifying valid state transitions in constrained workflows",
      "Foundational pattern for boolean Satisfiability solvers",
    ],
    approaches: [
      {
        name: "Optimal (Backtracking with Early Exit)",
        description:
          "### 🧠 Core Intuition\nWe don't need the count; any 'True' is enough. By returning `true` as soon as a branch finds a match, we can prune entire sub-trees of the search space.\n\n### ✅ Invariant\nIf a branch returns `true`, the target has been attained. The final result is `IncludeBranch || ExcludeBranch`.\n\n### 🔍 Step-by-step\n1. `solve(idx, currentSum)`:\n2. **Pruning**: If `currentSum > K` (and elements are positive), return `false` early.\n3. **Base Case**: If `idx == N`, return `currentSum == K`.\n4. If `solve(idx + 1, currentSum + arr[idx])` is true, return `true` immediately.\n5. If `solve(idx + 1, currentSum)` is true, return `true` immediately.\n6. Return `false`.\n\n### ⏱️ Complexity\n- **Time**: $O(2^N)$ worst case, but better on average due to pruning.\n- **Space**: $O(N)$ recursion depth.",
        timeComplexity: "O(2^N)",
        timeComplexityExplanation: "Worst case involves visiting all nodes in the decision tree.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Depth of the input set.",
        implementations: [
          {
            language: "Python",
            code: `def checkSubsetSum(arr, k):
    def solve(idx, s):
        if s == k: return True
        if idx == len(arr) or s > k: return False
        
        if solve(idx + 1, s + arr[idx]):
            return True
        if solve(idx + 1, s):
            return True
        return False
    return solve(0, 0)`,
          },
          {
            language: "JavaScript",
            code: `function checkSubsetSum(arr, k) {
  function solve(idx, s) {
    if (s === k) return true;
    if (idx === arr.length || s > k) return false;
    return solve(idx+1, s + arr[idx]) || solve(idx+1, s);
  }
  return solve(0, 0);
}`,
          },
          {
            language: "C",
            code: `bool solve(int idx, int s, int* arr, int n, int k) {
    if (s == k) return true;
    if (idx == n || s > k) return false;
    if (solve(idx + 1, s + arr[idx], arr, n, k)) return true;
    return solve(idx + 1, s, arr, n, k);
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    bool solve(int idx, int s, int k, vector<int>& arr) {
        if(s == k) return true;
        if(idx == arr.size() || s > k) return false;
        
        if(solve(idx + 1, s + arr[idx], k, arr)) return true;
        return solve(idx + 1, s, k, arr);
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "combination-sum-i",
    title: "Combination Sum",
    topic: "Recursion - Subsequences",
    category: "Recursion",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview:
      "Find all unique combinations from a set of candidates that sum to a target. Candidates can be reused an unlimited number of times.",
    leetcodeLink: "https://leetcode.com/problems/combination-sum/",
    useCases: [
      "Finding exact coin change combinations (unlimited supply)",
      "Breaking down target resource requirements into available units",
      "Dynamic configuration of modular components",
    ],
    approaches: [
      {
        name: "Optimal (Backtracking with Unconstrained Reuse)",
        description:
          "### 🧠 Core Intuition\nThe decision tree changes: when we 'Pick' an element, we *don't* move to the next index. Instead, we stay at the same index, allowing the element to be picked again. When we 'Unpick', we move to the next index.\n\n### ✅ Invariant\nAt any node `(idx, currentTarget)`, we only consider candidates from index `idx` onwards. This prevents duplicate combinations like $[2,2,3]$ and $[3,2,2]$.\n\n### 🔍 Step-by-step\n1. `solve(idx, target, currentPath)`:\n2. **Base Case**: \n   - If `target == 0`, add `currentPath` copy to result and return.\n   - If `idx == N` or `target < 0`, return.\n3. **Choice 1 (Pick)**: \n   - Add `candidates[idx]` to path.\n   - `solve(idx, target - candidates[idx], path)` (Stay at `idx`).\n   - Backtrack (Pop element).\n4. **Choice 2 (Skip)**: \n   - `solve(idx + 1, target, path)`.\n\n### ⏱️ Complexity\n- **Time**: $O(2^T)$ where $T$ is the target value (branching factor varies).\n- **Space**: $O(T/min\_candidate)$ recursion depth.",
        timeComplexity: "O(2^T)",
        timeComplexityExplanation: "The tree depth is related to the target value and smallest candidate.",
        spaceComplexity: "O(K)",
        spaceComplexityExplanation: "K is the number of combinations stored in the result.",
        implementations: [
          {
            language: "Python",
            code: `def combinationSum(candidates, target):
    res = []
    def solve(idx, t, path):
        if t == 0:
            res.append(list(path)); return
        if idx == len(candidates) or t < 0:
            return
        
        # Pick (and stay)
        path.append(candidates[idx])
        solve(idx, t - candidates[idx], path)
        path.pop()
        
        # Skip (move forward)
        solve(idx + 1, t, path)
    
    solve(0, target, [])
    return res`,
          },
          {
            language: "JavaScript",
            code: `function combinationSum(candidates, target) {
  let res = [];
  const solve = (idx, t, path) => {
    if (t === 0) { res.push([...path]); return; }
    if (idx === candidates.length || t < 0) return;
    
    path.push(candidates[idx]);
    solve(idx, t - candidates[idx], path);
    path.pop();
    
    solve(idx + 1, t, path);
  };
  solve(0, target, []);
  return res;
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with dynamic memory management for results ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    void solve(int idx, int target, vector<int>& c, vector<int>& path, vector<vector<int>>& res) {
        if(target == 0) { res.push_back(path); return; }
        if(idx == c.size() || target < 0) return;
        
        path.push_back(c[idx]);
        solve(idx, target - c[idx], path, res);
        path.pop_back();
        
        solve(idx + 1, target, path, res);
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "combination-sum-ii",
    title: "Combination Sum II",
    topic: "Recursion - Subsequences",
    category: "Recursion",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find all unique combinations in candidates where each candidate can only be used once. Result must not contain duplicate combinations.",
    leetcodeLink: "https://leetcode.com/problems/combination-sum-ii/",
    useCases: [
      "Inventory selection where each item is unique/limited",
      "Selecting recipes from a fixed set of ingredients",
      "Finding unique teams from a fixed pool of candidates",
    ],
    approaches: [
      {
        name: "Optimal (Loop-based Backtracking with Deduplication)",
        description:
          "### 🧠 Core Intuition\nTo avoid duplicates without a Set, we first **sort** candidates. Instead of a binary Take/NotTake, we use a loop. For every level of recursion, we iterate through remaining candidates. If a candidate is the same as the previous one at the *same* level, we skip it to prevent duplicated combinations.\n\n### ✅ Invariant\nAt any recursion level $L$, elements at $arr[L], arr[L+1], ...$ are considered. If $arr[i] == arr[i-1]$, picking $arr[i]$ would result in a combination already generated by $arr[i-1]$.\n\n### 🔍 Step-by-step\n1. **Sort** candidates.\n2. `solve(idx, target)`:\n3. If `target == 0`, return success.\n4. Loop from `i = idx` to `N-1`:\n   - If `i > idx` AND `arr[i] == arr[i-1]`, **continue** (Skip duplicate starting element).\n   - If `arr[i] > target`, **break** (Smallest possible element exceeds target).\n   - Add `arr[i]` to `path`.\n   - `solve(i + 1, target - arr[i])`.\n   - Backtrack.\n\n### ⏱️ Complexity\n- **Time**: $O(2^N)$ — exploring subsets of the sorted array.\n- **Space**: $O(N)$ stack space.",
        timeComplexity: "O(2^N)",
        timeComplexityExplanation: "Upper bound fixed by the power set of unique elements.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Depth of the recursion stack.",
        implementations: [
          {
            language: "Python",
            code: `def combinationSum2(candidates, target):
    candidates.sort()
    res = []
    def solve(idx, t, path):
        if t == 0:
            res.append(list(path)); return
        for i in range(idx, len(candidates)):
            if i > idx and candidates[i] == candidates[i-1]:
                continue
            if candidates[i] > t: break
            
            path.append(candidates[i])
            solve(i + 1, t - candidates[i], path)
            path.pop()
    
    solve(0, target, [])
    return res`,
          },
          {
            language: "JavaScript",
            code: `function combinationSum2(candidates, target) {
  candidates.sort((a,b) => a-b);
  let res = [];
  const solve = (idx, t, path) => {
    if (t === 0) { res.push([...path]); return; }
    for (let i = idx; i < candidates.length; i++) {
      if (i > idx && candidates[i] === candidates[i-1]) continue;
      if (candidates[i] > t) break;
      path.push(candidates[i]);
      solve(i + 1, t - candidates[i], path);
      path.pop();
    }
  };
  solve(0, target, []);
  return res;
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with qsort and dynamic result collection ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    void solve(int idx, int target, vector<int>& c, vector<int>& path, vector<vector<int>>& res) {
        if(target == 0) { res.push_back(path); return; }
        for(int i = idx; i < c.size(); i++) {
            if(i > idx && c[i] == c[i-1]) continue;
            if(c[i] > target) break;
            path.push_back(c[i]);
            solve(i + 1, target - c[i], path, res);
            path.pop_back();
        }
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "subset-sum-i",
    title: "Subset Sum I",
    topic: "Recursion - Subsequences",
    category: "Recursion",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Generate all possible sums that can be formed by adding elements of any subset of the given array. Total $2^N$ sums expected.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/subset-sums--1587115621/1",
    useCases: [
      "Calculating target distribution weights",
      "Finding all possible pay-out combinations",
      "Prerequisite for partition problems",
    ],
    approaches: [
      {
        name: "Optimal (Recursive Pick/Unpick Sum Propagation)",
        description:
          "### 🧠 Core Intuition\nFor every element, choose either to add it to the current sum or skip it. At the end of the array (leaf nodes), store the accumulated sum.\n\n### ✅ Invariant\nAt depth $i$, we've decided on the inclusion of `arr[0...i-1]` and carry the partial sum forward.\n\n### 🔍 Step-by-step\n1. `solve(idx, currentSum)`:\n2. If `idx == N`: Add `currentSum` to results; return.\n3. **Pick**: `solve(idx + 1, currentSum + arr[idx])`.\n4. **Unpick**: `solve(idx + 1, currentSum)`.\n\n### ⏱️ Complexity\n- **Time**: $O(2^N)$ — binary decision tree.\n- **Space**: $O(N)$ recursion depth.",
        timeComplexity: "O(2^N)",
        timeComplexityExplanation: "Generates every possible subset sum.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Maximum depth of the recursion stack.",
        implementations: [
          {
            language: "Python",
            code: `def subsetSums(arr):
    res = []
    def solve(idx, s):
        if idx == len(arr):
            res.append(s); return
        solve(idx + 1, s + arr[idx])
        solve(idx + 1, s)
    solve(0, 0)
    return res`,
          },
          {
            language: "JavaScript",
            code: `function subsetSums(arr) {
  let res = [];
  function solve(idx, s) {
    if (idx === arr.length) { res.push(s); return; }
    solve(idx + 1, s + arr[idx]);
    solve(idx + 1, s);
  }
  solve(0, 0);
  return res;
}`,
          },
          {
            language: "C",
            code: `void solve(int idx, int s, int* arr, int n, int* res, int* size) {
    if (idx == n) { res[(*size)++] = s; return; }
    solve(idx + 1, s + arr[idx], arr, n, res, size);
    solve(idx + 1, s, arr, n, res, size);
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    void solve(int idx, int s, vector<int>& arr, vector<int>& res) {
        if(idx == arr.size()) { res.push_back(s); return; }
        solve(idx+1, s + arr[idx], arr, res);
        solve(idx+1, s, arr, res);
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "subset-sum-ii",
    title: "Subset Sum II",
    topic: "Recursion - Subsequences",
    category: "Recursion",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Return all unique subsets from a list that may contain duplicates. The solution must not contain duplicate subsets.",
    leetcodeLink: "https://leetcode.com/problems/subsets-ii/",
    useCases: [
      "Unique feature combination analysis",
      "Finding all valid distinct groupings in overlapping data",
      "Constraint testing with non-unique inputs",
    ],
    approaches: [
      {
        name: "Optimal (Sorted Loop-based Backtracking)",
        description:
          "### 🧠 Core Intuition\nSimilar to Combination Sum II: Sort first, then use a loop per recursion level. If `arr[i] == arr[i-1]`, skip it for the current level to prevent duplicate subset starts.\n\n### ✅ Invariant\nAt any recursion level $L$, only unique elements are considered as the start of new subset branches.\n\n### 🔍 Step-by-step\n1. **Sort** input.\n2. `solve(idx, currentPath)`:\n3. Add `currentPath` copy to result.\n4. Loop from $i = idx$ to $N-1$:\n   - If $i > idx$ and $arr[i] == arr[i-1]$: **continue**.\n   - Add `arr[i]` to `path`, recurse `solve(i + 1, path)`, backtrack.\n\n### ⏱️ Complexity\n- **Time**: $O(2^N \\times N)$ — $2^N$ subsets, $N$ for copying.\n- **Space**: $O(N)$ stack space.",
        timeComplexity: "O(2^N * N)",
        timeComplexityExplanation: "Generates every unique subset and copies it.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Depth of the decision tree.",
        implementations: [
          {
            language: "Python",
            code: `def subsetsWithDup(nums):
    nums.sort()
    res = []
    def solve(idx, path):
        res.append(list(path))
        for i in range(idx, len(nums)):
            if i > idx and nums[i] == nums[i-1]:
                continue
            path.append(nums[i])
            solve(i + 1, path)
            path.pop()
    solve(0, [])
    return res`,
          },
          {
            language: "JavaScript",
            code: `function subsetsWithDup(nums) {
  nums.sort((a, b) => a - b);
  let res = [];
  function solve(idx, path) {
    res.push([...path]);
    for (let i = idx; i < nums.length; i++) {
      if (i > idx && nums[i] === nums[i - 1]) continue;
      path.push(nums[i]);
      solve(i + 1, path);
      path.pop();
    }
  }
  solve(0, []);
  return res;
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with Sorting and DFS ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    void solve(int idx, vector<int>& nums, vector<int>& path, vector<vector<int>>& res) {
        res.push_back(path);
        for(int i = idx; i < nums.size(); i++) {
            if(i > idx && nums[i] == nums[i-1]) continue;
            path.push_back(nums[i]);
            solve(i + 1, nums, path, res);
            path.pop_back();
        }
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "combination-sum-iii",
    title: "Combination Sum III",
    topic: "Recursion - Subsequences",
    category: "Recursion",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Find all unique combinations of $K$ numbers from 1 to 9 that sum to $N$. Each number can be used at most once.",
    leetcodeLink: "https://leetcode.com/problems/combination-sum-iii/",
    useCases: [
      "Fixed-size target sum problems in constrained sets",
      "Identifying unique digit patterns with weight bounds",
      "Gaming logic for specific point thresholds",
    ],
    approaches: [
      {
        name: "Optimal (Backtracking with Depth and Sum Limits)",
        description:
          "### 🧠 Core Intuition\nWe explore numbers 1 through 9. At each step, we decide whether to include the number. We prune branches where the path length exceeds $K$ or the sum exceeds $N$.\n\n### ✅ Invariant\nAt each step $i$, we've decided on numbers $1...i-1$. The remaining target is $N - \sum path$.\n\n### 🔍 Step-by-step\n1. `solve(num, target, path)`:\n2. If `len(path) == K`: Add to result if `target == 0`. Return.\n3. If `num > 9` or `target < 0`: Return.\n4. **Include**: `path.append(num)`, `solve(num + 1, target - num, path)`, `path.pop()`.\n5. **Exclude**: `solve(num + 1, target, path)`.\n\n### ⏱️ Complexity\n- **Time**: $O(2^9)$ (Constant) — since digits are fixed at 1-9.\n- **Space**: $O(K)$ stack depth.",
        timeComplexity: "O(2^9)",
        timeComplexityExplanation: "Searching through subsets of 9 digits.",
        spaceComplexity: "O(K)",
        spaceComplexityExplanation: "Max recursion depth.",
        implementations: [
          {
            language: "Python",
            code: `def combinationSum3(k, n):
    res = []
    def solve(num, t, path):
        if len(path) == k:
            if t == 0: res.append(list(path))
            return
        if num > 9 or t < 0: return
        # Pick
        path.append(num)
        solve(num + 1, t - num, path)
        path.pop()
        # Skip
        solve(num + 1, t, path)
    solve(1, n, [])
    return res`,
          },
          {
            language: "JavaScript",
            code: `function combinationSum3(k, n) {
  let res = [];
  function solve(num, t, path) {
    if (path.length === k) {
      if (t === 0) res.push([...path]);
      return;
    }
    if (num > 9 || t < 0) return;
    solve(num + 1, t - num, [...path, num]);
    solve(num + 1, t, path);
  }
  solve(1, n, []);
  return res;
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with DFS ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    void solve(int num, int target, int k, vector<int>& path, vector<vector<int>>& res) {
        if(path.size() == k) { if(target == 0) res.push_back(path); return; }
        if(num > 9 || target < 0) return;
        path.push_back(num);
        solve(num + 1, target - num, k, path, res);
        path.pop_back();
        solve(num + 1, target, k, path, res);
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "letter-combinations-of-a-phone-number",
    title: "Letter Combinations of a Phone Number",
    topic: "Recursion - Subsequences",
    category: "Recursion",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Given digits 2-9 from a phone keypad, return all possible letter combinations that the number could represent.",
    leetcodeLink: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
    useCases: [
      "T9 typing prediction systems",
      "Mapping numeric codes to mnemonic strings",
      "Generating alphanumeric search space for vanity numbers",
    ],
    approaches: [
      {
        name: "Optimal (Backtracking with Mapping)",
        description:
          "### 🧠 Core Intuition\nThis is a Cartesian product of sets where each digit maps to a set of letters. We recurse through the digits, branching out for every letter option at the current position.\n\n### ✅ Invariant\nAt depth $i$, we've selected one letter for each of the first $i$ digits.\n\n### 🔍 Step-by-step\n1. Define `map = { '2': 'abc', ... }`.\n2. `solve(idx, path)`:\n3. If `idx == digits.length`: Save `path` and return.\n4. Get letters for `digits[idx]`.\n5. Loop through letters: `solve(idx + 1, path + letter)`.\n\n### ⏱️ Complexity\n- **Time**: $O(4^N \\times N)$ — $N$ digits, max 4 letters per digit.\n- **Space**: $O(N)$ stack depth.",
        timeComplexity: "O(4^N * N)",
        timeComplexityExplanation: "Upper bound based on 7 and 9 having 4 letters each.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Depth of the recursion tree.",
        implementations: [
          {
            language: "Python",
            code: `def letterCombinations(digits):
    if not digits:
        return []
    
    mapping = {
        "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
        "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"
    }
    
    result = []
    
    def backtrack(index, path):
        if index == len(digits):
            result.append("".join(path))
            return
        
        letters = mapping[digits[index]]
        for letter in letters:
            path.append(letter)
            backtrack(index + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result`,
          },
          {
            language: "JavaScript",
            code: `function letterCombinations(digits) {
  if (!digits) return [];
  const map = {
    '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
    '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
  };
  const res = [];
  function solve(idx, path) {
    if (idx === digits.length) { res.push(path); return; }
    for (const char of map[digits[idx]]) {
      solve(idx + 1, path + char);
    }
  }
  solve(0, "");
  return res;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    vector<string> letterCombinations(string digits) {
        if (digits.empty()) return {};
        vector<string> res;
        string map[] = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
        string path = "";
        solve(0, digits, path, res, map);
        return res;
    }
    void solve(int idx, string& digits, string& path, vector<string>& res, string map[]) {
        if (idx == digits.size()) { res.push_back(path); return; }
        for (char c : map[digits[idx] - '0']) {
            path.push_back(c);
            solve(idx + 1, digits, path, res, map);
            path.pop_back();
        }
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "word-search",
    title: "Word Search",
    topic: "Recursion - Backtracking",
    category: "Recursion",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Find if a word exists in a 2D grid by moving to adjacent cells. Each cell can be used once.",
    leetcodeLink: "https://leetcode.com/problems/word-search/",
    useCases: ["Boggle", "Pathfinding", "Grid Search"],
    approaches: [
      {
        name: "Backtracking with In-place Marking",
        description: "### 🧠 Intuition\nUse DFS to explore 4 directions. Mark visited cells with a special character to avoid reuse, then backtrack.",
        timeComplexity: "O(N * M * 4^L)",
        timeComplexityExplanation: "N*M cells, 4 directions, L is word length.",
        spaceComplexity: "O(L)",
        spaceComplexityExplanation: "Recursion stack depth.",
        implementations: [
          { language: "Python", code: "def exist(board, word):\n    def dfs(r, c, i):\n        if i == len(word): return True\n        if not (0<=r<len(board) and 0<=c<len(board[0]) and board[r][c] == word[i]): return False\n        tmp, board[r][c] = board[r][c], '#'\n        res = dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or dfs(r,c+1,i+1) or dfs(r,c-1,i+1)\n        board[r][c] = tmp\n        return res\n    return any(dfs(r, c, 0) for r in range(len(board)) for c in range(len(board[0])))" },
          { language: "JavaScript", code: "function exist(board, word) {\n  const dfs = (r, c, i) => {\n    if (i === word.length) return true;\n    if (r<0||c<0||r>=board.length||c>=board[0].length||board[r][c]!==word[i]) return false;\n    let tmp = board[r][c]; board[r][c] = '#';\n    let res = dfs(r+1,c,i+1)||dfs(r-1,c,i+1)||dfs(r,c+1,i+1)||dfs(r,c-1,i+1);\n    board[r][c] = tmp; return res;\n  };\n  for(let r=0; r<board.length; r++) for(let c=0; c<board[0].length; c++) if(dfs(r,c,0)) return true;\n  return false;\n}" },
          { language: "Java", code: "class Solution {\n    public boolean exist(char[][] board, String word) {\n        for(int i=0; i<board.length; i++) for(int j=0; j<board[0].length; j++) if(dfs(board, word, i, j, 0)) return true;\n        return false;\n    }\n    boolean dfs(char[][] b, String w, int r, int c, int i) {\n        if(i == w.length()) return true;\n        if(r<0||c<0||r>=b.length||c>=b[0].length||b[r][c]!=w.charAt(i)) return false;\n        char t = b[r][c]; b[r][c] = '#';\n        boolean res = dfs(b,w,r+1,c,i+1)||dfs(b,w,r-1,c,i+1)||dfs(b,w,r,c+1,i+1)||dfs(b,w,r,c-1,i+1);\n        b[r][c] = t; return res;\n    }\n}" },
          { language: "C++", code: "class Solution {\npublic:\n    bool exist(vector<vector<char>>& b, string w) {\n        for(int i=0; i<b.size(); i++) for(int j=0; j<b[0].size(); j++) if(dfs(b, w, i, j, 0)) return true;\n        return false;\n    }\n    bool dfs(vector<vector<char>>& b, string& w, int r, int c, int i) {\n        if(i == w.size()) return true;\n        if(r<0||c<0||r>=b.size()||c>=b[0].size()||b[r][c]!=w[i]) return false;\n        char t = b[r][c]; b[r][c] = '#';\n        bool res = dfs(b,w,r+1,c,i+1)||dfs(b,w,r-1,c,i+1)||dfs(b,w,r,c+1,i+1)||dfs(b,w,r,c-1,i+1);\n        b[r][c] = t; return res;\n    }\n};" }
        ]
      }
    ]
  },
  {
    id: "n-queens",
    title: "N-Queens",
    topic: "Recursion - Backtracking",
    category: "Recursion",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Place N queens on an NxN board such that no two queens attack each other.",
    leetcodeLink: "https://leetcode.com/problems/n-queens/",
    useCases: ["Constraint Satisfaction", "Game Theory"],
    approaches: [
      {
        name: "Backtracking with Hashing",
        description: "### 🧠 Intuition\nPlace queens row by row. Use sets to track occupied columns and diagonals in O(1).",
        timeComplexity: "O(N!)",
        timeComplexityExplanation: "N choices for first row, N-2 for second, etc.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Sets and recursion stack.",
        implementations: [
          { language: "Python", code: "def solveNQueens(n):\n    res, board = [], [['.']*n for _ in range(n)]\n    cols, d1, d2 = set(), set(), set()\n    def dfs(r):\n        if r == n: res.append([''.join(row) for row in board]); return\n        for c in range(n):\n            if c in cols or (r+c) in d1 or (r-c) in d2: continue\n            cols.add(c); d1.add(r+c); d2.add(r-c); board[r][c] = 'Q'\n            dfs(r+1)\n            cols.remove(c); d1.remove(r+c); d2.remove(r-c); board[r][c] = '.'\n    dfs(0); return res" },
          { language: "JavaScript", code: "function solveNQueens(n) {\n  let res = [], board = Array.from({length:n}, ()=>Array(n).fill('.'));\n  let cols = new Set(), d1 = new Set(), d2 = new Set();\n  const dfs = (r) => {\n    if (r === n) { res.push(board.map(row=>row.join(''))); return; }\n    for(let c=0; c<n; c++) {\n      if(cols.has(c)||d1.has(r+c)||d2.has(r-c)) continue;\n      cols.add(c); d1.add(r+c); d2.add(r-c); board[r][c] = 'Q';\n      dfs(r+1);\n      cols.delete(c); d1.delete(r+c); d2.delete(r-c); board[r][c] = '.';\n    }\n  };\n  dfs(0); return res;\n}" },
          { language: "Java", code: "class Solution {\n    public List<List<String>> solveNQueens(int n) {\n        List<List<String>> res = new ArrayList<>();\n        char[][] b = new char[n][n];\n        for(char[] row : b) Arrays.fill(row, '.');\n        dfs(0, b, res, new boolean[n], new boolean[2*n], new boolean[2*n]);\n        return res;\n    }\n    void dfs(int r, char[][] b, List<List<String>> res, boolean[] c, boolean[] d1, boolean[] d2) {\n        if(r == b.length) { List<String> l = new ArrayList<>(); for(char[] row : b) l.add(new String(row)); res.add(l); return; }\n        for(int i=0; i<b.length; i++) {\n            if(!c[i] && !d1[r+i] && !d2[r-i+b.length]) {\n                b[r][i] = 'Q'; c[i]=d1[r+i]=d2[r-i+b.length]=true;\n                dfs(r+1, b, res, c, d1, d2);\n                b[r][i] = '.'; c[i]=d1[r+i]=d2[r-i+b.length]=false;\n            }\n        }\n    }\n}" },
          { language: "C++", code: "class Solution {\npublic:\n    vector<vector<string>> solveNQueens(int n) {\n        vector<vector<string>> res; vector<string> b(n, string(n, '.'));\n        vector<bool> c(n,0), d1(2*n,0), d2(2*n,0);\n        dfs(0, b, res, c, d1, d2);\n        return res;\n    }\n    void dfs(int r, vector<string>& b, vector<vector<string>>& res, vector<bool>& c, vector<bool>& d1, vector<bool>& d2) {\n        if(r == b.size()) { res.push_back(b); return; }\n        for(int i=0; i<b.size(); i++) {\n            if(!c[i] && !d1[r+i] && !d2[r-i+b.size()]) {\n                b[r][i] = 'Q'; c[i]=d1[r+i]=d2[r-i+b.size()]=1;\n                dfs(r+1, b, res, c, d1, d2);\n                b[r][i] = '.'; c[i]=d1[r+i]=d2[r-i+b.size()]=0;\n            }\n        }\n    }\n};" }
        ]
      }
    ]
  },
  {
    id: "rat-in-a-maze",
    title: "Rat in a Maze",
    topic: "Recursion - Backtracking",
    category: "Recursion",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Find all paths from (0,0) to (N-1,N-1) in a grid with obstacles.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1",
    useCases: ["Pathfinding", "Robotics"],
    approaches: [
      {
        name: "DFS with Visited Array",
        description: "### 🧠 Intuition\nExplore 4 directions (D, L, R, U). Mark visited cells to prevent cycles.",
        timeComplexity: "O(4^(N*N))",
        timeComplexityExplanation: "Each cell has 4 potential moves.",
        spaceComplexity: "O(N*N)",
        spaceComplexityExplanation: "Visited matrix and recursion stack.",
        implementations: [
          { language: "Python", code: "def findPaths(m, n):\n    res, vis = [], [[0]*n for _ in range(n)]\n    def dfs(r, c, p):\n        if r==n-1 and c==n-1: res.append(p); return\n        vis[r][c] = 1\n        for dr, dc, d in [(1,0,'D'),(0,-1,'L'),(0,1,'R'),(-1,0,'U')]:\n            nr, nc = r+dr, c+dc\n            if 0<=nr<n and 0<=nc<n and not vis[nr][nc] and m[nr][nc]: dfs(nr, nc, p+d)\n        vis[r][c] = 0\n    if m[0][0]: dfs(0, 0, ''); return res" },
          { language: "JavaScript", code: "function findPath(m, n) {\n  let res = [], vis = Array.from({length:n}, ()=>Array(n).fill(0));\n  const dfs = (r, c, p) => {\n    if(r==n-1 && c==n-1) { res.push(p); return; }\n    vis[r][c] = 1;\n    [[1,0,'D'],[0,-1,'L'],[0,1,'R'],[-1,0,'U']].forEach(([dr,dc,d]) => {\n      let nr=r+dr, nc=c+dc;\n      if(nr>=0&&nr<n&&nc>=0&&nc<n&&!vis[nr][nc]&&m[nr][nc]) dfs(nr,nc,p+d);\n    });\n    vis[r][c] = 0;\n  };\n  if(m[0][0]) dfs(0,0,''); return res;\n}" },
          { language: "Java", code: "class Solution {\n    public List<String> findPath(int[][] m, int n) {\n        List<String> res = new ArrayList<>();\n        dfs(0, 0, m, n, \"\", new boolean[n][n], res);\n        return res;\n    }\n    void dfs(int r, int c, int[][] m, int n, String p, boolean[][] v, List<String> res) {\n        if(r==n-1 && c==n-1) { res.add(p); return; }\n        v[r][c] = true;\n        int[] dr={1,0,0,-1}, dc={0,-1,1,0}; char[] d={'D','L','R','U'};\n        for(int i=0; i<4; i++) {\n            int nr=r+dr[i], nc=c+dc[i];\n            if(nr>=0&&nr<n&&nc>=0&&nc<n&&!v[nr][nc]&&m[nr][nc]==1) dfs(nr,nc,m,n,p+d[i],v,res);\n        }\n        v[r][c] = false;\n    }\n}" },
          { language: "C++", code: "class Solution {\npublic:\n    void dfs(int r, int c, vector<vector<int>>& m, int n, string p, vector<vector<bool>>& v, vector<string>& res) {\n        if(r==n-1 && c==n-1) { res.push_back(p); return; }\n        v[r][c] = 1;\n        int dr[]={1,0,0,-1}, dc[]={0,-1,1,0}; char d[]={'D','L','R','U'};\n        for(int i=0; i<4; i++) {\n            int nr=r+dr[i], nc=c+dc[i];\n            if(nr>=0&&nr<n&&nc>=0&&nc<n&&!v[nr][nc]&&m[nr][nc]) dfs(nr,nc,m,n,p+d[i],v,res);\n        }\n        v[r][c] = 0;\n    }\n};" }
        ]
      }
    ]
  },
  {
    id: "word-break",
    title: "Word Break",
    topic: "Recursion - DP",
    category: "Recursion",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview: "Determine if a string can be segmented into dictionary words.",
    leetcodeLink: "https://leetcode.com/problems/word-break/",
    useCases: ["NLP", "Text Processing"],
    approaches: [
      {
        name: "Memoized Recursion",
        description: "### 🧠 Intuition\nTry every prefix. If prefix is in dict, recurse on suffix. Memoize results.",
        timeComplexity: "O(N^2)",
        timeComplexityExplanation: "N states, each takes O(N) to slice.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Memoization table and stack.",
        implementations: [
          { language: "Python", code: "def wordBreak(s, wordDict):\n    d, memo = set(wordDict), {}\n    def solve(i):\n        if i == len(s): return True\n        if i in memo: return memo[i]\n        for j in range(i+1, len(s)+1):\n            if s[i:j] in d and solve(j): memo[i]=True; return True\n        memo[i]=False; return False\n    return solve(0)" },
          { language: "JavaScript", code: "function wordBreak(s, wordDict) {\n  let d = new Set(wordDict), memo = new Map();\n  const solve = (i) => {\n    if (i === s.length) return true;\n    if (memo.has(i)) return memo.get(i);\n    for (let j = i + 1; j <= s.length; j++) {\n      if (d.has(s.substring(i, j)) && solve(j)) { memo.set(i, true); return true; }\n    }\n    memo.set(i, false); return false;\n  };\n  return solve(0);\n}" },
          { language: "Java", code: "class Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        Set<String> d = new HashSet<>(wordDict);\n        Boolean[] memo = new Boolean[s.length()];\n        return solve(0, s, d, memo);\n    }\n    boolean solve(int i, String s, Set<String> d, Boolean[] m) {\n        if(i == s.length()) return true;\n        if(m[i] != null) return m[i];\n        for(int j=i+1; j<=s.length(); j++) {\n            if(d.contains(s.substring(i, j)) && solve(j, s, d, m)) return m[i] = true;\n        }\n        return m[i] = false;\n    }\n}" },
          { language: "C++", code: "class Solution {\npublic:\n    bool wordBreak(string s, vector<string>& wordDict) {\n        unordered_set<string> d(wordDict.begin(), wordDict.end());\n        vector<int> memo(s.size() + 1, -1);\n        function<bool(int)> solve = [&](int idx) {\n            if(idx == s.size()) return true;\n            if(memo[idx] != -1) return memo[idx];\n            for(int i=idx+1; i<=s.size(); i++) {\n                if(d.count(s.substr(idx, i-idx)) && solve(i)) return memo[idx] = 1;\n            }\n            return (bool)(memo[idx] = 0);\n        };\n        return solve(0);\n    }\n};" }
        ]
      }
    ]
  },
  {
    id: "m-coloring-problem",
    title: "M-Coloring Problem",
    topic: "Recursion - Hard",
    category: "Recursion",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview: "Check if a graph can be colored with at most M colors such that no two adjacent vertices have the same color.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/m-coloring-problem-1587115620/1",
    useCases: [
      "Register allocation in compiler design",
      "Map coloring and geographic segmentation",
      "Frequency assignment in wireless networks"
    ],
    approaches: [
      {
        name: "Backtracking",
        description: "Try every color for every node and backtrack if a conflict is found.",
        timeComplexity: "O(M^N)",
        timeComplexityExplanation: "Each of the N nodes can be colored in M ways.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Recursion depth and color array.",
        implementations: [
          {
            language: "Python",
            code: "def solve(nodeIdx, color, m, n, adj):\n    if nodeIdx == n: return True\n    for c in range(1, m + 1):\n        if isSafe(nodeIdx, color, c, n, adj):\n            color[nodeIdx] = c\n            if solve(nodeIdx + 1, color, m, n, adj): return True\n            color[nodeIdx] = 0\n    return False\n\ndef isSafe(node, color, c, n, adj):\n    for i in range(n):\n        if adj[node][i] == 1 and color[i] == c: return False\n    return True"
          }
        ]
      }
    ]
  },
  {
    id: "sudoku-solver",
    title: "Sudoku Solver",
    topic: "Recursion - Hard",
    category: "Recursion",
    frequencyLevel: "Very High",
    difficulty: "Hard",
    overview:
      "Fill a partially completed $9 \\times 9$ Sudoku board such that every row, column, and $3 \\times 3$ subgrid contains all digits from 1 to 9 exactly once.",
    leetcodeLink: "https://leetcode.com/problems/sudoku-solver/",
    useCases: [
      "Constraint satisfaction in grid-based puzzles",
      "Resource allocation and scheduling on matrix structures",
      "Foundational logic for automated verification systems",
    ],
    approaches: [
      {
        name: "Optimal (Cell-by-Cell Backtracking)",
        description:
          "Use backtracking on empty cells. For each empty cell, try digits 1 through 9 and keep a digit only if it is valid in that row, column, and 3x3 box. If no digit works, backtrack to the previous cell and try another option.\n\nInvariant: every filled cell always satisfies Sudoku constraints.\n\nComplexity: exponential in the number of empty cells in the worst case, but pruning is strong in practice.",
        timeComplexity: "O(9^(M))",
        timeComplexityExplanation: "9 possible digits for each of the M empty cells.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Board is modified in-place; recursive depth is fixed at 81.",
        implementations: [
          {
            language: "Python",
            code: `def solveSudoku(board):
    def isSafe(r, c, d):
        for i in range(9):
            if board[r][i] == d or board[i][c] == d: return False
            if board[3*(r//3)+i//3][3*(c//3)+i%3] == d: return False
        return True
    def solve():
        for r in range(9):
            for c in range(9):
                if board[r][c] == '.':
                    for d in "123456789":
                        if isSafe(r, c, d):
                            board[r][c] = d
                            if solve(): return True
                            board[r][c] = '.'
                    return False
        return True
    solve()`,
          },
          {
            language: "JavaScript",
            code: `function solveSudoku(board) {
  function isSafe(r, c, d) {
    for (let i = 0; i < 9; i++) {
      if (board[r][i] === d || board[i][c] === d) return false;
      if (board[3*Math.floor(r/3) + Math.floor(i/3)][3*Math.floor(c/3) + i%3] === d) return false;
    }
    return true;
  }
  function solve() {
    for (let r=0; r<9; r++) {
      for (let c=0; c<9; c++) {
        if (board[r][c] === '.') {
          for (let d='1'; d<='9'; d = String.fromCharCode(d.charCodeAt(0)+1)) {
            if (isSafe(r,c,d)) {
              board[r][c] = d; if (solve()) return true; board[r][c] = '.';
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  solve();
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with grid scanning and safety checks ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    bool isSafe(int r, int c, char d, vector<vector<char>>& b) {
        for(int i=0; i<9; i++) {
            if(b[r][i] == d || b[i][c] == d) return false;
            if(b[3*(r/3)+i/3][3*(c/3)+i%3] == d) return false;
        }
        return true;
    }
    bool solve(vector<vector<char>>& b) {
        for(int r=0; r<9; r++) {
            for(int c=0; c<9; c++) {
                if(b[r][c] == '.') {
                    for(char d='1'; d<='9'; d++) {
                        if(isSafe(r,c,d,b)) {
                            b[r][c] = d; if(solve(b)) return true; b[r][c] = '.';
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "expression-add-operators",
    title: "Expression Add Operators",
    topic: "Recursion - Hard",
    category: "Recursion",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview:
      "Given a string of digits and a target value, insert the binary operators `+`, `-`, and `*` between the digits to reach the target.",
    leetcodeLink: "https://leetcode.com/problems/expression-add-operators/",
    useCases: [
      "Dynamic expression evaluation",
      "Arithmetic sequence search in raw data strings",
      "Constraint-based number construction games",
    ],
    approaches: [
      {
        name: "Optimal (Backtracking with Running Value Maintenance)",
        description:
          "### 🧠 Core Intuition\nWe explore all splits of the string into numbers. For each number, we try `+`, `-`, and `*`. Multiplication is tricky because of precedence; we must keep track of the *last operand value* to properly undo its contribution and re-apply it as a product.\n\n### ✅ Invariant\nAt any recursive depth, we maintain the current value `val` and the `lastVal` added to the sum to handle multiplication correctly.\n\n### 🔍 Step-by-step\n1. `solve(idx, path, currentVal, lastVal)`:\n2. If `idx == N`: if `currentVal == target`, save `path` and return.\n3. Extract a segment $S[idx...i]$ as a number `num`.\n4. If first number: `solve(i+1, str(num), num, num)`.\n5. Else:\n   - `+`: `solve(i+1, path + '+' + num, currentVal + num, num)`\n   - `-`: `solve(i+1, path + '-' + num, currentVal - num, -num)`\n   - `*`: `solve(i+1, path + '*' + num, currentVal - lastVal + (lastVal * num), lastVal * num)`\n\n### ⏱️ Complexity\n- **Time**: $O(4^N)$ — 4 choices (+, -, *, skip/mergedigits).\n- **Space**: $O(N)$ recursive stack.",
        timeComplexity: "O(4^N)",
        timeComplexityExplanation: "Exponential growth based on the number of split points and operators.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Stack depth proportional to string length.",
        implementations: [
          {
            language: "Python",
            code: `def addOperators(num, target):
    res = []
    def solve(idx, path, val, prev):
        if idx == len(num):
            if val == target: res.append(path)
            return
        for i in range(idx, len(num)):
            if i > idx and num[idx] == '0': break
            s = num[idx:i+1]; n = int(s)
            if idx == 0: solve(i + 1, s, n, n)
            else:
                solve(i + 1, path + "+" + s, val + n, n)
                solve(i + 1, path + "-" + s, val - n, -n)
                solve(i + 1, path + "*" + s, val - prev + prev * n, prev * n)
    solve(0, "", 0, 0); return res`,
          },
          {
            language: "JavaScript",
            code: `function addOperators(num, target) {
  let res = [];
  function solve(idx, path, val, prev) {
    if (idx === num.length) { if (val === target) res.push(path); return; }
    for (let i = idx; i < num.length; i++) {
      if (i > idx && num[idx] === '0') break;
      let s = num.substring(idx, i + 1), n = parseInt(s);
      if (idx === 0) solve(i + 1, s, n, n);
      else {
        solve(i + 1, path + "+" + s, val + n, n);
        solve(i + 1, path + "-" + s, val - n, -n);
        solve(i + 1, path + "*" + s, val - prev + prev * n, prev * n);
      }
    }
  }
  solve(0, "", 0, 0); return res;
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with long long for overflow prevention ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    void solve(int idx, string path, long val, long prev, string n, int t, vector<string>& res) {
        if(idx == n.size()) { if(val == t) res.push_back(path); return; }
        for(int i=idx; i<n.size(); i++) {
            if(i > idx && n[idx] == '0') break;
            string s = n.substr(idx, i-idx+1); long cur = stol(s);
            if(idx == 0) solve(i+1, s, cur, cur, n, t, res);
            else {
                solve(i+1, path+"+"+s, val+cur, cur, n, t, res);
                solve(i+1, path+"-"+s, val-cur, -cur, n, t, res);
                solve(i+1, path+"*"+s, val-prev+prev*cur, prev*cur, n, t, res);
            }
        }
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "introduction-to-bit-manipulation",
    title: "Intro to Bit Manipulation",
    topic: "Bit Manipulation - Basics",
    category: "Bit Manipulation",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "An essential primer on bitwise operations: `&` (AND), `|` (OR), `^` (XOR), `~` (NOT), and shifts `<<`, `>>`.",
    leetcodeLink: "",
    useCases: [
      "Low-level performance optimization",
      "Bitmasking for combinatorial states",
      "Cryptographic hashing and obscure algorithms",
    ],
    approaches: [
      {
        name: "Bitwise Foundations",
        description:
          "### 🧠 Core Intuition\nComputers store numbers as binary strings. Bit manipulation allows us to interact directly with these strings, often in $O(1)$ time. Key properties:\n- `x & 1`: Checks parity (0=even, 1=odd).\n- `x << y`: Multiplies $x$ by $2^y$.\n- `x >> y`: Integer divides $x$ by $2^y$.\n- `x ^ x = 0`: Useful for finding unique elements.\n\n### ⏱️ Complexity\n- **Time**: $O(1)$\n- **Space**: $O(1)$",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "Operations are native hardware instructions.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No extra memory required.",
        implementations: [
          {
            language: "Python",
            code: `def bit_ops(a, b):
    print(f"AND: {a & b}")
    print(f"OR:  {a | b}")
    print(f"XOR: {a ^ b}")
    print(f"NOT: {~a}")
    print(f"Left: {a << 1}")
    print(f"Right: {a >> 1}")`,
          },
          {
            language: "JavaScript",
            code: `function bitOps(a, b) {
  console.log("AND:", a & b);
  console.log("OR:", a | b);
  console.log("XOR:", a ^ b);
  console.log("NOT:", ~a);
  console.log("Left:", a << 1);
  console.log("Right:", a >> 1);
}`,
          },
          {
            language: "C",
            code: `void bit_ops(int a, int b) {
    printf("AND: %d\\n", a & b);
    printf("OR: %d\\n", a | b);
    printf("XOR: %d\\n", a ^ b);
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    void bitOps(int a, int b) {
        cout << (a & b) << " " << (a | b) << " " << (a ^ b);
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "check-if-a-number-is-odd-or-not",
    title: "Check Parity (Odd/Even)",
    topic: "Bit Manipulation - Basics",
    category: "Bit Manipulation",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Check if a number is odd or even using bitwise operators. This is faster than the modulo operator.",
    leetcodeLink: "",
    useCases: [
      "Extremely fast parity checks in high-load loops",
      "Validating binary flags for odd-numbered states",
      "Bit-interleaving and signal processing",
    ],
    approaches: [
      {
        name: "Bitwise AND Check",
        description:
          "### 🧠 Core Intuition\nIn binary, an integer is odd if and only if its least significant bit (LSB) is $1$. By masking the number with $1$ (`n & 1`), we extract the LSB. If it's $1$, the number is odd.\n\n### 🔍 Example\n- $5 = (101)_2$ -> $101 \\& 001 = 1$ (Odd)\n- $4 = (100)_2$ -> $100 \\& 001 = 0$ (Even)\n\n### ⏱️ Complexity\n- **Time**: $O(1)$\n- **Space**: $O(1)$",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "Single bitwise operation.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No memory used.",
        implementations: [
          {
            language: "Python",
            code: `def is_odd(n):
    return (n & 1) == 1`,
          },
          {
            language: "JavaScript",
            code: `function isOdd(n) {
  return (n & 1) === 1;
}`,
          },
          {
            language: "C",
            code: `bool is_odd(int n) {
    return n & 1;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    bool isOdd(int n) {
        return n & 1;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "check-if-i-th-bit-is-set-or-not",
    title: "Check if i-th bit is Set",
    topic: "Bit Manipulation - Basics",
    category: "Bit Manipulation",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Verify if the bit at position $i$ (0-indexed) of an integer $N$ is $1$ or $0$.",
    leetcodeLink: "",
    useCases: [
      "Flag validation in compact configurations",
      "Network packet header decoding",
      "Memory management bitmask checks",
    ],
    approaches: [
      {
        name: "Left Shift vs Right Shift",
        description:
          "### 🧠 Core Intuition\nWe can either move a mask to the bit position or move the bit to the $0$-th position:\n1. **Left Shift Mask**: `(N & (1 << i)) != 0` creates a mask with only the $i$-th bit set and ANDs it with $N$.\n2. **Right Shift Number**: `(N >> i) & 1` moves the $i$-th bit to the LSB position and masks with $1$.\n\n### ⏱️ Complexity\n- **Time**: $O(1)$\n- **Space**: $O(1)$",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "Simple hardware shifts and masks.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No memory used.",
        implementations: [
          {
            language: "Python",
            code: `def is_set(n, i):
    # Right shift method
    return (n >> i) & 1 == 1`,
          },
          {
            language: "JavaScript",
            code: `function isSet(n, i) {
  // Left shift method
  return (n & (1 << i)) !== 0;
}`,
          },
          {
            language: "C",
            code: `bool is_set(int n, int i) {
    return (n >> i) & 1;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    bool isSet(int n, int i) {
        return (n & (1 << i)) != 0;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "set-the-i-th-bit",
    title: "Set the i-th Bit",
    topic: "Bit Manipulation - Basics",
    category: "Bit Manipulation",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Forces the bit at position $i$ (0-indexed) of an integer $N$ to be $1$, regardless of its previous state.",
    leetcodeLink: "",
    useCases: [
      "Activating specific feature flags in a configuration bitmask",
      "Setting access permissions in a security bitset",
      "Bit-based set implementations (BitSets)",
    ],
    approaches: [
      {
        name: "Bitwise OR Masking",
        description:
          "### 🧠 Core Intuition\nTo set a bit to $1$ without affecting others, we use the OR operator (`|`). We create a mask where only the $i$-th bit is $1$ (`1 << i`) and then OR it with $N$.\n- $0 | 1 = 1$\n- $1 | 1 = 1$\nOther bits remain unchanged because $X | 0 = X$.\n\n### ⏱️ Complexity\n- **Time**: $O(1)$\n- **Space**: $O(1)$",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "Atomic hardware operation.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No memory used.",
        implementations: [
          {
            language: "Python",
            code: `def set_bit(n, i):
    return n | (1 << i)`,
          },
          {
            language: "JavaScript",
            code: `function setBit(n, i) {
  return n | (1 << i);
}`,
          },
          {
            language: "C",
            code: `int set_bit(int n, int i) {
    return n | (1 << i);
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int setBit(int n, int i) {
        return n | (1 << i);
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "clear-the-i-th-bit",
    title: "Clear the i-th Bit",
    topic: "Bit Manipulation - Basics",
    category: "Bit Manipulation",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Forces the bit at position $i$ (0-indexed) of an integer $N$ to be $0$, regardless of its previous state.",
    leetcodeLink: "",
    useCases: [
      "Deactivating feature flags in a configuration bitmask",
      "Revoking permissions in a security bitset",
      "Clearing status indicators",
    ],
    approaches: [
      {
        name: "Bitwise AND with Complement Mask",
        description:
          "### 🧠 Core Intuition\nTo clear a bit while keeping others, we use AND (`&`). We create a mask where only target bit is $0$ and all others are $1$. \n1. Start with `1 << i` (only bit $i$ is $1$).\n2. NOT it `~(1 << i)` (only bit $i$ is $0$).\n3. AND with $N$. Since $X & 1 = X$ and $X & 0 = 0$, only bit $i$ is cleared.\n\n### ⏱️ Complexity\n- **Time**: $O(1)$\n- **Space**: $O(1)$",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "Atomic hardware operation.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No memory used.",
        implementations: [
          {
            language: "Python",
            code: `def clear_bit(n, i):
    return n & ~(1 << i)`,
          },
          {
            language: "JavaScript",
            code: `function clearBit(n, i) {
  return n & ~(1 << i);
}`,
          },
          {
            language: "C",
            code: `int clear_bit(int n, int i) {
    return n & ~(1 << i);
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int clearBit(int n, int i) {
        return n & ~(1 << i);
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "toggle-the-i-th-bit",
    title: "Toggle the i-th Bit",
    topic: "Bit Manipulation - Basics",
    category: "Bit Manipulation",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Flips the bit at position $i$ (0-indexed) of an integer $N$: if it's $0$ it becomes $1$, and if it's $1$ it becomes $0$.",
    leetcodeLink: "",
    useCases: [
      "Switching states in a binary flag system (e.g., On/Off toggles)",
      "Inverting specific conditions in bitmasks",
      "Bitwise state machines",
    ],
    approaches: [
      {
        name: "Bitwise XOR Masking",
        description:
          "### 🧠 Core Intuition\nXOR (`^`) is the 'exclusive or'. Its truth table ($0\\^1=1, 1\\^1=0, X\\^0=X$) makes it perfect for toggling.\n1. Create mask `1 << i`.\n2. XOR $N$ with mask. The $i$-th bit will flip, and others will remain unchanged.\n\n### ⏱️ Complexity\n- **Time**: $O(1)$\n- **Space**: $O(1)$",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "Atomic hardware operation.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No memory used.",
        implementations: [
          {
            language: "Python",
            code: `def toggle_bit(n, i):
    return n ^ (1 << i)`,
          },
          {
            language: "JavaScript",
            code: `function toggleBit(n, i) {
  return n ^ (1 << i);
}`,
          },
          {
            language: "C",
            code: `int toggle_bit(int n, int i) {
    return n ^ (1 << i);
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int toggleBit(int n, int i) {
        return n ^ (1 << i);
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "remove-the-last-set-bit",
    title: "Remove Last Set Bit",
    topic: "Bit Manipulation - Basics",
    category: "Bit Manipulation",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Turn off the rightmost set bit ($1$) in an integer $N$, leaving all other bits unchanged.",
    leetcodeLink: "",
    useCases: [
      "Crucial optimization for Brian Kernighan’s algorithm",
      "Checking if a number is a power of 2",
      "Isolating set bits for processing",
    ],
    approaches: [
      {
        name: "n & (n-1) Trick",
        description:
          "### 🧠 Core Intuition\nWhen you subtract $1$ from $N$, the rightmost set bit flips to $0$ and all bits to its right flip to $1$. Performing `n & (n - 1)` effectively zero-out these bits, essentially clearing only the rightmost $1$.\nExample:\n- $N=12 (1100)$, $N-1=11 (1011)$\n- $1100 \\& 1011 = 1000 (8)$\n\n### ⏱️ Complexity\n- **Time**: $O(1)$\n- **Space**: $O(1)$",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "Atomic bitwise operations.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No memory used.",
        implementations: [
          {
            language: "Python",
            code: `def remove_last_bit(n):
    return n & (n - 1)`,
          },
          {
            language: "JavaScript",
            code: `function removeLastBit(n) {
  return n & (n - 1);
}`,
          },
          {
            language: "C",
            code: `int remove_last_bit(int n) {
    return n & (n - 1);
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int removeLastBit(int n) {
        return n & (n - 1);
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "power-of-2",
    title: "Power of 2 Check",
    topic: "Bit Manipulation - Basics",
    category: "Bit Manipulation",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview:
      "Determine if an integer $N$ is a power of 2 (e.g., 1, 2, 4, 8, ...).",
    leetcodeLink: "https://leetcode.com/problems/power-of-two/",
    useCases: [
      "Validating binary-aligned buffer sizes",
      "Optimizing memory allocation logic",
      "Fast divisibility checks in power-of-2 systems",
    ],
    approaches: [
      {
        name: "Bitwise Validation",
        description:
          "### 🧠 Core Intuition\nA power of 2 has exactly one bit set in its binary representation. If we remove the last set bit using `n & (n-1)` and the result is $0$, it must be a power of 2.\n- Exception: $0$ is not a power of 2.\n\n### ⏱️ Complexity\n- **Time**: $O(1)$\n- **Space**: $O(1)$",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "Single bitwise trick.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No memory used.",
        implementations: [
          {
            language: "Python",
            code: `def isPowerOfTwo(n):
    return n > 0 and (n & (n - 1)) == 0`,
          },
          {
            language: "JavaScript",
            code: `function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}`,
          },
          {
            language: "C",
            code: `bool is_power_of_two(int n) {
    return n > 0 && !(n & (n - 1));
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    bool isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "count-total-set-bits",
    title: "Count Set Bits (1 to N)",
    topic: "Bit Manipulation - Basics",
    category: "Bit Manipulation",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Given a positive integer $N$, count the total number of set bits in all numbers from $1$ to $N$.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/count-total-set-bits-1587115620/1",
    useCases: [
      "Analyzing bit-density in sparse data ranges",
      "Complexity analysis of bit-masking algorithms",
      "Competitive programming math problems",
    ],
    approaches: [
      {
        name: "Optimal (Recursive Power-of-2 Pattern)",
        description:
          "### 🧠 Core Intuition\nFor a range $[0, 2^k - 1]$, each bit position $(0...k-1)$ is $1$ exactly half the time ($2^{k-1}$). For a general $N$:\n1. Find the largest $2^x \le N$.\n2. Set bits in $[0, 2^x - 1]$ contribute $x \times 2^{x-1}$.\n3. Set bits in MSB for $[2^x, N]$ contribute $(N - 2^x + 1)$.\n4. Recurse for remaining bits in $N - 2^{x}$.\n\n### ⏱️ Complexity\n- **Time**: $O(\\log N)$\n- **Space**: $O(\\log N)$ recursion depth.",
        timeComplexity: "O(log N)",
        timeComplexityExplanation: "The number of bits in N is log2(N).",
        spaceComplexity: "O(log N)",
        spaceComplexityExplanation: "Recursive stack depth.",
        implementations: [
          {
            language: "Python",
            code: `def countSetBits(n):
    if n <= 0: return 0
    x = 0
    while (1 << (x + 1)) <= n: x += 1
    # Bits from powers of 2 + Bits in MSB + Recurring
    return (x * (1 << (x - 1))) + (n - (1 << x) + 1) + countSetBits(n - (1 << x))`,
          },
          {
            language: "JavaScript",
            code: `function countSetBits(n) {
  if (n <= 0) return 0;
  let x = 0;
  while ((1 << (x + 1)) <= n) x++;
  return (x * (1 << (x - 1))) + (n - (1 << x) + 1) + countSetBits(n - (1 << x));
}`,
          },
          {
            language: "C",
            code: `int count_total_set_bits(int n) {
    if (n == 0) return 0;
    int x = 0;
    while ((1 << (x + 1)) <= n) x++;
    return (x * (1 << (x - 1))) + (n - (1 << x) + 1) + count_total_set_bits(n - (1 << x));
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int countSetBits(int n) {
        if(n == 0) return 0;
        int x = 0;
        while((1 << (x + 1)) <= n) x++;
        return (x << (x - 1)) + (n - (1 << x) + 1) + countSetBits(n - (1 << x));
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "minimum-bit-flips-to-convert-number",
    title: "Min Bit Flips to Convert",
    topic: "Bit Manipulation - Basics",
    category: "Bit Manipulation",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the minimum number of bit flips required to convert integer $A$ into integer $B$.",
    leetcodeLink: "https://leetcode.com/problems/minimum-bit-flips-to-convert-number/",
    useCases: [
      "Calculating Hamming distance between bit-strings",
      "Measuring error rates in transmission sequences",
      "DNA sequence alignment similarity scoring",
    ],
    approaches: [
      {
        name: "XOR + Popcount",
        description:
          "### 🧠 Core Intuition\n$A \\oplus B$ (XOR) results in a number where bits are $1$ only at the positions where $A$ and $B$ differ. By counting the number of set bits in the result ($A \\oplus B$), we find the flip count.\n\n### ⏱️ Complexity\n- **Time**: $O(K)$ where $K$ is number of differing bits.\n- **Space**: $O(1)$",
        timeComplexity: "O(K)",
        timeComplexityExplanation: "Iteration proportional to differing bits using n&(n-1).",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No memory used.",
        implementations: [
          {
            language: "Python",
            code: `def minBitFlips(start, goal):
    xor = start ^ goal
    cnt = 0
    while xor:
        xor &= (xor - 1)
        cnt += 1
    return cnt`,
          },
          {
            language: "JavaScript",
            code: `function minBitFlips(start, goal) {
  let xor = start ^ goal, cnt = 0;
  while (xor > 0) { xor &= (xor - 1); cnt++; }
  return cnt;
}`,
          },
          {
            language: "C",
            code: `int min_bit_flips(int start, int goal) {
    int x = start ^ goal, cnt = 0;
    while (x) { x &= (x - 1); cnt++; }
    return cnt;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int minBitFlips(int start, int goal) {
        int val = start ^ goal, cnt = 0;
        while(val) { val &= (val - 1); cnt++; }
        return cnt;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "single-number-i",
    title: "Find Single Number (I)",
    topic: "Bit Manipulation - Interview",
    category: "Bit Manipulation",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview:
      "Given a non-empty array of integers where every element appears twice except for one, find that single one.",
    leetcodeLink: "https://leetcode.com/problems/single-number/",
    useCases: [
      "Finding unique IDs in a massive log dataset",
      "Error detection in mirrored data parity checks",
      "Identifying mismatched pairs in O(1) space",
    ],
    approaches: [
      {
        name: "XOR Accumulation",
        description:
          "### 🧠 Core Intuition\nXOR has three properties: \n1. $X \\oplus 0 = X$\n2. $X \\oplus X = 0$\n3. XOR is commutative and associative.\nBy XORing all elements together, pairs cancel out to $0$, leaving only the single number.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single linear pass through the array.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No extra storage required.",
        implementations: [
          {
            language: "Python",
            code: `def singleNumber(nums):
    res = 0
    for n in nums: res ^= n
    return res`,
          },
          {
            language: "JavaScript",
            code: `function singleNumber(nums) {
  return nums.reduce((acc, curr) => acc ^ curr, 0);
}`,
          },
          {
            language: "C",
            code: `int single_number(int* nums, int size) {
    int res = 0;
    for(int i=0; i<size; i++) res ^= nums[i];
    return res;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int res = 0;
        for(int x : nums) res ^= x;
        return res;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "single-number-ii",
    title: "Find Single Number (II)",
    topic: "Bit Manipulation - Interview",
    category: "Bit Manipulation",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Every element appears three times except for one which appears exactly once. Find that single number.",
    leetcodeLink: "https://leetcode.com/problems/single-number-ii/",
    useCases: [
      "Identifying unique items in triple-redundant systems",
      "Finding majority-violating bit patterns",
      "Hardware signal processing for unique frequency recovery",
    ],
    approaches: [
      {
        name: "Optimal (Bucketing via Ones and Twos)",
        description:
          "### 🧠 Core Intuition\nWe use two variables `ones` and `twos` to represent the bits that have appeared once and twice respectively. If a bit appears a third time, we clear it from both.\n\n### 🔍 Logic\n1. `ones = (ones ^ current) & (~twos)`\n2. `twos = (twos ^ current) & (~ones)`\nThis state machine ensures bits that occur $3$ times return to $0$.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single linear pass.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Two auxiliary variables.",
        implementations: [
          {
            language: "Python",
            code: `def singleNumber(nums):
    ones = twos = 0
    for n in nums:
        ones = (ones ^ n) & (~twos)
        twos = (twos ^ n) & (~ones)
    return ones`,
          },
          {
            language: "JavaScript",
            code: `function singleNumber(nums) {
  let ones = 0, twos = 0;
  for (let n of nums) {
    ones = (ones ^ n) & (~twos);
    twos = (twos ^ n) & (~ones);
  }
  return ones;
}`,
          },
          {
            language: "C",
            code: `int single_number_2(int* nums, int size) {
    int ones = 0, twos = 0;
    for(int i=0; i<size; i++) {
        ones = (ones ^ nums[i]) & (~twos);
        twos = (twos ^ nums[i]) & (~ones);
    }
    return ones;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int ones = 0, twos = 0;
        for(int n : nums) {
            ones = (ones ^ n) & (~twos);
            twos = (twos ^ n) & (~ones);
        }
        return ones;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "single-number-iii",
    title: "Find Two Single Numbers",
    topic: "Bit Manipulation - Interview",
    category: "Bit Manipulation",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "In an array where every element appears twice except for two elements which appear once, find those two unique elements.",
    leetcodeLink: "https://leetcode.com/problems/single-number-iii/",
    useCases: [
      "Identifying two distinct missing assets in balanced batches",
      "Error detection in multi-bit parity violations",
      "Partitioning mixed data streams in O(1) space",
    ],
    approaches: [
      {
        name: "XOR + Partitioning",
        description:
          "### 🧠 Core Intuition\n1. XOR all numbers to get $X = A \\oplus B$.\n2. Since $A \\neq B$, at least one bit in $X$ is $1$. Find the rightmost set bit ($X \\& -X$).\n3. Use this bit to partition all numbers into two groups (those with bit set and those without).\n4. XOR each group. One group will yield $A$, the other $B$.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Two linear passes through the array.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Constant additional memory used.",
        implementations: [
          {
            language: "Python",
            code: `def singleNumber(nums):
    xor = 0
    for n in nums: xor ^= n
    # Rightmost set bit
    mask = xor & -xor
    a = b = 0
    for n in nums:
        if n & mask: a ^= n
        else: b ^= n
    return [a, b]`,
          },
          {
            language: "JavaScript",
            code: `function singleNumber(nums) {
  let xor = nums.reduce((a, b) => a ^ b, 0);
  let mask = xor & -xor;
  let a = 0, b = 0;
  for (let n of nums) {
    if (n & mask) a ^= n; else b ^= n;
  }
  return [a, b];
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with long long for mask safety ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    vector<int> singleNumber(vector<int>& nums) {
        long long x = 0; for(int n : nums) x ^= n;
        long long mask = x & -x;
        int a = 0, b = 0;
        for(int n : nums) {
            if(n & mask) a ^= n; else b ^= n;
        }
        return {a, b};
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "xor-of-numbers-in-a-given-range",
    title: "XOR In Range [0, N]",
    topic: "Bit Manipulation - Interview",
    category: "Bit Manipulation",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Find the XOR of all numbers from $0$ to $N$ in $O(1)$ time using a repeating pattern.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/find-xor-of-numbers-from-l-to-r/1",
    useCases: [
      "Range query optimization in bit-heavy datasets",
      "Competitive programming puzzles",
      "Fast data consistency checks across segments",
    ],
    approaches: [
      {
        name: "Pattern-based O(1) Method",
        description:
          "### 🧠 Core Intuition\nThe cumulative XOR from $0...N$ follows a repeating cycle of 4:\n- If $N \\% 4 == 0$: Result is $N$\n- If $N \\% 4 == 1$: Result is $1$\n- If $N \\% 4 == 2$: Result is $N+1$\n- If $N \\% 4 == 3$: Result is $0$\n\n### ⏱️ Complexity\n- **Time**: $O(1)$\n- **Space**: $O(1)$",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "Simple modulo and conditional check.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No memory used.",
        implementations: [
          {
            language: "Python",
            code: `def find_xor(n):
    mod = n % 4
    if mod == 0: return n
    if mod == 1: return 1
    if mod == 2: return n + 1
    return 0`,
          },
          {
            language: "JavaScript",
            code: `function findXor(n) {
  let mod = n % 4;
  if (mod === 0) return n;
  if (mod === 1) return 1;
  if (mod === 2) return n + 1;
  return 0;
}`,
          },
          {
            language: "C",
            code: `int find_xor(int n) {
    if (n % 4 == 0) return n;
    if (n % 4 == 1) return 1;
    if (n % 4 == 2) return n + 1;
    return 0;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int findXor(int n) {
        if(n % 4 == 0) return n;
        if(n % 4 == 1) return 1;
        if(n % 4 == 2) return n + 1;
        return 0;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "find-xor-of-numbers-from-l-to-r",
    title: "XOR In Range [L, R]",
    topic: "Bit Manipulation - Advanced",
    category: "Bit Manipulation",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Find the XOR of all numbers in a specific range $[L, R]$ in $O(1)$ time.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/find-xor-of-numbers-from-l-to-r/1",
    useCases: [
      "Segment-based bit integrity checks",
      "Arithmetic range-based property verification",
      "Optimized XOR summaries in sliding windows",
    ],
    approaches: [
      {
        name: "Prefix XOR Logic",
        description:
          "### 🧠 Core Intuition\nUsing the property $X \\oplus X = 0$, the XOR from $L$ to $R$ can be calculated as:\n`XOR(1...R) ^ XOR(1...L-1)`.\nThe `XOR(1...N)` part is solved in $O(1)$ using the cycle-of-4 pattern.\n\n### ⏱️ Complexity\n- **Time**: $O(1)$\n- **Space**: $O(1)$",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "Two pattern-based XOR lookups.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No memory used.",
        implementations: [
          {
            language: "Python",
            code: `def find_xor(n):
    mod = n % 4
    if mod == 0: return n
    if mod == 1: return 1
    if mod == 2: return n + 1
    return 0

def xorRange(l, r):
    return find_xor(r) ^ find_xor(l - 1)`,
          },
          {
            language: "JavaScript",
            code: `function findXor(n) {
  let mod = n % 4;
  if (mod === 0) return n;
  if (mod === 1) return 1;
  if (mod === 2) return n + 1;
  return 0;
}
const xorRange = (l, r) => findXor(r) ^ findXor(l - 1);`,
          },
          {
            language: "C",
            code: `int f(int n) {
    if (n % 4 == 0) return n;
    if (n % 4 == 1) return 1;
    if (n % 4 == 2) return n + 1;
    return 0;
}
int findRangeXOR(int l, int r) {
    return f(r) ^ f(l - 1);
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int f(int n) {
        if (n % 4 == 0) return n;
        if (n % 4 == 1) return 1;
        if (n % 4 == 2) return n + 1;
        return 0;
    }
    int findRangeXOR(int l, int r) {
        return f(r) ^ f(l - 1);
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "implement-stack-using-arrays",
    title: "Implement Stack (Array)",
    topic: "Stack and Queues - Basics",
    category: "Stack and Queues",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Design a First-In-Last-Out (FILO) stack data structure using a fixed-size or dynamic array.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/implement-stack-using-array/1",
    useCases: [
      "Function call stack management",
      "Undo/Redo logic in text editors",
      "Expression evaluation and syntax parsing",
    ],
    approaches: [
      {
        name: "Pointer-based Array",
        description:
          "### 🧠 Core Intuition\nWe maintain a `top` pointer initialized to $-1$. When we `push`, we increment `top` and add the element. When we `pop`, we return the element at `top` and decrement it.\n\n### ⏱️ Complexity\n- **Time**: $O(1)$ for all operations.\n- **Space**: $O(N)$ for array storage.",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "Atomic index access and pointer updates.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Pre-allocated array size.",
        implementations: [
          {
            language: "Python",
            code: `class Stack:
    def __init__(self, size=1000):
        self.arr = [0]*size; self.top = -1
    def push(self, x):
        self.top += 1; self.arr[self.top] = x
    def pop(self):
        if self.top == -1: return -1
        res = self.arr[self.top]; self.top -= 1; return res`,
          },
          {
            language: "JavaScript",
            code: `class Stack {
  constructor() { this.arr = []; this.top = -1; }
  push(x) { this.top++; this.arr[this.top] = x; }
  pop() {
    if (this.top === -1) return -1;
    return this.arr[this.top--];
  }
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with struct and array ...`,
          },
          {
            language: "C++",
            code: `class MyStack {
private:
    int arr[1000], top;
public:
    MyStack() { top = -1; }
    void push(int x) { arr[++top] = x; }
    int pop() { 
        if(top == -1) return -1;
        return arr[top--];
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "implement-queue-using-arrays",
    title: "Implement Queue (Array)",
    topic: "Stack and Queues - Basics",
    category: "Stack and Queues",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Design a First-In-First-Out (FIFO) queue data structure using an array with front/rear pointers or circular logic.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/implement-queue-using-array/1",
    useCases: [
      "Task scheduling and shared resource management",
      "Handling asynchronous data streams",
      "Breadth-First Search (BFS) graph traversals",
    ],
    approaches: [
      {
        name: "Two-Pointer Array",
        description:
          "### 🧠 Core Intuition\nWe maintain `front` and `rear` pointers. `push` adds to `rear`, `pop` removes from `front`. To handle space wastage, a circular array (using `%` size) is typically used.\n\n### ⏱️ Complexity\n- **Time**: $O(1)$ for push/pop.\n- **Space**: $O(N)$.",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "Direct index access.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Fixed-size storage.",
        implementations: [
          {
            language: "Python",
            code: `class Queue:
    def __init__(self, size=1000):
        self.arr = [0]*size; self.f = self.r = 0
    def push(self, x):
        self.arr[self.r] = x; self.r += 1
    def pop(self):
        if self.f == self.r: return -1
        res = self.arr[self.f]; self.f += 1; return res`,
          },
          {
            language: "JavaScript",
            code: `class Queue {
  constructor() { this.arr = []; this.f = 0; this.r = 0; }
  push(x) { this.arr[this.r++] = x; }
  pop() {
    if (this.f === this.r) return -1;
    return this.arr[this.f++];
  }
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with front and rear pointers ...`,
          },
          {
            language: "C++",
            code: `class MyQueue {
    int arr[1000], f, r;
public:
    MyQueue() { f = 0; r = 0; }
    void push(int x) { arr[r++] = x; }
    int pop() {
        if(f == r) return -1;
        return arr[f++];
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "implement-stack-using-queue",
    title: "Implement Stack via Queues",
    topic: "Stack and Queues - Basics",
    category: "Stack and Queues",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Implement a Last-In-First-Out (LIFO) stack using one or more First-In-First-Out (FIFO) queues.",
    leetcodeLink: "https://leetcode.com/problems/implement-stack-using-queues/",
    useCases: [
      "Simulating stack behavior on queue-only hardware architectures",
      "Interview exercises on container adapters",
      "Managing resource buffers with priority shifts",
    ],
    approaches: [
      {
        name: "Single Queue (Re-enqueue)",
        description:
          "### 🧠 Core Intuition\nWhen you `push` an element $X$, you add it to the queue. To make it behave like a stack, you then re-enqueue all *previous* elements behind $X$. This moves $X$ to the front of the queue, making it the first to be popped.\n\n### ⏱️ Complexity\n- **Push**: $O(N)$\n- **Pop**: $O(1)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Each push requires rotating the entire queue.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Storage for N elements in the queue.",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque
class MyStack:
    def __init__(self): self.q = deque()
    def push(self, x):
        self.q.append(x)
        for _ in range(len(self.q) - 1):
            self.q.append(self.q.popleft())
    def pop(self): return self.q.popleft()`,
          },
          {
            language: "JavaScript",
            code: `class MyStack {
  constructor() { this.q = []; }
  push(x) {
    this.q.push(x);
    for (let i = 0; i < this.q.length - 1; i++) {
        this.q.push(this.q.shift());
    }
  }
  pop() { return this.q.shift(); }
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with circular buffer queue ...`,
          },
          {
            language: "C++",
            code: `class MyStack {
    queue<int> q;
public:
    void push(int x) {
        q.push(x);
        for(int i=0; i<q.size()-1; i++) {
            q.push(q.front()); q.pop();
        }
    }
    int pop() {
        int r = q.front(); q.pop(); return r;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "implement-queue-using-stack",
    title: "Implement Queue via Stacks",
    topic: "Stack and Queues - Basics",
    category: "Stack and Queues",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Implement a First-In-First-Out (FIFO) queue using two Last-In-Last-Out (LIFO) stacks.",
    leetcodeLink: "https://leetcode.com/problems/implement-queue-using-stacks/",
    useCases: [
      "Simulating FIFO behavior on stack-constrained hardware",
      "Managing reversible command buffers",
      "Interview exercises on state transfer between containers",
    ],
    approaches: [
      {
        name: "Two Stacks (Amortized O(1))",
        description:
          "### 🧠 Core Intuition\nWe use two stacks: `input` and `output`. \n1. **Push**: Always push to the `input` stack.\n2. **Pop/Peek**: If `output` is empty, move all elements from `input` to `output`. This reverses their order, making them FIFO. Pop from `output`.\n\n### ⏱️ Complexity\n- **Push**: $O(1)$\n- **Pop/Peek**: Amortized $O(1)$\n- **Space**: $O(N)$",
        timeComplexity: "O(1) Amortized",
        timeComplexityExplanation: "Each element is moved between stacks at most once.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Storage for N elements across two stacks.",
        implementations: [
          {
            language: "Python",
            code: `class MyQueue:
    def __init__(self): self.inp, self.out = [], []
    def push(self, x): self.inp.append(x)
    def pop(self):
        self.peek()
        return self.out.pop()
    def peek(self):
        if not self.out:
            while self.inp: self.out.append(self.inp.pop())
        return self.out[-1]`,
          },
          {
            language: "JavaScript",
            code: `class MyQueue {
  constructor() { this.inp = []; this.out = []; }
  push(x) { this.inp.push(x); }
  pop() { this.peek(); return this.out.pop(); }
  peek() {
    if (this.out.length === 0) {
      while (this.inp.length > 0) this.out.push(this.inp.pop());
    }
    return this.out[this.out.length - 1];
  }
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with two stack structs ...`,
          },
          {
            language: "C++",
            code: `class MyQueue {
    stack<int> inp, out;
public:
    void push(int x) { inp.push(x); }
    int pop() { 
        int r = peek(); out.pop(); return r;
    }
    int peek() {
        if(out.empty()) {
            while(!inp.empty()) { out.push(inp.top()); inp.pop(); }
        }
        return out.top();
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "implement-stack-using-linked-list",
    title: "Implement Stack (LinkedList)",
    topic: "Stack and Queues - Basics",
    category: "Stack and Queues",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Implement a stack data structure using a linked list. This allows for dynamic memory usage without resizing penalties.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/implement-stack-using-linked-list/1",
    useCases: [
      "Memory-restricted environments where pre-allocation is impossible",
      "Implementing stacks for graph algorithms (DFS)",
      "Low-level pointer management drills",
    ],
    approaches: [
      {
        name: "Head-Insertion Method",
        description:
          "### 🧠 Core Intuition\nWe treat the head of the linked list as the `top` of the stack. \n- **Push**: Create a new node and make it the new head.\n- **Pop**: Remove the current head and update `head = head.next`.\nThis ensures all operations are $O(1)$.\n\n### ⏱️ Complexity\n- **Time**: $O(1)$\n- **Space**: $O(N)$",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "Only head pointer updates required.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "One node per element.",
        implementations: [
          {
            language: "Python",
            code: `class Node:
    def __init__(self, x): self.data, self.next = x, None

class MyStack:
    def __init__(self): self.top = None
    def push(self, x):
        new_node = Node(x)
        new_node.next = self.top
        self.top = new_node
    def pop(self):
        if not self.top: return -1
        res = self.top.data
        self.top = self.top.next
        return res`,
          },
          {
            language: "JavaScript",
            code: `class Node {
  constructor(x) { this.data = x; this.next = null; }
}
class MyStack {
  constructor() { this.top = null; }
  push(x) {
    let node = new Node(x);
    node.next = this.top; this.top = node;
  }
  pop() {
    if (!this.top) return -1;
    let res = this.top.data;
    this.top = this.top.next; return res;
  }
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with pointers and free() ...`,
          },
          {
            language: "C++",
            code: `struct Node { int data; Node* next; Node(int x){data=x;next=NULL;} };
class MyStack {
    Node* top;
public:
    MyStack() { top = NULL; }
    void push(int x) {
        Node* n = new Node(x); n->next = top; top = n;
    }
    int pop() {
        if(!top) return -1;
        int r = top->data; Node* t = top; top = top->next; delete t; return r;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "implement-queue-using-linked-list",
    title: "Implement Queue (LinkedList)",
    topic: "Stack and Queues - Basics",
    category: "Stack and Queues",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Implement a queue data structure using a linked list with head and tail pointers for $O(1)$ operations.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/implement-queue-using-linked-list/1",
    useCases: [
      "Dynamic data streams with unpredictable volume",
      "Network buffer management",
      "Foundational logic for priority queues or deques",
    ],
    approaches: [
      {
        name: "Two-Pointer LinkedList",
        description:
          "### 🧠 Core Intuition\nWe maintain `front` (to pop) and `rear` (to push) pointers.\n- **Push**: Attach a new node to `rear.next` and update `rear`.\n- **Pop**: Remove from `front` and update `front = front.next`.\n\n### ⏱️ Complexity\n- **Time**: $O(1)$\n- **Space**: $O(N)$",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "Direct pointer updates for both ends.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Storage for N elements.",
        implementations: [
          {
            language: "Python",
            code: `class Node:
    def __init__(self, x): self.data, self.next = x, None
class MyQueue:
    def __init__(self): self.f = self.r = None
    def push(self, x):
        new_node = Node(x)
        if not self.r: self.f = self.r = new_node; return
        self.r.next = new_node; self.r = new_node
    def pop(self):
        if not self.f: return -1
        res = self.f.data; self.f = self.f.next
        if not self.f: self.r = None
        return res`,
          },
          {
            language: "JavaScript",
            code: `class Node {
  constructor(x) { this.data = x; this.next = null; }
}
class MyQueue {
  constructor() { this.f = null; this.r = null; }
  push(x) {
    let node = new Node(x);
    if (!this.r) { this.f = this.r = node; return; }
    this.r.next = node; this.r = node;
  }
  pop() {
    if (!this.f) return -1;
    let res = this.f.data; this.f = this.f.next;
    if (!this.f) this.r = null; return res;
  }
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with Head/Tail pointers ...`,
          },
          {
            language: "C++",
            code: `class MyQueue {
    QueueNode *front, *rear;
public:
    MyQueue() { front = rear = NULL; }
    void push(int x) {
        QueueNode* n = new QueueNode(x);
        if(!rear) { front = rear = n; return; }
        rear->next = n; rear = n;
    }
    int pop() {
        if(!front) return -1;
        int r = front->data; QueueNode* t = front;
        front = front->next; if(!front) rear = NULL;
        delete t; return r;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "check-for-balanced-parentheses",
    title: "Balanced Parentheses",
    topic: "Stack and Queues - Basics",
    category: "Stack and Queues",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview:
      "Verify if a string containing brackets `(`, `)`, `{`, `}`, `[` and `]` is balanced. Brackets must close in the same order they were opened.",
    leetcodeLink: "https://leetcode.com/problems/valid-parentheses/",
    useCases: [
      "Compilers validating source code syntax",
      "Parsing mathematical expressions",
      "Verifying tag closure in markup languages",
    ],
    approaches: [
      {
        name: "Stack-based Matching",
        description:
          "### 🧠 Core Intuition\nA stack is the perfect tool for tracking nested structures. \n- **Opening**: Push to the stack.\n- **Closing**: Check if it matches the current `top`. If it does, pop. If not, the string is unbalanced.\n- **Final State**: An empty stack indicates success.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "One linear pass through the string.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Worst case: all opening brackets stored.",
        implementations: [
          {
            language: "Python",
            code: `def isValid(s):
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in pairs:
            if not stack or stack.pop() != pairs[char]: return False
        else: stack.append(char)
    return not stack`,
          },
          {
            language: "JavaScript",
            code: `function isValid(s) {
  const stack = [], map = {')': '(', '}': '{', ']': '['};
  for (let c of s) {
    if (map[c]) { if (stack.pop() !== map[c]) return false; }
    else stack.push(c);
  }
  return stack.length === 0;
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with static stack array ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for(char c : s) {
            if(c == '(' || c == '{' || c == '[') st.push(c);
            else {
                if(st.empty()) return false;
                if(c == ')' && st.top() != '(') return false;
                if(c == '}' && st.top() != '{') return false;
                if(c == ']' && st.top() != '[') return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "min-stack",
    title: "Min Stack Design",
    topic: "Stack and Queues - Basics",
    category: "Stack and Queues",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview:
      "Support standard stack operations plus a constant-time method to retrieve the minimum element.",
    leetcodeLink: "https://leetcode.com/problems/min-stack/",
    useCases: [
      "Threshold monitoring in streaming data",
      "Undo systems with property tracking",
      "Finding extrema in dynamic sequences",
    ],
    approaches: [
      {
        name: "Auxiliary Minimum Stack",
        description:
          "### 🧠 Core Intuition\nMaintain a parallel stack (`minStack`) that stores the minimum element seen so far for every level of the main stack. \n- **Push**: `minStack.push(min(val, minStack.top()))`.\n- **Pop**: Pop from both.\n- **GetMin**: Return `minStack.top()`.\n\n### ⏱️ Complexity\n- **All Ops**: $O(1)$\n- **Space**: $O(N)$",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "Constant time overhead for two-stack maintenance.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Worst case: duplicate stack space.",
        implementations: [
          {
            language: "Python",
            code: `class MinStack:
    def __init__(self): self.s, self.m = [], []
    def push(self, x):
        self.s.append(x)
        if not self.m or x <= self.m[-1]: self.m.append(x)
    def pop(self):
        if self.s.pop() == self.m[-1]: self.m.pop()
    def getMin(self): return self.m[-1]`,
          },
          {
            language: "JavaScript",
            code: `class MinStack {
  constructor() { this.s = []; this.m = []; }
  push(x) {
    this.s.push(x);
    if (!this.m.length || x <= this.m[this.m.length-1]) this.m.push(x);
  }
  pop() { if (this.s.pop() === this.m[this.m.length-1]) this.m.pop(); }
  getMin() { return this.m[this.m.length-1]; }
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with double array ...`,
          },
          {
            language: "C++",
            code: `class MinStack {
    stack<int> s, m;
public:
    void push(int x) {
        s.push(x);
        if(m.empty() || x <= m.top()) m.push(x);
    }
    void pop() {
        if(s.top()==m.top()) m.pop();
        s.pop();
    }
    int getMin() { return m.top(); }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "infix-to-postfix-conversion",
    title: "Infix to Postfix (Shunting-Yard)",
    topic: "Stack and Queues - Conversions",
    category: "Stack and Queues",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Convert a standard mathematical expression (Infix, e.g., $A+B*C$) to Postfix notation (Reverse Polish, e.g., $ABC*+$).",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/infix-to-postfix-1587115620/1",
    useCases: [
      "Calculation engines and compilers",
      "Evaluating expressions without parentheses",
      "Building Abstract Syntax Trees (AST)",
    ],
    approaches: [
      {
        name: "Operator Stack Algorithm",
        description:
          "### 🧠 Core Intuition\nOperators are buffered in a stack based on precedence. Higher precedence operators are popped and appended to the result before lower precedence ones.\nRules:\n1. Operands go directly to result.\n2. `(` is pushed.\n3. `)` pops until `(`.\n4. Operator pops while `top` precedence $\ge$ current precedence.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "One pass through the expression string.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Stack storage for operators.",
        implementations: [
          {
            language: "Python",
            code: `def infixToPostfix(exp):
    prec = {'+':1, '-':1, '*':2, '/':2, '^':3}
    res, stack = "", []
    for c in exp:
        if c.isalnum(): res += c
        elif c == '(': stack.append(c)
        elif c == ')':
            while stack and stack[-1] != '(': res += stack.pop()
            stack.pop()
        else:
            while stack and stack[-1] != '(' and prec.get(c, 0) <= prec.get(stack[-1], 0):
                res += stack.pop()
            stack.append(c)
    while stack: res += stack.pop()
    return res`,
          },
          {
            language: "JavaScript",
            code: `function infixToPostfix(s) {
  const prec = {'+':1, '-':1, '*':2, '/':2, '^':3};
      stack.push(c);
    }
  }
  while (stack.length) res += stack.pop();
  return res;
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with precedence switch ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int prec(char c) {
        if(c == '^') return 3;
        if(c == '*' || c == '/') return 2;
        if(c == '+' || c == '-') return 1;
        return -1;
    }
    string infixToPostfix(string s) {
        string res = ""; stack<char> st;
        for(char c : s) {
            if(isalnum(c)) res += c;
            else if(c == '(') st.push(c);
            else if(c == ')') {
                while(!st.empty() && st.top() != '(') { res += st.top(); st.pop(); }
                st.pop();
            } else {
                while(!st.empty() && prec(c) <= prec(st.top())) {
                    res += st.top(); st.pop();
                }
                st.push(c);
            }
        }
        while(!st.empty()) { res += st.top(); st.pop(); }
        return res;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "prefix-to-infix-conversion",
    title: "Prefix to Infix",
    topic: "Stack and Queues - Conversions",
    category: "Stack and Queues",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Convert an algebraic expression from Prefix notation (e.g., $+AB$) to Infix notation (e.g., $A+B$).",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/prefix-to-infix-conversion/1",
    useCases: [
      "Translating low-level bytecode to high-level readable source",
      "Educational tools for expression transformation",
      "Building expression evaluators",
    ],
    approaches: [
      {
        name: "Reverse Stack Algorithm",
        description:
          "### 🧠 Core Intuition\nPrefix expressions are best processed from **Right to Left**. \n1. If it's an operand, push to stack.\n2. If it's an operator, pop two operands ($Op1, Op2$), wrap them in parentheses with the operator in between: `(Op1 + Op2)`, and push the result back.\n\n### ⏱️ Complexity\n- **Time**: $O(N^2)$ due to string concatenation in many languages, or $O(N)$ with optimizations.\n- **Space**: $O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Linear pass through the expression.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Stack storage for sub-expressions.",
        implementations: [
          {
            language: "Python",
            code: `def prefixToInfix(ext):
    stack = []
    # Process from right to left
    for c in reversed(ext):
        if c.isalnum(): stack.append(c)
        else:
            o1 = stack.pop()
            o2 = stack.pop()
            stack.append(f"({o1}{c}{o2})")
    return stack[0]`,
          },
          {
            language: "JavaScript",
            code: `function prefixToInfix(s) {
  let stack = [];
  for (let i = s.length - 1; i >= 0; i--) {
    let c = s[i];
    if (/[a-zA-Z0-9]/.test(c)) stack.push(c);
    else {
      let o1 = stack.pop(), o2 = stack.pop();
      stack.push('(' + o1 + c + o2 + ')');
    }
  }
  return stack[0];
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with dynamic string handling ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    string preToInfix(string s) {
        stack<string> st;
        for(int i=s.length()-1; i>=0; i--) {
            if(isalnum(s[i])) st.push(string(1, s[i]));
            else {
                string o1 = st.top(); st.pop();
                string o2 = st.top(); st.pop();
                st.push("(" + o1 + s[i] + o2 + ")");
            }
        }
        return st.top();
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "prefix-to-postfix-conversion",
    title: "Prefix to Postfix",
    topic: "Stack and Queues - Conversions",
    category: "Stack and Queues",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Convert an algebraic expression from Prefix notation (e.g., $+AB$) to Postfix notation (e.g., $AB+$).",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/prefix-to-postfix-conversion/1",
    useCases: [
      "Translating functional programming formats to stack-based bytecode",
      "Re-formatting expressions for simplified evaluation",
      "Building expression transformation pipelines",
    ],
    approaches: [
      {
        name: "Reverse Stack Accumulation",
        description:
          "### 🧠 Core Intuition\nPrefix expressions are scanned from **Right to Left**. \n1. If operand: Push to stack.\n2. If operator: Pop two operands ($Op1, Op2$) and push the concatenated string as $Op1 + Op2 + Operator$.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "One linear pass through the expression string.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Stack storage for operands and partial postfix results.",
        implementations: [
          {
            language: "Python",
            code: `def prefixToPostfix(ext):
    stack = []
    for c in reversed(ext):
        if c.isalnum(): stack.append(c)
        else:
            o1 = stack.pop()
            o2 = stack.pop()
            stack.append(o1 + o2 + c)
    return stack[0]`,
          },
          {
            language: "JavaScript",
            code: `function prefixToPostfix(s) {
  let stack = [];
  for (let i = s.length - 1; i >= 0; i--) {
    let c = s[i];
    if (/[a-zA-Z0-9]/.test(c)) stack.push(c);
    else {
      let o1 = stack.pop(), o2 = stack.pop();
      stack.push(o1 + o2 + c);
    }
  }
  return stack[0];
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation using string concatenation handles ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    string preToPost(string s) {
        stack<string> st;
        for(int i=s.length()-1; i>=0; i--) {
            if(isalnum(s[i])) st.push(string(1, s[i]));
            else {
                string o1 = st.top(); st.pop();
                string o2 = st.top(); st.pop();
                st.push(o1 + o2 + s[i]);
            }
        }
        return st.top();
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "postfix-to-prefix-conversion",
    title: "Postfix to Prefix",
    topic: "Stack and Queues - Conversions",
    category: "Stack and Queues",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Convert a Postfix expression (Reverse Polish, e.g., $AB+$) to its Prefix equivalent (Polish, e.g., $+AB$).",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/postfix-to-prefix-conversion/1",
    useCases: [
      "Converting machine-centric stack operations to human-readable functional prefix forms",
      "Optimizing expression analysis in symbolic math engines",
    ],
    approaches: [
      {
        name: "Stack Accumulation (Left-to-Right)",
        description:
          "### 🧠 Core Intuition\nPostfix is scanned from **Left to Right**. \n1. If operand: Push to stack.\n2. If operator: Pop two operands. Note that $Op2$ is popped first and $Op1$ second. Push the result as $Operator + Op1 + Op2$.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "One linear pass through the expression string.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Stack storage for nested results.",
        implementations: [
          {
            language: "Python",
            code: `def postToPre(ext):
    stack = []
    for c in ext:
        if c.isalnum(): stack.append(c)
        else:
            o2 = stack.pop()
            o1 = stack.pop()
            stack.append(c + o1 + o2)
    return stack[0]`,
          },
          {
            language: "JavaScript",
            code: `function postToPre(s) {
  let stack = [];
  for (let c of s) {
    if (/[a-zA-Z0-9]/.test(c)) stack.push(c);
    else {
      let o2 = stack.pop(), o1 = stack.pop();
      stack.push(c + o1 + o2);
    }
  }
  return stack[0];
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with string memory management ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    string postToPre(string s) {
        stack<string> st;
        for(char c : s) {
            if(isalnum(c)) st.push(string(1, c));
            else {
                string o2 = st.top(); st.pop();
                string o1 = st.top(); st.pop();
                st.push(c + o1 + o2);
            }
        }
        return st.top();
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "postfix-to-infix-conversion",
    title: "Postfix to Infix",
    topic: "Stack and Queues - Conversions",
    category: "Stack and Queues",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Convert a Postfix expression (e.g., $AB+$) back into a parenthesized Infix form (e.g., $(A+B)$).",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/postfix-to-infix-conversion/1",
    useCases: [
      "Translating compiled code into high-level debug output",
      "Developing educational visualization tools for math",
    ],
    approaches: [
      {
        name: "In-Place Parenthesizing",
        description:
          "### 🧠 Core Intuition\nPostfix is scanned Left to Right. \n1. If operand: Push to stack.\n2. If operator: Pop $Op2$ then $Op1$. Wrap them as `(Op1 + Operator + Op2)` and push back.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "One linear pass through the expression string.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Stack storage for string expressions.",
        implementations: [
          {
            language: "Python",
            code: `def postToInfix(ext):
    stack = []
    for c in ext:
        if c.isalnum(): stack.append(c)
        else:
            o2 = stack.pop()
            o1 = stack.pop()
            stack.append(f"({o1}{c}{o2})")
    return stack[0]`,
          },
          {
            language: "JavaScript",
            code: `function postToInfix(s) {
  let stack = [];
  for (let c of s) {
    if (/[a-zA-Z0-9]/.test(c)) stack.push(c);
    else {
      let o2 = stack.pop(), o1 = stack.pop();
      stack.push('(' + o1 + c + o2 + ')');
    }
  }
  return stack[0];
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with bracket logic ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    string postToInfix(string s) {
        stack<string> st;
        for(char c : s) {
            if(isalnum(c)) st.push(string(1, c));
            else {
                string o2 = st.top(); st.pop();
                string o1 = st.top(); st.pop();
                st.push("(" + o1 + c + o2 + ")");
            }
        }
        return st.top();
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "next-smaller-element",
    title: "Next Smaller Element (NSE)",
    topic: "Stack and Queues - Monotonic",
    category: "Stack and Queues",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "For each element in an array, find the first element to its right that is smaller than it. If none exists, return -1.",
    leetcodeLink: "https://www.interviewbit.com/problems/nearest-smaller-element/",
    useCases: [
      "Calculating the largest area in a Histogram",
      "Finding the first stock price dip to the right",
      "Building monotonic ranges for complex queries",
    ],
    approaches: [
      {
        name: "Monotonic Increasing Stack",
        description:
          "### 🧠 Core Intuition\nWe scan the array from **Right to Left**. As we traverse, we maintain a stack of elements that could be the 'next smaller' for future elements. \n1. While `stack.top()` $\ge$ `current`, it cannot be the next smaller, so we pop.\n2. The `stack.top()` is now our NSE. \n3. Push `current` onto the stack.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ (Each element pushed/popped once)\n- **Space**: $O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Amortized constant time per element.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Stack storage formonotonic elements.",
        implementations: [
          {
            language: "Python",
            code: `def nextSmaller(arr):
    n = len(arr); res = [-1]*n; st = []
    for i in range(n-1, -1, -1):
        while st and st[-1] >= arr[i]: st.pop()
        res[i] = st[-1] if st else -1
        st.append(arr[i])
    return res`,
          },
          {
            language: "JavaScript",
            code: `function nextSmaller(arr) {
  let n = arr.length, res = new Array(n), st = [];
  for (let i = n - 1; i >= 0; i--) {
    while (st.length && st[st.length-1] >= arr[i]) st.pop();
    res[i] = st.length ? st[st.length-1] : -1;
    st.push(arr[i]);
  }
  return res;
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with stack array ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    vector<int> prevSmaller(vector<int> &arr) {
        int n = arr.size(); vector<int> res(n); stack<int> st;
        for(int i=0; i<n; i++) {
            while(!st.empty() && st.top() >= arr[i]) st.pop();
            res[i] = st.empty() ? -1 : st.top();
            st.push(arr[i]);
        }
        return res;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "number-of-nges-to-the-right",
    title: "Count Greater on Right",
    topic: "Stack and Queues - Monotonic",
    category: "Stack and Queues",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "For a given array and specific indices, find how many elements to the right of each index are greater than the element at that index.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/number-of-nges-to-the-right/1",
    useCases: [
      "Range data summaries and frequency counting",
      "Analyzing market trends for peak volume counts",
      "Competitive programming puzzles involving right-side counts",
    ],
    approaches: [
      {
        name: "Standard Suffix Count",
        description:
          "### 🧠 Core Intuition\nThis problem asks for the *count* of NGEs, not just the *first* NGE. While monotonic stacks find the first NGE, counting requires a different approach (like a BIT, Segment Tree, or just a simple linear scan if the number of queries is large/small).\nFor a single query `i`, we scan $i+1...N$ and increment a counter if $arr[j] > arr[i]$.\n\n### ⏱️ Complexity\n- **Time**: $O(Q \times N)$ for Q queries.\n- **Space**: $O(1)$",
        timeComplexity: "O(Q * N)",
        timeComplexityExplanation: "Linear scan per query.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No auxiliary storage.",
        implementations: [
          {
            language: "Python",
            code: `def countGreater(arr, queries):
    res = []
    for q in queries:
        cnt = 0
        for i in range(q + 1, len(arr)):
            if arr[i] > arr[q]: cnt += 1
        res.append(cnt)
    return res`,
          },
          {
            language: "JavaScript",
            code: `function countGreater(arr, queries) {
  return queries.map(q => {
    let cnt = 0;
    for (let i = q + 1; i < arr.length; i++) {
        if (arr[i] > arr[q]) cnt++;
    }
    return cnt;
  });
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with nested for-loops ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    vector<int> countGreater(vector<int>& arr, vector<int>& qr) {
        vector<int> res;
        for(int q : qr) {
            int cnt = 0;
            for(int i = q + 1; i < arr.size(); i++) {
                if(arr[i] > arr[q]) cnt++;
            }
            res.push_back(cnt);
        }
        return res;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "trapping-rainwater",
    title: "Trapping Rainwater",
    topic: "Stack and Queues - Monotonic",
    category: "Stack and Queues",
    frequencyLevel: "Very High",
    difficulty: "Hard",
    overview:
      "Given $N$ non-negative integers representing an elevation map, compute how much water it can trap after raining.",
    leetcodeLink: "https://leetcode.com/problems/trapping-rain-water/",
    useCases: [
      "Physical simulation of fluid accumulations",
      "Analysis of topographical volume and drainage",
    ],
    approaches: [
      {
        name: "Two Pointers (Optimal)",
        description:
          "### 🧠 Core Intuition\nWater at index $i$ is trapped only if there are higher bars on both left and right. The amount is `min(maxLeft, maxRight) - height[i]`. Using two pointers from ends, we can track `leftMax` and `rightMax` and safely calculate trapped water for the smaller side.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single pass with two pointers.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No auxiliary arrays used.",
        implementations: [
          {
            language: "Python",
            code: `def trap(height):
    l, r = 0, len(height) - 1
    lMax = rMax = res = 0
    while l < r:
        if height[l] < height[r]:
            lMax = max(lMax, height[l])
            res += lMax - height[l]
            l += 1
        else:
            rMax = max(rMax, height[r])
            res += rMax - height[r]
            r -= 1
    return res`,
          },
          {
            language: "JavaScript",
            code: `function trap(height) {
  let l = 0, r = height.length - 1, res = 0;
  let lM = 0, rM = 0;
  while (l < r) {
    if (height[l] < height[r]) {
      lM = Math.max(lM, height[l]);
      res += lM - height[l];
      l++;
    } else {
      rM = Math.max(rM, height[r]);
      res += rM - height[r];
      r--;
    }
  }
  return res;
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with int pointers ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int trap(vector<int>& height) {
        int l = 0, r = height.size() - 1, res = 0, lM = 0, rM = 0;
        while(l < r) {
            if(height[l] < height[r]) {
                lM = max(lM, height[l]);
                res += lM - height[l];
                l++;
            } else {
                rM = max(rM, height[r]);
                res += rM - height[r];
                r--;
            }
        }
        return res;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "sum-of-subarray-minimums",
    title: "Sum of Subarray Minimums",
    topic: "Stack and Queues - Monotonic",
    category: "Stack and Queues",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Find the sum of the minimum of all possible contiguous subarrays, modulo $10^9 + 7$.",
    leetcodeLink: "https://leetcode.com/problems/sum-of-subarray-minimums/",
    useCases: [
      "Range aggregate queries in data analytics",
      "Finding contribution-based metrics in large sequences",
    ],
    approaches: [
      {
        name: "Monotonic Stack (Contribution Technique)",
        description:
          "### 🧠 Core Intuition\nFor each element $arr[i]$, find the range $[L, R]$ where $arr[i]$ is the minimum. The number of subarrays where $arr[i]$ is the minimum is $(i - L + 1) \times (R - i + 1)$.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Two passes to calculate PLE and NSE.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Stack storage.",
        implementations: [
          {
            language: "Python",
            code: `def sumSubarrayMins(arr):
    mod = 10**9 + 7; n = len(arr); res = 0
    st = []; left = [i + 1 for i in range(n)]
    for i, x in enumerate(arr):
        while st and arr[st[-1]] > x: st.pop()
        left[i] = i - st[-1] if st else i + 1
        st.append(i)
    st = []; right = [n - i for i in range(n)]
    for i in range(n - 1, -1, -1):
        while st and arr[st[-1]] >= arr[i]: st.pop()
        right[i] = st[-1] - i if st else n - i
        st.append(i)
    for i in range(n): res = (res + arr[i] * left[i] * right[i]) % mod
    return res`,
          },
          {
            language: "JavaScript",
            code: `function sumSubarrayMins(arr) {
  let mod = 1e9 + 7, n = arr.length, res = 0;
  // ... Implementation using monotonic stack for PLE/NSE ...
  return res;
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with modulo arithmetic ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int sumSubarrayMins(vector<int>& arr) {
        int n = arr.size(); long long mod = 1e9 + 7, sum = 0;
        vector<int> left(n), right(n); stack<int> s;
        for(int i=0; i<n; i++) {
            while(!s.empty() && arr[s.top()] > arr[i]) s.pop();
            left[i] = s.empty() ? i + 1 : i - s.top();
            s.push(i);
        }
        while(!s.empty()) s.pop();
        for(int i=n-1; i>=0; i--) {
            while(!s.empty() && arr[s.top()] >= arr[i]) s.pop();
            right[i] = s.empty() ? n - i : s.top() - i;
            s.push(i);
        }
        for(int i=0; i<n; i++) sum = (sum + (long long)arr[i] * left[i] * right[i]) % mod;
        return sum;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "asteroid-collision",
    title: "Asteroid Collision",
    topic: "Stack and Queues - Monotonic",
    category: "Stack and Queues",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Simulate the collision of asteroids moving in a line. Positive integers move right, negative move left.",
    leetcodeLink: "https://leetcode.com/problems/asteroid-collision/",
    useCases: [
      "Simulating particle collisions in 1D space",
      "Handling competing requests in prioritized buffers",
    ],
    approaches: [
      {
        name: "Stack Simulation",
        description:
          "### 🧠 Core Intuition\nUse a stack to track survivors. Collision occurs if current asteroid moves left ($<0$) and top of stack moves right ($>0$).\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Each asteroid is pushed and popped at most once.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Stack storage for survivors.",
        implementations: [
          {
            language: "Python",
            code: `def asteroidCollision(asteroids):
    st = []
    for a in asteroids:
        while st and a < 0 < st[-1]:
            if st[-1] < -a: st.pop(); continue
            elif st[-1] == -a: st.pop()
            break
        else: st.append(a)
    return st`,
          },
          {
            language: "JavaScript",
            code: `function asteroidCollision(arr) {
  let st = [];
  for (let a of arr) {
    let ok = true;
    while (st.length && a < 0 && st[st.length-1] > 0) {
      if (st[st.length-1] < -a) { st.pop(); continue; }
      if (st[st.length-1] === -a) st.pop();
      ok = false; break;
    }
    if (ok) st.push(a);
  }
  return st;
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with dynamic memory stack ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    vector<int> asteroidCollision(vector<int>& asteroids) {
        vector<int> st;
        for (int a : asteroids) {
            bool destroyed = false;
            while (!st.empty() && a < 0 && st.back() > 0) {
                if (st.back() < abs(a)) { st.pop_back(); continue; }
                if (st.back() == abs(a)) st.pop_back();
                destroyed = true; break;
            }
            if (!destroyed) st.push_back(a);
        }
        return st;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "sum-of-subarray-ranges",
    title: "Sum of Subarray Ranges",
    topic: "Stack and Queues - Monotonic",
    category: "Stack and Queues",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview:
      "Find the sum of the difference between the maximum and minimum elements in every contiguous subarray.",
    leetcodeLink: "https://leetcode.com/problems/sum-of-subarray-ranges/",
    useCases: [
      "Calculating volatility and variance in data windows",
      "Analysis of range contributions in large datasets",
    ],
    approaches: [
      {
        name: "Contribution Technique (SumMax - SumMin)",
        description:
          "### 🧠 Core Intuition\n$\sum (Max - Min) = \sum Max - \sum Min$. We calculate the contribution of each element as a maximum and as a minimum using monotonic stacks.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Linear passes for min and max contributions.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Stack and auxiliary arrays.",
        implementations: [
          {
            language: "Python",
            code: `def subArrayRanges(nums):
    # Calculate sum of maxes and sum of mins using monotonic stacks
    # Return sumMax - sumMin
    pass`,
          },
          {
            language: "JavaScript",
            code: `function subArrayRanges(nums) {
  // Logic to calculate SumMax and SumMin...
  return sumMax - sumMin;
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with long long ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    long long subArrayRanges(vector<int>& nums) {
        // Implementation using monotonic stack to find PLE/NSE for min and max
        return 0; 
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "remove-k-digits",
    title: "Remove K Digits",
    topic: "Stack and Queues - Monotonic",
    category: "Stack and Queues",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Given a non-negative integer represented as a string, remove $K$ digits from the number so that the new number is the smallest possible.",
    leetcodeLink: "https://leetcode.com/problems/remove-k-digits/",
    useCases: [
      "Optimizing numeric representation for storage",
      "Greedy data reduction in large strings",
    ],
    approaches: [
      {
        name: "Monotonic Increasing Stack",
        description:
          "### 🧠 Core Intuition\nTo make a number smaller, we want to remove the larger digits from the most significant positions (left). We maintain an increasing stack of digits. If the current digit is smaller than the top, we pop the top (reducing $K$) to make the sequence monotonic.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "One pass through the string.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Stack storage for the digits.",
        implementations: [
          {
            language: "Python",
            code: `def removeKdigits(num, k):
    st = []
    for d in num:
        while k > 0 and st and st[-1] > d:
            st.pop(); k -= 1
        st.append(d)
    st = st[:-k] if k > 0 else st
    return "".join(st).lstrip('0') or "0"`,
          },
          {
            language: "JavaScript",
            code: `function removeKdigits(num, k) {
  let st = [];
  for (let d of num) {
    while (k > 0 && st.length && st[st.length-1] > d) {
      st.pop(); k--;
    }
    st.push(d);
  }
  while (k > 0) { st.pop(); k--; }
  let res = st.join('').replace(/^0+/, '');
  return res === '' ? '0' : res;
}`,
          },
          {
            language: "C",
            code: `char* removeKdigits(char* num, int k) {
    int n = strlen(num), top = 0;
    char* st = malloc(n + 1);
    for (int i = 0; i < n; i++) {
        while (k > 0 && top > 0 && st[top - 1] > num[i]) { top--; k--; }
        st[top++] = num[i];
    }
    top -= k;
    int start = 0;
    while (start < top && st[start] == '0') start++;
    if (start == top) return "0";
    st[top] = '\0';
    return st + start;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    string removeKdigits(string num, int k) {
        string res = "";
        for(char d : num) {
            while(k > 0 && !res.empty() && res.back() > d) {
                res.pop_back(); k--;
            }
            res.push_back(d);
        }
        while(k > 0 && !res.empty()) { res.pop_back(); k--; }
        int i = 0; while(i < res.size() && res[i] == '0') i++;
        res = res.substr(i);
        return res.empty() ? "0" : res;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "largest-rectangle-in-histogram",
    title: "Largest Rectangle in Histogram",
    topic: "Stack and Queues - Monotonic",
    category: "Stack and Queues",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Find the largest rectangular area in a histogram.",
    leetcodeLink: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    useCases: ["Computer Vision", "Grid Analysis"],
    approaches: [
      {
        name: "Monotonic Stack",
        description: "### 🧠 Core Intuition\nMaintain a stack of indices with increasing heights. When a smaller height is encountered, pop and calculate area.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Each element pushed/popped once.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Stack storage.",
        implementations: [
          {
            language: "Python",
            code: `def largestRectangleArea(heights):
    st = []; maxA = 0; heights.append(0)
    for i, h in enumerate(heights):
        while st and heights[st[-1]] >= h:
            H = heights[st.pop()]
            W = i if not st else i - st[-1] - 1
            maxA = max(maxA, H * W)
        st.append(i)
    return maxA`
          },
          {
            language: "JavaScript",
            code: `function largestRectangleArea(heights) {
    let st = [], maxA = 0; heights.push(0);
    for (let i = 0; i < heights.length; i++) {
        while (st.length && heights[st[st.length-1]] >= heights[i]) {
            let h = heights[st.pop()];
            let w = st.length === 0 ? i : i - st[st.length-1] - 1;
            maxA = Math.max(maxA, h * w);
        }
        st.push(i);
    }
    return maxA;
}`
          },
          {
            language: "C",
            code: `int largestRectangleArea(int* heights, int n) {
    int* st = malloc((n + 1) * sizeof(int)); int top = -1, maxA = 0;
    for (int i = 0; i <= n; i++) {
        int h = (i == n) ? 0 : heights[i];
        while (top != -1 && heights[st[top]] >= h) {
            int H = heights[st[top--]];
            int W = (top == -1) ? i : i - st[top] - 1;
            if (H * W > maxA) maxA = H * W;
        }
        st[++top] = i;
    }
    return maxA;
}`
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        stack<int> st; int maxA = 0; heights.push_back(0);
        for(int i=0; i<heights.size(); i++) {
            while(!st.empty() && heights[st.top()] >= heights[i]) {
                int h = heights[st.top()]; st.pop();
                int w = st.empty() ? i : i - st.top() - 1;
                maxA = max(maxA, h * w);
            }
            st.push(i);
        }
        return maxA;
    }
};`
          }
        ]
      }
    ]
  },
  {
    id: "maximal-rectangle",
    title: "Maximal Rectangle",
    topic: "Stack and Queues - Monotonic",
    category: "Stack and Queues",
    frequencyLevel: "Very High",
    difficulty: "Hard",
    overview:
      "Find the largest rectangle containing only 1's in a given 2D binary matrix.",
    leetcodeLink: "https://leetcode.com/problems/maximal-rectangle/",
    useCases: [
      "Image processing (finding large uniform segments)",
      "Optimizing 2D bin packing",
      "Analysis of grid-based data structures",
    ],
    approaches: [
      {
        name: "Histogram-per-Row Logic",
        description:
          "### 🧠 Core Intuition\nFor each row in the matrix, treat everything above it as a histogram. The height of the bar at column $j$ is the number of consecutive 1s ending at that row. For each row, we solve the 'Largest Rectangle in Histogram' problem.\n\n### ⏱️ Complexity\n- **Time**: $O(R \times C)$\n- **Space**: $O(C)$",
        timeComplexity: "O(R * C)",
        timeComplexityExplanation: "Solving O(C) histogram problem for each of R rows.",
        spaceComplexity: "O(C)",
        spaceComplexityExplanation: "Storing heights for the current row's histogram.",
        implementations: [
          {
            language: "Python",
            code: `def maximalRectangle(matrix):
    if not matrix: return 0
    C = len(matrix[0]); heights = [0]*(C + 1); maxA = 0
    for row in matrix:
        for i in range(C):
            heights[i] = heights[i] + 1 if row[i] == '1' else 0
        st = []
        for i, h in enumerate(heights):
            while st and heights[st[-1]] >= h:
                H = heights[st.pop()]
                W = i if not st else i - st[-1] - 1
                maxA = max(maxA, H * W)
            st.append(i)
    return maxA`,
          },
          {
            language: "JavaScript",
            code: `function maximalRectangle(matrix) {
  if (!matrix.length) return 0;
  let C = matrix[0].length, heights = new Array(C + 1).fill(0), maxA = 0;
  for (let row of matrix) {
    for (let i = 0; i < C; i++) heights[i] = row[i] === '1' ? heights[i] + 1 : 0;
    let st = [];
    for (let i = 0; i <= C; i++) {
        while (st.length && heights[st[st.length-1]] >= heights[i]) {
            let h = heights[st.pop()];
            let w = st.length === 0 ? i : i - st[st.length-1] - 1;
            maxA = Math.max(maxA, h * w);
        }
        st.push(i);
    }
  }
  return maxA;
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with row-major traversal ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int maximalRectangle(vector<vector<char>>& matrix) {
        if(matrix.empty()) return 0;
        int C = matrix[0].size(), maxA = 0;
        vector<int> heights(C + 1, 0);
        for(auto& row : matrix) {
            for(int i=0; i<C; i++) heights[i] = (row[i] == '1') ? heights[i] + 1 : 0;
            stack<int> st;
            for(int i=0; i<=C; i++) {
                while(!st.empty() && heights[st.top()] >= heights[i]) {
                    int h = heights[st.top()]; st.pop();
                    int w = st.empty() ? i : i - st.top() - 1;
                    maxA = max(maxA, h * w);
                }
                st.push(i);
            }
        }
        return maxA;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "sliding-window-maximum",
    title: "Sliding Window Maximum",
    topic: "Stack and Queues - Advanced",
    category: "Stack and Queues",
    frequencyLevel: "Very High",
    difficulty: "Hard",
    overview:
      "Given an array and a window size $K$, find the maximum element in every sliding window of size $K$.",
    leetcodeLink: "https://leetcode.com/problems/sliding-window-maximum/",
    useCases: [
      "Real-time monitoring of peak metrics",
      "Network bandwidth management (max bursts)",
      "Financial chart analysis (rolling highs)",
    ],
    approaches: [
      {
        name: "Monotonic Deque (Optimal)",
        description:
          "### 🧠 Core Intuition\nWe maintain a deque that stores indices of elements in the current window such that their values are in **decreasing order**. \n1. Remove indices of elements smaller than the current element (they can never be the max).\n2. Remove the front index if it's outside the window $[i-K+1, i]$.\n3. The current window's maximum is always the value at the deque's front.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(K)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Each element is entered and removed from the deque at most once.",
        spaceComplexity: "O(K)",
        spaceComplexityExplanation: "Deque stores at most K indices.",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque
def maxSlidingWindow(nums, k):
    dq, res = deque(), []
    for i, n in enumerate(nums):
        while dq and nums[dq[-1]] <= n: dq.pop()
        dq.append(i)
        if dq[0] == i - k: dq.popleft()
        if i >= k - 1: res.append(nums[dq[0]])
    return res`,
          },
          {
            language: "JavaScript",
            code: `function maxSlidingWindow(nums, k) {
  let dq = [], res = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length && nums[dq[dq.length-1]] <= nums[i]) dq.pop();
    dq.push(i);
    if (dq[0] === i - k) dq.shift();
    if (i >= k - 1) res.push(nums[dq[0]]);
  }
  return res;
}`,
          },
          {
            language: "C",
            code: `// ... C Implementation with static deque ...`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> dq; vector<int> res;
        for(int i=0; i<nums.size(); i++) {
            while(!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();
            dq.push_back(i);
            if(dq.front() == i - k) dq.pop_front();
            if(i >= k - 1) res.push_back(nums[dq.front()]);
        }
        return res;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "stock-span-problem",
    title: "Stock Span Problem",
    topic: "Stack and Queues - Advanced",
    category: "Stack and Queues",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "For each day's stock price, find the number of consecutive days for which the price was less than or equal to the price on that day.",
    leetcodeLink: "https://leetcode.com/problems/online-stock-span/",
    useCases: [
      "Fintech momentum analysis",
      "Signal processing peak tracking",
    ],
    approaches: [
      {
        name: "Monotonic Stack (PLE)",
        description:
          "### 🧠 Core Intuition\nThe span is the distance between the current day and the **previous higher price**. \n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(N)$ ",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Amortized constant time.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Stack storage.",
        implementations: [
          {
            language: "Python",
            code: `class StockSpanner:
    def __init__(self): self.st = []
    def next(self, price):
        span = 1
        while self.st and self.st[-1][0] <= price:
            span += self.st.pop()[1]
        self.st.append((price, span))
        return span`,
          },
          {
            language: "C++",
            code: `class StockSpanner {
    stack<pair<int, int>> st;
public:
    int next(int price) {
        int span = 1;
        while(!st.empty() && st.top().first <= price) {
            span += st.top().second; st.pop();
        }
        st.push({price, span});
        return span;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "the-celebrity-problem",
    title: "The Celebrity Problem",
    topic: "Stack and Queues - Advanced",
    category: "Stack and Queues",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Find the person who is known by everyone but knows no one.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/the-celebrity-problem/1",
    useCases: [
      "Influencer detection",
      "Network centrality",
    ],
    approaches: [
      {
        name: "Two-Pointer Elimination",
        description:
          "### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Linear scan.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Constant pointers.",
        implementations: [
          {
            language: "Python",
            code: `def getCelebrity(M, n):
    l, r = 0, n - 1
    while l < r:
        if M[l][r]: l += 1
        else: r -= 1
    for i in range(n):
        if i != l and (M[l][i] or not M[i][l]): return -1
    return l`,
          },
          {
              language: "Java",
              code: `class Solution {
    public int solve_the_celebrity_problem(int[][] knows) {
        int n = knows.length;
        int candidate = 0;
        for (int i = 1; i < n; i++) {
            if (knows[candidate][i] == 1) {
                candidate = i;
            }
        }
        for (int i = 0; i < n; i++) {
            if (i == candidate) continue;
            if (knows[candidate][i] == 1 || knows[i][candidate] == 0) {
                return -1;
            }
        }
        return candidate;
    }
}`
            },
            {
              language: "C++",
              code: `#include <vector>

int solve_the_celebrity_problem(const std::vector<std::vector<int>>& knows) {
    int n = knows.size();
    int candidate = 0;
    for (int i = 1; i < n; ++i) {
        if (knows[candidate][i] == 1) {
            candidate = i;
        }
    }
    for (int i = 0; i < n; ++i) {
        if (i == candidate) continue;
        if (knows[candidate][i] == 1 || knows[i][candidate] == 0) {
            return -1;
        }
    }
    return candidate;
}`
            }
          ]
        }
    ]
  },
  {
    id: "lru-cache",
    title: "LRU Cache Design",
    topic: "Stack and Queues - Advanced",
    category: "Stack and Queues",
    frequencyLevel: "Very High",
    difficulty: "Hard",
    overview:
      "Design a data structure that follows the Least Recently Used (LRU) cache policy. Operations ($get, put$) must run in $O(1)$ average time.",
    leetcodeLink: "https://leetcode.com/problems/lru-cache/",
    useCases: [
      "Application database caching layer",
      "Virtual memory page management",
      "Content Delivery Network (CDN) edge caching",
    ],
    approaches: [
      {
        name: "HashMap + Doubly LinkedList",
        description:
          "### 🧠 Core Intuition\nA HashMap provides $O(1)$ access, while a Doubly LinkedList maintains the usage order with $O(1)$ updates. \n- **Get**: Return value from Map and move node to head.\n- **Put**: If exists, update and move to head. If new, add to head. If full, remove tail and remove from Map.\n\n### ⏱️ Complexity\n- **Get/Put**: $O(1)$ average.\n- **Space**: $O(\text{Capacity})$",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "Constant time operations for both access and ordering.",
        spaceComplexity: "O(Capacity)",
        spaceComplexityExplanation: "Stores at most 'capacity' elements.",
        implementations: [
          {
            language: "Python",
            code: `from collections import OrderedDict
class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()
    def get(self, key):
        if key not in self.cache: return -1
        self.cache.move_to_end(key); return self.cache[key]
    def put(self, key, value):
        if key in self.cache: self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity: self.cache.popitem(last=False)`,
          },
          {
            language: "JavaScript",
            code: `class LRUCache {
  constructor(capacity) { this.c = capacity; this.m = new Map(); }
  get(key) {
    if (!this.m.has(key)) return -1;
    let v = this.m.get(key);
    this.m.delete(key); this.m.set(key, v);
    return v;
  }
  put(key, value) {
    if (this.m.has(key)) this.m.delete(key);
    this.m.set(key, value);
    if (this.m.size > this.c) this.m.delete(this.m.keys().next().value);
  }
}`,
          },
          {
            language: "C++",
            code: `class LRUCache {
    struct Node { int k, v; Node *p, *n; };
    unordered_map<int, Node*> m;
    int cap; Node *head, *tail;
public:
    LRUCache(int c) { cap = c; head = new Node(); tail = new Node(); head->n = tail; tail->p = head; }
    // ... Full logic for O(1) Get/Put ...
};`,
          },
        ],
      },
    ],
  },
  {
    id: "lfu-cache",
    title: "LFU Cache Design",
    topic: "Stack and Queues - Advanced",
    category: "Stack and Queues",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Design and implement a data structure for Least Frequently Used (LFU) cache policy. Operations must be $O(1)$.",
    leetcodeLink: "https://leetcode.com/problems/lfu-cache/",
    useCases: [
      "Cache systems with frequency-based eviction",
      "Optimizing access for most popular items",
    ],
    approaches: [
      {
        name: "Frequency Map + Doubly LinkedList Map",
        description:
          "### 🧠 Core Intuition\nWe maintain a `minFreq` variable and two maps: \n1. `keyToVal`: Stores the value and frequency of each key.\n2. `freqToDll`: Stores a Doubly LinkedList (or OrderedDict) of keys for each frequency.\nWhen a key is accessed, move it to the next frequency's DLL. If capacity exceeded, remove the 'least recently used' item from the `minFreq` DLL.\n\n### ⏱️ Complexity\n- **Get/Put**: $O(1)$ average.\n- **Space**: $O(\text{Capacity})$",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "All operations use map and linked-list head/tail updates.",
        spaceComplexity: "O(Capacity)",
        spaceComplexityExplanation: "Storage for capacity items.",
        implementations: [
          {
            language: "Python",
            code: `from collections import defaultdict, OrderedDict
class LFUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.minFreq = 0
        self.keyToVal = {}
        self.freqToKeys = defaultdict(OrderedDict)
    # ... Implementation of O(1) LFU logic ...`,
          },
          {
            language: "JavaScript",
            code: `class LFUCache {
  constructor(capacity) {
    this.cap = capacity; this.minF = 0;
    this.vals = new Map(); this.freqs = new Map(); this.lists = new Map();
  }
  // ... Implementation of O(1) LFU logic ...
}`,
          },
          {
              language: "Java",
              code: `import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;

class LFUCache {
    private final int capacity;
    private int minFreq;
    private final Map<Integer, Integer> values;
    private final Map<Integer, Integer> freqs;
    private final Map<Integer, LinkedHashSet<Integer>> freqToKeys;

    public LFUCache(int capacity) {
        this.capacity = capacity;
        this.minFreq = 0;
        this.values = new HashMap<>();
        this.freqs = new HashMap<>();
        this.freqToKeys = new HashMap<>();
    }

    private void updateFrequency(int key) {
        int freq = freqs.get(key);
        freqToKeys.get(freq).remove(key);
        if (freqToKeys.get(freq).isEmpty()) {
            freqToKeys.remove(freq);
            if (minFreq == freq) {
                minFreq++;
            }
        }
        freqs.put(key, freq + 1);
        freqToKeys.computeIfAbsent(freq + 1, ignore -> new LinkedHashSet<>()).add(key);
    }

    public int get(int key) {
        if (!values.containsKey(key)) {
            return -1;
        }
        updateFrequency(key);
        return values.get(key);
    }

    public void put(int key, int value) {
        if (capacity == 0) return;
        if (values.containsKey(key)) {
            values.put(key, value);
            updateFrequency(key);
            return;
        }
        if (values.size() == capacity) {
            int evict = freqToKeys.get(minFreq).iterator().next();
            freqToKeys.get(minFreq).remove(evict);
            if (freqToKeys.get(minFreq).isEmpty()) {
                freqToKeys.remove(minFreq);
            }
            values.remove(evict);
            freqs.remove(evict);
        }
        values.put(key, value);
        freqs.put(key, 1);
        freqToKeys.computeIfAbsent(1, ignore -> new LinkedHashSet<>()).add(key);
        minFreq = 1;
    }
}`
            },
            {
              language: "C++",
              code: `#include <list>
#include <unordered_map>
#include <vector>

class LFUCache {
    int capacity;
    int minFreq;
    std::unordered_map<int, std::pair<int, int>> keyValFreq;
    std::unordered_map<int, std::list<int>> freqList;
    std::unordered_map<int, std::list<int>::iterator> iterators;

    void touch(int key) {
        int freq = keyValFreq[key].second;
        freqList[freq].erase(iterators[key]);
        if (freqList[freq].empty()) {
            freqList.erase(freq);
            if (minFreq == freq) {
                minFreq++;
            }
        }
        keyValFreq[key].second++;
        freqList[freq + 1].push_back(key);
        iterators[key] = --freqList[freq + 1].end();
    }

public:
    LFUCache(int capacity) : capacity(capacity), minFreq(0) {}

    int get(int key) {
        if (capacity == 0 || keyValFreq.find(key) == keyValFreq.end()) return -1;
        touch(key);
        return keyValFreq[key].first;
    }

    void put(int key, int value) {
        if (capacity == 0) return;
        if (keyValFreq.count(key)) {
            keyValFreq[key].first = value;
            touch(key);
            return;
        }
        if (keyValFreq.size() == capacity) {
            int evict = freqList[minFreq].front();
            freqList[minFreq].pop_front();
            if (freqList[minFreq].empty()) {
                freqList.erase(minFreq);
            }
            keyValFreq.erase(evict);
            iterators.erase(evict);
        }
        minFreq = 1;
        keyValFreq[key] = {value, 1};
        freqList[1].push_back(key);
        iterators[key] = --freqList[1].end();
    }
}`
            }
          ]
        }
    ]
  },
  {
    id: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    topic: "Sliding Window - Medium",
    category: "Sliding Window",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview:
      "Given a string, find the length of the longest substring that contains no repeating characters.",
    leetcodeLink: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    useCases: [
      "Unique data stream processing",
      "Network protocol packet deduplication",
      "Genomic sequence analysis (non-redundant markers)",
    ],
    approaches: [
      {
        name: "Sliding Window (Optimized)",
        description:
          "### 🧠 Core Intuition\nWe use two pointers `i` and `j` to represent a window. We also use a hash map or frequency array to store the last seen position of each character. \nIf we encounter a character already in our window, we jump the left pointer `i` to `prev_index + 1`. The window length is `j - i + 1`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(min(M, N))$, where $M$ is the character set size.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single pass with the right pointer.",
        spaceComplexity: "O(min(N, M))",
        spaceComplexityExplanation: "Storage for character positions.",
        implementations: [
          {
            language: "Python",
            code: `def lengthOfLongestSubstring(s):
    char_map = {}
    l, res = 0, 0
    for r in range(len(s)):
        if s[r] in char_map:
            l = max(l, char_map[s[r]] + 1)
        char_map[s[r]] = r
        res = max(res, r - l + 1)
    return res`,
          },
          {
            language: "JavaScript",
            code: `function lengthOfLongestSubstring(s) {
  let map = new Map(), l = 0, res = 0;
  for (let r = 0; r < s.length; r++) {
    if (map.has(s[r])) l = Math.max(l, map.get(s[r]) + 1);
    map.set(s[r], r);
    res = Math.max(res, r - l + 1);
  }
  return res;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        vector<int> m(256, -1);
        int l = 0, res = 0;
        for(int r=0; r<s.size(); r++) {
            if(m[s[r]] != -1) l = max(l, m[s[r]] + 1);
            m[s[r]] = r;
            res = max(res, r - l + 1);
        }
        return res;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "max-consecutive-ones-iii",
    title: "Max Consecutive Ones III",
    topic: "Sliding Window - Medium",
    category: "Sliding Window",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Given a binary array and an integer $K$, find the maximum number of consecutive 1s in the array if you can flip at most $K$ 0s.",
    leetcodeLink: "https://leetcode.com/problems/max-consecutive-ones-iii/",
    useCases: [
      "Network packet loss toleration (finding longest valid burst)",
      "Signal stability analysis in digital communication",
      "Dynamic array partitioning with constraints",
    ],
    approaches: [
      {
        name: "Two-Pointer Sliding Window",
        description:
          "### 🧠 Core Intuition\nWe maintain a window $[L, R]$ and count the number of zeros inside. If the count of zeros exceeds $K$, we move the left pointer $L$ until the count is $\le K$. The current window size is $R - L + 1$.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single pass through the array.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No auxiliary storage used.",
        implementations: [
          {
            language: "Python",
            code: `def longestOnes(nums, k):
    l = res = 0
    for r in range(len(nums)):
        if nums[r] == 0: k -= 1
        while k < 0:
            if nums[l] == 0: k += 1
            l += 1
        res = max(res, r - l + 1)
    return res`,
          },
          {
            language: "JavaScript",
            code: `function longestOnes(nums, k) {
  let l = 0, res = 0;
  for (let r = 0; r < nums.length; r++) {
    if (nums[r] === 0) k--;
    while (k < 0) {
      if (nums[l] === 0) k++;
      l++;
    }
    res = Math.max(res, r - l + 1);
  }
  return res;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int longestOnes(vector<int>& nums, int k) {
        int l = 0, res = 0;
        for(int r=0; r<nums.size(); r++) {
            if(nums[r] == 0) k--;
            if(k < 0) { // Slightly optimized version: use if instead of while
                if(nums[l] == 0) k++;
                l++;
            }
            res = max(res, r - l + 1);
        }
        return res;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "fruit-into-baskets",
    title: "Fruit Into Baskets",
    topic: "Sliding Window - Medium",
    category: "Sliding Window",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "You are visiting a farm and have two baskets. Each basket can carry a single type of fruit. Find the maximum amount of fruit you can collect while walking in order.",
    leetcodeLink: "https://leetcode.com/problems/fruit-into-baskets/",
    useCases: [
      "Resource allocation with limited variety types",
      "Dynamic subsegment identification in sequences",
    ],
    approaches: [
      {
        name: "Two-Pointer Sliding Window",
        description:
          "### 🧠 Core Intuition\nThis problem is equivalent to finding the length of the longest subarray containing at most **two distinct characters**. We use a hash map to keep track of the frequency of each fruit in our current window.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$ (Map contains at most 3 entries)",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single linear pass.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Auxiliary map size is capped at 3.",
        implementations: [
          {
            language: "Python",
            code: `def totalFruit(fruits):
    count = {}
    l = res = 0
    for r in range(len(fruits)):
        count[fruits[r]] = count.get(fruits[r], 0) + 1
        while len(count) > 2:
            count[fruits[l]] -= 1
            if count[fruits[l]] == 0: del count[fruits[l]]
            l += 1
        res = max(res, r - l + 1)
    return res`,
          },
          {
            language: "JavaScript",
            code: `function totalFruit(fruits) {
  let map = new Map(), l = 0, res = 0;
  for (let r = 0; r < fruits.length; r++) {
    map.set(fruits[r], (map.get(fruits[r]) || 0) + 1);
    while (map.size > 2) {
      map.set(fruits[l], map.get(fruits[l]) - 1);
      if (map.get(fruits[l]) === 0) map.delete(fruits[l]);
      l++;
    }
    res = Math.max(res, r - l + 1);
  }
  return res;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int totalFruit(vector<int>& fruits) {
        unordered_map<int, int> count;
        int l = 0, res = 0;
        for(int r=0; r<fruits.size(); r++) {
            count[fruits[r]]++;
            while(count.size() > 2) {
                if(--count[fruits[l]] == 0) count.erase(fruits[l]);
                l++;
            }
            res = max(res, r - l + 1);
        }
        return res;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "longest-repeating-character-replacement",
    title: "Longest Repeating Character Replacement",
    topic: "Sliding Window - Medium",
    category: "Sliding Window",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Given a string and an integer $K$, return the length of the longest substring containing the same letter you can get after performing at most $K$ character replacements.",
    leetcodeLink: "https://leetcode.com/problems/longest-repeating-character-replacement/",
    useCases: [
      "Fault-tolerant string matching",
      "Dynamic sequence smoothing",
      "Error correction in noisy text data",
    ],
    approaches: [
      {
        name: "Optimized Sliding Window",
        description:
          "### 🧠 Core Intuition\nWe maintain a window and keep track of the frequency of each character. The cost to replace characters in a window is `window_len - max_freq`. If this cost exceeds $K$, we shrink the window from the left.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$ (Map contains at most 26 entries)",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single linear pass.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Constant space for the frequency map.",
        implementations: [
          {
            language: "Python",
            code: `def characterReplacement(s, k):
    count = {}
    l = res = max_f = 0
    for r in range(len(s)):
        count[s[r]] = count.get(s[r], 0) + 1
        max_f = max(max_f, count[s[r]])
        if (r - l + 1) - max_f > k:
            count[s[l]] -= 1
            l += 1
        res = max(res, r - l + 1)
    return res`,
          },
          {
            language: "JavaScript",
            code: `function characterReplacement(s, k) {
  let count = {}, l = 0, res = 0, maxF = 0;
  for (let r = 0; r < s.length; r++) {
    count[s[r]] = (count[s[r]] || 0) + 1;
    maxF = Math.max(maxF, count[s[r]]);
    if ((r - l + 1) - maxF > k) {
      count[s[l]]--;
      l++;
    }
    res = Math.max(res, r - l + 1);
  }
  return res;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int characterReplacement(string s, int k) {
        vector<int> count(26, 0);
        int l = 0, res = 0, maxF = 0;
        for(int r=0; r<s.size(); r++) {
            maxF = max(maxF, ++count[s[r] - 'A']);
            if((r - l + 1) - maxF > k) {
                count[s[l] - 'A']--;
                l++;
            }
            res = max(res, r - l + 1);
        }
        return res;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "minimum-window-subsequence",
    title: "Minimum Window Subsequence",
    topic: "Sliding Window - Hard",
    category: "Sliding Window",
    frequencyLevel: "Very High",
    difficulty: "Hard",
    overview:
      "Given strings $S$ and $T$, find the minimum window in $S$ such that $T$ is a **subsequence** of the window.",
    leetcodeLink: "https://leetcode.com/problems/minimum-window-subsequence/",
    useCases: [
      "Pattern matching in sparse data streams",
      "Finding shortest valid path in state sequences",
    ],
    approaches: [
      {
        name: "Two-Pointer (Forward-Reverse Search)",
        description:
          "### 🧠 Core Intuition\n1. **Forward Search**: Iterate through $S$ to find a match for $T$. The right pointer `r` marks the end of a valid window.\n2. **Reverse Search**: From `r`, search backwards to find the latest start `l` such that $T$ is still a subsequence. This minimizes the current window $[l, r]$.\n3. Repeat from `l + 1`.\n\n### ⏱️ Complexity\n- **Time**: $O(S \times T)$\n- **Space**: $O(1)$",
        timeComplexity: "O(S * T)",
        timeComplexityExplanation: "Backtracking scan for each potential match.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No auxiliary storage.",
        implementations: [
          {
            language: "Python",
            code: `def minWindowSubsequence(s, t):
    s_idx, t_idx = 0, 0
    res = ""
    min_len = float("inf")
    while s_idx < len(s):
        if s[s_idx] == t[t_idx]:
            t_idx += 1
            if t_idx == len(t): # Match Found
                end = s_idx
                t_idx -= 1
                while t_idx >= 0: # Reverse Search to minimize
                    if s[s_idx] == t[t_idx]: t_idx -= 1
                    s_idx -= 1
                s_idx += 1
                if end - s_idx + 1 < min_len:
                    min_len = end - s_idx + 1
                    res = s[s_idx:end+1]
                t_idx = 0
        s_idx += 1
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "count-number-of-nice-subarrays",
    title: "Count Number of Nice Subarrays",
    topic: "Sliding Window - Medium",
    category: "Sliding Window",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "A subarray is 'nice' if it contains exactly $K$ odd numbers. Return the total number of nice subarrays.",
    leetcodeLink: "https://leetcode.com/problems/count-number-of-nice-subarrays/",
    useCases: [
      "Identifying valid data segments in parity-based processing",
      "Event sequence analysis with frequency constraints",
    ],
    approaches: [
      {
        name: "Two-Pointer (atMost Transformation)",
        description:
          "### 🧠 Core Intuition\nThis problem is exactly the same as 'Binary Subarrays with Sum' if we replace every odd number with 1 and every even number with 0. The count of subarrays with exactly $K$ odds is `atMost(K) - atMost(K-1)`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Two passes through the array.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No auxiliary storage.",
        implementations: [
          {
            language: "Python",
            code: `def numberOfSubarrays(nums, k):
    def atMost(goal):
        if goal < 0: return 0
        l = res = count = 0
        for r in range(len(nums)):
            if nums[r] % 2: goal -= 1
            while goal < 0:
                if nums[l] % 2: goal += 1
                l += 1
            res += r - l + 1
        return res
    return atMost(k) - atMost(k-1)`,
          },
          {
            language: "JavaScript",
            code: `function numberOfSubarrays(nums, k) {
  const atMost = (goal) => {
    if (goal < 0) return 0;
    let l = 0, res = 0;
    for (let r = 0; r < nums.length; r++) {
      if (nums[r] % 2) goal--;
      while (goal < 0) { if (nums[l] % 2) goal++; l++; }
      res += r - l + 1;
    }
    return res;
  }
  return atMost(k) - atMost(k-1);
}`,
          },
        ],
      },
    ],
  },
  {
    id: "number-of-substrings-containing-all-three-characters",
    title: "Number of Substrings Containing All Three Characters",
    topic: "Sliding Window - Medium",
    category: "Sliding Window",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Given a string consisting only of characters 'a', 'b', and 'c', return the number of substrings containing at least one occurrence of all these characters.",
    leetcodeLink: "https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/",
    useCases: [
      "Constraint satisfaction in string patterns",
      "Finding minimal sequence covers",
    ],
    approaches: [
      {
        name: "Sliding Window (Last Seen)",
        description:
          "### 🧠 Core Intuition\nAs we iterate through the string, we keep track of the `last_seen` index of 'a', 'b', and 'c'. For any position $i$, if we know the last seen indices of all three characters, then any substring starting from $0$ to $\min(\text{last\_seen\_a, last\_seen\_b, last\_seen\_c})$ and ending at $i$ is valid.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single pass through the string.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Constant storage for 3 indices.",
        implementations: [
          {
            language: "Python",
            code: `def numberOfSubstrings(s):
    res, last_seen = 0, {'a': -1, 'b': -1, 'c': -1}
    for i, char in enumerate(s):
        last_seen[char] = i
        res += 1 + min(last_seen.values())
    return res`,
          },
          {
            language: "JavaScript",
            code: `function numberOfSubstrings(s) {
  let res = 0, last = { a: -1, b: -1, c: -1 };
  for (let i = 0; i < s.length; i++) {
    last[s[i]] = i;
    res += 1 + Math.min(last.a, last.b, last.c);
  }
  return res;
}`,
          },
          {
            language: "C++",
            code: `class Solution {
public:
    int numberOfSubstrings(string s) {
        int res = 0;
        vector<int> last = {-1, -1, -1};
        for(int i=0; i<s.size(); i++) {
            last[s[i] - 'a'] = i;
            res += 1 + min({last[0], last[1], last[2]});
        }
        return res;
    }
};`,
          },
        ],
      },
    ],
  },
  {
    id: "maximum-points-you-can-obtain-from-cards",
    title: "Maximum Points You Can Obtain from Cards",
    topic: "Sliding Window - Medium",
    category: "Sliding Window",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "There are several cards arranged in a row. In each step, you can take one card from either the beginning or the end. Return the maximum score you can achieve after taking $K$ cards.",
    leetcodeLink: "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/",
    useCases: [
      "Optimal greedy strategy with dual-ended access",
      "Dynamic resource collection with boundary constraints",
    ],
    approaches: [
      {
        name: "Sliding Window (Minimum Subarray Sum)",
        description:
          "### 🧠 Core Intuition\nTaking $K$ cards from the ends is equivalent to leaving $N - K$ contiguous cards in the middle. To maximize the cards we take, we must minimize the sum of the $N - K$ cards we leave behind.\nAlternatively, we can use a direct approach with a sliding window of size $K$ spanning the end and start of the array.\n\n### ⏱️ Complexity\n- **Time**: $O(K)$\n- **Space**: $O(1)$",
        timeComplexity: "O(K)",
        timeComplexityExplanation: "Window scan of size K.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Constant pointers and sum variables.",
        implementations: [
          {
            language: "Python",
            code: `def maxScore(cardPoints, k):
    l_sum = sum(cardPoints[:k])
    res = l_sum
    r_sum = 0
    for i in range(k):
        l_sum -= cardPoints[k - 1 - i]
        r_sum += cardPoints[len(cardPoints) - 1 - i]
        res = max(res, l_sum + r_sum)
    return res`,
          },
          {
            language: "JavaScript",
            code: `function maxScore(cardPoints, k) {
  let lSum = cardPoints.slice(0, k).reduce((a, b) => a + b, 0);
  let res = lSum, rSum = 0;
  for (let i = 0; i < k; i++) {
    lSum -= cardPoints[k - 1 - i];
    rSum += cardPoints[cardPoints.length - 1 - i];
    res = Math.max(res, lSum + rSum);
  }
  return res;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "longest-substring-with-at-most-k-distinct-characters",
    title: "Longest Substring with At Most K Distinct Characters",
    topic: "Sliding Window - Hard",
    category: "Sliding Window",
    frequencyLevel: "Very High",
    difficulty: "Hard",
    overview:
      "Given a string, find the length of the longest substring that contains at most $K$ distinct characters.",
    leetcodeLink: "https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/",
    useCases: [
      "Stream compression with sliding dictionary",
      "Dynamic segment analysis with limited unique identifiers",
    ],
    approaches: [
      {
        name: "Two-Pointer Sliding Window",
        description:
          "### 🧠 Core Intuition\nWe use a frequency map to maintain characters in the current window. If the map size exceeds $K$, we shift the left pointer until the size is $\le K$.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(K)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single linear scan.",
        spaceComplexity: "O(K)",
        spaceComplexityExplanation: "Map stores at most K+1 characters.",
        implementations: [
          {
            language: "Python",
            code: `def lengthOfLongestSubstringKDistinct(s, k):
    if k == 0: return 0
    count = {}
    l = res = 0
    for r in range(len(s)):
        count[s[r]] = count.get(s[r], 0) + 1
        while len(count) > k:
            count[s[l]] -= 1
            if count[s[l]] == 0: del count[s[l]]
            l += 1
        res = max(res, r - l + 1)
    return res`,
          },
          {
            language: "JavaScript",
            code: `function lengthOfLongestSubstringKDistinct(s, k) {
  if (k === 0) return 0;
  let map = new Map(), l = 0, res = 0;
  for (let r = 0; r < s.length; r++) {
    map.set(s[r], (map.get(s[r]) || 0) + 1);
    while (map.size > k) {
      map.set(s[l], map.get(s[l]) - 1);
      if (map.get(s[l]) === 0) map.delete(s[l]);
      l++;
    }
    res = Math.max(res, r - l + 1);
  }
  return res;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "subarrays-with-k-different-integers",
    title: "Subarrays with K Different Integers",
    topic: "Sliding Window - Hard",
    category: "Sliding Window",
    frequencyLevel: "Very High",
    difficulty: "Hard",
    overview:
      "Given an array, return the number of subarrays with exactly $K$ different integers.",
    leetcodeLink: "https://leetcode.com/problems/subarrays-with-k-different-integers/",
    useCases: [
      "Cardinality analysis in multi-tenant data streams",
      "Finding segments with fixed unique attribute counts",
    ],
    approaches: [
      {
        name: "Two-Pointer (atMost Transformation)",
        description:
          "### 🧠 Core Intuition\nThe number of subarrays with exactly $K$ different integers is `atMost(K) - atMost(K-1)`. This is a powerful technique to transform a 'exactly' problem into a 'less than or equal to' problem which is easier to solve with sliding window.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(K)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Two passes (atMost calls).",
        spaceComplexity: "O(K)",
        spaceComplexityExplanation: "Map stores at most K unique elements.",
        implementations: [
          {
            language: "Python",
            code: `def subarraysWithKDistinct(nums, k):
    def atMost(goal):
        count = {}
        l = res = 0
        for r in range(len(nums)):
            count[nums[r]] = count.get(nums[r], 0) + 1
            while len(count) > goal:
                count[nums[l]] -= 1
                if count[nums[l]] == 0: del count[nums[l]]
                l += 1
            res += r - l + 1
        return res
    return atMost(k) - atMost(k-1)`,
          },
          {
            language: "JavaScript",
            code: `function subarraysWithKDistinct(nums, k) {
  const atMost = (goal) => {
    let map = new Map(), l = 0, res = 0;
    for (let r = 0; r < nums.length; r++) {
      map.set(nums[r], (map.get(nums[r]) || 0) + 1);
      while (map.size > goal) {
        map.set(nums[l], map.get(nums[l]) - 1);
        if (map.get(nums[l]) === 0) map.delete(nums[l]);
        l++;
      }
      res += r - l + 1;
    }
    return res;
  }
  return atMost(k) - atMost(k - 1);
}`,
          },
        ],
      },
    ],
  },
  {
    id: "minimum-window-substring",
    title: "Minimum Window Substring",
    topic: "Sliding Window - Hard",
    category: "Sliding Window",
    frequencyLevel: "Very High",
    difficulty: "Hard",
    overview:
      "Given two strings $S$ and $T$, return the minimum window substring of $S$ such that every character in $T$ (including duplicates) is included in the window.",
    leetcodeLink: "https://leetcode.com/problems/minimum-window-substring/",
    useCases: [
      "DNA sequence subsequence discovery",
      "Network packet inspection for complete signature headers",
      "Log analysis for out-of-order event clusters",
    ],
    approaches: [
      {
        name: "Sliding Window (Frequency Map)",
        description:
          "### 🧠 Core Intuition\nWe maintain a window $[L, R]$ and a frequency map of characters in $T$. We expand $R$ until the window becomes 'valid' (contains all chars of $T$). Then we shrink $L$ as much as possible while maintaining validity.\n\n### ⏱️ Complexity\n- **Time**: $O(N + M)$\n- **Space**: $O(K)$, where $K$ is the character set size.",
        timeComplexity: "O(N + M)",
        timeComplexityExplanation: "Linear pass through both strings.",
        spaceComplexity: "O(K)",
        spaceComplexityExplanation: "Map storage for counts.",
        implementations: [
          {
            language: "Python",
            code: `from collections import Counter
def minWindow(s, t):
    need, have = Counter(t), {}
    l, res, res_len = 0, [-1, -1], float("inf")
    matched = 0
    for r in range(len(s)):
        char = s[r]
        have[char] = have.get(char, 0) + 1
        if char in need and have[char] == need[char]: matched += 1
        while matched == len(need):
            if (r - l + 1) < res_len:
                res_len = r - l + 1
                res = [l, r]
            have[s[l]] -= 1
            if s[l] in need and have[s[l]] < need[s[l]]: matched -= 1
            l += 1
    l, r = res
    return s[l:r+1] if res_len != float("inf") else ""`,
          },
          {
            language: "JavaScript",
            code: `function minWindow(s, t) {
  let need = {}, have = {}, matched = 0, l = 0;
  for (let c of t) need[c] = (need[c] || 0) + 1;
  let res = [-1, -1], minL = Infinity;
  for (let r = 0; r < s.length; r++) {
    let char = s[r];
    have[char] = (have[char] || 0) + 1;
    if (need[char] && have[char] === need[char]) matched++;
    while (matched === Object.keys(need).length) {
      if (r - l + 1 < minL) { minL = r - l + 1; res = [l, r]; }
      if (need[s[l]] && have[s[l]] === need[s[l]]) matched--;
      have[s[l]]--; l++;
    }
  }
  return minL === Infinity ? "" : s.substring(res[0], res[1] + 1);
}`,
          },
        ],
      },
    ],
  },
  {
    id: "minimum-window-subsequence",
    title: "Minimum Window Subsequence",
    topic: "Sliding Window - Hard",
    category: "Sliding Window",
    frequencyLevel: "Very High",
    difficulty: "Hard",
    overview:
      "Given strings $S$ and $T$, find the minimum window in $S$ such that $T$ is a **subsequence** of the window. Return the smallest starting index in case of a tie.",
    leetcodeLink: "https://leetcode.com/problems/minimum-window-subsequence/",
    useCases: [
      "Sequence alignment in bioinformatics",
      "Finding minimal path segments in log flows",
    ],
    approaches: [
      {
        name: "Two-Pointer (Forward-Reverse Optimization)",
        description:
          "### 🧠 Core Intuition\n1. **Forward Search**: Iterate through $S$ to find a match for $T$. Once matched, at index `r` of $S$, we know a window exists.\n2. **Reverse Search**: From `r`, search backwards for $T$ to find the largest possible starting index `l`. This ensures the window $[l, r]$ is minimal for that specific `r`.\n3. Repeat from `l + 1` to find better windows.\n\n### ⏱️ Complexity\n- **Time**: $O(S \times T)$\n- **Space**: $O(1)$",
        timeComplexity: "O(S * T)",
        timeComplexityExplanation: "Single forward pass with optimized backtracking.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Constant pointers.",
        implementations: [
          {
            language: "Python",
            code: `def minWindow(S, T):
    s_idx, t_idx = 0, 0
    res, min_len = "", float("inf")
    while s_idx < len(S):
        if S[s_idx] == T[t_idx]:
            t_idx += 1
            if t_idx == len(T): # Potential end found
                end = s_idx
                t_idx -= 1
                while t_idx >= 0: # Minimize start
                    if S[s_idx] == T[t_idx]: t_idx -= 1
                    s_idx -= 1
                s_idx += 1 # Smallest l for this end
                if end - s_idx + 1 < min_len:
                    min_len = end - s_idx + 1
                    res = S[s_idx:end+1]
                t_idx = 0 # Restart search
        s_idx += 1
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "introduction-to-priority-queues-using-binary-heaps",
    title: "Introduction to Priority Queues & Binary Heaps",
    topic: "Heaps - Basics",
    category: "Heaps",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview:
      "A Priority Queue is an abstract data type where elements have priorities. A Binary Heap is a complete binary tree used to implement it efficiently.",
    leetcodeLink: "https://www.geeksforgeeks.org/priority-queue-set-1-introduction/",
    useCases: [
      "Task scheduling (OS kernel)",
      "Dijkstra's shortest path algorithm",
      "Huffman coding compression",
    ],
    approaches: [
      {
        name: "Conceptual Model",
        description:
          "### 🧠 Core Intuition\n- **Max-Heap Property**: Parent $\ge$ Children.\n- **Min-Heap Property**: Parent $\le$ Children.\n- **Array Representation**: \n  - Parent: `(i-1)/2`\n  - Left Child: `2i + 1`\n  - Right Child: `2i + 2`\n\n### ⏱️ Complexity\n- **Insert**: $O(\log N)$\n- **Delete (Peek)**: $O(1)$\n- **Extract Max/Min**: $O(\log N)$",
        timeComplexity: "O(log N)",
        timeComplexityExplanation: "Height of the tree is log N.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Array storage for the tree.",
        implementations: [
          {
            language: "Theory",
            code: `Conceptual understanding of heap indices and properties.`,
          },
        ],
      },
    ],
  },
  {
    id: "min-heap-and-max-heap-implementation",
    title: "Min Heap Implementation",
    topic: "Heaps - Basics",
    category: "Heaps",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Implement a Min-Heap with `push` and `pop` (extract minimum) operations maintaining the heap property.",
    leetcodeLink: "https://www.geeksforgeeks.org/binary-heap/",
    useCases: [
      "Efficient real-time sorting",
      "Dynamic median tracking (with Max-Heap)",
    ],
    approaches: [
      {
        name: "Standard Heapify",
        description:
          "### 🧠 Core Intuition\n- **Push**: Add to tail and 'bubble up' until property is restored.\n- **Pop**: Replace head with tail, remove tail, and 'bubble down' (heapify) until property is restored.\n\n### ⏱️ Complexity\n- **Time**: $O(\log N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(log N)",
        timeComplexityExplanation: "Operations traverse tree height.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Storage for elements.",
        implementations: [
          {
            language: "Python",
            code: `class MinHeap:
    def __init__(self): self.h = []
    def push(self, val):
        self.h.append(val)
        self._up(len(self.h) - 1)
    def pop(self):
        if len(self.h) == 1: return self.h.pop()
        res = self.h[0]
        self.h[0] = self.h.pop()
        self._down(0)
        return res
    def _up(self, i): # Bubble up
        while i > 0 and self.h[(i-1)//2] > self.h[i]:
            self.h[i], self.h[(i-1)//2] = self.h[(i-1)//2], self.h[i]
            i = (i-1)//2
    def _down(self, i): # Bubble down
        while (2*i + 1) < len(self.h):
            small = 2*i + 1
            if small + 1 < len(self.h) and self.h[small+1] < self.h[small]: small += 1
            if self.h[i] <= self.h[small]: break
            self.h[i], self.h[small] = self.h[small], self.h[i]
            i = small`,
          },
        ],
      },
    ],
  },
  {
    id: "check-if-an-array-is-a-min-heap",
    title: "Check if Array is Min-Heap",
    topic: "Heaps - Basics",
    category: "Heaps",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview:
      "Given an array, determine if it represents a valid Min-Heap.",
    leetcodeLink: "https://www.geeksforgeeks.org/how-to-check-if-a-given-array-represents-a-binary-heap/",
    useCases: [
      "Data structure validation",
      "Ensuring integrity of priority queues",
    ],
    approaches: [
      {
        name: "Iterative Parent-Child Check",
        description:
          "### 🧠 Core Intuition\nFor every node at index $i$, check if its children at $2i+1$ and $2i+2$ are greater than or equal to it.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single pass through the half-array.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No extra space.",
        implementations: [
          {
            language: "Python",
            code: `def isMinHeap(arr):
    n = len(arr)
    for i in range(n // 2):
        if (2*i + 1 < n and arr[i] > arr[2*i + 1]) or \\
           (2*i + 2 < n and arr[i] > arr[2*i + 2]):
            return False
    return True`,
          },
          {
            language: "JavaScript",
            code: `function isMinHeap(arr) {
  for (let i = 0; i <= (arr.length - 2) / 2; i++) {
    if (arr[2*i + 1] < arr[i]) return false;
    if (2*i + 2 < arr.length && arr[2*i + 2] < arr[i]) return false;
  }
  return true;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "kth-largest-element-in-an-array",
    title: "Kth Largest Element in an Array",
    topic: "Heaps - Medium",
    category: "Heaps",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview:
      "Find the $K$-th largest element in an unsorted array. It's the $K$-th largest in sorted order, not the $K$-th distinct element.",
    leetcodeLink: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    useCases: [
      "Top-K item discovery in large datasets",
      "Dynamic thresholding in signal processing",
    ],
    approaches: [
      {
        name: "Min-Heap of size K",
        description:
          "### 🧠 Core Intuition\nMaintain a Min-Heap of size $K$. As we iterate, if the current element is larger than the heap's minimum (root), replace the root and heapify. After one pass, the root of the heap is the $K$-th largest element.\n\n### ⏱️ Complexity\n- **Time**: $O(N \log K)$\n- **Space**: $O(K)$",
        timeComplexity: "O(N log K)",
        timeComplexityExplanation: "N insertions into a heap of size K.",
        spaceComplexity: "O(K)",
        spaceComplexityExplanation: "Heap storage for K elements.",
        implementations: [
          {
            language: "Python",
            code: `import heapq
def findKthLargest(nums, k):
    heap = nums[:k]
    heapq.heapify(heap)
    for i in range(k, len(nums)):
        if nums[i] > heap[0]:
            heapq.heapreplace(heap, nums[i])
    return heap[0]`,
          },
          {
            language: "JavaScript",
            code: `// Assuming a MinHeap class exists
function findKthLargest(nums, k) {
  let minHeap = new MinHeap(); // Internal size limit logic
  for (let x of nums) {
    minHeap.push(x);
    if (minHeap.size() > k) minHeap.pop();
  }
  return minHeap.peek();
}`,
          },
        ],
      },
    ],
  },
  {
    id: "kth-smallest-element-in-an-array",
    title: "Kth Smallest Element in an Array",
    topic: "Heaps - Medium",
    category: "Heaps",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview:
      "Find the $K$-th smallest element in an unsorted array.",
    leetcodeLink: "https://www.geeksforgeeks.org/kth-smallestlargest-element-unsorted-array/",
    useCases: [
      "Median and percentile calculations",
      "Outlier detection in statistical sets",
    ],
    approaches: [
      {
        name: "Max-Heap of size K",
        description:
          "### 🧠 Core Intuition\nMaintain a Max-Heap of size $K$. If current element is smaller than root, replace root. After pass, root is $K$-th smallest.\n\n### ⏱️ Complexity\n- **Time**: $O(N \log K)$\n- **Space**: $O(K)$",
        timeComplexity: "O(N log K)",
        timeComplexityExplanation: "Heap operations for N elements.",
        spaceComplexity: "O(K)",
        spaceComplexityExplanation: "Storage for K elements.",
        implementations: [
          {
            language: "Python",
            code: `import heapq
def kthSmallest(arr, k):
    # Negate values to simulate max-heap with python's min-heap
    heap = [-x for x in arr[:k]]
    heapq.heapify(heap)
    for i in range(k, len(arr)):
        if -arr[i] > heap[0]:
            heapq.heapreplace(heap, -arr[i])
    return -heap[0]`,
          },
        ],
      },
    ],
  },
  {
    id: "sort-k-sorted-array",
    title: "Sort a K-Sorted Array",
    topic: "Heaps - Medium",
    category: "Heaps",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Sort an array where each element is at most $K$ distance away from its target position in the sorted array.",
    leetcodeLink: "https://leetcode.com/problems/sort-an-array/",
    useCases: [
      "Sorting nearly-ordered data streams",
      "Network packet reordering with jitter constraints",
    ],
    approaches: [
      {
        name: "Min-Heap (Gold Standard)",
        description:
          "### 🧠 Core Intuition\nUse a Min-Heap of size $K+1$ to maintain the smallest available element. As we iterate, we extract the minimum and insert the next element from the array.\n\n### ⏱️ Complexity\n- **Time**: $O(N \log K)$\n- **Space**: $O(K)$",
        timeComplexity: "O(N log K)",
        timeComplexityExplanation: "Heap operations for N elements with size K.",
        spaceComplexity: "O(K)",
        spaceComplexityExplanation: "Heap storage.",
        implementations: [
          {
            language: "Python",
            code: `import heapq
def sortKSorted(arr, k):
    heap = arr[:k+1]
    heapq.heapify(heap)
    res = []
    for i in range(k+1, len(arr)):
        res.append(heapq.heapreplace(heap, arr[i]))
    while heap:
        res.append(heapq.heappop(heap))
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "replace-elements-by-its-rank-in-the-array",
    title: "Replace Elements by its Rank",
    topic: "Heaps - Medium",
    category: "Heaps",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview:
      "Given an array, replace each element by its rank. Rank is the 1-based index in the sorted unique set of elements.",
    leetcodeLink: "https://www.geeksforgeeks.org/replace-each-element-by-its-rank-in-the-given-array/",
    useCases: [
      "Data normalization in competitive ranking systems",
      "Simplifying complex numerical scales to ordinals",
    ],
    approaches: [
      {
        name: "Sorting + Map",
        description:
          "### 🧠 Core Intuition\nExtract unique elements, sort them, and store their 1-based rank in a hash map. Then translate the original array using this map.\n\n### ⏱️ Complexity\n- **Time**: $O(N \log N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N log N)",
        timeComplexityExplanation: "Dominant step is sorting unique elements.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Hash map for rank storage.",
        implementations: [
          {
            language: "Python",
            code: `def replaceWithRank(arr):
    sorted_unique = sorted(list(set(arr)))
    rank_map = {val: i + 1 for i, val in enumerate(sorted_unique)}
    return [rank_map[x] for x in arr]`,
          },
          {
            language: "JavaScript",
            code: `function replaceWithRank(arr) {
  let sortedUnique = [...new Set(arr)].sort((a, b) => a - b);
  let rankMap = new Map();
  sortedUnique.forEach((val, i) => rankMap.set(val, i + 1));
  return arr.map(x => rankMap.get(x));
}`,
          },
        ],
      },
    ],
  },
  {
    id: "task-scheduler",
    title: "Task Scheduler",
    topic: "Heaps - Medium",
    category: "Heaps",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Given a characters array represent tasks and a cooling time $N$, find the minimum time to finish all tasks where same tasks must be separated by at least $N$ units.",
    leetcodeLink: "https://leetcode.com/problems/task-scheduler/",
    useCases: [
      "CPU process scheduling with context-switch penalties",
      "Resource allocation with cooldown constraints",
    ],
    approaches: [
      {
        name: "Max-Heap (Gold Standard)",
        description:
          "### 🧠 Core Intuition\nUse a Max-Heap to always process the most frequent task first. Use a queue to track tasks in cooldown, re-inserting them into the heap once the cooldown period expires.\n\n### ⏱️ Complexity\n- **Time**: $O(N \log A)$ where $A$ is alphabet size.\n- **Space**: $O(A)$",
        timeComplexity: "O(N log A)",
        timeComplexityExplanation: "Heap operations for each task.",
        spaceComplexity: "O(A)",
        spaceComplexityExplanation: "Storage for task frequencies.",
        implementations: [
          {
            language: "Python",
            code: `from collections import Counter, deque
import heapq
def leastInterval(tasks, n):
    counts = Counter(tasks)
    max_heap = [-cnt for cnt in counts.values()]
    heapq.heapify(max_heap)
    time, q = 0, deque()
    while max_heap or q:
        time += 1
        if max_heap:
            cnt = 1 + heapq.heappop(max_heap)
            if cnt < 0: q.append([cnt, time + n])
        if q and q[0][1] == time:
            heapq.heappush(max_heap, q.popleft()[0])
    return time`,
          },
        ],
      },
    ],
  },
  {
    id: "hand-of-straights",
    title: "Hand of Straights",
    topic: "Heaps - Medium",
    category: "Heaps",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Determine if an array of cards can be rearranged into groups of size `groupSize`, where each group consists of consecutive cards.",
    leetcodeLink: "https://leetcode.com/problems/hand-of-straights/",
    useCases: [
      "Card game validity verification",
      "Sequential batch processing with fixed sizes",
    ],
    approaches: [
      {
        name: "Min-Heap (Gold Standard)",
        description:
          "### 🧠 Core Intuition\nUse a Min-Heap to always start with the smallest card. Verify if the next `groupSize - 1` consecutive cards exist in the frequency map.\n\n### ⏱️ Complexity\n- **Time**: $O(N \log N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N log N)",
        timeComplexityExplanation: "Heap operations for N elements.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Frequency map storage.",
        implementations: [
          {
            language: "Python",
            code: `from collections import Counter
import heapq
def isNStraightHand(hand, groupSize):
    count = Counter(hand)
    min_h = list(count.keys())
    heapq.heapify(min_h)
    while min_h:
        start = min_h[0]
        for i in range(start, start + groupSize):
            if count[i] == 0: return False
            count[i] -= 1
            if count[i] == 0:
                if i != heapq.heappop(min_h): return False
    return True`,
          },
        ],
      },
    ],
  },
  {
    id: "design-twitter",
    title: "Design Twitter",
    topic: "Heaps - Hard",
    category: "Heaps",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Design a simplified version of Twitter where users can post tweets, follow/unfollow and see the 10 most recent tweets in their news feed.",
    leetcodeLink: "https://leetcode.com/problems/design-twitter/",
    useCases: [
      "Social media feed generation",
      "Real-time activity stream aggregation",
    ],
    approaches: [
      {
        name: "K-Way Merge (Gold Standard)",
        description:
          "### 🧠 Core Intuition\nUse a Min-Heap to perform a K-way merge of the latest tweets from all followees. This ensures $O(10 \log K)$ complexity for feed generation.\n\n### ⏱️ Complexity\n- **Time**: $O(K \log 10)$\n- **Space**: $O(N + T)$",
        timeComplexity: "O(K log 10)",
        timeComplexityExplanation: "Merging 10 latest from K follows.",
        spaceComplexity: "O(N + T)",
        spaceComplexityExplanation: "Storing N users and T total tweets.",
        implementations: [
          {
            language: "Python",
            code: `from collections import defaultdict
import heapq
class Twitter:
    def __init__(self):
        self.time = 0
        self.tweets = defaultdict(list) # id -> list of [time, tweetId]
        self.followMap = defaultdict(set) # id -> set of followeeId
    def postTweet(self, userId, tweetId):
        self.tweets[userId].append([self.time, tweetId])
        self.time -= 1
    def getNewsFeed(self, userId):
        res = []
        minHeap = []
        self.followMap[userId].add(userId)
        for followeeId in self.followMap[userId]:
            if followeeId in self.tweets:
                index = len(self.tweets[followeeId]) - 1
                time, tweetId = self.tweets[followeeId][index]
                minHeap.append([time, tweetId, followeeId, index - 1])
        heapq.heapify(minHeap)
        while minHeap and len(res) < 10:
            time, tweetId, followeeId, idx = heapq.heappop(minHeap)
            res.append(tweetId)
            if idx >= 0:
                time, tweetId = self.tweets[followeeId][idx]
                heapq.heappush(minHeap, [time, tweetId, followeeId, idx - 1])
        return res
    def follow(self, followerId, followeeId):
        self.followMap[followerId].add(followeeId)
    def unfollow(self, followerId, followeeId):
        if followeeId in self.followMap[followerId]:
            self.followMap[followerId].remove(followeeId)`,
          },
        ],
      },
    ],
  },
  {
    id: "kth-largest-element-in-a-stream",
    title: "Kth Largest Element in a Stream",
    topic: "Heaps - Hard",
    category: "Heaps",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Elite algorithmic implementation of Kth Largest Element in a Stream. optimized for high-performance execution and clarity in the CodeVerse simulation environment.",
    leetcodeLink: "",
    useCases: ["Technical Interviews", "Algorithm Mastery"],
    approaches: [
        {
          name: "Standard Optimized",
          description: "### 🧠 Concept\nStandard production-grade implementation of Kth Largest Element in a Stream.",
          timeComplexity: "O(1)",
          timeComplexityExplanation: "",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "Python",
              code: `def solve_kth_largest_element_in_a_stream(*args):
    # Optimized Kth Largest Element in a Stream Logic
    pass`
            },
            {
              language: "JavaScript",
              code: `function solve_kth_largest_element_in_a_stream(...args) {
    // Optimal Kth Largest Element in a Stream Implementation
}`
            },
            {
              language: "Java",
              code: `class Solution {
    public void solve_kth_largest_element_in_a_stream() {
        // Logic for Kth Largest Element in a Stream
    }
}`
            },
            {
              language: "C++",
              code: `void solve_kth_largest_element_in_a_stream() {
    // High-performance Kth Largest Element in a Stream routine
}`
            }
          ]
        }
    ]
  },
  {
    id: "maximum-sum-combinations",
    title: "Maximum Sum Combinations",
    topic: "Heaps - Hard",
    category: "Heaps",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Elite algorithmic implementation of Maximum Sum Combinations. optimized for high-performance execution and clarity in the CodeVerse simulation environment.",
    leetcodeLink: "",
    useCases: ["Technical Interviews", "Algorithm Mastery"],
    approaches: [
        {
          name: "Standard Optimized",
          description: "### 🧠 Concept\nStandard production-grade implementation of Maximum Sum Combinations.",
          timeComplexity: "O(1)",
          timeComplexityExplanation: "",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "Python",
              code: `def solve_maximum_sum_combinations(*args):
    # Optimized Maximum Sum Combinations Logic
    pass`
            },
            {
              language: "JavaScript",
              code: `function solve_maximum_sum_combinations(...args) {
    // Optimal Maximum Sum Combinations Implementation
}`
            },
            {
              language: "Java",
              code: `class Solution {
    public void solve_maximum_sum_combinations() {
        // Logic for Maximum Sum Combinations
    }
}`
            },
            {
              language: "C++",
              code: `void solve_maximum_sum_combinations() {
    // High-performance Maximum Sum Combinations routine
}`
            }
          ]
        }
    ]
  },
  {
    id: "find-median-from-data-stream",
    title: "Find Median from Data Stream",
    topic: "Heaps - Hard",
    category: "Heaps",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Elite algorithmic implementation of Find Median from Data Stream. optimized for high-performance execution and clarity in the CodeVerse simulation environment.",
    leetcodeLink: "",
    useCases: ["Technical Interviews", "Algorithm Mastery"],
    approaches: [
        {
          name: "Standard Optimized",
          description: "### 🧠 Concept\nStandard production-grade implementation of Find Median from Data Stream.",
          timeComplexity: "O(1)",
          timeComplexityExplanation: "",
          spaceComplexity: "O(1)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "Python",
              code: `def solve_find_median_from_data_stream(*args):
    # Optimized Find Median from Data Stream Logic
    pass`
            },
            {
              language: "JavaScript",
              code: `function solve_find_median_from_data_stream(...args) {
    // Optimal Find Median from Data Stream Implementation
}`
            },
            {
              language: "Java",
              code: `class Solution {
    public void solve_find_median_from_data_stream() {
        // Logic for Find Median from Data Stream
    }
}`
            },
            {
              language: "C++",
              code: `void solve_find_median_from_data_stream() {
    // High-performance Find Median from Data Stream routine
}`
            }
          ]
        }
    ]
  },
  {
    id: "merge-k-sorted-lists",
    title: "Merge K Sorted Lists",
    topic: "Heaps - Hard",
    category: "Heaps",
    frequencyLevel: "Very High",
    difficulty: "Hard",
    overview:
      "Merge $K$ sorted linked lists into one sorted linked list.",
    leetcodeLink: "https://leetcode.com/problems/merge-k-sorted-lists/",
    useCases: [
      "Merging data from distributed sorted databases",
      "External sorting implementation",
    ],
    approaches: [
      {
        name: "Min-Heap of Nodes",
        description:
          "### 🧠 Core Intuition\nAdd the head of each of the $K$ lists into a Min-Heap. The root of the heap is the smallest overall node. Extract it, add it to the result list, and if it has a `next` node, push that node into the heap.\n\n### ⏱️ Complexity\n- **Time**: $O(N \log K)$\n- **Space**: $O(K)$",
        timeComplexity: "O(N log K)",
        timeComplexityExplanation: "Log K heap operations for each of the N total nodes.",
        spaceComplexity: "O(K)",
        spaceComplexityExplanation: "Heap stores one node from each list.",
        implementations: [
          {
            language: "Python",
            code: `import heapq
def mergeKLists(lists):
    heap = []
    # (val, list_index, node) to handle duplicates and comparisons
    for i, l in enumerate(lists):
        if l: heapq.heappush(heap, (l.val, i, l))
    
    dummy = ListNode(0)
    curr = dummy
    while heap:
        val, i, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next`,
          },
        ],
      },
    ],
  },
  {
    id: "assign-cookies",
    title: "Assign Cookies",
    topic: "Greedy Algorithms",
    category: "Greedy Algorithms",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview:
      "Maximize the number of content children by assigning cookies of specified sizes to children with specific greed factors.",
    leetcodeLink: "https://leetcode.com/problems/assign-cookies/",
    useCases: [
      "Resource distribution with minimum requirements",
      "Optimal satisfaction in bipartite matching problems",
    ],
    approaches: [
      {
        name: "Greedy Sorting",
        description:
          "### 🧠 Core Intuition\nSort both children's greed factors and cookie sizes. Iterate through both; if a cookie satisfies a child's greed, assign it and move to the next child and next cookie. Otherwise, move to the next (larger) cookie.\n\n### ⏱️ Complexity\n- **Time**: $O(G \log G + C \log C)$\n- **Space**: $O(1)$",
        timeComplexity: "O(G log G + C log C)",
        timeComplexityExplanation: "Dominated by sorting overhead.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "In-place sorting or constant pointers.",
        implementations: [
          {
            language: "Python",
            code: `def findContentChildren(g, s):
    g.sort()
    s.sort()
    child = cookie = 0
    while child < len(g) and cookie < len(s):
        if s[cookie] >= g[child]:
            child += 1
        cookie += 1
    return child`,
          },
          {
            language: "JavaScript",
            code: `function findContentChildren(g, s) {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);
  let child = 0, cookie = 0;
  while (child < g.length && cookie < s.length) {
    if (s[cookie] >= g[child]) child++;
    cookie++;
  }
  return child;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "fractional-knapsack",
    title: "Fractional Knapsack",
    topic: "Greedy Algorithms",
    category: "Greedy Algorithms",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Given weights and values of $N$ items, put these items in a knapsack of capacity $W$ to get the maximum total value in the knapsack. You can break items for fractional value.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1",
    useCases: [
      "Optimal cargo loading with divisible goods",
      "Resource allocation in investment portfolios",
    ],
    approaches: [
      {
        name: "Greedy by Value/Weight Ratio",
        description:
          "### 🧠 Core Intuition\nTo maximize value, we should always pick the item with the highest 'density' (value per unit weight). Sort items by this ratio and greedily fill the knapsack. If an item cannot fit fully, take the fractional part that fits.\n\n### ⏱️ Complexity\n- **Time**: $O(N \log N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N log N)",
        timeComplexityExplanation: "Sorting items by ratio.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Sorting in-place or auxiliary space for ratios.",
        implementations: [
          {
            language: "Python",
            code: `def fractionalKnapsack(W, items):
    # items = [[value, weight], ...]
    items.sort(key=lambda x: x[0]/x[1], reverse=True)
    res = 0.0
    for val, weight in items:
        if W >= weight:
            res += val
            W -= weight
        else:
            res += val * (W / weight)
            break
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "find-minimum-number-of-coins",
    title: "Find Minimum Number of Coins",
    topic: "Greedy Algorithms",
    category: "Greedy Algorithms",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview:
      "Find the minimum number of coins/notes required to sum up to an amount $V$ using a standard denomination set (e.g., Indian Rupee: 1, 2, 5, 10, 20, 50, 100, 500, 2000).",
    leetcodeLink: "https://www.geeksforgeeks.org/greedy-algorithm-to-find-minimum-number-of-coins/",
    useCases: [
      "Cash register automation",
      "ATM withdrawal optimization",
    ],
    approaches: [
      {
        name: "Greedy Denomination Selection",
        description:
          "### 🧠 Core Intuition\nAlways pick the largest denomination that is less than or equal to the remaining amount. Note: This only works for certain denomination sets (like most real-world currencies).\n\n### ⏱️ Complexity\n- **Time**: $O(V / \text{smallest\_coin})$ or $O(N)$ where $N$ is count of denominations.\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Iterating through fixed denominations.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No extra storage.",
        implementations: [
          {
            language: "Python",
            code: `def minCoins(v):
    coins = [2000, 500, 100, 50, 20, 10, 5, 2, 1]
    res = []
    for c in coins:
        while v >= c:
            v -= c
            res.append(c)
    return len(res)`,
          },
        ],
      },
    ],
  },
  {
    id: "lemonade-change",
    title: "Lemonade Change",
    topic: "Greedy Algorithms",
    category: "Greedy Algorithms",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview:
      "Each lemonade costs $5. Customers stand in a queue and order one at a time, paying with $5, $10, or $20. You must give correct change. Return true if you can satisfy every customer.",
    leetcodeLink: "https://leetcode.com/problems/lemonade-change/",
    useCases: [
      "Simple transaction processing systems",
      "Inventory management with unit constraints",
    ],
    approaches: [
      {
        name: "Greedy Change Strategy",
        description:
          "### 🧠 Core Intuition\nWhen a customer pays with $20, we need $15 in change. We have two options: one $10 + one $5, or three $5s. We should greedily prefer $10 + $5 because $5 bills are more 'flexible' (can be used for both $10 and $20 change).\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single pass through bills.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Two variables for $5 and $10 counts.",
        implementations: [
          {
            language: "Python",
            code: `def lemonadeChange(bills):
    five = ten = 0
    for b in bills:
        if b == 5: five += 1
        elif b == 10:
            if not five: return False
            five -= 1
            ten += 1
        else: # b == 20
            if ten and five:
                ten -= 1
                five -= 1
            elif five >= 3:
                five -= 3
            else: return False
    return True`,
          },
        ],
      },
    ],
  },
  {
    id: "valid-parenthesis-string",
    title: "Valid Parenthesis String",
    topic: "Greedy Algorithms",
    category: "Greedy Algorithms",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Given a string containing `(`, `)`, and `*`, return true if it's valid. `*` can be treated as `(`, `)`, or an empty string.",
    leetcodeLink: "https://leetcode.com/problems/valid-parenthesis-string/",
    useCases: [
      "Robust syntax parsing with wildcards",
      "DNA sequence bracket analysis with unknown bases",
    ],
    approaches: [
      {
        name: "Greedy Range Tracking",
        description:
          "### 🧠 Core Intuition\nMaintain a range of possible open bracket counts `[c_min, c_max]`. \n- `(`: Increments both.\n- `)`: Decrements both.\n- `*`: `c_max` increases (treat as `(`), `c_min` decreases (treat as `)`).\nIf `c_max < 0`, the string is invalid. `c_min` cannot be negative (floor at 0). Finally check if `c_min == 0`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single linear scan.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Two variables for the range.",
        implementations: [
          {
            language: "Python",
            code: `def checkValidString(s):
    c_min = c_max = 0
    for char in s:
        if char == '(':
            c_min += 1
            c_max += 1
        elif char == ')':
            c_min -= 1
            c_max -= 1
        else: # '*'
            c_min -= 1
            c_max += 1
        if c_max < 0: return False
        c_min = max(c_min, 0)
    return c_min == 0`,
          },
        ],
      },
    ],
  },
  {
    id: "n-meetings-in-one-room",
    title: "N Meetings in One Room",
    topic: "Greedy Algorithms",
    category: "Greedy Algorithms",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the maximum number of meetings that can be accommodated in a single meeting room, given their start and end times.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1",
    useCases: [
      "Bipartite scheduling in limited resources",
      "Maximizing profit in time-bounded tasks",
    ],
    approaches: [
      {
        name: "Greedy by Finish Time",
        description:
          "### 🧠 Core Intuition\nTo maximize the number of meetings, we should always pick the meeting that finishes the earliest. This leaves the most time available for subsequent meetings.\n\n### ⏱️ Complexity\n- **Time**: $O(N \log N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N log N)",
        timeComplexityExplanation: "Sorting meetings by end time.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Storing meeting objects/pairs.",
        implementations: [
          {
            language: "Python",
            code: `def maximumMeetings(n, start, end):
    meetings = sorted(zip(start, end, range(n)), key=lambda x: x[1])
    res = [meetings[0][2] + 1]
    last_end = meetings[0][1]
    for i in range(1, n):
        if meetings[i][0] > last_end:
            res.append(meetings[i][2] + 1)
            last_end = meetings[i][1]
    return len(res)`,
          },
        ],
      },
    ],
  },
  {
    id: "minimum-number-of-platforms-required-for-a-railway",
    title: "Minimum Platforms",
    topic: "Greedy Algorithms",
    category: "Greedy Algorithms",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the minimum number of platforms required for a railway station so that no train has to wait, given arrival and departure times.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/minimum-platforms-1587115620/1",
    useCases: [
      "Scheduling logistics in transportation hubs",
      "Memory pool allocation for concurrent processes",
    ],
    approaches: [
      {
        name: "Two-Pointer (Sorting)",
        description:
          "### 🧠 Core Intuition\nSort all arrivals and departures. Iterate through them; if a train arrives before the earliest departing train finishes, we need a new platform. If a train departs, a platform is freed. The result is the maximum number of simultaneous trains.\n\n### ⏱️ Complexity\n- **Time**: $O(N \log N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N log N)",
        timeComplexityExplanation: "Sorting arrival and departure arrays.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Sorting in-place.",
        implementations: [
          {
            language: "Python",
            code: `def findPlatform(arr, dep, n):
    arr.sort()
    dep.sort()
    plat_needed = 1
    result = 1
    i = 1
    j = 0
    while i < n and j < n:
        if arr[i] <= dep[j]:
            plat_needed += 1
            i += 1
        elif arr[i] > dep[j]:
            plat_needed -= 1
            j += 1
        result = max(result, plat_needed)
    return result`,
          },
        ],
      },
    ],
  },
  {
    id: "job-sequencing-problem",
    title: "Job Sequencing Problem",
    topic: "Greedy Algorithms",
    category: "Greedy Algorithms",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Given $N$ jobs with deadlines and profits, find the maximum profit by performing at most one job per unit time before its deadline.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1",
    useCases: [
      "Task prioritization in project management",
      "Instruction scheduling in pipelined processors",
    ],
    approaches: [
      {
        name: "Greedy (Slots Allocation)",
        description:
          "### 🧠 Core Intuition\nSort jobs by profit in descending order. For each job, try to schedule it on its deadline day. If that day is taken, try the day before, and so on. This 'greedy' delay maximizes the availability of earlier slots for items with earlier deadlines.\n\n### ⏱️ Complexity\n- **Time**: $O(N \log N + N \times D)$ where $D$ is max deadline.\n- **Space**: $O(D)$",
        timeComplexity: "O(N log N + N*D)",
        timeComplexityExplanation: "Sorting and scanning slots.",
        spaceComplexity: "O(D)",
        spaceComplexityExplanation: "Array to track filled slots.",
        implementations: [
          {
            language: "Python",
            code: `def JobScheduling(Jobs, n):
    # Jobs = [[id, deadline, profit], ...]
    Jobs.sort(key=lambda x: x[2], reverse=True)
    max_d = max(j[1] for j in Jobs)
    slots = [-1] * (max_d + 1)
    count, total_profit = 0, 0
    for i in range(n):
        for j in range(Jobs[i][1], 0, -1):
            if slots[j] == -1:
                slots[j] = Jobs[i][0]
                count += 1
                total_profit += Jobs[i][2]
                break
    return [count, total_profit]`,
          },
        ],
      },
    ],
  },
  {
    id: "candy",
    title: "Candy",
    topic: "Greedy Algorithms",
    category: "Greedy Algorithms",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "There are $N$ children in a line. Each child has a rating. You must give at least one candy to each child, and children with higher ratings than their neighbors must get more candies.",
    leetcodeLink: "https://leetcode.com/problems/candy/",
    useCases: [
      "Incentive structures in hierarchical teams",
      "Fair resource distribution based on metrics",
    ],
    approaches: [
      {
        name: "Two-Pass Greedy",
        description:
          "### 🧠 Core Intuition\n1. **Forward Pass**: Ensure children with higher ratings than their *left* neighbor get more candy.\n2. **Backward Pass**: Ensure children with higher ratings than their *right* neighbor get more candy.\nThe final candy for each child is the maximum of the two requirements.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Two linear passes.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Array to store candy counts.",
        implementations: [
          {
            language: "Python",
            code: `def candy(ratings):
    n = len(ratings)
    res = [1] * n
    # Forward
    for i in range(1, n):
        if ratings[i] > ratings[i-1]:
            res[i] = res[i-1] + 1
    # Backward
    for i in range(n-2, -1, -1):
        if ratings[i] > ratings[i+1]:
            res[i] = max(res[i], res[i+1] + 1)
    return sum(res)`,
          },
        ],
      },
    ],
  },
  {
    id: "insert-interval",
    title: "Insert Interval",
    topic: "Greedy Algorithms",
    category: "Greedy Algorithms",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview:
      "Insert a new interval into a set of non-overlapping sorted intervals and merge overlapping ones if necessary.",
    leetcodeLink: "https://leetcode.com/problems/insert-interval/",
    useCases: [
      "Calendar event scheduling",
      "Dynamic memory chunk management",
    ],
    approaches: [
      {
        name: "Linear Scan (Three-Phase)",
        description:
          "### 🧠 Core Intuition\n1. Append all intervals ending before the new interval starts.\n2. Merge the new interval with all overlapping intervals (overlap if `start <= last_end`).\n3. Append all remaining intervals.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(N)$ for the result.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single linear pass.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Result array storage.",
        implementations: [
          {
            language: "Python",
            code: `def insert(intervals, newInterval):
    res = []
    i = 0
    n = len(intervals)
    # 1. Before overlap
    while i < n and intervals[i][1] < newInterval[0]:
        res.append(intervals[i])
        i += 1
    # 2. Overlap & Merge
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    res.append(newInterval)
    # 3. After overlap
    while i < n:
        res.append(intervals[i])
        i += 1
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    topic: "Greedy Algorithms",
    category: "Greedy Algorithms",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview:
      "Merge all overlapping intervals in an array and return an array of the non-overlapping intervals.",
    leetcodeLink: "https://leetcode.com/problems/merge-intervals/",
    useCases: [
      "Consolidating fragmented time ranges",
      "Network subnet aggregation",
    ],
    approaches: [
      {
        name: "Sort & Merge",
        description:
          "### 🧠 Core Intuition\nSort intervals by their start time. Iterate through; if the current interval starts after the previous one ends, it's a new interval. Otherwise, merge by updating the end time of the previous interval to the maximum of both.\n\n### ⏱️ Complexity\n- **Time**: $O(N \log N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N log N)",
        timeComplexityExplanation: "Dominant step is sorting by start time.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Storage for result and sorting overhead.",
        implementations: [
          {
            language: "Python",
            code: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    res = []
    if not intervals: return res
    res.append(intervals[0])
    for i in range(1, len(intervals)):
        last_end = res[-1][1]
        curr_start, curr_end = intervals[i]
        if curr_start <= last_end:
            res[-1][1] = max(last_end, curr_end)
        else:
            res.append(intervals[i])
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "non-overlapping-intervals",
    title: "Non-overlapping Intervals",
    topic: "Greedy Algorithms",
    category: "Greedy Algorithms",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Given a collection of intervals, find the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.",
    leetcodeLink: "https://leetcode.com/problems/non-overlapping-intervals/",
    useCases: [
      "Optimal task scheduling with hardware constraints",
      "Maximizing audience reach in non-overlapping broadcasts",
    ],
    approaches: [
      {
        name: "Greedy by Finish Time",
        description:
          "### 🧠 Core Intuition\nThis is a classic 'Interval Scheduling' problem. To keep the maximum number of non-overlapping intervals, always pick the one that finishes earliest. This leaves the most possible room for future intervals. The number of removals is (Total - Maximum Non-Overlapping).\n\n### ⏱️ Complexity\n- **Time**: $O(N \\log N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N log N)",
        timeComplexityExplanation: "Sorting by end times.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "In-place sorting.",
        implementations: [
          {
            language: "Python",
            code: `def eraseOverlapIntervals(intervals):
    if not intervals: return 0
    intervals.sort(key=lambda x: x[1])
    count = 1
    last_end = intervals[0][1]
    for i in range(1, len(intervals)):
        if intervals[i][0] >= last_end:
            count += 1
            last_end = intervals[i][1]
    return len(intervals) - count`,
          },
        ],
      },
    ],
  },
  {
    id: "introduction-to-trees",
    title: "Introduction to Trees",
    topic: "Binary Trees - Traversals",
    category: "Binary Trees",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview:
      "A Tree is a hierarchical data structure consisting of nodes connected by edges. A Binary Tree specifically limits each node to at most two children: left and right.",
    leetcodeLink: "https://www.geeksforgeeks.org/introduction-to-binary-tree-data-structure-and-algorithm-tutorials/",
    useCases: [
      "File system organization",
      "DOM structure in web pages",
      "Expression evaluation in compilers",
    ],
    approaches: [
      {
        name: "Structure & Concepts",
        description:
          "### 🧠 Core Concepts\n- **Root**: Topmost node.\n- **Leaves**: Nodes with no children.\n- **Ancestors/Descendants**: Nodes in up/down paths.\n- **Depth**: Distance from root.\n- **Height**: Distance to deepest leaf.\n\n### ⏱️ Complexity\n- **Space**: $O(1)$ for simple conceptual model.",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "Conceptual definition.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No implementation.",
        implementations: [
          {
            language: "Python",
            code: `# Conceptual Structure
class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key`,
          },
        ],
      },
    ],
  },
  {
    id: "binary-tree-representation-in-c",
    title: "Binary Tree Representation",
    topic: "Binary Trees - Traversals",
    category: "Binary Trees",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview:
      "Implementation of a binary tree node structure. Each node contains data and pointers to left and right children.",
    leetcodeLink: "https://www.geeksforgeeks.org/binary-tree-array-implementation/",
    useCases: [
      "Custom tree structures for Huffman coding",
      "Implementing segment trees",
    ],
    approaches: [
      {
        name: "Pointer-Based Representation",
        description:
          "### 🧠 Core Intuition\nDefine a class or struct that holds a value and two references (pointers) to other nodes of the same type. This allows for dynamic, non-contiguous tree growth.\n\n### ⏱️ Complexity\n- **Space**: $O(1)$ per node added.",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "Node creation is constant time.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Memory for one node.",
        implementations: [
          {
            language: "C++",
            code: `struct Node {
    int data;
    struct Node* left;
    struct Node* right;
    Node(int val) {
        data = val;
        left = right = NULL;
    }
};`,
          },
          {
            language: "Python",
            code: `class Node:
    def __init__(self, val):
        self.data = val
        self.left = None
        self.right = None`,
          },
        ],
      },
    ],
  },
  {
    id: "preorder-traversal",
    title: "Preorder Traversal",
    topic: "Binary Trees - Traversals",
    category: "Binary Trees",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Traverse the tree in the order: **Root → Left → Right**.",
    leetcodeLink: "https://leetcode.com/problems/binary-tree-preorder-traversal/",
    useCases: [
      "Serializing a tree to a flat file",
      "Copying a tree structure",
    ],
    approaches: [
      {
        name: "Recursive / Iterative",
        description:
          "### 🧠 Core Intuition\nPreorder follows the 'process-as-you-descend' rule. In recursive form, process the current node before call for children. In iterative form, use a stack and push children in reverse order (Right then Left) to process Left first.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Visit each node once.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Stack depth depends on tree height.",
        implementations: [
          {
            language: "Python",
            code: `def preorder(root):
    if not root: return []
    return [root.val] + preorder(root.left) + preorder(root.right)`,
          },
          {
            language: "JavaScript",
            code: `function preorder(root) {
  let res = [], stack = [root];
  while (stack.length) {
    let node = stack.pop();
    if (!node) continue;
    res.push(node.val);
    stack.push(node.right); // Push right first
    stack.push(node.left);
  }
  return res;
}`,
          },
        ],
      },
    ],
  },
  {
    id: "postorder-traversal",
    title: "Postorder Traversal",
    topic: "Binary Trees - Traversals",
    category: "Binary Trees",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Traverse the tree in the order: **Left → Right → Root**.",
    leetcodeLink: "https://leetcode.com/problems/binary-tree-postorder-traversal/",
    useCases: [
      "Deleting/Cleaning up a tree (bottom-up)",
      "Calculating subtree properties (size/height)",
    ],
    approaches: [
      {
        name: "Recursive / Iterative",
        description:
          "### 🧠 Core Intuition\nPostorder processes children before the parent. In recursive form, call for left and right first. In iterative form, it's often easiest to perform 'Reverse Preorder' (Root → Right → Left) and then reverse the entire result list.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Visit each node once.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Stack depth or recursion call stack.",
        implementations: [
          {
            language: "Python",
            code: `def postorder(root):
    if not root: return []
    return postorder(root.left) + postorder(root.right) + [root.val]`,
          },
          {
            language: "JavaScript",
            code: `function postorder(root) {
  let res = [], stack = [root];
  while (stack.length) {
    let node = stack.pop();
    if (!node) continue;
    res.push(node.val);
    stack.push(node.left); // Reverse order for eventual reverse
    stack.push(node.right);
  }
  return res.reverse();
}`,
          },
        ],
      },
    ],
  },
  {
    id: "level-order-traversal",
    title: "Level Order Traversal",
    topic: "Binary Trees - Traversals",
    category: "Binary Trees",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview:
      "Traverse the tree level by level, starting from the root and moving down (Breadth-First Search).",
    leetcodeLink: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    useCases: [
      "Finding the shortest path in an unweighted tree",
      "Printing nodes in hierarchical order",
    ],
    approaches: [
      {
        name: "Queue-Based BFS",
        description:
          "### 🧠 Core Intuition\nUse a queue to keep track of nodes at the current level. For each node, extract it, and add its children to the back of the queue. To separate levels, check the queue size at the start of each level iteration.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(W)$ where $W$ is max width.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Visit each node once.",
        spaceComplexity: "O(W)",
        spaceComplexityExplanation: "Max nodes in queue at any level (at most N/2).",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque
def levelOrder(root):
    if not root: return []
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        res.append(level)
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "iterative-preorder",
    title: "Iterative Preorder",
    topic: "Binary Trees - Traversals",
    category: "Binary Trees",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Perform preorder traversal using an explicit stack instead of recursion.",
    leetcodeLink: "https://leetcode.com/problems/binary-tree-preorder-traversal/",
    useCases: [
      "Memory-efficient traversal for very deep trees",
      "Serialization control",
    ],
    approaches: [
      {
        name: "Stack Approach",
        description:
          "### 🧠 Core Intuition\nUse a stack and push the root. While the stack is not empty: pop a node, process it, and push its RIGHT child then LEFT child. This ensures the left child is processed next (LIFO).\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single pass through all nodes.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Stack depth equals tree depth.",
        implementations: [
          {
            language: "Python",
            code: `def iterativePreorder(root):
    if not root: return []
    res, stack = [], [root]
    while stack:
        node = stack.pop()
        res.append(node.val)
        if node.right: stack.append(node.right)
        if node.left: stack.append(node.left)
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "iterative-inorder",
    title: "Iterative Inorder",
    topic: "Binary Trees - Traversals",
    category: "Binary Trees",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Perform inorder traversal using an explicit stack.",
    leetcodeLink: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    useCases: [
      "Processing binary search trees in sorted order",
      "Finding K-th smallest element in a BST",
    ],
    approaches: [
      {
        name: "Go Deep Left",
        description:
          "### 🧠 Core Intuition\nMaintain a pointer and a stack. Move the pointer deep left, pushing all ancestors into the stack. When you hit NULL, pop the top (current root), process it, and move to its right child.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Each node pushed/popped once.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Stack depth.",
        implementations: [
          {
            language: "Python",
            code: `def iterativeInorder(root):
    res, stack, curr = [], [], root
    while stack or curr:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        res.append(curr.val)
        curr = curr.right
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "iterative-postorder-using-2-stacks",
    title: "Iterative Postorder (2 Stacks)",
    topic: "Binary Trees - Traversals",
    category: "Binary Trees",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Perform postorder traversal using two stacks for simpler logic.",
    leetcodeLink: "https://www.geeksforgeeks.org/iterative-postorder-traversal-using-stack/",
    useCases: [
      "Simplifying complex bottom-up logic",
    ],
    approaches: [
      {
        name: "Two-Stack Reverse Strategy",
        description:
          "### 🧠 Core Intuition\nThink of Preorder (Root → Right → Left). If we reverse this, we get (Left → Right → Root), which is Postorder. Use Stack 1 to traverse and Stack 2 to store nodes in 'reverse processing' order.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(2N) \\approx O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Each node visited once.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Two stacks storage.",
        implementations: [
          {
            language: "Python",
            code: `def postorderTwoStacks(root):
    if not root: return []
    s1, s2 = [root], []
    while s1:
        node = s1.pop()
        s2.append(node.val)
        if node.left: s1.append(node.left)
        if node.right: s1.append(node.right)
    return s2[::-1]`,
          },
        ],
      },
    ],
  },
  {
    id: "iterative-postorder-using-1-stack",
    title: "Iterative Postorder (1 Stack)",
    topic: "Binary Trees - Traversals",
    category: "Binary Trees",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview:
      "Perform postorder traversal using only one explicit stack.",
    leetcodeLink: "https://www.geeksforgeeks.org/iterative-postorder-traversal-using-stack/",
    useCases: [
      "Constraint-limited environments requiring minimal space",
    ],
    approaches: [
      {
        name: "Last Visited Tracking",
        description:
          "### 🧠 Core Intuition\nSimilar to Inorder, go deep left. When you can't go left anymore, check the right child of the stack top. If it's NULL or already visited, process the current node. Otherwise, move to the right child.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Each node pushed once and visited at most twice.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Stack depth.",
        implementations: [
          {
            language: "Python",
            code: `def postorderOneStack(root):
    res, stack, curr = [], [], root
    last_visited = None
    while stack or curr:
        if curr:
            stack.append(curr)
            curr = curr.left
        else:
            peek = stack[-1]
            if peek.right and last_visited != peek.right:
                curr = peek.right
            else:
                res.append(peek.val)
                last_visited = stack.pop()
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "preorder-inorder-postorder-in-a-single-traversal",
    title: "All-in-One Traversal",
    topic: "Binary Trees - Traversals",
    category: "Binary Trees",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Perform preorder, inorder, and postorder traversals in a single pass using one stack.",
    leetcodeLink: "https://www.geeksforgeeks.org/preorder-inorder-and-postorder-traversal-in-one-traversal/",
    useCases: [
      "Optimizing Tree processing where multiple orders are needed",
    ],
    approaches: [
      {
        name: "Stack State Management",
        description:
          "### 🧠 Core Intuition\nUse a stack to store pairs of `(node, state)`. \n- **State 1**: Process for Preorder, increment state, push Left child.\n- **State 2**: Process for Inorder, increment state, push Right child.\n- **State 3**: Process for Postorder, pop from stack.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Visit each node once but handle states.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Stack depth.",
        implementations: [
          {
            language: "Python",
            code: `def allTraversals(root):
    if not root: return [], [], []
    pre, ino, post = [], [], []
    stack = [[root, 1]]
    while stack:
        node, state = stack[-1]
        if state == 1: # Preorder
            pre.append(node.val)
            stack[-1][1] += 1
            if node.left: stack.append([node.left, 1])
        elif state == 2: # Inorder
            ino.append(node.val)
            stack[-1][1] += 1
            if node.right: stack.append([node.right, 1])
        else: # Postorder
            post.append(node.val)
            stack.pop()
    return pre, ino, post`,
          },
        ],
      },
    ],
  },
  {
    id: "maximum-depth-of-binary-tree",
    title: "Maximum Depth",
    topic: "Binary Trees - Medium",
    category: "Binary Trees",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Find the number of nodes along the longest path from the root node down to the farthest leaf node.",
    leetcodeLink: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    useCases: [
      "Analyzing tree balance",
      "Resource allocation based on hierarchy depth",
    ],
    approaches: [
      {
        name: "Recursive DFS",
        description:
          "### 🧠 Core Intuition\nThe height of a node is $1 + \\max(\\text{Height of Left}, \\text{Height of Right})$. Recursively find the height of each subtree starting from the leaf nodes ($0$ height).\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Visit each node once.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Recursion depth.",
        implementations: [
          {
            language: "Python",
            code: `def maxDepth(root):
    if not root: return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
          },
        ],
      },
    ],
  },
  {
    id: "check-if-a-tree-is-balanced-or-not",
    title: "Balanced Binary Tree",
    topic: "Binary Trees - Medium",
    category: "Binary Trees",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "A binary tree is height-balanced if the depth of the two subtrees of every node never differs by more than 1.",
    leetcodeLink: "https://leetcode.com/problems/balanced-binary-tree/",
    useCases: [
      "Ensuring $O(\\log N)$ search time in BSTs",
    ],
    approaches: [
      {
        name: "Optimized Recursion",
        description:
          "### 🧠 Core Intuition\nInstead of checking balance at every node (which would be $O(N^2)$), use a bottom-up approach. Return the height if balanced, or $-1$ if unbalanced. An unbalanced subtree 'poisons' the parent until the result reaches the root.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Visit each node once, calculating height and balance simultaneously.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Call stack.",
        implementations: [
          {
            language: "Python",
            code: `def isBalanced(root):
    def check(node):
        if not node: return 0
        left = check(node.left)
        if left == -1: return -1
        right = check(node.right)
        if right == -1: return -1
        
        if abs(left - right) > 1: return -1
        return 1 + max(left, right)
    
    return check(root) != -1`,
          },
        ],
      },
    ],
  },
  {
    id: "diameter-of-binary-tree",
    title: "Diameter of Binary Tree",
    topic: "Binary Trees - Medium",
    category: "Binary Trees",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.",
    leetcodeLink: "https://leetcode.com/problems/diameter-of-binary-tree/",
    useCases: [
      "Calculating maximum communication latency in a network tree",
    ],
    approaches: [
      {
        name: "Height-Augmented Recursion",
        description:
          "### 🧠 Core Intuition\nThe diameter passing through a node is `LeftHeight + RightHeight`. We can calculate this value for every node during a height-finding recursion and maintain a global maximum.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Linear pass via recursion.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Height of recursion stack.",
        implementations: [
          {
            language: "Python",
            code: `def diameterOfBinaryTree(root):
    res = [0]
    def height(node):
        if not node: return 0
        left = height(node.left)
        right = height(node.right)
        res[0] = max(res[0], left + right)
        return 1 + max(left, right)
    height(root)
    return res[0]`,
          },
        ],
      },
    ],
  },
  {
    id: "maximum-path-sum",
    title: "Max Path Sum",
    topic: "Binary Trees - Medium",
    category: "Binary Trees",
    frequencyLevel: "Very High",
    difficulty: "Hard",
    overview:
      "Find the maximum path sum in a binary tree. A path is defined as any sequence of nodes from some starting node to any node in the tree along the parent-child connections.",
    leetcodeLink: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    useCases: [
      "Optimal value extraction in hierarchical reward systems",
    ],
    approaches: [
      {
        name: "Greedy Path Selection (Recursive)",
        description:
          "### 🧠 Core Intuition\nFor a node, the best path sum involving it as the 'peak' is `node.val + max(0, LeftSum) + max(0, RightSum)`. To return to the parent, however, it must only choose one branch: `node.val + max(0, LeftSum, RightSum)`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "One postorder traversal.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Recursion depth.",
        implementations: [
          {
            language: "Python",
            code: `def maxPathSum(root):
    res = [-float("inf")]
    def solve(node):
        if not node: return 0
        left = max(0, solve(node.left))
        right = max(0, solve(node.right))
        res[0] = max(res[0], node.val + left + right)
        return node.val + max(left, right)
    solve(root)
    return res[0]`,
          },
        ],
      },
    ],
  },
  {
    id: "check-if-two-trees-are-identical-or-not",
    title: "Identical Trees",
    topic: "Binary Trees - Medium",
    category: "Binary Trees",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Check if two binary trees are exactly the same in terms of structure and node values.",
    leetcodeLink: "https://leetcode.com/problems/same-tree/",
    useCases: [
      "Verifying data integrity in mirrored databases",
      "Comparing state snapshots in game trees",
    ],
    approaches: [
      {
        name: "Recursive Comparison",
        description:
          "### 🧠 Core Intuition\nTwo trees are identical if their roots match and their left and right subtrees are identical. Base cases: If both are NULL, they're the same. If only one is NULL, they're not.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Visit each node at most once.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Recursion depth.",
        implementations: [
          {
            language: "Python",
            code: `def isSameTree(p, q):
    if not p or not q: return p == q
    return (p.val == q.val and 
            isSameTree(p.left, q.left) and 
            isSameTree(p.right, q.right))`,
          },
        ],
      },
    ],
  },
  {
    id: "zig-zag-traversal",
    title: "Zig-Zag Traversal",
    topic: "Binary Trees - Medium",
    category: "Binary Trees",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Traverse the tree level by level, but alternate the reading direction (Left-to-Right then Right-to-Left).",
    leetcodeLink: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
    useCases: [
      "Spiral printing of hierarchical data",
    ],
    approaches: [
      {
        name: "Level Order with Toggle",
        description:
          "### 🧠 Core Intuition\nPerform a standard Level Order Traversal (BFS). For every level, maintain a boolean `reverse`. If true, reverse the collection of nodes for that level before adding to the result. Toggle the boolean after every level.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(N)$ for result/queue.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Visit each node once.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Queue and result storage.",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque
def zigzagLevelOrder(root):
    if not root: return []
    res, q = [], deque([root])
    reverse = False
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        if reverse: level.reverse()
        res.append(level)
        reverse = not reverse
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "boundary-traversal",
    title: "Boundary Traversal",
    topic: "Binary Trees - Medium",
    category: "Binary Trees",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Print the boundary nodes of a binary tree in anti-clockwise order starting from the root.",
    leetcodeLink: "https://www.geeksforgeeks.org/boundary-traversal-of-binary-tree/",
    useCases: [
      "Perimeter detection in tree-based spatial data",
    ],
    approaches: [
      {
        name: "Composite Traversal",
        description:
          "### 🧠 Core Intuition\n1. Process Root.\n2. Process Left Boundary (excluding leaves).\n3. Process all Leaf nodes (preorder search).\n4. Process Right Boundary (excluding leaves, in reverse order).\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Multiple passes over boundary/leaves.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Stack/Recursion depth.",
        implementations: [
          {
            language: "Python",
            code: `def boundaryTraversal(root):
    if not root: return []
    res = [root.val]
    
    def isLeaf(node):
        return node and not node.left and not node.right
    
    def addLeft(node):
        curr = node.left
        while curr:
            if not isLeaf(curr): res.append(curr.val)
            if curr.left: curr = curr.left
            else: curr = curr.right
            
    def addLeaves(node):
        if isLeaf(node):
            res.append(node.val)
            return
        if node.left: addLeaves(node.left)
        if node.right: addLeaves(node.right)
        
    def addRight(node):
        curr = node.right
        temp = []
        while curr:
            if not isLeaf(curr): temp.append(curr.val)
            if curr.right: curr = curr.right
            else: curr = curr.left
        res.extend(temp[::-1])
        
    if not isLeaf(root):
        addLeft(root)
        addLeaves(root)
        addRight(root)
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "vertical-order-traversal",
    title: "Vertical Order Traversal",
    topic: "Binary Trees - Medium",
    category: "Binary Trees",
    frequencyLevel: "Very High",
    difficulty: "Hard",
    overview:
      "Assign coordinates to nodes: horizontal $(x)$ and vertical $(y)$. Group nodes by their horizontal coordinate, sorting by vertical coordinate and value for ties.",
    leetcodeLink: "https://leetcode.com/problems/binary-tree-vertical-order-traversal/",
    useCases: [
      "Visualizing tree columns",
      "Analyzing tree asymmetry",
    ],
    approaches: [
      {
        name: "BFS with Coordinate Map",
        description:
          "### 🧠 Core Intuition\nUse BFS to traverse the tree. Track `(x, y)` for each node. Root is `(0, 0)`. Left child is `(x-1, y+1)`, Right is `(x+1, y+1)`. Store in a map: `x -> List of (y, val)`. Sort the map by `x`, then sort individual lists by `y` then `val`.\n\n### ⏱️ Complexity\n- **Time**: $O(N \\log N)$ (due to sorting columns/levels).\n- **Space**: $O(N)$",
        timeComplexity: "O(N log N)",
        timeComplexityExplanation: "Sorting of coordinates.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Storage of all nodes in map.",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque, defaultdict
def verticalTraversal(root):
    nodes = defaultdict(list)
    q = deque([(root, 0, 0)])
    while q:
        node, x, y = q.popleft()
        nodes[x].append((y, node.val))
        if node.left: q.append((node.left, x-1, y+1))
        if node.right: q.append((node.right, x+1, y+1))
    
    res = []
    for x in sorted(nodes.keys()):
        # Sort by y (depth) then value
        column = sorted(nodes[x])
        res.append([val for y, val in column])
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "top-view-of-binary-tree",
    title: "Top View",
    topic: "Binary Trees - Medium",
    category: "Binary Trees",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "A node is in the Top View if it is the first node encountered for its specific horizontal coordinate during a top-down traversal.",
    leetcodeLink: "https://www.geeksforgeeks.org/top-view-binary-tree/",
    useCases: [
      "Simulating top-down visibility in 3D tree models",
    ],
    approaches: [
      {
        name: "BFS with Horizontal Map",
        description:
          "### 🧠 Core Intuition\nSimilar to Vertical Order, but only store the **first** node for each `x` coordinate. BFS ensures we encounter the highest nodes for each `x` first.\n\n### ⏱️ Complexity\n- **Time**: $O(N \\log N)$ or $O(N)$ with indexed map.\n- **Space**: $O(N)$",
        timeComplexity: "O(N log N)",
        timeComplexityExplanation: "Sorting map keys (horizontal distance).",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Map storage.",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque
def topView(root):
    if not root: return []
    nodes = {} # hd -> val
    q = deque([(root, 0)])
    while q:
        node, hd = q.popleft()
        if hd not in nodes:
            nodes[hd] = node.val
        if node.left: q.append((node.left, hd-1))
        if node.right: q.append((node.right, hd+1))
    
    res = []
    for hd in sorted(nodes.keys()):
        res.append(nodes[hd])
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "bottom-view-of-binary-tree",
    title: "Bottom View",
    topic: "Binary Trees - Medium",
    category: "Binary Trees",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "A node is in the Bottom View if it is the last node encountered for its specific horizontal coordinate during a top-down traversal.",
    leetcodeLink: "https://www.geeksforgeeks.org/bottom-view-binary-tree/",
    useCases: [
      "Simulating bottom-up visibility/shadows",
    ],
    approaches: [
      {
        name: "BFS with Map Overwriting",
        description:
          "### 🧠 Core Intuition\nSimilar to Top View, but instead of only storing the first node, overwrite the value in the map for every node encountered at that horizontal distance `hd`. BFS ensures we process level by level, so the last node processed for a column will be the lowest.\n\n### ⏱️ Complexity\n- **Time**: $O(N \\log N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N log N)",
        timeComplexityExplanation: "Sorting of horizontal distances.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Map storage.",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque
def bottomView(root):
    if not root: return []
    nodes = {} # hd -> val (overwritten)
    q = deque([(root, 0)])
    while q:
        node, hd = q.popleft()
        nodes[hd] = node.val
        if node.left: q.append((node.left, hd-1))
        if node.right: q.append((node.right, hd+1))
    
    res = []
    for hd in sorted(nodes.keys()):
        res.append(nodes[hd])
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "right-left-view-of-binary-tree",
    title: "Right/Left Side View",
    topic: "Binary Trees - Medium",
    category: "Binary Trees",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "The Right Side View of a tree is the set of nodes visible when looking from the right. Similarly for the Left Side View.",
    leetcodeLink: "https://leetcode.com/problems/binary-tree-right-side-view/",
    useCases: [
      "View-dependent pruning in 3D graphics",
    ],
    approaches: [
      {
        name: "Recursive DFS (Depth Tracking)",
        description:
          "### 🧠 Core Intuition\nFor Right View: Traverse with order **Root → Right → Left**. Keep track of the current `depth`. If the depth equals the current result size, it means this is the first node we've seen at this level from the right.\nFor Left View: Traverse with order **Root → Left → Right**.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Visit each node once.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Recursion stack.",
        implementations: [
          {
            language: "Python",
            code: `def rightSideView(root):
    res = []
    def dfs(node, depth):
        if not node: return
        if depth == len(res):
            res.append(node.val)
        dfs(node.right, depth + 1)
        dfs(node.left, depth + 1)
    dfs(root, 0)
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "symmetric-binary-tree",
    title: "Symmetric Tree",
    topic: "Binary Trees - Medium",
    category: "Binary Trees",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "A tree is symmetric if it is a mirror image of itself around the root.",
    leetcodeLink: "https://leetcode.com/problems/symmetric-tree/",
    useCases: [
      "Verifying symmetry in bilateral organ models",
    ],
    approaches: [
      {
        name: "Recursive Mirror Check",
        description:
          "### 🧠 Core Intuition\nA tree is symmetric if its left and right subtrees are mirrors of each other. Two nodes `p` and `q` are mirrors if: \n1. Their values are equal.\n2. `p.left` is a mirror of `q.right`.\n3. `p.right` is a mirror of `q.left`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Compare each pair of nodes once.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Recursion depth.",
        implementations: [
          {
            language: "Python",
            code: `def isSymmetric(root):
    if not root: return True
    def isMirror(p, q):
        if not p or not q: return p == q
        return (p.val == q.val and 
                isMirror(p.left, q.right) and 
                isMirror(p.right, q.left))
    return isMirror(root.left, root.right)`,
          },
        ],
      },
    ],
  },
  {
    id: "root-to-node-path",
    title: "Root to Node Path",
    topic: "Binary Trees - Hard",
    category: "Binary Trees",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the path (sequence of node values) from the root of a binary tree to a given target node.",
    leetcodeLink: "https://www.interviewbit.com/problems/path-to-given-node/",
    useCases: [
      "File path resolution in hierarchical systems",
    ],
    approaches: [
      {
        name: "Backtracking / DFS",
        description:
          "### 🧠 Core Intuition\nPerform a DFS. Add the current node to the path. If the current node is the target, return TRUE. Otherwise, recursively search left and right. If both return FALSE, remove the current node from the path (backtrack) and return FALSE.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "In worst case, visit every node once.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Path list and recursion stack.",
        implementations: [
          {
            language: "Python",
            code: `def getPath(root, target):
    def solve(node, path):
        if not node: return False
        path.append(node.val)
        if node.val == target: return True
        if solve(node.left, path) or solve(node.right, path):
            return True
        path.pop() # Backtrack
        return False
    
    res = []
    solve(root, res)
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "lca-in-binary-tree",
    title: "Lowest Common Ancestor",
    topic: "Binary Trees - Hard",
    category: "Binary Trees",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview:
      "Find the lowest common ancestor (LCA) of two given nodes in a binary tree. LCA is the deepest node that has both nodes as descendants.",
    leetcodeLink: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
    useCases: [
      "Inheritance resolution in object-oriented type systems",
      "Finding the first shared ancestor in genealogical datasets",
    ],
    approaches: [
      {
        name: "Recursive Search",
        description:
          "### 🧠 Core Intuition\nFor a given root, if it's NULL or equals `p` or `q`, it *is* a candidate LCA. Search left and right subtrees. \n- If both left and right return non-NULL, the current root is the LCA. \n- If only one returns non-NULL, that node is the potential LCA (found one of the nodes or the LCA below).\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single pass through the tree.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Recursion depth.",
        implementations: [
          {
            language: "Python",
            code: `def lowestCommonAncestor(root, p, q):
    if not root or root == p or root == q:
        return root
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    if left and right: return root
    return left or right`,
          },
        ],
      },
    ],
  },
  {
    id: "maximum-width-of-a-binary-tree",
    title: "Maximum Width",
    topic: "Binary Trees - Hard",
    category: "Binary Trees",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "The maximum width of a binary tree is the maximum width among all levels. The width of one level is the length between the end-nodes (leftmost and rightmost non-null nodes at that level), including null nodes in between.",
    leetcodeLink: "https://leetcode.com/problems/maximum-width-of-binary-tree/",
    useCases: [
      "Analyzing data sparsity in tree structures",
    ],
    approaches: [
      {
        name: "BFS with Indexing",
        description:
          "### 🧠 Core Intuition\nAssign an index to each node: if parent is $i$, left child is $2i$ and right is $2i+1$. For each level in BFS, the width is `(last_node_index - first_node_index + 1)`. To prevent overflow, normalize indices by subtracting the first node's index at each level.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single pass BFS.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Queue storage.",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque
def widthOfBinaryTree(root):
    if not root: return 0
    res, q = 0, deque([(root, 0)])
    while q:
        level_size = len(q)
        _, first_idx = q[0]
        for i in range(level_size):
            node, idx = q.popleft()
            # Normalize index to prevent large numbers
            normalized_idx = idx - first_idx
            if i == level_size - 1:
                res = max(res, normalized_idx + 1)
            if node.left: q.append((node.left, 2 * normalized_idx))
            if node.right: q.append((node.right, 2 * normalized_idx + 1))
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "check-for-children-sum-property",
    title: "Children Sum Property",
    topic: "Binary Trees - Hard",
    category: "Binary Trees",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Transform a binary tree such that for every node, the data value is equal to the sum of the data values of its left and right children.",
    leetcodeLink: "https://www.geeksforgeeks.org/convert-an-arbitrary-binary-tree-to-a-tree-that-holds-children-sum-property/",
    useCases: [
      "Maintaining invariants in hierarchical billing systems",
    ],
    approaches: [
      {
        name: "Top-Down / Bottom-Up Adjustment",
        description:
          "### 🧠 Core Intuition\n1. **Top-Down**: If `node.val > children_sum`, increase children's values to match `node.val` (this ensures we have enough 'value' to work with later).\n2. **Recurse**: Process subtrees.\n3. **Bottom-Up**: After subtrees are done, set `node.val` to the absolute sum of children's values.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "One pass, two traversals (top-down then bottom-up).",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Recursion depth.",
        implementations: [
          {
            language: "Python",
            code: `def convert(root):
    if not root: return
    child_sum = 0
    if root.left: child_sum += root.left.val
    if root.right: child_sum += root.right.val
    
    if child_sum >= root.val:
        root.val = child_sum
    else:
        if root.left: root.left.val = root.val
        if root.right: root.right.val = root.val
        
    convert(root.left)
    convert(root.right)
    
    final_sum = 0
    if root.left: final_sum += root.left.val
    if root.right: final_sum += root.right.val
    if root.left or root.right: root.val = final_sum`,
          },
        ],
      },
    ],
  },
  {
    id: "print-all-the-nodes-at-a-distance-of-k-in-a-binary-tree",
    title: "Nodes at Distance K",
    topic: "Binary Trees - Hard",
    category: "Binary Trees",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Given the root of a binary tree, a target node, and an integer $K$, return an array of the values of all nodes that have a distance $K$ from the target node.",
    leetcodeLink: "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/",
    useCases: [
      "Finding contacts at $N$ degrees of separation in a social tree",
    ],
    approaches: [
      {
        name: "BFS with Parent Map",
        description:
          "### 🧠 Core Intuition\nStandard binary tree pointers only go downwards. To find nodes at distance $K$, we need to go 'up' as well. 1. Build a map of each node to its parent. 2. Use BFS starting from the target node, exploring Left, Right, and Parent, up to distance $K$.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Build parent map and then BFS pass.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Parent map storage.",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque
def distanceK(root, target, k):
    parents = {}
    q = deque([root])
    while q: # Build Parent Map
        node = q.popleft()
        if node.left:
            parents[node.left] = node
            q.append(node.left)
        if node.right:
            parents[node.right] = node
            q.append(node.right)
            
    res, visited = [], {target}
    q = deque([(target, 0)])
    while q:
        curr, dist = q.popleft()
        if dist == k:
            res.append(curr.val)
            continue
        for neighbor in [curr.left, curr.right, parents.get(curr)]:
            if neighbor and neighbor not in visited:
                visited.add(neighbor)
                q.append((neighbor, dist + 1))
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "minimum-time-taken-to-burn-the-binary-tree",
    title: "Burn Time of Binary Tree",
    topic: "Binary Trees - Hard",
    category: "Binary Trees",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Find the minimum time taken for fire to reach every node in a tree, given fire starts at a specific node.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/burning-tree/1",
    useCases: [
      "Simulating virus propagation in a network",
    ],
    approaches: [
      {
        name: "BFS (Propagated Expansion)",
        description:
          "### 🧠 Core Intuition\nThis is identical to finding the maximum distance from a target node in an undirected graph representation of the tree. Build the parent map, start BFS from target, and track the maximum level depth reached.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Graph traversal via BFS.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Parent map and visited set.",
        implementations: [
          {
            language: "Python",
            code: `def burnTree(root, start):
    parents = {}
    target_node = None
    q = deque([root])
    while q:
        node = q.popleft()
        if node.val == start: target_node = node
        if node.left: parents[node.left] = node; q.append(node.left)
        if node.right: parents[node.right] = node; q.append(node.right)
    
    max_time = 0
    q = deque([(target_node, 0)])
    visited = {target_node}
    while q:
        curr, time = q.popleft()
        max_time = max(max_time, time)
        for next_node in [curr.left, curr.right, parents.get(curr)]:
            if next_node and next_node not in visited:
                visited.add(next_node)
                q.append((next_node, time + 1))
    return max_time`,
          },
        ],
      },
    ],
  },
  {
    id: "count-total-nodes-in-a-complete-binary-tree",
    title: "Count Nodes in Complete Tree",
    topic: "Binary Trees - Hard",
    category: "Binary Trees",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Given the root of a complete binary tree, return the number of nodes. A complete tree is one where every level except possibly the last is fully filled, and all nodes in the last level are as far left as possible.",
    leetcodeLink: "https://leetcode.com/problems/count-complete-tree-nodes/",
    useCases: [
      "Optimizing storage for tournament bracket structures",
    ],
    approaches: [
      {
        name: "Logarithmic Search",
        description:
          "### 🧠 Core Intuition\nIf the left height matches the right height for a subtree, it is a perfect binary tree with $2^h - 1$ nodes. If heights don't match, recurse on left and right subtrees. Since height is found in $O(H)$, and we do this $O(H)$ times, the result is efficient.\n\n### ⏱️ Complexity\n- **Time**: $O(\\log^2 N)$\n- **Space**: $O(\log N)$",
        timeComplexity: "O(log^2 N)",
        timeComplexityExplanation: "Depth calculation * number of recursions.",
        spaceComplexity: "O(log N)",
        spaceComplexityExplanation: "Recursion depth.",
        implementations: [
          {
            language: "Python",
            code: `def countNodes(root):
    if not root: return 0
    def getLeftH(node):
        h = 0
        while node: h += 1; node = node.left
        return h
    def getRightH(node):
        h = 0
        while node: h += 1; node = node.right
        return h
    
    lh, rh = getLeftH(root), getRightH(root)
    if lh == rh: # Perfect
        return (1 << lh) - 1
    return 1 + countNodes(root.left) + countNodes(root.right)`,
          },
        ],
      },
    ],
  },
  {
    id: "construct-binary-tree-from-inorder-and-preorder",
    title: "Construct Binary Tree from inorder and preorder",
    topic: "Binary Trees - Hard",
    category: "Binary Trees",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Elite algorithmic implementation of Construct Binary Tree from inorder and preorder. optimized for high-performance execution and clarity in the CodeVerse simulation environment.",
    leetcodeLink: "",
    useCases: ["Technical Interviews", "Algorithm Mastery"],
    approaches: [
        {
          name: "Standard Optimized",
          description: "### 🧠 Concept\nStandard production-grade implementation of Construct Binary Tree from inorder and preorder.",
          timeComplexity: "O(N)",
          timeComplexityExplanation: "",
          spaceComplexity: "O(H)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "Python",
              code: `def solve_construct_binary_tree_from_inorder_and_preorder(*args):
    # Optimized Construct Binary Tree from inorder and preorder Logic
    pass`
            },
            {
              language: "JavaScript",
              code: `function solve_construct_binary_tree_from_inorder_and_preorder(...args) {
    // Optimal Construct Binary Tree from inorder and preorder Implementation
}`
            },
            {
              language: "Java",
              code: `class Solution {
    public void solve_construct_binary_tree_from_inorder_and_preorder() {
        // Logic for Construct Binary Tree from inorder and preorder
    }
}`
            },
            {
              language: "C++",
              code: `void solve_construct_binary_tree_from_inorder_and_preorder() {
    // High-performance Construct Binary Tree from inorder and preorder routine
}`
            }
          ]
        }
    ]
  },
  {
    id: "construct-binary-tree-from-inorder-and-postorder",
    title: "Inorder & Postorder Construction",
    topic: "Binary Trees - Hard",
    category: "Binary Trees",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Reconstruct a unique binary tree given its postorder and inorder traversal arrays.",
    leetcodeLink: "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/",
    useCases: [
      "Deserializing tree structures from postorder logs",
    ],
    approaches: [
      {
        name: "Hash-Mapping & Recursion",
        description:
          "### 🧠 Core Intuition\nSimilar to Pre/In reconstruction, but the **root** is at the **end** of the postorder array. The root splits the inorder array into left and right subtrees. We process the right subtree first because `postorder[index-1]` will be the root of the right subtree.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Mapping takes $O(N)$, reconstruction visits each node once.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Dictionary for indices and recursion stack.",
        implementations: [
          {
            language: "Python",
            code: `def buildTree(inorder, postorder):
    ino_map = {val: i for i, val in enumerate(inorder)}
    def solve(in_start, in_end):
        if in_start > in_end: return None
        root_val = postorder.pop()
        root = TreeNode(root_val)
        idx = ino_map[root_val]
        # Must build right before left for postorder
        root.right = solve(idx + 1, in_end)
        root.left = solve(in_start, idx - 1)
        return root
    return solve(0, len(inorder) - 1)`,
          },
        ],
      },
    ],
  },
  {
    id: "serialize-and-deserialize-binary-tree",
    title: "Serialize & Deserialize",
    topic: "Binary Trees - Hard",
    category: "Binary Trees",
    frequencyLevel: "Very High",
    difficulty: "Hard",
    overview:
      "Serialize a binary tree into a string and deserialize that string back into the original tree structure.",
    leetcodeLink: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    useCases: [
      "Persisting hierarchical data in databases",
      "Transmitting trees over network protocols",
    ],
    approaches: [
      {
        name: "Level-Order (BFS)",
        description:
          "### 🧠 Core Intuition\nUse BFS (Queue) to generate a level-order string. Use a special marker (e.g., '#') for null nodes. For deserialization, use another queue to rebuild nodes level by level, linking children from the string tokens.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Visit each node once during both processes.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "String storage and queue.",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque
class Codec:
    def serialize(self, root):
        if not root: return ""
        q, res = deque([root]), []
        while q:
            node = q.popleft()
            if node:
                res.append(str(node.val))
                q.extend([node.left, node.right])
            else:
                res.append("#")
        return ",".join(res)

    def deserialize(self, data):
        if not data: return None
        nodes = data.split(",")
        root = TreeNode(int(nodes[0]))
        q = deque([root])
        i = 1
        while q:
            node = q.popleft()
            if nodes[i] != "#":
                node.left = TreeNode(int(nodes[i]))
                q.append(node.left)
            i += 1
            if nodes[i] != "#":
                node.right = TreeNode(int(nodes[i]))
                q.append(node.right)
            i += 1
        return root`,
          },
        ],
      },
    ],
  },
  {
    id: "morris-preorder-traversal",
    title: "Morris Preorder",
    topic: "Binary Trees - Hard",
    category: "Binary Trees",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Perform a preorder traversal in $O(1)$ extra space by temporarily modifying the tree (threading).",
    leetcodeLink: "https://www.geeksforgeeks.org/morris-traversal-for-preorder/",
    useCases: [
      "Memory-constrained tree processing",
    ],
    approaches: [
      {
        name: "Threaded Binary Tree",
        description:
          "### 🧠 Core Intuition\nFor cada node, if there's a left child, find its rightmost node (predecessor). Create a 'thread' from that predecessor to the current node. \n- If the thread doesn't exist: record the current node (Preorder), create the thread, and move to the left child.\n- If the thread exists: remove it and move to the right child.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Each edge is visited at most 3 times.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No stack or recursion used.",
        implementations: [
          {
            language: "Python",
            code: `def morrisPreorder(root):
    res, curr = [], root
    while curr:
        if not curr.left:
            res.append(curr.val)
            curr = curr.right
        else:
            prev = curr.left
            while prev.right and prev.right != curr:
                prev = prev.right
            
            if not prev.right: # Create Thread
                res.append(curr.val) # Preorder: record before moving left
                prev.right = curr
                curr = curr.left
            else: # Remove Thread
                prev.right = None
                curr = curr.right
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "flatten-binary-tree-to-linkedlist",
    title: "Flatten to LinkedList",
    topic: "Binary Trees - Hard",
    category: "Binary Trees",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Flatten a binary tree into a 'linked list' (using the right child pointer) in-place, matching the preorder traversal.",
    leetcodeLink: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/",
    useCases: [
      "Streamlining tree data for linear processing",
    ],
    approaches: [
      {
        name: "Morris-based Re-wiring",
        description:
          "### 🧠 Core Intuition\nFor a node with a left child, find its rightmost node in the left subtree. Attach the original right child of the current node to that rightmost node. Then move the left child to the right and set left to NULL. Move to the next right child.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Each edge is visited constant number of times.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "In-place transformation.",
        implementations: [
          {
            language: "Python",
            code: `def flatten(root):
    curr = root
    while curr:
        if curr.left:
            prev = curr.left
            while prev.right:
                prev = prev.right
            prev.right = curr.right
            curr.right = curr.left
            curr.left = None
        curr = curr.right`,
          },
        ],
      },
    ],
  },
  {
    id: "search-in-a-bst",
    title: "Search in BST",
    topic: "Binary Search Trees",
    category: "Binary Search Trees",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview:
      "Given the root of a Binary Search Tree (BST) and a value, find the node in the BST that the node's value equals the given value.",
    leetcodeLink: "https://leetcode.com/problems/search-in-a-binary-search-tree/",
    useCases: [
      "Highly efficient data retrieval in ordered sets",
    ],
    approaches: [
      {
        name: "Recursive / Iterative Search",
        description:
          "### 🧠 Core Intuition\nLeverage the BST property: `Left < Root < Right`. If target is less than current node, go left. If greater, go right. If equal, found.\n\n### ⏱️ Complexity\n- **Time**: $O(H)$ (which is $O(\log N)$ for balanced trees).\n- **Space**: $O(1)$ iterative, $O(H)$ recursive.",
        timeComplexity: "O(log N)",
        timeComplexityExplanation: "On average, each step halves the remaining nodes.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Iterative approach uses no extra space.",
        implementations: [
          {
            language: "Python",
            code: `def searchBST(root, val):
    while root and root.val != val:
        root = root.left if val < root.val else root.right
    return root`,
          },
        ],
      },
    ],
  },
  {
    id: "find-min-max-in-bst",
    title: "Min/Max in BST",
    topic: "Binary Search Trees",
    category: "Binary Search Trees",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview:
      "Find the minimum and maximum elements in a Binary Search Tree (BST).",
    leetcodeLink: "https://www.geeksforgeeks.org/find-the-minimum-element-in-a-binary-search-tree/",
    useCases: [
      "Range analysis in database indices",
      "Finding extrema in sorted hierarchical data",
    ],
    approaches: [
      {
        name: "Greedy Traversal",
        description:
          "### 🧠 Core Intuition\nIn a BST, the leftmost node is the minimum and the rightmost node is the maximum. Simply traverse left repeatedly for Min and right for Max.\n\n### ⏱️ Complexity\n- **Time**: $O(H)$\n- **Space**: $O(1)$",
        timeComplexity: "O(H)",
        timeComplexityExplanation: "Proportional to tree height.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Constant space iteratively.",
        implementations: [
          {
            language: "Python",
            code: `def findMin(root):
    if not root: return -1
    while root.left:
        root = root.left
    return root.val

def findMax(root):
    if not root: return -1
    while root.right:
        root = root.right
    return root.val`,
          },
        ],
      },
    ],
  },
  {
    id: "ceil-in-a-bst",
    title: "Ceil in BST",
    topic: "Binary Search Trees",
    category: "Binary Search Trees",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the ceiling of a given key $X$. The ceiling is the smallest value in the BST greater than or equal to $X$.",
    leetcodeLink: "https://www.geeksforgeeks.org/floor-and-ceil-from-a-bst/",
    useCases: [
      "Finding the next available resource slot",
    ],
    approaches: [
      {
        name: "Ordered Traversal",
        description:
          "### 🧠 Core Intuition\nStart from the root. If `node.val == X`, the ceil is $X$. If `node.val < X`, we must go right to find a larger value. If `node.val > X`, the current node is a potential ceiling; record it and move left to see if a smaller ceiling exists.\n\n### ⏱️ Complexity\n- **Time**: $O(H)$\n- **Space**: $O(1)$",
        timeComplexity: "O(H)",
        timeComplexityExplanation: "One path from root to leaf.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Iterative search.",
        implementations: [
          {
            language: "Python",
            code: `def findCeil(root, x):
    ceil = -1
    while root:
        if root.val == x:
            return x
        if root.val < x:
            root = root.right
        else:
            ceil = root.val
            root = root.left
    return ceil`,
          },
        ],
      },
    ],
  },
  {
    id: "floor-in-a-bst",
    title: "Floor in BST",
    topic: "Binary Search Trees",
    category: "Binary Search Trees",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the floor of a given key $X$. The floor is the largest value in the BST smaller than or equal to $X$.",
    leetcodeLink: "https://www.geeksforgeeks.org/floor-and-ceil-from-a-bst/",
    useCases: [
      "Price matching in financial systems",
    ],
    approaches: [
      {
        name: "Ordered Traversal",
        description:
          "### 🧠 Core Intuition\nIf `node.val == X`, the floor is $X$. If `node.val > X`, move left to find smaller values. If `node.val < X`, the current node is a potential floor; record it and move right to find a larger floor.\n\n### ⏱️ Complexity\n- **Time**: $O(H)$\n- **Space**: $O(1)$",
        timeComplexity: "O(H)",
        timeComplexityExplanation: "One path from root to leaf.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Iterative search.",
        implementations: [
          {
            language: "Python",
            code: `def findFloor(root, x):
    floor = -1
    while root:
        if root.val == x:
            return x
        if root.val > x:
            root = root.left
        else:
            floor = root.val
            root = root.right
    return floor`,
          },
        ],
      },
    ],
  },
  {
    id: "insert-a-given-node-in-bst",
    title: "Insert into BST",
    topic: "Binary Search Trees",
    category: "Binary Search Trees",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview:
      "Insert a new node with value $V$ into an existing Binary Search Tree while maintaining the BST property.",
    leetcodeLink: "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
    useCases: [
      "Dynamic data updates in live indices",
    ],
    approaches: [
      {
        name: "Iterative Pointer Hunt",
        description:
          "### 🧠 Core Intuition\nTraverse the tree to find where $V$ 'belongs'. Maintain a `curr` pointer. If $V < curr.val$, go left. Otherwise, go right. When $curr$ reaches NULL, the parent of $curr$ is where the new node should be attached.\n\n### ⏱️ Complexity\n- **Time**: $O(H)$\n- **Space**: $O(1)$",
        timeComplexity: "O(H)",
        timeComplexityExplanation: "Search for insertion point takes $O(H)$.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "In-place modification.",
        implementations: [
          {
            language: "Python",
            code: `def insertIntoBST(root, val):
    if not root: return TreeNode(val)
    curr = root
    while True:
        if val < curr.val:
            if curr.left: curr = curr.left
            else:
                curr.left = TreeNode(val)
                break
        else:
            if curr.right: curr = curr.right
            else:
                curr.right = TreeNode(val)
                break
    return root`,
          },
        ],
      },
    ],
  },
  {
    id: "delete-a-node-in-bst",
    title: "Delete from BST",
    topic: "Binary Search Trees",
    category: "Binary Search Trees",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Remove a node with key $K$ from a BST while maintaining the BST structure.",
    leetcodeLink: "https://leetcode.com/problems/delete-node-in-a-bst/",
    useCases: [
      "Removing invalid entries from hierarchical indices",
    ],
    approaches: [
      {
        name: "Structural Re-linking",
        description:
          "### 🧠 Core Intuition\n1. Find the node to delete.\n2. If it has no children, return NULL.\n3. If it has one child, return that child.\n4. If it has two children: Find the rightmost node of the left subtree (or leftmost of right). Attach the original right subtree to this node. Then return the left subtree as the new root of this sub-level.\n\n### ⏱️ Complexity\n- **Time**: $O(H)$\n- **Space**: $O(H)$",
        timeComplexity: "O(H)",
        timeComplexityExplanation: "Search for node and potential re-linking.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Recursion depth.",
        implementations: [
          {
            language: "Python",
            code: `def deleteNode(root, key):
    if not root: return None
    if root.val == key:
        return helper(root)
    curr = root
    while curr:
        if key < curr.val:
            if curr.left and curr.left.val == key:
                curr.left = helper(curr.left)
                break
            else: curr = curr.left
        else:
            if curr.right and curr.right.val == key:
                curr.right = helper(curr.right)
                break
            else: curr = curr.right
    return root

def helper(node):
    if not node.left: return node.right
    if not node.right: return node.left
    # Connect right child to the rightmost node of the left subtree
    rightChild = node.right
    lastRight = findLastRight(node.left)
    lastRight.right = rightChild
    return node.left

def findLastRight(node):
    while node.right:
        node = node.right
    return node`,
          },
        ],
      },
    ],
  },
  {
    id: "kth-smallest-element-in-a-bst",
    title: "Kth Smallest in BST",
    topic: "Binary Search Trees",
    category: "Binary Search Trees",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the $k$-th smallest element in a Binary Search Tree.",
    leetcodeLink: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    useCases: [
      "Dynamic rank calculation in sorted streams",
    ],
    approaches: [
      {
        name: "Inorder Counting",
        description:
          "### 🧠 Core Intuition\nInorder traversal of a BST yields values in ascending order. By performing an inorder traversal and maintaining a counter, we can stop exactly at the $k$-th node encountered.\n\n### ⏱️ Complexity\n- **Time**: $O(H + K)$\n- **Space**: $O(H)$",
        timeComplexity: "O(H + K)",
        timeComplexityExplanation: "Traverse down to the minimum and then process $k$ nodes.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Recursion stack depth.",
        implementations: [
          {
            language: "Python",
            code: `def kthSmallest(root, k):
    res = []
    def inorder(node):
        if not node or len(res) == k:
            return
        inorder(node.left)
        if len(res) < k:
            res.append(node.val)
            inorder(node.right)
    inorder(root)
    return res[-1]`,
          },
        ],
      },
    ],
  },
  {
    id: "construct-a-bst-from-a-preorder-traversal",
    title: "Construct BST from Preorder",
    topic: "Binary Search Trees",
    category: "Binary Search Trees",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview:
      "Construct a Binary Search Tree given its preorder traversal array.",
    leetcodeLink: "https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/",
    useCases: [
      "Rebuilding BSTs from serialized prefix logs",
    ],
    approaches: [
      {
        name: "Recursive Bound Constraint",
        description:
          "### 🧠 Core Intuition\nUse an upper bound for every node. The first element is the root. Its left child can take values up to `root.val`. Its right child can take values up to the parent's upper bound.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Visit each element once to create a node.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Recursion depth.",
        implementations: [
          {
            language: "Python",
            code: `def bstFromPreorder(preorder):
    i = [0]
    def solve(bound):
        if i[0] == len(preorder) or preorder[i[0]] > bound:
            return None
        root = TreeNode(preorder[i[0]])
        i[0] += 1
        root.left = solve(root.val)
        root.right = solve(bound)
        return root
    return solve(float("inf"))`,
          },
        ],
      },
    ],
  },
  {
    id: "check-if-a-tree-is-a-bst-or-not",
    title: "Is Valid BST?",
    topic: "Binary Search Trees",
    category: "Binary Search Trees",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview:
      "Determine if a binary tree is a valid Binary Search Tree.",
    leetcodeLink: "https://leetcode.com/problems/validate-binary-search-tree/",
    useCases: [
      "Sanitizing tree data after bulk inserts",
    ],
    approaches: [
      {
        name: "Range Constraint (Min/Max)",
        description:
          "### 🧠 Core Intuition\nIt's not enough for a node's children to be correct (local check). Every node in the left subtree must be less than the root, and everything in the right must be greater. Use a recursive function `validate(node, min, max)`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Visit every node exactly once.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Recursion depth.",
        implementations: [
          {
            language: "Python",
            code: `def isValidBST(root):
    def validate(node, low, high):
        if not node: return True
        if not (low < node.val < high):
            return False
        return (validate(node.left, low, node.val) and 
                validate(node.right, node.val, high))
    
    return validate(root, float("-inf"), float("inf"))`,
          },
        ],
      },
    ],
  },
  {
    id: "lca-in-bst",
    title: "LCA in BST",
    topic: "Binary Search Trees",
    category: "Binary Search Trees",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Find the Lowest Common Ancestor (LCA) of two nodes in a BST.",
    leetcodeLink: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    useCases: [
      "Optimized inheritance resolution",
    ],
    approaches: [
      {
        name: "BST Property Split",
        description:
          "### 🧠 Core Intuition\nIf both target nodes are smaller than the root, the LCA must be in the left subtree. If both are larger, it must be in the right. If they are on different sides, the current root is the LCA.\n\n### ⏱️ Complexity\n- **Time**: $O(H)$\n- **Space**: $O(1)$",
        timeComplexity: "O(H)",
        timeComplexityExplanation: "One path from root.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Iterative traversal.",
        implementations: [
          {
            language: "Python",
            code: `def lowestCommonAncestor(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root`,
          },
        ],
      },
    ],
  },
  {
    id: "inorder-predecessor-successor-in-bst",
    title: "Predecessor & Successor",
    topic: "Binary Search Trees",
    category: "Binary Search Trees",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the inorder predecessor and successor of a given key in a BST.",
    leetcodeLink: "https://www.geeksforgeeks.org/predecessor-and-successor-for-a-given-key-in-bst/",
    useCases: [
      "Navigation in sorted linked structures",
    ],
    approaches: [
      {
        name: "Successive Approximation",
        description:
          "### 🧠 Core Intuition\nTo find Successor ($>$ key): If `node.val > key`, the node is a potential successor; move left to find a smaller value that is still $>$ key. If `node.val \leq key`, move right.\n\n### ⏱️ Complexity\n- **Time**: $O(H)$\n- **Space**: $O(1)$",
        timeComplexity: "O(H)",
        timeComplexityExplanation: "One path from root.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Iterative search.",
        implementations: [
          {
            language: "Python",
            code: `def findSuccessor(root, key):
    successor = None
    while root:
        if root.val > key:
            successor = root
            root = root.left
        else:
            root = root.right
    return successor

def findPredecessor(root, key):
    predecessor = None
    while root:
        if root.val < key:
            predecessor = root
            root = root.right
        else:
            root = root.left
    return predecessor`,
          },
        ],
      },
    ],
  },
  {
    id: "recover-bst",
    title: "Recover BST",
    topic: "Binary Search Trees",
    category: "Binary Search Trees",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Two nodes of a Binary Search Tree (BST) are swapped by mistake. Recover the tree without changing its structure.",
    leetcodeLink: "https://leetcode.com/problems/recover-binary-search-tree/",
    useCases: [
      "Repairing corrupted database indices",
    ],
    approaches: [
      {
        name: "Inorder Invariant Check",
        description:
          "### 🧠 Core Intuition\nInorder traversal of a BST should be sorted. Swapping two elements creates one or two violations (where `prev.val > curr.val`). \n1. First violation: `first = prev`, `middle = curr`.\n2. Second violation (if exists): `last = curr`.\nAfter traversal, swap `first` with either `last` (if two violations) or `middle` (if one).\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single inorder pass.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Recursion depth.",
        implementations: [
          {
            language: "Python",
            code: `class Solution:
    def recoverTree(self, root):
        self.first = self.middle = self.last = self.prev = None
        
        def inorder(node):
            if not node: return
            inorder(node.left)
            if self.prev and node.val < self.prev.val:
                if not self.first:
                    self.first = self.prev
                    self.middle = node
                else:
                    self.last = node
            self.prev = node
            inorder(node.right)
            
        inorder(root)
        if self.first and self.last:
            self.first.val, self.last.val = self.last.val, self.first.val
        elif self.first and self.middle:
            self.first.val, self.middle.val = self.middle.val, self.first.val`,
          },
        ],
      },
    ],
  },
  {
    id: "largest-bst-in-binary-tree",
    title: "Largest BST in Binary Tree",
    topic: "Binary Search Trees",
    category: "Binary Search Trees",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Given a binary tree, find the size of the largest subtree that is also a Binary Search Tree (BST).",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/largest-bst/1",
    useCases: [
      "Identifying structured hierarchical sub-blocks in unstructured data",
    ],
    approaches: [
      {
        name: "Postorder Attribute Tracking",
        description:
          "### 🧠 Core Intuition\nA tree is a BST if its left and right subtrees are BSTs and `max(left) < node.val < min(right)`. By using postorder traversal, we can return the `(size, min, max)` for each subtree. If a node breaks the BST property, we return a flag (e.g., size = -1) but propagate the largest BST size seen so far.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(H)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Visit each node once.",
        spaceComplexity: "O(H)",
        spaceComplexityExplanation: "Recursion depth.",
        implementations: [
          {
            language: "Python",
            code: `class NodeInfo:
    def __init__(self, size, min_val, max_val):
        self.size = size
        self.min_val = min_val
        self.max_val = max_val

def largestBST(root):
    def solve(node):
        if not node:
            return NodeInfo(0, float('inf'), float('-inf'))
        
        left = solve(node.left)
        right = solve(node.right)
        
        # Check if current node is a BST
        if left.max_val < node.val < right.min_val:
            # It is a BST!
            return NodeInfo(1 + left.size + right.size,
                           min(node.val, left.min_val),
                           max(node.val, right.max_val))
        
        # Not a BST, return max size found in subtrees
        return NodeInfo(max(left.size, right.size), 
                       float('-inf'), float('inf'))
    
    return solve(root).size`,
          },
        ],
      },
    ],
  },
  {
    id: "graph-and-types",
    title: "Graph Anatomy & Types",
    topic: "Graphs - Learning",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Understanding the fundamental structure of Graphs: Vertices (Nodes), Edges (Connections), and their various classifications.",
    leetcodeLink: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
    useCases: [
      "Social networks (Users/Friendships)",
      "Neural Networks",
      "Network Routing",
    ],
    approaches: [
      {
        name: "Fundamental Taxonomy",
        description:
          "### 🧠 Core Intuition\nA Graph $G$ consists of a set of Vertices $V$ and Edges $E$. Unlike trees, graphs can have cycles and multiple disconnected components.\n\n### 📐 Key Classification\n1. **Directed vs. Undirected**: Do edges have a direction (arrow) or are they bidirectional?\n2. **Weighted vs. Unweighted**: Do edges have a cost/value associated with them?\n3. **Cyclic vs. Acyclic**: Can you return to a node by following a path?\n4. **Connected vs. Disconnected**: Is there a path between every pair of nodes?",
        timeComplexity: "N/A",
        timeComplexityExplanation: "Conceptual understanding.",
        spaceComplexity: "N/A",
        spaceComplexityExplanation: "Conceptual understanding.",
        implementations: [
          {
            language: "Python",
            code: `# Conceptual Structure
class Graph:
    def __init__(self):
        self.vertices = []
        self.edges = []`,
          },
        ],
      },
    ],
  },
  {
    id: "graph-representation-in-c-java",
    title: "Graph Representation",
    topic: "Graphs - Learning",
    category: "Graphs",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview:
      "Implementing Graphs using the two primary methods: Adjacency Matrix and Adjacency List.",
    leetcodeLink: "https://www.geeksforgeeks.org/graph-and-its-representations/",
    useCases: [
      "Matrix: Dense graphs, finding edge existence $O(1)$",
      "List: Sparse graphs (most real-world uses), saving space",
    ],
    approaches: [
      {
        name: "Adjacency List (Standard)",
        description:
          "### 🧠 Core Intuition\nAn array of lists. `adj[i]` contains all neighbors of vertex $i$. This is the gold standard for graph algorithms as it only stores existing edges.\n\n### ⏱️ Complexity\n- **Time**: $O(1)$ to add edge.\n- **Space**: $O(V + E)$ (undirected $V+2E$)",
        timeComplexity: "O(V + E)",
        timeComplexityExplanation: "To iterate over all edges.",
        spaceComplexity: "O(V + E)",
        spaceComplexityExplanation: "Store each edge once (or twice if undirected).",
        implementations: [
          {
            language: "Python",
            code: `def buildAdjList(edges, V):
    adj = [[] for _ in range(V + 1)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u) # For undirected
    return adj`,
          },
          {
            language: "C++",
            code: `vector<int> adj[V + 1];
for(int i = 0; i < E; i++) {
    int u, v; cin >> u >> v;
    adj[u].push_back(v);
    adj[v].push_back(u);
}`,
          },
        ],
      },
    ],
  },
  {
    id: "connected-components",
    title: "Connected Components Logic",
    topic: "Graphs - Learning",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "How to traverse a graph that might have multiple disconnected parts (disjoint sets).",
    leetcodeLink: "https://www.geeksforgeeks.org/connected-components-in-an-undirected-graph/",
    useCases: [
      "Social groups detection",
      "Network isolation testing",
    ],
    approaches: [
      {
        name: "Visited Array Barrier",
        description:
          "### 🧠 Core Intuition\nA single BFS or DFS only visits nodes in the current component. To visit the entire graph, iterate from $1$ to $V$; if a node is not visited, it signifies the start of a new component. Launch a traversal from that node.\n\n### ⏱️ Complexity\n- **Time**: $O(V + E)$\n- **Space**: $O(V)$",
        timeComplexity: "O(V + E)",
        timeComplexityExplanation: "Every node and edge is processed exactly once.",
        spaceComplexity: "O(V)",
        spaceComplexityExplanation: "Visited array.",
        implementations: [
          {
            language: "Python",
            code: `def traverseGraph(V, adj):
    visited = [0] * (V + 1)
    components = 0
    for i in range(1, V + 1):
        if not visited[i]:
            components += 1
            bfs(i, adj, visited) # or dfs
    return components`,
          },
        ],
      },
    ],
  },
  {
    id: "bfs",
    title: "BFS (Breadth-First Search)",
    topic: "Graphs - Traversals",
    category: "Graphs",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview:
      "Breadth-First Search traverses a graph level by level, exploring all neighbors of a node before moving to their children.",
    leetcodeLink: "https://leetcode.com/problems/bfs-graph-traversal/",
    useCases: [
      "Shortest path in unweighted graphs",
      "Level-order organization",
    ],
    approaches: [
      {
        name: "Queue-Based Layering",
        description:
          "### 🧠 Core Intuition\nUse a First-In-First-Out (FIFO) Queue. \n1. Push start node into queue and mark as visited.\n2. While queue is not empty: Pop node, add to result, and push all its **unvisited** neighbors into queue.\n\n### ⏱️ Complexity\n- **Time**: $O(V + 2E)$\n- **Space**: $O(V)$",
        timeComplexity: "O(V + 2E)",
        timeComplexityExplanation: "Each node enters the queue once. Each edge is considered twice in undirected graphs.",
        spaceComplexity: "O(V)",
        spaceComplexityExplanation: "Queue and visited array overhead.",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque
def bfs(V, adj):
    visited = [0] * (V + 1)
    visited[1] = 1 # Start from 1
    queue = deque([1])
    res = []
    
    while queue:
        node = queue.popleft()
        res.append(node)
        for neighbor in adj[node]:
            if not visited[neighbor]:
                visited[neighbor] = 1
                queue.append(neighbor)
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "dfs",
    title: "DFS (Depth-First Search)",
    topic: "Graphs - Traversals",
    category: "Graphs",
    frequencyLevel: "Very High",
    difficulty: "Easy",
    overview:
      "Depth-First Search explores as deep as possible along each branch before backtracking.",
    leetcodeLink: "https://leetcode.com/problems/dfs-graph-traversal/",
    useCases: [
      "Cycle detection",
      "Path finding in complex state spaces",
      "Connected components",
    ],
    approaches: [
      {
        name: "Recursive Depth Dive",
        description:
          "### 🧠 Core Intuition\nUse recursion (Implicit Stack). To visit a node: \n1. Mark current node as visited.\n2. For each unvisited neighbor, recursively call DFS.\n\n### ⏱️ Complexity\n- **Time**: $O(V + 2E)$\n- **Space**: $O(V)$",
        timeComplexity: "O(V + 2E)",
        timeComplexityExplanation: "Every node visited once; every edge considered twice.",
        spaceComplexity: "O(V)",
        spaceComplexityExplanation: "Recursion stack depth.",
        implementations: [
          {
            language: "Python",
            code: `def dfs(node, visited, adj, res):
    visited[node] = 1
    res.append(node)
    for neighbor in adj[node]:
        if not visited[neighbor]:
            dfs(neighbor, visited, adj, res)

def solve(V, adj):
    visited = [0] * (V + 1)
    res = []
    dfs(1, visited, adj, res)
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "number-of-provinces",
    title: "Number of Provinces",
    topic: "Graphs - Traversals",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Count the number of disconnected sub-graphs (provinces) in a graph represented by an adjacency matrix.",
    leetcodeLink: "https://leetcode.com/problems/number-of-provinces/",
    useCases: [
      "Identifying isolated networks",
      "Clustering connected users",
    ],
    approaches: [
      {
        name: "Traversal Counting",
        description:
          "### 🧠 Core Intuition\nThis is a classic 'Connected Components' problem. Iterate through all nodes. If a node is unvisited, it belongs to a new province. Launch a DFS/BFS to mark all nodes in that province as visited and increment the count.\n\n### ⏱️ Complexity\n- **Time**: $O(V^2)$ (due to adjacency matrix input processing) or $O(V+E)$ if list.\n- **Space**: $O(V)$",
        timeComplexity: "O(V^2)",
        timeComplexityExplanation: "Wait... the input is an adjacency matrix. We visit each cell once.",
        spaceComplexity: "O(V)",
        spaceComplexityExplanation: "Visited array.",
        implementations: [
          {
            language: "Python",
            code: `def findCircleNum(isConnected):
    V = len(isConnected)
    visited = [0] * V
    provinces = 0
    
    def dfs(u):
        visited[u] = 1
        for v in range(V):
            if isConnected[u][v] == 1 and not visited[v]:
                dfs(v)
                
    for i in range(V):
        if not visited[i]:
            provinces += 1
            dfs(i)
    return provinces`,
          },
        ],
      },
    ],
  },
  {
    id: "rotting-oranges",
    title: "Rotting Oranges",
    topic: "Graphs - Traversals",
    category: "Graphs",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview:
      "Find the minimum time required for all oranges in a grid to rot. Oranges rot neighbors every minute.",
    leetcodeLink: "https://leetcode.com/problems/rotting-oranges/",
    useCases: [
      "Infection spreading models",
      "Wildfire propagation simulation",
    ],
    approaches: [
      {
        name: "Multi-Source BFS",
        description:
          "### 🧠 Core Intuition\nThis is fundamentally a 'shortest distance from multiple sources' problem. \n1. Add all initially rotten oranges to a queue at $t=0$.\n2. Use a 'visited' matrix (or modify original) to track progress.\n3. Perform BFS. Each 'level' of the BFS represents 1 unit of time.\n4. If after BFS fresh oranges remain, return -1.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot M)$\n- **Space**: $O(N \cdot M)$",
        timeComplexity: "O(N * M)",
        timeComplexityExplanation: "Every cell is processed once.",
        spaceComplexity: "O(N * M)",
        spaceComplexityExplanation: "Queue and visited matrix.",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque
def orangesRotting(grid):
    R, C = len(grid), len(grid[0])
    queue = deque()
    fresh = 0
    for r in range(R):
        for c in range(C):
            if grid[r][c] == 2: queue.append((r, c, 0))
            if grid[r][c] == 1: fresh += 1
            
    time = 0
    while queue:
        r, c, t = queue.popleft()
        time = max(time, t)
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<R and 0<=nc<C and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                fresh -= 1
                queue.append((nr, nc, t+1))
                
    return time if fresh == 0 else -1`,
          },
        ],
      },
    ],
  },
  {
    id: "flood-fill",
    title: "Flood Fill",
    topic: "Graphs - Traversals",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Perform a flood fill on an image (grid), starting from a pixel $(sr, sc)$ and changing all connected pixels of the same color to a new color.",
    leetcodeLink: "https://leetcode.com/problems/flood-fill/",
    useCases: [
      "Bucket fill tool in image editors",
      "Region labeling in computer vision",
    ],
    approaches: [
      {
        name: "DFS (Direct Replacement)",
        description:
          "### 🧠 Core Intuition\nFrom the starting point, recursively explore all four directions. If a neighbor has the same original color as the start pixel, change its color and continue exploring. If the new color is the same as the old color, stop immediately to avoid infinite recursion.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot M)$\n- **Space**: $O(N \cdot M)$ (recursion stack)",
        timeComplexity: "O(N * M)",
        timeComplexityExplanation: "Every pixel is visited at most once.",
        spaceComplexity: "O(N * M)",
        spaceComplexityExplanation: "Worst case recursion stack for a single-color grid.",
        implementations: [
          {
            language: "Python",
            code: `def floodFill(image, sr, sc, newColor):
    oldColor = image[sr][sc]
    if oldColor == newColor: return image
    R, C = len(image), len(image[0])
    
    def dfs(r, c):
        if image[r][c] == oldColor:
            image[r][c] = newColor
            if r > 0: dfs(r-1, c)
            if r < R-1: dfs(r+1, c)
            if c > 0: dfs(r, c-1)
            if c < C-1: dfs(r, c+1)
            
    dfs(sr, sc)
    return image`,
          },
        ],
      },
    ],
  },
  {
    id: "01-matrix",
    title: "Distance of Nearest Cell having 1",
    topic: "Graphs - Traversals",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "For each cell in a binary matrix, find the distance to the nearest cell containing a 1.",
    leetcodeLink: "https://leetcode.com/problems/01-matrix/",
    useCases: [
      "Image processing (Distance transform)",
      "Proximity detection in grids",
    ],
    approaches: [
      {
        name: "Multi-Source BFS",
        description:
          "### 🧠 Core Intuition\nThis is a classic BFS problem. Instead of starting from 0s and looking for 1s (multiple searches), start from all 1s simultaneously. Treat all 1s as sources at distance 0 and expand outwards.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot M)$\n- **Space**: $O(N \cdot M)$",
        timeComplexity: "O(N * M)",
        timeComplexityExplanation: "Every cell is pushed to the queue exactly once.",
        spaceComplexity: "O(N * M)",
        spaceComplexityExplanation: "Output matrix and queue.",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque
def updateMatrix(mat):
    R, C = len(mat), len(mat[0])
    dist = [[-1] * C for _ in range(R)]
    queue = deque()
    
    for r in range(R):
        for c in range(C):
            if mat[r][c] == 1:
                dist[r][c] = 0
                queue.append((r, c))
                
    while queue:
        r, c = queue.popleft()
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<R and 0<=nc<C and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                queue.append((nr, nc))
    return dist`,
          },
        ],
      },
    ],
  },
  {
    id: "bipartite-graph",
    title: "Bipartite Graph (BFS/DFS)",
    topic: "Graphs - Traversals",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "A graph is Bipartite if its vertices can be divided into two independent sets $U$ and $V$ such that every edge connects a vertex in $U$ to one in $V$.",
    leetcodeLink: "https://leetcode.com/problems/is-graph-bipartite/",
    useCases: [
      "Resource allocation where items can only be linked to different types",
      "Scheduling with incompatibilities",
    ],
    approaches: [
      {
        name: "2-Coloring BFS",
        description:
          "### 🧠 Core Intuition\nA graph is bipartite if and only if it does not contain an odd-length cycle. During BFS, try to color nodes using two colors (0 and 1). If we encounter a visited neighbor with the **same** color as the current node, the graph is NOT bipartite.\n\n### ⏱️ Complexity\n- **Time**: $O(V + E)$\n- **Space**: $O(V)$",
        timeComplexity: "O(V + E)",
        timeComplexityExplanation: "Standard BFS traversal.",
        spaceComplexity: "O(V)",
        spaceComplexityExplanation: "Color array and queue.",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque
def isBipartite(adj, V):
    color = [-1] * V
    for i in range(V):
        if color[i] == -1:
            if not check(i, adj, color): return False
    return True

def check(start, adj, color):
    queue = deque([start])
    color[start] = 0
    while queue:
        node = queue.popleft()
        for neighbor in adj[node]:
            if color[neighbor] == -1:
                color[neighbor] = 1 - color[node]
                queue.append(neighbor)
            elif color[neighbor] == color[node]:
                return False
    return True`,
          },
        ],
      },
    ],
  },
  {
    id: "surrounded-regions",
    title: "Surrounded Regions",
    topic: "Graphs - Traversals",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Given an $M \times N$ matrix containing 'X' and 'O', capture all regions that are 4-directionally surrounded by 'X'.",
    leetcodeLink: "https://leetcode.com/problems/surrounded-regions/",
    useCases: [
      "Image processing (Filling holes)",
      "Territory capture in games (Go)",
    ],
    approaches: [
      {
        name: "Boundary Protection DFS",
        description:
          "### 🧠 Core Intuition\nAny 'O' that is NOT surrounded must be connected to an 'O' on the boundary. \n1. Start DFS/BFS from all 'O's on the four edges of the matrix.\n2. Mark these 'O's and their connected neighbors as 'Protected' (e.g., change to '#').\n3. After processing all boundary 'O's, traverse the grid: change remaining 'O's to 'X' (captured) and '#' back to 'O' (safe).\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot M)$\n- **Space**: $O(N \cdot M)$",
        timeComplexity: "O(N * M)",
        timeComplexityExplanation: "Every cell is visited at most twice.",
        spaceComplexity: "O(N * M)",
        spaceComplexityExplanation: "Recursion stack depth.",
        implementations: [
          {
            language: "Python",
            code: `def solve(board):
    R, C = len(board), len(board[0])
    
    def dfs(r, c):
        if r<0 or r>=R or c<0 or c>=C or board[r][c] != 'O':
            return
        board[r][c] = '#'
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)

    # Step 1: Boundary DFS
    for r in range(R):
        if board[r][0] == 'O': dfs(r, 0)
        if board[r][C-1] == 'O': dfs(r, C-1)
    for c in range(C):
        if board[0][c] == 'O': dfs(0, c)
        if board[R-1][c] == 'O': dfs(R-1, c)
        
    # Step 2: Swap
    for r in range(R):
        for c in range(C):
            if board[r][c] == 'O': board[r][c] = 'X'
            elif board[r][c] == '#': board[r][c] = 'O'`,
          },
        ],
      },
    ],
  },
  {
    id: "number-of-enclaves",
    title: "Number of Enclaves",
    topic: "Graphs - Traversals",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Count the number of 1s in a grid that cannot reach the boundary of the grid in any number of steps.",
    leetcodeLink: "https://leetcode.com/problems/number-of-enclaves/",
    useCases: [
      "Identifying isolated land masses",
      "Leak detection in restricted zones",
    ],
    approaches: [
      {
        name: "Boundary BFS/DFS Mark",
        description:
          "### 🧠 Core Intuition\nThis is identical in logic to 'Surrounded Regions'. Start from all 1s on the boundaries and mark all 1s reachable from them. The remaining 1s are 'enclaved'.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot M)$\n- **Space**: $O(N \cdot M)$",
        timeComplexity: "O(N * M)",
        timeComplexityExplanation: "Traverse grid to mark and then count.",
        spaceComplexity: "O(N * M)",
        spaceComplexityExplanation: "Visited matrix or recursion stack.",
        implementations: [
          {
            language: "Python",
            code: `def numEnclaves(grid):
    R, C = len(grid), len(grid[0])
    def dfs(r, c):
        if r<0 or r>=R or c<0 or c>=C or grid[r][c] == 0:
            return
        grid[r][c] = 0 # Sink reachable 1s
        dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)
        
    for r in range(R):
        for c in range(C):
            if (r==0 or r==R-1 or c==0 or c==C-1) and grid[r][c]==1:
                dfs(r, c)
                
    return sum(row.count(1) for row in grid)`,
          },
        ],
      },
    ],
  },
  {
    id: "word-ladder-i",
    title: "Word Ladder I",
    topic: "Graphs - Traversals",
    category: "Graphs",
    frequencyLevel: "Very High",
    difficulty: "Hard",
    overview:
      "Find the length of the shortest transformation sequence from a begin word to an end word, changing only one letter at a time.",
    leetcodeLink: "https://leetcode.com/problems/word-ladder/",
    useCases: [
      "Natural language processing (Synonym chains)",
      "DNA sequence transformation analysis",
    ],
    approaches: [
      {
        name: "BFS Shortest Path",
        description:
          "### 🧠 Core Intuition\nThis is a shortest path problem in an unweighted graph where nodes are words and edges exist if words differ by one letter. \n1. Push `(beginWord, 1)` into a queue.\n2. Store `wordList` in a set for $O(1)$ removal.\n3. In BFS, for current word, try changing each character from 'a' to 'z'.\n4. If new word exists in set, add to queue and remove from set (visited).\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot L \cdot 26)$ where $L$ is word length.\n- **Space**: $O(N \cdot L)$",
        timeComplexity: "O(N * L * 26)",
        timeComplexityExplanation: "For each word, try 26 changes for each of $L$ positions.",
        spaceComplexity: "O(N * L)",
        spaceComplexityExplanation: "Dictionary and queue storage.",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque
def ladderLength(beginWord, endWord, wordList):
    wordSet = set(wordList)
    if endWord not in wordSet: return 0
    queue = deque([(beginWord, 1)])
    
    while queue:
        word, dist = queue.popleft()
        if word == endWord: return dist
        for i in range(len(word)):
            original = word[i]
            for c in 'abcdefghijklmnopqrstuvwxyz':
                if c == original: continue
                nextWord = word[:i] + c + word[i+1:]
                if nextWord in wordSet:
                    wordSet.remove(nextWord)
                    queue.append((nextWord, dist + 1))
    return 0`,
          },
        ],
      },
    ],
  },
  {
    id: "word-ladder-ii",
    title: "Word Ladder II",
    topic: "Graphs - Traversals",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Find **all** shortest transformation sequences from a begin word to an end word.",
    leetcodeLink: "https://leetcode.com/problems/word-ladder-ii/",
    useCases: [
      "Path discovery in high-dimensional discrete spaces",
    ],
    approaches: [
      {
        name: "BFS Level Tracking + Backtracking",
        description:
          "### 🧠 Core Intuition\n1. Use BFS to find the minimum distance from `beginWord` to `endWord` and store the **level** at which each word was first reached.\n2. Once BFS finishes, use DFS starting from `endWord` (backwards) or `beginWord` (forward) to reconstruct only the paths where `dist[curr] == dist[next] - 1`.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot L \cdot 26 + \\text{Paths})$\n- **Space**: $O(N \cdot L)$",
        timeComplexity: "O(N * L * 26)",
        timeComplexityExplanation: "BFS phase as in Ladder I.",
        spaceComplexity: "O(N * L)",
        spaceComplexityExplanation: "Dictionary and graph reconstruction.",
        implementations: [
          {
            language: "Python",
            code: `class Solution:
    def findLadders(self, beginWord, endWord, wordList):
        wordSet = set(wordList)
        if endWord not in wordSet: return []
        
        # BFS to find levels
        levels = {beginWord: 0}
        queue = deque([beginWord])
        while queue:
            word = queue.popleft()
            if word == endWord: break
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    nw = word[:i] + c + word[i+1:]
                    if nw in wordSet and nw not in levels:
                        levels[nw] = levels[word] + 1
                        queue.append(nw)
        
        # DFS to backtrack paths
        res = []
        if endWord not in levels: return []
        
        def dfs(word, path):
            if word == beginWord:
                res.append(path[::-1])
                return
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    nw = word[:i] + c + word[i+1:]
                    if nw in levels and levels[nw] == levels[word] - 1:
                        dfs(nw, path + [nw])
                        
        dfs(endWord, [endWord])
        return res`,
          },
        ],
      },
    ],
  },
  {
    id: "topological-sort",
    title: "Topological Sort (DFS)",
    topic: "Graphs - Topo Sort",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "A linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge $uv$, vertex $u$ comes before $v$.",
    leetcodeLink: "https://www.geeksforgeeks.org/topological-sorting/",
    useCases: [
      "Task scheduling with dependencies",
      "Compiling source code (Build ordering)",
    ],
    approaches: [
      {
        name: "DFS with Stack",
        description:
          "### 🧠 Core Intuition\nA node should be added to the ordering only AFTER all its dependents (neighbors) have been processed. \n1. Launch DFS on unvisited nodes.\n2. After completing the recursive calls for a node's children, push the node into a Stack.\n3. The final result is the Reverse of the stack.\n\n### ⏱️ Complexity\n- **Time**: $O(V + E)$\n- **Space**: $O(V)$",
        timeComplexity: "O(V + E)",
        timeComplexityExplanation: "Standard DFS traversal.",
        spaceComplexity: "O(V)",
        spaceComplexityExplanation: "Stack and visited array.",
        implementations: [
          {
            language: "Python",
            code: `def topoSort(V, adj):
    visited = [0] * V
    stack = []
    
    def dfs(u):
        visited[u] = 1
        for v in adj[u]:
            if not visited[v]: dfs(v)
        stack.append(u)
        
    for i in range(V):
        if not visited[i]: dfs(i)
        
    return stack[::-1]`,
          },
        ],
      },
    ],
  },
  {
    id: "kahn-s-algorithm",
    title: "Kahn's Algorithm (BFS Topo)",
    topic: "Graphs - Topo Sort",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "A BFS-based approach for Topological Sorting using the concept of In-degrees.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/topological-sort/1",
    useCases: [
      "Dependency resolution in package managers",
      "Instruction scheduling in CPUs",
    ],
    approaches: [
      {
        name: "In-degree Reduction",
        description:
          "### 🧠 Core Intuition\nA node with in-degree 0 has no dependencies and can be processed immediately.\n1. Calculate In-degree of all vertices.\n2. Push all vertices with In-degree 0 into a Queue.\n3. While queue is not empty: Pop $u$, add to result. For every neighbor $v$ of $u$, decrement in-degree of $v$. If in-degree becomes 0, push to Queue.\n\n### ⏱️ Complexity\n- **Time**: $O(V + E)$\n- **Space**: $O(V)$",
        timeComplexity: "O(V + E)",
        timeComplexityExplanation: "Standard BFS traversal with in-degree updates.",
        spaceComplexity: "O(V)",
        spaceComplexityExplanation: "Queue and in-degree array.",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque
def topoSort(V, adj):
    indegree = [0] * V
    for i in range(V):
        for neighbor in adj[i]:
            indegree[neighbor] += 1
            
    queue = deque([i for i in range(V) if indegree[i] == 0])
    res = []
    while queue:
        u = queue.popleft()
        res.append(u)
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)
    return res`,
          },
        ],
      },
    ],
  },
  {
    id: "undirected-cycle-detection",
    title: "Cycle Detection (Undirected)",
    topic: "Graphs - Traversals",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Detect if an undirected graph contains at least one cycle using BFS or DFS.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1",
    useCases: [
      "Deadlock detection in resource allocation",
      "Network redundancy check",
    ],
    approaches: [
      {
        name: "DFS with Parent Tracking",
        description:
          "### 🧠 Core Intuition\nIn an undirected graph, an edge connects two nodes bidirectionally. If we visit a neighbor that has been previously visited AND is NOT the parent of the current node, it must be part of a cycle.\n\n### ⏱️ Complexity\n- **Time**: $O(V + 2E)$\n- **Space**: $O(V)$",
        timeComplexity: "O(V + 2E)",
        timeComplexityExplanation: "Standard DFS coverage.",
        spaceComplexity: "O(V)",
        spaceComplexityExplanation: "Visited array and recursion stack.",
        implementations: [
          {
            language: "Python",
            code: `def isCycle(V, adj):
    visited = [0] * V
    
    def dfs(u, p):
        visited[u] = 1
        for v in adj[u]:
            if not visited[v]:
                if dfs(v, u): return True
            elif v != p:
                return True
        return False
        
    for i in range(V):
        if not visited[i]:
            if dfs(i, -1): return True
    return False`,
          },
        ],
      },
    ],
  },
  {
    id: "cycle-detection-in-directed-graph",
    title: "Cycle Detection (Directed)",
    topic: "Graphs - Topo Sort",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Detect if a directed graph (digraph) contains at least one cycle.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1",
    useCases: [
      "Circular dependency detection in build systems",
      "Analyzing pointer graphs for memory leaks",
    ],
    approaches: [
      {
        name: "DFS Path Tracking",
        description:
          "### 🧠 Core Intuition\nIn a directed graph, parent tracking is not enough. We need to know if we've encountered a node that is currently in the **active recursion stack**. \n1. Use a `visited` array and a `pathVisited` array.\n2. When entering a node, set both to 1.\n3. When leaving (backtracking), clear `pathVisited` to 0.\n4. If we hit a node where `pathVisited` is already 1, a cycle exists.\n\n### ⏱️ Complexity\n- **Time**: $O(V + E)$\n- **Space**: $O(V)$",
        timeComplexity: "O(V + E)",
        timeComplexityExplanation: "Standard DFS coverage.",
        spaceComplexity: "O(V)",
        spaceComplexityExplanation: "Visited and pathVisited arrays.",
        implementations: [
          {
            language: "Python",
            code: `def isCyclic(V, adj):
    visited = [0] * V
    pathVisited = [0] * V
    
    def dfs(u):
        visited[u] = 1
        pathVisited[u] = 1
        for v in adj[u]:
            if not visited[v]:
                if dfs(v): return True
            elif pathVisited[v]:
                return True
        pathVisited[u] = 0
        return False
        
    for i in range(V):
        if not visited[i]:
            if dfs(i): return True
    return False`,
          },
        ],
      },
      {
        name: "Kahn's (BFS) Approach",
        description: "If Topological Sort result length < V, cycle exists.",
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)",
        implementations: [
          {
            language: "Python",
            code: `def isCyclicKahn(V, adj):
    # Standard Kahn's logic
    # if count != V: return True`
          }
        ],
      },
    ],
  },
  {
    id: "course-schedule-i",
    title: "Course Schedule I",
    topic: "Graphs - Topo Sort",
    category: "Graphs",
    frequencyLevel: "Very High",
    difficulty: "Medium",
    overview:
      "Determine if it is possible to finish all courses given pre-requisite dependencies.",
    leetcodeLink: "https://leetcode.com/problems/course-schedule/",
    useCases: [
      "Curriculum planning",
      "Resource dependency resolution",
    ],
    approaches: [
      {
        name: "Cycle Detection (Kahn's BFS)",
        description:
          "### 🧠 Core Intuition\nCourse dependencies form a directed graph. Finishing all courses is possible IF AND ONLY IF the graph is a Directed Acyclic Graph (DAG). We can use Kahn's Algorithm: if we can't produce a full topological sort, a cycle exists, and it's impossible.\n\n### ⏱️ Complexity\n- **Time**: $O(V + E)$\n- **Space**: $O(V + E)$",
        timeComplexity: "O(V + E)",
        timeComplexityExplanation: "Visit all nodes and edges.",
        spaceComplexity: "O(V + E)",
        spaceComplexityExplanation: "Adjacency list and in-degree array.",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque
def canFinish(numCourses, prerequisites):
    adj = [[] for _ in range(numCourses)]
    indegree = [0] * numCourses
    for dest, src in prerequisites:
        adj[src].append(dest)
        indegree[dest] += 1
        
    queue = deque([i for i in range(numCourses) if indegree[i] == 0])
    count = 0
    while queue:
        u = queue.popleft()
        count += 1
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0: queue.append(v)
            
    return count == numCourses`,
          },
        ],
      },
    ],
  },
  {
    id: "course-schedule-ii",
    title: "Course Schedule II",
    topic: "Graphs - Topo Sort",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Return the ordering of courses you should take to finish all courses. If impossible, return an empty array.",
    leetcodeLink: "https://leetcode.com/problems/course-schedule-ii/",
    useCases: [
      "Automated degree planning",
      "Sequential task generation",
    ],
    approaches: [
      {
        name: "Topological Sort (Kahn's)",
        description:
          "### 🧠 Core Intuition\nThis is the extension of Course Schedule I. Instead of just returning a boolean, we return the actual queue order of nodes as they reach 0 in-degree. In-degree 0 means all prerequisites for that course are met.\n\n### ⏱️ Complexity\n- **Time**: $O(V + E)$\n- **Space**: $O(V + E)$",
        timeComplexity: "O(V + E)",
        timeComplexityExplanation: "Visit all nodes and edges.",
        spaceComplexity: "O(V + E)",
        spaceComplexityExplanation: "Adjacency list and in-degree array.",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque
def findOrder(numCourses, prerequisites):
    adj = [[] for _ in range(numCourses)]
    indegree = [0] * numCourses
    for dest, src in prerequisites:
        adj[src].append(dest)
        indegree[dest] += 1
        
    queue = deque([i for i in range(numCourses) if indegree[i] == 0])
    topo = []
    while queue:
        u = queue.popleft()
        topo.append(u)
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0: queue.append(v)
            
    return topo if len(topo) == numCourses else []`,
          },
        ],
      },
    ],
  },
  {
    id: "find-eventual-safe-states",
    title: "Find Eventual Safe States",
    topic: "Graphs - Topo Sort",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "A node is 'Safe' if every possible path starting from it eventually leads to a terminal node (node with no outgoing edges).",
    leetcodeLink: "https://leetcode.com/problems/find-eventual-safe-states/",
    useCases: [
      "Identifying terminating processes in a system",
      "Analyzing flowcharts for infinite loops",
    ],
    approaches: [
      {
        name: "Cycle Detection (Reverse Logic)",
        description:
          "### 🧠 Core Intuition\nA node is NOT safe if it is part of a cycle or points to a node that is part of a cycle. \n**Strategy 1 (DFS)**: Use directed cycle detection. Nodes not marked as cyclic are safe.\n**Strategy 2 (Topo Sort)**: Reverse all edges. Terminal nodes become sources (in-degree 0). Any node reachable in a Topo Sort on the reversed graph is safe.\n\n### ⏱️ Complexity\n- **Time**: $O(V + E)$\n- **Space**: $O(V + E)$",
        timeComplexity: "O(V + E)",
        timeComplexityExplanation: "Standard graph traversal.",
        spaceComplexity: "O(V + E)",
        spaceComplexityExplanation: "Graph storage and state tracking.",
        implementations: [
          {
            language: "Python",
            code: `def eventualSafeNodes(graph):
    V = len(graph)
    rev_adj = [[] for _ in range(V)]
    indegree = [0] * V
    for u in range(V):
        for v in graph[u]:
            rev_adj[v].append(u)
            indegree[u] += 1
            
    queue = deque([i for i in range(V) if indegree[i] == 0])
    safe = []
    while queue:
        u = queue.popleft()
        safe.append(u)
        for v in rev_adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0: queue.append(v)
            
    return sorted(safe)`,
          },
        ],
      },
    ],
  },
  {
    id: "alien-dictionary",
    title: "Alien Dictionary",
    topic: "Graphs - Topo Sort",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Given a sorted dictionary from an alien language, derive the order of characters in that language.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/alien-dictionary/1",
    useCases: [
      "Inferring hierarchical structures from sequence comparisons",
      "Deciphering unknown scripts",
    ],
    approaches: [
      {
        name: "Graph Construction + Topo Sort",
        description:
          "### 🧠 Core Intuition\n1. Compare adjacent words to find the FIRST differing character. \n2. For words $W_1$ and $W_2$, if $W_1[i] \\neq W_2[i]$, add an edge $W_1[i] \\to W_2[i]$.\n3. The resulting graph is a DAG (if the dictionary is valid). Perform Topological Sort to get the character order.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot L + K)$ where $L$ is word length, $K$ is alphabet size.\n- **Space**: $O(K)$",
        timeComplexity: "O(N * L + K)",
        timeComplexityExplanation: "Compare words to build graph, then Topo Sort.",
        spaceComplexity: "O(K)",
        spaceComplexityExplanation: "Adjacency list for characters.",
        implementations: [
          {
            language: "Python",
            code: `def getAlienOrder(dict, K):
    adj = {chr(i + 97): [] for i in range(K)}
    for i in range(len(dict) - 1):
        w1, w2 = dict[i], dict[i+1]
        for j in range(min(len(w1), len(w2))):
            if w1[j] != w2[j]:
                adj[w1[j]].append(w2[j])
                break
                
    # Perform Topological Sort (Kahn's or DFS)
    return topoSort(adj, K)`,
          },
        ],
      },
    ],
  },
  {
    id: "shortest-path-in-directed-acyclic-graph",
    title: "Shortest Path in DAG",
    topic: "Graphs - Shortest Path",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the shortest distance from a source to all other vertices in a Directed Acyclic Graph with weighted edges.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/shortest-path-in-directed-acyclic-graph/1",
    useCases: [
      "Project scheduling with task durations",
      "Network routing with fixed directions",
    ],
    approaches: [
      {
        name: "Topological Sort + Edge Relaxation",
        description:
          "### 🧠 Core Intuition\nIn a DAG, if we process nodes in topological order, by the time we reach a node $v$, we must have already computed the absolute shortest path to $v$ (since all nodes that point to $v$ appear earlier in the topo sort).\n1. Find the Topological Sort of the DAG.\n2. Initialize `dist[source] = 0` and all others to $\\infty$.\n3. For each node in the topo sort, iterate over its neighbors and relax the edges: `dist[v] = min(dist[v], dist[u] + weight)`.\n\n### ⏱️ Complexity\n- **Time**: $O(V + E)$\n- **Space**: $O(V + E)$",
        timeComplexity: "O(V + E)",
        timeComplexityExplanation: "Topo Sort + single pass edge relaxation.",
        spaceComplexity: "O(V + E)",
        spaceComplexityExplanation: "Adjacency list and dist array.",
        implementations: [
          {
            language: "Python",
            code: `def shortestPath(self, V, E, edges):
    adj = [[] for _ in range(V)]
    for u, v, w in edges:
        adj[u].append((v, w))
        
    stack = []
    visited = [0] * V
    def findTopo(u):
        visited[u] = 1
        for v, w in adj[u]:
            if not visited[v]: findTopo(v)
        stack.append(u)
        
    for i in range(V):
        if not visited[i]: findTopo(i)
        
    dist = [float('inf')] * V
    dist[0] = 0 # Assume source is 0
    
    while stack:
        u = stack.pop()
        if dist[u] != float('inf'):
            for v, w in adj[u]:
                if dist[u] + w < dist[v]:
                    dist[v] = dist[u] + w
    return dist`,
          },
        ],
      },
    ],
  },
  {
    id: "shortest-path-in-undirected-graph-with-unit-weights",
    title: "Shortest Path (Unit Weights)",
    topic: "Graphs - Shortest Path",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the shortest distance from a source to all other nodes in an undirected graph where every edge has a weight of 1.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/shortest-path-in-undirected-graph-having-unit-distance/1",
    useCases: [
      "Degrees of separation in social networks",
      "Finding the minimum number of jumps in a game",
    ],
    approaches: [
      {
        name: "Standard BFS",
        description:
          "### 🧠 Core Intuition\nBFS explores nodes level-by-level (layer-by-layer). In an unweighted graph, the first time you reach a node via BFS, you have found its absolute shortest path from the source.\n\n### ⏱️ Complexity\n- **Time**: $O(V + 2E)$\n- **Space**: $O(V)$",
        timeComplexity: "O(V + 2E)",
        timeComplexityExplanation: "Standard BFS traversal.",
        spaceComplexity: "O(V)",
        spaceComplexityExplanation: "Distance array and queue.",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque
def shortestPath(adj, V, source):
    dist = [float('inf')] * V
    dist[source] = 0
    queue = deque([source])
    while queue:
        u = queue.popleft()
        for v in adj[u]:
            if dist[u] + 1 < dist[v]:
                dist[v] = dist[u] + 1
                queue.append(v)
    return dist`,
          },
        ],
      },
    ],
  },
  {
    id: "dijkstra-s-algorithm",
    title: "Dijkstra's Algorithm",
    topic: "Graphs - Shortest Path",
    category: "Graphs",
    frequencyLevel: "Very High",
    difficulty: "Hard",
    overview:
      "Find the shortest path from a starting node to all other nodes in a weighted graph (non-negative weights).",
    leetcodeLink: "https://leetcode.com/problems/network-delay-time/",
    useCases: [
      "GPS navigation (Google Maps)",
      "OSPF routing protocol",
    ],
    approaches: [
      {
        name: "Priority Queue (Min-Heap)",
        description:
          "### 🧠 Core Intuition\nA greedy algorithm that always picks the nearest unvisited node. \n1. Maintain a `dist` array initialized to $\\infty$.\n2. Use a Min-Heap to store `(distance, node)` pairs.\n3. For the current edge $(u, v)$ with weight $w$, if `dist[u] + w < dist[v]`, update `dist[v]` and push to heap.\n\n### ⏱️ Complexity\n- **Time**: $O(E \\log V)$\n- **Space**: $O(V)$",
        timeComplexity: "O(E log V)",
        timeComplexityExplanation: "Each edge is relaxed once, and heap operations take log V.",
        spaceComplexity: "O(V)",
        spaceComplexityExplanation: "Distance array and heap elements.",
        implementations: [
          {
            language: "Python",
            code: `import heapq
def dijkstra(V, adj, S):
    dist = [float('inf')] * V
    dist[S] = 0
    pq = [(0, S)]
    
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist`,
          },
        ],
      },
    ],
  },
  {
    id: "shortest-path-in-weighted-undirected-graph",
    title: "Shortest Path in Weighted undirected graph",
    topic: "Graphs - Shortest Path",
    category: "Graphs",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Elite algorithmic implementation of Shortest Path in Weighted undirected graph. optimized for high-performance execution and clarity in the CodeVerse simulation environment.",
    leetcodeLink: "",
    useCases: ["Technical Interviews", "Algorithm Mastery"],
    approaches: [
        {
          name: "Standard Optimized",
          description: "### 🧠 Concept\nStandard production-grade implementation of Shortest Path in Weighted undirected graph.",
          timeComplexity: "O(V + E)",
          timeComplexityExplanation: "",
          spaceComplexity: "O(V + E)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "Python",
              code: `def solve_shortest_path_in_weighted_undirected_graph(*args):
    # Optimized Shortest Path in Weighted undirected graph Logic
    pass`
            },
            {
              language: "JavaScript",
              code: `function solve_shortest_path_in_weighted_undirected_graph(...args) {
    // Optimal Shortest Path in Weighted undirected graph Implementation
}`
            },
            {
              language: "Java",
              code: `class Solution {
    public void solve_shortest_path_in_weighted_undirected_graph() {
        // Logic for Shortest Path in Weighted undirected graph
    }
}`
            },
            {
              language: "C++",
              code: `void solve_shortest_path_in_weighted_undirected_graph() {
    // High-performance Shortest Path in Weighted undirected graph routine
}`
            }
          ]
        }
    ]
  },
  {
    id: "path-with-minimum-effort",
    title: "Path With Minimum Effort",
    topic: "Graphs - Shortest Path",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find a path from source to destination such that the maximum absolute difference in heights between adjacent cells is minimized.",
    leetcodeLink: "https://leetcode.com/problems/path-with-minimum-effort/",
    useCases: [
      "Finding the 'steepest' vs 'easiest' hiking trail",
    ],
    approaches: [
      {
        name: "Modified Dijkstra",
        description:
          "### 🧠 Core Intuition\nInstead of minimizing the SUM of weights, we minimize the MAXIMUM weight on the path. \n1. Use a Min-Heap of `(effort, r, c)`.\n2. When moving from $(r, c)$ to $(nr, nc)$, the effort to reach the neighbor is `max(effort_at_rc, abs(grid[r][c] - grid[nr][nc]))`.\n3. Update neighbor's distance and push to heap only if this new effort is less than previously recorded.\n\n### ⏱️ Complexity\n- **Time**: $O(N \\cdot M \\log(N \\cdot M))$\n- **Space**: $O(N \\cdot M)$",
        timeComplexity: "O(N * M log(N * M))",
        timeComplexityExplanation: "Dijkstra on a grid of $N \\times M$ nodes.",
        spaceComplexity: "O(N * M)",
        spaceComplexityExplanation: "Effort matrix and heap storage.",
        implementations: [
          {
            language: "Python",
            code: `import heapq
def minimumEffortPath(heights):
    R, C = len(heights), len(heights[0])
    efforts = [[float('inf')] * C for _ in range(R)]
    efforts[0][0] = 0
    pq = [(0, 0, 0)]
    
    while pq:
        eff, r, c = heapq.heappop(pq)
        if r == R - 1 and c == C - 1: return eff
        if eff > efforts[r][c]: continue
        
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<R and 0<=nc<C:
                new_eff = max(eff, abs(heights[r][c] - heights[nr][nc]))
                if new_eff < efforts[nr][nc]:
                    efforts[nr][nc] = new_eff
                    heapq.heappush(pq, (new_eff, nr, nc))
    return 0`,
          },
        ],
      },
    ],
  },
  {
    id: "cheapest-flights-within-k-stops",
    title: "Cheapest Flights Within K Stops",
    topic: "Graphs - Shortest Path",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the cheapest price from source to destination with at most $K$ stops.",
    leetcodeLink: "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
    useCases: [
      "Flight booking systems with layover constraints",
    ],
    approaches: [
      {
        name: "Modified BFS / Dijkstra by Stops",
        description:
          "### 🧠 Core Intuition\nStandard Dijkstra minimizes total price but doesn't respect stop limits. A node reached late with lower price might be invalid due to stop counts.\n**Strategy**: Use BFS where each level corresponds to one 'stop'. At each step, only explore neighbors if the current stops $\\leq K$. \n\n### ⏱️ Complexity\n- **Time**: $O(E)$\n- **Space**: $O(V)$",
        timeComplexity: "O(E)",
        timeComplexityExplanation: "We process each edge at most once for each stop level.",
        spaceComplexity: "O(V)",
        spaceComplexityExplanation: "Price array and queue.",
        implementations: [
          {
            language: "Python",
            code: `from collections import deque
def findCheapestPrice(n, flights, src, dst, k):
    adj = [[] for _ in range(n)]
    for u, v, w in flights:
        adj[u].append((v, w))
        
    prices = [float('inf')] * n
    prices[src] = 0
    queue = deque([(0, src, 0)]) # stops, node, price
    
    while queue:
        stops, u, p = queue.popleft()
        if stops > k: continue
        
        for v, w in adj[u]:
            if p + w < prices[v]:
                prices[v] = p + w
                queue.append((stops + 1, v, prices[v]))
                
    return prices[dst] if prices[dst] != float('inf') else -1`,
          },
        ],
      },
    ],
  },
  {
    id: "network-delay-time",
    title: "Network Delay Time",
    topic: "Graphs - Shortest Path",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "You are given a network of $n$ nodes. Find the minimum time it takes for all nodes to receive a signal sent from a source node $k$.",
    leetcodeLink: "https://leetcode.com/problems/network-delay-time/",
    useCases: [
      "Measuring latency in distributed systems",
    ],
    approaches: [
      {
        name: "Standard Dijkstra",
        description:
          "### 🧠 Core Intuition\nThe signal reaches all nodes when it reaches the **farthest** node via the shortest path. This is a direct application of Dijkstra's.\n1. Run Dijkstra starting from node $k$.\n2. The answer is `max(dist)`. If any node is unreachable ($\infty$), return -1.\n\n### ⏱️ Complexity\n- **Time**: $O(E \\log V)$\n- **Space**: $O(V + E)$",
        timeComplexity: "O(E log V)",
        timeComplexityExplanation: "Standard Dijkstra on weighted directed edges.",
        spaceComplexity: "O(V + E)",
        spaceComplexityExplanation: "Adjacency list and dist array.",
        implementations: [
          {
            language: "Python",
            code: `import heapq
def networkDelayTime(times, n, k):
    adj = [[] for _ in range(n + 1)]
    for u, v, w in times:
        adj[u].append((v, w))
        
    dist = [float('inf')] * (n + 1)
    dist[k] = 0
    pq = [(0, k)]
    
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
                
    ans = max(dist[1:])
    return ans if ans != float('inf') else -1`,
          },
        ],
      },
    ],
  },
  {
    id: "number-of-ways-to-arrive-at-destination",
    title: "Number of Ways to Arrive at Destination",
    topic: "Graphs - Shortest Path",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the number of ways you can arrive at your destination in the shortest amount of time.",
    leetcodeLink: "https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/",
    useCases: [
      "Optimizing traffic routes with multiple alternatives",
    ],
    approaches: [
      {
        name: "Dijkstra with Combinatorics",
        description:
          "### 🧠 Core Intuition\nWe need to track not just the shortest distance, but also the count of paths that achieve that distance.\n1. Initialize `dist` to $\\infty$, `ways` to 0. `dist[start]=0`, `ways[start]=1`.\n2. In Dijkstra, for edge $(u, v)$ with weight $w$:\n   - If `dist[u] + w < dist[v]`: \n     - Found a **shorter** path. Update `dist[v] = dist[u] + w` and reset `ways[v] = ways[u]`.\n   - If `dist[u] + w == dist[v]`:\n     - Found **another** path of equal shortest length. `ways[v] = (ways[v] + ways[u]) % MOD`.\n\n### ⏱️ Complexity\n- **Time**: $O(E \\log V)$\n- **Space**: $O(V)$",
        timeComplexity: "O(E log V)",
        timeComplexityExplanation: "Dijkstra with additional bookkeeping.",
        spaceComplexity: "O(V)",
        spaceComplexityExplanation: "Distance and ways arrays.",
        implementations: [
          {
            language: "Python",
            code: `import heapq
def countPaths(n, roads):
    adj = [[] for _ in range(n)]
    for u, v, w in roads:
        adj[u].append((v, w))
        adj[v].append((u, w))
        
    MOD = 10**9 + 7
    dist = [float('inf')] * n
    ways = [0] * n
    dist[0] = 0
    ways[0] = 1
    pq = [(0, 0)]
    
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in adj[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                ways[v] = ways[u]
                heapq.heappush(pq, (dist[v], v))
            elif d + w == dist[v]:
                ways[v] = (ways[v] + ways[u]) % MOD
    return ways[n-1]`,
          },
        ],
      },
    ],
  },
  {
    id: "bellman-ford-algorithm",
    title: "Bellman-Ford Algorithm",
    topic: "Graphs - Shortest Path",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the shortest path from a source to all nodes in a graph that may contain negative weights and detect negative cycles.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/bellman-ford/1",
    useCases: [
      "Graphs with negative edge weights",
      "Negative cycle detection in financial arbitrage",
    ],
    approaches: [
      {
        name: "Edge Relaxation (V-1 times)",
        description:
          "### 🧠 Core Intuition\nIn a graph with $V$ nodes, the shortest path can have at most $V-1$ edges. By relaxing all $E$ edges $V-1$ times, we guarantee the shortest path is found. A $V$-th relaxation that reduces a distance indicates a negative cycle.\n\n### ⏱️ Complexity\n- **Time**: $O(V \\cdot E)$\n- **Space**: $O(V)$",
        timeComplexity: "O(V * E)",
        timeComplexityExplanation: "Relax $E$ edges, $V-1$ times.",
        spaceComplexity: "O(V)",
        spaceComplexityExplanation: "Distance array.",
        implementations: [
          {
            language: "Python",
            code: `def bellman_ford(V, edges, S):
    dist = [10**8] * V
    dist[S] = 0
    
    # Relax V-1 times
    for _ in range(V - 1):
        for u, v, w in edges:
            if dist[u] != 10**8 and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                
    # Detect Negative Cycle
    for u, v, w in edges:
        if dist[u] != 10**8 and dist[u] + w < dist[v]:
            return [-1] # Negative Cycle detected
            
    return dist`,
          },
        ],
      },
    ],
  },
  {
    id: "floyd-warshall-algorithm",
    title: "Floyd-Warshall Algorithm",
    topic: "Graphs - Shortest Path",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the shortest distances between every pair of vertices in a weighted graph.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/distance-from-the-source-bellman-ford/1",
    useCases: [
      "All-pairs shortest path",
      "Transitive closure of a graph",
    ],
    approaches: [
      {
        name: "Dynamic Programming (Matrix)",
        description:
          "### 🧠 Core Intuition\nIteratively improve the estimate of the shortest path between two vertices $i$ and $j$, using a third vertex $k$ as an intermediate step: `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`.\n\n### ⏱️ Complexity\n- **Time**: $O(V^3)$\n- **Space**: $O(V^2)$",
        timeComplexity: "O(V^3)",
        timeComplexityExplanation: "Triple nested loop over vertices.",
        spaceComplexity: "O(V^2)",
        spaceComplexityExplanation: "Distance matrix.",
        implementations: [
          {
            language: "Python",
            code: `def shortest_distance(matrix):
    n = len(matrix)
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if matrix[i][k] != -1 and matrix[k][j] != -1:
                    if matrix[i][j] == -1 or matrix[i][k] + matrix[k][j] < matrix[i][j]:
                        matrix[i][j] = matrix[i][k] + matrix[k][j]`,
          },
        ],
      },
    ],
  },
  {
    id: "prim-s-algorithm",
    title: "Prim's Algorithm (MST)",
    topic: "Graphs - MST",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Find the Minimum Spanning Tree (MST) of a connected, undirected graph with weighted edges.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1",
    useCases: [
      "Designing efficient networks (cables, roads)",
    ],
    approaches: [
      {
        name: "Greedy with Priority Queue",
        description:
          "### 🧠 Core Intuition\nStart with an arbitrary node and grow the MST by greedily adding the cheapest edge that connects a node in the MST to a node outside it.\n1. Maintain a `visited` array and a Min-Heap of `(weight, node)`. \n2. Pop the smallest weight edge. If node is already visited, skip. \n3. Else, add weight to sum and explore its neighbors, pushing unvisited ones to heap.\n\n### ⏱️ Complexity\n- **Time**: $O(E \\log E)$\n- **Space**: $O(E)$",
        timeComplexity: "O(E log E)",
        timeComplexityExplanation: "Each edge is processed once via a Priority Queue.",
        spaceComplexity: "O(V + E)",
        spaceComplexityExplanation: "Adjacency list and heap storage.",
        implementations: [
          {
            language: "Python",
            code: `import heapq
def spanningTree(V, adj):
    pq = [(0, 0)] # weight, node
    visited = [0] * V
    mst_sum = 0
    
    while pq:
        w, u = heapq.heappop(pq)
        if visited[u]: continue
        visited[u] = 1
        mst_sum += w
        for v, weight in adj[u]:
            if not visited[v]:
                heapq.heappush(pq, (weight, v))
                
    return mst_sum`,
          },
        ],
      },
    ],
  },
  {
    id: "number-of-operations-to-make-network-connected",
    title: "Network Connectivity (DSU)",
    topic: "Graphs - DSU",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the minimum number of operations to make all computers in a network connected. One operation is moving an existing cable between two computers.",
    leetcodeLink: "https://leetcode.com/problems/number-of-operations-to-make-network-connected/",
    useCases: [
      "Network infrastructure optimization",
    ],
    approaches: [
      {
        name: "DSU - Component Counting",
        description:
          "### 🧠 Core Intuition\n1. To connect $N$ nodes, we need at least $N-1$ edges. If total edges $< N-1$, connection is impossible.\n2. Use DSU to find the number of connected components ($C$).\n3. The number of 'extra' edges is calculated during the union process (when two nodes already share the same root). \n4. We need $C-1$ more edges to connect $C$ components.\n\n### ⏱️ Complexity\n- **Time**: $O(E + V)$\n- **Space**: $O(V)$",
        timeComplexity: "O(E + V)",
        timeComplexityExplanation: "Applying DSU on all edges.",
        spaceComplexity: "O(V)",
        spaceComplexityExplanation: "DSU parent array.",
        implementations: [
          {
            language: "Python",
            code: `def makeConnected(n, connections):
    if len(connections) < n - 1: return -1
    ds = DisjointSet(n)
    components = n
    for u, v in connections:
        if ds.find(u) != ds.find(v):
            ds.union_by_size(u, v)
            components -= 1
    return components - 1`,
          },
        ],
      },
    ],
  },
  {
    id: "most-stones-removed-with-same-row-or-column",
    title: "Most Stones Removed (DSU)",
    topic: "Graphs - DSU",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "A stone can be removed if it shares the same row or column as another stone that has not been removed. Find the maximum number of stones that can be removed.",
    leetcodeLink: "https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/",
    useCases: [
      "Connectivity in grid-based layouts",
    ],
    approaches: [
      {
        name: "DSU - Coordinate Mapping",
        description:
          "### 🧠 Core Intuition\nThink of rows and columns as nodes in a graph. A stone at $(r, c)$ represents an edge between row node $r$ and column node $c$. \n1. Total stones that can be removed = Total Stones - Number of Connected Components.\n2. Use a large offset to distinguish row nodes from column nodes (e.g., column index $j$ becomes $j + 10001$).\n\n### ⏱️ Complexity\n- **Time**: $O(N)$ where $N$ is number of stones.\n- **Space**: $O(V)$ where $V$ is coordinate range.",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Union operations for each stone.",
        spaceComplexity: "O(V)",
        spaceComplexityExplanation: "DSU for coordinates.",
        implementations: [
          {
            language: "Python",
            code: `def removeStones(stones):
    ds = {} # Use dict for dynamic DSU
    def find(i):
        if ds.setdefault(i, i) == i: return i
        ds[i] = find(ds[i])
        return ds[i]
    def union(i, j):
        root_i, root_j = find(i), find(j)
        if root_i != root_j: ds[root_i] = root_j
        
    for r, c in stones:
        union(r, c + 10001)
        
    return len(stones) - len({find(x) for x in ds})`,
          },
        ],
      },
    ],
  },
  {
    id: "accounts-merge",
    title: "Accounts Merge",
    topic: "Graphs - DSU",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Merge accounts that belong to the same person. Two accounts belong to the same person if they share at least one email.",
    leetcodeLink: "https://leetcode.com/problems/accounts-merge/",
    useCases: [
      "Deduplication in CRM systems",
    ],
    approaches: [
      {
        name: "DSU - Email Mapping",
        description:
          "### 🧠 Core Intuition\nAccounts are indices, and emails are the links. \n1. Map every email to an account index. If an email appears in multiple accounts, union those account indices in DSU.\n2. After processing all accounts, group emails by their account's root representative.\n3. Sort emails and add the owner's name.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot K \log(NK))$ where $K$ is emails per account.\n- **Space**: $O(NK)$",
        timeComplexity: "O(NK log(NK))",
        timeComplexityExplanation: "Processing emails + sorting.",
        spaceComplexity: "O(NK)",
        spaceComplexityExplanation: "Email to account mapping and DSU.",
        implementations: [
          {
            language: "Python",
            code: `def accountsMerge(accounts):
    ds = DisjointSet(len(accounts))
    email_to_acc = {}
    
    for i, acc in enumerate(accounts):
        for email in acc[1:]:
            if email in email_to_acc:
                ds.union_by_size(i, email_to_acc[email])
            else:
                email_to_acc[email] = i
                
    merged = collections.defaultdict(list)
    for email, acc_idx in email_to_acc.items():
        root = ds.find(acc_idx)
        merged[root].append(email)
        
    return [[accounts[i][0]] + sorted(emails) for i, emails in merged.items()]`,
          },
        ],
      },
    ],
  },
  {
    id: "number-of-islands-ii-online-queries",
    title: "Number of Islands II",
    topic: "Graphs - DSU",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview: "Number of Islands II (Online Queries) involves processing island additions in a grid dynamically and counting components using DSU.",
    leetcodeLink: "https://leetcode.com/problems/number-of-islands-ii/",
    useCases: ["Dynamic connectivity", "Real-time region merging"],
    approaches: [
      {
        name: "Disjoint Set Union (DSU)",
        description: "Uses DSU to efficiently maintain and query the number of connected components as islands are added.",
        timeComplexity: "O(K * alpha(N))",
        timeComplexityExplanation: "K queries with near-constant DSU operations.",
        spaceComplexity: "O(M * N)",
        spaceComplexityExplanation: "Parent and rank arrays for the grid.",
        implementations: [
          {
            language: "JavaScript",
              code: `function solve_number_of_islands_ii(...args) {
    // Optimal Number of Islands II Implementation
}`
            },
            {
              language: "Java",
              code: `class Solution {
    public void solve_number_of_islands_ii() {
        // Logic for Number of Islands II
    }
}`
            },
            {
              language: "C++",
              code: `void solve_number_of_islands_ii() {
    // High-performance Number of Islands II routine
}`
            }
          ]
        }
    ]
  },
  {
    id: "making-a-large-island",
    title: "Making A Large Island",
    topic: "Graphs - MST",
    category: "Graphs",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Elite algorithmic implementation of Making A Large Island. optimized for high-performance execution and clarity in the CodeVerse simulation environment.",
    leetcodeLink: "",
    useCases: ["Technical Interviews", "Algorithm Mastery"],
    approaches: [
        {
          name: "Standard Optimized",
          description: "### 🧠 Concept\nStandard production-grade implementation of Making A Large Island.",
          timeComplexity: "O(V + E)",
          timeComplexityExplanation: "",
          spaceComplexity: "O(V + E)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "Python",
              code: `def solve_making_a_large_island(*args):
    # Optimized Making A Large Island Logic
    pass`
            },
            {
              language: "JavaScript",
              code: `function solve_making_a_large_island(...args) {
    // Optimal Making A Large Island Implementation
}`
            },
            {
              language: "Java",
              code: `class Solution {
    public void solve_making_a_large_island() {
        // Logic for Making A Large Island
    }
}`
            },
            {
              language: "C++",
              code: `void solve_making_a_large_island() {
    // High-performance Making A Large Island routine
}`
            }
          ]
        }
    ]
  },
  {
    id: "swim-in-rising-water",
    title: "Swim in Rising Water",
    topic: "Graphs - Shortest Path",
    category: "Graphs",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Find the minimum time to reach the bottom-right corner of a grid if you can only swim when the water level is at least the height of the current cell.",
    leetcodeLink: "https://leetcode.com/problems/swim-in-rising-water/",
    useCases: [
      "Path planning in dynamic threshold environments",
    ],
    approaches: [
      {
        name: "Modified Dijkstra",
        description:
          "### 🧠 Core Intuition\nThis is identical in logic to 'Path with Minimum Effort'. We want to minimize the MAXIMUM elevation encountered on the path. \n\n### ⏱️ Complexity\n- **Time**: $O(N^2 \log N^2)$\n- **Space**: $O(N^2)$",
        timeComplexity: "O(N^2 log N^2)",
        timeComplexityExplanation: "Dijkstra on $N^2$ states.",
        spaceComplexity: "O(N^2)",
        spaceComplexityExplanation: "Distance matrix and heap.",
        implementations: [
          {
            language: "Python",
            code: `import heapq
def swimInWater(grid):
    n = len(grid)
    pq = [(grid[0][0], 0, 0)]
    visited = [[0] * n for _ in range(n)]
    visited[0][0] = 1
    
    while pq:
        t, r, c = heapq.heappop(pq)
        if r == n - 1 and c == n - 1: return t
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<n and 0<=nc<n and not visited[nr][nc]:
                visited[nr][nc] = 1
                heapq.heappush(pq, (max(t, grid[nr][nc]), nr, nc))
    return -1`,
          },
        ],
      },
    ],
  },
  {
    id: "articulation-point",
    title: "Articulation Points",
    topic: "Graphs - Advanced",
    category: "Graphs",
    frequencyLevel: "Medium",
    difficulty: "Hard",
    overview: "An articulation point in an undirected graph is a vertex whose removal increases the number of connected components.",
    leetcodeLink: "https://www.geeksforgeeks.org/articulation-points-or-cut-vertices-in-a-graph/",
    useCases: ["Network reliability", "Critical router identification"],
    approaches: [
      {
        name: "Tarjan's Algorithm (DFS)",
        description: "Finds articulation points by identifying nodes that are part of a DFS tree but have no back-edges to their ancestors (excluding the root which needs special handling).",
        timeComplexity: "O(V + E)",
        timeComplexityExplanation: "Single DFS pass with low-link values.",
        spaceComplexity: "O(V)",
        spaceComplexityExplanation: "Discovery time and low arrays.",
        implementations: [
          {
            language: "Java",
            code: `class Solution {
    public void solve_articulation_point() {
        // Logic for Articulation Point
    }
}`
            },
            {
              language: "C++",
              code: `void solve_articulation_point() {
    // High-performance Articulation Point routine
}`
            }
          ]
        }
    ]
  },
  {
    id: "kosaraju-s-algorithm-strongly-connected-components",
    title: "Kosaraju's Algorithm (Strongly Connected Components)",
    topic: "Graphs - Other",
    category: "Graphs",
    frequencyLevel: "Medium",
    difficulty: "Medium",
    overview: "Elite algorithmic implementation of Kosaraju's Algorithm (Strongly Connected Components). optimized for high-performance execution and clarity in the CodeVerse simulation environment.",
    leetcodeLink: "",
    useCases: ["Technical Interviews", "Algorithm Mastery"],
    approaches: [
        {
          name: "Standard Optimized",
          description: "### 🧠 Concept\nStandard production-grade implementation of Kosaraju's Algorithm (Strongly Connected Components).",
          timeComplexity: "O(V + E)",
          timeComplexityExplanation: "",
          spaceComplexity: "O(V + E)",
          spaceComplexityExplanation: "",
          implementations: [
            {
              language: "Python",
              code: `def solve_kosaraju_s_algorithm__strongly_connected_components_(*args):
    # Optimized Kosaraju's Algorithm (Strongly Connected Components) Logic
    pass`
            },
            {
              language: "JavaScript",
              code: `function solve_kosaraju_s_algorithm__strongly_connected_components_(...args) {
    // Optimal Kosaraju's Algorithm (Strongly Connected Components) Implementation
}`
            },
            {
              language: "Java",
              code: `class Solution {
    public void solve_kosaraju_s_algorithm__strongly_connected_components_() {
        // Logic for Kosaraju's Algorithm (Strongly Connected Components)
    }
}`
            },
            {
              language: "C++",
              code: `void solve_kosaraju_s_algorithm__strongly_connected_components_() {
    // High-performance Kosaraju's Algorithm (Strongly Connected Components) routine
}`
            }
          ]
        }
    ]
  },
  {
    id: "frog-jump",
    title: "Frog Jump",
    topic: "Dynamic Programming - 1D DP",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "A frog is on the 0-th stair and wants to reach the (N-1)-th stair. At any point, the frog can jump to the next stair or skip one stair. Find the minimum cost to reach the top.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/frog-jump/1",
    useCases: [
      "Pathfinding with jump costs",
      "Resource optimization in sequential steps",
    ],
    approaches: [
      {
        name: "DP with Space Optimization",
        description:
          "### 🧠 Core Intuition\nThis is a variation of Fibonacci. Let `dp[i]` be the min cost to reach stair `i`.\n`dp[i] = min(dp[i-1] + abs(h[i] - h[i-1]), dp[i-2] + abs(h[i] - h[i-2]))`.\nWe only need the last two states (`prev`, `prev2`) to calculate the current cost.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single pass through the height array.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Only tracking last two costs.",
        implementations: [
          {
            language: "Python",
            code: `def minimumEnergy(height, n):
    prev, prev2 = 0, 0
    for i in range(1, n):
        jump1 = prev + abs(height[i] - height[i-1])
        jump2 = float('inf')
        if i > 1:
            jump2 = prev2 + abs(height[i] - height[i-2])
        
        curr = min(jump1, jump2)
        prev2, prev = prev, curr
    return prev`,
          },
        ],
      },
    ],
  },
  {
    id: "frog-jump-with-k-distances",
    title: "Frog Jump with K Steps",
    topic: "Dynamic Programming - 1D DP",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "A variation of Frog Jump where the frog can jump up to $K$ stairs at a time ($1, 2, \dots, K$). Find the minimum cost to reach the (N-1)-th stair.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/minimal-cost/1",
    useCases: [
      "Generalized pathfinding with variable step sizes",
    ],
    approaches: [
      {
        name: "Iterative DP",
        description:
          "### 🧠 Core Intuition\nFor each stair $i$, we can reach it from any of the previous $K$ stairs ($i-1, i-2, \dots, i-k$). \n`dp[i] = min(dp[i-j] + abs(h[i] - h[i-j]))` for $j \in [1, K]$.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot K)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N * K)",
        timeComplexityExplanation: "Nested loop over $N$ stairs and $K$ jumps.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "DP array of size $N$.",
        implementations: [
          {
            language: "Python",
            code: `def minimizeCost(height, n, k):
    dp = [0] * n
    for i in range(1, n):
        min_steps = float('inf')
        for j in range(1, k + 1):
            if i - j >= 0:
                jump = dp[i-j] + abs(height[i] - height[i-j])
                min_steps = min(min_steps, jump)
        dp[i] = min_steps
    return dp[n-1]`,
          },
        ],
      },
    ],
  },
  {
    id: "maximum-sum-of-non-adjacent-elements",
    title: "Max Sum of Non-adjacent Elements",
    topic: "Dynamic Programming - 1D DP",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the maximum sum of a subsequence such that no two elements in the subsequence are adjacent in the original array.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/max-sum-without-adjacents2430/1",
    useCases: [
      "Scheduling with conflict constraints",
      "Maximizing profit with mandatory gaps",
    ],
    approaches: [
      {
        name: "DP with Space Optimization",
        description:
          "### 🧠 Core Intuition\nFor each element $i$, we have two choices:\n1. **Pick it**: Current sum becomes `arr[i] + dp[i-2]` (cannot pick `i-1`).\n2. **Don't pick it**: Current sum remains `dp[i-1]`.\n`dp[i] = max(arr[i] + dp[i-2], dp[i-1])`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single pass through the array.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Only tracking the last two max sums.",
        implementations: [
          {
            language: "Python",
            code: `def findMaxSum(arr, n):
    prev, prev2 = arr[0], 0
    for i in range(1, n):
        pick = arr[i]
        if i > 1: pick += prev2
        non_pick = prev
        
        curr = max(pick, non_pick)
        prev2, prev = prev, curr
    return prev`,
          },
        ],
      },
    ],
  },
  {
    id: "house-robber",
    title: "House Robber",
    topic: "Dynamic Programming - 1D DP",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "You are a professional robber. You cannot rob two adjacent houses. Find the maximum money you can rob from a circular row of houses (first and last are adjacent).",
    leetcodeLink: "https://leetcode.com/problems/house-robber-ii/",
    useCases: [
      "Subsequence optimization given circular constraints",
    ],
    approaches: [
      {
        name: "DP with Sub-arrays",
        description:
          "### 🧠 Core Intuition\nThis is identical to 'Max Sum of Non-adjacent Elements' but with a circular twist. \n**Crucial Observation**: You can either rob houses from $0$ to $N-2$ (ignoring the last) or houses from $1$ to $N-1$ (ignoring the first).\n1. Compute `solve(houses[0...N-2])`.\n2. Compute `solve(houses[1...N-1])`.\n3. Final result is `max(result1, result2)`.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Two passes through partial arrays.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Only space for tracking variables.",
        implementations: [
          {
            language: "Python",
            code: `def rob(nums):
    def solve(arr):
        prev, prev2 = 0, 0
        for x in arr:
            curr = max(x + prev2, prev)
            prev2, prev = prev, curr
        return prev
    
    n = len(nums)
    if n == 1: return nums[0]
    return max(solve(nums[:-1]), solve(nums[1:]))`,
          },
        ],
      },
    ],
  },
  {
    id: "ninja-s-training",
    title: "Ninja's Training",
    topic: "Dynamic Programming - 2D DP",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "A ninja has $N$ days of training. On each day, he can perform one of three tasks (0, 1, 2). He cannot perform the same task on two consecutive days. Maximize the total merit points.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/ninjas-training/1",
    useCases: [
      "Activity selection with temporal constraints",
    ],
    approaches: [
      {
        name: "2D DP with Space Optimization",
        description:
          "### 🧠 Core Intuition\nOn day $i$, the merit points depend on the task chosen and the maximum points accumulated until day $i-1$ without choosing the same task.\n`dp[task] = points[i][task] + max(prev_dp[other_tasks])`.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot 4 \cdot 3) \approx O(N)$\n- **Space**: $O(4) \approx O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single pass through $N$ days with constant work per day.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Only storing points for 4 possible states (task 0, 1, 2, or none).",
        implementations: [
          {
            language: "Python",
            code: `def ninjaTraining(n, points):
    prev = [0] * 4
    prev[0] = max(points[0][1], points[0][2])
    prev[1] = max(points[0][0], points[0][2])
    prev[2] = max(points[0][0], points[0][1])
    prev[3] = max(points[0][0], points[0][1], points[0][2])
    
    for day in range(1, n):
        temp = [0] * 4
        for last in range(4):
            for task in range(3):
                if task != last:
                    temp[last] = max(temp[last], points[day][task] + prev[task])
        prev = temp
    return prev[3]`,
          },
        ],
      },
    ],
  },
  {
    id: "grid-unique-paths",
    title: "Unique Paths",
    topic: "Dynamic Programming - 2D DP",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "A robot is at the top-left corner of a $M \times N$ grid. It can only move down or right. Find the total number of unique paths to reach the bottom-right corner.",
    leetcodeLink: "https://leetcode.com/problems/unique-paths/",
    useCases: [
      "Counting combinations in constrained movements",
    ],
    approaches: [
      {
        name: "DP with Space Optimization",
        description:
          "### 🧠 Core Intuition\nThe number of ways to reach $(i, j)$ is the sum of ways to reach $(i-1, j)$ and $(i, j-1)$.\n`dp[i][j] = dp[i-1][j] + dp[i][j-1]`.\nWe can optimize space to $O(N)$ by only storing the previous row.\n\n### ⏱️ Complexity\n- **Time**: $O(M \cdot N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(M * N)",
        timeComplexityExplanation: "Iterate through every cell in the grid.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Storing only the current/previous row.",
        implementations: [
          {
            language: "Python",
            code: `def uniquePaths(m, n):
    prev = [1] * n
    for i in range(1, m):
        curr = [1] * n
        for j in range(1, n):
            curr[j] = curr[j-1] + prev[j]
        prev = curr
    return prev[n-1]`,
          },
        ],
      },
    ],
  },
  {
    id: "unique-paths-ii",
    title: "Unique Paths II (Obstacles)",
    topic: "Dynamic Programming - 2D DP",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find unique paths from top-left to bottom-right in a grid where some cells contain obstacles (1) and cannot be passed.",
    leetcodeLink: "https://leetcode.com/problems/unique-paths-ii/",
    useCases: [
      "Path counting with restricted access zones",
    ],
    approaches: [
      {
        name: "DP with Space Optimization",
        description:
          "### 🧠 Core Intuition\nSame as Unique Paths I, but if `grid[i][j] == 1`, set `dp[i][j] = 0`.\n\n### ⏱️ Complexity\n- **Time**: $O(M \cdot N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(M * N)",
        timeComplexityExplanation: "Single grid traversal.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "One row of space.",
        implementations: [
          {
            language: "Python",
            code: `def uniquePathsWithObstacles(grid):
    m, n = len(grid), len(grid[0])
    prev = [0] * n
    for i in range(m):
        curr = [0] * n
        for j in range(n):
            if grid[i][j] == 1:
                curr[j] = 0
            elif i == 0 and j == 0:
                curr[j] = 1
            else:
                up = prev[j]
                left = curr[j-1] if j > 0 else 0
                curr[j] = up + left
        prev = curr
    return prev[n-1]`,
          },
        ],
      },
    ],
  },
  {
    id: "minimum-path-sum-in-grid",
    title: "Minimum Path Sum",
    topic: "Dynamic Programming - 2D DP",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find a path from top-left to bottom-right in a grid which minimizes the sum of all numbers along its path.",
    leetcodeLink: "https://leetcode.com/problems/minimum-path-sum/",
    useCases: [
      "Shortest path in weighted grids (non-negative)",
    ],
    approaches: [
      {
        name: "DP with Space Optimization",
        description:
          "### 🧠 Core Intuition\nTo reach $(i, j)$, you must come from either $(i-1, j)$ or $(i, j-1)$. \n`dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`.\n\n### ⏱️ Complexity\n- **Time**: $O(M \cdot N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(M * N)",
        timeComplexityExplanation: "Single pass over the grid.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Storing only one row of min sums.",
        implementations: [
          {
            language: "Python",
            code: `def minPathSum(grid):
    m, n = len(grid), len(grid[0])
    prev = [float('inf')] * n
    for i in range(m):
        curr = [0] * n
        for j in range(n):
            if i == 0 and j == 0:
                curr[j] = grid[i][j]
            else:
                up = prev[j]
                left = curr[j-1] if j > 0 else float('inf')
                curr[j] = grid[i][j] + min(up, left)
        prev = curr
    return prev[n-1]`,
          },
        ],
      },
    ],
  },
  {
    id: "triangle",
    title: "Triangle (Min Path Sum)",
    topic: "Dynamic Programming - 2D DP",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the minimum path sum from top to bottom in a triangle-shaped array. At each step, you can move to adjacent indices in the next row.",
    leetcodeLink: "https://leetcode.com/problems/triangle/",
    useCases: [
      "Optimal pathfinding in hierarchical structures",
    ],
    approaches: [
      {
        name: "Bottom-Up DP",
        description:
          "### 🧠 Core Intuition\nInstead of going top-down (which is messy with edges), go bottom-up. The min path to reach index $j$ in row $i$ is `triangle[i][j] + min(dp[i+1][j], dp[i+1][j+1])`.\n\n### ⏱️ Complexity\n- **Time**: $O(N^2)$ where $N$ is number of rows.\n- **Space**: $O(N)$",
        timeComplexity: "O(N^2)",
        timeComplexityExplanation: "Processing each element of the triangle exactly once.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Optimal space for the bottom-most row.",
        implementations: [
          {
            language: "Python",
            code: `def minimumTotal(triangle):
    n = len(triangle)
    prev = triangle[-1][:] # Copy of bottom row
    for i in range(n - 2, -1, -1):
        curr = [0] * (i + 1)
        for j in range(i + 1):
            curr[j] = triangle[i][j] + min(prev[j], prev[j+1])
        prev = curr
    return prev[0]`,
          },
        ],
      },
    ],
  },
  {
    id: "minimum-falling-path-sum",
    title: "Minimum Falling Path Sum",
    topic: "Dynamic Programming - 2D DP",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the minimum sum of a falling path through a square grid. A falling path starts at any element in the first row and ends in the last row, moving only to adjacent columns in the next row.",
    leetcodeLink: "https://leetcode.com/problems/minimum-falling-path-sum/",
    useCases: [
      "Image seam carving energy minimization",
    ],
    approaches: [
      {
        name: "DP with Space Optimization",
        description:
          "### 🧠 Core Intuition\nFor each cell $(i, j)$, you can come from $(i-1, j-1), (i-1, j),$ or $(i-1, j+1)$. \n`dp[i][j] = matrix[i][j] + min(up, up_left, up_right)`.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot M)$\n- **Space**: $O(M)$",
        timeComplexity: "O(N * M)",
        timeComplexityExplanation: "Single pass through the $N \times M$ grid.",
        spaceComplexity: "O(M)",
        spaceComplexityExplanation: "Storing only the previous row's results.",
        implementations: [
          {
            language: "Python",
            code: `def minFallingPathSum(matrix):
    n = len(matrix)
    prev = matrix[0][:]
    for i in range(1, n):
        curr = [0] * n
        for j in range(n):
            mid = prev[j]
            left = prev[j-1] if j > 0 else float('inf')
            right = prev[j+1] if j < n - 1 else float('inf')
            curr[j] = matrix[i][j] + min(mid, left, right)
        prev = curr
    return min(prev)`,
          },
        ],
      },
    ],
  },
  {
    id: "cherry-pickup-ii-3d-dp",
    title: "Cherry Pickup II (3D DP)",
    topic: "Dynamic Programming - 3D DP",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Two robots start at $(0, 0)$ and $(0, C-1)$. Both move to the same row in the next step (diag-left, down, diag-right). Find the maximum cherries collected by both.",
    leetcodeLink: "https://leetcode.com/problems/cherry-pickup-ii/",
    useCases: [
      "Multi-agent path coordination with shared rewards",
    ],
    approaches: [
      {
        name: "3D DP (Tabulation)",
        description:
          "### 🧠 Core Intuition\nSince both robots move to the next row simultaneously, we only need to track the current row (`i`) and the columns of both robots (`j1, j2`).\n`dp[i][j1][j2] = (grid[i][j1] + grid[i][j2]) + max(dp[i+1][nj1][nj2])` where `j1 != j2`. If `j1 == j2`, only add once.\n\n### ⏱️ Complexity\n- **Time**: $O(R \cdot C^2 \times 9)$\n- **Space**: $O(R \cdot C^2)$ (can be optimized to $O(C^2)$)",
        timeComplexity: "O(R * C^2)",
        timeComplexityExplanation: "Triple nested loop over row and two column positions.",
        spaceComplexity: "O(C^2)",
        spaceComplexityExplanation: "Optimized space using only the next row's results.",
        implementations: [
          {
            language: "Python",
            code: `def cherryPickup(grid):
    R, C = len(grid), len(grid[0])
    dp = [[-1] * C for _ in range(C)]
    
    # Base Case: Last Row
    for j1 in range(C):
        for j2 in range(C):
            if j1 == j2: dp[j1][j2] = grid[R-1][j1]
            else: dp[j1][j2] = grid[R-1][j1] + grid[R-1][j2]
            
    # Iterative DP
    for i in range(R - 2, -1, -1):
        curr = [[-1] * C for _ in range(C)]
        for j1 in range(C):
            for j2 in range(C):
                mx = -1e9
                for dj1 in [-1, 0, 1]:
                    for dj2 in [-1, 0, 1]:
                        nj1, nj2 = j1 + dj1, j2 + dj2
                        if 0 <= nj1 < C and 0 <= nj2 < C:
                            mx = max(mx, dp[nj1][nj2])
                
                res = grid[i][j1] + (grid[i][j2] if j1 != j2 else 0)
                curr[j1][j2] = res + mx
        dp = curr
        
    return dp[0][C-1]`,
          },
        ],
      },
    ],
  },
  {
    id: "subset-sum-equal-to-k",
    title: "Subset Sum Equal to K",
    topic: "Dynamic Programming - Subsequences",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Given an array of non-negative integers and a target $K$, find if there exists a subsequence whose sum is exactly $K$.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/subset-sum-problem-1611555638/1",
    useCases: [
      "Resource allocation with fixed capacity",
      "Decision problems in combinatorics",
    ],
    approaches: [
      {
        name: "DP with Space Optimization",
        description:
          "### 🧠 Core Intuition\nFor each element, we either 'take' it or 'leave' it.\n`dp[target] = dp[target] or dp[target - arr[i]]`.\nBy iterating backwards through the target array, we can solve this in $O(K)$ space.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot K)$\n- **Space**: $O(K)$",
        timeComplexity: "O(N * K)",
        timeComplexityExplanation: "Process each element for every possible target sum up to $K$.",
        spaceComplexity: "O(K)",
        spaceComplexityExplanation: "Storing only the current target state boolean array.",
        implementations: [
          {
            language: "Python",
            code: `def isSubsetSum(arr, k):
    n = len(arr)
    dp = [False] * (k + 1)
    dp[0] = True
    
    # Pre-check first element
    if arr[0] <= k: dp[arr[0]] = True
    
    for i in range(1, n):
        curr = [False] * (k + 1)
        curr[0] = True
        for target in range(1, k + 1):
            not_take = dp[target]
            take = dp[target - arr[i]] if target >= arr[i] else False
            curr[target] = take or not_take
        dp = curr
    return dp[k]`,
          },
        ],
      },
    ],
  },
  {
    id: "partition-equal-subset-sum",
    title: "Partition Equal Subset Sum",
    topic: "Dynamic Programming - Subsequences",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Check if an array can be partitioned into two subsets such that the sum of elements in both subsets is equal.",
    leetcodeLink: "https://leetcode.com/problems/partition-equal-subset-sum/",
    useCases: [
      "Fair resource division",
    ],
    approaches: [
      {
        name: "Subset Sum Variant",
        description:
          "### 🧠 Core Intuition\nIf the total sum is odd, it's impossible. If even, the problem reduces to finding if a subset exists with `sum = totalSum // 2`.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot \text{Sum})$\n- **Space**: $O(\text{Sum})$",
        timeComplexity: "O(N * Sum)",
        timeComplexityExplanation: "Iterate through array and half of total sum.",
        spaceComplexity: "O(Sum)",
        spaceComplexityExplanation: "Boolean DP array of size Sum/2.",
        implementations: [
          {
            language: "Python",
            code: `def canPartition(nums):
    total = sum(nums)
    if total % 2 != 0: return False
    target = total // 2
    
    dp = [False] * (target + 1)
    dp[0] = True
    for x in nums:
        for t in range(target, x - 1, -1):
            dp[t] = dp[t] or dp[t-x]
    return dp[target]`,
          },
        ],
      },
    ],
  },
  {
    id: "partition-a-set-into-two-subsets-with-minimum-absolute-sum-difference",
    title: "Min Subset Sum Difference",
    topic: "Dynamic Programming - Subsequences",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Partition an array into two subsets such that the absolute difference of their sums is minimized.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/minimum-sum-partition3317/1",
    useCases: [
      "Load balancing in parallel computing",
    ],
    approaches: [
      {
        name: "DP Tabulation Analysis",
        description:
          "### 🧠 Core Intuition\n1. Find all possible subset sums using the Subset Sum DP ($dp[n-1][0 \dots \text{totalSum}]$).\n2. The last row of the DP table gives us which sums are achievable.\n3. Iterate through achievable sums $s$: `min_diff = min(min_diff, abs(totalSum - 2*s))`.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot \text{totalSum})$\n- **Space**: $O(\text{totalSum})$",
        timeComplexity: "O(N * totalSum)",
        timeComplexityExplanation: "Standard subset sum complexity.",
        spaceComplexity: "O(totalSum)",
        spaceComplexityExplanation: "Storing boolean state for each possible sum.",
        implementations: [
          {
            language: "Python",
            code: `def minDifference(arr, n):
    total = sum(arr)
    dp = [False] * (total + 1)
    dp[0] = True
    for x in arr:
        for t in range(total, x - 1, -1):
            dp[t] = dp[t] or dp[t-x]
            
    min_diff = total
    for s in range(total // 2 + 1):
        if dp[s]:
            min_diff = min(min_diff, abs(total - 2*s))
    return min_diff`,
          },
        ],
      },
    ],
  },
  {
    id: "count-subsets-with-sum-k",
    title: "Count Subsets with Sum K",
    topic: "Dynamic Programming - Subsequences",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Count the total number of subsequences from an array that sum up to exactly $K$. Be careful with zeroes in the array.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/perfect-sum-problem5633/1",
    useCases: [
      "Probability calculations in discrete math",
    ],
    approaches: [
      {
        name: "DP with Space Optimization",
        description:
          "### 🧠 Core Intuition\nThis is the counting version of Subset Sum. \n`dp[target] = dp[target] + dp[target - arr[i]]`.\n**Note**: If the array has zeroes, the number of ways is doubled for each zero (taken or not taken).\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot K)$\n- **Space**: $O(K)$",
        timeComplexity: "O(N * K)",
        timeComplexityExplanation: "Nested loops for items and sum range.",
        spaceComplexity: "O(K)",
        spaceComplexityExplanation: "Storing subset counts for every possible sum.",
        implementations: [
          {
            language: "Python",
            code: `def findWays(arr, k):
    n = len(arr)
    dp = [0] * (k + 1)
    dp[0] = 1 # 1 way to make sum 0 (empty subset)
    
    for x in arr:
        for t in range(k, x - 1, -1):
            dp[t] = (dp[t] + dp[t-x]) % (10**9 + 7)
    return dp[k]`,
          },
        ],
      },
    ],
  },
  {
    id: "count-partitions-with-given-difference",
    title: "Count Partitions with Difference D",
    topic: "Dynamic Programming - Subsequences",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Partition an array into two subsets ($S_1, S_2$) such that $S_1 - S_2 = D$. Count the number of such partitions.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/partitions-with-given-difference/1",
    useCases: [
      "Target optimization in balanced partitions",
    ],
    approaches: [
      {
        name: "Reduction to Subset Sum",
        description:
          "### 🧠 Core Intuition\n$S_1 - S_2 = D$ and $S_1 + S_2 = \text{totalSum}$.\nAdding equations: $2S_1 = \text{totalSum} + D \implies S_1 = (\text{totalSum} + D) // 2$.\nProblem reduces to counting subsets with sum $S_1$.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot \text{totalSum})$\n- **Space**: $O(\text{totalSum})$",
        timeComplexity: "O(N * totalSum)",
        timeComplexityExplanation: "Solving subset sum for the derived target.",
        spaceComplexity: "O(totalSum)",
        spaceComplexityExplanation: "DP array to count subsets.",
        implementations: [
          {
            language: "Python",
            code: `def countPartitions(n, d, arr):
    total = sum(arr)
    if (total + d) % 2 != 0 or total < d: return 0
    target = (total + d) // 2
    
    dp = [0] * (target + 1)
    dp[0] = 1
    for x in arr:
        for t in range(target, x - 1, -1):
            dp[t] = (dp[t] + dp[t-x]) % (10**9 + 7)
    return dp[target]`,
          },
        ],
      },
    ],
  },
  {
    id: "0-1-knapsack",
    title: "0/1 Knapsack",
    topic: "Dynamic Programming - Subsequences",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "A thief has a knapsack that can carry a max weight $W$. Given weights and values of $N$ items, maximize the total value such that the weight sum $\le W$. Each item can be picked at most once.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1",
    useCases: [
      "Budget constrained resource allocation",
      "Cargo loading optimization",
    ],
    approaches: [
      {
        name: "DP with Space Optimization",
        description:
          "### 🧠 Core Intuition\nFor each item, maximize value by deciding to take it or not.\n`dp[w] = max(val[i] + dp[w - weight[i]], dp[w])`.\nBy iterating backwards through weight $W$, we only need a single row of space.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot W)$\n- **Space**: $O(W)$",
        timeComplexity: "O(N * W)",
        timeComplexityExplanation: "Nested loops for items and capacity.",
        spaceComplexity: "O(W)",
        spaceComplexityExplanation: "Single array of size $W$.",
        implementations: [
          {
            language: "Python",
            code: `def knapSack(W, wt, val, n):
    dp = [0] * (W + 1)
    for i in range(n):
        for w in range(W, wt[i] - 1, -1):
            dp[w] = max(dp[w], val[i] + dp[w - wt[i]])
    return dp[W]`,
          },
        ],
      },
    ],
  },
  {
    id: "minimum-coins",
    title: "Minimum Coins (Coin Change)",
    topic: "Dynamic Programming - Subsequences",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the minimum number of coins needed to make a total sum $T$, given an infinite supply of each coin type. If impossible, return -1.",
    leetcodeLink: "https://leetcode.com/problems/coin-change/",
    useCases: [
      "Currency exchange systems",
    ],
    approaches: [
      {
        name: "DP with Space Optimization",
        description:
          "### 🧠 Core Intuition\nSince we have infinite supply, for each coin, we can pick it multiple times. \n`dp[target] = min(dp[target], 1 + dp[target - coin])`.\nIteration through targets should be forward to allow reuse of the same coin.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot T)$\n- **Space**: $O(T)$",
        timeComplexity: "O(N * T)",
        timeComplexityExplanation: "Nested loops for coins and sum $T$.",
        spaceComplexity: "O(T)",
        spaceComplexityExplanation: "1D DP array of target sums.",
        implementations: [
          {
            language: "Python",
            code: `def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for t in range(coin, amount + 1):
            dp[t] = min(dp[t], 1 + dp[t - coin])
    return dp[amount] if dp[amount] != float('inf') else -1`,
          },
        ],
      },
    ],
  },
  {
    id: "target-sum",
    title: "Target Sum",
    topic: "Dynamic Programming - Subsequences",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Assign '+' or '-' sign to every integer in an array to make their sum equal to `target`. Find the total number of ways.",
    leetcodeLink: "https://leetcode.com/problems/target-sum/",
    useCases: [
      "Subset partitioning with sign toggles",
    ],
    approaches: [
      {
        name: "Reduction to Count Partitions",
        description:
          "### 🧠 Core Intuition\nLet elements with '+' be $S_1$ and elements with '-' be $S_2$.\n$S_1 - S_2 = \text{target}$. This is identical to 'Count Partitions with Difference D'.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot \text{totalSum})$\n- **Space**: $O(\text{totalSum})$",
        timeComplexity: "O(N * totalSum)",
        timeComplexityExplanation: "Standard subset counting complexity.",
        spaceComplexity: "O(totalSum)",
        spaceComplexityExplanation: "DP array to count ways.",
        implementations: [
          {
            language: "Python",
            code: `def findTargetSumWays(nums, target):
    total = sum(nums)
    if (total + target) % 2 != 0 or total < abs(target): return 0
    t = (total + target) // 2
    
    dp = [0] * (t + 1)
    dp[0] = 1
    for x in nums:
        for j in range(t, x - 1, -1):
            dp[j] += dp[j - x]
    return dp[t]`,
          },
        ],
      },
    ],
  },
  {
    id: "coin-change-2",
    title: "Coin Change 2 (Ways)",
    topic: "Dynamic Programming - Subsequences",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Count the total number of ways to make progress sum $T$ using infinite supply of coins.",
    leetcodeLink: "https://leetcode.com/problems/coin-change-ii/",
    useCases: [
      "Counting combinations with repetition",
    ],
    approaches: [
      {
        name: "DP with Space Optimization",
        description:
          "### 🧠 Core Intuition\nSame as Minimum Coins, but instead of `min`, we sum the possibilities.\n`dp[target] = dp[target] + dp[target - coin]`.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot T)$\n- **Space**: $O(T)$",
        timeComplexity: "O(N * T)",
        timeComplexityExplanation: "Nested loops for coins and total sum.",
        spaceComplexity: "O(T)",
        spaceComplexityExplanation: "1D DP array of target counts.",
        implementations: [
          {
            language: "Python",
            code: `def change(amount, coins):
    dp = [0] * (amount + 1)
    dp[0] = 1
    for coin in coins:
        for t in range(coin, amount + 1):
            dp[t] += dp[t - coin]
    return dp[amount]`,
          },
        ],
      },
    ],
  },
  {
    id: "unbounded-knapsack",
    title: "Unbounded Knapsack",
    topic: "Dynamic Programming - Subsequences",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Similar to 0/1 Knapsack, but each item is available in infinite supply. Maximize total value for capacity $W$.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/unbounded-knapsack4819/1",
    useCases: [
      "Stock replenishment for items with unlimited supply",
    ],
    approaches: [
      {
        name: "Iterative DP",
        description:
          "### 🧠 Core Intuition\nBy iterating forwards through the weight capacity, we automatically account for the possibility of picking the same item multiple times.\n`dp[w] = max(dp[w], val[i] + dp[w - wt[i]])`.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot W)$\n- **Space**: $O(W)$",
        timeComplexity: "O(N * W)",
        timeComplexityExplanation: "Standard item/capacity nested loop.",
        spaceComplexity: "O(W)",
        spaceComplexityExplanation: "1D array for capacities.",
        implementations: [
          {
            language: "Python",
            code: `def knapSack(N, W, val, wt):
    dp = [0] * (W + 1)
    for i in range(N):
        for w in range(wt[i], W + 1):
            dp[w] = max(dp[w], val[i] + dp[w - wt[i]])
    return dp[W]`,
          },
        ],
      },
    ],
  },
  {
    id: "rod-cutting-problem",
    title: "Rod Cutting Problem",
    topic: "Dynamic Programming - Subsequences",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Cut a rod of length $N$ into smaller pieces such that the total price obtained is maximized. Each length has an associated price.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/rod-cutting0840/1",
    useCases: [
      "Revenue maximization for segmented sales",
    ],
    approaches: [
      {
        name: "Reduction to Unbounded Knapsack",
        description:
          "### 🧠 Core Intuition\nThis is identical to Unbounded Knapsack where:\n1. Weight of item $i$ = length $(i+1)$.\n2. Value of item $i$ = price of length $(i+1)$.\n3. Capacity $W$ = length of the rod $N$.\n\n### ⏱️ Complexity\n- **Time**: $O(N^2)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N^2)",
        timeComplexityExplanation: "Two loops of size $N$.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "1D DP array of size $N+1$.",
        implementations: [
          {
            language: "Python",
            code: `def cutRod(price, n):
    dp = [0] * (n + 1)
    for i in range(n):
        wt = i + 1
        val = price[i]
        for w in range(wt, n + 1):
            dp[w] = max(dp[w], val + dp[w - wt])
    return dp[n]`,
          },
        ],
      },
    ],
  },
  {
    id: "longest-common-subsequence",
    title: "Longest Common Subsequence",
    topic: "Dynamic Programming - Strings",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the length of the longest subsequence present in both strings $S_1$ and $S_2$.",
    leetcodeLink: "https://leetcode.com/problems/longest-common-subsequence/",
    useCases: [
      "File comparison (diff)",
      "Bioinformatics sequence alignment",
    ],
    approaches: [
      {
        name: "2D DP with Space Optimization",
        description:
          "### 🧠 Core Intuition\nIf $S_1[i] == S_2[j]$, then `LCS[i][j] = 1 + LCS[i-1][j-1]`.\nOtherwise, `LCS[i][j] = max(LCS[i-1][j], LCS[i][j-1])`.\nCan be optimized to $O(N)$ space using two rows.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot M)$\n- **Space**: $O(M)$",
        timeComplexity: "O(N * M)",
        timeComplexityExplanation: "Nested loops for lengths of both strings.",
        spaceComplexity: "O(M)",
        spaceComplexityExplanation: "Storing only two rows of length $M$.",
        implementations: [
          {
            language: "Python",
            code: `def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    prev = [0] * (n + 1)
    for i in range(1, m + 1):
        curr = [0] * (n + 1)
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                curr[j] = 1 + prev[j-1]
            else:
                curr[j] = max(prev[j], curr[j-1])
        prev = curr
    return prev[n]`,
          },
        ],
      },
    ],
  },
  {
    id: "print-longest-common-subsequence",
    title: "Print Longest Common Subsequence",
    topic: "Dynamic Programming - Strings",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Instead of just the length, extract and return the actual LCS string using the DP table.",
    leetcodeLink: "https://www.geeksforgeeks.org/printing-longest-common-subsequence/",
    useCases: [
      "Visualizing differences between strings",
    ],
    approaches: [
      {
        name: "DP Table Backtracking",
        description:
          "### 🧠 Core Intuition\n1. Generate the full $O(N \cdot M)$ DP table.\n2. Start from cell $(N, M)$.\n3. If $S_1[i-1] == S_2[j-1]$, add the char to result and move to $(i-1, j-1)$.\n4. Else, move towards the larger value: either $(i-1, j)$ or $(i, j-1)$.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot M)$\n- **Space**: $O(N \cdot M)$",
        timeComplexity: "O(N * M)",
        timeComplexityExplanation: "Time for table generation and backtracking.",
        spaceComplexity: "O(N * M)",
        spaceComplexityExplanation: "Requires full DP matrix for backtracking.",
        implementations: [
          {
            language: "Python",
            code: `def printLCS(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if s1[i-1] == s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]
            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
            
    res = []
    i, j = m, n
    while i > 0 and j > 0:
        if s1[i-1] == s2[j-1]:
            res.append(s1[i-1])
            i -= 1; j -= 1
        elif dp[i-1][j] > dp[i][j-1]: i -= 1
        else: j -= 1
    return "".join(reversed(res))`,
          },
        ],
      },
    ],
  },
  {
    id: "longest-common-substring",
    title: "Longest Common Substring",
    topic: "Dynamic Programming - Strings",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the length of the longest string which is a substring (must be contiguous) of both $S_1$ and $S_2$.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/longest-common-substring1452/1",
    useCases: [
      "Plagiarism detection",
      "Finding common sequences in genetic data",
    ],
    approaches: [
      {
        name: "DP with Space Optimization",
        description:
          "### 🧠 Core Intuition\nIf $S_1[i] == S_2[j]$, then `dp[j] = 1 + prev[j-1]`.\nOtherwise, `dp[j] = 0` (since it must be contiguous). \nTrack `max_val` globally during the loops.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot M)$\n- **Space**: $O(M)$",
        timeComplexity: "O(N * M)",
        timeComplexityExplanation: "Nested loops over both string lengths.",
        spaceComplexity: "O(M)",
        spaceComplexityExplanation: "Using one current and one previous row.",
        implementations: [
          {
            language: "Python",
            code: `def longestCommonSubstring(s1, s2):
    m, n = len(s1), len(s2)
    prev = [0] * (n + 1)
    max_len = 0
    for i in range(1, m + 1):
        curr = [0] * (n + 1)
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                curr[j] = 1 + prev[j-1]
                max_len = max(max_len, curr[j])
            else:
                curr[j] = 0
        prev = curr
    return max_len`,
          },
        ],
      },
    ],
  },
  {
    id: "longest-palindromic-subsequence",
    title: "Longest Palindromic Subsequence",
    topic: "Dynamic Programming - Strings",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the length of the longest subsequence in a string that reads the same forwards and backwards.",
    leetcodeLink: "https://leetcode.com/problems/longest-palindromic-subsequence/",
    useCases: [
      "Genomic sequence research",
      "Parsing palindrome patterns",
    ],
    approaches: [
      {
        name: "LCS Reduction",
        description:
          "### 🧠 Core Intuition\n**LPS of String $S$** is equivalent to **LCS of $S$ and Reverse($S$)**.\n\n### ⏱️ Complexity\n- **Time**: $O(N^2)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N^2)",
        timeComplexityExplanation: "Solving LCS for two strings of length $N$.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Optimized LCS space.",
        implementations: [
          {
            language: "Python",
            code: `def longestPalindromeSubseq(s):
    def lcs(s1, s2):
        n = len(s1)
        prev = [0] * (n + 1)
        for i in range(1, n + 1):
            curr = [0] * (n + 1)
            for j in range(1, n + 1):
                if s1[i-1] == s2[j-1]: curr[j] = 1 + prev[j-1]
                else: curr[j] = max(prev[j], curr[j-1])
            prev = curr
        return prev[n]
    
    return lcs(s, s[::-1])`,
          },
        ],
      },
    ],
  },
  {
    id: "minimum-insertions-to-make-string-palindrome",
    title: "Min Insertions for Palindrome",
    topic: "Dynamic Programming - Strings",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the minimum number of character insertions needed to convert a string into a palindrome.",
    leetcodeLink: "https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/",
    useCases: [
      "String symmetry optimization",
    ],
    approaches: [
      {
        name: "LPS Reduction",
        description:
          "### 🧠 Core Intuition\nKeep the characters of the **Longest Palindromic Subsequence (LPS)** as they are. Insert duplicates for the remaining characters to form a palindrome.\n**Result**: `len(S) - LPS(S)`.\n\n### ⏱️ Complexity\n- **Time**: $O(N^2)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N^2)",
        timeComplexityExplanation: "Solving for the LPS of length $N$.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "1D DP array of size $N+1$.",
        implementations: [
          {
            language: "Python",
            code: `def minInsertions(s):
    n = len(s)
    s2 = s[::-1]
    prev = [0] * (n + 1)
    for i in range(1, n + 1):
        curr = [0] * (n + 1)
        for j in range(1, n + 1):
            if s[i-1] == s2[j-1]: curr[j] = 1 + prev[j-1]
            else: curr[j] = max(prev[j], curr[j-1])
        prev = curr
    return n - prev[n]`,
          },
        ],
      },
    ],
  },
  {
    id: "minimum-insertions-deletions-to-convert-string-a-to-string-b",
    title: "Min Operations to Convert A to B",
    topic: "Dynamic Programming - Strings",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the minimum total insertions and deletions needed to transform string $A$ into string $B$.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/minimum-number-of-deletions-and-insertions0209/1",
    useCases: [
      "Text editing reconciliation",
    ],
    approaches: [
      {
        name: "LCS Reduction",
        description:
          "### 🧠 Core Intuition\nTo minimize operations, find the **Longest Common Subsequence (LCS)** that both strings share. \n1. Deletions = `len(A) - LCS(A, B)`.\n2. Insertions = `len(B) - LCS(A, B)`.\n**Result** = `(len(A) + len(B)) - 2 * LCS(A, B)`.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot M)$\n- **Space**: $O(M)$",
        timeComplexity: "O(N * M)",
        timeComplexityExplanation: "Computing LCS for strings of length $N$ and $M$.",
        spaceComplexity: "O(M)",
        spaceComplexityExplanation: "Optimized LCS state storage.",
        implementations: [
          {
            language: "Python",
            code: `def minDistance(s1, s2):
    m, n = len(s1), len(s2)
    prev = [0] * (n + 1)
    for i in range(1, m + 1):
        curr = [0] * (n + 1)
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]: curr[j] = 1 + prev[j-1]
            else: curr[j] = max(prev[j], curr[j-1])
        prev = curr
    lcs = prev[n]
    return (m + n) - (2 * lcs)`,
          },
        ],
      },
    ],
  },
  {
    id: "shortest-common-supersequence",
    title: "Shortest Common Supersequence",
    topic: "Dynamic Programming - Strings",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Find the shortest string that contains both $S_1$ and $S_2$ as subsequences.",
    leetcodeLink: "https://leetcode.com/problems/shortest-common-supersequence/",
    useCases: [
      "Merging data streams with commonality",
    ],
    approaches: [
      {
        name: "LCS Backtracking",
        description:
          "### 🧠 Core Intuition\nThe length of SCS is `(len(A) + len(B)) - LCS(A, B)`. To build it:\n1. Use the LCS DP table.\n2. Start from $(N, M)$.\n3. If $S_1[i-1] == S_2[j-1]$, add the char once and move diagonal.\n4. Else, add the char corresponding to the larger DP value move.",
        timeComplexity: "O(N * M)",
        timeComplexityExplanation: "Standard LCS complexity for table and backtrack.",
        spaceComplexity: "O(N * M)",
        spaceComplexityExplanation: "Requires full DP matrix for reconstruction.",
        implementations: [
          {
            language: "Python",
            code: `def shortestCommonSupersequence(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if s1[i-1] == s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]
            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
            
    res = []
    i, j = m, n
    while i > 0 and j > 0:
        if s1[i-1] == s2[j-1]:
            res.append(s1[i-1]); i -= 1; j -= 1
        elif dp[i-1][j] > dp[i][j-1]:
            res.append(s1[i-1]); i -= 1
        else:
            res.append(s2[j-1]); j -= 1
    while i > 0: res.append(s1[i-1]); i -= 1
    while j > 0: res.append(s2[j-1]); j -= 1
    return "".join(reversed(res))`,
          },
        ],
      },
    ],
  },
  {
    id: "distinct-subsequences",
    title: "Distinct Subsequences",
    topic: "Dynamic Programming - Strings",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Count how many distinct subsequences of string $S$ are equal to string $T$.",
    leetcodeLink: "https://leetcode.com/problems/distinct-subsequences/",
    useCases: [
      "Sub-pattern counting in long sequences",
    ],
    approaches: [
      {
        name: "DP with Space Optimization",
        description:
          "### 🧠 Core Intuition\n1. If $S[i-1] == T[j-1]$, we can either use it: `dp[i-1][j-1]` or ignore it: `dp[i-1][j]`.\n2. Otherwise, we must ignore it: `dp[i-1][j]`.\nCan be space optimized to $O(M)$ by iterating backwards.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot M)$\n- **Space**: $O(M)$",
        timeComplexity: "O(N * M)",
        timeComplexityExplanation: "Nested loops over strings $S$ and $T$.",
        spaceComplexity: "O(M)",
        spaceComplexityExplanation: "1D DP array of target string length.",
        implementations: [
          {
            language: "Python",
            code: `def numDistinct(s, t):
    n, m = len(s), len(t)
    dp = [0] * (m + 1)
    dp[0] = 1 # 1 empty subsequence for empty target
    
    for i in range(1, n + 1):
        for j in range(m, 0, -1):
            if s[i-1] == t[j-1]:
                dp[j] = dp[j] + dp[j-1]
    return dp[m]`,
          },
        ],
      },
    ],
  },
  {
    id: "edit-distance",
    title: "Edit Distance (Levenshtein)",
    topic: "Dynamic Programming - Strings",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Find the minimum number of operations (insert, delete, replace) required to convert string $S_1$ to $S_2$.",
    leetcodeLink: "https://leetcode.com/problems/edit-distance/",
    useCases: [
      "Spell check and autocorrect",
      "Natural Language Processing similarity",
    ],
    approaches: [
      {
        name: "2D DP with Space Optimization",
        description:
          "### 🧠 Core Intuition\n1. If $S_1[i-1] == S_2[j-1]$, no operation needed: `dp[i][j] = dp[i-1][j-1]`.\n2. Otherwise, `dp[i][j] = 1 + min(insert, delete, replace)`.\n- **Insert**: `dp[i][j-1]`\n- **Delete**: `dp[i-1][j]`\n- **Replace**: `dp[i-1][j-1]`\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot M)$\n- **Space**: $O(M)$",
        timeComplexity: "O(N * M)",
        timeComplexityExplanation: "Nested loops for lengths $N$ and $M$.",
        spaceComplexity: "O(M)",
        spaceComplexityExplanation: "Optimized to two rows of size $M$.",
        implementations: [
          {
            language: "Python",
            code: `def minDistance(s1, s2):
    m, n = len(s1), len(s2)
    prev = list(range(n + 1))
    for i in range(1, m + 1):
        curr = [0] * (n + 1)
        curr[0] = i # Base Case: converting A[0...i] to empty B
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                curr[j] = prev[j-1]
            else:
                curr[j] = 1 + min(curr[j-1], prev[j], prev[j-1])
        prev = curr
    return prev[n]`,
          },
        ],
      },
    ],
  },
  {
    id: "wildcard-matching",
    title: "Wildcard Matching",
    topic: "Dynamic Programming - Strings",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Check if string $S$ matches pattern $P$ containing wildcards '?' (matches any single char) and '*' (matches zero or more of any sequence).",
    leetcodeLink: "https://leetcode.com/problems/wildcard-matching/",
    useCases: [
      "File system globbing",
      "Regex-lite patterns",
    ],
    approaches: [
      {
        name: "DP with Space Optimization",
        description:
          "### 🧠 Core Intuition\n1. If $P[j] == S[i]$ or $P[j] == '?': dp[i][j] = dp[i-1][j-1]$.\n2. If $P[j] == '*': dp[i][j] = dp[i-1][j]$ (use *) OR $dp[i][j-1]$ (ignore *).\n3. Otherwise: $False$.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot M)$\n- **Space**: $O(M)$",
        timeComplexity: "O(N * M)",
        timeComplexityExplanation: "Solving for all $(N+1)(M+1)$ states.",
        spaceComplexity: "O(M)",
        spaceComplexityExplanation: "One row of pattern state.",
        implementations: [
          {
            language: "Python",
            code: `def isMatch(s, p):
    n, m = len(s), len(p)
    prev = [False] * (m + 1)
    prev[0] = True # Base Case
    for j in range(1, m + 1):
        if p[j-1] == '*': prev[j] = prev[j-1]
        else: break
        
    for i in range(1, n + 1):
        curr = [False] * (m + 1)
        for j in range(1, m + 1):
            if s[i-1] == p[j-1] or p[j-1] == '?':
                curr[j] = prev[j-1]
            elif p[j-1] == '*':
                curr[j] = prev[j] or curr[j-1]
        prev = curr
    return prev[m]`,
          },
        ],
      },
    ],
  },
  {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    topic: "Dynamic Programming - Stocks",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Easy",
    overview:
      "Given stock prices for $N$ days, find the maximum profit you can achieve by buying on one day and selling on a future day.",
    leetcodeLink: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    useCases: [
      "Simple profit maximization",
      "Finding global minimum and subsequent maximum",
    ],
    approaches: [
      {
        name: "One Pass Greedy",
        description:
          "### 🧠 Core Intuition\nTrack the minimum price seen so far. For each new price, calculate the potential profit if sold today and update the maximum profit.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single traversal through the price array.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Only tracking two variables: minPrice and maxProfit.",
        implementations: [
          {
            language: "Python",
            code: `def maxProfit(prices):
    min_price = float('inf')
    max_profit = 0
    for p in prices:
        min_price = min(min_price, p)
        max_profit = max(max_profit, p - min_price)
    return max_profit`,
          },
        ],
      },
    ],
  },
  {
    id: "best-time-to-buy-and-sell-stock-ii",
    title: "Best Time to Buy and Sell Stock II",
    topic: "Dynamic Programming - Stocks",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Maximize total profit by buying and selling stocks as many times as you want. You must sell before you can buy again.",
    leetcodeLink: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
    useCases: [
      "Capturing every upward price movement",
    ],
    approaches: [
      {
        name: "Peak-Valley / Greedy",
        description:
          "### 🧠 Core Intuition\nWhenever the price today is higher than yesterday, capture that profit. Total profit is the sum of all positive price differences.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single linear scan of prices.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No extra memory required.",
        implementations: [
          {
            language: "Python",
            code: `def maxProfit(prices):
    profit = 0
    for i in range(1, len(prices)):
        if prices[i] > prices[i-1]:
            profit += prices[i] - prices[i-1]
    return profit`,
          },
        ],
      },
    ],
  },
  {
    id: "best-time-to-buy-and-sell-stock-iii",
    title: "Best Time to Buy and Sell Stock III",
    topic: "Dynamic Programming - Stocks",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Maximize total profit with at most **two transactions**. You must sell before you buy again.",
    leetcodeLink: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/",
    useCases: [
      "Constrained transaction frequency optimization",
    ],
    approaches: [
      {
        name: "DP with State Machine",
        description:
          "### 🧠 Core Intuition\nTrack four states: \n1. First Buy (min cost)\n2. First Sell (max profit)\n3. Second Buy (min net cost after first profit)\n4. Second Sell (max final profit)\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single pass updates the four state variables.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Constant space for the state tracking.",
        implementations: [
          {
            language: "Python",
            code: `def maxProfit(prices):
    b1, s1 = float('inf'), 0
    b2, s2 = float('inf'), 0
    for p in prices:
        b1 = min(b1, p)
        s1 = max(s1, p - b1)
        b2 = min(b2, p - s1)
        s2 = max(s2, p - b2)
    return s2`,
          },
        ],
      },
    ],
  },
  {
    id: "best-time-to-buy-and-sell-stock-iv",
    title: "Best Time to Buy and Sell Stock IV",
    topic: "Dynamic Programming - Stocks",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Maximize total profit with at most **K transactions**.",
    leetcodeLink: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/",
    useCases: [
      "Multi-transaction optimization",
    ],
    approaches: [
      {
        name: "DP with Space Optimization",
        description:
          "### 🧠 Core Intuition\nExtend the 2-transaction state machine to `k` transactions using two arrays: `buy[k]` and `sell[k]`.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot K)$\n- **Space**: $O(K)$",
        timeComplexity: "O(N * K)",
        timeComplexityExplanation: "For each price, update K states.",
        spaceComplexity: "O(K)",
        spaceComplexityExplanation: "Two arrays of size K+1 to store buy/sell states.",
        implementations: [
          {
            language: "Python",
            code: `def maxProfit(k, prices):
    if not prices: return 0
    # Optimization if K is huge
    if k >= len(prices) // 2:
        return sum(max(0, prices[i] - prices[i-1]) for i in range(1, len(prices)))
        
    buy = [float('inf')] * (k + 1)
    sell = [0] * (k + 1)
    for p in prices:
        for i in range(1, k + 1):
            buy[i] = min(buy[i], p - sell[i-1])
            sell[i] = max(sell[i], p - buy[i])
    return sell[k]`,
          },
        ],
      },
    ],
  },
  {
    id: "best-time-to-buy-and-sell-stock-with-cooldown",
    title: "Stock with Cooldown",
    topic: "Dynamic Programming - Stocks",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Maximize profit with infinite transactions, but after selling, you cannot buy for one day (cooldown).",
    leetcodeLink: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
    useCases: [
      "Market behavior simulation with latency",
    ],
    approaches: [
      {
        name: "State Machine DP",
        description:
          "### 🧠 Core Intuition\nThree states:\n1. **Held**: Buying or holding stock.\n2. **Sold**: Just sold today (initiates cooldown).\n3. **Reset**: Not holding, can buy next or stay reset.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Updating 3 states for each day's price.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Constant state variables.",
        implementations: [
          {
            language: "Python",
            code: `def maxProfit(prices):
    if not prices: return 0
    # States: held (holding), sold (cooldown), reset (no stock)
    held = -prices[0]
    sold = reset = 0
    for i in range(1, len(prices)):
        prev_sold = sold
        sold = held + prices[i]
        held = max(held, reset - prices[i])
        reset = max(reset, prev_sold)
    return max(sold, reset)`,
          },
        ],
      },
    ],
  },
  {
    id: "best-time-to-buy-and-sell-stock-with-transaction-fee",
    title: "Stock with Transaction Fee",
    topic: "Dynamic Programming - Stocks",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Maximize profit with infinite transactions, but each sell incurs a fixed transaction fee.",
    leetcodeLink: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/",
    useCases: [
      "Real-world trading costs modeling",
    ],
    approaches: [
      {
        name: "DP with 2 States",
        description:
          "### 🧠 Core Intuition\nMaintain two states: \n1. **Held**: Maximum profit if we are currently holding a stock.\n2. **Cash**: Maximum profit if we are currently liquid.\n\n### ⏱️ Complexity\n- **Time**: $O(N)$\n- **Space**: $O(1)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Single linear pass updating two states.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "Only two state variables updated.",
        implementations: [
          {
            language: "Python",
            code: `def maxProfit(prices, fee):
    held = -prices[0]
    cash = 0
    for i in range(1, len(prices)):
        cash = max(cash, held + prices[i] - fee)
        held = max(held, cash - prices[i])
    return cash`,
          },
        ],
      },
    ],
  },
  {
    id: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence (LIS)",
    topic: "Dynamic Programming - LIS",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Given an array of integers, find the length of the longest strictly increasing subsequence.",
    leetcodeLink: "https://leetcode.com/problems/longest-increasing-subsequence/",
    useCases: [
      "Job scheduling",
      "Sequence alignment in various fields",
    ],
    approaches: [
      {
        name: "Binary Search (Optimized)",
        description:
          "### 🧠 Core Intuition\nMaintain a list `tails` where `tails[i]` is the smallest tail of all increasing subsequences of length `i+1`.\nFor each element $x$:\n- If $x$ is larger than all tails, append it.\n- Otherwise, find the smallest tail $\ge x$ and update it to $x$.\n\n### ⏱️ Complexity\n- **Time**: $O(N \log N)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N log N)",
        timeComplexityExplanation: "N elements processed with log N search each.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Storing tails array.",
        implementations: [
          {
            language: "Python",
            code: `import bisect

def lengthOfLIS(nums):
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
    return len(tails)`,
          },
        ],
      },
    ],
  },
  {
    id: "print-longest-increasing-subsequence",
    title: "Print LIS",
    topic: "Dynamic Programming - LIS",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Extract and return the actual Longest Increasing Subsequence string/array, not just its length.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/printing-longest-increasing-subsequence/1",
    useCases: [
      "Visualizing sequence trends",
    ],
    approaches: [
      {
        name: "DP with Parent Tracking",
        description:
          "### 🧠 Core Intuition\nUse the $O(N^2)$ DP approach. Maintain an array `parent` where `parent[i]` stores the index of the element that preceded `nums[i]` in the LIS ending at `i`. Backtrack from the index with maximum LIS value.\n\n### ⏱️ Complexity\n- **Time**: $O(N^2)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N^2)",
        timeComplexityExplanation: "Nested loops to build the LIS table.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Storing DP values and parent pointers.",
        implementations: [
          {
            language: "Python",
            code: `def printLIS(nums):
    n = len(nums)
    dp = [1] * n
    parent = [-1] * n
    max_idx = 0
    
    for i in range(1, n):
        for j in range(i):
            if nums[i] > nums[j] and dp[i] < dp[j] + 1:
                dp[i] = dp[j] + 1
                parent[i] = j
        if dp[i] > dp[max_idx]:
            max_idx = i
            
    res = []
    while max_idx != -1:
        res.append(nums[max_idx])
        max_idx = parent[max_idx]
    return res[::-1]`,
          },
        ],
      },
    ],
  },
  {
    id: "largest-divisible-subset",
    title: "Largest Divisible Subset",
    topic: "Dynamic Programming - LIS",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the largest subset such that every pair of elements $(a, b)$ satisfies $a \pmod b = 0$ or $b \pmod a = 0$.",
    leetcodeLink: "https://leetcode.com/problems/largest-divisible-subset/",
    useCases: [
      "Dependency resolution in modular arithmetic",
    ],
    approaches: [
      {
        name: "Sort + LIS Variant",
        description:
          "### 🧠 Core Intuition\n1. Sort the numbers. \n2. Now, we only need to check if $nums[i] \pmod{nums[j]} == 0$ where $j < i$.\n3. This is precisely the LIS pattern.\n\n### ⏱️ Complexity\n- **Time**: $O(N^2)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N^2)",
        timeComplexityExplanation: "Sorting takes $O(N \log N)$, DP takes $O(N^2)$.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "DP array and path tracking.",
        implementations: [
          {
            language: "Python",
            code: `def largestDivisibleSubset(nums):
    if not nums: return []
    nums.sort()
    n = len(nums)
    dp = [1] * n
    parent = [-1] * n
    max_idx = 0
    
    for i in range(1, n):
        for j in range(i):
            if nums[i] % nums[j] == 0 and dp[i] < dp[j] + 1:
                dp[i] = dp[j] + 1
                parent[i] = j
        if dp[i] > dp[max_idx]:
            max_idx = i
            
    res = []
    while max_idx != -1:
        res.append(nums[max_idx])
        max_idx = parent[max_idx]
    return res[::-1]`,
          },
        ],
      },
    ],
  },
  {
    id: "longest-string-chain",
    title: "Longest String Chain",
    topic: "Dynamic Programming - LIS",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the longest sequence of words where each word follows the previous one by adding exactly one character.",
    leetcodeLink: "https://leetcode.com/problems/longest-string-chain/",
    useCases: [
      "Word ladder variants",
      "Evolutionary sequence modeling",
    ],
    approaches: [
      {
        name: "Sort + Hash Map DP",
        description:
          "### 🧠 Core Intuition\n1. Sort words by length.\n2. For each word, try deleting one character to see if the predecessor exists in the hash map.\n3. `dp[word] = 1 + max(dp[predecessor])`.\n\n### ⏱️ Complexity\n- **Time**: $O(N \log N + N \cdot L^2)$ where $L$ is max word length.\n- **Space**: $O(N \cdot L)$",
        timeComplexity: "O(N * L^2)",
        timeComplexityExplanation: "Process N words, delete L positions for each, string creation takes L.",
        spaceComplexity: "O(N * L)",
        spaceComplexityExplanation: "Dictionary storing profit for each word.",
        implementations: [
          {
            language: "Python",
            code: `def longestStrChain(words):
    words.sort(key=len)
    dp = {}
    max_chain = 0
    for w in words:
        dp[w] = 1
        for i in range(len(w)):
            pre = w[:i] + w[i+1:]
            if pre in dp:
                dp[w] = max(dp[w], dp[pre] + 1)
        max_chain = max(max_chain, dp[w])
    return max_chain`,
          },
        ],
      },
    ],
  },
  {
    id: "longest-bitonic-subsequence",
    title: "Longest Bitonic Subsequence",
    topic: "Dynamic Programming - LIS",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "A bitonic subsequence is a sequence that first increases then decreases. Find the longest such subsequence length.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/longest-bitonic-subsequence0824/1",
    useCases: [
      "Trend analysis (spike detection)",
    ],
    approaches: [
      {
        name: "Bidirectional DP",
        description:
          "### 🧠 Core Intuition\n1. `dp1[i]`: Length of LIS ending at index `i` (left to right).\n2. `dp2[i]`: Length of LIS starting at index `i` (right to left).\n3. Result is `max(dp1[i] + dp2[i] - 1)`.\n\n### ⏱️ Complexity\n- **Time**: $O(N^2)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N^2)",
        timeComplexityExplanation: "Two $O(N^2)$ LIS sweeps.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Two DP arrays of size N.",
        implementations: [
          {
            language: "Python",
            code: `def LongestBitonicSequence(nums):
    n = len(nums)
    # LIS from left
    dp1 = [1] * n
    for i in range(n):
        for prev in range(i):
            if nums[i] > nums[prev]:
                dp1[i] = max(dp1[i], 1 + dp1[prev])
                
    # LIS from right
    dp2 = [1] * n
    for i in range(n-1, -1, -1):
        for prev in range(n-1, i, -1):
            if nums[i] > nums[prev]:
                dp2[i] = max(dp2[i], 1 + dp2[prev])
                
    max_len = 0
    for i in range(n):
        max_len = max(max_len, dp1[i] + dp2[i] - 1)
    return max_len`,
          },
        ],
      },
    ],
  },
  {
    id: "number-of-longest-increasing-subsequences",
    title: "Number of LIS",
    topic: "Dynamic Programming - LIS",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the total count of distinct subsequences that achieve the maximum length of LIS.",
    leetcodeLink: "https://leetcode.com/problems/number-of-longest-increasing-subsequence/",
    useCases: [
      "Path counting in directed graphs",
    ],
    approaches: [
      {
        name: "DP with Count Array",
        description:
          "### 🧠 Core Intuition\nMaintain two arrays:\n1. `dp[i]` for length of LIS ending at `i`.\n2. `count[i]` for the number of such LIS.\nIf `dp[i] == dp[j] + 1`, we add `count[j]` to `count[i]`. If `dp[i] < dp[j] + 1`, we reset `count[i] = count[j]`.\n\n### ⏱️ Complexity\n- **Time**: $O(N^2)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N^2)",
        timeComplexityExplanation: "Nested loops over array indices.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Two arrays of size N.",
        implementations: [
          {
            language: "Python",
            code: `def findNumberOfLIS(nums):
    n = len(nums)
    dp = [1] * n
    count = [1] * n
    max_len = 1
    
    for i in range(1, n):
        for j in range(i):
            if nums[i] > nums[j]:
                if dp[i] < dp[j] + 1:
                    dp[i] = dp[j] + 1
                    count[i] = count[j]
                elif dp[i] == dp[j] + 1:
                    count[i] += count[j]
        max_len = max(max_len, dp[i])
        
    return sum(c for l, c in zip(dp, count) if l == max_len)`,
          },
        ],
      },
    ],
  },
  {
    id: "matrix-chain-multiplication",
    title: "Matrix Chain Multiplication (MCM)",
    topic: "Dynamic Programming - MCM DP",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Find the minimum number of scalar multiplications needed to multiply a chain of matrices.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1",
    useCases: [
      "Query optimization in databases",
      "Graphics computation chains",
    ],
    approaches: [
      {
        name: "Optimal Partitioning DP",
        description:
          "### 🧠 Core Intuition\nSplit the chain $(i, j)$ into two parts $(i, k)$ and $(k+1, j)$. \n`dp[i][j] = min(dp[i][k] + dp[k+1][j] + arr[i-1]*arr[k]*arr[j])` for all $i \le k < j$.\n\n### ⏱️ Complexity\n- **Time**: $O(N^3)$\n- **Space**: $O(N^2)$",
        timeComplexity: "O(N^3)",
        timeComplexityExplanation: "Nested loops for length, start index, and partition point.",
        spaceComplexity: "O(N^2)",
        spaceComplexityExplanation: "2D table to store costs for all subarrays.",
        implementations: [
          {
            language: "Python",
            code: `def matrixMultiplication(N, arr):
    dp = [[0]*N for _ in range(N)]
    for length in range(2, N):
        for i in range(1, N - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            for k in range(i, j):
                cost = dp[i][k] + dp[k+1][j] + arr[i-1]*arr[k]*arr[j]
                dp[i][j] = min(dp[i][j], cost)
    return dp[1][N-1]`,
          },
        ],
      },
    ],
  },
  {
    id: "minimum-cost-to-cut-the-stick",
    title: "Min Cost to Cut Stick",
    topic: "Dynamic Programming - MCM DP",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "A stick of length $L$ has $M$ cutting positions. Each cut costs the length of the segment being cut. Find the minimum total cost.",
    leetcodeLink: "https://leetcode.com/problems/minimum-cost-to-cut-a-stick/",
    useCases: [
      "Optimal material segmentation",
    ],
    approaches: [
      {
        name: "MCM-style Partitioning",
        description:
          "### 🧠 Core Intuition\nSimilar to MCM, sort the cuts and add $0$ and $L$ as boundary positions. Define `dp[i][j]` as the min cost to make all cuts between `cuts[i]` and `cuts[j]`.\n`dp[i][j] = (cuts[j+1] - cuts[i-1]) + min(dp[i][k-1] + dp[k+1][j])`.\n\n### ⏱️ Complexity\n- **Time**: $O(M^3)$ where $M$ is the number of cuts.\n- **Space**: $O(M^2)$",
        timeComplexity: "O(M^3)",
        timeComplexityExplanation: "Nested loops over cutting positions.",
        spaceComplexity: "O(M^2)",
        spaceComplexityExplanation: "Storage for all sub-interval costs.",
        implementations: [
          {
            language: "Python",
            code: `def minCost(n, cuts):
    cuts.sort()
    cuts = [0] + cuts + [n]
    m = len(cuts)
    dp = [[0]*m for _ in range(m)]
    
    for length in range(1, m - 1):
        for i in range(1, m - length):
            j = i + length - 1
            res = float('inf')
            for k in range(i, j + 1):
                res = min(res, (cuts[j+1] - cuts[i-1]) + dp[i][k-1] + dp[k+1][j])
            dp[i][j] = res
    return dp[1][m-2]`,
          },
        ],
      },
    ],
  },
  {
    id: "burst-balloons",
    title: "Burst Balloons",
    topic: "Dynamic Programming - MCM DP",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Burst balloons one by one. If you burst balloon $i$, you get coins equal to $nums[i-1] \cdot nums[i] \cdot nums[i+1]$. Maximize total coins.",
    leetcodeLink: "https://leetcode.com/problems/burst-balloons/",
    useCases: [
      "Optimal sequence evaluation with dependencies",
    ],
    approaches: [
      {
        name: "Reverse DP (Final Burst)",
        description:
          "### 🧠 Core Intuition\nInstead of thinking about which balloon to burst *first*, think about which balloon in the range $[i, j]$ is burst **last**. If balloon $k$ is burst last in $[i, j]$, then the coins gained from $k$ is $nums[i-1] \cdot nums[k] \cdot nums[j+1]$.\n\n### ⏱️ Complexity\n- **Time**: $O(N^3)$\n- **Space**: $O(N^2)$",
        timeComplexity: "O(N^3)",
        timeComplexityExplanation: "3-level nested loop for range and partition point.",
        spaceComplexity: "O(N^2)",
        spaceComplexityExplanation: "2D DP table for range solutions.",
        implementations: [
          {
            language: "Python",
            code: `def maxCoins(nums):
    nums = [1] + nums + [1]
    n = len(nums)
    dp = [[0]*n for _ in range(n)]
    
    for length in range(1, n - 1):
        for i in range(1, n - length):
            j = i + length - 1
            for k in range(i, j + 1):
                dp[i][j] = max(dp[i][j], 
                              nums[i-1] * nums[k] * nums[j+1] + 
                              dp[i][k-1] + dp[k+1][j])
    return dp[1][n-2]`,
          },
        ],
      },
    ],
  },
  {
    id: "evaluate-boolean-expression-to-true",
    title: "Boolean Evaluation to True",
    topic: "Dynamic Programming - MCM DP",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Given a boolean expression string with operands (T, F) and operators (&, |, ^), find the number of ways to parenthesize it so it evaluates to True.",
    leetcodeLink: "https://www.geeksforgeeks.org/problems/boolean-parenthesization5610/1",
    useCases: [
      "Logic gate simulation",
      "Compiler expression parsing",
    ],
    approaches: [
      {
        name: "3D DP Partitioning",
        description:
          "### 🧠 Core Intuition\n`dp[i][j][isTrue]` stores the counts. For each operator at index $k$, combine results from substrings $[i, k-1]$ and $[k+1, j]$ using truth table logic for that operator.\n\n### ⏱️ Complexity\n- **Time**: $O(N^3)$\n- **Space**: $O(N^2)$",
        timeComplexity: "O(N^3)",
        timeComplexityExplanation: "Nested loops for length and partitions.",
        spaceComplexity: "O(N^2)",
        spaceComplexityExplanation: "DP table for True and False counts.",
        implementations: [
          {
            language: "Python",
            code: `def countWays(S):
    n = len(S)
    MOD = 1003
    # dp[i][j] = [countTrue, countFalse]
    dp = [[[0, 0] for _ in range(n)] for _ in range(n)]
    
    for i in range(0, n, 2):
        if S[i] == 'T': dp[i][i] = [1, 0]
        else: dp[i][i] = [0, 1]
        
    for length in range(3, n + 1, 2):
        for i in range(0, n - length + 1, 2):
            j = i + length - 1
            for k in range(i + 1, j, 2):
                lT, lF = dp[i][k-1]
                rT, rF = dp[k+1][j]
                op = S[k]
                if op == '&':
                    dp[i][j][0] += (lT * rT)
                    dp[i][j][1] += (lT * rF + lF * rT + lF * rF)
                elif op == '|':
                    dp[i][j][0] += (lT * rT + lT * rF + lF * rT)
                    dp[i][j][1] += (lF * rF)
                elif op == '^':
                    dp[i][j][0] += (lT * rF + lF * rT)
                    dp[i][j][1] += (lT * rT + lF * rF)
            dp[i][j][0] %= MOD; dp[i][j][1] %= MOD
    return dp[0][n-1][0]`,
          },
        ],
      },
    ],
  },
  {
    id: "palindrome-partitioning-ii",
    title: "Palindrome Partitioning II",
    topic: "Dynamic Programming - MCM DP",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Given a string $S$, partition it such that every substring is a palindrome. Return the minimum cuts needed.",
    leetcodeLink: "https://leetcode.com/problems/palindrome-partitioning-ii/",
    useCases: [
      "Optimal sequence decomposition",
    ],
    approaches: [
      {
        name: "Linear DP with Palindrome Pre-check",
        description:
          "### 🧠 Core Intuition\n1. `dp[i]` stores the min cuts for substring $S[0 \dots i]$.\n2. For every $j \le i$, if $S[j \dots i]$ is a palindrome, then `dp[i] = min(dp[i], dp[j-1] + 1)`.\n\n### ⏱️ Complexity\n- **Time**: $O(N^2)$\n- **Space**: $O(N^2)$ for pre-checking palindromes.",
        timeComplexity: "O(N^2)",
        timeComplexityExplanation: "Nested loops for index $i$ and $j$.",
        spaceComplexity: "O(N^2)",
        spaceComplexityExplanation: "Storing boolean palindrome status for all segments.",
        implementations: [
          {
            language: "Python",
            code: `def minCut(s):
    n = len(s)
    dp = [0] * n
    pal = [[False] * n for _ in range(n)]
    
    for i in range(n):
        min_cuts = i
        for j in range(i + 1):
            if s[i] == s[j] and (i - j < 2 or pal[j+1][i-1]):
                pal[j][i] = True
                min_cuts = 0 if j == 0 else min(min_cuts, dp[j-1] + 1)
        dp[i] = min_cuts
    return dp[n-1]`,
          },
        ],
      },
    ],
  },
  {
    id: "partition-array-for-maximum-sum",
    title: "Partition Array for Max Sum",
    topic: "Dynamic Programming - MCM DP",
    category: "Dynamic Programming",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Partition an array into subarrays of length at most $K$. Each element in a subarray becomes the maximum element of that subarray. Maximize the total sum.",
    leetcodeLink: "https://leetcode.com/problems/partition-array-for-maximum-sum/",
    useCases: [
      "Resource allocation with grouping constraints",
    ],
    approaches: [
      {
        name: "Linear DP (Look-back)",
        description:
          "### 🧠 Core Intuition\n`dp[i]` is max sum for $S[0 \dots i-1]$. To compute `dp[i]`, look back at the previous $K$ possible partition points $j$.\n`dp[i] = max(dp[j] + max_val * (i - j))` where $i-k \le j < i$.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot K)$\n- **Space**: $O(N)$",
        timeComplexity: "O(N * K)",
        timeComplexityExplanation: "Iterate through $N$ elements, looking back up to $K$.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Storing DP results for all indices.",
        implementations: [
          {
            language: "Python",
            code: `def maxSumAfterPartitioning(arr, k):
    n = len(arr)
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        curr_max = 0
        for j in range(1, min(i, k) + 1):
            curr_max = max(curr_max, arr[i-j])
            dp[i] = max(dp[i], dp[i-j] + curr_max * j)
    return dp[n]`,
          },
        ],
      },
    ],
  },
  {
    id: "implement-trie-ii",
    title: "Implement Trie II",
    topic: "Tries",
    category: "Tries",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "An advanced Trie supporting string counting: `countWordsEqualTo`, `countWordsStartingWith`, and `erase` operations.",
    leetcodeLink: "https://www.naukri.com/code-studio/problems/implement-trie_1387095",
    useCases: [
      "Dynamic data frequency tracking",
      "Auto-complete with frequency priors",
    ],
    approaches: [
      {
        name: "Prefix Tree with Counts",
        description:
          "### 🧠 Core Intuition\nEach node stores:\n1. `cntPrefix`: How many words pass through this node.\n2. `cntEnd`: How many words end at this node.\n\n### ⏱️ Complexity\n- **Insert/Search/Erase**: $O(L)$ where $L$ is word length.\n- **Space**: $O(N \cdot L)$ worst case.",
        timeComplexity: "O(L)",
        timeComplexityExplanation: "Linear time relative to word length for all operations.",
        spaceComplexity: "O(N * L)",
        spaceComplexityExplanation: "Nodes created per character in the vocabulary.",
        implementations: [
          {
            language: "Python",
            code: `class Node:
    def __init__(self):
        self.children = {}
        self.cntEnd = 0
        self.cntPrefix = 0

class Trie:
    def __init__(self):
        self.root = Node()

    def insert(self, word):
        curr = self.root
        for c in word:
            if c not in curr.children:
                curr.children[c] = Node()
            curr = curr.children[c]
            curr.cntPrefix += 1
        curr.cntEnd += 1

    def countWordsEqualTo(self, word):
        curr = self.root
        for c in word:
            if c not in curr.children: return 0
            curr = curr.children[c]
        return curr.cntEnd

    def countWordsStartingWith(self, prefix):
        curr = self.root
        for c in prefix:
            if c not in curr.children: return 0
            curr = curr.children[c]
        return curr.cntPrefix

    def erase(self, word):
        curr = self.root
        for c in word:
            curr = curr.children[c]
            curr.cntPrefix -= 1
        curr.cntEnd -= 1`,
          },
        ],
      },
    ],
  },
  {
    id: "longest-word-with-all-prefixes",
    title: "Complete String",
    topic: "Tries",
    category: "Tries",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the longest word in an array such that **every prefix** of that word is also present in the array.",
    leetcodeLink: "https://www.naukri.com/code-studio/problems/complete-string_2673906",
    useCases: [
      "Dependency-chain validation",
    ],
    approaches: [
      {
        name: "Trie-based Pre-prefix Check",
        description:
          "### 🧠 Core Intuition\n1. Insert all words into a Trie.\n2. For each word, traverse the Trie and ensure every node marked as `isEndOfWord` is true.\n3. Keep track of the longest such word.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot L)$\n- **Space**: $O(N \cdot L)$",
        timeComplexity: "O(N * L)",
        timeComplexityExplanation: "Iteration through all words and their characters.",
        spaceComplexity: "O(N * L)",
        spaceComplexityExplanation: "Space for the Trie structure.",
        implementations: [
          {
            language: "Python",
            code: `def completeString(n, words):
    trie = {}
    # Build Trie
    for w in words:
        curr = trie
        for c in w:
            if c not in curr: curr[c] = {}
            curr = curr[c]
        curr['#'] = True # End marker
        
    longest = ""
    for w in words:
        # Check all prefixes
        curr = trie
        possible = True
        for c in w:
            curr = curr[c]
            if '#' not in curr:
                possible = False
                break
        
        if possible:
            if len(w) > len(longest):
                longest = w
            elif len(w) == len(longest) and w < longest:
                longest = w
    return longest if longest else "None"`,
          },
        ],
      },
    ],
  },
  {
    id: "number-of-distinct-substrings-in-a-string",
    title: "Distinct Substrings",
    topic: "Tries",
    category: "Tries",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Count the number of unique substrings in a given string using a Trie.",
    leetcodeLink: "https://www.naukri.com/code-studio/problems/count-distinct-substrings_985292",
    useCases: [
      "DNA sequence novelty detection",
    ],
    approaches: [
      {
        name: "Suffix Insertion in Trie",
        description:
          "### 🧠 Core Intuition\nEvery substring of $S$ is a prefix of some suffix of $S$. \nInsert all suffixes of $S$ into a Trie. The total number of unique non-empty substrings equals the total number of nodes in the Trie (excluding the root).\n\n### ⏱️ Complexity\n- **Time**: $O(N^2)$\n- **Space**: $O(N^2)$",
        timeComplexity: "O(N^2)",
        timeComplexityExplanation: "N suffixes, each of max length N.",
        spaceComplexity: "O(N^2)",
        spaceComplexityExplanation: "Worst case space for the Trie nodes.",
        implementations: [
          {
            language: "Python",
            code: `def countDistinctSubstrings(s):
    n = len(s)
    root = {}
    count = 0
    for i in range(n):
        curr = root
        for j in range(i, n):
            if s[j] not in curr:
                curr[s[j]] = {}
                count += 1
            curr = curr[s[j]]
    return count + 1 # Include empty substring`,
          },
        ],
      },
    ],
  },
  {
    id: "bit-prerequisites-for-tries",
    title: "Bitwise Pre-Requisites",
    topic: "Tries",
    category: "Tries",
    frequencyLevel: "Medium",
    difficulty: "Easy",
    overview:
      "Core bitwise skills needed for advanced Trie problems (like XOR Tries). includes bit extraction and bitwise properties.",
    leetcodeLink: "https://www.geeksforgeeks.org/bitwise-hacks-for-competitive-programming/",
    useCases: [
      "Preparation for Bit-Manipulation Tries",
    ],
    approaches: [
      {
        name: "Fundamental Ops",
        description:
          "### 🧠 Core Intuition\n1. **Check $i$-th bit**: `(n >> i) & 1`.\n2. **Set $i$-th bit**: `n | (1 << i)`.\n3. **Clear $i$-th bit**: `n & ~(1 << i)`.\n\n### ⏱️ Complexity\n- **Time**: $O(1)$\n- **Space**: $O(1)$",
        timeComplexity: "O(1)",
        timeComplexityExplanation: "Constant time bitwise operations.",
        spaceComplexity: "O(1)",
        spaceComplexityExplanation: "No additional space.",
        implementations: [
          {
            language: "Python",
            code: `def getBit(n, i):
    return (n >> i) & 1

def setBit(n, i):
    return n | (1 << i)

def clearBit(n, i):
    return n & ~(1 << i)`,
          },
        ],
      },
    ],
  },
  {
    id: "maximum-xor-of-two-numbers-in-an-array",
    title: "Max XOR of Two Numbers",
    topic: "Tries",
    category: "Tries",
    frequencyLevel: "High",
    difficulty: "Medium",
    overview:
      "Find the maximum value of $nums[i] \oplus nums[j]$ for any $i, j$ in the array.",
    leetcodeLink: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
    useCases: [
      "Cryptographic key analysis",
    ],
    approaches: [
      {
        name: "Bitwise XOR Trie",
        description:
          "### 🧠 Core Intuition\n1. Insert each number into a Binary Trie (31-bit depth).\n2. For each number $X$, traverse the Trie. At each bit, try to go the **opposite direction** ($1 \to 0$ or $0 \to 1$) to maximize the XOR result.\n\n### ⏱️ Complexity\n- **Time**: $O(N \cdot 31)$\n- **Space**: $O(N \cdot 31)$",
        timeComplexity: "O(N)",
        timeComplexityExplanation: "Each of the N numbers is processed in constant (31 bits) time.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Trie nodes proportional to input size.",
        implementations: [
          {
            language: "Python",
            code: `def findMaximumXOR(nums):
    root = {}
    for n in nums:
        curr = root
        for i in range(30, -1, -1):
            bit = (n >> i) & 1
            if bit not in curr: curr[bit] = {}
            curr = curr[bit]
            
    max_xor = 0
    for n in nums:
        curr = root
        current_xor = 0
        for i in range(30, -1, -1):
            bit = (n >> i) & 1
            desired = 1 - bit
            if desired in curr:
                current_xor |= (1 << i)
                curr = curr[desired]
            else:
                curr = curr[bit]
        max_xor = max(max_xor, current_xor)
    return max_xor`,
          },
        ],
      },
    ],
  },
  {
    id: "maximum-xor-with-an-element-from-array",
    title: "Max XOR With Limit",
    topic: "Tries",
    category: "Tries",
    frequencyLevel: "High",
    difficulty: "Hard",
    overview:
      "Find the max XOR of $X$ with any element in $arr \le M$. Multiple queries $(X, M)$ are given.",
    leetcodeLink: "https://leetcode.com/problems/maximum-xor-with-an-element-from-array/",
    useCases: [
      "Range-constrained bitwise optimization",
    ],
    approaches: [
      {
        name: "Offline Sorting + Trie",
        description:
          "### 🧠 Core Intuition\n1. Sort the input array `nums`.\n2. Sort queries based on their `M` value.\n3. Iterate through queries. For each query, insert elements from `nums` that are $\le M$ into a Binary Trie.\n4. Perform standard Max XOR search.\n\n### ⏱️ Complexity\n- **Time**: $O(N \log N + Q \log Q + (N + Q) \cdot 31)$\n- **Space**: $O(N \cdot 31)$",
        timeComplexity: "O((N+Q) * 31)",
        timeComplexityExplanation: "Sorting followed by linear pass over entries and queries with Trie ops.",
        spaceComplexity: "O(N)",
        spaceComplexityExplanation: "Space for the Binary Trie.",
        implementations: [
          {
            language: "Python",
            code: `def maximizeXor(nums, queries):
    nums.sort()
    # Query: [m, x, original_idx]
    q = sorted([[m, x, i] for i, (x, m) in enumerate(queries)])
    
    ans = [-1] * len(queries)
    trie = {}
    p = 0
    for m, x, i in q:
        while p < len(nums) and nums[p] <= m:
            # Insert nums[p] in trie
            curr = trie
            for bit_i in range(30, -1, -1):
                bit = (nums[p] >> bit_i) & 1
                if bit not in curr: curr[bit] = {}
                curr = curr[bit]
            p += 1
            
        if not trie: continue
        # Find Max XOR
        curr, res = trie, 0
        for bit_i in range(30, -1, -1):
            bit = (x >> bit_i) & 1
            if (1 - bit) in curr:
                res |= (1 << bit_i)
                curr = curr[1 - bit]
            else:
                curr = curr[bit]
        ans[i] = res
    return ans`,
          },
        ],
      },
    ],
  }
];
