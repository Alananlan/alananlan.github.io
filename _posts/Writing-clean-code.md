---
title: "How I write clean code"
category: "Software Engineering"
date: "05-08-2024"
---
# How to Write Better Code

When we write code, we might find ourselves writing continuously and forgetting coding practices that help us write understandable and maintainable code.

At the end of our brain-throwup session, we might use a linter to check for any syntax errors and run the code through some test suite.
 
But, we often forget that our code may have long lasting legacies outside of the time you spend maintaining it. Writing clean, efficient, and documented code is essential in the modern world of software development. Without some of these practices, we may find ourselves wasting more time trying to understand our code than improving it.

## 1. Stop deep nesting
Never nest more than 3 indentation marks. Here's an example in pseudocode:
```
def function():
    for (condition):
        if (condition):
            if (condition):
                # Do something
            else:
                # Do something
        else:
            # Do something
```
Notice how starting from the function declaration indentation, we reach up to 3 levels of nesting. It may be difficult for readers to immediately discern which level of indentation corresponds to which conditional.

The readability of this code is less than optimal. In cases where this isn't avoidable, try your best to reduce the number of nested statements. Instead of deep nesting conditionals, you could replace them with guard statements instead. Below, I will provide an example of a script that may be simplified using guard statements. **Do not** use this code, it is horrible and only used for proof of concept.

```
def valid_users(users) -> boolean:
    for user in users:
        if username_valid(user.username):
            if password_valid(user.password):
                if user.birthdate < minimum_age():
                    return False
            else:
                return False
        else:
            return False
    
    return True
```

Here's how I would fix it.
```
def valid_users(users) -> boolean:
    for user in users:
        if not username_valid(user.username):
            return False

        if not password_valid(user.password):
            return False

        if user.birthdate < minimum_age():
            return False

    return True
```
In the code above, we apply something called DeMorgan's law which are boolean transformations. In this case, they reverse and shorten our boolean conditions. I think this is much more consise and readable than nesting our if statements together.

<!--> If your function is excessively long, it is crappy. Modularization is key. <-->
## 2. Long function length
If your function is excessively long, it might possibly be better to separate various parts of the code to other functions. Modularization is key. Below I want to provide an example of a ~long~ function that could be modularized. Again, **DO NOT** use this code, because it is awful and contains security risks, it is illustrated for proof of concept.
```
import hashlib
import os
from datetime import date

def create_user(username, password, birthdate):
    current_user = new User()
    current_user.username = username

    salt = os.random(32)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        100000,
    )

    current_user.salt = salt
    current_user.key = key

    if date.today() - date(birthdate) >= 60
        current_user.discount = True
        current_user.age_valid = True
    else if date.today() - date(birthdate) < 18:
        current_user.discount = False
        current_user.age_valid = False
    else:
        current_user.discount = False
        current_user.age_valid = True

    return current_user
```

While this is a moderate and reasonably sized function, some parts could better be modularized and hidden away for the sake of security, modularity, and scalability. Here is what I would do.

```
def create_user(userame, password, birthdate):
    current_user = new User()
    current_user.username = username
    current_user.salt, current_user.key = hash(password)
    current_user.discount, current_user.age_valid = verify_birthdate(birthdate)
    return current_user

def hash(password):
    salt = os.random(32)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        100000,
    )
    return salt, key

def verify_birthdate(birthdate):
    discount, age_valid = False, False

    if date.today() - date(birthdate) >= 60
        discount = True

    else if date.today() - date(birthdate) > 18:
        age_valid = True

    return discount, age_valid
```

<!--> Always check your params before using them <-->
## 3. Always verify your input for validity
Without verifying the validity of any input to a program/function when invoking it, we open ourselves up to a myriad privilege and security risks. 
Examples of this include SQL query injection, cross site scripting (XSS), buffer overflow, path traversal and so on. When we do not use prepared statements and input sanitization for any type of open client input, we open ourselves up to these preventable security vulnerabilities in our code.

<!--> Getter and setter functions help encapsulate private fields and prevent security leaks. <-->
## 4. Getter and setter methods
Getters and setters, also called accessor methods, allow for the seperation of objects and classes, also called encapsulation. This allows for a higher-level abstraction of the underlying code that clients can use without needing to fully understand. Using accessor methods also allow for an easier time debugging our code.

<!--> Avoid global variables. <-->
## 5. Avoiding global variables.
When we use global variables, we open ourselves to security vulnerabilities, permission violations, and namespace issues. 
```
API_KEY = 8132FE62A54022C2AB9C7D817

def function1():
    # uses API_KEY

def function2():
    # uses API_KEY

def function3():
    # uses API_KEY but not supposed to
```

One example is when we attempt to setup database connectivity to our MERN (MongoDB, Express, React, Nodejs) stack application, we might hard code some global values that could be used in many places throughout our project.

Another example may be an API key to some paid service stored at the top of a file called API_KEY. But, when we release our code to the public, or even other colleagues, we establish a security risk from others potentially having access to private resouces or information.

This could be prevented by either limiting the scope in which a variable may be used (not the best solution):
```
def function1():
    API_KEY = 8132FE62A54022C2AB9C7D817

def function2():
    API_KEY = 8132FE62A54022C2AB9C7D817

def function3():
    # cannot use API_KEY because limited scope
```

Creating a class dedicated to accessing private fields (still a bad idea):
```
def function1():
    getAPIKey()

def function2():
    getAPIKey()

def getAPIKey():
    # Does something to get key
```

Creating an environtment (.env) file to store sensitive key information.

```
# Environment variables.
STATUS=production
# Port for development
DEV_PORT=7000
# Port for production
PROD_PORT=8000

# DB CONFIG
HOST=db.host
USER=root
PASSWORD=db.password
DB=db.name
DIALECT=mysql

# API for application
API_KEY = 8132FE62A54022C2AB9C7D817
```

Creating the environment file to store sensitive info may be the best option, as many major codebases and repositories hide the .env file from bad actors, allowing only those you grant access the specific fields.

<!--> Avoid hard-coded values. <-->
## 6. Avoiding hard-coded values.
When we use hard-coded values, at some point, someone is going to need to understand what the value is. In school, they called hard-coded values "magic numbers" because it feels like magic the way the numbers work without explanation. 
```
for (int i = 0; i < 12; i++) {
    j += 16;
}
```
What is i? What is j? 12? 16? A better way of using constants and hard-coded strings is creating a descriptive variable to store the information in, and using that variable in multiple places, instead of the hard coded value.
```
maxTables = 12
maxPeople = 16
numPeople = 0
for (int table = 0; table < maxTables; table++) {
    numPeople += maxPeople;
}
```
Although slightly longer than the previous version, this verion has descriptive variable names that immediately indicate what the numbers mean and how they are used.

<!--> Do not over-comment your code. Good code explains itself. Variable names should be self-explainatory. Although, do realize that good DOCUMENTATION is not just commenting<-->
## 7. Commenting
Writing comments is great for expressing complicated or preexisting obfuscated details. Writing too many comments for code that should explain itself, is bad practice.

```
# Calculate the volume of a cylinder
def c_v(a, b):
    # a = height of the cylinder
    # b = radius of the cylinder
    return a * 3.14159 * (b ** 2)

# Sum the volumes of cylinders with increasing radius
def f_n(n):
    v = 0  # Initialize total volume
    for i in range(1, n+1):
        # i = current height and radius index
        v += c_v(i, i+1)  # Calculate and add cylinder volume
    return v
```

As a coder, if I am reading dense code with variable abbreviations and magic numbers that have no previous definition, I am going to need comments explaining what they do. Otherwise, code like this is already bad code and should be written in a way that is communicable to colleagues without the need of excessive comments.

```
# Function to calculate the volume of a cylinder given its height and radius
def calculate_cylinder_volume(height, radius):
    return height * math.pi * (radius ** 2)

# Function to sum the volumes of cylinders with increasing height and radius
def sum_cylinder_volumes(count):
    total_volume = 0
    for i in range(1, count+1):
        total_volume += calculate_cylinder_volume(i, i+1)
    return total_volume
```

<!--> Figure out your invariants before making decisions <-->
<!-- ## 8. Loops and recursion invariants. -->

<!--> Always lint and test your code. Make sure your tests cover a variety of cases and conditions. <-->
## 8. Linting, testing, and automated workflows.
In any skill or trade, following the best practices is something learned through years of expertise. But in coding, we don't always have to rely on expertise to make our code neat and efficient. 
Linters like ESlint or Pylint checks the code for programming guidelines that a wide range of programmers typically agree upon. Some may argue that a linter is not necessary and having more regulation and standards introduces a new realm of issues - relevant [xkcd ↗](https://xkcd.com/927/) - but following at least some of their practices do tend to lead to better code.

When we write code, we shouldn't just blindly submit to production without placing a set of checks before a release. We want to write tests that cover a breadth of situations the code might fail in. These are some testing **heuristics** for quantifiable values that I tend to follow:

* Base case (0, null, None, etc.)
* Single case (1, leaf_node)
* Small Multiple case (2+, tree_node)
* Big Multiple case (10+, 100+)
* Negative case (-1)

Testing heuristics can be applied to many different situations, and your best bet is to Google which heuristics you should follow when writing a variety of test cases.

Having tests run automatically when deciding to make a commit is also very important. We tend to not test our code as often as we should be. 

Automating our workflow to test code whenever say, we make commits, is a good way of making sure our code continues to function in the way it should whenever we decide to make a change. That said, if we fail to cover a breadth of test spaces (which we either fail to create or overlooked), then even if we test often, it will not amount to enough.

The professors at university always stress the importance of making good, effective tests, and testing your work as soon and as often as possible. In the long run, it saves much more time to test and verify correctness now, than waste days or weeks figuring out which commit might have caused the issue.

## Outro
Thank you for reading everyone, this post took me longer than it should have, but if there are any questions, comments, or concerns, feel free to contact me through the links throughout my page. Happy coding.