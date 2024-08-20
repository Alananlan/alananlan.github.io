---
title: "How I write clean code"
category: "Software Engineering"
date: "05-08-2024"
---
# How I Write Clean Code
When we write code, we might find ourselves writing continuously in a flow-state. At the end of our brain-throwup session, we might use a linter and check for any syntax errors or to follow a style guide, and run the code through some test suite. But, we often forget that our code may have long lasting legacies outside of the time you spend maintaining it. Writing clean, efficient, and documented code is essential in our modern world of software and without some of these practices, we may find ourselves wasting more time trying to understand code than improving the code.

## 1. Stop deep nesting
Never nest more than 3 indentation marks. Here's an example in pseudocode:
```
def function():
    if (condition):
        if (condition):
            if (condition):
                # Do something
        
```
Notice how starting from the function declaration indentation, we reach up to 3 levels of nesting. It may be difficult for readers to immediately discern which level of indentation corresponds to which conditional.

I want to show another example of bad nesting.
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
I have seen code like this everywhere, and in my opinion, the readability is less than optimal. In cases where this isn't avoidable, try your best to reduce the number of nested statements. Instead of deep nesting conditionals, you could replace them with guard statements instead. Below, I will provide an example of a script that may be simplified using guard statements. **Do not** use this code, it is very horrible and only used for proof of concept.

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
In the code above, we apply something called DeMorgan's law, which are essentially boolean transformations. In this case, the laws reverse our boolean conditions, simplifying our code. I think this is much more consise and readable than nesting our if statements together.

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

## Always verify your input parameters for validity

<!--> Getter and setter functions help encapsulate private fields and prevent security leaks. <-->
## 3. Getter and setter methods

<!--> Avoid global variables. <-->
## 4. Avoiding global variables.

<!--> Avoid hard-coded values. <-->
## 5. Avoiding hard-coded values.

<!--> Do not over-comment your code. Good code explains itself. Variable names should be self-explainatory. Although, do realize that good DOCUMENTATION is not just commenting<-->
## 6. Commenting

<!--> Figure out your invariants before making decisions <-->
## 7. Loops and recursion invariants.

<!--> Always lint and test your code. Make sure your tests cover a variety of cases and conditions. <-->
## 8. Linting, testing, and automated workflows.

